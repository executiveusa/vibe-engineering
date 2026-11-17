import registry from '../../skills/workflows/registry.json' with { type: 'json' };
import { getSkill } from '../skills/index.mjs';

const ALIASES = {
  '00_intake': 'INTENT', '01_vision': 'SPEC', '02_blueprint': 'PLAN',
  '03_build': 'BUILD', '04_verify': 'PROOF', '05_council': 'COUNCIL',
  '06_judge': 'JUDGE', '07_ship': 'SHIP', '08_improve': 'OPERATE',
};
const FAMILY_NAMES = {
  codex: 'openai', gpt: 'openai', openai: 'openai',
  claude: 'anthropic', anthropic: 'anthropic',
  gemini: 'google', google: 'google', deepseek: 'deepseek',
  kimi: 'moonshot', qwen: 'alibaba', grok: 'xai',
};

export function modelFamily(value) {
  const model = String(value || '').toLowerCase();
  return Object.entries(FAMILY_NAMES).find(([alias]) => model.includes(alias))?.[1] || null;
}

function normalizeStage(value) {
  const stage = String(value || '').trim();
  const canonical = stage.toUpperCase();
  return ALIASES[stage] || (registry.stages[canonical] ? canonical : null);
}

function matchScore(query, term) {
  const safe = term.replace(/[^\w\s-]/g, '\\$&');
  return new RegExp('(^|[^a-z0-9])' + safe + '([^a-z0-9]|$)', 'i').test(query)
    ? (term.includes(' ') ? 6 : 4) : 0;
}

function brief(item) {
  return { id: item.id, title: item.title, entry: item.entry, icmStages: item.stages, stepCount: item.steps.length };
}

export function listWorkflows() {
  return registry.workflows.map(brief);
}

export function getWorkflow(id) {
  return registry.workflows.find((item) => item.id === id) || null;
}

export function listSkillSources(workflowId = null) {
  return registry.sources.filter((item) => !workflowId || item.workflow === workflowId);
}

export function routeWorkflow({ request = '', icmStage = null, workflowId = null, builderModel = null, reviewerModel = null, base = null, candidate = null, changedFiles = [] } = {}) {
  if (typeof request !== 'string' || request.length > 4000) throw new TypeError('request must be text of at most 4000 characters');
  if (workflowId && !getWorkflow(workflowId)) throw new TypeError('unknown workflowId');
  if (!Array.isArray(changedFiles) || changedFiles.length > 200 ||
    changedFiles.some((file) => typeof file !== 'string' || file.length > 260)) throw new TypeError('invalid changedFiles');
  const stage = normalizeStage(icmStage);
  const query = request.trim().toLowerCase();
  const ranked = registry.workflows.map((item) => ({
    item,
    score: item.terms.reduce((score, term) => score + matchScore(query, term), 0) +
      (stage && item.stages.includes(stage) ? 2 : 0),
  })).sort((a, b) => b.score - a.score);
  const fallback = registry.stages[stage] || 'w1-intake-to-spec';
  const selected = workflowId ? getWorkflow(workflowId) : ranked[0].score > (stage ? 2 : 0) ? ranked[0].item : getWorkflow(fallback);
  const eligible = new Set(selected.specialists);
  const specialists = registry.sources
    .filter((source) => eligible.has(source.id) || (source.workflow === selected.id && source.status === 'canonical'))
    .sort((a, b) => matchScore(query, b.title.toLowerCase()) - matchScore(query, a.title.toLowerCase()))
    .slice(0, 3).map((source) => ({
      ...source, activation: ['quarantined', 'unavailable'].includes(source.status) ? 'blocked' : 'reference-only',
    }));
  const codeChanged = changedFiles.some((name) =>
    /\.(?:[cm]?js|jsx|tsx?|py|go|rs|java|cs|rb|php|css|html|vue|svelte|sh|sql)$/i.test(name));
  const codeReviewRequired = codeChanged || ['w2-build', 'w3-proof-and-review', 'w5-web-design', 'w4-ship-and-operate'].includes(selected.id);
  const builderFamily = modelFamily(builderModel);
  const reviewerFamily = modelFamily(reviewerModel);
  const reviewerStatus = !reviewerModel ? 'PICK_REVIEW_MODEL' :
    builderFamily && reviewerFamily && builderFamily !== reviewerFamily ? 'READY_FOR_DISPATCH' : 'INDEPENDENCE_UNVERIFIED';
  const safeRef = (input, fallbackRef) => typeof input === 'string' && /^[A-Za-z0-9._/-]{1,120}$/.test(input) ? input : fallbackRef;
  const candidateSha = typeof candidate === 'string' && /^[0-9a-f]{40}$/i.test(candidate) ? candidate : null;
  const command = 'ocr review --from ' + safeRef(base, '<base>') + ' --to ' + safeRef(candidate, '<candidate>');

  return {
    registryVersion: registry.version, workflow: brief(selected), icmStage: stage,
    readOrder: [...registry.icm, registry.authority, selected.entry],
    lazyLoadRule: 'Read only the selected workflow and its current step source; do not preload the full skills directory or untrusted external repositories.',
    steps: selected.steps.map((step, index) => ({
      order: index + 1, ...step, summary: getSkill(step.skill)?.summary || '',
      load: 'load only at this step',
    })),
    specialists,
    review: {
      required: true,
      codeReview: { engine: registry.review.codeEngine, required: codeReviewRequired,
        automaticGate: registry.review.automaticGate, candidateSha, command, status: 'NOT_EXECUTED' },
      independent: {
        builderModel: builderModel || null, reviewerModel: reviewerModel || null,
        state: reviewerStatus, reviewPrompt:
          'Independent reviewer: inspect the exact candidate, current ICM contract, code and tests. Evaluate security, bugs, prompt-injection handling, user journeys, accessibility where relevant, ownership, rollback and missing proof. Record concrete findings with evidence. Do not edit, approve, or judge your own work.',
      },
      judge: registry.review.judge,
    },
    next: 'Run the current step, retain source attribution and evidence, then follow the ICM gate. No execution has occurred from this routing response.',
  };
}

export async function dispatchIndependentReview(packet, adapter) {
  if (!packet?.review?.independent) throw new TypeError('review packet required');
  if (packet.review.independent.state !== 'READY_FOR_DISPATCH' ||
      !modelFamily(packet.review.independent.builderModel) ||
      !modelFamily(packet.review.independent.reviewerModel) ||
      modelFamily(packet.review.independent.builderModel) === modelFamily(packet.review.independent.reviewerModel)) {
    return { status: 'HOLD', reason: 'REVIEWER_INDEPENDENCE_REQUIRED' };
  }
  if (packet.review.codeReview.required && !packet.review.codeReview.candidateSha) {
    return { status: 'HOLD', reason: 'EXACT_CANDIDATE_REQUIRED' };
  }
  if (typeof adapter !== 'function') {
    return { status: 'PENDING_ADAPTER', reason: 'Connect an authorized Hermes/agent runtime. No subagent was contacted.' };
  }
  const result = await adapter({
    role: 'independent-reviewer',
    reviewerModel: packet.review.independent.reviewerModel,
    workflow: packet.workflow.id,
    instructions: packet.review.independent.reviewPrompt,
    codeReview: packet.review.codeReview,
  });
  return { status: 'DISPATCH_REQUESTED', result, verdict: 'HOLD', note: 'A reviewer receipt tied to the candidate is still required.' };
}
