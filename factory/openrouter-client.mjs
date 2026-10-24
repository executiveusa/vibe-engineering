// OpenRouter chat client, LOCAL OPERATOR ROUTE ONLY (single process, central
// ledger). The paid sandbox/CI lanes are retired: no real key ever enters a
// target container. No account-wide cap is claimed or altered - this ledger
// bounds THIS route's calls only, against the owner's $6.00 total for tonight.
//
// Spend regime:
// 1. Serialize FIRST, cap-check INSIDE the lock: the lock is taken before any
//    ledger read, so two processes cannot both pass the cap (v2 race closed).
//    A stale lock means a crashed call: halt, manual clear only.
// 2. Input bound is MEASURED: byte length of the serialized messages
//    (conservative provable upper bound for BPE tokenizers).
// 3. Output bound is provider-enforced: max_tokens is sent and reserved in
//    full; it must be a positive finite integer (no NaN/string/negative).
// 4. Live re-rate before EVERY call: the model's prompt/completion prices are
//    re-read from the free /api/v1/models listing and must match the pinned
//    verified rates exactly, else refuse (rates changed -> stop, don't guess).
// 5. Provider-side price constraint rides the request: provider.max_price
//    (USD per million tokens, per OpenRouter docs, string values) pinned to the
//    verified rates, allow_fallbacks: false.
// 6. Reservation is fsync'd to the central ledger BEFORE the paid call. A
//    crash after this point keeps the spend counted forever.
// 7. Unknown outcome (network error, timeout, missing/invalid cost AND usage):
//    reservation retained; there is NO release mechanism. The counted total
//    can never decrease except by a reconcile with a KNOWN actual cost, and a
//    reconcile is accepted only when 0 <= actual <= reservation for that call.
//    The ledger total can never go negative.
// 8. Reconciliation prefers the provider-reported cost (/api/v1/generation
//    total_cost, validated finite non-negative) over usage arithmetic
//    (validated finite non-negative integers).
//
// Rates verified 2026-10-24 against https://openrouter.ai/api/v1/models:
// deepseek/deepseek-v4.1-flash-1017 $0.15/M input, $0.60/M output.
// (Undated alias prices differently; pinned dated ID only.)
import { readFileSync, existsSync, openSync, writeSync, fsyncSync, closeSync, constants, rmSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

export const MODEL = 'deepseek/deepseek-v4.1-flash-1017';
export const RATE_IN_PER_M = 0.15;   // USD per million prompt tokens (verified)
export const RATE_OUT_PER_M = 0.60;  // USD per million completion tokens (verified)
export const RATE_IN_PER_TOKEN = RATE_IN_PER_M / 1e6;
export const RATE_OUT_PER_TOKEN = RATE_OUT_PER_M / 1e6;
export const OVERHEAD = 1.25;        // fees beyond token rates stay inside the reservation
export const CAP_USD = 6.0;
export const MAX_OUTPUT_LIMIT = 16384;

export const DEFAULT_LEDGER = path.join(homedir(), '.starnet-spend-ledger.jsonl');
export const DEFAULT_LOCK = path.join(homedir(), '.starnet-spend-lock');

export function inputTokenUpperBound(messages) {
  return new TextEncoder().encode(JSON.stringify(messages)).byteLength;
}

export function worstCaseUsd({ inputBoundTokens, maxOutputTokens }) {
  return (inputBoundTokens * RATE_IN_PER_TOKEN + maxOutputTokens * RATE_OUT_PER_TOKEN) * OVERHEAD;
}

function validCount(n) { return Number.isFinite(n) && n >= 0; }

export function ledgerTotal(ledgerPath = DEFAULT_LEDGER) {
  if (!existsSync(ledgerPath)) return 0;
  const calls = new Map();
  for (const line of readFileSync(ledgerPath, 'utf8').split('\n').filter(Boolean)) {
    let r; try { r = JSON.parse(line); } catch { return CAP_USD; } // corrupt ledger: true spend unknowable, fail CLOSED at the cap
    if (r && r.t === 'overrun') return CAP_USD; // a provider once charged above a reservation: halt all future calls
    if (!r || typeof r.id !== 'string') return CAP_USD; // malformed record: fail closed
    const c = calls.get(r.id) ?? { reserved: 0, actual: null };
    if (r.t === 'reserve' && validCount(r.reserved_usd)) c.reserved += r.reserved_usd;
    // A reconcile counts ONLY when it lands inside its own reservation:
    // known actual cost, never below zero, never above what was reserved.
    if (r.t === 'reconcile' && validCount(r.actual_usd)) {
      const candidate = r.actual_usd;
      if (candidate <= c.reserved) c.actual = candidate; else c.actual = c.reserved;
    }
    calls.set(r.id, c);
  }
  let total = 0;
  for (const c of calls.values()) total += (c.actual ?? c.reserved);
  return Math.max(0, total);
}

function appendDurable(ledgerPath, record) {
  const fd = openSync(ledgerPath, constants.O_CREAT | constants.O_APPEND | constants.O_WRONLY, 0o600);
  try { writeSync(fd, JSON.stringify(record) + '\n'); fsyncSync(fd); }
  finally { closeSync(fd); }
}

async function fetchJson(fetchImpl, url, init) {
  const res = await fetchImpl(url, init);
  const body = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, body };
}

// Live re-rate: refuse the paid call unless the free models listing still
// shows the pinned verified rates for the pinned model id.
export async function verifyRatesLive(fetchImpl = fetch, baseUrl = 'https://openrouter.ai/api/v1') {
  const { ok, body } = await fetchJson(fetchImpl, `${baseUrl}/models`);
  if (!ok || !body || !Array.isArray(body.data)) throw new Error('rate check failed - refusing paid call (cannot bound cost)');
  const m = body.data.find(x => x && x.id === MODEL);
  const pin = m && m.pricing;
  if (!pin) throw new Error(`model ${MODEL} not in live listing - refusing paid call`);
  const inRate = Number(pin.prompt), outRate = Number(pin.completion);
  if (!validCount(inRate) || !validCount(outRate)) throw new Error('live pricing unreadable - refusing paid call');
  if (Math.abs(inRate - RATE_IN_PER_TOKEN) > 1e-12 || Math.abs(outRate - RATE_OUT_PER_TOKEN) > 1e-12) {
    throw new Error(`rates changed: live $${inRate * 1e6}/$${outRate * 1e6} per M vs pinned $${RATE_IN_PER_M}/$${RATE_OUT_PER_M} - refusing paid call`);
  }
  return true;
}

const DEFAULT_DEADLINE_MS = 60000;
const MAX_DEADLINE_MS = 120000;

async function chatInternal({
  messages, stage,
  maxOutputTokens = 4096,
  deadlineMs = DEFAULT_DEADLINE_MS,
  ledgerPath = DEFAULT_LEDGER, lockPath = DEFAULT_LOCK,
  fetchImpl = fetch, apiKey = process.env.OPENROUTER_API_KEY,
  baseUrl = 'https://openrouter.ai/api/v1',
}) {
  if (!Number.isInteger(deadlineMs) || deadlineMs < 1000 || deadlineMs > MAX_DEADLINE_MS) {
    throw new Error(`deadlineMs must be an integer in 1000..${MAX_DEADLINE_MS}`);
  }
  if (!apiKey) throw new Error('OPENROUTER_API_KEY unset - refusing paid call');
  if (!Number.isInteger(maxOutputTokens) || maxOutputTokens <= 0 || maxOutputTokens > MAX_OUTPUT_LIMIT) {
    throw new Error(`maxOutputTokens must be an integer in 1..${MAX_OUTPUT_LIMIT}`);
  }
  // Serialize FIRST: every ledger read below happens inside the lock.
  let fd;
  try { fd = openSync(lockPath, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY); }
  catch { throw new Error('lock held: a call is in flight or crashed - serialized regime halts, manual clear only'); }
  closeSync(fd);
  const id = `or-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  try {
    await verifyRatesLive(fetchImpl, baseUrl);
    const inputBound = inputTokenUpperBound(messages);
    const reserved = worstCaseUsd({ inputBoundTokens: inputBound, maxOutputTokens });
    const spent = ledgerTotal(ledgerPath); // cap check INSIDE the lock
    if (spent + reserved > CAP_USD) {
      throw new Error(`cap refused: counted $${spent.toFixed(4)} + reserved $${reserved.toFixed(4)} > $${CAP_USD}`);
    }
    // DURABLE RESERVATION BEFORE the paid call (crash-safe ordering)
    appendDurable(ledgerPath, { t: 'reserve', id, ts: new Date().toISOString(), stage, model: MODEL,
      reserved_usd: Number(reserved.toFixed(6)), input_bound_tokens: inputBound, max_output_tokens: maxOutputTokens });

    let body;
    try {
      const r = await fetchJson(fetchImpl, `${baseUrl}/chat/completions`, {
        method: 'POST',
        signal: AbortSignal.timeout(deadlineMs), // on abort: unknown outcome, reservation retained below
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL, messages, max_tokens: maxOutputTokens, stream: false,
          provider: {
            allow_fallbacks: false,
            max_price: { prompt: String(RATE_IN_PER_M), completion: String(RATE_OUT_PER_M) },
          },
        }),
      });
      body = r.body;
      if (!r.ok) throw new Error(`openrouter ${r.status}: ${JSON.stringify(body?.error ?? body).slice(0, 300)}`);
    } catch (e) {
      throw new Error(`unknown outcome, reservation $${reserved.toFixed(4)} retained (id ${id}): ${e.message}`);
    }

    let actual = null, source = null;
    if (body && typeof body.id === 'string' && body.id) {
      try {
        const g = await fetchJson(fetchImpl, `${baseUrl}/generation?id=${encodeURIComponent(body.id)}`,
          { headers: { 'Authorization': `Bearer ${apiKey}` } });
        const cost = g.body?.data?.total_cost;
        if (g.ok && validCount(cost)) { actual = cost; source = 'generation'; }
      } catch { /* fall through to usage arithmetic */ }
    }
    const u = body?.usage;
    if (actual === null && u && validCount(u.prompt_tokens) && validCount(u.completion_tokens)
        && Number.isInteger(u.prompt_tokens) && Number.isInteger(u.completion_tokens)) {
      actual = u.prompt_tokens * RATE_IN_PER_TOKEN + u.completion_tokens * RATE_OUT_PER_TOKEN;
      source = 'usage';
    }
    if (actual === null || !validCount(actual)) {
      throw new Error(`unknown cost, reservation $${reserved.toFixed(4)} retained (id ${id})`);
    }
    if (actual > reserved) {
      // The provider charged above the bound. Never clamp and pretend the cap
      // held: record the overrun (halts every future call via ledgerTotal) and report it.
      appendDurable(ledgerPath, { t: 'overrun', id, ts: new Date().toISOString(),
        actual_usd: Number(actual.toFixed(8)), reserved_usd: Number(reserved.toFixed(6)), source });
      throw new Error(`OVERRUN: provider charged $${actual.toFixed(8)} > reservation $${reserved.toFixed(6)} (id ${id}); all future paid calls halted until the operator reconciles by hand`);
    }
    appendDurable(ledgerPath, { t: 'reconcile', id, ts: new Date().toISOString(),
      actual_usd: Number(actual.toFixed(8)), source,
      prompt_tokens: u?.prompt_tokens ?? null, completion_tokens: u?.completion_tokens ?? null });
    return { id, text: body?.choices?.[0]?.message?.content ?? '', usage: u ?? null, actual_usd: actual, reserved_usd: reserved, cost_source: source };
  } finally {
    // Lock releases so the operator CAN continue deliberately; safety lives in
    // the retained reservation, not the lock.
    try { rmSync(lockPath, { force: true }); } catch {}
  }
}

// The one sanctioned paid route: cap, ledger and lock are hardwired, so no
// caller can point a call at a fresh ledger to escape the $6 history.
// Tests use chatInternal with isolated paths.
export async function chat({ messages, stage, maxOutputTokens, deadlineMs }) {
  return chatInternal({ messages, stage, maxOutputTokens, deadlineMs });
}
export { chatInternal };
