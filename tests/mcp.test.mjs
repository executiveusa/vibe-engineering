import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import process from 'node:process';
import { compileArtifacts, loadArtifacts } from '../src/truth/compiler.mjs';
import { createTruthApi } from '../src/truth/api.mjs';
import { handleMcpRpc, PROTOCOL_VERSION, validateMcpHeaders } from '../src/mcp/core.mjs';

async function createApi() {
  const artifacts = await loadArtifacts(path.join(process.cwd(), 'truth', 'sources'));
  return createTruthApi(compileArtifacts(artifacts, { sourceCommit: 'test' }));
}

test('MCP discovery advertises current stateless protocol and tools', async () => {
  const api = await createApi();
  const response = await handleMcpRpc(api, { jsonrpc: '2.0', id: 1, method: 'server/discover' });
  assert.equal(response.result.resultType, 'complete');
  assert.deepEqual(response.result.supportedVersions, [PROTOCOL_VERSION]);
  assert.equal(response.result._meta['io.modelcontextprotocol/serverInfo'].name, 'vibe-engineering');

  const tools = await handleMcpRpc(api, { jsonrpc: '2.0', id: 2, method: 'tools/list' });
  assert.deepEqual(tools.result.tools.map((tool) => tool.name), ['vibe_method', 'vibe_truth', 'vibe_workflow', 'vibe_context']);
});

test('vibe_method returns the approved Vibe Engineering v2 truth artifact', async () => {
  const api = await createApi();
  const response = await handleMcpRpc(api, {
    jsonrpc: '2.0',
    id: 3,
    method: 'tools/call',
    params: { name: 'vibe_method', arguments: {} },
  });

  assert.equal(response.result.structuredContent.artifact.id, 'method.vibe-engineering-v2');
  assert.equal(response.result.structuredContent.artifact.motto, 'Verify It Before Everything.');
});

test('vibe_context preserves Truth API validation', async () => {
  const api = await createApi();
  const response = await handleMcpRpc(api, {
    jsonrpc: '2.0',
    id: 4,
    method: 'tools/call',
    params: {
      name: 'vibe_context',
      arguments: {
        project: { repository: 'executiveusa/vibe-engineering', mode: 'brownfield' },
        task: { type: 'software-change', consequenceLevel: 'high' },
      },
    },
  });

  assert.equal(response.result.resultType, 'complete');
  assert.ok(response.result.structuredContent.bundleHash);
});

test('MCP HTTP headers cannot disagree with the JSON-RPC request', () => {
  const request = { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'vibe_method', arguments: {} } };
  assert.equal(validateMcpHeaders({ 'mcp-protocol-version': PROTOCOL_VERSION, 'mcp-method': 'tools/call', 'mcp-name': 'vibe_method' }, request).valid, true);
  assert.equal(validateMcpHeaders({ 'mcp-method': 'tools/list' }, request).valid, false);
  assert.equal(validateMcpHeaders({ 'mcp-name': 'other_tool' }, request).valid, false);
});
