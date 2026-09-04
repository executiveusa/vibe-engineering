import { SKILLS as CORE_SKILLS } from './catalog.mjs';

const SETUP_VIBE = Object.freeze({
  id: 'setup-vibe',
  title: 'Setup Vibe',
  summary: 'Configure a repository so Vibe skills know where context, decisions, work tracking, proof, release authority, and rollback live.',
  invocation: 'user',
  category: 'engineering',
  aliases: ['setup'],
  outputs: ['repo skill configuration'],
  steps: [
    'Inspect existing repository policy, context, decision records, issue tracking, CI, and deployment conventions before adding anything.',
    'Reuse existing files and workflows instead of creating parallel Vibe-only structure.',
    'Resolve only the missing choices that other skills need: work tracker, shared language, durable decisions, merge proof, release authority, and rollback.',
    'Preview material authority, release, or destructive setup changes and require explicit owner approval before applying them.',
    'Leave the repository with clear pointers that grill, spec, tickets, review, proof, and ship can follow without guessing.',
  ],
  attribution: 'Inspired by the setup/configuration pattern in mattpocock/skills (MIT); re-authored for Vibe Engineering.',
});

const PROJECT_REVIEW = Object.freeze({
  id: 'project-review',
  title: 'Project Review',
  summary: 'Run an independent, system-aware review before serious work can be called finished or ready to ship.',
  invocation: 'both',
  category: 'governance',
  aliases: ['system-review'],
  outputs: ['structured review findings', 'system-impact review evidence'],
  steps: [
    'Review the exact candidate revision or changed range; do not review an approximate or stale diff.',
    'Use executiveusa/open-code-review as the primary code-review engine, then add Vibe system-impact review around its findings.',
    'Check findings against the whole affected system: callers, contracts, auth/security, data/state, user journeys, tests, deployment, and connected repositories.',
    'Keep review independent from the builder whenever practical. The builder may answer findings but cannot be the only approver.',
    'Resolve, explicitly accept, or escalate material findings. Do not hide unresolved defects behind a score or summary.',
    'Pass the reviewed candidate into stop-slop, taste, proof, and release authority. Project Review never self-authorizes SHIP.',
  ],
  attribution: 'Backed by executiveusa/open-code-review, a Vibe-adapted fork of Alibaba OpenCodeReview (Apache-2.0), combined with Vibe Engineering system-impact and release-governance rules.',
});

const DOMINANT_REVIEW = Object.freeze({
  id: 'review',
  title: 'Review',
  summary: 'Run OpenCodeReview as the dominant code-review engine, then apply Vibe product and system judgment before work can advance.',
  invocation: 'both',
  category: 'engineering',
  aliases: ['open-code-review', 'ocr', 'code-review', 'ocr-review'],
  outputs: ['OpenCodeReview findings', 'resolved review ledger', 're-reviewed exact candidate'],
  steps: [
    'Freeze the exact commit, branch range, or workspace diff being reviewed. Never review an approximate or stale candidate.',
    'Run executiveusa/open-code-review first. Prefer `ocr review --from <base> --to <candidate>` for branch work, `ocr review --commit <sha>` for a single commit, or delegation mode when the current coding agent should supply the model.',
    'Treat OpenCodeReview deterministic file selection, bundling, rule matching, comment positioning, and reflection as the primary code-review machinery. Do not replace it with a generic free-form agent pass.',
    'Use Vibe around that engine to check spec fidelity and whole-system consequence: callers, contracts, auth/security, data/state, user journeys, tests, deployment, ownership, and connected repositories.',
    'Resolve, explicitly accept, or escalate every material finding. The builder may repair findings but cannot be the sole approver of consequential work.',
    'Re-run OpenCodeReview against the final exact candidate after fixes so the reviewed revision and the proposed release revision are the same.',
    'Only after the code-review engine is clean enough for the project risk level, continue through stop-slop, taste, proof, and ship authority. Review never authorizes release by itself.',
  ],
  attribution: 'Primary engine: executiveusa/open-code-review, derived from Alibaba OpenCodeReview (Apache-2.0). Vibe Engineering supplies spec fidelity, system impact, product quality, proof, sovereignty, and release-governance overlays.',
});

const ORDERED_CORE_SKILLS = CORE_SKILLS.map((item) => item.id === 'review' ? DOMINANT_REVIEW : item);

export const SKILLS = Object.freeze([SETUP_VIBE, PROJECT_REVIEW, ...ORDERED_CORE_SKILLS]);

const BY_ID = new Map(SKILLS.map((item) => [item.id, item]));
for (const item of SKILLS) for (const alias of item.aliases ?? []) BY_ID.set(alias, item);

export function listSkills() {
  return SKILLS.map(({ steps, ...meta }) => ({ ...meta, stepCount: steps.length }));
}

export function getSkill(id) {
  return BY_ID.get(id) ?? null;
}

export function runSkill(id, input = {}) {
  const found = getSkill(id);
  if (!found) return null;
  return {
    skill: found,
    input,
    execution: {
      mode: 'agent-procedure',
      instructions: found.steps,
      completionRule: 'Do not claim completion until the requested outcome is satisfied and relevant proof is attached.',
      next: null,
    },
  };
}
