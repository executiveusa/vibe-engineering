import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContextRequest } from '../src/truth/request-validation.mjs';

test('accepts a bounded brownfield request', () => {
  const result = validateContextRequest({
    project: { repository: 'executiveusa/vibe-engineering', mode: 'brownfield' },
    task: { type: 'software-change', requestedAction: 'software-change', consequenceLevel: 'medium' },
    scope: { allowed: ['src/truth/**'], prohibited: ['secrets'] },
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('rejects unknown fields', () => {
  const result = validateContextRequest({ project: { repository: 'executiveusa/vibe-engineering' }, bypass: true });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /unknown field 'bypass'/);
});

test('rejects malformed repositories and unsupported actions', () => {
  const result = validateContextRequest({
    project: { repository: 'not-a-repository' },
    task: { requestedAction: 'skip-review', consequenceLevel: 'critical' },
  });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /owner\/repository/);
  assert.match(result.errors.join(' '), /unsupported/);
  assert.match(result.errors.join(' '), /low, medium, or high/);
});

test('rejects non-string scope entries', () => {
  const result = validateContextRequest({ scope: { allowed: ['src/**', 42] } });
  assert.equal(result.valid, false);
  assert.match(result.errors.join(' '), /array of strings/);
});
