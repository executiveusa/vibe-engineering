import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schemas = path.join(root, 'factory', 'evaluations', 'hkuds-contracts', 'schemas');
const load = async (name) => JSON.parse(await readFile(path.join(schemas, name), 'utf8'));

test('HKUDS extraction is schema-only and every contract uses JSON Schema 2020-12', async () => {
  const files = (await readdir(schemas)).sort();
  assert.deepEqual(files, [
    'factory-cli-gate.schema.json',
    'governed-memory-envelope.schema.json',
    'mobile-task-receipt.schema.json',
    'rollout-receipt.schema.json',
  ]);
  for (const file of files) {
    const schema = await load(file);
    assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
    assert.equal(schema.type, 'object');
    assert.ok(schema.required.length > 0);
  }
});

test('memory authority separates recall, disclosure, and action', async () => {
  const schema = await load('governed-memory-envelope.schema.json');
  const authority = schema.properties.authority;
  assert.deepEqual(authority.required, ['may_recall', 'may_disclose', 'may_act']);
  for (const key of authority.required) assert.equal(authority.properties[key].type, 'boolean');
  assert.equal(authority.additionalProperties, false);
});

test('CLI gate requires real software e2e and subprocess proof', async () => {
  const schema = await load('factory-cli-gate.schema.json');
  assert.ok(schema.required.includes('real_software_e2e'));
  assert.equal(schema.properties.real_software_e2e.const, true);
  assert.equal(schema.properties.tests.properties.subprocess_pass.const, true);
});

test('rollouts and mobile tasks preserve exact candidate, evidence, and authority checks', async () => {
  const rollout = await load('rollout-receipt.schema.json');
  assert.ok(rollout.required.includes('candidate_sha'));
  assert.ok(rollout.required.includes('harness_recipe_sha'));
  assert.equal(rollout.properties.judge.properties.independent.const, true);
  const mobile = await load('mobile-task-receipt.schema.json');
  assert.ok(mobile.required.includes('candidate'));
  assert.ok(mobile.required.includes('trace'));
  assert.ok(mobile.required.includes('authority'));
  assert.ok(mobile.properties.result.required.includes('repeated_action_ratio'));
});
