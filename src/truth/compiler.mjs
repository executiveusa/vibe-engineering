import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const REQUIRED_FIELDS = ['id', 'kind', 'version', 'status', 'precedence', 'title', 'sourcePath', 'summary'];
const SECRET_PATTERNS = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b/,
  /\bsb_secret_[A-Za-z0-9_-]{16,}\b/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
];

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

export function stableStringify(value) {
  return `${JSON.stringify(canonicalize(value), null, 2)}\n`;
}

export function hashContent(value) {
  return createHash('sha256').update(stableStringify(value)).digest('hex');
}

export function validateArtifact(artifact, sourceName = 'unknown') {
  const errors = [];
  for (const field of REQUIRED_FIELDS) {
    if (artifact[field] === undefined || artifact[field] === null || artifact[field] === '') {
      errors.push(`${sourceName}: missing required field '${field}'`);
    }
  }
  if (!Number.isInteger(artifact.precedence) || artifact.precedence < 0) {
    errors.push(`${sourceName}: precedence must be a non-negative integer`);
  }
  if (!['approved', 'proposed', 'deprecated'].includes(artifact.status)) {
    errors.push(`${sourceName}: status must be approved, proposed, or deprecated`);
  }
  const serialized = JSON.stringify(artifact);
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(serialized)) errors.push(`${sourceName}: possible secret detected`);
  }
  return errors;
}

export function compileArtifacts(artifacts, metadata = {}) {
  const errors = [];
  const ids = new Set();

  for (const artifact of artifacts) {
    errors.push(...validateArtifact(artifact, artifact.id ?? 'unknown'));
    if (ids.has(artifact.id)) errors.push(`duplicate artifact id '${artifact.id}'`);
    ids.add(artifact.id);
  }

  if (errors.length) {
    const error = new Error(`Truth compilation failed:\n- ${errors.join('\n- ')}`);
    error.validationErrors = errors;
    throw error;
  }

  const normalized = artifacts
    .map((artifact) => ({ ...canonicalize(artifact), contentHash: hashContent(artifact) }))
    .sort((a, b) => b.precedence - a.precedence || a.id.localeCompare(b.id));

  const bundleWithoutHash = {
    schemaVersion: '1.0.0',
    compilerVersion: '1.0.0',
    sourceCommit: metadata.sourceCommit ?? 'unknown',
    artifacts: normalized,
  };

  return {
    ...bundleWithoutHash,
    bundleHash: hashContent(bundleWithoutHash),
  };
}

export async function loadArtifacts(sourceDirectory) {
  const entries = (await readdir(sourceDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .sort((a, b) => a.name.localeCompare(b.name));

  return Promise.all(entries.map(async (entry) => {
    const filePath = path.join(sourceDirectory, entry.name);
    return JSON.parse(await readFile(filePath, 'utf8'));
  }));
}
