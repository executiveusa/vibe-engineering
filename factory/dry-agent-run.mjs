// Runs INSIDE the sandcastle sandbox as the dry lane's "agent" command.
// Deterministic, no model, no keys, no network. The stage comes from
// VIBE_DRY_STAGE (injected by the dry AgentProvider's env).
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { DRY_RECEIPT_PATH, dryReceipt } from './dry-receipt.mjs';

const stage = process.env.VIBE_DRY_STAGE;
const head = () => execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};
// Commit with captured diagnostics: the dry contract is to exercise the
// pipeline's commit path deterministically, so when nothing stages (for
// example a target repo's ignore rules swallow docs/) the evidence is
// reported and an explicit empty commit stands in - the root cause is never
// masked silently (independent-review requirement).
const run = (cmd) => {
  try {
    return { status: 0, out: execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) };
  } catch (error) {
    return { status: error.status ?? 1, out: `${error.stdout ?? ''}${error.stderr ?? ''}` };
  }
};
const commit = (message) => {
  let r = run('git add -A');
  if (r.status !== 0) {
    console.error(`dry-agent-run: git add failed (${r.status}): ${r.out.trim()}`);
    process.exit(1);
  }
  const staged = run('git status --porcelain').out.trim();
  if (staged === '') {
    const ignored = run('git check-ignore -v docs/evidence || true').out.trim();
    console.log(`dry-agent-run: nothing staged after git add -A (check-ignore: ${ignored || 'no match'}); using --allow-empty to exercise the commit path`);
  }
  r = run(`git -c user.name='vibe-factory-dry' -c user.email='dry@localhost' commit ${staged === '' ? '--allow-empty ' : ''}-m ${JSON.stringify(message)}`);
  if (r.status !== 0) {
    console.error(`dry-agent-run: git commit failed (${r.status}): ${r.out.trim()}`);
    process.exit(1);
  }
  console.log(`dry-agent-run: committed (${staged === '' ? 'empty, nothing staged' : 'with staged changes'})`);
};

if (stage === 'auditor') {
  write('docs/evidence/dry/auditor.md', `# Dry completion audit\n\nNo model ran. Deterministic placeholder produced by the dry lane at HEAD ${head()}.\n`);
} else if (stage === 'prd') {
  write('docs/evidence/dry/prd.md', `# Dry production-readiness PRD\n\nNo model ran. Deterministic placeholder produced by the dry lane at HEAD ${head()}.\n`);
} else if (stage === 'builder') {
  write('docs/evidence/dry/builder.md', `# Dry builder\n\nNo model ran. One trivial evidence file, committed, so the pipeline's commit handling is exercised.\n`);
  commit('dry lane: builder evidence (no model ran)');
} else if (stage === 'judge') {
  // The dry receipt never occupies the real Judge receipt path: the merge gate
  // must find no ship-eligible artifact from a dry run, even under forgery.
  write(DRY_RECEIPT_PATH, JSON.stringify(dryReceipt(head()), null, 2) + '\n');
  commit('dry lane: judge receipt (HOLD, no model ran)');
} else {
  console.error(`dry-agent-run: unknown VIBE_DRY_STAGE ${JSON.stringify(stage)}`);
  process.exit(1);
}
console.log(`dry:${stage} done`);
