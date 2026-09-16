import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile, mkdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createWorkspace } from '../scripts/factory-new.mjs';
import { coldWalk, review, shipGate } from '../scripts/factory-control.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
function git(cwd, ...args) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  return r.stdout.trim();
}

test('cold ICM walk traverses every one-job stage and emits an actionable next step', async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'vibe-hard-gate-'));
  try {
    const target = path.join(tmp, 'project');
    await createWorkspace(
      { name: 'Hard Gate', target, mode: 'brownfield', domain: 'factory', audience: 'owners' },
      root,
    );
    const result = await coldWalk(target);
    assert.equal(result.status, 'PASS', JSON.stringify(result.failures));
    assert.equal(result.visited.length, 9);
    assert.match(result.nextAction, /stages\/00_intake\/CONTEXT\.md/);
    const judge = path.join(target, 'stages', '06_judge', 'CONTEXT.md');
    await writeFile(judge, (await readFile(judge, 'utf8')).replace('One job:', 'Job:'));
    assert.equal((await coldWalk(target)).status, 'HOLD');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});


test('OCR receipt cannot pass on a zero exit without fresh structured output', async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'vibe-ocr-receipt-'));
  try {
    const target = path.join(tmp, 'repo');
    await mkdir(target);
    git(target, 'init');
    git(target, 'config', 'user.email', 'factory@test.invalid');
    git(target, 'config', 'user.name', 'Factory Test');
    await writeFile(path.join(target, 'a'), 'a');
    git(target, 'add', '.');
    git(target, 'commit', '-m', 'base');
    const base = git(target, 'rev-parse', 'HEAD');
    const runner = () => ({ status: 0, stdout: '', stderr: '' });
    const receipt = await review(target, { base, candidate: base, runner });
    assert.equal(receipt.status, 'HOLD');
    assert.equal(receipt.resultFileSha256, null);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('ship gate blocks missing receipts and stale OCR candidate', async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'vibe-ship-gate-'));
  try {
    const target = path.join(tmp, 'repo');
    await mkdir(target);
    git(target, 'init');
    git(target, 'config', 'user.email', 'factory@test.invalid');
    git(target, 'config', 'user.name', 'Factory Test');
    await mkdir(path.join(target, 'docs', 'evidence'), { recursive: true });
    await writeFile(path.join(target, 'a'), 'a');
    git(target, 'add', '.');
    git(target, 'commit', '-m', 'base');
    const base = git(target, 'rev-parse', 'HEAD');
    let result = await shipGate(target, { candidate: base });
    assert.equal(result.status, 'HOLD');
    assert.ok(result.failures.length >= 4);
    const evidence = path.join(target, 'docs', 'evidence');
    await writeFile(
      path.join(evidence, 'ultimate-bug-scan.json'),
      JSON.stringify({ status: 'PASS', candidate: base, scanStatus: 'ok', exitCode: 0, totals: { critical: 0, warning: 0 } }),
    );
    await writeFile(
      path.join(evidence, 'open-code-review.json'),
      JSON.stringify({ status: 'PASS', candidate: '0'.repeat(40) }),
    );
    await writeFile(path.join(evidence, 'icm-cold-walk.json'), JSON.stringify({ status: 'PASS', candidate: base }));
    await writeFile(
      path.join(evidence, 'independent-review.json'),
      JSON.stringify({ status: 'PASS', candidate: base, builderId: 'builder-1', reviewerId: 'reviewer-1' }),
    );
    await writeFile(path.join(evidence, 'judge-verdict.json'), JSON.stringify({ verdict: 'SHIP', candidate: base }));
    result = await shipGate(target, { candidate: base });
    assert.equal(result.status, 'HOLD');
    assert.match(result.failures.join('\n'), /stale/);
    await writeFile(
      path.join(evidence, 'open-code-review.json'),
      JSON.stringify({ status: 'PASS', candidate: base }),
    );
    await writeFile(
      path.join(evidence, 'independent-review.json'),
      JSON.stringify({ status: 'PASS', candidate: base, builderId: 'same', reviewerId: 'same' }),
    );
    result = await shipGate(target, { candidate: base });
    assert.equal(result.status, 'HOLD');
    assert.match(result.failures.join('\n'), /builder cannot be the independent reviewer/);
    await writeFile(
      path.join(evidence, 'independent-review.json'),
      JSON.stringify({ status: 'PASS', candidate: base, builderId: 'builder-1', reviewerId: 'reviewer-1' }),
    );
    await writeFile(
      path.join(evidence, 'ultimate-bug-scan.json'),
      JSON.stringify({ status: 'HOLD', candidate: base, scanStatus: 'partial', exitCode: 2, totals: { critical: 0, warning: 0 } }),
    );
    result = await shipGate(target, { candidate: base });
    assert.equal(result.status, 'HOLD');
    assert.match(result.failures.join('\n'), /Ultimate Bug Scanner/);
    await writeFile(
      path.join(evidence, 'ultimate-bug-scan.json'),
      JSON.stringify({ status: 'PASS', candidate: base, scanStatus: 'ok', exitCode: 0, totals: { critical: 0, warning: 0 } }),
    );
    result = await shipGate(target, { candidate: base });
    assert.equal(result.status, 'SHIP');
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
});

test('Claude and Codex plugin releases point at the same Vibe core version', async () => {
  const pkg = JSON.parse(await readFile(path.join(root, 'package.json')));
  const claude = JSON.parse(await readFile(path.join(root, '.claude-plugin', 'plugin.json')));
  const codex = JSON.parse(
    await readFile(path.join(root, '.agents', 'plugins', 'marketplace.json')),
  );
  assert.equal(pkg.version, claude.version);
  assert.equal(codex.plugins[0].source.path, './plugins/vibe-engineering');
});
