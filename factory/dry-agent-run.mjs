// Runs INSIDE the sandcastle sandbox as the dry lane's "agent" command.
// Deterministic, no model, no keys, no network. The stage comes from
// VIBE_DRY_STAGE (injected by the dry AgentProvider's env).
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { dryReceipt } from './dry-receipt.mjs';

const stage = process.env.VIBE_DRY_STAGE;
const head = () => execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
const write = (p, content) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
};
const commit = (message) => {
  execSync('git add -A', { stdio: 'inherit' });
  execSync(
    `git -c user.name='vibe-factory-dry' -c user.email='dry@localhost' commit -m ${JSON.stringify(message)}`,
    { stdio: 'inherit' },
  );
};

if (stage === 'auditor') {
  write('docs/evidence/dry/auditor.md', `# Dry completion audit\n\nNo model ran. Deterministic placeholder produced by the dry lane at HEAD ${head()}.\n`);
} else if (stage === 'prd') {
  write('docs/evidence/dry/prd.md', `# Dry production-readiness PRD\n\nNo model ran. Deterministic placeholder produced by the dry lane at HEAD ${head()}.\n`);
} else if (stage === 'builder') {
  write('docs/evidence/dry/builder.md', `# Dry builder\n\nNo model ran. One trivial evidence file, committed, so the pipeline's commit handling is exercised.\n`);
  commit('dry lane: builder evidence (no model ran)');
} else if (stage === 'judge') {
  write('docs/evidence/production-readiness-judge.json', JSON.stringify(dryReceipt(head()), null, 2) + '\n');
  commit('dry lane: judge receipt (HOLD, no model ran)');
} else {
  console.error(`dry-agent-run: unknown VIBE_DRY_STAGE ${JSON.stringify(stage)}`);
  process.exit(1);
}
console.log(`dry:${stage} done`);
