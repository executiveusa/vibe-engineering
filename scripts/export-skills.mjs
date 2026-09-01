import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { SKILLS } from '../src/skills/index.mjs';

const root = path.join(process.cwd(), 'skills');
const force = process.argv.includes('--force');

async function hasNonEmptyFile(file) {
  try {
    const current = await readFile(file, 'utf8');
    return current.trim().length > 0;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

for (const skill of SKILLS) {
  const dir = path.join(root, skill.id);
  const target = path.join(dir, 'SKILL.md');
  await mkdir(dir, { recursive: true });
  if (!force && await hasNonEmptyFile(target)) {
    throw new Error(`Refusing to overwrite non-empty skill file: ${path.relative(process.cwd(), target)}. Re-run with --force to replace generated skill files.`);
  }
  const description = JSON.stringify(skill.summary.replace(/\n/g, ' '));
  const body = [
    '---',
    `name: ${skill.id}`,
    `description: ${description}`,
    '---',
    '',
    `# ${skill.title}`,
    '',
    skill.summary,
    '',
    '## Procedure',
    '',
    ...skill.steps.map((step, index) => `${index + 1}. ${step}`),
    '',
    '## Completion',
    '',
    'Do not claim completion until the requested outcome is satisfied and the relevant proof is attached.',
    '',
    `Attribution: ${skill.attribution}`,
    '',
  ].join('\n');
  await writeFile(target, body);
}

console.log(`Exported ${SKILLS.length} Vibe skills to ${root}${force ? ' with --force' : ''}`);
