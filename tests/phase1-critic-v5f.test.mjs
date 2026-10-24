// Critic v5f review: the post-prefix forwarding loop was bypassable with real
// HTTP timed chunk probes - (a) one chunk carrying an honest model AND a
// swapped model was forwarded whole (only the first match checked), and (b) a
// model key/colon/value SPLIT ACROSS chunks was forwarded with no event
// (chunk-isolated regex). The forwarding path now validates carry+chunk with
// matchAll, forwards only the validated prefix, holds back trailing partials
// (including a lone '"'), and fails closed on an unterminated model field at
// stream end. These regressions drive the REAL HTTP path with multi-enqueue
// ReadableStream mocks - NOT Response(string), which lands in the prefix path
// and cannot prove forwarding integrity.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBroker } from '../factory/free-broker.mjs';

const LISTING = { data: [{ id: 'a/x:free', pricing: { prompt: '0', completion: '0' } }] };
const ts = Math.floor(Date.now() / 1000);
const seg = (model, content) => `data: {"id":"c","object":"chat.completion.chunk","created":${ts},"model":"${model}","choices":[{"index":0,"delta":{"content":"${content}"},"finish_reason":null}]}\n\n`;

// A streaming upstream that enqueues each piece as a SEPARATE chunk.
function streamResponse(pieces) {
  const stream = new ReadableStream({
    async start(c) {
      for (const p of pieces) { c.enqueue(new TextEncoder().encode(p)); await new Promise(r => setTimeout(r, 15)); }
      c.close();
    },
  });
  return new Response(stream, { status: 200, headers: { 'content-type': 'text/event-stream' } });
}

async function runAgainst(pieces) {
  const events = [];
  const broker = createBroker({
    apiKey: 'k', allowedModels: ['a/x:free'], onEvent: e => events.push(e),
    fetchImpl: async (url) => String(url).endsWith('/models')
      ? { ok: true, json: async () => LISTING }
      : streamResponse(pieces),
  });
  const { port } = await broker.listen(0, '127.0.0.1');
  const res = await fetch(`http://127.0.0.1:${port}/v1/chat/completions`, {
    method: 'POST', headers: { authorization: `Bearer ${broker.runToken}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'a/x:free', messages: [], stream: true }),
  });
  const text = await res.text().catch(e => String(e));
  await broker.close();
  return { text, events };
}

test('critic v5f: post-prefix chunk carrying honest+swapped models is destroyed, swapped content never forwarded', async () => {
  // Chunk 2 carries the honest model FIRST and the swap SECOND in ONE read.
  // First-match-only checking forwards this whole chunk; matchAll must not.
  const { text, events } = await runAgainst([
    seg('a/x:free', 'he'),
    seg('a/x:free', 'XX') + seg('evil/swapped:free', 'llo'),
    'data: [DONE]\n\n',
  ]);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
  assert.ok(!events.some(e => e.ok === true && e.stream === true));
});

test('critic v5f: model key split across chunk boundary fails closed', async () => {
  const head = `data: {"id":"c","created":${ts},"mod`;
  const tail = `el":"evil/swapped:free","choices":[{"index":0,"delta":{"content":"llo"},"finish_reason":null}]}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), head, tail, 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5f: lone quote at a chunk boundary cannot smuggle a model field', async () => {
  const head = `data: {"id":"c","created":${ts},"`; // trailing lone "
  const tail = `model":"evil/swapped:free","choices":[{"index":0,"delta":{"content":"llo"},"finish_reason":null}]}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), head, tail, 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5f: key+colon split across chunks fails closed', async () => {
  const head = `data: {"id":"c","created":${ts},"model" : `; // key + colon, value next chunk
  const tail = `"evil/swapped:free","choices":[{"index":0,"delta":{"content":"llo"},"finish_reason":null}]}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), head, tail, 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5f: model value split across chunks is reassembled and checked', async () => {
  const head = `data: {"id":"c","created":${ts},"model":"evil/swap`;
  const tail = `ped:free","choices":[{"index":0,"delta":{"content":"llo"},"finish_reason":null}]}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), head, tail, 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5f: stream ending on an unterminated model field fails closed (suffix never forwarded)', async () => {
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), `data: {"id":"c","model":"a/x:free","choices":[{"delta":{"content":"ok"}},"mod`]);
  assert.ok(!text.includes('"mod')); // the held-back unterminated suffix never reaches the client
  assert.ok(events.some(e => e.error === 'stream ended with unterminated model field'));
  assert.ok(!events.some(e => e.ok === true && e.stream === true));
});

test('critic v5f: control - multi-chunk all-honest stream forwards completely', async () => {
  const { text, events } = await runAgainst([
    seg('a/x:free', 'he'), seg('a/x:free', 'll'), seg('a/x:free', 'o'), seg('a/x:free', ' world'), 'data: [DONE]\n\n',
  ]);
  for (const piece of ['he', 'll', 'o', ' world']) assert.ok(text.includes(piece), `missing ${piece}`);
  assert.ok(!events.some(e => e.error)); // no error events on a clean stream
  assert.ok(events.some(e => e.ok === true && e.stream === true && e.served_model === 'a/x:free'));
});
