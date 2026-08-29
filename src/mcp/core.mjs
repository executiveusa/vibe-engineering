const PROTOCOL_VERSION = '2026-07-28';
const SERVER_INFO = { name: 'vibe-engineering', version: '2.0.0' };
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

function toolCatalog() {
  return [
    {
      name: 'vibe_method',
      title: 'Get Vibe Engineering Method',
      description: 'Read the canonical Vibe Engineering v2 method and public flow before planning or governing work.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
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
      description: 'Resolve the smallest approved Vibe context set for a project and task instead of loading the whole methodology.',
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
              consequenceLevel: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
            },
            required: ['type', 'consequenceLevel'],
            additionalProperties: false,
          },
        },
        required: ['project', 'task'],
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
      instructions: 'Use vibe_method first for methodology questions. Use vibe_context for task-scoped context. Vibe tools expose governance and truth; they do not authorize production release.',
      ttlMs: 300000,
      cacheScope: 'public',
    });
  }

  if (method === 'tools/list') {
    return complete(id, {
      tools: toolCatalog(),
      ttlMs: 300000,
      cacheScope: 'public',
    });
  }

  if (method !== 'tools/call') return error(id, -32601, 'Method not found');

  const name = params?.name;
  const args = params?.arguments ?? {};

  if (name === 'vibe_method') {
    const result = api.truth(METHOD_ID);
    return result.status === 200 ? textResult(id, result.body) : error(id, -32004, 'Vibe method not found');
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
    return result.status === 200
      ? textResult(id, result.body)
      : error(id, -32602, 'Context request rejected', result.body);
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
