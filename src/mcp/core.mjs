import { getSkill, listSkills, runSkill } from '../skills/catalog.mjs';

const PROTOCOL_VERSION = '2026-07-28';
const SERVER_INFO = { name: 'vibe-engineering', version: '2.2.0' };
const METHOD_ID = 'method.vibe-engineering-v2';

function complete(id, result) {
  return {
    jsonrpc: '2.0',
    id,
    result: {
      resultType: 'complete',
      ...result,
      _meta: {
        ...(result?._meta ?? {}),
        'io.modelcontextprotocol/serverInfo': SERVER_INFO,
      },
    },
  };
}

function error(id, code, message, data) {
  return {
    jsonrpc: '2.0',
    id: id ?? null,
    error: { code, message, ...(data === undefined ? {} : { data }) },
  };
}

function textResult(id, value) {
  return complete(id, {
    content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
  });
}

const WORK_INPUT_PROPERTIES = {
  title: { type: 'string' },
  description: { type: 'string', minLength: 1 },
  target: { type: 'string' },
  commercialValue: { type: 'string' },
  repository: { type: 'string' },
  mode: { type: 'string', enum: ['greenfield', 'brownfield'] },
  roles: { type: 'array', items: { type: 'string' } },
  constraints: { type: 'array', items: { type: 'string' } },
  approvals: { type: 'array', items: { type: 'string' } },
  rollbackPoint: { type: 'string' },
};

function toolCatalog() {
  return [
    {
      name: 'vibe_method',
      title: 'Get Vibe Engineering Method',
      description: 'Read the canonical Vibe Engineering method.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'vibe_skills',
      title: 'List Vibe Skills',
      description: 'List the open Vibe Engineering skill catalog. Use this when deciding which procedure fits a task.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    },
    {
      name: 'vibe_skill',
      title: 'Get Vibe Skill',
      description: 'Read one Vibe skill by id or alias.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', minLength: 1 } },
        required: ['id'],
        additionalProperties: false,
      },
    },
    {
      name: 'vibe_run_skill',
      title: 'Run Vibe Skill',
      description: 'Return the canonical execution packet for one Vibe skill with caller-supplied context. The caller or agent executes the procedure; this tool does not silently perform external side effects.',
      inputSchema: {
        type: 'object',
        properties: {
          id: { type: 'string', minLength: 1 },
          input: { type: 'object' },
        },
        required: ['id'],
        additionalProperties: false,
      },
    },
    {
      name: 'vibe_truth',
      title: 'Get Vibe Truth Artifact',
      description: 'Read one approved truth artifact by id from the Vibe Engineering control plane.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', minLength: 1 } },
        required: ['id'],
        additionalProperties: false,
      },
    },
    {
      name: 'vibe_workflow',
      title: 'Get Vibe Workflow',
      description: 'Read one approved workflow artifact by id.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string', minLength: 1 } },
        required: ['id'],
        additionalProperties: false,
      },
    },
    {
      name: 'vibe_context',
      title: 'Resolve Vibe Context',
      description: 'Resolve the smallest approved Vibe context set for a project and task.',
      inputSchema: {
        type: 'object',
        properties: {
          project: {
            type: 'object',
            properties: {
              repository: { type: ['string', 'null'] },
              mode: { type: 'string', enum: ['greenfield', 'brownfield'] },
            },
            required: ['mode'],
            additionalProperties: false,
          },
          task: {
            type: 'object',
            properties: {
              type: { type: 'string', minLength: 1 },
              consequenceLevel: { type: 'string', enum: ['low', 'medium', 'high'] },
            },
            required: ['type', 'consequenceLevel'],
            additionalProperties: false,
          },
        },
        required: ['project', 'task'],
        additionalProperties: false,
      },
    },
    {
      name: 'vibe_detect',
      title: 'Detect ICMR Topology',
      description: 'Classify arbitrary work before planning.',
      inputSchema: { type: 'object', properties: WORK_INPUT_PROPERTIES, required: ['description'], additionalProperties: false },
    },
    {
      name: 'vibe_compile_icmr',
      title: 'Compile ICMR',
      description: 'Compile arbitrary work into the canonical ICM Runtime Representation.',
      inputSchema: { type: 'object', properties: WORK_INPUT_PROPERTIES, required: ['description'], additionalProperties: false },
    },
    {
      name: 'vibe_validate_icmr',
      title: 'Validate ICMR',
      description: 'Validate an ICMR object or compiled YAML against Vibe Step 0 invariants.',
      inputSchema: {
        type: 'object',
        properties: { icmr: { oneOf: [{ type: 'object' }, { type: 'string', minLength: 1 }] } },
        required: ['icmr'],
        additionalProperties: false,
      },
    },
  ];
}

export async function handleMcpRpc(api, request = {}) {
  const { id, method, params = {} } = request;

  if (request.jsonrpc !== '2.0' || !method) return error(id, -32600, 'Invalid Request');

  if (method === 'server/discover') {
    return complete(id, {
      supportedVersions: [PROTOCOL_VERSION],
      capabilities: { tools: {} },
      instructions: 'Use vibe_skills to discover the smallest procedure. For substantial work use stop-slop and proof before a done claim. Use ship only for an actual release. No Vibe tool authorizes production release by itself.',
      ttlMs: 300000,
      cacheScope: 'public',
    });
  }

  if (method === 'tools/list') {
    return complete(id, { tools: toolCatalog(), ttlMs: 300000, cacheScope: 'public' });
  }

  if (method !== 'tools/call') return error(id, -32601, 'Method not found');

  const name = params?.name;
  const args = params?.arguments ?? {};

  if (name === 'vibe_method') {
    const result = api.truth(METHOD_ID);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32004, 'Vibe method not found');
  }

  if (name === 'vibe_skills') return textResult(id, { skills: listSkills() });

  if (name === 'vibe_skill') {
    if (typeof args.id !== 'string' || !args.id) return error(id, -32602, 'vibe_skill requires a non-empty id');
    const found = getSkill(args.id);
    return found ? textResult(id, found) : error(id, -32004, 'Vibe skill not found', { id: args.id });
  }

  if (name === 'vibe_run_skill') {
    if (typeof args.id !== 'string' || !args.id) return error(id, -32602, 'vibe_run_skill requires a non-empty id');
    const result = runSkill(args.id, args.input ?? {});
    return result ? textResult(id, result) : error(id, -32004, 'Vibe skill not found', { id: args.id });
  }

  if (name === 'vibe_truth') {
    if (typeof args.id !== 'string' || !args.id) return error(id, -32602, 'vibe_truth requires a non-empty id');
    const result = api.truth(args.id);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32004, 'Truth artifact not found', { id: args.id });
  }

  if (name === 'vibe_workflow') {
    if (typeof args.id !== 'string' || !args.id) return error(id, -32602, 'vibe_workflow requires a non-empty id');
    const result = api.workflow(args.id);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32004, 'Workflow not found', { id: args.id });
  }

  if (name === 'vibe_context') {
    const result = api.resolve(args);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32602, 'Context request rejected', result.body);
  }

  if (name === 'vibe_detect') {
    const result = api.detect(args);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32602, 'Detection request rejected', result.body);
  }

  if (name === 'vibe_compile_icmr') {
    const result = api.compileIcmr(args);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32602, 'ICMR compilation rejected', result.body);
  }

  if (name === 'vibe_validate_icmr') {
    const result = api.validateIcmr(args);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32602, 'ICMR validation failed', result.body);
  }

  return error(id, -32602, 'Unknown tool', { name });
}

export function validateMcpHeaders(headers = {}, request = {}) {
  const protocol = headers['mcp-protocol-version'];
  if (protocol && protocol !== PROTOCOL_VERSION) {
    return { valid: false, status: 400, body: error(request.id, -32600, `Unsupported MCP protocol version: ${protocol}`) };
  }
  const headerMethod = headers['mcp-method'];
  if (headerMethod && headerMethod !== request.method) {
    return { valid: false, status: 400, body: error(request.id, -32600, 'Mcp-Method header does not match JSON-RPC method') };
  }
  const headerName = headers['mcp-name'];
  const bodyName = request.method === 'tools/call' ? request.params?.name : undefined;
  if (headerName && bodyName && headerName !== bodyName) {
    return { valid: false, status: 400, body: error(request.id, -32600, 'Mcp-Name header does not match tool name') };
  }
  return { valid: true };
}

export { PROTOCOL_VERSION, SERVER_INFO };
