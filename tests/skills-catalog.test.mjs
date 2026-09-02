import test from 'node:test';
import assert from 'node:assert/strict';
import { getSkill, listSkills, runSkill } from '../src/skills/index.mjs';

test('skill catalog exposes the Vibe workflow set', () => {
  const skills = listSkills();
  assert.ok(skills.length >= 32);
  for (const required of ['setup-vibe', 'project-review', 'grill', 'spec', 'build', 'review', 'stop-slop', 'deep-work', 'proof', 'ship']) {
    assert.ok(skills.some((skill) => skill.id === required), required);
  }
});

test('aliases resolve to canonical skills', () => {
  assert.equal(getSkill('setup')?.id, 'setup-vibe');
  assert.equal(getSkill('ocr')?.id, 'project-review');
  assert.equal(getSkill('open-code-review')?.id, 'project-review');
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

test('project review remains independent from release authority', () => {
  const result = runSkill('project-review', { revision: 'candidate-sha' });
  assert.equal(result.skill.id, 'project-review');
  assert.match(result.skill.attribution, /Alibaba OpenCodeReview/);
  assert.match(result.execution.instructions.join(' '), /never self-authorizes SHIP/i);
  assert.equal(result.execution.next, null);
});

test('proof and ship are terminal until an approved workflow or authority chooses the next action', () => {
  assert.equal(runSkill('proof').execution.next, null);
  assert.equal(runSkill('ship').execution.next, null);
});
