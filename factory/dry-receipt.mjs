// The one and only receipt the dry lane can produce. Shared by the in-sandbox
// dry agent and the enforcement tests so the shape cannot drift between them.
// A dry run means NO MODEL RAN, so the receipt is always HOLD: evaluateReceipt
// refuses it on the decision alone, and even a tampered decision:"SHIP" copy
// still fails on score, p0/p1 and every required check. The merge gate refuses
// it for the same reasons. Proven in tests/enforcement.test.mjs.
export function dryReceipt(headSha) {
  return {
    decision: 'HOLD',
    required_actions: ['dry lane: no model ran'],
    consequence_level: 'LOW',
    system_impact_summary: `dry lane run at HEAD ${headSha}: no model ran; pipeline mechanics only`,
  };
}
