// Phase 1 model resolution (architect 0016 section 4.1 + builder 0017 Q17):
// preferences are pinned, availability is resolved against the LIVE :free list
// at run time, and the three stages must land on three different model FAMILIES
// or the run HOLDs. No silent substitution, no paid fallback from free
// unavailability - a failed resolution is a HOLD with a reason.

// Preference lists live in factory/model-preferences.json (architect 0018
// rule 2); resolution order is judge, then reviewer, then builder, so the
// judge gets its best pick first. loadPreferences reads the JSON shipped next
// to this module (copied into the control runtime tree by the workflow).
import { readFileSync } from 'node:fs';
export const RESOLUTION_ORDER = ['judge', 'reviewer', 'builder'];
export function loadPreferences(fileUrl = new URL('./model-preferences.json', import.meta.url)) {
  const prefs = JSON.parse(readFileSync(fileUrl, 'utf8'));
  for (const role of RESOLUTION_ORDER) {
    if (!Array.isArray(prefs[role]) || !prefs[role].length || !prefs[role].every(x => typeof x === 'string' && x.length)) {
      throw new Error(`model-preferences.json: ${role} must be a non-empty string list`);
    }
  }
  return prefs;
}
export const FAMILY_PREFERENCES = loadPreferences();

export function familyOf(modelId) {
  // The family is the provider namespace before '/'; pinned ids match exactly.
  const i = String(modelId || '').indexOf('/');
  return i > 0 ? modelId.slice(0, i) : '';
}

function pricingOf(listing, id) {
  const m = listing.find(x => x && typeof x === 'object' && x.id === id);
  return m && m.pricing ? m.pricing : null;
}
export function isZeroPriced(listing, id) {
  const p = pricingOf(listing, id);
  if (!p) return false; // unknown pricing is NOT free
  return Number(p.prompt) === 0 && Number(p.completion) === 0;
}
// The free lane must be provably $0: re-checked before every stage call. A
// free->paid price flip must fail closed, never spend unbounded through a
// key-carrying sandbox. (TOCTOU residual between check and call is documented.)
export function assertZeroPricing(listing, ids) {
  if (!Array.isArray(listing)) throw new Error('pricing re-check unreadable - HOLD');
  for (const id of ids) {
    if (!isZeroPriced(listing, id)) throw new Error(`${id} is not zero-priced in the live listing - refusing the free-lane call`);
  }
  return true;
}

export function resolveModels(listing, preferences = FAMILY_PREFERENCES) {
  if (!Array.isArray(listing)) throw new Error('listing unreadable - HOLD (cannot verify free availability)');
  const free = new Set(listing.filter(m => {
    const id = typeof m === 'string' ? m : m && m.id;
    if (!id || !id.endsWith(':free')) return false;
    return typeof m === 'string' ? true : isZeroPriced(listing, id); // object entries must prove $0
  }).map(m => typeof m === 'string' ? m : m.id));
  const taken = new Set();
  const resolved = {};
  const reasons = [];
  for (const stage of RESOLUTION_ORDER) {
    let pick = null;
    for (const pref of preferences[stage]) {
      if (pref.endsWith(':free')) { // exact pinned id
        if (free.has(pref) && !taken.has(familyOf(pref))) { pick = pref; break; }
      } else { // family prefix: first listed free model in an untaken family
        const fam = pref.replace(/\/$/, '');
        if (taken.has(fam)) continue;
        const candidate = [...free].filter(id => id.startsWith(pref)).sort()[0];
        if (candidate) { pick = candidate; break; }
      }
    }
    if (!pick) { reasons.push(`${stage}: no available :free model in an untaken family`); resolved[stage] = null; }
    else { resolved[stage] = pick; taken.add(familyOf(pick)); }
  }
  if (reasons.length) return { ok: false, hold: reasons.join('; '), resolved };
  return { ok: true, resolved };
}

export function assertIndependent(builder, reviewer, judge) {
  const fams = [builder, reviewer, judge].map(familyOf);
  if (fams.some(f => !f)) throw new Error('independence check: unparseable model id');
  if (new Set(fams).size !== 3) throw new Error(`independence check: builder/reviewer/judge must be three families, got ${fams.join(', ')}`);
  return true;
}

// Revalidation (critic v4 finding 3): re-fetch the :free listing at verify
// time and recompute its hash. 'match' = the receipt still names live
// provider truth; 'stale' = the listing drifted mid-run (evidence no longer
// verifiable - the runner treats this as HOLD); 'unverifiable' = fetch
// failed (fail closed).
export async function revalidateListingHash(receipt, fetchImpl = fetch, modelsUrl = 'https://openrouter.ai/api/v1/models') {
  if (!receipt || typeof receipt.listing_sha256 !== 'string') return { status: 'unverifiable', reason: 'no receipt hash' };
  try {
    const res = await fetchImpl(modelsUrl, { signal: AbortSignal.timeout(20000) });
    const text = await res.text();
    if (!res.ok) return { status: 'unverifiable', reason: `listing fetch ${res.status}` };
    const { createHash } = await import('node:crypto');
    const live = createHash('sha256').update(text).digest('hex');
    return live === receipt.listing_sha256
      ? { status: 'match', listing_sha256: live }
      : { status: 'stale', receipt: receipt.listing_sha256, live };
  } catch (e) {
    return { status: 'unverifiable', reason: String((e && e.message) || e) };
  }
}
