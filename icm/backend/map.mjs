export const ICM_BACKEND_MAP = Object.freeze({
  schemaVersion: '1.0.0',
  id: 'vibe-engineering-backend',
  purpose: 'Give humans and AI agents one deterministic path through the Vibe Engineering backend.',
  entry: {
    law: 'AGENTS.md',
    router: 'icm/README.md',
    walk: 'icm/WALK.md',
    machineMap: 'icm/backend/map.mjs',
    projectContract: 'ICMR.yaml',
  },
  lifecycle: ['DEFINE', 'PLAN', 'BUILD', 'VERIFY', 'REVIEW', 'SHIP'],
  publicRhythm: ['Choose', 'See', 'Shape', 'Make', 'Prove', 'Challenge', 'Decide', 'Release', 'Learn'],
  decisionContract: ['Intent', 'Standard', 'Evidence'],
  domains: {
    truth: {
      purpose: 'Compile and serve approved method, policy, and workflow truth.',
      implementation: ['src/truth/', 'truth/sources/'],
      interface: 'icm/backend/index.mjs',
    },
    skills: {
      purpose: 'Expose the callable Vibe procedure registry and execution packets.',
      implementation: ['src/skills/', 'skills/'],
      interface: 'icm/backend/index.mjs',
    },
    icmr: {
      purpose: 'Detect, compile, and validate the Step 0 runtime contract before substantial work.',
      implementation: ['src/icmr/', 'ICMR.yaml', 'factory/icm/'],
      interface: 'icm/backend/index.mjs',
    },
    mcp: {
      purpose: 'Expose Vibe truth, ICMR, skills, map, and walk test to MCP clients.',
      implementation: ['src/mcp/', 'api/mcp.mjs', 'scripts/vibe-mcp-stdio.mjs'],
      interface: 'icm/backend/index.mjs',
    },
    release: {
      purpose: 'Prove exact revisions and keep release authority and rollback separate from building.',
      implementation: ['.github/workflows/', 'docs/evidence/', 'vercel.json'],
      authority: 'An authorized owner, Judge, or human records SHIP or HOLD.',
    },
  },
  interfaces: {
    cli: {
      entry: 'scripts/vibe.mjs',
      commands: ['explain', 'map', 'walk', 'skills', 'skill', 'run', 'method', 'manifest', 'truth', 'workflow', 'context'],
    },
    http: {
      openapi: 'openapi/vibe-truth-api-v1.yaml',
      routes: [
        'GET /api/v1/icm/map',
        'GET /api/v1/icm/walk',
        'GET /api/v1/skills',
        'GET /api/v1/skills/:id',
        'POST /api/v1/run-skill',
        'GET /api/v1/manifest',
        'GET /api/v1/truth/:id',
        'GET /api/v1/workflows/:id',
        'POST /api/v1/resolve-context',
        'POST /api/v1/detect',
        'POST /api/v1/compile-icmr',
        'POST /api/v1/validate-icmr',
      ],
    },
    mcp: {
      entry: 'api/mcp.mjs',
      tools: ['vibe_icm_map', 'vibe_walk', 'vibe_skills', 'vibe_skill', 'vibe_run_skill', 'vibe_method', 'vibe_truth', 'vibe_workflow', 'vibe_context', 'vibe_detect', 'vibe_compile_icmr', 'vibe_validate_icmr'],
    },
  },
  rules: {
    brownfield: 'Inspect and reuse before adding or moving.',
    step0: 'Substantial work must detect, compile, and validate ICMR before planning or execution.',
    proof: 'Important done claims require evidence against the exact candidate revision.',
    review: 'The builder cannot be the only approver.',
    release: 'No API, CLI, MCP tool, or skill self-authorizes production release.',
    ownership: 'Keep code, data, decisions, recovery, and provider replacement under owner control.',
  },
});

export function getIcmBackendMap() {
  return ICM_BACKEND_MAP;
}
