// The one and only receipt the dry lane can produce. Shared by the in-sandbox
// dry agent and the enforcement tests so the shape cannot drift between them.
// A dry run means NO MODEL RAN, so the receipt is always HOLD: evaluateReceipt
// refuses it on the lane marker alone, and the merge gate (which delegates to
// evaluateReceipt) refuses it the same way - even under a fully forged SHIP
// body (score, p0/p1, all checks PASS). Proven in tests/enforcement.test.mjs.
//
// BOUNDED guarantee: this rejects artifacts that CARRY the dry marker and keeps
// dry output off the real receipt path. It is not a provenance system: nothing
// here stops a malicious writer from authoring an unmarked receipt; that class
// is the merge gate's existing job (receipt currency, checks, approvals).
export const DRY_RECEIPT_PATH = 'docs/evidence/production-readiness-judge.dry.json';

export function dryReceipt(headSha) {
  return {
    lane: 'dry',
    decision: 'HOLD',
    required_actions: ['dry lane: no model ran'],
    consequence_level: 'LOW',
    system_impact_summary: `dry lane run at HEAD ${headSha}: no model ran; pipeline mechanics only`,
  };
}
