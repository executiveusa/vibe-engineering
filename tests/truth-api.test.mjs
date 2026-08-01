import test from 'node:test';
import assert from 'node:assert/strict';
import { compileArtifacts } from '../src/truth/compiler.mjs';
import { createTruthApi } from '../src/truth/api.mjs';

const artifacts = [
  { id: 'constitution.test', kind: 'constitution', version: '1.0.0', status: 'approved', precedence: 1000, title: 'Constitution', sourcePath: 'test', summary: 'test', laws: [{ id: 'verify', text: 'Verify.' }] },
  { id: 'workflow.test', kind: 'workflow', version: '1.0.0', status: 'approved', precedence: 600, title: 'Workflow', sourcePath: 'test', summary: 'test', stages: ['inspect', 'build', 'verify'], limits: { meaningfulRepairAttempts: 5 }, proof: ['tests'], rollback: { type: 'git-revert' } },
  { id: 'policy.vibe-score-release', kind: 'policy', version: '1.0.0', status: 'approved', precedence: 800, title: 'Release', sourcePath: 'test', summary: 'test', rules: { floor: 8.5 } },
];

const api = createTruthApi(compileArtifacts(artifacts, { sourceCommit: 'abc123' }));

test('manifest exposes pinned bundle and approved artifacts', () => {
  const response = api.manifest();
  assert.equal(response.status, 200);
  assert.equal(response.body.sourceCommit, 'abc123');
  assert.equal(response.body.artifacts.length, 3);
});

test('unknown truth returns stable 404 error', () => {
  const response = api.truth('missing');
  assert.deepEqual(response.body, { error: 'TRUTH_NOT_FOUND', id: 'missing' });
  assert.equal(response.status, 404);
});

test('context endpoint returns the same bundle hash', () => {
  const manifest = api.manifest();
  const resolved = api.resolve({ task: { consequenceLevel: 'low' } });
  assert.equal(resolved.status, 200);
  assert.equal(resolved.body.truth.bundleHash, manifest.body.bundleHash);
});
