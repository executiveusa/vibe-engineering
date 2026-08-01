import process from 'node:process';

const baseUrl = (process.env.VIBE_TRUTH_PREVIEW_URL ?? process.argv[2] ?? '').replace(/\/$/, '');
const expectedCommit = process.env.VIBE_TRUTH_EXPECTED_COMMIT ?? process.argv[3] ?? null;

if (!baseUrl) throw new Error('Provide VIBE_TRUTH_PREVIEW_URL or pass the preview URL as the first argument');

async function getJson(path, options) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const body = await response.json();
  if (!response.ok) throw new Error(`${path} returned ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

const first = await getJson('/api/v1/manifest');
const second = await getJson('/api/v1/manifest');
if (first.bundleHash !== second.bundleHash) throw new Error('Manifest bundle hash changed between identical requests');
if (expectedCommit && first.sourceCommit !== expectedCommit) {
  throw new Error(`Expected source commit ${expectedCommit}, received ${first.sourceCommit}`);
}

const workflow = await getJson('/api/v1/workflows/workflow.a2a-software-factory');
if (workflow.bundleHash !== first.bundleHash) throw new Error('Workflow response does not match manifest bundle hash');

const context = await getJson('/api/v1/resolve-context', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    project: { repository: 'executiveusa/vibe-engineering', mode: 'brownfield' },
    task: { type: 'phase-2-preview-proof', requestedAction: 'inspect', consequenceLevel: 'low' },
  }),
});
if (context.truth?.bundleHash !== first.bundleHash) throw new Error('Context response does not match manifest bundle hash');

console.log(JSON.stringify({
  status: 'PASS',
  baseUrl,
  sourceCommit: first.sourceCommit,
  bundleHash: first.bundleHash,
  artifactCount: first.artifacts.length,
}, null, 2));
