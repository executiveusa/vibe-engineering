// Free-lane broker (Phase 1 key isolation): the ONLY key holder runs on the
// runner, outside the sandbox. Sandbox agents receive a worthless per-run
// bearer + a base URL pointing here; the broker enforces the resolved model
// set, injects provider-side price ceilings on every call, re-verifies
// zero-pricing, and caps request size and call count. No key in the sandbox,
// no key in any log line.
import http from 'node:http';
import os from 'node:os';
import { randomBytes } from 'node:crypto';
import { assertZeroPricing } from './model-resolve.mjs';

// Bind ONLY the docker bridge gateway (containers can reach it; the host's
// other interfaces cannot) or loopback when no bridge exists. Never 0.0.0.0.
export function brokerBindAddress() {
  const ifs = os.networkInterfaces();
  for (const name of ['docker0', 'br0']) {
    const v4 = (ifs[name] || []).find(a => a.family === 'IPv4');
    if (v4) return v4.address;
  }
  return '127.0.0.1';
}

const UPSTREAM = 'https://openrouter.ai/api/v1/chat/completions';
const MODELS_URL = 'https://openrouter.ai/api/v1/models';
const MAX_BODY = 512 * 1024;
const MAX_RESPONSE = 4 * 1024 * 1024;
const DEFAULT_CALL_CAP = 200;

// Agentic clients (opencode) send tools/tool_choice and usually stream.
// Both pass through (capped by MAX_BODY): dropping tools silently breaks the
// agent loop, and a client that asked for SSE must receive SSE. Streamed
// responses are inspected for the served model BEFORE the first byte reaches
// the sandbox; a mismatch denies before anything is forwarded downstream.
export function createBroker({
  apiKey,
  allowedModels,           // exact OpenRouter ids (no prefix) resolved for this run
  callCap = DEFAULT_CALL_CAP,
  fetchImpl = fetch,
  listingRefreshMs = 60000,
  streamModelTimeoutMs = 30000, // fail closed if no served model is observed in time
  onEvent = () => {},
} = {}) {
  if (!apiKey) throw new Error('broker needs the real key (runner env only)');
  if (!Array.isArray(allowedModels) || !allowedModels.length) throw new Error('broker needs the resolved model set');
  const runToken = 'brk-' + randomBytes(24).toString('hex');
  let calls = 0;
  let listing = null, listingAt = 0;

  async function zeroPricingOk() {
    if (!listing || Date.now() - listingAt > listingRefreshMs) {
      const res = await fetchImpl(MODELS_URL, { signal: AbortSignal.timeout(20000) });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body || !Array.isArray(body.data)) return false; // fail closed
      listing = body.data; listingAt = Date.now();
    }
    try { assertZeroPricing(listing, allowedModels); return true; }
    catch { return false; }
  }

  const server = http.createServer(async (req, res) => {
    const deny = (code, msg) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: msg })); };
    if (req.method !== 'POST' || !req.url.startsWith('/v1/chat/completions')) return deny(404, 'not found');
    if (req.headers.authorization !== `Bearer ${runToken}`) return deny(401, 'bad broker token');
    if (calls >= callCap) return deny(429, 'per-run call cap reached');
    const chunks = [];
    let size = 0;
    for await (const c of req) { size += c.length; if (size > MAX_BODY) return deny(413, 'request too large'); chunks.push(c); }
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return deny(400, 'bad json'); }
    const model = String(body && body.model || '').replace(/^openrouter\//, '');
    if (!allowedModels.includes(model)) return deny(403, `model ${model} not in this run's resolved set`);
    if (!(await zeroPricingOk())) return deny(503, 'zero-pricing unverifiable - failing closed');
    calls += 1;
    const wantStream = body.stream === true;
    const forwarded = {
      model,
      messages: Array.isArray(body.messages) ? body.messages : [],
      max_tokens: Math.min(Number.isInteger(body.max_tokens) ? body.max_tokens : 4096, 8192),
      stream: wantStream,
      provider: { allow_fallbacks: false, max_price: { prompt: '0', completion: '0' } }, // provider-side ceiling on EVERY call
    };
    // Agentic-loop fields the model needs; everything else stays dropped.
    if (Array.isArray(body.tools)) forwarded.tools = body.tools;
    if (typeof body.tool_choice === 'string' || (body.tool_choice && typeof body.tool_choice === 'object')) forwarded.tool_choice = body.tool_choice;
    for (const k of ['temperature', 'top_p', 'stop', 'seed', 'response_format']) {
      if (body[k] !== undefined) forwarded[k] = body[k];
    }
    let up;
    try {
      up = await fetchImpl(UPSTREAM, {
        method: 'POST',
        signal: AbortSignal.timeout(120000),
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(forwarded),
      });
    } catch (e) {
      onEvent({ model, ok: false, error: 'upstream' });
      return deny(502, 'upstream unreachable');
    }
    const servedMismatch = (served) => served && served !== model && !served.endsWith('/' + model);
    // Streaming path, FAIL CLOSED: NOTHING reaches the client until the
    // served model is observed AND verified. Buffering is bounded by bytes
    // (64KB) AND time (streamModelTimeoutMs); a stream that ends, overruns or
    // times out without a model field is denied, never forwarded.
    if (wantStream && up.ok && up.body && typeof up.body.getReader === 'function') {
      const reader = up.body.getReader();
      const dec = new TextDecoder();
      const buffered = [];
      let total = 0, text = '', servedModel = null, streamEnded = false;
      const deadline = Date.now() + streamModelTimeoutMs;
      try {
        while (total <= 65536 && Date.now() < deadline) {
          const { done, value } = await Promise.race([
            reader.read(),
            new Promise((_, rej) => setTimeout(() => rej(new Error('model-observation deadline')), Math.max(1, deadline - Date.now()))),
          ]);
          if (done) { streamEnded = true; break; }
          total += value.length;
          if (total > MAX_RESPONSE) { await reader.cancel().catch(() => {}); onEvent({ model, ok: false, stream: true, error: 'response too large' }); return deny(502, 'upstream response too large'); }
          buffered.push(value);
          text += dec.decode(value, { stream: true });
          const m = text.match(/"model"\s*:\s*"([^"]+)"/);
          if (m) { servedModel = m[1]; break; }
        }
      } catch { await reader.cancel().catch(() => {}); onEvent({ model, ok: false, stream: true, error: 'upstream stream failed or model-observation deadline' }); return deny(502, 'upstream stream failed or served model unobservable in time'); }
      if (!servedModel) {
        // Fail closed: stream ended / overran / timed out with no model field.
        await reader.cancel().catch(() => {});
        onEvent({ model, ok: false, stream: true, error: streamEnded ? 'stream ended with no model field' : 'no model field within bounds' });
        return deny(502, 'served model unobservable - refusing to forward unverified stream');
      }
      if (servedMismatch(servedModel)) {
        await reader.cancel().catch(() => {});
        onEvent({ model, ok: false, stream: true, served_model: servedModel });
        return deny(502, `provider served ${servedModel}, not the resolved ${model}`);
      }
      res.writeHead(up.status, { 'content-type': (up.headers && typeof up.headers.get === 'function' && up.headers.get('content-type')) || 'text/event-stream' });
      for (const c of buffered) res.write(c);
      let destroyed = false;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.length;
          if (total > MAX_RESPONSE) { destroyed = true; res.destroy(); onEvent({ model, ok: false, stream: true, served_model: servedModel, error: 'response too large mid-stream' }); return; }
          res.write(value);
        }
      } catch { destroyed = true; res.destroy(); onEvent({ model, ok: false, stream: true, served_model: servedModel, error: 'upstream stream failed mid-flight' }); return; }
      res.end();
      if (!destroyed) onEvent({ model, ok: true, status: up.status, served_model: servedModel, stream: true });
      return;
    }
    const text2 = await up.text().catch(() => '');
    if (text2.length > MAX_RESPONSE) return deny(502, 'upstream response too large');
    // The provider must have served the ACTUAL resolved model (family truth,
    // not just our declaration). A mismatch is a routing failure: deny loudly.
    let served = null;
    try { served = JSON.parse(text2); } catch {}
    if (up.ok && served && typeof served.model === 'string' && servedMismatch(served.model)) {
      onEvent({ model, ok: false, status: up.status, served_model: served.model });
      return deny(502, `provider served ${served.model}, not the resolved ${model}`);
    }
    onEvent({ model, ok: up.ok, status: up.status, served_model: served && served.model });
    res.writeHead(up.status, { 'content-type': 'application/json' });
    res.end(text2);
  });

  return {
    runToken,
    calls: () => calls,
    listen: (port = 0, host = brokerBindAddress()) => new Promise((r) => server.listen(port, host, () => r({ port: server.address().port, host: server.address().address }))),
    close: () => new Promise((r) => server.close(r)),
    // What the sandbox receives: a base URL and a worthless-outside-this-run token.
    // The token is a capability for THIS run's broker only - model allowlist,
    // zero-price ceiling and the call cap still apply to whoever holds it.
    sandboxEnv: (port, host = '172.17.0.1') => ({ OPENROUTER_BASE_URL: `http://${host}:${port}/v1`, OPENROUTER_API_KEY: runToken }),
  };
}
