import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { familyOf, resolveModels, assertIndependent } from '../factory/model-resolve.mjs';
import { validateStageRecord, writeStageRecord, verifyChain, writeIndex } from '../factory/evidence-chain.mjs';

const LIST = ['google/gemma-4-31b-it:free', 'nvidia/nemotron-3-ultra-550b-a55b:free', 'recursive/flint-v1.0:free', 'liquid/lfm-2.5-2.6b:free', 'openai/gpt-5'];

test('familyOf', () => {
  assert.equal(familyOf('google/gemma-4-31b-it:free'), 'google');
  assert.equal(familyOf('nvidia/nemotron-3-ultra-550b-a55b:free'), 'nvidia');
  assert.equal(familyOf('no-slash'), '');
});

test('resolveModels picks three families from the live list', () => {
  const r = resolveModels(LIST);
  assert.equal(r.ok, true);
  assert.equal(r.resolved.reviewer, 'google/gemma-4-31b-it:free');
  assert.equal(r.resolved.judge, 'nvidia/nemotron-3-ultra-550b-a55b:free');
  assert.equal(r.resolved.builder, 'recursive/flint-v1.0:free'); // qwen absent -> next preference
  assert.equal(new Set([familyOf(r.resolved.builder), familyOf(r.resolved.reviewer), familyOf(r.resolved.judge)]).size, 3);
});

test('resolveModels HOLDs when a stage cannot be filled; never substitutes a taken family', () => {
  const r = resolveModels(['google/gemma-4-31b-it:free']); // only one family available
  assert.equal(r.ok, false);
  assert.match(r.hold, /builder/);
  assert.match(r.hold, /judge/);
  // gemma taken by reviewer; judge must not silently take another google model
  const r2 = resolveModels(['google/gemma-4-31b-it:free', 'google/gemma-4-26b-a4b-it:free']);
  assert.equal(r2.ok, false);
});

test('non-free ids are never picked', () => {
  const r = resolveModels(['openai/gpt-5', 'google/gemma-4-31b-it:free', 'nvidia/nemotron-3-ultra-550b-a55b:free']);
  assert.equal(r.ok, false); // builder unfillable -> HOLD, not a paid fallback
  assert.equal(r.resolved.builder, null);
});

test('assertIndependent enforces three families', () => {
  assert.equal(assertIndependent('a/x:free', 'b/y:free', 'c/z:free'), true);
  assert.throws(() => assertIndependent('a/x:free', 'a/y:free', 'c/z:free'), /three families/);
});

const BASE = 'a'.repeat(40), S2 = 'b'.repeat(40), S3 = 'c'.repeat(40);
const rec = (stage, input, output) => ({ stage, agent: stage, model: 'm/x:free', model_family: 'm',
  input_sha: input, output_sha: output, started_at: '2026-10-24T00:00:00Z', finished_at: '2026-10-24T00:01:00Z',
  status: 'ok', findings_count: 0, artifacts: [], log_sha256: createHash('sha256').update(stage).digest('hex') });

test('stage record validation', () => {
  assert.equal(validateStageRecord(rec('audit', BASE, S2)), null);
  assert.match(validateStageRecord({}), /missing field/);
  assert.match(validateStageRecord({ ...rec('audit', BASE, S2), input_sha: 'zz' }), /40-hex/);
  assert.match(validateStageRecord({ ...rec('audit', BASE, S2), findings_count: -1 }), /non-negative/);
  assert.match(validateStageRecord({ ...rec('audit', BASE, S2), status: 'weird' }), /status/);
});

test('chain verifies a clean run and fails closed on any break', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  writeStageRecord(dir, 1, rec('audit', BASE, S2));
  writeStageRecord(dir, 2, rec('prd', S2, S3));
  const ok = verifyChain(dir, BASE);
  assert.equal(ok.ok, true); assert.equal(ok.finalSha, S3); assert.equal(ok.stages, 2);
  const idx = writeIndex(dir, BASE, 'run-1');
  assert.equal(idx.ok, true);
  // break the chain
  writeStageRecord(dir, 3, rec('build', 'f'.repeat(40), 'e'.repeat(40)));
  const bad = verifyChain(dir, BASE);
  assert.equal(bad.ok, false); assert.match(bad.reason, /chain break/);
  // non-ok stage fails closed
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  writeStageRecord(dir2, 1, { ...rec('audit', BASE, S2), status: 'failed' });
  assert.equal(verifyChain(dir2, BASE).ok, false);
  // missing dir / empty dir
  assert.equal(verifyChain(path.join(dir2, 'nope'), BASE).ok, false);
  const dir3 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  assert.equal(verifyChain(dir3, BASE).ok, false);
});
