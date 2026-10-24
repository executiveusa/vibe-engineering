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
// Count top-level "model" keys in a JSON object payload WITHOUT collapsing
// duplicates: walks the raw text, JSON-decoding depth-1 key strings (escaped
// twins count as the same key). Only called on payloads that already parsed.
export function countTopLevelModelKeys(text) {
  let count = 0, depth = 0, inStr = false, esc = false, keyStart = -1, expectKey = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inStr) {
      if (esc) esc = false;
      else if (c === '\\') esc = true;
      else if (c === '"') {
        inStr = false;
        if (depth === 1 && expectKey && keyStart >= 0) {
          let key = null;
          try { key = JSON.parse(text.slice(keyStart, i + 1)); } catch { /* unparseable key token: ignore */ }
          if (key === 'model') count += 1;
        }
        expectKey = false;
      }
      continue;
    }
    if (c === '"') { inStr = true; if (depth === 1 && expectKey) keyStart = i; }
    else if (c === '{' || c === '[') { depth += 1; if (depth === 1 && c === '{') expectKey = true; }
    else if (c === '}' || c === ']') depth -= 1;
    else if (c === ',' && depth === 1) expectKey = true;
  }
  return count;
}

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
    // critic v5: a THROWING fetch (network down, DNS, abort) must not escape
    // as an unhandled rejection in the request handler (client hang / process
    // crash) - every failure mode degrades to a bounded 503.
    try {
      if (!listing || Date.now() - listingAt > listingRefreshMs) {
        const res = await fetchImpl(MODELS_URL, { signal: AbortSignal.timeout(20000) });
        const body = await res.json().catch(() => null);
        if (!res.ok || !body || !Array.isArray(body.data)) return false; // fail closed
        listing = body.data; listingAt = Date.now();
      }
      assertZeroPricing(listing, allowedModels); return true;
    } catch { return false; }
  }

  const server = http.createServer(async (req, res) => {
    const deny = (code, msg) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: msg })); };
    // Exact route match (architect 0025 nit): parse the URL; a prefix match
    // would also pass /v1/chat/completionsXYZ or query variants.
    let pathname = ''; try { pathname = new URL(req.url, 'http://broker.local').pathname; } catch {}
    if (req.method !== 'POST' || pathname !== '/v1/chat/completions') return deny(404, 'not found');
    if (req.headers.authorization !== `Bearer ${runToken}`) return deny(401, 'bad broker token');
    if (calls >= callCap) return deny(429, 'per-run call cap reached');
    const chunks = [];
    let size = 0;
    for await (const c of req) { size += c.length; if (size > MAX_BODY) return deny(413, 'request too large'); chunks.push(c); }
    let body; try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { return deny(400, 'bad json'); }
    const model = String(body && body.model || '').replace(/^openrouter\//, '');
    if (!allowedModels.includes(model)) { onEvent({ model, ok: false, error: 'refused: model not in resolved set', refused_before_upstream: true }); return deny(403, `model ${model} not in this run's resolved set`); }
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
    // Unified SSE event validator (critic v5g review): the stream is parsed
    // into COMPLETE events (blank-line framing absorbs any chunk split or
    // coalescing), each event's data payload is JSON.parsed - so a
    // JSON-escaped key like "\u006dodel" decodes to the real key - and the
    // .model of EVERY data event must equal the resolved model BEFORE that
    // event is forwarded. One validator covers the initial prefix and every
    // later event; there is no prefix/forward seam. NOTHING reaches the
    // client until the first verified model field (bounded by 64KB and
    // streamModelTimeoutMs). Forwarded bytes are the event's original TEXT
    // re-encoded: valid UTF-8 (incl. 4-byte emoji) passes intact, invalid
    // sequences re-encode as U+FFFD - literal byte-losslessness is NOT
    // claimed. A stream ending on an incomplete event fails closed (the
    // unvalidated suffix is never forwarded); a trailing lone quote at EOF is
    // a documented, accepted fail-closed false positive.
    if (wantStream && up.ok && up.body && typeof up.body.getReader === 'function') {
      const reader = up.body.getReader();
      const dec = new TextDecoder();
      let total = 0, pending = '', destroyed = false, headerSent = false, servedModel = null;
      const held = []; // validated no-data events (comments) seen before the first model
      const deadline = Date.now() + streamModelTimeoutMs;
      const writeHeadOnce = () => {
        if (!headerSent) {
          res.writeHead(up.status, { 'content-type': (up.headers && typeof up.headers.get === 'function' && up.headers.get('content-type')) || 'text/event-stream' });
          headerSent = true;
        }
      };
      const failStream = (served, why) => {
        destroyed = true;
        onEvent({ model, ok: false, stream: true, ...(served ? { served_model: served } : {}), error: why });
        if (headerSent) res.destroy(); else deny(502, why);
      };
      const processCompleteEvents = () => {
        const parts = pending.split('\n\n');
        pending = parts.pop(); // trailing (possibly incomplete) event stays buffered
        for (const evt of parts) {
          const dataLines = evt.split('\n').filter((l) => l.startsWith('data:')).map((l) => l.slice(5).replace(/^ /, ''));
          if (!dataLines.length) { // comment / event-only lines: no content, no model info
            if (servedModel) { writeHeadOnce(); res.write(evt + '\n\n'); } else held.push(evt);
            continue;
          }
          const payload = dataLines.join('\n');
          if (payload.trim() === '[DONE]') {
            if (!servedModel) { failStream(null, 'stream ended with no model field'); return false; }
            writeHeadOnce(); res.write(evt + '\n\n'); continue;
          }
          let obj;
          try { obj = JSON.parse(payload); } catch { failStream(null, 'unparseable SSE data event - refusing to forward unverifiable stream'); return false; }
          // architect 0034 (P2): JSON.parse keeps the LAST duplicate key (and
          // its reviver walks the collapsed object, so a reviver cannot count
          // duplicates), so {"model":"evil","model":"honest"} reads honest
          // here while a first-wins downstream parser reads evil. Count the
          // top-level "model" keys in the RAW payload with a tiny tokenizer
          // (key strings JSON-decoded, so an escaped-key twin like
          // "\u006dodel" counts too); duplicates are anomalous - fail closed.
          if (countTopLevelModelKeys(payload) > 1) {
            failStream(null, 'duplicate top-level model key - anomalous event refused');
            return false;
          }
          const served = obj && typeof obj.model === 'string' ? obj.model : null;
          if (!served) { failStream(null, 'served model unobservable - refusing to forward unverified stream'); return false; }
          if (servedMismatch(served)) {
            if (!servedModel) failStream(served, `provider served ${served}, not the resolved ${model}`);
            else failStream(served, 'served model changed mid-stream');
            return false;
          }
          if (!servedModel) {
            servedModel = served;
            writeHeadOnce();
            for (const h of held) res.write(h + '\n\n');
            held.length = 0;
          }
          res.write(evt + '\n\n');
        }
        return true;
      };
      try {
        for (;;) {
          let timer = null;
          const { done, value } = !servedModel
            ? await Promise.race([
                reader.read().finally(() => clearTimeout(timer)),
                new Promise((_, rej) => { timer = setTimeout(() => rej(new Error('model-observation deadline')), Math.max(1, deadline - Date.now())); }),
              ])
            : await reader.read();
          if (done) break;
          total += value.length;
          if (total > MAX_RESPONSE) { failStream(null, 'upstream response too large'); return; }
          pending += dec.decode(value, { stream: true });
          // critic v5h review: CR is a spec-valid SSE line break on its own.
          // Without normalization a bare CR hides a data line inside what a
          // naive \\r?\\n splitter sees as one comment line - the broker
          // forwards bytes a compliant client parses as an UNVALIDATED event.
          // Normalize CRLF and bare CR to LF BEFORE framing and forwarding,
          // so broker and client always parse the SAME line structure. A
          // chunk-trailing CR is held until its pair (\\n or not) is known.
          let trailingCr = '';
          if (pending.endsWith('\r')) { trailingCr = '\r'; pending = pending.slice(0, -1); }
          pending = pending.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
          if (!processCompleteEvents()) return;
          pending += trailingCr; // unresolved CR waits for the next chunk (or EOF)
          if (!servedModel && pending.length > 65536) { failStream(null, 'no model field within bounds'); return; }
        }
      } catch { if (!destroyed) failStream(null, 'upstream stream failed or served model unobservable in time'); return; }
      pending += dec.decode();
      pending = pending.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // final normalize (incl. a held trailing CR)
      if (!processCompleteEvents()) return; // frame + validate any events completed by the tail
      if (!servedModel) { failStream(null, 'stream ended with no model field'); return; }
      if (pending.trim() !== '') { failStream(servedModel, 'stream ended with incomplete SSE event (unvalidated suffix refused)'); return; }
      res.end();
      onEvent({ model, ok: true, status: up.status, served_model: servedModel, stream: true });
      return;
    }
    const text2 = await up.text().catch(() => '');
    if (text2.length > MAX_RESPONSE) return deny(502, 'upstream response too large');
    // The provider must have served the ACTUAL resolved model (family truth,
    // not just our declaration). A mismatch is a routing failure: deny loudly.
    let served = null;
    try { served = JSON.parse(text2); } catch {}
    if (up.ok) {
      // FAIL CLOSED (critic v4 finding 4): a successful response with no
      // observable model field is UNVERIFIED - deny, never forward its bytes.
      if (!served || typeof served.model !== 'string' || !served.model) {
        onEvent({ model, ok: false, status: up.status, error: 'non-stream response has no model field' });
        return deny(502, 'served model unobservable - refusing to forward unverified response');
      }
      if (servedMismatch(served.model)) {
        onEvent({ model, ok: false, status: up.status, served_model: served.model });
        return deny(502, `provider served ${served.model}, not the resolved ${model}`);
      }
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
