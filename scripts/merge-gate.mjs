#!/usr/bin/env node
// Vibe merge gate. Run on a pull request's head, as a required status check on protected main.
// Passes only when:
//   1. a Judge receipt exists and re-checks as SHIP (factory/judge-receipt.mjs rules);
//   2. nothing but evidence files changed after the receipt was committed (the Judge saw this code);
//   3. HIGH-consequence work has an approving review from someone other than the PR author.
//
//   node scripts/merge-gate.mjs [--receipt PATH] [--approvals N]
// `--approvals` is the number of approving reviews by someone other than the author (the workflow
// reads it from the GitHub API). Exit 0 = mergeable, 1 = HOLD.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { RECEIPT_PATH, evaluateReceipt } from '../factory/judge-receipt.mjs';

const EVIDENCE_DIR = 'docs/evidence/';

export function gate({ receipt, changedAfterReceipt, approvals }) {
  if (receipt === null) return { pass: false, reasons: [`no Judge receipt at ${RECEIPT_PATH}`] };
  const verdict = evaluateReceipt(receipt);
  const reasons = [...verdict.reasons];
  const stale = changedAfterReceipt.filter((file) => !file.startsWith(EVIDENCE_DIR));
  if (stale.length) {
    reasons.push(
      `changed after the Judge ruled; re-run the Judge: ${stale.slice(0, 10).join(', ')}`,
    );
  }
  if (verdict.level === 'HIGH' && !(approvals >= 1)) {
    reasons.push(
      'HIGH consequence needs an approving review from someone other than the PR author',
    );
  }
  return { pass: reasons.length === 0, level: verdict.level, reasons };
}

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function main() {
  const args = process.argv.slice(2);
  const option = (name, fallback) => {
    const index = args.indexOf(name);
    return index === -1 ? fallback : args[index + 1];
  };
  const receiptPath = option('--receipt', RECEIPT_PATH);
  const approvals = Number(option('--approvals', '0'));

  let receipt = null;
  let changedAfterReceipt = [];
  if (existsSync(receiptPath)) {
    try {
      receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
    } catch {
      receipt = 'unparseable';
    }
    const receiptCommit = git(['log', '-1', '--format=%H', '--', receiptPath]);
    if (!receiptCommit) throw new Error(`${receiptPath} exists but is not committed`);
    changedAfterReceipt = git(['diff', '--name-only', receiptCommit, 'HEAD'])
      .split('\n')
      .filter(Boolean);
  }

  const result = gate({ receipt, changedAfterReceipt, approvals });
  console.log(JSON.stringify({ decision: result.pass ? 'SHIP' : 'HOLD', ...result }, null, 2));
  process.exitCode = result.pass ? 0 : 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    main();
  } catch (error) {
    console.error(`merge gate: ${error.message}`);
    process.exitCode = 1;
  }
}
