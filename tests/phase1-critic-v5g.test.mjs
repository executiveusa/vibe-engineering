// Critic v5g review: the prefix/forward SEAM was bypassable - the observation
// prefix was forwarded RAW, so a first read carrying an honest model plus a
// trailing PARTIAL key ({..."mod) let the next read complete an EVIL field
// outside the carry's knowledge; and a JSON-escaped key ("�odel")
// decoded to a real "model" key that the byte regex never saw. The broker now
// parses the stream into COMPLETE SSE data events, JSON.parses each payload,
// and checks .model on every event before forwarding it - one validator for
// the prefix and all future events. These are the grammar-boundary freezes.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBroker } from '../factory/free-broker.mjs';

const LISTING = { data: [{ id: 'a/x:free', pricing: { prompt: '0', completion: '0' } }] };
const ts = Math.floor(Date.now() / 1000);
const seg = (model, content) => `data: {"id":"c","object":"chat.completion.chunk","created":${ts},"model":"${model}","choices":[{"index":0,"delta":{"content":"${content}"},"finish_reason":null}]}\n\n`;

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
  }).catch(() => null); // a destroyed post-headers socket rejects the fetch itself - still fail-closed
  const text = res ? await res.text().catch(e => String(e)) : '';
  await broker.close();
  return { text, events };
}

test('critic v5g: prefix/forward SEAM - first read honest model + trailing partial key, second read completes EVIL', async () => {
  const first = seg('a/x:free', 'he') + `data: {"id":"c","created":${ts},"mod`;
  const second = `el":"evil/swapped:free","choices":[{"index":0,"delta":{"content":"llo"},"finish_reason":null}]}\n\n`;
  const { text, events } = await runAgainst([first, second, 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
  assert.ok(!events.some(e => e.ok === true && e.stream === true));
});

test('critic v5g: JSON-escaped key "�odel" is decoded by JSON.parse and blocked', async () => {
  const evil = `data: {"id":"c","created":${ts},"\\u006dodel":"evil/swapped:free","choices":[{"index":0,"delta":{"content":"llo"},"finish_reason":null}]}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), evil, 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5g: 4-byte emoji content passes intact through the validator', async () => {
  const { text, events } = await runAgainst([seg('a/x:free', 'emoji:😀 end'), 'data: [DONE]\n\n']);
  assert.ok(text.includes('emoji:😀 end'), 'emoji content survived');
  assert.ok(events.some(e => e.ok === true && e.stream === true && e.served_model === 'a/x:free'));
});

test('critic v5g: keepalive comment before the first data event is held, then forwarded after verification', async () => {
  const { text, events } = await runAgainst([': OPENROUTER PROCESSING\n\n', seg('a/x:free', 'he'), 'data: [DONE]\n\n']);
  assert.ok(text.includes(': OPENROUTER PROCESSING'), 'comment forwarded once verified');
  assert.ok(text.includes('"content":"he"'));
  assert.ok(events.some(e => e.ok === true && e.stream === true));
});

test('critic v5g: stream of only [DONE] with no model field fails closed', async () => {
  const { events } = await runAgainst(['data: [DONE]\n\n']);
  assert.ok(events.some(e => e.ok === false && /no model field/.test(e.error || '')));
  assert.ok(!events.some(e => e.ok === true && e.stream === true));
});

test('critic v5g: coalesced read carrying honest event + evil event fails closed, evil never forwarded', async () => {
  const { text, events } = await runAgainst([seg('a/x:free', 'he') + seg('evil/swapped:free', 'llo'), 'data: [DONE]\n\n']);
  assert.doesNotMatch(text, /llo/);
  // coalesced in the FIRST read: the honest prefix may or may not have been
  // flushed before the evil event was parsed, but the evil bytes never are.
  assert.ok(events.some(e => e.error && /mid-stream|provider served/.test(e.error)));
});
