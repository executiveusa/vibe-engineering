import process from 'node:process';
import { VibeTruthClient } from '../packages/truth-sdk/index.mjs';
import { getSkill, listSkills, runSkill } from '../src/skills/catalog.mjs';

const [command, ...args] = process.argv.slice(2);
const client = new VibeTruthClient({ baseUrl: process.env.VIBE_TRUTH_API_URL ?? 'http://localhost:4317' });

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

if (command === 'method') {
  print(await client.method());
} else if (command === 'manifest') {
  print(await client.manifest());
} else if (command === 'truth') {
  if (!args[0]) throw new Error('Usage: vibe truth <artifact-id>');
  print(await client.truth(args[0]));
} else if (command === 'workflow') {
  if (!args[0]) throw new Error('Usage: vibe workflow <workflow-id>');
  print(await client.workflow(args[0]));
} else if (command === 'context') {
  const repository = args[0] ?? null;
  const consequenceLevel = args[1] ?? 'medium';
  print(await client.resolveContext({
    project: { repository, mode: 'brownfield' },
    task: { type: 'software-change', consequenceLevel },
  }));
} else if (command === 'skills') {
  print({ skills: listSkills() });
} else if (command === 'skill') {
  if (!args[0]) throw new Error('Usage: vibe skill <id>');
  const found = getSkill(args[0]);
  if (!found) throw new Error(`Unknown skill: ${args[0]}`);
  print(found);
} else if (command === 'run') {
  if (!args[0]) throw new Error('Usage: vibe run <skill-id> [input]');
  const input = args.slice(1).join(' ');
  const result = runSkill(args[0], input ? { request: input } : {});
  if (!result) throw new Error(`Unknown skill: ${args[0]}`);
  print(result);
} else if (command === 'explain') {
  print({
    what: 'Vibe Engineering is an open-source set of skills for building with AI without letting speed turn into slop.',
    why: 'AI can generate fast. It cannot decide what you meant, what good looks like, or whether the result actually works. Vibe keeps those human decisions visible and makes agents prove important claims before they call work done.',
    start: ['vibe skills', 'vibe run grill "my idea"', 'vibe run stop-slop "review this"', 'vibe run proof "check this release"'],
  });
} else {
  console.error('Usage: vibe <explain|skills|skill|run|method|manifest|truth|workflow|context> [arguments]');
  console.error('  vibe explain                       Plain-English overview');
  console.error('  vibe skills                        List callable Vibe skills');
  console.error('  vibe skill grill                   Read one skill');
  console.error('  vibe run stop-slop "review copy"   Get an execution packet');
  process.exitCode = 1;
}
