import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { compileArtifacts, loadArtifacts, stableStringify } from '../src/truth/compiler.mjs';

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' ? value.trim().length > 0 : value != null);
}

const root = process.cwd();
const sourceDirectory = path.join(root, 'truth', 'sources');
const outputDirectory = path.join(root, 'dist', 'truth');
const sourceCommit = firstNonEmpty(
  process.env.GITHUB_SHA,
  process.env.VIBE_SOURCE_COMMIT,
  process.env.VERCEL_GIT_COMMIT_SHA,
) ?? 'local';

const artifacts = await loadArtifacts(sourceDirectory);
const bundle = compileArtifacts(artifacts, { sourceCommit });
const manifest = {
  schemaVersion: bundle.schemaVersion,
  compilerVersion: bundle.compilerVersion,
  sourceCommit: bundle.sourceCommit,
  bundleHash: bundle.bundleHash,
  artifacts: bundle.artifacts.map(({ id, kind, version, status, precedence, title, sourcePath, contentHash }) => ({
    id, kind, version, status, precedence, title, sourcePath, contentHash,
  })),
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, 'truth-bundle.json'), stableStringify(bundle));
await writeFile(path.join(outputDirectory, 'truth-manifest.json'), stableStringify(manifest));

console.log(`Compiled ${bundle.artifacts.length} truth artifacts.`);
console.log(`Bundle hash: ${bundle.bundleHash}`);
