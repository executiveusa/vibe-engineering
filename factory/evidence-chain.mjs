// Phase 1 evidence chain (architect 0016 section 4.2): every stage writes
// evidence/<target_base_sha>/<NN>-<stage>.json; input_sha of each stage must
// equal output_sha of the stage before; the runner fails closed (HOLD) on any
// break. Pure functions + filesystem writes; no network.
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const REQUIRED = ['stage', 'agent', 'model', 'model_family', 'input_sha', 'output_sha', 'started_at', 'finished_at', 'status', 'findings_count', 'artifacts', 'log_sha256'];

export function sha256File(p) {
  return createHash('sha256').update(readFileSync(p)).digest('hex');
}

export function validateStageRecord(r) {
  if (!r || typeof r !== 'object') return 'record is not an object';
  for (const k of REQUIRED) if (!(k in r)) return `missing field: ${k}`;
  if (!/^[0-9a-f]{40}$/.test(r.input_sha) || !/^[0-9a-f]{40}$/.test(r.output_sha)) return 'shas must be 40-hex';
  if (!Number.isInteger(r.findings_count) || r.findings_count < 0) return 'findings_count must be a non-negative integer';
  if (!Array.isArray(r.artifacts)) return 'artifacts must be an array';
  if (!/^[0-9a-f]{64}$/.test(r.log_sha256)) return 'log_sha256 must be 64-hex';
  if (!['ok', 'hold', 'failed'].includes(r.status)) return 'status must be ok|hold|failed';
  if ('served_models' in r && !(Array.isArray(r.served_models) && r.served_models.every(m => typeof m === 'string'))) return 'served_models must be an array of model id strings';
  if ('resolve_ref' in r && !/^[0-9a-f]{64}$/.test(r.resolve_ref)) return 'resolve_ref must be the 64-hex sha256 of the :free listing';
  return null;
}

export function writeStageRecord(dir, nn, record) {
  const err = validateStageRecord(record);
  if (err) throw new Error(`invalid stage record: ${err}`);
  mkdirSync(dir, { recursive: true });
  const p = path.join(dir, `${String(nn).padStart(2, '0')}-${record.stage}.json`);
  writeFileSync(p, JSON.stringify(record, null, 2) + '\n');
  return p;
}

// Verify the chain in a directory: sorted NN files, each input_sha equals the
// previous output_sha, and the first input_sha equals baseSha. Returns
// { ok, breakAt, reason } - the runner treats !ok as HOLD (fail closed).
export const REQUIRED_STAGES = ['audit', 'prd', 'build', 'review', 'judge']; // 'build-fix' optional, between review and judge

// Which role runs each stage: independence is verified across ROLES, and a
// role's stages must agree on one family (a mid-run model swap is a break).
export const STAGE_ROLE = { audit: 'builder', prd: 'builder', build: 'builder', 'build-fix': 'builder', review: 'reviewer', judge: 'judge' };
const DRY_FAMILY = 'dry'; // the dry lane uses one deterministic agent; no model families exist to be independent

export function verifyChain(dir, baseSha) {
  if (!existsSync(dir)) return { ok: false, reason: `no evidence dir for ${dir}` };
  const files = readdirSync(dir).filter(f => /^\d+-[a-z-]+\.json$/.test(f) && f !== 'index.json').sort();
  if (!files.length) return { ok: false, reason: 'no stage records' };
  // Sequence: the required stages must appear exactly once, in order; a lone
  // well-formed record (e.g. a fake judge) is NOT a chain.
  const names = files.map(f => f.replace(/^\d+-/, '').replace(/\.json$/, ''));
  const seq = [...REQUIRED_STAGES];
  for (const n of names) {
    if (n === 'build-fix') {
      if (seq[0] !== 'judge') return { ok: false, breakAt: n, reason: 'build-fix out of position' };
      continue;
    }
    if (seq.shift() !== n) return { ok: false, breakAt: n, reason: `stage sequence broken at ${n} (expected ${REQUIRED_STAGES.join('>')}, build-fix optional)` };
  }
  if (seq.length) return { ok: false, reason: `missing stages: ${seq.join(', ')}` };
  let prev = baseSha;
  let resolveRef = null; // every stage references the SAME resolve receipt (architect 0018 rule 3)
  const roleFamilies = {}; // role -> family seen (must be singular per role)
  for (const f of files) {
    let r; try { r = JSON.parse(readFileSync(path.join(dir, f), 'utf8')); }
    catch { return { ok: false, breakAt: f, reason: 'unparseable record' }; }
    const err = validateStageRecord(r);
    if (err) return { ok: false, breakAt: f, reason: err };
    if (r.input_sha !== prev) return { ok: false, breakAt: f, reason: `chain break: input_sha ${r.input_sha} != previous output_sha ${prev}` };
    if (r.status !== 'ok') return { ok: false, breakAt: f, reason: `stage status ${r.status}` };
    // Rehash the actual log: a record carrying a well-formed but invented
    // log_sha256 must not pass. Missing or tampered logs fail closed.
    const logPath = path.join(dir, 'logs', f.replace(/\.json$/, '.log'));
    if (!existsSync(logPath)) return { ok: false, breakAt: f, reason: `stage log missing: logs/${f.replace(/\.json$/, '.log')}` };
    if (sha256File(logPath) !== r.log_sha256) return { ok: false, breakAt: f, reason: 'log_sha256 does not match the actual stage log (tampered or misrecorded)' };
    // Served-model binding: when the run recorded what the provider actually
    // served, every served id must BE the declared model (family truth, not
    // declaration). The broker already denies mismatches at call time; this
    // keeps a hand-written record from claiming an unchecked call.
    const strip = (m) => String(m).replace(/^openrouter\//, '');
    if (Array.isArray(r.served_models) && r.served_models.length) {
      for (const sm of r.served_models) {
        if (strip(sm) !== strip(r.model)) return { ok: false, breakAt: f, reason: `served model ${sm} != declared ${r.model}` };
      }
    }
    if ('resolve_ref' in r) {
      if (resolveRef === null) resolveRef = r.resolve_ref;
      else if (r.resolve_ref !== resolveRef) return { ok: false, breakAt: f, reason: 'resolve_ref differs between stages (each stage must reference the same :free listing)' };
    }
    const role = STAGE_ROLE[r.stage];
    if (role) {
      if (roleFamilies[role] && roleFamilies[role] !== r.model_family) return { ok: false, breakAt: f, reason: `role ${role} changed family mid-run (${roleFamilies[role]} -> ${r.model_family})` };
      roleFamilies[role] = r.model_family;
    }
    prev = r.output_sha;
  }
  // Family independence on the chain itself: three roles, three families -
  // checked from the RECORDS, so a config-side collapse cannot slip past.
  // The dry lane (all families 'dry') has no models and is exempt.
  const fams = Object.values(roleFamilies);
  if (fams.length && !fams.every(f => f === DRY_FAMILY)) {
    const need = ['builder', 'reviewer', 'judge'];
    for (const role of need) if (!roleFamilies[role]) return { ok: false, reason: `no ${role} stage family recorded` };
    const distinct = new Set(need.map(r => roleFamilies[r]));
    if (distinct.size !== 3) return { ok: false, reason: `builder/reviewer/judge families must be three distinct families, got ${need.map(r => roleFamilies[r]).join(', ')}` };
    // Non-dry evidence MUST bind what the provider actually served: a record
    // with no served_models means the stage's calls were never verified
    // (bypassed broker or hand-written record). Fail closed.
    for (const f of files) {
      const r = JSON.parse(readFileSync(path.join(dir, f), 'utf8'));
      if (!Array.isArray(r.served_models) || !r.served_models.length) {
        return { ok: false, breakAt: f, reason: 'non-dry stage has no served_models - model calls were not observed and verified' };
      }
      // resolve_ref is MANDATORY on every non-dry stage (critic v4 finding 3):
      // a chain that never names the :free listing it resolved against is
      // unverifiable. Same-hash-across-stages is already enforced above.
      if (typeof r.resolve_ref !== 'string') {
        return { ok: false, breakAt: f, reason: 'non-dry stage has no resolve_ref - the :free listing binding is missing' };
      }
    }
    // Bind the chain to the actual fetched receipt on disk (critic v4 finding
    // 3): resolve-receipt.json must exist and its listing hash must BE the
    // hash every stage referenced. A record referencing a receipt that was
    // never written (or a different listing) fails closed.
    const receiptPath = path.join(dir, 'resolve-receipt.json');
    if (!existsSync(receiptPath)) {
      return { ok: false, reason: 'non-dry chain has no resolve-receipt.json - the fetched :free listing receipt is missing' };
    }
    let receipt = null;
    try { receipt = JSON.parse(readFileSync(receiptPath, 'utf8')); }
    catch { return { ok: false, reason: 'resolve-receipt.json is unparseable' }; }
    if (!receipt || typeof receipt.listing_sha256 !== 'string' || receipt.listing_sha256 !== resolveRef) {
      return { ok: false, reason: 'resolve-receipt.json listing_sha256 does not match the stages\' resolve_ref (tampered or misrecorded)' };
    }
  }
  return { ok: true, finalSha: prev, stages: files.length };
}

export function writeIndex(dir, baseSha, runId) {
  const v = verifyChain(dir, baseSha);
  const index = { base_sha: baseSha, run_id: String(runId), verified_at: new Date().toISOString(), ...v };
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  return index;
}
