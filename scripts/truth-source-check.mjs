import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceDirectory = path.join(root, 'truth', 'sources');
const files = (await readdir(sourceDirectory)).filter((name) => name.endsWith('.json')).sort();
const errors = [];

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

for (const name of files) {
  const artifact = JSON.parse(await readFile(path.join(sourceDirectory, name), 'utf8'));
  const canonicalPath = path.join(root, artifact.sourcePath);
  let canonical;
  try {
    canonical = await readFile(canonicalPath, 'utf8');
  } catch {
    errors.push(`${artifact.id}: missing canonical source '${artifact.sourcePath}'`);
    continue;
  }

  if (!canonical.trim()) errors.push(`${artifact.id}: canonical source is empty`);
  const normalizedCanonical = normalizeText(canonical);

  if (artifact.kind === 'constitution') {
    for (const law of artifact.laws ?? []) {
      if (!normalizedCanonical.includes(normalizeText(law.text))) {
        errors.push(`${artifact.id}: law '${law.id}' is not present in canonical source`);
      }
    }
  }

  if (artifact.id === 'policy.vibe-score-release') {
    const rules = artifact.rules ?? {};
    if (!canonical.includes(String(rules.releaseFloor))) errors.push(`${artifact.id}: release floor is not present in canonical source`);
    for (const dimension of rules.dimensions ?? []) {
      if (!normalizedCanonical.includes(normalizeText(dimension))) errors.push(`${artifact.id}: dimension '${dimension}' is not present in canonical source`);
    }
  }

  if (artifact.kind === 'workflow') {
    for (const stage of artifact.stages ?? []) {
      const label = typeof stage === 'string' ? stage : stage.id ?? stage.name;
      if (label && !normalizedCanonical.includes(normalizeText(label))) {
        errors.push(`${artifact.id}: stage '${label}' is not present in canonical source`);
      }
    }
    const attempts = artifact.limits?.meaningfulRepairAttempts;
    if (attempts !== undefined && !canonical.includes(String(attempts))) errors.push(`${artifact.id}: repair-attempt limit is not present in canonical source`);
  }
}

if (errors.length) {
  console.error(`Truth source consistency failed:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

console.log(`Verified ${files.length} normalized artifacts against canonical sources.`);
