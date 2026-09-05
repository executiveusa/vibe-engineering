import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { installVibe } from '../scripts/install-vibe.mjs';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function withTempProject(fn) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'vibe-install-'));
  try {
    await fn(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('installs the canonical filesystem entry, global House law, and agent adapters', async () => {
  await withTempProject(async (root) => {
    const report = await installVibe({ target: root, skills: false }, repoRoot);
    assert.equal(report.target, root);
    assert.equal(report.skills, false);

    const agents = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
    const icmr = await readFile(path.join(root, 'ICMR.yaml'), 'utf8');
    const context = await readFile(path.join(root, 'CONTEXT.md'), 'utf8');
    const houseStandard = await readFile(path.join(root, '.vibe/VIBE_HOUSE_STANDARD.md'), 'utf8');
    const claude = await readFile(path.join(root, 'CLAUDE.md'), 'utf8');
    const codex = await readFile(path.join(root, '.vibe/CODEX.md'), 'utf8');
    const stageSystem = await readFile(path.join(root, '.vibe/stage-system.yaml'), 'utf8');
    const cursor = await readFile(path.join(root, '.cursor/rules/vibe.mdc'), 'utf8');
    const manifest = JSON.parse(await readFile(path.join(root, '.vibe/manifest.json'), 'utf8'));

    assert.match(agents, /Verify It Before Everything/);
    assert.match(agents, /No agent soup\. One walkable system/);
    assert.match(agents, /VIBE_HOUSE_STANDARD\.md/);
    assert.match(agents, /INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE/);
    assert.match(icmr, /INTENT/);
    assert.match(icmr, /OPERATE/);
    assert.match(icmr, /VIBE_HOUSE_STANDARD\.md/);
    assert.match(context, /Vibe House is installed/);
    assert.match(context, /VIBE_HOUSE_STANDARD\.md/);
    assert.match(houseStandard, /Layer 3 global operating doctrine/);
    assert.match(houseStandard, /BUILT ≠ VERIFIED/);
    assert.match(houseStandard, /HEART_AND_SOUL_STANDARD\.md/);
    assert.match(claude, /VIBE_HOUSE_STANDARD\.md/);
    assert.match(codex, /VIBE_HOUSE_STANDARD\.md/);
    assert.match(stageSystem, /id: intent/);
    assert.match(stageSystem, /id: judge/);
    assert.match(cursor, /alwaysApply: true/);
    assert.deepEqual(manifest.canonicalEntry, ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md', '.vibe/VIBE_HOUSE_STANDARD.md']);
    assert.equal(manifest.houseStandard, '.vibe/VIBE_HOUSE_STANDARD.md');
    assert.equal(manifest.houseSkill, '.vibe/skills/vibe-engineering/SKILL.md');
    assert.deepEqual(manifest.lifecycle, ['INTENT', 'SPEC', 'PLAN', 'BUILD', 'PROOF', 'COUNCIL', 'JUDGE', 'SHIP', 'OPERATE']);
    assert.ok(manifest.adapters.includes('codex'));
    assert.ok(manifest.adapters.includes('opencode'));
  });
});

test('preserves existing project law unless force is explicit while still installing global House law', async () => {
  await withTempProject(async (root) => {
    await writeFile(path.join(root, 'AGENTS.md'), '# Existing project law\n', 'utf8');
    const report = await installVibe({ target: root, skills: false }, repoRoot);
    assert.ok(report.skipped.includes('AGENTS.md'));
    assert.equal(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), '# Existing project law\n');
    assert.match(await readFile(path.join(root, '.vibe/VIBE_HOUSE_STANDARD.md'), 'utf8'), /Canonical upstream/);
    assert.match(await readFile(path.join(root, '.vibe/INSTALL-NOTES.md'), 'utf8'), /VIBE_HOUSE_STANDARD\.md/);

    await installVibe({ target: root, force: true, skills: false }, repoRoot);
    assert.match(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), /Verify It Before Everything/);
  });
});

test('installs portable skills under the Vibe namespace with one house router', async () => {
  await withTempProject(async (root) => {
    const report = await installVibe({ target: root, skills: true }, repoRoot);
    assert.equal(report.skills, true);
    const houseSkill = await readFile(path.join(root, '.vibe/skills/vibe-engineering/SKILL.md'), 'utf8');
    const proofSkill = await readFile(path.join(root, '.vibe/skills/proof/SKILL.md'), 'utf8');
    const houseStandard = await readFile(path.join(root, '.vibe/VIBE_HOUSE_STANDARD.md'), 'utf8');
    assert.match(houseSkill, /canonical router/i);
    assert.match(houseSkill, /INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE/);
    assert.match(houseStandard, /One architecture/);
    assert.match(proofSkill, /proof/i);
  });
});

test('vibe install CLI creates a usable project contract', async () => {
  await withTempProject(async (root) => {
    const { stdout } = await execFileAsync(process.execPath, [
      path.join(repoRoot, 'scripts/vibe.mjs'),
      'install',
      root,
      '--no-skills',
    ], { cwd: repoRoot });

    const result = JSON.parse(stdout);
    assert.equal(result.ok, true);
    assert.equal(result.target, root);
    assert.equal(result.skillsInstalled, false);
    assert.match(result.next, /Verify It Before Everything/);
    assert.match(await readFile(path.join(root, 'AGENTS.md'), 'utf8'), /filesystem is the source of truth/);
    assert.match(await readFile(path.join(root, '.vibe/VIBE_HOUSE_STANDARD.md'), 'utf8'), /INTENT → SPEC → PLAN → BUILD/);
  });
});
