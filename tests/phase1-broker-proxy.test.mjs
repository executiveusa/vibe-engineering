import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createBroker } from '../factory/free-broker.mjs';
import { createPreviewProxy, runOnlyAppAuth } from '../factory/preview-proxy.mjs';

const MODELS = { data: [
  { id: 'google/gemma-4-31b-it:free', pricing: { prompt: '0', completion: '0' } },
  { id: 'nvidia/nemotron-3-ultra-550b-a55b:free', pricing: { prompt: '0', completion: '0' } },
] };
const post = (port, path, headers, body) => new Promise((res, rej) => {
  const r = http.request({ host: '127.0.0.1', port, path, method: 'POST', headers }, (x) => {
    let b = ''; x.on('data', c => b += c); x.on('end', () => res({ status: x.statusCode, body: b }));
  });
  r.on('error', rej); r.end(JSON.stringify(body));
});

function brokerSetup(upstreamImpl) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    if (String(url).endsWith('/models')) return { ok: true, json: async () => MODELS };
    calls.push(JSON.parse(init.body));
    return upstreamImpl ? upstreamImpl(init) : { ok: true, status: 200, text: async () => JSON.stringify({ model: 'google/gemma-4-31b-it:free', choices: [] }) };
  };
  return { b: createBroker({ apiKey: 'REAL-KEY', allowedModels: ['google/gemma-4-31b-it:free'], fetchImpl }), calls };
}

test('broker: auth, allowlist, ceiling injection, response-model check', async () => {
  const { b, calls } = brokerSetup();
  const { port } = await b.listen(0, '127.0.0.1');
  // no/wrong token
  assert.equal((await post(port, '/v1/chat/completions', {}, {})).status, 401);
  // model outside the resolved set
  assert.equal((await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` }, { model: 'openai/gpt-5', messages: [] })).status, 403);
  // allowed model: forwarded with provider ceiling + real key, never the broker token
  const ok = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` }, { model: 'google/gemma-4-31b-it:free', messages: [{ role: 'user', content: 'x' }], max_tokens: 99999 });
  assert.equal(ok.status, 200);
  const fwd = calls[0];
  assert.equal(fwd.provider.allow_fallbacks, false);
  assert.deepEqual(fwd.provider.max_price, { prompt: '0', completion: '0' });
  assert.equal(fwd.max_tokens, 8192, 'output capped');
  assert.equal(fwd.stream, false);
  await b.close();
});

test('broker: tools/tool_choice pass through (agentic loop needs them)', async () => {
  const { b, calls } = brokerSetup();
  const { port } = await b.listen(0, '127.0.0.1');
  const tools = [{ type: 'function', function: { name: 'read', parameters: { type: 'object' } } }];
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` },
    { model: 'google/gemma-4-31b-it:free', messages: [{ role: 'user', content: 'x' }], tools, tool_choice: 'auto', temperature: 0.2 });
  assert.equal(r.status, 200);
  assert.deepEqual(calls[0].tools, tools);
  assert.equal(calls[0].tool_choice, 'auto');
  assert.equal(calls[0].temperature, 0.2);
  await b.close();
});

// SSE upstream fake: a web ReadableStream of chat.completion.chunk lines.
const sseUpstream = (model, chunks = 3) => () => ({
  ok: true, status: 200,
  headers: { get: (k) => (k === 'content-type' ? 'text/event-stream' : null) },
  body: new ReadableStream({
    start(c) {
      for (let i = 0; i < chunks; i++) {
        c.enqueue(new TextEncoder().encode(`data: {"id":"cmpl-${i}","model":"${model}","choices":[{"delta":{"content":"w${i}"}}]}\n\n`));
      }
      c.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
      c.close();
    },
  }),
});

test('broker: streaming passes SSE through after the served model is verified', async () => {
  const events = [];
  const calls = [];
  const fetchImpl = async (url, init) => {
    if (String(url).endsWith('/models')) return { ok: true, json: async () => MODELS };
    calls.push(JSON.parse(init.body));
    return sseUpstream('google/gemma-4-31b-it:free')();
  };
  const b = createBroker({ apiKey: 'K', allowedModels: ['google/gemma-4-31b-it:free'], fetchImpl, onEvent: (e) => events.push(e) });
  const { port } = await b.listen(0, '127.0.0.1');
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` },
    { model: 'google/gemma-4-31b-it:free', messages: [{ role: 'user', content: 'x' }], stream: true });
  assert.equal(r.status, 200);
  assert.match(r.body, /chat|data: /);
  assert.match(r.body, /"model":"google\/gemma-4-31b-it:free"/);
  assert.equal(calls[0].stream, true, 'stream requested upstream');
  assert.equal(events.at(-1).served_model, 'google/gemma-4-31b-it:free', 'served model recorded on the event');
  assert.equal(events.at(-1).stream, true);
  await b.close();
});

test('broker: stream with NO observable model field is denied, nothing forwarded', async () => {
  const noModelUpstream = () => ({
    ok: true, status: 200,
    headers: { get: () => 'text/event-stream' },
    body: new ReadableStream({
      start(c) {
        c.enqueue(new TextEncoder().encode('data: {"id":"x","choices":[{"delta":{"content":"hi"}}]}\n\n'));
        c.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
        c.close();
      },
    }),
  });
  const fetchImpl = async (url) => String(url).endsWith('/models') ? { ok: true, json: async () => MODELS } : noModelUpstream();
  const b = createBroker({ apiKey: 'K', allowedModels: ['google/gemma-4-31b-it:free'], fetchImpl });
  const { port } = await b.listen(0, '127.0.0.1');
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` },
    { model: 'google/gemma-4-31b-it:free', messages: [], stream: true });
  assert.equal(r.status, 502);
  assert.match(r.body, /unobservable/);
  assert.ok(!r.body.includes('"delta"'), 'no upstream content leaked');
  await b.close();
});

test('broker: model-observation deadline fails closed on a stalled stream', async () => {
  const stalled = () => ({
    ok: true, status: 200,
    headers: { get: () => 'text/event-stream' },
    body: new ReadableStream({ start() { /* never emits, never closes */ } }),
  });
  const fetchImpl = async (url) => String(url).endsWith('/models') ? { ok: true, json: async () => MODELS } : stalled();
  const b = createBroker({ apiKey: 'K', allowedModels: ['google/gemma-4-31b-it:free'], fetchImpl, streamModelTimeoutMs: 60 });
  const { port } = await b.listen(0, '127.0.0.1');
  const t0 = Date.now();
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` },
    { model: 'google/gemma-4-31b-it:free', messages: [], stream: true });
  assert.equal(r.status, 502);
  assert.ok(Date.now() - t0 < 10000, 'deadline actually bounded the wait');
  await b.close();
});

test('broker: streamed model mismatch is denied BEFORE any byte reaches the client', async () => {
  const events = [];
  const fetchImpl = async (url) => String(url).endsWith('/models')
    ? { ok: true, json: async () => MODELS }
    : sseUpstream('openai/gpt-5')();
  const b = createBroker({ apiKey: 'K', allowedModels: ['google/gemma-4-31b-it:free'], fetchImpl, onEvent: (e) => events.push(e) });
  const { port } = await b.listen(0, '127.0.0.1');
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` },
    { model: 'google/gemma-4-31b-it:free', messages: [], stream: true });
  assert.equal(r.status, 502);
  assert.match(r.body, /served openai\/gpt-5/);
  assert.ok(!r.body.includes('data:'), 'no upstream chunk leaked to the client');
  assert.equal(events.at(-1).served_model, 'openai/gpt-5');
  await b.close();
});

test('broker: response model mismatch is denied (family truth, not declaration)', async () => {
  const { b } = brokerSetup(() => ({ ok: true, status: 200, text: async () => JSON.stringify({ model: 'openai/gpt-5', choices: [] }) }));
  const { port } = await b.listen(0, '127.0.0.1');
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` }, { model: 'google/gemma-4-31b-it:free', messages: [] });
  assert.equal(r.status, 502);
  assert.match(r.body, /served openai\/gpt-5/);
  await b.close();
});

test('broker: non-zero pricing in the live listing fails closed', async () => {
  const fetchImpl = async (url) => String(url).endsWith('/models')
    ? { ok: true, json: async () => ({ data: [{ id: 'google/gemma-4-31b-it:free', pricing: { prompt: '0.000001', completion: '0' } }] }) }
    : { ok: true, status: 200, text: async () => '{}' };
  const b = createBroker({ apiKey: 'K', allowedModels: ['google/gemma-4-31b-it:free'], fetchImpl });
  const { port } = await b.listen(0, '127.0.0.1');
  const r = await post(port, '/v1/chat/completions', { authorization: `Bearer ${b.runToken}` }, { model: 'google/gemma-4-31b-it:free', messages: [] });
  assert.equal(r.status, 503);
  await b.close();
});

test('broker: call cap', async () => {
  const { b } = brokerSetup();
  const { port } = await b.listen(0, '127.0.0.1');
  // cap default 200; use a fresh low-cap broker
  await b.close();
  const b2 = createBroker({ apiKey: 'K', allowedModels: ['google/gemma-4-31b-it:free'], callCap: 1,
    fetchImpl: async (url) => String(url).endsWith('/models') ? { ok: true, json: async () => MODELS } : { ok: true, status: 200, text: async () => JSON.stringify({ model: 'google/gemma-4-31b-it:free' }) } });
  const { port: p2 } = await b2.listen(0, '127.0.0.1');
  assert.equal((await post(p2, '/v1/chat/completions', { authorization: `Bearer ${b2.runToken}` }, { model: 'google/gemma-4-31b-it:free', messages: [] })).status, 200);
  assert.equal((await post(p2, '/v1/chat/completions', { authorization: `Bearer ${b2.runToken}` }, { model: 'google/gemma-4-31b-it:free', messages: [] })).status, 429);
  await b2.close();
});

// --- preview proxy ---
function fakeApp(appAuth) {
  return http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) {
      const okApi = req.headers.authorization === `Bearer ${appAuth.apiKey}`;
      res.writeHead(okApi ? 200 : 401); res.end(okApi ? '{"ok":true}' : 'no');
    } else {
      const okBasic = req.headers.authorization === 'Basic ' + Buffer.from(`${appAuth.user}:${appAuth.password}`).toString('base64');
      res.writeHead(okBasic ? 200 : 401); res.end(okBasic ? '<html>preview</html>' : 'no');
    }
  });
}

test('preview proxy: real secret terminates at the proxy; app sees run-only creds', async () => {
  const appAuth = runOnlyAppAuth();
  const app = fakeApp(appAuth);
  await new Promise(r => app.listen(0, '127.0.0.1', r));
  const appPort = app.address().port;
  const proxy = createPreviewProxy({ basicAuth: 'viewer:s3cret', appPort, appAuth });
  const port = await proxy.listen(0);
  const get = (p, auth) => new Promise((res) => http.get({ host: '127.0.0.1', port, path: p, headers: auth ? { authorization: auth } : {} }, (r) => { let b=''; r.on('data',c=>b+=c); r.on('end',()=>res({status:r.statusCode, body:b})); }));
  // anonymous + wrong password refused at the PROXY (app never hit)
  assert.equal((await get('/')).status, 401);
  assert.equal((await get('/', 'Basic ' + Buffer.from('viewer:wrong').toString('base64'))).status, 401);
  // correct public secret: browser route gets the injected run-only basic
  const page = await get('/', 'Basic ' + Buffer.from('viewer:s3cret').toString('base64'));
  assert.equal(page.status, 200); assert.match(page.body, /preview/);
  // api route gets the injected run-only bearer
  const api = await get('/api/workspaces', 'Basic ' + Buffer.from('viewer:s3cret').toString('base64'));
  assert.equal(api.status, 200);
  // run-only creds alone (what the app env holds) do NOT open the proxy
  assert.equal((await get('/', 'Basic ' + Buffer.from(`${appAuth.user}:${appAuth.password}`).toString('base64'))).status, 401);
  await proxy.close(); await new Promise(r => app.close(r));
});
