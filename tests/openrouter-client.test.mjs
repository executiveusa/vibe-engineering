import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, existsSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { chat, chatInternal, worstCaseUsd, ledgerTotal, inputTokenUpperBound, MODEL, CAP_USD,
  RATE_IN_PER_M, RATE_OUT_PER_M, RATE_IN_PER_TOKEN, RATE_OUT_PER_TOKEN, OVERHEAD, MAX_OUTPUT_LIMIT }
  from '../factory/openrouter-client.mjs';

const KEY = 'test-key';
const pinListing = () => ({ ok: true, status: 200, json: async () => ({ data: [{ id: MODEL, pricing: { prompt: String(RATE_IN_PER_TOKEN), completion: String(RATE_OUT_PER_TOKEN) } }] }) });
const completion = (usage = { prompt_tokens: 10, completion_tokens: 5 }, id = 'gen-1') =>
  ({ ok: true, status: 200, json: async () => ({ id, choices: [{ message: { content: 'hi' } }], usage }) });
const generation = (cost) => ({ ok: true, status: 200, json: async () => ({ data: { total_cost: cost } }) });

function stubFetch(routes, events = []) {
  return async (url, init) => {
    const u = String(url);
    events.push(u.split('/').slice(-2).join('/'));
    for (const [frag, resp] of routes) if (u.includes(frag)) return typeof resp === 'function' ? resp(init) : resp;
    throw new Error('unstubbed fetch: ' + u);
  };
}
function setup() {
  const dir = mkdtempSync(path.join(tmpdir(), 'orv3-'));
  return { ledger: path.join(dir, 'ledger.jsonl'), lock: path.join(dir, 'lock'), opts: { ledgerPath: path.join(dir, 'ledger.jsonl'), lockPath: path.join(dir, 'lock') } };
}
const lines = (p) => existsSync(p) ? readFileSync(p, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [];
const base = (extra = {}) => ({ messages: [{ role: 'user', content: 'x' }], stage: 'test', apiKey: KEY, ...extra });

test('pure helpers', () => {
  assert.equal(typeof inputTokenUpperBound([{ role: 'user', content: 'hi' }]), 'number');
  assert.ok(inputTokenUpperBound([{ role: 'user', content: 'hi' }]) > 0);
  const w = worstCaseUsd({ inputBoundTokens: 1000, maxOutputTokens: 100 });
  assert.ok(Math.abs(w - (1000 * RATE_IN_PER_TOKEN + 100 * RATE_OUT_PER_TOKEN) * OVERHEAD) < 1e-12);
});

test('ledger accounting is conservative', () => {
  const { opts } = setup(); const p = opts.ledgerPath;
  assert.equal(ledgerTotal(p), 0);
  writeFileSync(p, JSON.stringify({ t: 'reserve', id: 'a', reserved_usd: 0.5 }) + '\n');
  assert.equal(ledgerTotal(p), 0.5);
  appendFileSync(p, JSON.stringify({ t: 'reconcile', id: 'a', actual_usd: 0.2 }) + '\n');
  assert.equal(ledgerTotal(p), 0.2);
  // reconcile above reservation counts as the full reservation, never more
  appendFileSync(p, JSON.stringify({ t: 'reconcile', id: 'a', actual_usd: 9 }) + '\n');
  assert.equal(ledgerTotal(p), 0.5);
  // negative / NaN / string actuals are ignored -> falls back to reservation
  appendFileSync(p, JSON.stringify({ t: 'reconcile', id: 'a', actual_usd: -1 }) + '\n' +
    JSON.stringify({ t: 'reconcile', id: 'a', actual_usd: NaN }) + '\n' +
    JSON.stringify({ t: 'reconcile', id: 'a', actual_usd: '0.01' }) + '\n');
  assert.equal(ledgerTotal(p), 0.5);
  // v4 fail-closed: a corrupt line, a malformed record, or an overrun marker
  // means true spend is unknowable -> the ledger counts the FULL CAP and every
  // future call is refused.
  appendFileSync(p, 'not json\n');
  assert.equal(ledgerTotal(p), CAP_USD, 'corrupt line fails closed at the cap');
  writeFileSync(p, JSON.stringify({ t: 'reserve', id: 7, reserved_usd: 3 }) + '\n');
  assert.equal(ledgerTotal(p), CAP_USD, 'non-string id fails closed at the cap');
  writeFileSync(p, JSON.stringify({ t: 'overrun', id: 'x', actual_usd: 1 }) + '\n');
  assert.equal(ledgerTotal(p), CAP_USD, 'overrun marker halts all future calls');
});

test('refuses before any fetch or ledger write', async () => {
  const { opts } = setup();
  let calls = 0; const f = async () => { calls++; };
  await assert.rejects(chatInternal(base({ ...opts, apiKey: '', fetchImpl: f })), /OPENROUTER_API_KEY/);
  for (const bad of [0, -1, 1.5, MAX_OUTPUT_LIMIT + 1, 'x', NaN, Infinity]) {
    await assert.rejects(chatInternal(base({ ...opts, maxOutputTokens: bad, fetchImpl: f })), /maxOutputTokens/);
  }
  assert.equal(calls, 0); assert.equal(lines(opts.ledgerPath).length, 0);
});

test('lock held refuses before fetch or reserve', async () => {
  const { opts } = setup(); writeFileSync(opts.lockPath, 'x');
  let calls = 0;
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: async () => { calls++; } })), /lock held/);
  assert.equal(calls, 0); assert.equal(lines(opts.ledgerPath).length, 0);
});

test('rate check failure or mismatch refuses; no reservation written', async () => {
  const { opts } = setup();
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: async () => ({ ok: false, status: 500, json: async () => null }) })), /rate check failed/);
  const wrong = stubFetch([['/models', { ok: true, status: 200, json: async () => ({ data: [{ id: MODEL, pricing: { prompt: '0.0000002', completion: String(RATE_OUT_PER_TOKEN) } }] }) }]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: wrong })), /rates changed/);
  const missing = stubFetch([['/models', { ok: true, status: 200, json: async () => ({ data: [] }) }]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: missing })), /not in live listing/);
  assert.equal(lines(opts.ledgerPath).length, 0);
});

test('happy path: reserve is durable BEFORE the paid call; generation cost reconciles', async () => {
  const { opts } = setup(); const events = [];
  const f = stubFetch([
    ['/models', pinListing()],
    ['/generation', generation(0.000011)],
    ['/chat/completions', () => { // at paid-call time the reservation must already be on disk
      const rs = lines(opts.ledgerPath); assert.equal(rs.length, 1); assert.equal(rs[0].t, 'reserve');
      events.push('paid-after-reserve'); return completion(); }],
  ], events);
  const r = await chatInternal(base({ ...opts, fetchImpl: f }));
  assert.deepEqual(events.slice(0, 1), ["v1/models"]); assert.ok(events.includes('paid-after-reserve'));
  assert.equal(r.cost_source, 'generation'); assert.equal(r.actual_usd, 0.000011);
  assert.equal(ledgerTotal(opts.ledgerPath), 0.000011);
  assert.equal(existsSync(opts.lockPath), false, 'lock released');
  assert.equal(lines(opts.ledgerPath).length, 2);
});

test('cap refusal: nothing reserved, no paid call, counts prior reservations', async () => {
  const { opts } = setup();
  writeFileSync(opts.ledgerPath, JSON.stringify({ t: 'reserve', id: 'old', reserved_usd: CAP_USD - 0.000001 }) + '\n');
  const events = [];
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: stubFetch([['/models', pinListing()], ['/chat/completions', () => { events.push('paid'); return completion(); }]]) })), /cap refused/);
  assert.deepEqual(events, []);
  assert.equal(lines(opts.ledgerPath).length, 1);
});

test('unknown outcome retains the reservation forever (no release path)', async () => {
  const { opts } = setup();
  const f = stubFetch([['/models', pinListing()], ['/chat/completions', () => { throw new Error('network vanished mid-call'); }]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: f })), /reservation .* retained/);
  const rs = lines(opts.ledgerPath);
  assert.equal(rs.length, 1); assert.equal(rs[0].t, 'reserve');
  assert.ok(ledgerTotal(opts.ledgerPath) > 0, 'retained reservation still counts toward the cap');
  assert.equal(existsSync(opts.lockPath), false);
});

test('usage arithmetic fallback when generation lookup fails', async () => {
  const { opts } = setup();
  const f = stubFetch([['/models', pinListing()], ['/generation', () => { throw new Error('down'); }], ['/chat/completions', completion({ prompt_tokens: 100, completion_tokens: 50 })]]);
  const r = await chatInternal(base({ ...opts, fetchImpl: f }));
  assert.equal(r.cost_source, 'usage');
  assert.ok(Math.abs(r.actual_usd - (100 * RATE_IN_PER_TOKEN + 50 * RATE_OUT_PER_TOKEN)) < 1e-12);
});

test('unreadable cost (bad usage, no generation) retains the reservation', async () => {
  const { opts } = setup();
  const f = stubFetch([['/models', pinListing()], ['/generation', { ok: true, status: 200, json: async () => ({ data: { total_cost: 'oops' } }) }], ['/chat/completions', completion({ prompt_tokens: -1, completion_tokens: 5 })]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: f })), /reservation .* retained/);
  assert.equal(lines(opts.ledgerPath).length, 1);
});

test('provider pin: allow_fallbacks false and max_price strings sent', async () => {
  const { opts } = setup(); let sent = null;
  const f = stubFetch([['/models', pinListing()], ['/generation', generation(1e-7)],
    ['/chat/completions', (init) => { sent = JSON.parse(init.body); return completion(); }]]);
  await chatInternal(base({ ...opts, fetchImpl: f }));
  assert.equal(sent.provider.allow_fallbacks, false);
  assert.equal(sent.provider.max_price.prompt, String(RATE_IN_PER_M));
  assert.equal(sent.provider.max_price.completion, String(RATE_OUT_PER_M));
  assert.equal(sent.model, MODEL);
});

test('v4: provider cost above reservation records an overrun and halts all future calls', async () => {
  const { opts } = setup();
  const f = stubFetch([['/models', pinListing()], ['/generation', generation(99)], ['/chat/completions', completion()]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: f })), /OVERRUN.*halted/);
  const rs = lines(opts.ledgerPath);
  assert.equal(rs.at(-1).t, 'overrun');
  assert.equal(ledgerTotal(opts.ledgerPath), CAP_USD, 'overrun counts the full cap');
  // every later call refuses at the cap check, before any paid fetch
  let paid = false;
  const f2 = stubFetch([['/models', pinListing()], ['/chat/completions', () => { paid = true; return completion(); }]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: f2 })), /cap refused/);
  assert.equal(paid, false);
});

test('v4: deadline is validated, an AbortSignal is passed, abort retains the reservation', async () => {
  const { opts } = setup();
  for (const bad of [0, 999, 120001, 1.5, 'x']) {
    await assert.rejects(chatInternal(base({ ...opts, deadlineMs: bad, fetchImpl: async () => { throw new Error('no fetch expected'); } })), /deadlineMs/);
  }
  let sawSignal = null;
  const f = stubFetch([['/models', pinListing()], ['/chat/completions', (init) => {
    sawSignal = init.signal;
    const e = new Error('The operation was aborted'); e.name = 'AbortError'; throw e;
  }]]);
  await assert.rejects(chatInternal(base({ ...opts, fetchImpl: f })), /reservation .* retained/);
  assert.ok(sawSignal instanceof AbortSignal, 'paid call carries an AbortSignal');
  assert.equal(lines(opts.ledgerPath).length, 1);
  assert.ok(ledgerTotal(opts.ledgerPath) > 0, 'aborted call keeps its reservation');
});

test('v4: the exported chat route hardwires cap, ledger and lock (no caller path escape)', async () => {
  // chat() accepts only messages/stage/maxOutputTokens/deadlineMs; a caller-supplied
  // ledgerPath is not even in its signature. With no API key it refuses before IO.
  const saved = process.env.OPENROUTER_API_KEY; delete process.env.OPENROUTER_API_KEY;
  try {
    await assert.rejects(chat({ messages: [{ role: 'user', content: 'x' }], stage: 't', apiKey: '', ledgerPath: '/tmp/escape' }), /OPENROUTER_API_KEY/);
  } finally { if (saved !== undefined) process.env.OPENROUTER_API_KEY = saved; }
});
