import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const selector = path.join(repoRoot, 'scripts', 'select-nightly-vercel-batch.mjs');
const stub = path.join(repoRoot, 'tests', 'helpers', 'stub-fetch.mjs');

function runSelector(env) {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'selector-test-'));
  const output = path.join(dir, 'github_output');
  const summary = path.join(dir, 'github_summary');
  const result = spawnSync('node', ['--import', stub, selector], {
    cwd: repoRoot,
    env: {
      ...process.env,
      VERCEL_TOKEN: '',
      VERCEL_TEAM_ID: '',
      TARGET_REPOSITORY_IN: '',
      TARGET_BRANCH_IN: '',
      FACTORY_TARGETS_FILE: '',
      STUB_FETCH_JSON: '',
      GITHUB_OUTPUT: output,
      GITHUB_STEP_SUMMARY: summary,
      ...env,
    },
    encoding: 'utf8',
  });
  const read = (f) => { try { return readFileSync(f, 'utf8'); } catch { return ''; } };
  const out = { status: result.status, stdout: result.stdout, stderr: result.stderr, output: read(output), summary: read(summary) };
  rmSync(dir, { recursive: true, force: true });
  return out;
}

function parseOutput(text) {
  const matrix = text.match(/^matrix=(.*)$/m)?.[1];
  const hasTargets = text.match(/^has_targets=(.*)$/m)?.[1];
  return { include: matrix ? JSON.parse(matrix).include : null, hasTargets };
}

test('branch 1: TARGET_REPOSITORY_IN produces one manual target', () => {
  const r = runSelector({ TARGET_REPOSITORY_IN: 'executiveusa/foundry-computer', TARGET_BRANCH_IN: 'main' });
  assert.equal(r.status, 0, r.stderr);
  const { include, hasTargets } = parseOutput(r.output);
  assert.equal(hasTargets, 'true');
  assert.equal(include.length, 1);
  assert.equal(include[0].repository, 'executiveusa/foundry-computer');
  assert.equal(include[0].state, 'MANUAL');
});

test('branch 2: VERCEL_TOKEN keeps the existing Vercel batch selection', () => {
  const payload = {
    projects: [
      { name: 'beta-app', link: { org: 'executiveusa', repo: 'beta', productionBranch: 'main' }, latestDeployments: [{ readyState: 'READY' }] },
      { name: 'alpha-app', link: { org: 'executiveusa', repo: 'alpha', productionBranch: 'main' }, latestDeployments: [{ readyState: 'ERROR' }] },
    ],
    pagination: {},
  };
  const r = runSelector({ VERCEL_TOKEN: 'stub-token', STUB_FETCH_JSON: JSON.stringify(payload) });
  assert.equal(r.status, 0, r.stderr);
  const { include, hasTargets } = parseOutput(r.output);
  assert.equal(hasTargets, 'true');
  assert.ok(include.length >= 1);
  // ERROR state ranks ahead of READY.
  assert.equal(include[0].repository, 'executiveusa/alpha');
});

test('branch 3: without a Vercel token, factory/targets.json drives selection', () => {
  const r = runSelector({ FACTORY_TARGETS_FILE: 'factory/targets.json' });
  assert.equal(r.status, 0, r.stderr);
  const { include, hasTargets } = parseOutput(r.output);
  assert.equal(hasTargets, 'true');
  assert.equal(include.length, 1);
  assert.equal(include[0].repository, 'executiveusa/foundry-computer');
  assert.equal(include[0].state, 'CONFIG');
});

test('branch 4: no config anywhere is a visible notice, exit 0, has_targets=false', () => {
  const r = runSelector({ FACTORY_TARGETS_FILE: 'factory/does-not-exist.json' });
  assert.equal(r.status, 0, r.stderr);
  const { include, hasTargets } = parseOutput(r.output);
  assert.equal(hasTargets, 'false');
  assert.deepEqual(include, []);
  assert.match(r.summary, /No factory targets configured/);
});
