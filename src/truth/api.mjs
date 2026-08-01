import { resolveContext } from './context-resolver.mjs';

function json(status, body) {
  return {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=60, stale-while-revalidate=300' : 'no-store',
    },
    body,
  };
}

function publicArtifact(artifact) {
  const { id, kind, version, status, precedence, title, sourcePath, summary, contentHash } = artifact;
  return { id, kind, version, status, precedence, title, sourcePath, summary, contentHash };
}

export function createTruthApi(bundle) {
  if (!bundle?.bundleHash || !Array.isArray(bundle.artifacts)) {
    throw new Error('A compiled truth bundle is required');
  }

  const approved = bundle.artifacts.filter((artifact) => artifact.status === 'approved');
  const byId = new Map(approved.map((artifact) => [artifact.id, artifact]));

  return {
    manifest() {
      return json(200, {
        schemaVersion: bundle.schemaVersion,
        compilerVersion: bundle.compilerVersion,
        sourceCommit: bundle.sourceCommit,
        bundleHash: bundle.bundleHash,
        artifacts: approved.map(publicArtifact),
      });
    },

    truth(id) {
      const artifact = byId.get(id);
      return artifact
        ? json(200, { bundleHash: bundle.bundleHash, artifact })
        : json(404, { error: 'TRUTH_NOT_FOUND', id });
    },

    workflow(id) {
      const artifact = byId.get(id);
      if (!artifact || artifact.kind !== 'workflow') {
        return json(404, { error: 'WORKFLOW_NOT_FOUND', id });
      }
      return json(200, { bundleHash: bundle.bundleHash, workflow: artifact });
    },

    resolve(request) {
      try {
        return json(200, resolveContext(bundle, request));
      } catch (error) {
        return json(400, { error: 'INVALID_CONTEXT_REQUEST', message: error.message });
      }
    },
  };
}
