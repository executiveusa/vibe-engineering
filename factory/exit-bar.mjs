// The StarNet factory exit bar (pauli-starnet program/starnet-v2/_shared/PRD.md section 8).
// A product leaves the factory only when every one of these holds for ONE commit:
//   1. the Judge receipt is SHIP by its own numbers (evaluateReceipt) and fills the exit_bar section:
//      every PRD backend feature works with tests, UDEC >= 8.5, the-extractor found no AI slop;
//   2. the security district passed: two independent attack runs (G15), zero HIGH/CRITICAL, every MEDIUM fixed
//      or captain-accepted, both on this commit;
//   3. three voices: builder, Judge and security auditor are three different model families. The builder and
//      Judge families come from the RUNNER (what it actually launched), never from a receipt an agent wrote;
//   4. the deploy step put this exact commit on the private VPS preview: the preview serves BUILD_SHA == the
//      judged commit and the live tests passed.
// Anything missing or malformed is HOLD. Returns { decision: "SHIP" | "HOLD", reasons[] }.

import { evaluateReceipt, modelFamily } from './judge-receipt.mjs';

export const MIN_UDEC = 8.5;
const SHA = /^[0-9a-f]{40}$/;

export function evaluateExitBar({
  commit,
  builderModel,
  judgeModel,
  judgeReceipt,
  securityRuns,
  deployReceipt,
} = {}) {
  const reasons = [];
  if (!SHA.test(String(commit || '')))
    return { decision: 'HOLD', reasons: ['commit must be a full 40-character sha'] };

  // 1. the Judge
  const judged = evaluateReceipt(judgeReceipt);
  for (const r of judged.reasons) reasons.push('judge: ' + r);
  const bar =
    judgeReceipt && typeof judgeReceipt.exit_bar === 'object' && judgeReceipt.exit_bar
      ? judgeReceipt.exit_bar
      : {};
  if (judgeReceipt && judgeReceipt.commit !== commit)
    reasons.push(
      'judge: receipt is for ' + (judgeReceipt.commit || 'no commit') + ', not ' + commit,
    );
  if (bar.backend_features !== 'PASS')
    reasons.push(
      'exit bar: backend_features is ' +
        (bar.backend_features ?? 'missing') +
        ' (every PRD backend feature works, with tests)',
    );
  if (!(typeof bar.udec_score === 'number' && bar.udec_score >= MIN_UDEC))
    reasons.push('exit bar: udec_score must be a number >= ' + MIN_UDEC);
  if (bar.extractor_slop_findings !== 0)
    reasons.push('exit bar: extractor_slop_findings must be 0');

  // 2. the security district
  const runs = Array.isArray(securityRuns) ? securityRuns : [];
  if (runs.length < 2) reasons.push('security: G15 needs two attack runs, got ' + runs.length);
  const auditorFamilies = new Set();
  runs.forEach((run, i) => {
    const tag = 'security run ' + (i + 1) + ': ';
    if (!run || typeof run !== 'object') {
      reasons.push(tag + 'not a JSON object');
      return;
    }
    if (run.commit !== commit)
      reasons.push(tag + 'is for ' + (run.commit || 'no commit') + ', not ' + commit);
    const findings = Array.isArray(run.findings) ? run.findings : null;
    if (!findings) {
      reasons.push(tag + 'has no findings list');
      return;
    }
    const blocking = findings.filter((f) => f && ['HIGH', 'CRITICAL'].includes(f.severity));
    if (blocking.length)
      reasons.push(tag + blocking.length + ' HIGH/CRITICAL finding(s), never waivable');
    const openMedium = findings.filter(
      (f) => f && f.severity === 'MEDIUM' && !f.fixed && f.accepted_by !== 'captain',
    );
    if (openMedium.length)
      reasons.push(
        tag + openMedium.length + ' MEDIUM finding(s) neither fixed nor captain-accepted',
      );
    if (!run.auditor_model) reasons.push(tag + 'names no auditor_model');
    else auditorFamilies.add(modelFamily(run.auditor_model));
  });

  // 3. three voices
  const builder = modelFamily(builderModel),
    judge = modelFamily(judgeModel);
  if (!builder || !judge) reasons.push('voices: the runner must name the builder and Judge models');
  else if (builder === judge)
    reasons.push('voices: Judge family ' + judge + ' equals the builder family');
  for (const a of auditorFamilies)
    if (a === builder || a === judge)
      reasons.push('voices: security auditor family ' + a + ' equals the builder or Judge family');

  // 4. the deploy step
  const d = deployReceipt && typeof deployReceipt === 'object' ? deployReceipt : null;
  if (!d) reasons.push('deploy: no deploy receipt (the separate deploy step has not run)');
  else {
    if (d.commit !== commit)
      reasons.push('deploy: receipt is for ' + (d.commit || 'no commit') + ', not ' + commit);
    if (d.served_build_sha !== commit)
      reasons.push(
        'deploy: the preview serves BUILD_SHA ' +
          (d.served_build_sha || 'none') +
          ', not the judged commit',
      );
    if (d.live_tests !== 'PASS')
      reasons.push('deploy: live tests are ' + (d.live_tests ?? 'missing'));
    if (d.visibility !== 'private')
      reasons.push('deploy: the preview must be private (public go-live is red)');
  }

  return { decision: reasons.length ? 'HOLD' : 'SHIP', reasons };
}
