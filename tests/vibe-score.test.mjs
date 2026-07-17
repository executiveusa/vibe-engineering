import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateVibeScore, normalizeScores } from '../src/vibe-score.mjs';

test('ships work that clears the floor without hard stops', () => {
  const result = calculateVibeScore({
    clarity: 9,
    reliability: 8.5,
    security: 8.5,
    maintainability: 8.5,
    taste: 9,
    ownership: 9,
  });

  assert.equal(result.status, 'SHIP');
  assert.equal(result.score, 8.8);
  assert.deepEqual(result.hardStops, []);
});

test('holds visually strong work with weak security', () => {
  const result = calculateVibeScore({
    clarity: 10,
    reliability: 10,
    security: 6.9,
    maintainability: 10,
    taste: 10,
    ownership: 10,
  });

  assert.equal(result.status, 'HOLD');
  assert.deepEqual(result.hardStops, ['security']);
});

test('normalizes missing and out-of-range values', () => {
  const normalized = normalizeScores({ clarity: 15, reliability: -2, security: '8' });

  assert.equal(normalized.clarity, 10);
  assert.equal(normalized.reliability, 0);
  assert.equal(normalized.security, 8);
  assert.equal(normalized.ownership, 0);
});
