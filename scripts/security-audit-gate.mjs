#!/usr/bin/env node
/**
 * security-audit-gate.mjs — runs the security audit gate for a release
 * candidate and writes the docs/evidence/security-audit.json receipt the
 * ship gate requires.
 *
 * The gate runs the vendored Cloudflare security-audit findings validator
 * (factory/vendor/security-audit-skill/, pinned — see its PROVENANCE.md)
 * against a findings.json produced by an auditor that is not the builder,
 * then applies the release policy:
 *
 *   - findings.json must pass the vendored validator;
 *   - zero confirmed CRITICAL or HIGH findings;
 *   - every confirmed MEDIUM-or-above finding needs a recorded disposition
 *     of FIXED or WAIVED (supplied via --dispositions);
 *   - the audit must have run at least twice on the same candidate
 *     (--runs, required evidence files);
 *   - auditor and builder identities are required and must differ.
 *
 * Usage:
 *   node scripts/security-audit-gate.mjs <workspace> --findings <path>
 *     --auditor <id> --builder <id>
 *     [--candidate SHA] --runs <json-file> [--run-count N] [--dispositions <json-file>]
 *
 * --findings is workspace-relative. --dispositions is a JSON file:
 *   [{ "fingerprint": "...", "disposition": "FIXED" | "WAIVED", "note": "..." }]
 *
 * Exit code 0 on PASS, 1 on HOLD. The receipt is written either way so the
 * ship gate can read the failure detail.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VALIDATOR = path.join(REPO_ROOT, 'factory', 'vendor', 'security-audit-skill', 'validate-findings.cjs');
const SEVERITIES = ['critical', 'high', 'medium', 'low', 'informational'];
const BLOCKING_SEVERITIES = new Set(['critical', 'high']);
const DISPOSITION_REQUIRED = new Set(['critical', 'high', 'medium']);
const ACCEPTED_DISPOSITIONS = new Set(['FIXED', 'WAIVED']);

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');

function option(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}

function git(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

function resolveWithin(root, relative) {
  const resolved = path.resolve(root, relative);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`))
    throw new Error(`path escapes the workspace: ${relative}`);
  return resolved;
}

export async function validateAuditRuns(root, refs, candidate, builderId) {
  const failures = [], verified = [], ids = new Set();
  if (!Array.isArray(refs) || refs.length < 2) failures.push('security audit requires at least twice-run evidence');
  for (const ref of Array.isArray(refs) ? refs : []) {
    try {
      const rel = typeof ref === 'string' ? ref : ref?.path;
      if (!rel) throw new Error('run evidence path is missing');
      const bytes = await readFile(resolveWithin(root, rel));
      const digest = sha256(bytes);
      if (typeof ref !== 'string' && ref.sha256 !== digest) throw new Error('run evidence hash mismatch');
      const run = JSON.parse(bytes);
      if (!run.runId || ids.has(run.runId)) throw new Error('run evidence needs distinct run IDs');
      ids.add(run.runId);
      if (run.candidate !== candidate || run.status !== 'completed' || !run.auditorId || run.auditorId === builderId || !Number.isFinite(Date.parse(run.completedAt)))
        throw new Error('run evidence is incomplete, stale, or builder-authored');
      if (!run.findingsPath || !/^[0-9a-f]{64}$/.test(run.findingsSha256 || '')) throw new Error('run findings evidence is missing');
      const findingsFile = resolveWithin(root, run.findingsPath);
      const findingsBytes = await readFile(findingsFile);
      if (sha256(findingsBytes) !== run.findingsSha256) throw new Error('run findings hash mismatch');
      const validation = spawnSync(process.execPath, [VALIDATOR, findingsFile], { encoding: 'utf8' });
      if (validation.status !== 0) throw new Error('run findings failed validator');
      verified.push({ path: rel, sha256: digest, runId: run.runId, auditorId: run.auditorId });
    } catch (error) { failures.push(`security audit run evidence: ${error.message}`); }
  }
  return { failures, verified };
}

export async function securityAuditGate(
  root,
  { findings, candidate, auditorId, builderId, runCount, runs = [], dispositions = [] } = {},
) {
  const failures = [];
  const resolvedCandidate = git(root, ['rev-parse', `${candidate ?? 'HEAD'}^{commit}`]);
  if (!findings) failures.push('findings path is missing');
  if (!auditorId) failures.push('auditor identity is missing');
  if (!builderId) failures.push('builder identity is missing');
  if (auditorId && builderId && auditorId === builderId)
    failures.push('builder cannot be the security auditor');
  const runCheck = await validateAuditRuns(root, runs, resolvedCandidate, builderId);
  failures.push(...runCheck.failures);
  if (runCount !== undefined && runCount !== runCheck.verified.length) failures.push('security audit runCount does not match run evidence');

  let findingsBuffer = null;
  let parsed = null;
  let findingsPath = null;
  if (findings) {
    findingsPath = resolveWithin(root, findings);
    try {
      findingsBuffer = await readFile(findingsPath);
    } catch {
      failures.push(`findings file is unreadable: ${findings}`);
    }
    if (findingsBuffer) {
      try {
        parsed = JSON.parse(findingsBuffer.toString('utf8'));
        if (!Array.isArray(parsed)) {
          failures.push('findings.json is not an array');
          parsed = null;
        }
      } catch {
        failures.push('findings.json is not valid JSON');
      }
    }
  }

  let validatorPassed = false;
  let validatorOutput = '';
  if (findingsBuffer) {
    const run = spawnSync(process.execPath, [VALIDATOR, findingsPath], { encoding: 'utf8' });
    validatorPassed = run.status === 0;
    validatorOutput = `${run.stdout ?? ''}${run.stderr ?? ''}`.trim();
    if (!validatorPassed) failures.push('findings.json failed the vendored security-audit validator');
  }

  const counts = {
    confirmed: Object.fromEntries(SEVERITIES.map((severity) => [severity, 0])),
    needsValidation: 0,
    rejected: 0,
  };
  const confirmedByFingerprint = new Map();
  if (Array.isArray(parsed)) {
    for (const finding of parsed) {
      if (finding?.verdict === 'confirmed') {
        const severity = finding?.severity?.overall_severity;
        if (SEVERITIES.includes(severity)) counts.confirmed[severity] += 1;
        if (typeof finding?.fingerprint === 'string')
          confirmedByFingerprint.set(finding.fingerprint, severity);
      } else if (finding?.verdict === 'needs_validation') counts.needsValidation += 1;
      else if (finding?.verdict === 'rejected') counts.rejected += 1;
    }
  }
  for (const severity of BLOCKING_SEVERITIES) {
    if (counts.confirmed[severity] > 0)
      failures.push(`security audit has ${counts.confirmed[severity]} confirmed ${severity} finding(s)`);
  }

  const supplied = new Map(
    (Array.isArray(dispositions) ? dispositions : [])
      .filter((entry) => typeof entry?.fingerprint === 'string')
      .map((entry) => [entry.fingerprint, entry]),
  );
  const receiptDispositions = [];
  for (const [fingerprint, severity] of confirmedByFingerprint) {
    const entry = supplied.get(fingerprint);
    const disposition = ACCEPTED_DISPOSITIONS.has(entry?.disposition) ? entry.disposition : 'OPEN';
    const record = { fingerprint, severity, disposition };
    if (entry?.note) record.note = entry.note;
    receiptDispositions.push(record);
    if (DISPOSITION_REQUIRED.has(severity) && disposition === 'OPEN')
      failures.push(`confirmed ${severity} finding ${fingerprint} has no recorded FIXED or WAIVED disposition`);
  }

  const receipt = {
    schemaVersion: 1,
    test: 'security-audit-gate',
    status: failures.length ? 'HOLD' : 'PASS',
    candidate: resolvedCandidate,
    findingsPath: findings ?? null,
    findingsSha256: findingsBuffer ? sha256(findingsBuffer) : null,
    validatorPassed,
    runCount: runCheck.verified.length,
    runs: runCheck.verified,
    auditorId: auditorId ?? null,
    builderId: builderId ?? null,
    counts,
    dispositions: receiptDispositions,
    failures,
    generatedAt: new Date().toISOString(),
  };
  const evidenceDir = path.join(root, 'docs', 'evidence');
  await mkdir(evidenceDir, { recursive: true });
  await writeFile(path.join(evidenceDir, 'security-audit.json'), `${JSON.stringify(receipt, null, 2)}\n`);
  return { ...receipt, validatorOutput };
}

async function main() {
  const [workspace = '.', ...args] = process.argv.slice(2);
  const root = path.resolve(workspace);
  let dispositions = [];
  const dispositionsFile = option(args, '--dispositions');
  if (dispositionsFile)
    dispositions = JSON.parse(await readFile(resolveWithin(root, dispositionsFile), 'utf8'));
  const runCountArg = option(args, '--run-count');
  const runsFile = option(args, '--runs');
  const runs = runsFile ? JSON.parse(await readFile(resolveWithin(root, runsFile), 'utf8')) : [];
  const result = await securityAuditGate(root, {
    findings: option(args, '--findings'),
    candidate: option(args, '--candidate'),
    auditorId: option(args, '--auditor'),
    builderId: option(args, '--builder'),
    runCount: runCountArg === undefined ? undefined : Number(runCountArg),
    runs,
    dispositions,
  });
  console.log(JSON.stringify(result, null, 2));
  if (result.status === 'HOLD') process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
