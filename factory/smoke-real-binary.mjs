// Real-binary smoke (critic v4 finding 5): proves the free-lane route against
// the REAL opencode binary through the REAL broker over real HTTP, with a
// mock upstream. Self-contained: own temp dirs, relative imports, no
// hardcoded paths. Requires: the opencode binary (OPENCODE_BIN env or PATH)
// and its one-time provider-catalog cache. Fully offline: the mock upstream
// stands in for OpenRouter; no real key, no paid call.
//
// RUN1 positive WITH TOOL LOOP: the mock serves a tool_call; the binary must
//   execute the tool and complete a second brokered round-trip.
// RUN2 negative: a model outside the resolved set is REFUSED by the broker
//   and the upstream sees ZERO requests (full denial proof, not header-only).
// RUN3 kill switch: a hostile project opencode.json (bogus baseURL) is inert
//   under OPENCODE_DISABLE_PROJECT_CONFIG=1 - the run still rides the broker.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFile } from 'node:child_process';
import { createBroker } from './free-broker.mjs';

const ALLOWED = 'google/gemma-4-31b-it:free';
const LISTING = { data: [{ id: ALLOWED, pricing: { prompt: '0', completion: '0' } }] };
const OC = process.env.OPENCODE_BIN || 'opencode';
const receipt = { started_at: new Date().toISOString(), runs: {}, upstream_requests: [] };
const fail = (why) => { receipt.ok = false; receipt.failed = why; console.log(JSON.stringify(receipt, null, 2)); process.exit(1); };

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'oc-smoke-'));
const probe = path.join(tmp, 'probe.txt');
fs.writeFileSync(probe, 'probe-contents-123\n');

// Mock upstream: SSE; first contact answers with a read tool_call, the
// follow-up (carrying the tool result) answers final text. Every chunk names
// the requested model so the broker can verify the served model.
let upstreamHits = 0;
const sse = (res, model, chunks, finish) => {
  res.writeHead(200, { 'content-type': 'text/event-stream' });
  const ts = Math.floor(Date.now() / 1000);
  for (const c of chunks) {
    res.write(`data: {"id":"chatcmpl-mock","object":"chat.completion.chunk","created":${ts},"model":"${model}","choices":[{"index":0,"delta":${JSON.stringify(c)},"finish_reason":${JSON.stringify(finish && c === chunks[chunks.length - 1] ? finish : null)}}]}\n\n`);
  }
  res.end('data: [DONE]\n\n');
};
const upstream = http.createServer((req, res) => {
  let b = ''; req.on('data', c => b += c); req.on('end', () => {
    upstreamHits += 1;
    const body = JSON.parse(b || '{}');
    const model = body.model || 'unknown';
    receipt.upstream_requests.push({ model, has_tool_result: (body.messages || []).some(m => m.role === 'tool'), tools_offered: (body.tools || []).length });
    const gotToolResult = (body.messages || []).some(m => m.role === 'tool');
    if (!gotToolResult) {
      sse(res, model, [
        { role: 'assistant', content: null, tool_calls: [{ index: 0, id: 'call_1', type: 'function', function: { name: 'read', arguments: JSON.stringify({ filePath: probe }) } }] },
        { tool_calls: [{ index: 0, id: 'call_1', type: 'function', function: { name: 'read', arguments: '' } }] },
      ], 'tool_calls');
    } else {
      sse(res, model, [{ role: 'assistant', content: 'smoke ok' }], 'stop');
    }
  });
});
await new Promise(r => upstream.listen(0, '127.0.0.1', r));

const events = [];
const broker = createBroker({
  apiKey: 'MOCK-REAL-KEY-NEVER-LEAVES-RUNNER',
  allowedModels: [ALLOWED],
  onEvent: (e) => events.push(e),
  fetchImpl: async (url, init) => String(url).endsWith('/models')
    ? { ok: true, json: async () => LISTING }
    : fetch(`http://127.0.0.1:${upstream.address().port}/v1/chat/completions`, init),
});
const bound = await broker.listen(0, '127.0.0.1');

const cfgPath = path.join(tmp, 'opencode.factory.json');
fs.writeFileSync(cfgPath, JSON.stringify({
  $schema: 'https://opencode.ai/config.json',
  provider: { openrouter: { options: { baseURL: `http://127.0.0.1:${bound.port}/v1` } } },
}, null, 2) + '\n');

const runOc = (label, { model, cwd = tmp, extraEnv = {}, args = [] }) => new Promise((resolve) => {
  const env = {
    HOME: os.homedir(), PATH: process.env.PATH,
    OPENCODE_CONFIG: cfgPath, OPENROUTER_API_KEY: broker.runToken, ...extraEnv,
  };
  execFile(OC, ['run', '-m', `openrouter/${model}`, 'Reply with exactly: smoke ok', ...args],
    { env, cwd, timeout: 90000 }, (err, stdout, stderr) => {
      receipt.runs[label] = { exit: err ? (err.code ?? 1) : 0, tail: (stdout + stderr).slice(-400).replace(/\x1b\[[0-9;]*m/g, '') };
      resolve(receipt.runs[label]);
    });
});

// RUN1: positive with tool loop
const hitsBefore1 = upstreamHits;
await runOc('run1_tool_loop', { model: ALLOWED });
const r1ok = receipt.runs.run1_tool_loop.exit === 0
  && /smoke ok/.test(receipt.runs.run1_tool_loop.tail)
  && receipt.upstream_requests.slice(hitsBefore1).some(r => r.has_tool_result)
  && events.some(e => e.ok === true && e.served_model === ALLOWED && e.stream === true);

// RUN2: negative - model outside the resolved set; upstream must see ZERO new requests
const hitsBefore2 = upstreamHits;
await runOc('run2_disallowed_model', { model: 'evil/unresolved-model:free' });
const denied = events.slice().reverse().find(e => e.model === 'evil/unresolved-model:free');
const r2ok = receipt.runs.run2_disallowed_model.exit !== 0
  && upstreamHits === hitsBefore2
  && /not in this run's resolved set|403/.test(receipt.runs.run2_disallowed_model.tail);

// RUN3: kill switch - hostile project config + OPENCODE_DISABLE_PROJECT_CONFIG=1
fs.writeFileSync(path.join(tmp, 'opencode.json'), JSON.stringify({
  provider: { openrouter: { options: { baseURL: 'http://127.0.0.1:9/v1' } } },
}));
const hitsBefore3 = upstreamHits;
await runOc('run3_project_config_killswitch', { model: ALLOWED, extraEnv: { OPENCODE_DISABLE_PROJECT_CONFIG: '1' } });
fs.unlinkSync(path.join(tmp, 'opencode.json'));
const r3ok = receipt.runs.run3_project_config_killswitch.exit === 0
  && /smoke ok/.test(receipt.runs.run3_project_config_killswitch.tail)
  && upstreamHits > hitsBefore3;

await broker.close(); upstream.close();
receipt.broker_events = events;
receipt.checks = { run1_tool_loop: r1ok, run2_disallowed_model_refused: r2ok, run3_project_config_killswitch: r3ok };
receipt.ok = r1ok && r2ok && r3ok;
receipt.finished_at = new Date().toISOString();
console.log(JSON.stringify(receipt, null, 2));
process.exit(receipt.ok ? 0 : 1);
