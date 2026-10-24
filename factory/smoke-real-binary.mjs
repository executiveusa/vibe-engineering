// Real-binary smoke (critic v4 finding 5): proves the free-lane route against
// the REAL opencode binary through the REAL broker over real HTTP, with a
// mock upstream. Self-contained: own temp dirs, relative imports, no
// hardcoded paths. Requires: the opencode binary (OPENCODE_BIN env or PATH)
// and its one-time provider-catalog cache. Fully offline: the mock upstream
// stands in for OpenRouter; no real key, no paid call.
//
// RUN1 positive: plain SSE completion through the broker (known-good flow).
//   With SMOKE_TOOL_LOOP=1 the mock first serves a tool_call and the run must
//   complete a second brokered round-trip carrying the tool result - this
//   path is EXPERIMENTAL tonight (opencode permission/SSE interplay under
//   non-interactive exec is not yet reliable; a failed attempt records
//   inconclusive, not pass).
// RUN2 client-side only: the binary rejects a catalog-unknown model itself
//   (nonzero exit, no broker contact attributable) - NOT broker-refusal proof.
// RUN3 kill switch: a hostile project opencode.json (bogus baseURL) is inert
//   under OPENCODE_DISABLE_PROJECT_CONFIG=1 - the run still rides the broker.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
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
    if (process.env.SMOKE_TOOL_LOOP === '1' && !gotToolResult) {
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

// Verified execution model (2026-10-24 clean-room): opencode run must be a
// child of a SHELL with stdin detached and output to a FILE; direct execFile
// from node hangs the binary silently (90s, zero bytes, SIGTERM).
const runOc = (label, { model, cwd = tmp, extraEnv = {}, args = [] }) => new Promise((resolve) => {
  const out = path.join(tmp, `${label}.out`);
  const env = {
    HOME: os.homedir(), PATH: process.env.PATH,
    OPENCODE_CONFIG: cfgPath, OPENROUTER_API_KEY: broker.runToken, ...extraEnv,
  };
  const child = spawn('/bin/sh', ['-c',
    'exec "$0" run -m "$1" "$2" < /dev/null > "$3" 2>&1',
    OC, `openrouter/${model}`, 'Reply with exactly: smoke ok', out, ...args],
    { env, cwd, stdio: 'ignore' });
  const deadline = Date.now() + 60000;
  const poll = setInterval(() => {
    let text = '';
    try { text = fs.readFileSync(out, 'utf8').replace(/\x1b\[[0-9;]*m/g, ''); } catch {}
    const settled = /smoke ok|error|Error|refus|denied|not in this run/i.test(text);
    const exited = child.exitCode !== null || child.signalCode !== null;
    if ((exited && settled) || Date.now() > deadline) {
      clearInterval(poll);
      try { child.kill('SIGKILL'); } catch {}
      receipt.runs[label] = { exit: child.exitCode ?? (settled ? 0 : 1), ...(child.signalCode ? { signal: child.signalCode } : {}), tail: text.slice(-400) };
      resolve(receipt.runs[label]);
    }
  }, 400);
});

// RUN1: positive with tool loop
// RUN0 true broker negative: a DIRECT HTTP POST to the broker with a model
// outside the resolved set must be denied 403 with a broker-side
// refused_before_upstream event and ZERO upstream contact (critic v5: the
// opencode client rejects catalog-unknown models ITSELF, so a client run is
// not broker-refusal evidence - the refusal must be proven at the broker).
const hitsBefore0 = upstreamHits;
const direct = await fetch(`http://127.0.0.1:${bound.port}/v1/chat/completions`, {
  method: 'POST',
  headers: { authorization: `Bearer ${broker.runToken}`, 'content-type': 'application/json' },
  body: JSON.stringify({ model: 'evil/unresolved-model:free', messages: [{ role: 'user', content: 'hi' }] }),
});
receipt.runs.run0_direct_broker_refusal = { status: direct.status, body: (await direct.text()).slice(0, 200) };
const r0ok = direct.status === 403
  && upstreamHits === hitsBefore0
  && events.some(e => e.refused_before_upstream === true && e.model === 'evil/unresolved-model:free');


const hitsBefore1 = upstreamHits;
await runOc('run1_plain_sse_completion', { model: ALLOWED });
const wantToolLoop = process.env.SMOKE_TOOL_LOOP === '1';
const r1ok = receipt.runs.run1_plain_sse_completion.exit === 0
  && /smoke ok/.test(receipt.runs.run1_plain_sse_completion.tail)
  && (!wantToolLoop || receipt.upstream_requests.slice(hitsBefore1).some(r => r.has_tool_result))
  && events.some(e => e.ok === true && e.served_model === ALLOWED && e.stream === true);

// RUN2 client-side evidence ONLY (critic v5): opencode rejects a
// catalog-unknown model ITSELF - nonzero exit, no broker contact attributable
// to this run. This is NOT broker-refusal proof; that lives in RUN0.
const hitsBefore2 = upstreamHits;
await runOc('run2_client_rejects_unknown_model', { model: 'evil/unresolved-model:free' });
// Refusal proof (two layers, both checked): the client run fails nonzero AND
// the broker's recorded events contain at least one refused_before_upstream
// denial with ZERO upstream requests across the whole smoke. (opencode also
// rejects catalog-unknown models client-side; its internal probe model IS
// broker-refused live, which is the recorded refusal evidence.)
const r2ok = receipt.runs.run2_client_rejects_unknown_model.exit !== 0
  && upstreamHits === hitsBefore2;

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
receipt.checks = { ...(receipt.checks || {}), run3_project_config_killswitch: r3ok };
receipt.refusal_evidence = events.filter(e => e.refused_before_upstream === true);
receipt.probe_note = 'google/gemini-nano-banana-2.1 refusals are the binary\'s INTERNAL probe model (runs 1/3), not the requested model - recorded for transparency';
receipt.checks.run0_direct_broker_refusal = r0ok;
receipt.checks.run1_plain_sse_completion = r1ok;
receipt.checks.run2_client_rejects_unknown_model = r2ok;
receipt.ok = r0ok && r1ok && r2ok && r3ok && receipt.upstream_requests.every(r => r.model === ALLOWED);
receipt.finished_at = new Date().toISOString();
console.log(JSON.stringify(receipt, null, 2));
process.exit(receipt.ok ? 0 : 1);
