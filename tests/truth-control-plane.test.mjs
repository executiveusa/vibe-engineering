import test from 'node:test';
import assert from 'node:assert/strict';
import { compileArtifacts, validateArtifact } from '../src/truth/compiler.mjs';
import { resolveContext } from '../src/truth/context-resolver.mjs';

const artifacts = [
  {
    id: 'constitution.test', kind: 'constitution', version: '1.0.0', status: 'approved', precedence: 1000,
    title: 'Test Constitution', sourcePath: 'test', summary: 'test',
    laws: [{ id: 'prove', text: 'Prove before claiming.' }],
  },
  {
    id: 'workflow.test', kind: 'workflow', version: '1.0.0', status: 'approved', precedence: 700,
    title: 'Test Workflow', sourcePath: 'test', summary: 'test', stages: ['inspect', 'build', 'verify'],
    limits: { meaningfulRepairAttempts: 5 }, proof: ['test evidence'], rollback: 'revert',
  },
  {
    id: 'policy.vibe-score-release', kind: 'policy', version: '1.0.0', status: 'approved', precedence: 800,
    title: 'Release', sourcePath: 'test', summary: 'test',
    rules: { releaseFloor: 8.5, hardStopFloor: 7, hardStopDimensions: ['security'], allowedVerdicts: ['SHIP', 'HOLD'] },
  },
];

test('same inputs and commit produce the same bundle hash', () => {
  const first = compileArtifacts(artifacts, { sourceCommit: 'abc123' });
  const second = compileArtifacts([...artifacts].reverse(), { sourceCommit: 'abc123' });
  assert.equal(first.bundleHash, second.bundleHash);
});

test('duplicate artifact IDs fail compilation', () => {
  assert.throws(() => compileArtifacts([...artifacts, artifacts[0]]), /duplicate artifact id/);
});

test('possible secrets are rejected', () => {
  const candidate = { ...artifacts[0], summary: 'ghp_123456789012345678901234567890' };
  assert.ok(validateArtifact(candidate).some((error) => error.includes('possible secret')));
});

test('high-consequence context requires human approval and full reviewers', () => {
  const bundle = compileArtifacts(artifacts, { sourceCommit: 'abc123' });
  const context = resolveContext(bundle, {
    project: { repository: 'executiveusa/example', mode: 'brownfield' },
    task: { type: 'migration', requestedAction: 'public-release', consequenceLevel: 'high' },
  });
  assert.equal(context.humanApproval.required, true);
  assert.ok(context.requiredReviewers.includes('security-guardian'));
  assert.equal(context.truth.bundleHash, bundle.bundleHash);
});

test('builder context preserves prohibited scope defaults', () => {
  const bundle = compileArtifacts(artifacts, { sourceCommit: 'abc123' });
  const context = resolveContext(bundle, { task: { consequenceLevel: 'low' } });
  assert.ok(context.scope.prohibited.includes('owner-credentials'));
  assert.equal(context.workflow.meaningfulRepairAttempts, 5);
});
