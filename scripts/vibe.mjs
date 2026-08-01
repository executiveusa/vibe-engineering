import process from 'node:process';
import { VibeTruthClient } from '../packages/truth-sdk/index.mjs';

const [command, ...args] = process.argv.slice(2);
const client = new VibeTruthClient({ baseUrl: process.env.VIBE_TRUTH_API_URL ?? 'http://localhost:4317' });

if (command === 'manifest') {
  console.log(JSON.stringify(await client.manifest(), null, 2));
} else if (command === 'truth') {
  if (!args[0]) throw new Error('Usage: vibe truth <artifact-id>');
  console.log(JSON.stringify(await client.truth(args[0]), null, 2));
} else if (command === 'workflow') {
  if (!args[0]) throw new Error('Usage: vibe workflow <workflow-id>');
  console.log(JSON.stringify(await client.workflow(args[0]), null, 2));
} else if (command === 'context') {
  const repository = args[0] ?? null;
  const consequenceLevel = args[1] ?? 'medium';
  console.log(JSON.stringify(await client.resolveContext({
    project: { repository, mode: 'brownfield' },
    task: { type: 'software-change', consequenceLevel },
  }), null, 2));
} else {
  console.error('Usage: vibe <manifest|truth|workflow|context> [arguments]');
  process.exitCode = 1;
}
