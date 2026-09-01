import test from 'node:test';
import assert from 'node:assert/strict';
import { getSkill, listSkills, runSkill } from '../src/skills/catalog.mjs';

test('skill catalog exposes the Vibe workflow set', () => {
  const skills = listSkills();
  assert.ok(skills.length >= 25);
  for (const required of ['grill', 'spec', 'build', 'review', 'stop-slop', 'deep-work', 'proof', 'ship']) {
    assert.ok(skills.some((skill) => skill.id === required), required);
  }
});

test('aliases resolve to canonical skills', () => {
  assert.equal(getSkill('tdd')?.id, 'test-first');
  assert.equal(getSkill('unlazy')?.id, 'deep-work');
});

test('runSkill returns a deterministic execution packet', () => {
  const result = runSkill('stop-slop', { artifact: 'homepage copy' });
  assert.equal(result.skill.id, 'stop-slop');
  assert.equal(result.input.artifact, 'homepage copy');
  assert.ok(result.execution.instructions.length >= 4);
});
