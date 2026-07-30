import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readdir, rm, unlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createWorkspace } from '../scripts/factory-new.mjs';

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

test('one-click factory creates and validates an ICM workspace safely', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'vibe-factory-'));
  const target = path.join(tempRoot, 'neighborhood-health-guide');

  try {
    const created = run(createScript, [
      '--name', 'Neighborhood Health Guide',
      '--target', target,
      '--mode', 'greenfield',
      '--domain', 'health and ecology',
      '--audience', 'urban youth and seniors',
    ]);
    assert.equal(created.status, 0, created.stderr);
    assert.match(created.stdout, /Factory Doctor: PASS/);
    assert.match(created.stdout, /Next stage: stages\/00_intake\/CONTEXT.md/);

    await access(path.join(target, 'stages', '04_verify', 'output', '.gitkeep'));

    const verified = run(doctorScript, [target]);
    assert.equal(verified.status, 0, verified.stderr);
    assert.match(verified.stdout, /Vibe Factory Doctor: PASS/);

    const overwriteAttempt = run(createScript, [
      '--name', 'Neighborhood Health Guide',
      '--target', target,
    ]);
    assert.notEqual(overwriteAttempt.status, 0);
    assert.match(overwriteAttempt.stderr, /Refusing to overwrite non-empty target/);

    await unlink(path.join(target, 'stages', '04_verify', 'CONTEXT.md'));
    const broken = run(doctorScript, [target]);
    assert.notEqual(broken.status, 0);
    assert.match(broken.stderr, /Missing stage contract: stages\/04_verify\/CONTEXT.md/);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test('failed scaffold is transactional and preserves an existing empty target', async () => {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'vibe-factory-transaction-'));
  const target = path.join(tempRoot, 'empty-target');
  const brokenSource = path.join(tempRoot, 'missing-source');

  try {
    await mkdir(target, { recursive: true });
    await assert.rejects(
      createWorkspace({
        name: 'Broken Factory Example',
        target,
        mode: 'greenfield',
        domain: 'science',
        audience: 'urban youth and seniors',
      }, brokenSource),
    );
    assert.deepEqual(await readdir(target), []);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});
