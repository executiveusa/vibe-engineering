import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { familyOf, resolveModels, assertIndependent, loadPreferences, RESOLUTION_ORDER } from '../factory/model-resolve.mjs';
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

test('preferences ship as factory/model-preferences.json; resolution order is judge-first (0018)', () => {
  const prefs = loadPreferences();
  assert.deepEqual(RESOLUTION_ORDER, ['judge', 'reviewer', 'builder']);
  for (const role of RESOLUTION_ORDER) assert.ok(Array.isArray(prefs[role]) && prefs[role].length, role);
  const bad = path.join(mkdtempSync(path.join(tmpdir(), 'prefs-')), 'bad.json');
  writeFileSync(bad, JSON.stringify({ judge: [], reviewer: ['x/'], builder: ['y/'] }));
  assert.throws(() => loadPreferences(bad), /model-preferences/);
});

test('assertIndependent enforces three families', () => {
  assert.equal(assertIndependent('a/x:free', 'b/y:free', 'c/z:free'), true);
  assert.throws(() => assertIndependent('a/x:free', 'a/y:free', 'c/z:free'), /three families/);
});

const BASE = 'a'.repeat(40), S2 = 'b'.repeat(40), S3 = 'c'.repeat(40);
// Chain fixtures carry realistic per-role families (the verifier enforces
// builder/reviewer/judge family independence from the records themselves).
const ROLE_FAMILY = { audit: 'fb', prd: 'fb', build: 'fb', 'build-fix': 'fb', review: 'fr', judge: 'fj' };
const rec = (stage, input, output) => ({ stage, agent: stage, model: `${ROLE_FAMILY[stage]}/x:free`, model_family: ROLE_FAMILY[stage],
  input_sha: input, output_sha: output, started_at: '2026-10-24T00:00:00Z', finished_at: '2026-10-24T00:01:00Z',
  status: 'ok', findings_count: 0, artifacts: [], log_sha256: '0'.repeat(64),
  served_models: [`${ROLE_FAMILY[stage]}/x:free`], // non-dry evidence must bind the served model
  resolve_ref: 'f'.repeat(64) }); // non-dry stages MUST name the :free listing hash (critic v4 finding 3)
// put() writes the stage log first, then the record with the log's REAL hash:
// the verifier rehashes logs, so fixtures must be honest about them.
const put = (dir, nn, record, logContent = `log for ${record.stage} ${nn}\n`) => {
  mkdirSync(path.join(dir, 'logs'), { recursive: true });
  const lp = path.join(dir, 'logs', `${String(nn).padStart(2, '0')}-${record.stage}.log`);
  writeFileSync(lp, logContent);
  // Honest fixtures carry the fetched receipt on disk too: the verifier binds
  // every stage's resolve_ref to resolve-receipt.json (critic v4 finding 3).
  writeFileSync(path.join(dir, 'resolve-receipt.json'), JSON.stringify({ listing_sha256: 'f'.repeat(64), fetched_at: '2026-10-24T00:00:00Z', resolved: {} }) + '\n');
  return writeStageRecord(dir, nn, { ...record, log_sha256: createHash('sha256').update(readFileSync(lp)).digest('hex') });
};

test('stage record validation', () => {
  assert.equal(validateStageRecord(rec('audit', BASE, S2)), null);
  assert.match(validateStageRecord({}), /missing field/);
  assert.match(validateStageRecord({ ...rec('audit', BASE, S2), input_sha: 'zz' }), /40-hex/);
  assert.match(validateStageRecord({ ...rec('audit', BASE, S2), findings_count: -1 }), /non-negative/);
  assert.match(validateStageRecord({ ...rec('audit', BASE, S2), status: 'weird' }), /status/);
});

const S4 = 'd'.repeat(40), S5 = 'e'.repeat(40), S6 = '1'.repeat(40);
const fullChain = (dir) => {
  put(dir, 1, rec('audit', BASE, S2));
  put(dir, 2, rec('prd', S2, S3));
  put(dir, 3, rec('build', S3, S4));
  put(dir, 4, rec('review', S4, S5));
  put(dir, 5, rec('judge', S5, S6));
};

test('chain verifies a clean full run and fails closed on any break', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir);
  const ok = verifyChain(dir, BASE, { lane: 'free' });
  assert.equal(ok.ok, true); assert.equal(ok.finalSha, S6); assert.equal(ok.stages, 5);
  const idx = writeIndex(dir, BASE, 'run-1', { lane: 'free' });
  assert.equal(idx.ok, true);
  // break the link
  put(dir, 6, rec('build-fix', 'f'.repeat(40), '0'.repeat(40)));
  assert.match(verifyChain(dir, BASE, { lane: 'free' }).reason, /build-fix out of position|chain break/);
  // non-ok stage fails closed
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir2);
  put(dir2, 4, { ...rec('review', S4, S5), status: 'failed' });
  assert.equal(verifyChain(dir2, BASE, { lane: 'free' }).ok, false);
  // missing dir / empty dir
  assert.equal(verifyChain(path.join(dir2, 'nope'), BASE, { lane: 'free' }).ok, false);
  const dir3 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  assert.equal(verifyChain(dir3, BASE, { lane: 'dry' }).ok, false);
});

test('a lone well-formed judge record is NOT a chain (fake-judge attack)', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  put(dir, 1, rec('judge', BASE, S2));
  const v = verifyChain(dir, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /stage sequence broken/);
});

test('build-fix is legal between review and judge; missing stages fail', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  put(dir, 1, rec('audit', BASE, S2));
  put(dir, 2, rec('prd', S2, S3));
  put(dir, 3, rec('build', S3, S4));
  put(dir, 4, rec('review', S4, S5));
  put(dir, 5, rec('build-fix', S5, S4)); // fix produces a new tree
  put(dir, 6, rec('judge', S4, S6));
  assert.equal(verifyChain(dir, BASE, { lane: 'free' }).ok, true);
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  put(dir2, 1, rec('audit', BASE, S2));
  put(dir2, 2, rec('prd', S2, S3));
  const v = verifyChain(dir2, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /missing stages: build, review, judge/);
});

test('the verifier REHASHES stage logs: missing or tampered logs fail closed', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir);
  assert.equal(verifyChain(dir, BASE, { lane: 'free' }).ok, true);
  // tamper with one log after the records were written
  writeFileSync(path.join(dir, 'logs', '03-build.log'), 'attacker-edited log\n');
  const v = verifyChain(dir, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /log_sha256 does not match/);
  // missing log
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir2);
  unlinkSync(path.join(dir2, 'logs', '04-review.log'));
  const v2 = verifyChain(dir2, BASE, { lane: 'free' });
  assert.equal(v2.ok, false); assert.match(v2.reason, /stage log missing/);
});

test('family independence is verified from the chain records themselves', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir);
  // collapse judge into the reviewer's family
  put(dir, 5, { ...rec('judge', S5, S6), model: 'fr/x:free', model_family: 'fr', served_models: ['fr/x:free'] });
  const v = verifyChain(dir, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /three distinct families/);
  // a mid-run family swap inside one role is a break
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir2);
  put(dir2, 3, { ...rec('build', S3, S4), model: 'zz/x:free', model_family: 'zz', served_models: ['zz/x:free'] });
  const v2 = verifyChain(dir2, BASE, { lane: 'free' });
  assert.equal(v2.ok, false); assert.match(v2.reason, /changed family mid-run/);
  // the dry lane (all families 'dry') is exempt - no models exist there
  const dir3 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  const dryRec = (stage, i, o) => ({ ...rec(stage, i, o), model: 'dry-agent', model_family: 'dry', served_models: [] });
  put(dir3, 1, dryRec('audit', BASE, S2)); put(dir3, 2, dryRec('prd', S2, S3));
  put(dir3, 3, dryRec('build', S3, S4)); put(dir3, 4, dryRec('review', S4, S5)); put(dir3, 5, dryRec('judge', S5, S6));
  assert.equal(verifyChain(dir3, BASE, { lane: 'dry' }).ok, true);
});

test('resolve_ref: every stage references the same :free listing hash (0018 rule 3)', () => {
  const L = '9'.repeat(64);
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  // a chain honestly consistent at a NON-default listing hash: every record
  // AND the on-disk receipt at L (critic v4 finding 3: the verifier binds
  // records to the receipt, so all of them must move together).
  put(dir, 1, { ...rec('audit', BASE, S2), resolve_ref: L });
  put(dir, 2, { ...rec('prd', S2, S3), resolve_ref: L });
  put(dir, 3, { ...rec('build', S3, S4), resolve_ref: L });
  put(dir, 4, { ...rec('review', S4, S5), resolve_ref: L });
  put(dir, 5, { ...rec('judge', S5, S6), resolve_ref: L });
  writeFileSync(path.join(dir, 'resolve-receipt.json'), JSON.stringify({ listing_sha256: L, fetched_at: '2026-10-24T00:00:00Z', resolved: {} }) + '\n');
  assert.equal(verifyChain(dir, BASE, { lane: 'free' }).ok, true, 'single consistent resolve_ref passes');
  // a second stage with a DIFFERENT listing hash breaks the chain
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir2);
  put(dir2, 4, { ...rec('review', S4, S5), resolve_ref: L });
  put(dir2, 5, { ...rec('judge', S5, S6), resolve_ref: '8'.repeat(64) });
  const v = verifyChain(dir2, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /resolve_ref differs/);
  // malformed ref fails record validation
  assert.match(validateStageRecord({ ...rec('judge', S5, S6), resolve_ref: 'zz' }), /resolve_ref/);
});

test('non-dry records WITHOUT served_models fail closed (unobserved calls)', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  put(dir, 1, { ...rec('audit', BASE, S2), served_models: [] });
  put(dir, 2, rec('prd', S2, S3)); put(dir, 3, rec('build', S3, S4));
  put(dir, 4, rec('review', S4, S5)); put(dir, 5, rec('judge', S5, S6));
  const v = verifyChain(dir, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /no served_models/);
});

test('served-model binding: recorded served ids must equal the declared model', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir);
  put(dir, 5, { ...rec('judge', S5, S6), served_models: ['fj/x:free'] });
  assert.equal(verifyChain(dir, BASE, { lane: 'free' }).ok, true, 'matching served model passes');
  const dir2 = mkdtempSync(path.join(tmpdir(), 'ev-'));
  fullChain(dir2);
  put(dir2, 5, { ...rec('judge', S5, S6), served_models: ['openai/gpt-5'] });
  const v = verifyChain(dir2, BASE, { lane: 'free' });
  assert.equal(v.ok, false); assert.match(v.reason, /served model openai\/gpt-5 != declared/);
});
