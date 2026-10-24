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
export function verifyChain(dir, baseSha) {
  if (!existsSync(dir)) return { ok: false, reason: `no evidence dir for ${dir}` };
  const files = readdirSync(dir).filter(f => /^\d+-[a-z-]+\.json$/.test(f) && f !== 'index.json').sort();
  if (!files.length) return { ok: false, reason: 'no stage records' };
  let prev = baseSha;
  for (const f of files) {
    let r; try { r = JSON.parse(readFileSync(path.join(dir, f), 'utf8')); }
    catch { return { ok: false, breakAt: f, reason: 'unparseable record' }; }
    const err = validateStageRecord(r);
    if (err) return { ok: false, breakAt: f, reason: err };
    if (r.input_sha !== prev) return { ok: false, breakAt: f, reason: `chain break: input_sha ${r.input_sha} != previous output_sha ${prev}` };
    if (r.status !== 'ok') return { ok: false, breakAt: f, reason: `stage status ${r.status}` };
    prev = r.output_sha;
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
