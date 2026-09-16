#!/usr/bin/env node
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
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
  const args = ['review', '--from', resolvedBase, '--to', resolvedCandidate];
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
    status: result.status === 0 ? 'PASS' : 'HOLD',
    exitCode: result.status,
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
    'open-code-review.json',
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
  if (receipts['open-code-review.json']?.status !== 'PASS')
    failures.push('Open Code Review did not PASS');
  if (receipts['open-code-review.json']?.candidate !== resolvedCandidate)
    failures.push('Open Code Review receipt is stale for candidate');
  if (receipts['icm-cold-walk.json']?.status !== 'PASS')
    failures.push('ICM cold walk did not PASS');
  if (receipts['independent-review.json']?.status !== 'PASS')
    failures.push('independent review did not PASS');
  if (receipts['judge-verdict.json']?.verdict !== 'SHIP')
    failures.push('Judge did not return SHIP');
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
