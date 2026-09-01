import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { SKILLS } from '../src/skills/index.mjs';

const root = path.join(process.cwd(), 'skills');

for (const skill of SKILLS) {
  const dir = path.join(root, skill.id);
  await mkdir(dir, { recursive: true });
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
  await writeFile(path.join(dir, 'SKILL.md'), body);
}

console.log(`Exported ${SKILLS.length} Vibe skills to ${root}`);
