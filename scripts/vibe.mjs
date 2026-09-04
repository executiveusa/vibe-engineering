#!/usr/bin/env node
import process from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { VibeTruthClient } from '../packages/truth-sdk/index.mjs';
import { getIcmBackendMap, getSkill, listSkills, runIcmWalk, runSkill } from '../icm/backend/index.mjs';
import { getJourneyStatus, verifyJourneyStage, verifyJourneyStageAutomatically } from '../src/journey/engine.mjs';
import { ZERO_TO_PRODUCT_WORKFLOW } from '../src/workflows/zero-to-product.mjs';
import { installVibe } from './install-vibe.mjs';

const [command, ...args] = process.argv.slice(2);
const client = new VibeTruthClient({ baseUrl: process.env.VIBE_TRUTH_API_URL ?? 'http://localhost:4317' });

function print(value) {
  console.log(JSON.stringify(value, null, 2));
}

function option(name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? null : null;
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
    next: 'Run `vibe journey` for guided mode or `vibe loop` for long-running Loop Engineering mode.',
  });
} else if (command === 'journey' || command === 'zero-to-product') {
  print(ZERO_TO_PRODUCT_WORKFLOW);
} else if (command === 'loop' || command === 'long-run' || command === 'loop-engineering') {
  const request = args.join(' ');
  const result = runSkill('loop-engineering', request ? { request } : {});
  if (!result) throw new Error('Loop Engineering skill is not registered.');
  print({
    mode: 'loop-engineering',
    pluginCommand: '/vibe-loop',
    lifecycle: 'INTENT -> BAR -> LOCK -> EVIDENCE -> GRAPH -> SPEC -> SLICE -> BUILD -> VERIFY -> GAUNTLET -> RELEASE -> LEARN',
    execution: result,
  });
} else if (command === 'status') {
  print(await getJourneyStatus(process.cwd()));
} else if (command === 'verify-stage') {
  const candidate = option('--candidate');
  const approvedBy = option('--approved-by');
  if (args.includes('--manual')) {
    const payloadText = option('--manual');
    const payload = payloadText ? JSON.parse(payloadText) : {};
    print(await verifyJourneyStage({ root: process.cwd(), ...payload, candidate: payload.candidate ?? candidate, approvedBy: payload.approvedBy ?? approvedBy }));
  } else {
    print(await verifyJourneyStageAutomatically({ root: process.cwd(), candidate, approvedBy }));
  }
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
    modes: ['vibe journey — guided stage-by-stage mode', 'vibe loop — long-running Loop Engineering mode'],
    start: ['vibe install .', 'vibe journey', 'vibe loop "build the product end to end"', 'vibe status', 'vibe verify-stage', 'vibe run review "review the candidate"'],
  });
} else {
  console.error('Usage: vibe <install|init|journey|zero-to-product|loop|long-run|loop-engineering|status|verify-stage|explain|map|walk|skills|skill|run|method|manifest|truth|workflow|context> [arguments]');
  console.error('  vibe install .                     Install Vibe into the current project');
  console.error('  vibe journey                       Guided zero-to-product workflow');
  console.error('  vibe loop "goal"                    Long-running Loop Engineering mode');
  console.error('  vibe status                        Show current ICM journey level and gates');
  console.error('  vibe verify-stage                  Execute current stage gates automatically; HOLD or advance');
  console.error('  vibe verify-stage --candidate SHA  Bind review/proof evidence to an exact candidate');
  console.error('  vibe verify-stage --manual JSON    Legacy/manual gate injection for controlled tests only');
  console.error('  vibe install ./app --force         Refresh Vibe-managed files intentionally');
  console.error('  vibe map                           Print the ICM backend map');
  console.error('  vibe walk                          Run the deterministic ICM walk test');
  console.error('  vibe skills                        List callable Vibe skills');
  console.error('  vibe skill grill                   Read one skill');
  console.error('  vibe run review "review PR 12"     Use the dominant OpenCodeReview-backed review skill');
  process.exitCode = 1;
}
