import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { assertIndependentJudge, evaluateReceipt, modelFamily } from '../factory/judge-receipt.mjs';
import { gate } from '../scripts/merge-gate.mjs';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const shipReceipt = (overrides = {}) => ({
  decision: 'SHIP',
  score: 90,
  consequence_level: 'MEDIUM',
  p0_remaining: 0,
  p1_remaining: 0,
  checks: {
    specification: 'PASS',
    build: 'PASS',
    tests: 'PASS',
    security: 'PASS',
    user_journey: 'PASS',
    deployment_config: 'PASS',
    ownership: 'PASS',
    rollback: 'PASS',
    evidence: 'PASS',
    motion_audit: 'N/A',
    prompt_injection: 'PASS',
    system_impact: 'N/A',
  },
  ...overrides,
});

test('a SHIP receipt only counts when the numbers behind it agree', () => {
  assert.equal(evaluateReceipt(shipReceipt()).decision, 'SHIP');
  assert.equal(evaluateReceipt(shipReceipt({ score: 84 })).decision, 'HOLD');
  assert.equal(evaluateReceipt(shipReceipt({ p1_remaining: 1 })).decision, 'HOLD');
  assert.equal(evaluateReceipt(shipReceipt({ decision: 'HOLD' })).decision, 'HOLD');
  assert.equal(evaluateReceipt(shipReceipt({ consequence_level: 'TRIVIAL' })).decision, 'HOLD');
  assert.equal(
    evaluateReceipt(shipReceipt({ checks: { ...shipReceipt().checks, tests: 'N/A' } })).decision,
    'HOLD',
  );
  // HIGH needs the Future-State Test, so system_impact cannot be N/A.
  assert.equal(evaluateReceipt(shipReceipt({ consequence_level: 'HIGH' })).decision, 'HOLD');
  assert.equal(evaluateReceipt(null).decision, 'HOLD');
  assert.equal(evaluateReceipt('unparseable').decision, 'HOLD');
});

test('the Judge must come from a different model family than the builder', () => {
  assert.doesNotThrow(() => assertIndependentJudge('openai', 'anthropic'));
  assert.throws(() => assertIndependentJudge('openai', 'openai'));
  assert.throws(() => assertIndependentJudge('openai', undefined));
  assert.equal(modelFamily('openrouter/qwen/qwen3.8-27b:free'), 'qwen');
  assert.equal(modelFamily('openrouter/google/gemma-4-31b-it:free'), 'google');
  assert.equal(modelFamily('gpt-5.4'), 'openai');
  assert.equal(modelFamily('opus'), 'anthropic');
  // Two free-lane overrides from the same family must still be rejected.
  assert.throws(() =>
    assertIndependentJudge(
      modelFamily('openrouter/qwen/builder:free'),
      modelFamily('openrouter/qwen/judge:free'),
    ),
  );
});

test('merge gate: receipt required, must be current, HIGH needs an independent approval', () => {
  assert.equal(gate({ receipt: null, changedAfterReceipt: [], approvals: 0 }).pass, false);
  assert.equal(gate({ receipt: shipReceipt(), changedAfterReceipt: [], approvals: 0 }).pass, true);
  assert.equal(
    gate({ receipt: shipReceipt(), changedAfterReceipt: ['docs/evidence/notes.md'], approvals: 0 })
      .pass,
    true,
  );
  const stale = gate({ receipt: shipReceipt(), changedAfterReceipt: ['src/app.js'], approvals: 0 });
  assert.equal(stale.pass, false);
  assert.match(stale.reasons.join(), /re-run the Judge/);
  const high = shipReceipt({
    consequence_level: 'HIGH',
    checks: { ...shipReceipt().checks, system_impact: 'PASS' },
  });
  assert.equal(gate({ receipt: high, changedAfterReceipt: [], approvals: 0 }).pass, false);
  assert.equal(gate({ receipt: high, changedAfterReceipt: [], approvals: 1 }).pass, true);
});

test('merge gate CLI reads the committed receipt and refuses code changed after it', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'vibe-gate-'));
  const run = (cmd, args) => spawnSync(cmd, args, { cwd: dir, encoding: 'utf8' });
  const gitc = (...args) =>
    assert.equal(run('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...args]).status, 0);
  const script = path.join(repoRoot, 'scripts', 'merge-gate.mjs');
  try {
    gitc('init', '-q');
    writeFileSync(path.join(dir, 'app.js'), '1');
    gitc('add', '.');
    gitc('commit', '-qm', 'app');
    assert.equal(run(process.execPath, [script]).status, 1, 'no receipt is HOLD');

    const receipt = path.join(dir, 'docs', 'evidence', 'production-readiness-judge.json');
    spawnSync('mkdir', ['-p', path.dirname(receipt)]);
    writeFileSync(receipt, JSON.stringify(shipReceipt()));
    gitc('add', '.');
    gitc('commit', '-qm', 'judge');
    assert.equal(run(process.execPath, [script]).status, 0, run(process.execPath, [script]).stdout);

    writeFileSync(path.join(dir, 'app.js'), '2');
    gitc('commit', '-qam', 'sneaky change after the Judge');
    const after = run(process.execPath, [script]);
    assert.equal(after.status, 1);
    assert.match(after.stdout, /app\.js/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('protect-main.sh is a dry run by default and builds the protection from green checks', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'vibe-protect-'));
  const log = path.join(dir, 'gh.log');
  const fakeGh = path.join(dir, 'gh');
  writeFileSync(
    fakeGh,
    `#!/usr/bin/env bash
echo "$*" >> ${JSON.stringify(log)}
case "$*" in
  *"--jq .default_branch"*) echo main ;;
  *check-runs*) printf 'test\\nlint\\n' ;;
  *"/status"*) echo 'ci/vercel' ;;
esac
`,
  );
  chmodSync(fakeGh, 0o755);
  const env = { ...process.env, PATH: `${dir}:${process.env.PATH}` };
  const script = path.join(repoRoot, 'scripts', 'protect-main.sh');
  try {
    const dry = spawnSync('bash', [script, 'owner/repo'], { encoding: 'utf8', env });
    assert.equal(dry.status, 0, dry.stderr);
    assert.match(dry.stdout, /dry run/);
    assert.match(dry.stdout, /required check: lint/);
    assert.match(dry.stdout, /"enforce_admins": true/);
    assert.doesNotMatch(readFileSync(log, 'utf8'), /-X PUT/);

    const review = spawnSync('bash', [script, '--mode', 'review', 'owner/repo'], {
      encoding: 'utf8',
      env,
    });
    assert.match(review.stdout, /required check: vibe \/ vibe-merge-gate/);
    assert.match(review.stdout, /"required_approving_review_count": 1/);

    const applied = spawnSync('bash', [script, '--apply', '--checks', 'build', 'owner/repo'], {
      encoding: 'utf8',
      env,
    });
    assert.equal(applied.status, 0, applied.stderr);
    assert.match(
      readFileSync(log, 'utf8'),
      /-X PUT repos\/owner\/repo\/branches\/main\/protection/,
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('nightly factory: agents get model keys only, actions are SHA-pinned, Judge is independent', () => {
  const workflow = readFileSync(
    path.join(repoRoot, '.github/workflows/nightly-production-readiness.yml'),
    'utf8',
  );
  const factoryStep = workflow.slice(
    workflow.indexOf('- id: factory'),
    workflow.indexOf('- name: Open pull request'),
  );
  assert.doesNotMatch(factoryStep, /GH_TOKEN|FLEET_GITHUB_TOKEN|GITHUB_TOKEN/);
  assert.match(factoryStep, /ANTHROPIC_API_KEY/);
  for (const file of ['nightly-production-readiness.yml', 'vibe-merge-gate.yml']) {
    const text = readFileSync(path.join(repoRoot, '.github/workflows', file), 'utf8');
    for (const [, ref] of text.matchAll(/uses:\s*actions\/[\w-]+@(\S+)/g)) {
      assert.match(ref, /^[0-9a-f]{40}$/, `${file}: actions must be pinned to a commit SHA`);
    }
  }
  const runner = readFileSync(path.join(repoRoot, 'factory/run-readiness-sandcastle.mts'), 'utf8');
  const judgeRun = runner.slice(runner.indexOf('name: "reviewer-judge"'));
  // judgeAgent("judge") resolves to judge() outside the dry lane; the dry lane
  // substitution is wired through builderAgent/judgeAgent and skips nothing else.
  assert.match(judgeRun, /agent: judgeAgent\("judge"\)/);
  assert.match(runner, /const judgeAgent = .*lane === "dry" \? dryAgent\(stage\) : judge\(\)/);
  assert.match(runner, /if \(lane !== "dry"\) \{\s*assertIndependentJudge/);
  assert.match(runner, /sandcastle\.claudeCode\(/);
  assert.match(runner, /AbortSignal\.timeout/);
});

// --- Dry lane: a dry run must never be able to SHIP (Phase 0) ---
// The dry lane calls no model. Its receipt is HOLD by construction, and even a
// tampered SHIP copy still fails the numeric gates. Both the receipt evaluator
// and the merge gate must refuse it.

import { dryReceipt } from '../factory/dry-receipt.mjs';

test('the dry-lane receipt is always HOLD, even when tampered toward SHIP', () => {
  const receipt = dryReceipt('deadbeef'.repeat(5));
  const verdict = evaluateReceipt(receipt);
  assert.equal(verdict.decision, 'HOLD');
  assert.ok(verdict.reasons.length > 0);
  assert.ok(receipt.required_actions.includes('dry lane: no model ran'));
  // Tampered copies still fail: the numbers behind a SHIP never agree.
  assert.equal(evaluateReceipt({ ...receipt, decision: 'SHIP' }).decision, 'HOLD');
  assert.equal(evaluateReceipt({ ...receipt, decision: 'SHIP', score: 100, p0_remaining: 0, p1_remaining: 0 }).decision, 'HOLD');
});

test('the merge gate refuses a dry-lane receipt regardless of approvals', () => {
  const receipt = dryReceipt('deadbeef'.repeat(5));
  for (const approvals of [0, 1, 99]) {
    const result = gate({ receipt, changedAfterReceipt: [], approvals });
    assert.equal(result.pass, false);
  }
  // Even with a tampered SHIP decision the gate still refuses.
  assert.equal(
    gate({ receipt: { ...receipt, decision: 'SHIP' }, changedAfterReceipt: [], approvals: 99 }).pass,
    false,
  );
});

test('the dry agent stages behave deterministically in a scratch repo', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'dry-agent-'));
  try {
    const run = (cmd, env = {}) =>
      spawnSync(cmd[0], cmd.slice(1), {
        cwd: dir,
        env: { ...process.env, ...env },
        encoding: 'utf8',
      });
    assert.equal(run(['git', 'init', '-q']).status, 0);
    assert.equal(run(['git', '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'init']).status, 0);
    const dryRun = path.join(repoRoot, 'factory', 'dry-agent-run.mjs');
    // The sandbox copy layout puts dry-receipt.mjs next to dry-agent-run.mjs.
    spawnSync('cp', [dryRun, path.join(dir, 'dry-agent-run.mjs')]);
    spawnSync('cp', [path.join(repoRoot, 'factory', 'dry-receipt.mjs'), path.join(dir, 'dry-receipt.mjs')]);
    for (const stage of ['auditor', 'prd']) {
      const r = run(['node', 'dry-agent-run.mjs'], { VIBE_DRY_STAGE: stage });
      assert.equal(r.status, 0, r.stderr);
      assert.ok(readFileSync(path.join(dir, 'docs', 'evidence', 'dry', `${stage}.md`), 'utf8').includes('No model ran'));
    }
    const b = run(['node', 'dry-agent-run.mjs'], { VIBE_DRY_STAGE: 'builder' });
    assert.equal(b.status, 0, b.stderr);
    assert.ok(run(['git', 'rev-list', '--count', 'HEAD']).stdout.trim(), '2');
    const j = run(['node', 'dry-agent-run.mjs'], { VIBE_DRY_STAGE: 'judge' });
    assert.equal(j.status, 0, j.stderr);
    const receipt = JSON.parse(readFileSync(path.join(dir, 'docs', 'evidence', 'production-readiness-judge.json'), 'utf8'));
    assert.equal(evaluateReceipt(receipt).decision, 'HOLD');
    const bad = run(['node', 'dry-agent-run.mjs'], { VIBE_DRY_STAGE: 'sneaky' });
    assert.notEqual(bad.status, 0);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
