import fs from 'node:fs/promises';
import path from 'node:path';
import { ZERO_TO_PRODUCT_WORKFLOW } from '../workflows/zero-to-product.mjs';
import { runAutomaticGateChecks } from './automatic-gates.mjs';

const STATE_DIR = '.vibe';
const RECEIPTS_DIR = path.join(STATE_DIR, 'receipts');
const CURRENT_FILE = path.join(STATE_DIR, 'CURRENT.json');

const DEFAULT_GATES = Object.freeze({
  '00-start': ['project-walkable', 'owner-intent-named'],
  '01-discover': ['user-and-problem-clear', 'critical-assumptions-recorded'],
  '02-define': ['outcome-clear', 'standard-clear', 'acceptance-testable', 'non-goals-recorded'],
  '03-plan': ['slices-ordered', 'dependencies-visible', 'proof-defined'],
  '04-build': ['slice-complete', 'tests-pass', 'build-pass'],
  '05-review': ['open-code-review-pass', 'material-findings-resolved', 'stop-slop-pass', 'taste-pass'],
  '06-prove': ['claims-mapped-to-evidence', 'exact-candidate-proven'],
  '07-integrate': ['integration-coherent', 'affected-tests-pass'],
  '08-release': ['owner-ship-authority', 'rollback-ready', 'production-smoke-pass'],
  '09-learn': ['handoff-written', 'retrospective-written'],
});

function stageById(id) {
  return ZERO_TO_PRODUCT_WORKFLOW.phases.find((stage) => stage.id === id) ?? null;
}

function stageIndex(id) {
  return ZERO_TO_PRODUCT_WORKFLOW.phases.findIndex((stage) => stage.id === id);
}

async function ensureDir(root, relative) {
  await fs.mkdir(path.join(root, relative), { recursive: true });
}

export async function initJourney(root = process.cwd()) {
  await ensureDir(root, RECEIPTS_DIR);
  const first = ZERO_TO_PRODUCT_WORKFLOW.phases[0];
  const state = {
    workflow: ZERO_TO_PRODUCT_WORKFLOW.id,
    currentStage: first.id,
    currentLevel: 1,
    status: 'ACTIVE',
    completed: [],
    law: 'A stage advances only when every declared gate passes and a durable receipt is written.',
  };
  await fs.writeFile(path.join(root, CURRENT_FILE), JSON.stringify(state, null, 2) + '\n');
  return state;
}

export async function readJourney(root = process.cwd()) {
  try {
    return JSON.parse(await fs.readFile(path.join(root, CURRENT_FILE), 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return initJourney(root);
    throw error;
  }
}

export async function getJourneyStatus(root = process.cwd()) {
  const state = await readJourney(root);
  const stage = stageById(state.currentStage);
  return {
    ...state,
    stage,
    gates: DEFAULT_GATES[state.currentStage] ?? [],
  };
}

export function evaluateGateResults(stageId, gateResults = {}) {
  const required = DEFAULT_GATES[stageId] ?? [];
  const results = required.map((id) => ({ id, pass: gateResults[id] === true }));
  const failed = results.filter((item) => !item.pass).map((item) => item.id);
  return { required, results, failed, pass: failed.length === 0 };
}

export async function verifyJourneyStage({ root = process.cwd(), gateResults = {}, evidence = [], diagnostics = {}, candidate = null, approvedBy = null } = {}) {
  const state = await readJourney(root);
  const evaluation = evaluateGateResults(state.currentStage, gateResults);
  if (!evaluation.pass) {
    const failedDiagnostics = Object.fromEntries(evaluation.failed.map((id) => [id, diagnostics[id] ?? { pass: false }]));
    return {
      verdict: 'HOLD',
      stage: state.currentStage,
      failed: evaluation.failed,
      diagnostics: failedDiagnostics,
      next: null,
      evidence,
      message: 'Stage cannot advance until every declared gate passes.',
    };
  }

  const idx = stageIndex(state.currentStage);
  const nextStage = ZERO_TO_PRODUCT_WORKFLOW.phases[idx + 1] ?? null;
  const receipt = {
    workflow: ZERO_TO_PRODUCT_WORKFLOW.id,
    stage: state.currentStage,
    status: 'PASS',
    candidate,
    approvedBy,
    gates: evaluation.results,
    evidence: [...new Set(evidence)],
    next: nextStage?.id ?? null,
    createdAt: new Date().toISOString(),
  };

  await ensureDir(root, RECEIPTS_DIR);
  const receiptPath = path.join(RECEIPTS_DIR, `${state.currentStage}.json`);
  await fs.writeFile(path.join(root, receiptPath), JSON.stringify(receipt, null, 2) + '\n');

  const nextState = {
    ...state,
    status: nextStage ? 'ACTIVE' : 'COMPLETE',
    completed: [...new Set([...(state.completed ?? []), state.currentStage])],
    currentStage: nextStage?.id ?? state.currentStage,
    currentLevel: nextStage ? idx + 2 : idx + 1,
    previousReceipt: receiptPath,
  };
  await fs.writeFile(path.join(root, CURRENT_FILE), JSON.stringify(nextState, null, 2) + '\n');

  return {
    verdict: nextStage ? 'ADVANCE' : 'COMPLETE',
    receipt: receiptPath,
    completedStage: receipt.stage,
    next: nextStage?.id ?? null,
    state: nextState,
  };
}

export async function verifyJourneyStageAutomatically({ root = process.cwd(), candidate = null, approvedBy = null, commandRunner } = {}) {
  const state = await readJourney(root);
  const automatic = await runAutomaticGateChecks({ root, stageId: state.currentStage, candidate, commandRunner });
  return verifyJourneyStage({
    root,
    gateResults: automatic.gateResults,
    evidence: automatic.evidence,
    diagnostics: automatic.diagnostics,
    candidate,
    approvedBy,
  });
}

export { DEFAULT_GATES };
