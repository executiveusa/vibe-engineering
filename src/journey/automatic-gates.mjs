import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const EVIDENCE_ROOT = path.join('.vibe', 'evidence');

async function exists(root, relative) {
  try {
    await fs.access(path.join(root, relative));
    return true;
  } catch {
    return false;
  }
}

async function readJson(root, relative) {
  try {
    return JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'));
  } catch {
    return null;
  }
}

async function writeEvidence(root, stageId, gateId, payload) {
  const dir = path.join(root, EVIDENCE_ROOT, stageId);
  await fs.mkdir(dir, { recursive: true });
  const relative = path.join(EVIDENCE_ROOT, stageId, `${gateId}.json`);
  await fs.writeFile(path.join(root, relative), JSON.stringify(payload, null, 2) + '\n');
  return relative;
}

async function packageScripts(root) {
  const pkg = await readJson(root, 'package.json');
  return pkg?.scripts ?? {};
}

async function defaultCommandRunner(command, args, options = {}) {
  try {
    const result = await execFileAsync(command, args, {
      cwd: options.cwd,
      timeout: options.timeout ?? 10 * 60 * 1000,
      maxBuffer: 2 * 1024 * 1024,
      env: process.env,
      windowsHide: true,
    });
    return { ok: true, exitCode: 0, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
  } catch (error) {
    return {
      ok: false,
      exitCode: Number.isInteger(error?.code) ? error.code : 1,
      stdout: error?.stdout ?? '',
      stderr: error?.stderr ?? String(error?.message ?? error),
    };
  }
}

function safeSummary(result) {
  const text = `${result.stdout || ''}\n${result.stderr || ''}`.trim();
  return text.slice(-2000);
}

async function runNpmScript(root, script, commandRunner) {
  const scripts = await packageScripts(root);
  if (!scripts[script]) return { pass: false, reason: `package.json has no ${script} script` };
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = await commandRunner(npm, ['run', script], { cwd: root });
  return { pass: result.ok, command: `npm run ${script}`, exitCode: result.exitCode, summary: safeSummary(result) };
}

async function runOpenCodeReview(root, candidate, commandRunner) {
  const ocr = process.platform === 'win32' ? 'ocr.cmd' : 'ocr';
  const args = candidate ? ['review', '--commit', candidate] : ['review'];
  const result = await commandRunner(ocr, args, { cwd: root, timeout: 15 * 60 * 1000 });
  return {
    pass: result.ok,
    command: `ocr ${args.join(' ')}`,
    exitCode: result.exitCode,
    summary: safeSummary(result),
    reason: result.ok ? null : 'OpenCodeReview did not complete cleanly. Install/configure OCR or resolve its findings before advancing.',
  };
}

async function durableGate(root, stageId, gateId, options = {}) {
  const relative = path.join(EVIDENCE_ROOT, stageId, `${gateId}.json`);
  const evidence = await readJson(root, relative);
  if (!evidence || evidence.status !== 'PASS') {
    return { pass: false, reason: `Missing durable PASS evidence: ${relative}` };
  }
  if (options.requireHuman && !['human', 'owner', 'judge'].includes(String(evidence.authority ?? '').toLowerCase())) {
    return { pass: false, reason: `${gateId} requires human/owner/Judge authority in ${relative}` };
  }
  if (options.candidate) {
    if (!evidence.candidate) return { pass: false, reason: `${gateId} must name candidate ${options.candidate} in ${relative}` };
    if (evidence.candidate !== options.candidate) return { pass: false, reason: `${gateId} evidence is for ${evidence.candidate}, not exact candidate ${options.candidate}` };
  }
  return {
    pass: true,
    evidence: relative,
    recordedBy: evidence.recordedBy ?? null,
    authority: evidence.authority ?? null,
    candidate: evidence.candidate ?? null,
  };
}

async function checkProjectWalkable(root) {
  const required = ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md'];
  const missing = [];
  for (const file of required) if (!(await exists(root, file))) missing.push(file);
  return { pass: missing.length === 0, missing, reason: missing.length ? `Missing canonical entry files: ${missing.join(', ')}` : null };
}

export async function runAutomaticGateChecks({ root = process.cwd(), stageId, candidate = null, commandRunner = defaultCommandRunner } = {}) {
  if (!stageId) throw new Error('stageId is required');

  const checks = {};
  const diagnostics = {};
  const evidence = [];
  const record = async (gateId, result, source = 'automatic') => {
    const payload = {
      gate: gateId,
      stage: stageId,
      status: result.pass ? 'PASS' : 'HOLD',
      source,
      candidate,
      details: result,
      createdAt: new Date().toISOString(),
    };
    const relative = await writeEvidence(root, stageId, gateId, payload);
    checks[gateId] = result.pass === true;
    diagnostics[gateId] = result;
    evidence.push(relative);
    return result;
  };

  const judgement = async (gateId, options = {}) => {
    const result = await durableGate(root, stageId, gateId, options);
    checks[gateId] = result.pass === true;
    diagnostics[gateId] = result;
    if (result.evidence) evidence.push(result.evidence);
    return result;
  };

  switch (stageId) {
    case '00-start':
      await record('project-walkable', await checkProjectWalkable(root));
      await judgement('owner-intent-named');
      break;
    case '01-discover':
      await judgement('user-and-problem-clear');
      await judgement('critical-assumptions-recorded');
      break;
    case '02-define':
      await judgement('outcome-clear');
      await judgement('standard-clear');
      await judgement('acceptance-testable');
      await judgement('non-goals-recorded');
      break;
    case '03-plan':
      await judgement('slices-ordered');
      await judgement('dependencies-visible');
      await judgement('proof-defined');
      break;
    case '04-build':
      await judgement('slice-complete', candidate ? { candidate } : {});
      await record('tests-pass', await runNpmScript(root, 'test', commandRunner));
      await record('build-pass', await runNpmScript(root, 'build', commandRunner));
      break;
    case '05-review':
      await record('open-code-review-pass', await runOpenCodeReview(root, candidate, commandRunner), 'open-code-review');
      await judgement('material-findings-resolved', candidate ? { candidate } : {});
      await judgement('stop-slop-pass', candidate ? { candidate } : {});
      await judgement('taste-pass', candidate ? { candidate } : {});
      break;
    case '06-prove':
      await judgement('claims-mapped-to-evidence', candidate ? { candidate } : {});
      await judgement('exact-candidate-proven', candidate ? { candidate } : {});
      break;
    case '07-integrate':
      await judgement('integration-coherent', candidate ? { candidate } : {});
      await record('affected-tests-pass', await runNpmScript(root, 'test', commandRunner));
      break;
    case '08-release':
      await judgement('owner-ship-authority', { requireHuman: true, ...(candidate ? { candidate } : {}) });
      await judgement('rollback-ready', candidate ? { candidate } : {});
      await judgement('production-smoke-pass', candidate ? { candidate } : {});
      break;
    case '09-learn':
      await judgement('handoff-written');
      await judgement('retrospective-written');
      break;
    default:
      throw new Error(`Unknown journey stage: ${stageId}`);
  }

  return { gateResults: checks, diagnostics, evidence: [...new Set(evidence)] };
}
