// Phase 1 model resolution (architect 0016 section 4.1 + builder 0017 Q17):
// preferences are pinned, availability is resolved against the LIVE :free list
// at run time, and the three stages must land on three different model FAMILIES
// or the run HOLDs. No silent substitution, no paid fallback from free
// unavailability - a failed resolution is a HOLD with a reason.

export const FAMILY_PREFERENCES = {
  // Qwen ids are not currently listed :free; preference order skips families
  // already taken by an earlier stage at resolve time.
  builder: ['qwen/', 'recursive/', 'xingchen-agi/', 'dots-studio/', 'liquid/', 'poolside/'],
  reviewer: ['google/gemma-4-31b-it:free', 'google/'],
  judge: ['nvidia/nemotron-3-ultra-550b-a55b:free', 'nvidia/', 'cohere/', 'thinkingmachines/'],
};

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
  for (const stage of ['builder', 'reviewer', 'judge']) {
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
