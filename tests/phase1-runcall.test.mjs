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
