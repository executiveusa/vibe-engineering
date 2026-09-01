import path from 'node:path';
import process from 'node:process';
import { compileArtifacts, loadArtifacts } from './compiler.mjs';
import { createTruthApi } from './api.mjs';
import { BUILD_SOURCE_COMMIT } from './source-provenance.mjs';

let runtimePromise;

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' ? value.trim().length > 0 : value != null);
}

export async function loadRuntimeBundle(options = {}) {
  const root = options.root ?? process.cwd();
  const sourceDirectory = options.sourceDirectory ?? path.join(root, 'truth', 'sources');
  const sourceCommit = firstNonEmpty(
    options.sourceCommit,
    process.env.VIBE_SOURCE_COMMIT,
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.GITHUB_SHA,
    BUILD_SOURCE_COMMIT,
  ) ?? 'local';
  const artifacts = await loadArtifacts(sourceDirectory);
  return compileArtifacts(artifacts, { sourceCommit });
}

export async function getRuntime(options = {}) {
  if (options.fresh) {
    const bundle = await loadRuntimeBundle(options);
    return { bundle, api: createTruthApi(bundle) };
  }
  runtimePromise ??= loadRuntimeBundle(options).then((bundle) => ({
    bundle,
    api: createTruthApi(bundle),
  }));
  return runtimePromise;
}

export function resetRuntimeForTests() {
  runtimePromise = undefined;
}
