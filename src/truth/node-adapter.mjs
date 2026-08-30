import { getRuntime } from './runtime.mjs';
import { validateContextRequest } from './request-validation.mjs';

export const MAX_CONTEXT_BODY_BYTES = 32 * 1024;

function send(res, result) {
  for (const [key, value] of Object.entries(result.headers ?? {})) res.setHeader(key, value);
  return res.status(result.status).json(result.body);
}

async function readBody(req) {
  if (req.body !== undefined) {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const bytes = Buffer.byteLength(JSON.stringify(body), 'utf8');
    if (bytes > MAX_CONTEXT_BODY_BYTES) return { error: 'PAYLOAD_TOO_LARGE' };
    return { body };
  }
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_CONTEXT_BODY_BYTES) return { error: 'PAYLOAD_TOO_LARGE' };
    chunks.push(chunk);
  }
  try {
    return { body: chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {} };
  } catch {
    return { error: 'INVALID_JSON' };
  }
}

function bodyError(res, error) {
  return res.status(error === 'PAYLOAD_TOO_LARGE' ? 413 : 400).json({ error });
}

export function createNodeHandlers(runtimeLoader = getRuntime) {
  return {
    async manifest(_req, res) {
      const { api } = await runtimeLoader();
      return send(res, api.manifest());
    },
    async truth(req, res) {
      const { api } = await runtimeLoader();
      return send(res, api.truth(req.query?.id));
    },
    async workflow(req, res) {
      const { api } = await runtimeLoader();
      return send(res, api.workflow(req.query?.id));
    },
    async resolve(req, res) {
      const parsed = await readBody(req);
      if (parsed.error) return bodyError(res, parsed.error);
      const validation = validateContextRequest(parsed.body);
      if (!validation.valid) return res.status(400).json({ error: 'INVALID_CONTEXT_REQUEST', issues: validation.errors });
      const { api } = await runtimeLoader();
      return send(res, api.resolve(parsed.body));
    },
    async detect(req, res) {
      const parsed = await readBody(req);
      if (parsed.error) return bodyError(res, parsed.error);
      const { api } = await runtimeLoader();
      return send(res, api.detect(parsed.body));
    },
    async compileIcmr(req, res) {
      const parsed = await readBody(req);
      if (parsed.error) return bodyError(res, parsed.error);
      const { api } = await runtimeLoader();
      return send(res, api.compileIcmr(parsed.body));
    },
    async validateIcmr(req, res) {
      const parsed = await readBody(req);
      if (parsed.error) return bodyError(res, parsed.error);
      const { api } = await runtimeLoader();
      return send(res, api.validateIcmr(parsed.body));
    },
  };
}
