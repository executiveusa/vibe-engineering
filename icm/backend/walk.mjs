import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { ICM_BACKEND_MAP } from './map.mjs';
import { listSkills } from '../../src/skills/index.mjs';

export const ICM_REQUIRED_PATHS = Object.freeze([
  'AGENTS.md',
  'ICMR.yaml',
  'icm/README.md',
  'icm/WALK.md',
  'icm/backend/AGENTS.md',
  'icm/backend/index.mjs',
  'icm/backend/map.mjs',
  'icm/backend/walk.mjs',
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
]);

async function exists(root, relative) {
  try {
    await access(path.join(root, relative));
    return true;
  } catch {
    return false;
  }
}

export async function runIcmWalk({ root = process.cwd() } = {}) {
  const pathChecks = await Promise.all(ICM_REQUIRED_PATHS.map(async (relative) => ({ path: relative, ok: await exists(root, relative) })));
  const missing = pathChecks.filter((item) => !item.ok).map((item) => item.path);

  const [agents, mcpSource] = await Promise.all([
    readFile(path.join(root, 'AGENTS.md'), 'utf8'),
    readFile(path.join(root, 'src', 'mcp', 'core.mjs'), 'utf8'),
  ]);
  const lifecycle = ICM_BACKEND_MAP.lifecycle.join(' → ');
  const lifecycleOk = ICM_BACKEND_MAP.lifecycle.every((stage) => agents.includes(stage));
  const releaseAuthorityOk = /SHIP|HOLD/.test(agents) && /review|reviewer/i.test(agents);
  const skills = listSkills();
  const expectedMcp = ICM_BACKEND_MAP.interfaces.mcp.tools;
  const missingMcp = expectedMcp.filter((name) => !mcpSource.includes(`name: '${name}'`) && !mcpSource.includes(`name === '${name}'`));

  return {
    ok: missing.length === 0 && lifecycleOk && releaseAuthorityOk && skills.length >= 31 && missingMcp.length === 0,
    test: 'vibe-icm-walk',
    map: ICM_BACKEND_MAP.id,
    lifecycle,
    checks: {
      requiredPaths: { ok: missing.length === 0, missing },
      lifecycleInLaw: lifecycleOk,
      releaseAuthorityInLaw: releaseAuthorityOk,
      skillRegistry: { ok: skills.length >= 31, count: skills.length },
      mcpCatalog: { ok: missingMcp.length === 0, expected: expectedMcp.length, missing: missingMcp },
      interfaces: ICM_BACKEND_MAP.interfaces,
    },
  };
}
