#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VibeTruthClient } from '../packages/truth-sdk/index.mjs';
import { getIcmBackendMap, getSkill, listSkills, runIcmWalk, runSkill } from '../icm/backend/index.mjs';
import { ZERO_TO_PRODUCT_WORKFLOW } from '../src/workflows/zero-to-product.mjs';
import { installVibe } from './install-vibe.mjs';

const [command, ...args] = process.argv.slice(2);
const client = new VibeTruthClient({ baseUrl: process.env.VIBE_TRUTH_API_URL ?? 'http://localhost:4317' });

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

if (command === 'install' || command === 'init') {
  const force = args.includes('--force');
  const skills = !args.includes('--no-skills');
  const targetArg = args.find((arg) => !arg.startsWith('--')) ?? process.cwd();
  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const sourceRoot = path.resolve(scriptDir, '..');
  const result = await installVibe({ target: targetArg, force, skills }, sourceRoot);
  print({
    ok: true,
    target: result.target,
    written: result.written,
    preserved: result.skipped,
    skillsInstalled: result.skills,
    next: 'Run `vibe journey`, then tell your agent: Read AGENTS.md. Follow Vibe. Verify It Before Everything.',
  });
} else if (command === 'journey' || command === 'zero-to-product') {
  print(ZERO_TO_PRODUCT_WORKFLOW);
} else if (command === 'map') {
  print(getIcmBackendMap());
} else if (command === 'walk') {
  const result = await runIcmWalk();
  print(result);
  if (!result.ok) process.exitCode = 1;
} else if (command === 'method') {
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
  print(await client.resolveContext({ project: { repository, mode: 'brownfield' }, task: { type: 'software-change', consequenceLevel } }));
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
    what: 'Vibe Engineering is an open-source quality layer for building with AI without letting speed turn into slop.',
    why: 'AI can generate fast. Vibe keeps intent, standards, evidence, ownership, and proof visible so capable agents can work inside one walkable filesystem.',
    start: ['vibe install .', 'vibe journey', 'vibe run grill-idea "my idea"', 'vibe run spec "define the target"', 'vibe run review "review the candidate"', 'vibe run proof "prove this release"'],
  });
} else {
  console.error('Usage: vibe <install|init|journey|zero-to-product|explain|map|walk|skills|skill|run|method|manifest|truth|workflow|context> [arguments]');
  console.error('  vibe install .                     Install Vibe into the current project');
  console.error('  vibe journey                       Show the beginner zero-to-product workflow');
  console.error('  vibe install ./app --force         Refresh Vibe-managed files intentionally');
  console.error('  vibe map                           Print the ICM backend map');
  console.error('  vibe walk                          Run the deterministic ICM walk test');
  console.error('  vibe skills                        List callable Vibe skills');
  console.error('  vibe skill grill                   Read one skill');
  console.error('  vibe run review "review PR 12"     Use the dominant OpenCodeReview-backed review skill');
  process.exitCode = 1;
}
