// Judge receipt rules, shared by the nightly factory runner and the merge gate.
// A receipt is `docs/evidence/production-readiness-judge.json` (see reviewer-judge-prompt.md).
// The Judge's own word is not enough: SHIP only counts when the numbers behind it agree.

export const RECEIPT_PATH = 'docs/evidence/production-readiness-judge.json';

export const REQUIRED_CHECKS = [
  'specification',
  'build',
  'tests',
  'security',
  'user_journey',
  'deployment_config',
  'ownership',
  'rollback',
  'evidence',
  'prompt_injection',
];
// May be N/A: motion_audit (no web UI), system_impact (below HIGH).
export const OPTIONAL_CHECKS = ['motion_audit', 'system_impact'];
export const LEVELS = ['LOW', 'MEDIUM', 'HIGH'];
export const MIN_SCORE = 85;

// Returns { decision: "SHIP" | "HOLD", level, reasons[] }. Anything malformed is HOLD.
export function evaluateReceipt(receipt) {
  const reasons = [];
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
    return { decision: 'HOLD', level: null, reasons: ['receipt is not a JSON object'] };
  }
  const level = LEVELS.includes(receipt.consequence_level) ? receipt.consequence_level : null;
  if (!level) reasons.push('consequence_level must be LOW, MEDIUM or HIGH');
  if (receipt.decision !== 'SHIP')
    reasons.push(`Judge decision is ${JSON.stringify(receipt.decision ?? null)}`);
  if (!(typeof receipt.score === 'number' && receipt.score >= MIN_SCORE)) {
    reasons.push(`score must be a number >= ${MIN_SCORE}`);
  }
  for (const key of ['p0_remaining', 'p1_remaining']) {
    if (receipt[key] !== 0) reasons.push(`${key} must be 0`);
  }
  const checks = receipt.checks && typeof receipt.checks === 'object' ? receipt.checks : {};
  for (const name of REQUIRED_CHECKS) {
    if (checks[name] !== 'PASS') reasons.push(`check ${name} is ${checks[name] ?? 'missing'}`);
  }
  for (const name of OPTIONAL_CHECKS) {
    const mustPass = name === 'system_impact' && level === 'HIGH';
    const allowed = mustPass ? ['PASS'] : ['PASS', 'N/A'];
    if (!allowed.includes(checks[name]))
      reasons.push(`check ${name} is ${checks[name] ?? 'missing'}`);
  }
  return { decision: reasons.length ? 'HOLD' : 'SHIP', level, reasons };
}

// Families must differ so the Judge does not share the builder's blind spots.
export function assertIndependentJudge(builderFamily, judgeFamily) {
  if (!builderFamily || !judgeFamily || builderFamily === judgeFamily) {
    throw new Error(
      `Judge family (${judgeFamily}) must differ from builder family (${builderFamily}).`,
    );
  }
}
