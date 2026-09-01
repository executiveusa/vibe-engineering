import test from 'node:test';
import assert from 'node:assert/strict';
import { getSkill, listSkills, runSkill } from '../src/skills/index.mjs';

test('skill catalog exposes the Vibe workflow set', () => {
  const skills = listSkills();
  assert.ok(skills.length >= 31);
  for (const required of ['setup-vibe', 'grill', 'spec', 'build', 'review', 'stop-slop', 'deep-work', 'proof', 'ship']) {
    assert.ok(skills.some((skill) => skill.id === required), required);
  }
});

test('aliases resolve to canonical skills', () => {
  assert.equal(getSkill('setup')?.id, 'setup-vibe');
  assert.equal(getSkill('tdd')?.id, 'test-first');
  assert.equal(getSkill('test')?.id, 'test-first');
  assert.equal(getSkill('architecture')?.id, 'architecture-check');
  assert.equal(getSkill('unlazy')?.id, 'deep-work');
});

test('runSkill returns a deterministic execution packet without inventing workflow transitions', () => {
  const result = runSkill('stop-slop', { artifact: 'homepage copy' });
  assert.equal(result.skill.id, 'stop-slop');
  assert.equal(result.input.artifact, 'homepage copy');
  assert.ok(result.execution.instructions.length >= 4);
  assert.equal(result.execution.next, null);
});

test('proof and ship are terminal until an approved workflow or authority chooses the next action', () => {
  assert.equal(runSkill('proof').execution.next, null);
  assert.equal(runSkill('ship').execution.next, null);
});
