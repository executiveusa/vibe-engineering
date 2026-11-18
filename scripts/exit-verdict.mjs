// Final factory verdict for one commit: runs the exit bar (factory/exit-bar.mjs) over the receipts in the target
// checkout and writes decision=SHIP|HOLD to GITHUB_OUTPUT. The models come from the lane settings (lane-models.mjs).
// Env: JUDGED_COMMIT, JUDGE_RECEIPT_FILE, SECURITY_RUN_FILES (comma list), DEPLOY_RECEIPT_FILE, VIBE_MODEL_LANE (+ overrides).
import fs from 'node:fs';
import { evaluateExitBar } from '../factory/exit-bar.mjs';
import { laneModels } from '../factory/lane-models.mjs';

const read = (f) => {
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch {
    return null;
  }
};
const env = process.env;
const { builderModel, judgeModel } = laneModels(env);
const verdict = evaluateExitBar({
  commit: env.JUDGED_COMMIT,
  builderModel,
  judgeModel,
  judgeReceipt: read(env.JUDGE_RECEIPT_FILE || 'docs/evidence/production-readiness-judge.json'),
  securityRuns: String(env.SECURITY_RUN_FILES || '')
    .split(',')
    .filter(Boolean)
    .map(read),
  deployReceipt: read(env.DEPLOY_RECEIPT_FILE || ''),
});
console.log(JSON.stringify(verdict, null, 2));
if (env.GITHUB_OUTPUT) fs.appendFileSync(env.GITHUB_OUTPUT, `decision=${verdict.decision}\n`);
if (env.GITHUB_STEP_SUMMARY)
  fs.appendFileSync(
    env.GITHUB_STEP_SUMMARY,
    `Exit bar: **${verdict.decision}**\n\n${verdict.reasons.map((r) => '- ' + r).join('\n')}\n`,
  );
