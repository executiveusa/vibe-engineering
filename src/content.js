export const journey = [
  {
    number: '01',
    kicker: 'The door opened',
    title: 'You can build now.',
    text: 'We grew up being told you needed a whole team, a lot of money, or years of technical experience to build something real. AI changed that.',
    signal: 'ACCESS',
  },
  {
    number: '02',
    kicker: 'Speed needs judgment',
    title: 'Fast is not the same as right.',
    text: 'AI can move quickly. Your job is to know what deserves to move forward, what needs another look, and what should never have been built in the first place.',
    signal: 'JUDGMENT',
  },
  {
    number: '03',
    kicker: 'The habit',
    title: 'Verify It Before Everything.',
    text: 'Before you follow the idea, test it. Before you trust the answer, check it. Before you build the whole thing, understand the first piece. Before you move fast, know where you are going.',
    signal: 'V.I.B.E.',
  },
  {
    number: '04',
    kicker: 'Systems thinking',
    title: 'See what connects.',
    text: 'A decision never lives by itself. Learn to see what it changes, what it depends on, who it affects, and what it makes easier or harder next.',
    signal: 'CONNECT',
  },
  {
    number: '05',
    kicker: 'First principles',
    title: 'Get back to what is true.',
    text: 'Strip away the hype, the template, and the way everybody else does it. Start with the real problem, the real person, and the few facts the idea cannot work without.',
    signal: 'TRUTH',
  },
  {
    number: '06',
    kicker: 'Discipline',
    title: 'Build one piece. Prove it. Keep moving.',
    text: 'Big ideas become real through small finished moves. Make the next piece clear enough to build, test, understand, and change without losing control of the whole thing.',
    signal: 'PROOF',
  },
  {
    number: '07',
    kicker: 'Ownership',
    title: 'Learn the game. Build your own.',
    text: 'The goal is bigger than learning AI. It is learning how to think clearly, create with purpose, and build a life where your ideas can actually take you somewhere.',
    signal: 'OWN IT',
  },
];

export const stages = [
  { number: '00', action: 'Choose', title: 'Intake', text: 'Decide if the idea is worth the time before the build starts.' },
  { number: '01', action: 'See', title: 'Vision', text: 'Know the person, the problem, the outcome, and why it matters.' },
  { number: '02', action: 'Shape', title: 'Blueprint', text: 'Turn the idea into a clear plan with a standard and proof.' },
  { number: '03', action: 'Make', title: 'Build', text: 'Build one useful piece at a time without wandering.' },
  { number: '04', action: 'Prove', title: 'Verify', text: 'Test the claim against reality, not confidence.' },
  { number: '05', action: 'Challenge', title: 'Council', text: 'Give fresh eyes permission to find what the builder missed.' },
  { number: '06', action: 'Decide', title: 'Judge', text: 'Ship only when the work clears the standard and the hard stops.' },
  { number: '07', action: 'Release', title: 'Ship', text: 'Put it into the real world with ownership and a way back.' },
  { number: '08', action: 'Learn', title: 'Improve', text: 'Watch what happens, keep what works, and make the system stronger.' },
];

export const qualityLayers = [
  { title: 'Idea', question: 'Is this real?', text: 'Research the instinct, the audience, what is already proven, and what is still a bet.' },
  { title: 'Experience', question: 'Does it feel intentional?', text: 'Remove generic AI defaults. Use references, taste, accessibility, and a clear reason for every choice.' },
  { title: 'Build', question: 'Will it hold?', text: 'Keep the architecture understandable, the slices small, the code testable, and the rollback real.' },
  { title: 'Business', question: 'Does it create value?', text: 'Measure what changed for the customer. Retention should come from results, not dependence.' },
];

export const council = [
  { role: 'User', call: 'Does this help me?', text: 'Checks whether the work makes sense to the person it is meant for.' },
  { role: 'Taste', call: 'Does this feel finished?', text: 'Cuts generic patterns, noise, imitation, and weak creative choices.' },
  { role: 'Architecture', call: 'Will this still make sense later?', text: 'Checks structure, dependencies, boundaries, and the cost of future change.' },
  { role: 'Failure', call: 'What breaks first?', text: 'Looks for edge cases, bad assumptions, recovery gaps, and missing rollback.' },
  { role: 'Sovereignty', call: 'Who keeps control?', text: 'Checks ownership of code, data, accounts, access, exports, and decisions.' },
  { role: 'Proof', call: 'What makes this true?', text: 'Rejects claims that do not have evidence from the real target environment.' },
];

export const faqs = [
  ['Do I need to be a programmer?', 'No. You need to learn how to ask better questions, make tradeoffs, recognize proof, and keep control of what you create.'],
  ['Is Vibe Engineering only about AI?', 'No. AI is one tool. The larger practice is systems thinking, critical thinking, first principles, discipline, taste, and ownership.'],
  ['What does V.I.B.E. mean?', 'Verify It Before Everything. Check the idea, the answer, the work, and the claim before you build the next layer on top of it.'],
  ['Why call this Client Zero?', 'Because Vibe Engineering has to survive its own rules before we ask another creator, team, or customer to trust them.'],
];
