#!/usr/bin/env node
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import crypto from 'node:crypto';
import path from 'node:path';
import process from 'node:process';
import { inspectWorkspace, REQUIRED_STAGES } from './factory-doctor.mjs';

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));
const exists = async (file) =>
  access(file).then(
    () => true,
    () => false,
  );
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');
const receiptPath = (root, name) => path.join(root, 'docs', 'evidence', name);

async function git(root, args) {
  const result = spawnSync('git', ['-C', root, ...args], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `git ${args.join(' ')} failed`);
  return result.stdout.trim();
}

export async function coldWalk(root) {
  const doctor = await inspectWorkspace(root);
  const state = await readJson(path.join(root, '.factory', 'state.json'));
  const visited = [];
  const failures = [...doctor.errors];
  let priorOutput = null;
  for (const stage of REQUIRED_STAGES) {
    const contractPath = `stages/${stage}/CONTEXT.md`;
    const contract = await readFile(path.join(root, contractPath), 'utf8').catch(() => '');
    const exactInputs = [...contract.matchAll(/`([^`]+)`/g)]
      .map((match) => match[1])
      .filter((item) => item.includes('/') || item.endsWith('.md') || item.endsWith('.yaml'));
    const outputNames = [...contract.matchAll(/- `([^`]+)` -> `output\/`/g)].map(
      (match) => match[1],
    );
    const hasOneJob = /One job:/i.test(contract);
    const hasHumanGate = /## Human gate[\s\S]+?(?=\n## |$)/i.test(contract);
    const linksPrior = priorOutput === null || exactInputs.some((item) => item.includes('../'));
    if (!hasOneJob) failures.push(`${contractPath}: missing One job contract`);
    if (!hasHumanGate) failures.push(`${contractPath}: missing human gate`);
    if (!outputNames.length) failures.push(`${contractPath}: no named output files`);
    if (!linksPrior) failures.push(`${contractPath}: cannot trace a prior-stage input`);
    visited.push({
      stage,
      contract: contractPath,
      inputs: exactInputs,
      outputs: outputNames,
      humanGate: hasHumanGate,
    });
    priorOutput = outputNames;
  }
  const current = visited.find((item) => item.stage === state.currentStage);
  if (!current) failures.push(`current stage ${state.currentStage} is not walkable`);
  return {
    schemaVersion: 1,
    test: 'icm-cold-walk',
    status: failures.length ? 'HOLD' : 'PASS',
    project: state.project,
    start: 'repository root',
    currentStage: state.currentStage,
    nextAction: current?.contract ?? null,
    visited,
    failures,
    generatedAt: new Date().toISOString(),
  };
}

export async function recordWalk(root) {
  const result = await coldWalk(root);
  try { result.candidate = await git(root, ['rev-parse', 'HEAD^{commit}']); } catch { result.candidate = null; }
  await mkdir(path.join(root, 'docs', 'evidence'), { recursive: true });
  await writeFile(receiptPath(root, 'icm-cold-walk.json'), `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

export async function review(root, { base, candidate, runner = spawnSync } = {}) {
  if (!base || !candidate)
    throw new Error('review requires --base and --candidate exact revisions');
  const resolvedBase = await git(root, ['rev-parse', `${base}^{commit}`]);
  const resolvedCandidate = await git(root, ['rev-parse', `${candidate}^{commit}`]);
  const dirty = await git(root, ['status', '--porcelain']);
  if (dirty) throw new Error('refusing exact-revision review with a dirty workspace');
  const resultFile = receiptPath(root, 'open-code-review-result.json');
  await mkdir(path.join(root, 'docs', 'evidence'), { recursive: true });
  await rm(resultFile, { force: true });
  const args = ['review', '--from', resolvedBase, '--to', resolvedCandidate, '--format', 'json', '--output', resultFile];
  const result = runner(process.platform === 'win32' ? 'ocr.cmd' : 'ocr', args, {
    cwd: root,
    encoding: 'utf8',
  });
  const receipt = {
    schemaVersion: 1,
    engine: 'executiveusa/open-code-review',
    engineRevision: '152cc6d585043d40c3674d9637a7a06bbd950610',
    base: resolvedBase,
    candidate: resolvedCandidate,
    command: `ocr ${args.join(' ')}`,
    status: result.status === 0 && await exists(resultFile) ? 'PASS' : 'HOLD',
    exitCode: result.status,
    resultFile: 'docs/evidence/open-code-review-result.json',
    resultFileSha256: await exists(resultFile) ? hash(await readFile(resultFile)) : null,
    outputSha256: hash(`${result.stdout ?? ''}\n${result.stderr ?? ''}`),
    generatedAt: new Date().toISOString(),
  };
  await mkdir(path.join(root, 'docs', 'evidence'), { recursive: true });
  await writeFile(
    receiptPath(root, 'open-code-review.json'),
    `${JSON.stringify(receipt, null, 2)}\n`,
  );
  return receipt;
}

export async function shipGate(root, { candidate } = {}) {
  const resolvedCandidate = await git(root, ['rev-parse', `${candidate ?? 'HEAD'}^{commit}`]);
  const required = [
    'ultimate-bug-scan.json',
    'no-slop-review.json',
    'subtraction-review.json',
    'voice-call-proof.json',
    'open-code-review.json',
    'simplicity-review.json',
    'mission-v2-release.json',
    'icm-cold-walk.json',
    'independent-review.json',
    'judge-verdict.json',
  ];
  const failures = [];
  const receipts = {};
  for (const name of required) {
    const file = receiptPath(root, name);
    if (!(await exists(file))) {
      failures.push(`missing ${name}`);
      continue;
    }
    try {
      receipts[name] = await readJson(file);
    } catch {
      failures.push(`invalid ${name}`);
    }
  }
  const noSlop = receipts['no-slop-review.json'];
  if (noSlop?.status !== 'PASS') failures.push('no-slop review did not PASS');
  if (noSlop?.candidate !== resolvedCandidate) failures.push('no-slop review receipt is stale for candidate');
  if (!noSlop?.reviewerId || !noSlop?.artifact) failures.push('no-slop review identity or artifact is missing');
  const slopCategories = ['idea', 'strategy', 'copy', 'ui', 'architecture', 'code', 'business', 'production'];
  for (const category of slopCategories) if (!['PASS', 'NOT_APPLICABLE'].includes(noSlop?.categories?.[category])) failures.push(`no-slop ${category} category is unresolved`);
  if (!Array.isArray(noSlop?.findings) || noSlop.findings.some((finding) => !['FIXED', 'FALSE_POSITIVE_WITH_PROOF', 'AUTHORIZED_ACCEPTANCE'].includes(finding?.disposition))) failures.push('no-slop findings are unresolved');
  if (!Array.isArray(noSlop?.evidenceExamined) || !noSlop.evidenceExamined.length) failures.push('no-slop evidence is missing');

  const subtraction = receipts['subtraction-review.json'];
  if (!['PASS', 'NOT_APPLICABLE'].includes(subtraction?.status)) failures.push('Subtraction Gauntlet did not PASS');
  if (subtraction?.candidate !== resolvedCandidate) failures.push('Subtraction Gauntlet receipt is stale for candidate');
  if (!subtraction?.reviewerId || !subtraction?.artifact) failures.push('Subtraction Gauntlet identity or artifact is missing');
  if (subtraction?.applicability === 'NON_USER_FACING') {
    if (subtraction?.status !== 'NOT_APPLICABLE' || !subtraction?.reason) failures.push('Subtraction Gauntlet non-user-facing exception is incomplete');
  } else if (subtraction?.applicability === 'USER_FACING') {
    const dispositions = ['keep', 'merge', 'infer', 'defer', 'move', 'remove'];
    for (const disposition of dispositions) if (!Array.isArray(subtraction?.dispositions?.[disposition])) failures.push(`Subtraction Gauntlet ${disposition} disposition is missing`);
    if (!subtraction?.largestRemainingGap || !subtraction?.protectedQuality) failures.push('Subtraction Gauntlet stopping evidence is missing');
    if (subtraction?.accessibilityRegression !== false || subtraction?.trustOrControlRegression !== false) failures.push('Subtraction Gauntlet has a protected-quality regression');
    if (!Array.isArray(subtraction?.evidenceExamined) || !subtraction.evidenceExamined.length) failures.push('Subtraction Gauntlet evidence is missing');
  } else failures.push('Subtraction Gauntlet applicability is missing');

  const voice = receipts['voice-call-proof.json'];
  if (!['PASS', 'NOT_APPLICABLE'].includes(voice?.status)) failures.push('Voice / Call Proof did not PASS');
  if (voice?.candidate !== resolvedCandidate) failures.push('Voice / Call Proof receipt is stale for candidate');
  if (!voice?.reviewerId || !voice?.reason) failures.push('Voice / Call Proof reviewer or reason is missing');
  if (voice?.applicability === 'NON_VOICE') {
    if (voice?.status !== 'NOT_APPLICABLE') failures.push('Voice / Call Proof non-voice exception is incomplete');
  } else if (voice?.applicability === 'CALL_OR_VOICE') {
    if (voice?.status !== 'PASS') failures.push('Voice / Call Proof applicable candidate did not PASS');
    if (voice?.consent?.identityDisclosure !== 'PASS' || !['PASS', 'NOT_RECORDED'].includes(voice?.consent?.recordingDisclosure) || voice?.consent?.affirmativeConsent !== 'PASS' || voice?.consent?.revocationTest !== 'PASS') failures.push('Voice / Call Proof consent failed');
    const recordingFields = ['policy', 'storage', 'access', 'retention', 'redaction', 'deletionOrExport'];
    for (const field of recordingFields) if (!['PASS', 'NOT_RECORDED'].includes(voice?.recordingAndTranscripts?.[field])) failures.push(`Voice / Call Proof recording/transcript ${field} failed`);
    if (voice?.turnTaking !== 'PASS') failures.push('Voice / Call Proof turn-taking failed');
    if (voice?.latency?.status !== 'PASS' || typeof voice?.latency?.p50Ms !== 'number' || typeof voice?.latency?.p95Ms !== 'number' || typeof voice?.latency?.budgetMs !== 'number' || voice.latency.p95Ms > voice.latency.budgetMs) failures.push('Voice / Call Proof latency failed');
    if (voice?.interruptionHandling !== 'PASS') failures.push('Voice / Call Proof interruption handling failed');
    const voiceQaFields = ['intelligibility', 'identityAndTone', 'noiseAndDeviceMatrix', 'failureDisclosure'];
    for (const field of voiceQaFields) if (voice?.voiceQa?.[field] !== 'PASS') failures.push(`Voice / Call Proof voice QA ${field} failed`);
    const escalationFields = ['humanHandoff', 'emergencyBoundary', 'failedTransferRecovery', 'hangupControl'];
    for (const field of escalationFields) if (voice?.callEscalation?.[field] !== 'PASS') failures.push(`Voice / Call Proof escalation ${field} failed`);
    if (!Array.isArray(voice?.evidenceRefs) || !voice.evidenceRefs.length) failures.push('Voice / Call Proof evidence is missing');
  } else failures.push('Voice / Call Proof applicability is missing');

  if (receipts['ultimate-bug-scan.json']?.status !== 'PASS')
    failures.push('Ultimate Bug Scanner did not PASS');
  if (receipts['ultimate-bug-scan.json']?.candidate !== resolvedCandidate)
    failures.push('Ultimate Bug Scanner receipt is stale for candidate');
  if (receipts['ultimate-bug-scan.json']?.scanStatus !== 'ok' || receipts['ultimate-bug-scan.json']?.exitCode !== 0)
    failures.push('Ultimate Bug Scanner scan was incomplete or failed');
  if (receipts['ultimate-bug-scan.json']?.totals?.critical !== 0 || receipts['ultimate-bug-scan.json']?.totals?.warning !== 0)
    failures.push('Ultimate Bug Scanner has unresolved findings');
  const mission = receipts['mission-v2-release.json'];
  if (!['PASS', 'NOT_APPLICABLE'].includes(mission?.status))
    failures.push('MISSION v2 final release gate did not PASS');
  if (mission?.candidate !== resolvedCandidate)
    failures.push('MISSION v2 release receipt is stale for candidate');
  if (mission?.applicability === 'NON_WEB') {
    if (mission?.status !== 'NOT_APPLICABLE' || mission?.decision !== 'NOT APPLICABLE' || !mission?.reason)
      failures.push('MISSION v2 non-web exception is incomplete');
  } else if (mission?.applicability === 'WEB') {
    const workLogFields = ['mode', 'outcome', 'target', 'constraints', 'contentPolicy', 'proof', 'ownership', 'commercialValue'];
    for (const field of workLogFields) if (!mission?.workLog?.[field]) failures.push(`MISSION v2 work log missing ${field}`);
    if (!['LOCKED', 'REDUCE_WITH_APPROVAL', 'REWRITE_WITH_APPROVAL'].includes(mission?.workLog?.contentPolicy))
      failures.push('MISSION v2 content policy is not declared');
    const proofFields = ['staticAndRoutes', 'browserViewports', 'interactions', 'visualEvidence', 'accessibility', 'performance'];
    for (const field of proofFields) if (mission?.proofMatrix?.[field] !== 'PASS') failures.push(`MISSION v2 proof matrix ${field} did not PASS`);
    if (!['PASS', 'NOT_YET_RELEASED'].includes(mission?.proofMatrix?.deployment)) failures.push('MISSION v2 deployment proof state is invalid');
    if (!Array.isArray(mission?.unverifiedItems)) failures.push('MISSION v2 UNVERIFIED register is missing');
    else if (mission.unverifiedItems.some((item) => !['RESOLVED', 'REMOVED_FROM_SCOPE', 'PRESERVED_CURRENT_WORKING_DESTINATION'].includes(item?.handling)))
      failures.push('MISSION v2 has an unresolved UNVERIFIED release item');
    if (!mission?.independentReview?.reviewerId || mission?.independentReview?.score < 8.5 || mission?.independentReview?.p0Remaining !== 0 || mission?.independentReview?.p1Remaining !== 0)
      failures.push('MISSION v2 independent review did not clear the release floor');
    if (!mission?.rollback) failures.push('MISSION v2 rollback target is missing');
  } else failures.push('MISSION v2 applicability is missing');
  if (receipts['simplicity-review.json']?.status !== 'PASS')
    failures.push('Instinct Simplicity Review did not PASS');
  if (receipts['simplicity-review.json']?.candidate !== resolvedCandidate)
    failures.push('Instinct Simplicity Review receipt is stale for candidate');
  if (!receipts['simplicity-review.json']?.reviewerId)
    failures.push('Instinct Simplicity Review reviewer identity is missing');
  if (!receipts['simplicity-review.json']?.frontDoor)
    failures.push('Instinct Simplicity Review front door is missing');
  if (!receipts['simplicity-review.json']?.before || !receipts['simplicity-review.json']?.after)
    failures.push('Instinct Simplicity Review journey burden is missing');
  if (!Array.isArray(receipts['simplicity-review.json']?.visualEvidence) || !receipts['simplicity-review.json'].visualEvidence.length)
    failures.push('Instinct Simplicity Review visual evidence is missing');
  if (!Array.isArray(receipts['simplicity-review.json']?.functionalEvidence) || !receipts['simplicity-review.json'].functionalEvidence.length)
    failures.push('Instinct Simplicity Review functional evidence is missing');
  if (!receipts['simplicity-review.json']?.operatorRecoveryPath)
    failures.push('Instinct Simplicity Review operator recovery path is missing');
  if (receipts['open-code-review.json']?.status !== 'PASS')
    failures.push('Open Code Review did not PASS');
  if (receipts['open-code-review.json']?.candidate !== resolvedCandidate)
    failures.push('Open Code Review receipt is stale for candidate');
  if (receipts['icm-cold-walk.json']?.status !== 'PASS')
    failures.push('ICM cold walk did not PASS');
  if (receipts['icm-cold-walk.json']?.candidate !== resolvedCandidate)
    failures.push('ICM cold walk receipt is stale for candidate');
  if (receipts['independent-review.json']?.status !== 'PASS')
    failures.push('independent review did not PASS');
  if (receipts['independent-review.json']?.candidate !== resolvedCandidate)
    failures.push('independent review receipt is stale for candidate');
  if (!receipts['independent-review.json']?.reviewerId || !receipts['independent-review.json']?.builderId)
    failures.push('independent review identities are missing');
  if (receipts['independent-review.json']?.reviewerId && receipts['independent-review.json']?.reviewerId === receipts['independent-review.json']?.builderId)
    failures.push('builder cannot be the independent reviewer');
  if (receipts['judge-verdict.json']?.verdict !== 'SHIP')
    failures.push('Judge did not return SHIP');
  if (receipts['judge-verdict.json']?.candidate !== resolvedCandidate)
    failures.push('Judge receipt is stale for candidate');
  const personalityRequired = receipts['judge-verdict.json']?.requiredGates?.includes('personality-drift');
  if (personalityRequired) {
    const personalityFile = receiptPath(root, 'personality-drift.json');
    if (!(await exists(personalityFile))) failures.push('missing personality-drift.json');
    else {
      try {
        const personality = await readJson(personalityFile);
        if (personality.status !== 'PASS') failures.push('personality drift gauntlet did not PASS');
        if (personality.candidate !== resolvedCandidate) failures.push('personality drift receipt is stale for candidate');
      } catch { failures.push('invalid personality-drift.json'); }
    }
  }
  return { status: failures.length ? 'HOLD' : 'SHIP', candidate: resolvedCandidate, failures };
}

function option(args, name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
}
async function main() {
  const [command, workspace = '.', ...args] = process.argv.slice(2);
  const root = path.resolve(workspace);
  let result;
  if (command === 'status') result = await inspectWorkspace(root);
  else if (command === 'walk') result = await recordWalk(root);
  else if (command === 'review')
    result = await review(root, {
      base: option(args, '--base'),
      candidate: option(args, '--candidate'),
    });
  else if (command === 'ship-gate')
    result = await shipGate(root, { candidate: option(args, '--candidate') });
  else
    throw new Error(
      'Usage: factory-control <status|walk|review|ship-gate> <workspace> [--base SHA --candidate SHA]',
    );
  console.log(JSON.stringify(result, null, 2));
  if (['HOLD', 'FAIL'].includes(result.status)) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname)
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
