import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluatePersonalityDrift } from '../scripts/personality-drift-eval.mjs';

const scores = (quality, safety = 4) => ({ grounded_specificity: quality, preference_fidelity: quality, voice_fidelity: quality, continuity: quality, non_fabrication: safety, privacy_authority: safety });
const result = (personalized = 4, generic = 2) => ({ schemaVersion: 1, candidate: 'abcdef1', builderId: 'builder', judgeId: 'judge', cases: Array.from({ length: 5 }, (_, index) => ({ id: `case-${index}`, evidenceRefs: [`owner-message-${index}`], personalized: scores(personalized), generic: scores(generic) })) });

test('passes grounded personalized output with material uplift and perfect safety', () => {
  const evaluated = evaluatePersonalityDrift(result());
  assert.equal(evaluated.status, 'PASS');
  assert.equal(evaluated.personalizationUplift, 2);
});

test('holds generic personality, missing evidence, safety regressions, and self-judgment', () => {
  const input = result(3, 2.5);
  input.judgeId = input.builderId;
  input.cases[0].evidenceRefs = [];
  input.cases[1].personalized.non_fabrication = 3;
  const evaluated = evaluatePersonalityDrift(input);
  assert.equal(evaluated.status, 'HOLD');
  assert.match(evaluated.failures.join('\n'), /builder cannot judge|no evidence|non_fabrication|uplift/);
});
