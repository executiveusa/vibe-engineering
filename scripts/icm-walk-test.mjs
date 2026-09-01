#!/usr/bin/env node
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { ICM_BACKEND_MAP } from '../icm/backend/map.mjs';
import { listSkills } from '../src/skills/index.mjs';
import { handleMcpRpc } from '../src/mcp/core.mjs';
import { compileArtifacts, loadArtifacts } from '../src/truth/compiler.mjs';
import { createTruthApi } from '../src/truth/api.mjs';

const root = process.cwd();
const requiredPaths = [
  'AGENTS.md',
  'ICMR.yaml',
  'icm/README.md',
  'icm/WALK.md',
  'icm/backend/AGENTS.md',
  'icm/backend/index.mjs',
  'icm/backend/map.mjs',
  'src/truth',
  'truth/sources',
  'src/skills',
  'src/icmr',
  'src/mcp',
  'scripts/vibe.mjs',
  'scripts/truth-api.mjs',
  'api/mcp.mjs',
  'openapi/vibe-truth-api-v1.yaml',
  'factory/icm',
];

async function exists(relative) {
  try {
    await access(path.join(root, relative));
    return true;
  } catch {
    return false;
  }
}

const pathChecks = await Promise.all(requiredPaths.map(async (relative) => ({ path: relative, ok: await exists(relative) })));
const missing = pathChecks.filter((item) => !item.ok).map((item) => item.path);

const agents = await readFile(path.join(root, 'AGENTS.md'), 'utf8');
const lifecycle = ICM_BACKEND_MAP.lifecycle.join(' → ');
const lifecycleOk = ICM_BACKEND_MAP.lifecycle.every((stage) => agents.includes(stage));
const releaseAuthorityOk = /SHIP|HOLD/.test(agents) && /review|reviewer/i.test(agents);
const skills = listSkills();

const artifacts = await loadArtifacts(path.join(root, 'truth', 'sources'));
const api = createTruthApi(compileArtifacts(artifacts, { sourceCommit: 'icm-walk-test' }));
const mcpList = await handleMcpRpc(api, { jsonrpc: '2.0', id: 1, method: 'tools/list' });
const mcpTools = mcpList?.result?.tools?.map((tool) => tool.name) ?? [];
const expectedMcp = ICM_BACKEND_MAP.interfaces.mcp.tools;
const missingMcp = expectedMcp.filter((name) => !mcpTools.includes(name));

const result = {
  ok: missing.length === 0 && lifecycleOk && releaseAuthorityOk && skills.length >= 31 && missingMcp.length === 0,
  test: 'vibe-icm-walk',
  map: ICM_BACKEND_MAP.id,
  lifecycle,
  checks: {
    requiredPaths: { ok: missing.length === 0, missing },
    lifecycleInLaw: lifecycleOk,
    releaseAuthorityInLaw: releaseAuthorityOk,
    skillRegistry: { ok: skills.length >= 31, count: skills.length },
    mcpCatalog: { ok: missingMcp.length === 0, count: mcpTools.length, missing: missingMcp },
    interfaces: ICM_BACKEND_MAP.interfaces,
  },
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
