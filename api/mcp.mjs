import { getRuntime, handleMcpRpc, PROTOCOL_VERSION, validateMcpHeaders } from '../icm/backend/index.mjs';

const MAX_BODY_BYTES = 32 * 1024;

function normalizedHeaders(req) {
  return Object.fromEntries(Object.entries(req.headers ?? {}).map(([key, value]) => [key.toLowerCase(), Array.isArray(value) ? value[0] : value]));
}

async function readBody(req) {
  if (req.body !== undefined) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_BODY_BYTES) throw Object.assign(new Error('PAYLOAD_TOO_LARGE'), { code: 'PAYLOAD_TOO_LARGE' });
    return body;
  }
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) throw Object.assign(new Error('PAYLOAD_TOO_LARGE'), { code: 'PAYLOAD_TOO_LARGE' });
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
}

export default async function handler(req, res) {
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'no-store');
  res.setHeader('MCP-Protocol-Version', PROTOCOL_VERSION);
  if (req.method !== 'POST') {
    res.setHeader('allow', 'POST');
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }
  try {
    const request = await readBody(req);
    const headers = normalizedHeaders(req);
    const headerCheck = validateMcpHeaders(headers, request);
    if (!headerCheck.valid) return res.status(headerCheck.status).json(headerCheck.body);
    const { api } = await getRuntime();
    const response = await handleMcpRpc(api, request);
    return res.status(response.error ? 400 : 200).json(response);
  } catch (error) {
    if (error.code === 'PAYLOAD_TOO_LARGE') return res.status(413).json({ error: 'PAYLOAD_TOO_LARGE', maxBytes: MAX_BODY_BYTES });
    return res.status(400).json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
  }
}
