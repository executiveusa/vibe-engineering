import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '..');
const createScript = path.join(repoRoot, 'scripts', 'factory-new.mjs');
const doctorScript = path.join(repoRoot, 'scripts', 'factory-doctor.mjs');

function run(script, args) {
  return spawnSync(process.execPath, [script, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
  });
}

async function mutateAndExpectBlocked(target, relativePath, mutate, expected) {
  const absolutePath = path.join(target, relativePath);
  const original = await readFile(absolutePath, 'utf8');
  await writeFile(absolutePath, mutate(original), 'utf8');
  const result = run(doctorScript, [target]);
  assert.notEqual(result.status, 0, `${relativePath} weakening should block Doctor`);
  assert.match(result.stderr, expected);
  await writeFile(absolutePath, original, 'utf8');
}

test('Factory Doctor enforces the canonical engineering workflow and release boundaries', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'vibe-workflow-enforcement-'));
  const target = path.join(tempRoot, 'factory-policy-proof');

  try {
    const created = run(createScript, [
      '--name', 'Factory Policy Proof',
      '--target', target,
      '--mode', 'greenfield',
      '--domain', 'software factory',
      '--audience', 'product owners',
    ]);
    assert.equal(created.status, 0, created.stderr);
    assert.match(created.stdout, /Factory Doctor: PASS/);

    const baseline = run(doctorScript, [target]);
    assert.equal(baseline.status, 0, baseline.stderr);
    assert.match(baseline.stdout, /mandatory engineering workflow verified/i);

    const workflowPath = path.join(target, 'references', 'ENGINEERING-WORKFLOW.md');
    const workflow = await readFile(workflowPath, 'utf8');
    await unlink(workflowPath);
    const missingWorkflow = run(doctorScript, [target]);
    assert.notEqual(missingWorkflow.status, 0);
    assert.match(missingWorkflow.stderr, /Missing required file: references\/ENGINEERING-WORKFLOW\.md/);
    await writeFile(workflowPath, workflow, 'utf8');

    await mutateAndExpectBlocked(
      target,
      'references/ENGINEERING-WORKFLOW.md',
      (content) => content.replace('executiveusa/pauli-agent-skills-2026', 'example/optional-skills'),
      /canonical Agent Skills source/,
    );

    await mutateAndExpectBlocked(
      target,
      'references/ENGINEERING-WORKFLOW.md',
      (content) => content.replace('`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`', '`BUILD → SHIP`'),
      /engineering lifecycle/,
    );

    await mutateAndExpectBlocked(
      target,
      'references/ENGINEERING-WORKFLOW.md',
      (content) => content.replace('8. confirm the approved specification;', '8. implementation may begin without a specification;'),
      /specification gate/,
    );

    await mutateAndExpectBlocked(
      target,
      'stages/03_build/CONTEXT.md',
      (content) => content.replace('- Layer 3: `../../references/ENGINEERING-WORKFLOW.md`.\n', ''),
      /workflow reference/,
    );

    await mutateAndExpectBlocked(
      target,
      'stages/04_verify/CONTEXT.md',
      (content) => content.replace('Passing CI or a production build is evidence for those checks only; it is not live-production proof.', 'Passing CI is enough to claim production success.'),
      /live-production proof boundary/,
    );

    await mutateAndExpectBlocked(
      target,
      'RUNBOOK.md',
      (content) => content.replace('## Recovery and rollback', '## Recovery'),
      /rollback section/,
    );

    await mutateAndExpectBlocked(
      target,
      'AGENTS.md',
      (content) => content.replace('- The builder cannot approve its own work.\n', ''),
      /release authority separation/,
    );
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
