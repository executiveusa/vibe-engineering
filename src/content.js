export const stages = [
  { number: '01', title: 'Vision', text: 'Name the outcome, owner, user, and reason before touching the tools.' },
  { number: '02', title: 'Blueprint', text: 'Turn the idea into a small contract with boundaries, risks, and proof.' },
  { number: '03', title: 'Build', text: 'Let AI execute inside the contract—not improvise around it.' },
  { number: '04', title: 'Verify', text: 'Check assumptions, behavior, security, accessibility, and evidence.' },
  { number: '05', title: 'Council', text: 'Use independent perspectives to challenge the work before release.' },
  { number: '06', title: 'Judge', text: 'Score the result against one visible standard and hard release gates.' },
  { number: '07', title: 'Ship', text: 'Release only what is understandable, reversible, and owned.' },
  { number: '08', title: 'Improve', text: 'Learn from real use, preserve what works, and strengthen the system.' },
];

export const council = [
  { role: 'Architect', call: 'Will it hold?', text: 'Checks boundaries, dependencies, data flow, and long-term structure.' },
  { role: 'Breaker', call: 'How does it fail?', text: 'Attacks assumptions, edge cases, permissions, and rollback paths.' },
  { role: 'Operator', call: 'Can it run?', text: 'Checks deployment, observability, maintenance, and recovery.' },
  { role: 'Advocate', call: 'Can people use it?', text: 'Checks clarity, accessibility, friction, and human consequences.' },
  { role: 'Taste Judge', call: 'Does it deserve attention?', text: 'Cuts noise, inconsistency, imitation, and unfinished visual decisions.' },
  { role: 'Sovereignty Steward', call: 'Who owns the future?', text: 'Checks exportability, access, data custody, lock-in, and consent.' },
];

export const system = [
  { title: 'Vibe Spec', text: 'Plain-language product contract: outcome, scope, constraints, proof, and ownership.' },
  { title: 'Vibe Flow', text: 'Repeatable sequence of gates that prevents agents from skipping the hard parts.' },
  { title: 'Vibe Council', text: 'Independent reviewers that disagree on purpose instead of echoing one builder.' },
  { title: 'Vibe Judge', text: 'Final release authority with explicit ship, hold, or reject decisions.' },
  { title: 'Vibe Score', text: 'A visible 0–10 quality standard with an 8.5 release floor and hard stops.' },
];

export const comparison = [
  ['Prompt and hope', 'Specify and prove'],
  ['One model agrees with itself', 'Independent reviewers challenge it'],
  ['Looks finished', 'Passes measurable gates'],
  ['Hidden assumptions', 'Visible decisions and evidence'],
  ['Ship first, repair later', 'Rollback before release'],
  ['Platform owns the workflow', 'Builder owns code, data, and access'],
];

export const offers = [
  {
    eyebrow: 'Learn it',
    title: 'Free foundation',
    text: 'Use the open prompt, scorecard, and project contract to train your AI to build with discipline.',
    cta: 'Download the prompt',
    href: '/vibe-engineering-foundation-prompt.md',
  },
  {
    eyebrow: 'Install it',
    title: 'Guided setup',
    text: 'We adapt the method to your stack, agents, risks, language, and release process.',
    cta: 'View the method',
    href: '#method',
  },
  {
    eyebrow: 'Deploy it',
    title: 'Done-for-you systems',
    text: 'We design and ship the product. You receive the code, data, accounts, documentation, and operating knowledge.',
    cta: 'Read the pledge',
    href: '#ownership',
  },
];

export const faqs = [
  ['Do I need to know how to code?', 'No. You need to define outcomes, make tradeoffs, and recognize proof. The system translates those decisions into technical gates.'],
  ['Is this another AI coding tool?', 'No. Vibe Engineering is a method that can govern many tools, models, agents, and stacks.'],
  ['Does the Council replace human judgment?', 'No. It makes judgment structured, visible, and harder to skip. Humans still approve consequential product, legal, financial, and relationship decisions.'],
  ['Why is the release floor 8.5?', 'Because average work should not be marketed as finished. The floor creates a shared standard while hard stops prevent strong visuals from hiding security, reliability, or ownership failures.'],
  ['What do you charge for?', 'Human time and compute. Not artificial dependence. Once a deliverable is purchased, the customer receives the agreed code, data, accounts, workflows, and documentation.'],
];
