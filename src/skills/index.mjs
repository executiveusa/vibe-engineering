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
    'Show material authority or release changes to the owner before applying them.',
    'Leave the repository with clear pointers that grill, spec, tickets, review, proof, and ship can follow without guessing.',
  ],
  attribution: 'Inspired by the setup/configuration pattern in mattpocock/skills (MIT); re-authored for Vibe Engineering.',
});

export const SKILLS = Object.freeze([SETUP_VIBE, ...CORE_SKILLS]);

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
      next: found.id === 'ship' ? null : 'proof',
    },
  };
}
