import { validateContextRequest } from './request-validation.mjs';

export const MAX_CONTEXT_BODY_BYTES = 32 * 1024;

function toResponse(result) {
  return new Response(JSON.stringify(result.body), {
    status: result.status,
    headers: result.headers,
  });
}

async function parseContextRequest(request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_CONTEXT_BODY_BYTES) {
    return { error: toResponse({
      status: 413,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      body: { error: 'PAYLOAD_TOO_LARGE' },
    }) };
  }
  const text = await request.text();
  if (Buffer.byteLength(text, 'utf8') > MAX_CONTEXT_BODY_BYTES) {
    return { error: toResponse({
      status: 413,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      body: { error: 'PAYLOAD_TOO_LARGE' },
    }) };
  }
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    return { error: toResponse({
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      body: { error: 'INVALID_JSON' },
    }) };
  }
  const validation = validateContextRequest(body);
  return validation.valid
    ? { body }
    : { error: toResponse({
      status: 400,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
      body: { error: 'INVALID_CONTEXT_REQUEST', issues: validation.errors },
    }) };
}

export function createWebHandlers(runtimeLoader) {
  return {
    async manifest() {
      const { api } = await runtimeLoader();
      return toResponse(api.manifest());
    },
    async truth(_request, context) {
      const { api } = await runtimeLoader();
      return toResponse(api.truth(context?.params?.id));
    },
    async workflow(_request, context) {
      const { api } = await runtimeLoader();
      return toResponse(api.workflow(context?.params?.id));
    },
    async resolve(request) {
      const parsed = await parseContextRequest(request);
      if (parsed.error) return parsed.error;
      const { api } = await runtimeLoader();
      return toResponse(api.resolve(parsed.body));
    },
  };
}
