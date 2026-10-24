import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { runCall } from '../factory/run-call.mjs';

test('runCall persists the result text before returning (mock client)', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'runcall-'));
  const out = path.join(dir, 'out.md');
  const r = await runCall({ stage: 't', maxOutputTokens: 10, outFile: out, prompt: 'p',
    chatImpl: async () => ({ id: 'x', text: 'the drafted text', actual_usd: 0.001, reserved_usd: 0.002, cost_source: 'usage' }) });
  assert.equal(readFileSync(out, 'utf8'), 'the drafted text');
  assert.equal(r.actual_usd, 0.001);
});

test('runCall propagates client errors without writing', async () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'runcall-'));
  await assert.rejects(runCall({ stage: 't', maxOutputTokens: 10, outFile: path.join(dir, 'o'), prompt: 'p',
    chatImpl: async () => { throw new Error('cap refused'); } }), /cap refused/);
});

// Dry reviewer stage: deterministic CLEAN verdict through the real dry harness
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import os from 'node:os';
test('dry reviewer stage writes a CLEAN review.json and commits it', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'dry-rev-'));
  const run = (cmd) => spawnSync(cmd[0], cmd.slice(1), { cwd: dir, encoding: 'utf8' });
  assert.equal(run(['git', 'init', '-q']).status, 0);
  assert.equal(run(['git', '-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '--allow-empty', '-m', 'init']).status, 0);
  spawnSync('cp', ['factory/dry-agent-run.mjs', path.join(dir, 'dry-agent-run.mjs')]);
  spawnSync('cp', ['factory/dry-receipt.mjs', path.join(dir, 'dry-receipt.mjs')]);
  const r = spawnSync('node', ['dry-agent-run.mjs'], { cwd: dir, env: { ...process.env, VIBE_DRY_STAGE: 'reviewer' }, encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const review = JSON.parse(readFileSync(path.join(dir, 'docs/evidence/review.json'), 'utf8'));
  assert.equal(review.verdict, 'CLEAN');
  assert.equal(review.p0 + review.p1, 0);
  const log = run(['git', 'log', '--format=%s', '-1']);
  assert.match(log.stdout, /reviewer verdict/);
});
