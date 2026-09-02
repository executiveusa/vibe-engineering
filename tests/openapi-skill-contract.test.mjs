import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const spec = await readFile(new URL('../openapi/vibe-truth-api-v1.yaml', import.meta.url), 'utf8');

function schemaBlock(name, nextName) {
  const start = spec.indexOf(`    ${name}:\n`);
  assert.notEqual(start, -1, `${name} schema missing`);
  const end = nextName ? spec.indexOf(`    ${nextName}:\n`, start + 1) : spec.length;
  return spec.slice(start, end === -1 ? spec.length : end);
}

test('OpenAPI keeps list-only stepCount out of full skill payloads', () => {
  const base = schemaBlock('SkillBase', 'SkillSummary');
  const summary = schemaBlock('SkillSummary', 'Skill');
  const skill = schemaBlock('Skill', 'RunSkillRequest');

  assert.match(base, /required: \[id, title, summary, invocation, category, aliases, outputs, attribution\]/);
  assert.match(summary, /#\/components\/schemas\/SkillBase/);
  assert.match(summary, /required: \[stepCount\]/);
  assert.match(skill, /#\/components\/schemas\/SkillBase/);
  assert.match(skill, /required: \[steps\]/);
  assert.doesNotMatch(skill, /SkillSummary/);
  assert.doesNotMatch(skill, /stepCount/);
});
