import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, readdir, rm, unlink, writeFile } from 'node:fs/promises';
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
      '--name', 'Neighborhood "Health" Guide',
      '--target', target,
      '--mode', 'greenfield',
      '--domain', 'health and ecology',
      '--audience', 'urban youth and seniors',
    ]);
    assert.equal(created.status, 0, created.stderr);
    assert.match(created.stdout, /Factory Doctor: PASS/);
    assert.match(created.stdout, /Next stage: stages\/00_intake\/CONTEXT.md/);

    await access(path.join(target, 'stages', '04_verify', 'output', '.gitkeep'));
    const projectYaml = await readFile(path.join(target, 'PROJECT.yaml'), 'utf8');
    assert.match(projectYaml, /name: "Neighborhood \\"Health\\" Guide"/);

    const verified = run(doctorScript, [target]);
    assert.equal(verified.status, 0, verified.stderr);
    assert.match(verified.stdout, /Vibe Factory Doctor: PASS/);

    const projectControlPath = path.join(target, 'PROJECT.yaml');
    const originalProjectControl = await readFile(projectControlPath, 'utf8');
    await writeFile(
      projectControlPath,
      originalProjectControl.replace('  status: discovery', '  status: structure_ready'),
      'utf8',
    );
    const invalidProjectStatus = run(doctorScript, [target]);
    assert.notEqual(invalidProjectStatus.status, 0);
    assert.match(invalidProjectStatus.stderr, /unsupported project.status: structure_ready/);
    await writeFile(projectControlPath, originalProjectControl, 'utf8');

    const securityPath = path.join(target, 'SECURITY.md');
    const originalSecurity = await readFile(securityPath, 'utf8');
    await unlink(securityPath);
    const missingSecurity = run(doctorScript, [target]);
    assert.notEqual(missingSecurity.status, 0);
    assert.match(missingSecurity.stderr, /Missing required file: SECURITY.md/);
    await writeFile(securityPath, originalSecurity, 'utf8');

    const statePath = path.join(target, '.factory', 'state.json');
    const originalState = await readFile(statePath, 'utf8');
    await writeFile(statePath, '{not-valid-json', 'utf8');
    const malformedState = run(doctorScript, [target]);
    assert.notEqual(malformedState.status, 0);
    assert.match(malformedState.stderr, /Invalid JSON in \.factory\/state.json/);

    await writeFile(statePath, `${JSON.stringify({
      schemaVersion: 2,
      project: { name: 'Neighborhood Health Guide', slug: 'neighborhood-health-guide' },
    })}\n`, 'utf8');
    const unsupportedState = run(doctorScript, [target]);
    assert.notEqual(unsupportedState.status, 0);
    assert.match(unsupportedState.stderr, /Unsupported factory state schema version: 2/);
    await writeFile(statePath, originalState, 'utf8');

    const visionPath = path.join(target, 'stages', '01_vision', 'CONTEXT.md');
    const originalVision = await readFile(visionPath, 'utf8');
    await writeFile(
      visionPath,
      originalVision.replace(/^## Inputs$/m, 'This sentence mentions ## Inputs but is not a heading.'),
      'utf8',
    );
    const unanchoredHeading = run(doctorScript, [target]);
    assert.notEqual(unanchoredHeading.status, 0);
    assert.match(unanchoredHeading.stderr, /Stage 01_vision is missing section: ## Inputs/);
    await writeFile(visionPath, originalVision, 'utf8');

    await unlink(path.join(target, 'references', 'README.md'));
    const missingReferences = run(doctorScript, [target]);
    assert.notEqual(missingReferences.status, 0);
    assert.match(missingReferences.stderr, /Missing required file: references\/README.md/);
    await writeFile(path.join(target, 'references', 'README.md'), '# Project references\n', 'utf8');

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
