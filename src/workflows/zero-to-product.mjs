const phase = (id, title, outcome, primary, support = []) => Object.freeze({ id, title, outcome, primary, support });

export const ZERO_TO_PRODUCT_WORKFLOW = Object.freeze({
  id: 'zero-to-product',
  title: 'Zero to Finished Product',
  audience: 'Non-technical founders and operators using any capable AI agent.',
  promise: 'Start with a fuzzy idea and finish with a proven, reviewable, releasable product without needing an agent swarm.',
  entry: 'Read AGENTS.md. Follow Vibe. Verify It Before Everything.',
  reviewEngine: Object.freeze({
    repository: 'https://github.com/executiveusa/open-code-review',
    role: 'primary-code-review-engine',
    note: 'OpenCodeReview owns deterministic code-review execution. Vibe adds product intent, system impact, taste, proof, sovereignty, and human release authority around it.',
  }),
  phases: Object.freeze([
    phase('00-start', 'Start', 'Get the project walkable and understand what Vibe is doing.', ['setup-vibe', 'ask-vibe'], ['explain', 'teach']),
    phase('01-discover', 'Discover the idea', 'Turn feelings, goals, and assumptions into explicit decisions.', ['grill-idea', 'grill'], ['interview', 'ask-human', 'research', 'language']),
    phase('02-define', 'Define the target', 'Name the outcome, standard, boundaries, and proof before building.', ['map', 'spec'], ['prototype']),
    phase('03-plan', 'Plan the build', 'Turn the approved target into small, ordered, verifiable work.', ['tickets'], ['architecture-check', 'module-design', 'triage']),
    phase('04-build', 'Build one slice at a time', 'Create the product without losing the agreed intent.', ['build'], ['test-first', 'debug', 'deep-work']),
    phase('05-review', 'Review what was built', 'Use deterministic code review first, then judge product quality and system impact.', ['review', 'project-review'], ['stop-slop', 'taste', 'human-voice', 'agent-docs']),
    phase('06-prove', 'Prove the claims', 'Turn looks-done into evidence tied to the exact candidate revision.', ['proof']),
    phase('07-integrate', 'Integrate safely', 'Combine approved work without losing intent or introducing hidden breakage.', ['merge'], ['handoff']),
    phase('08-release', 'Release with control', 'Ship only the exact proven revision with human authority and rollback.', ['ship'], ['human-step']),
    phase('09-learn', 'Learn and repeat', 'Preserve what worked so the next cycle starts smarter.', ['handoff'], ['teach', 'ask-vibe']),
  ]),
});

export const ZERO_TO_PRODUCT_SKILL_IDS = Object.freeze([...new Set(
  ZERO_TO_PRODUCT_WORKFLOW.phases.flatMap((item) => [...item.primary, ...item.support]),
)]);
