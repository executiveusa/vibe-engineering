// Critic v5h review: bare CR is a spec-valid SSE line break. Without CR
// normalization, ': c\rdata: {"model":"evil/..."}\n\n' was ONE line to the
// broker's \r?\n splitter (a comment, forwarded unvalidated) but TWO lines
// to a compliant client (comment + data event) - actual EVIL forwarded with
// only the honest model logged. The broker now normalizes CRLF and bare CR
// to LF before framing/forwarding, holding a chunk-trailing CR until its
// pair is known, so broker and client always parse the same line structure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBroker } from '../factory/free-broker.mjs';

const LISTING = { data: [{ id: 'a/x:free', pricing: { prompt: '0', completion: '0' } }] };
const ts = Math.floor(Date.now() / 1000);
const seg = (model, content, eol = '\n') => `data: {"id":"c","created":${ts},"model":"${model}","choices":[{"index":0,"delta":{"content":"${content}"}}]}${eol}${eol}`;

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
  }).catch(() => null); // destroyed post-headers socket rejects the fetch - still fail-closed
  const text = res ? await res.text().catch(e => String(e)) : '';
  await broker.close();
  return { text, events };
}

test('critic v5h P1: bare-CR comment-smuggled data event is parsed and blocked', async () => {
  const smuggle = `: c\rdata: {"model":"evil/swapped:free","c":"EVILCONTENT"}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), smuggle, 'data: [DONE]\n\n']);
  assert.ok(!text.includes('EVILCONTENT'), 'evil content never forwarded');
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
  assert.ok(!events.some(e => e.ok === true && e.stream === true));
});

test('critic v5h P2: bare-CR event-field-smuggled data event is parsed and blocked', async () => {
  const smuggle = `event: x\rdata: {"model":"evil/swapped:free","c":"EVILCONTENT"}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), smuggle, 'data: [DONE]\n\n']);
  assert.ok(!text.includes('EVILCONTENT'));
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5h: bare-CR smuggle split across the CR chunk boundary is still blocked', async () => {
  const head = ': c\r'; // chunk ends exactly on the CR
  const tail = `data: {"model":"evil/swapped:free","c":"EVILCONTENT"}\n\n`;
  const { text, events } = await runAgainst([seg('a/x:free', 'he'), head, tail, 'data: [DONE]\n\n']);
  assert.ok(!text.includes('EVILCONTENT'));
  assert.ok(events.some(e => e.error === 'served model changed mid-stream' && e.served_model === 'evil/swapped:free'));
});

test('critic v5h control: honest CRLF-framed stream forwards completely', async () => {
  const { text, events } = await runAgainst([seg('a/x:free', 'he', '\r\n'), seg('a/x:free', 'llo', '\r\n'), 'data: [DONE]\r\n\r\n']);
  assert.ok(text.includes('"he"') && text.includes('"llo"'));
  assert.ok(!events.some(e => e.error));
  assert.ok(events.some(e => e.ok === true && e.stream === true && e.served_model === 'a/x:free'));
});

test('critic v5h control: CRLF pair split across chunks forwards completely', async () => {
  const whole = seg('a/x:free', 'he', '\r\n') + 'data: [DONE]\r\n\r\n';
  const at = whole.indexOf('\r'); // split inside the first CRLF pair
  const { text, events } = await runAgainst([whole.slice(0, at + 1), whole.slice(at + 1)]);
  assert.ok(text.includes('"he"') && text.includes('[DONE]'));
  assert.ok(events.some(e => e.ok === true && e.stream === true));
});

test('critic v5h control: honest bare-CR-framed stream is normalized and forwarded', async () => {
  const { text, events } = await runAgainst([seg('a/x:free', 'he', '\r'), 'data: [DONE]\r\r']);
  assert.ok(text.includes('"he"'));
  assert.ok(events.some(e => e.ok === true && e.stream === true && e.served_model === 'a/x:free'));
});
