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
  'api/v1/router.mjs',
  'openapi/vibe-truth-api-v1.yaml',
  'factory/icm',
  'vercel.json',
]);

async function exists(root, relative) {
  try {
    await access(path.join(root, relative));
    return true;
  } catch {
    return false;
  }
}

function directHandlerPath(route) {
  const pathname = route.slice(route.indexOf(' ') + 1);
  return pathname.replace(/^\//, '').replace(/:([^/]+)/g, '[$1]') + '.mjs';
}

export async function runIcmWalk({ root = process.cwd() } = {}) {
  const pathChecks = await Promise.all(ICM_REQUIRED_PATHS.map(async (relative) => ({ path: relative, ok: await exists(root, relative) })));
  const missing = pathChecks.filter((item) => !item.ok).map((item) => item.path);

  const [agents, mcpSource, vercelSource] = await Promise.all([
    readFile(path.join(root, 'AGENTS.md'), 'utf8'),
    readFile(path.join(root, 'src', 'mcp', 'core.mjs'), 'utf8'),
    readFile(path.join(root, 'vercel.json'), 'utf8'),
  ]);
  const lifecycle = ICM_BACKEND_MAP.lifecycle.join(' → ');
  const lifecycleOk = ICM_BACKEND_MAP.lifecycle.every((stage) => agents.includes(stage));
  const releaseAuthorityOk = /SHIP|HOLD/.test(agents) && /review|reviewer/i.test(agents);
  const skills = listSkills();
  const expectedMcp = ICM_BACKEND_MAP.interfaces.mcp.tools;
  const missingMcp = expectedMcp.filter((name) => !mcpSource.includes(`name: '${name}'`) && !mcpSource.includes(`name === '${name}'`));
  const expectedHttp = ICM_BACKEND_MAP.interfaces.http.routes;
  const httpChecks = await Promise.all(expectedHttp.map(async (route) => {
    const pathname = route.slice(route.indexOf(' ') + 1);
    const rewriteOk = vercelSource.includes(`\"source\": \"${pathname}\"`);
    const directOk = await exists(root, directHandlerPath(route));
    return { route, ok: rewriteOk || directOk };
  }));
  const missingHttp = httpChecks.filter((item) => !item.ok).map((item) => item.route);
  const skillFloor = 32;

  return {
    ok: missing.length === 0 && lifecycleOk && releaseAuthorityOk && skills.length >= skillFloor && missingMcp.length === 0 && missingHttp.length === 0,
    test: 'vibe-icm-walk',
    map: ICM_BACKEND_MAP.id,
    lifecycle,
    checks: {
      requiredPaths: { ok: missing.length === 0, missing },
      lifecycleInLaw: lifecycleOk,
      releaseAuthorityInLaw: releaseAuthorityOk,
      skillRegistry: { ok: skills.length >= skillFloor, count: skills.length, floor: skillFloor },
      mcpCatalog: { ok: missingMcp.length === 0, expected: expectedMcp.length, missing: missingMcp },
      httpRouting: { ok: missingHttp.length === 0, expected: expectedHttp.length, missing: missingHttp },
      interfaces: ICM_BACKEND_MAP.interfaces,
    },
  };
}
