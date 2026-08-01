import test from 'node:test';
import assert from 'node:assert/strict';
import { compileArtifacts } from '../src/truth/compiler.mjs';
import { createTruthApi } from '../src/truth/api.mjs';
import { createWebHandlers } from '../src/truth/web-adapter.mjs';
import { createNodeHandlers } from '../src/truth/node-adapter.mjs';

const artifacts = [
  { id: 'constitution.test', kind: 'constitution', version: '1.0.0', status: 'approved', precedence: 1000, title: 'Constitution', sourcePath: 'test', summary: 'test', laws: [{ id: 'verify', text: 'Verify.' }] },
  { id: 'workflow.test', kind: 'workflow', version: '1.0.0', status: 'approved', precedence: 600, title: 'Workflow', sourcePath: 'test', summary: 'test', stages: ['inspect', 'build', 'verify'], limits: { meaningfulRepairAttempts: 5 }, proof: ['tests'], rollback: { type: 'git-revert' } },
  { id: 'policy.vibe-score-release', kind: 'policy', version: '1.0.0', status: 'approved', precedence: 800, title: 'Release', sourcePath: 'test', summary: 'test', rules: { floor: 8.5 } },
];
const bundle = compileArtifacts(artifacts, { sourceCommit: 'runtime-test' });
const runtimeLoader = async () => ({ bundle, api: createTruthApi(bundle) });

function mockResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(key, value) { this.headers[key] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('Web adapter exposes the pinned manifest', async () => {
  const handlers = createWebHandlers(runtimeLoader);
  const response = await handlers.manifest();
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.bundleHash, bundle.bundleHash);
  assert.equal(body.sourceCommit, 'runtime-test');
});

test('Web adapter rejects oversized context requests', async () => {
  const handlers = createWebHandlers(runtimeLoader);
  const response = await handlers.resolve(new Request('https://example.test/api/v1/resolve-context', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'content-length': String(40 * 1024) },
    body: '{}',
  }));
  assert.equal(response.status, 413);
});

test('Node adapter exposes the same bundle hash', async () => {
  const handlers = createNodeHandlers(runtimeLoader);
  const response = mockResponse();
  await handlers.manifest({}, response);
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.bundleHash, bundle.bundleHash);
});

test('Node adapter validates context requests', async () => {
  const handlers = createNodeHandlers(runtimeLoader);
  const response = mockResponse();
  await handlers.resolve({ body: { unexpected: true } }, response);
  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error, 'INVALID_CONTEXT_REQUEST');
});
