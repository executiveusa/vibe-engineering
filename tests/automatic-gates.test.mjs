import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { runAutomaticGateChecks } from '../src/journey/automatic-gates.mjs';

async function makeRoot() {
  return fs.mkdtemp(path.join(os.tmpdir(), 'vibe-auto-gates-'));
}

async function writeJson(root, relative, value) {
  const full = path.join(root, relative);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, JSON.stringify(value, null, 2) + '\n');
}

async function writeText(root, relative, value = '') {
  const full = path.join(root, relative);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, value);
}

test('start stage checks canonical filesystem and requires durable owner intent evidence', async () => {
  const root = await makeRoot();
  await writeText(root, 'AGENTS.md');
  await writeText(root, 'ICMR.yaml');
  await writeText(root, 'CONTEXT.md');

  let result = await runAutomaticGateChecks({ root, stageId: '00-start' });
  assert.equal(result.gateResults['project-walkable'], true);
  assert.equal(result.gateResults['owner-intent-named'], false);

  await writeJson(root, '.vibe/evidence/00-start/owner-intent-named.json', {
    status: 'PASS',
    recordedBy: 'owner',
  });
  result = await runAutomaticGateChecks({ root, stageId: '00-start' });
  assert.equal(result.gateResults['owner-intent-named'], true);
});

test('build stage executes test and build scripts instead of accepting confidence', async () => {
  const root = await makeRoot();
  await writeJson(root, 'package.json', { scripts: { test: 'node test.js', build: 'node build.js' } });
  await writeJson(root, '.vibe/evidence/04-build/slice-complete.json', { status: 'PASS' });

  const calls = [];
  const commandRunner = async (command, args) => {
    calls.push([command, ...args]);
    return { ok: true, exitCode: 0, stdout: 'ok', stderr: '' };
  };

  const result = await runAutomaticGateChecks({ root, stageId: '04-build', commandRunner });
  assert.equal(result.gateResults['slice-complete'], true);
  assert.equal(result.gateResults['tests-pass'], true);
  assert.equal(result.gateResults['build-pass'], true);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls.map((call) => call.slice(1)), [['run', 'test'], ['run', 'build']]);
});

test('review stage invokes OpenCodeReview against the exact candidate and holds missing judgment gates', async () => {
  const root = await makeRoot();
  const calls = [];
  const commandRunner = async (command, args) => {
    calls.push([command, ...args]);
    return { ok: true, exitCode: 0, stdout: 'review clean', stderr: '' };
  };

  const result = await runAutomaticGateChecks({ root, stageId: '05-review', candidate: 'abc123', commandRunner });
  assert.equal(result.gateResults['open-code-review-pass'], true);
  assert.equal(result.gateResults['material-findings-resolved'], false);
  assert.equal(result.gateResults['stop-slop-pass'], false);
  assert.equal(result.gateResults['taste-pass'], false);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].slice(1), ['review', '--commit', 'abc123']);
});

test('release authority cannot pass without human owner or judge authority', async () => {
  const root = await makeRoot();
  await writeJson(root, '.vibe/evidence/08-release/owner-ship-authority.json', { status: 'PASS', authority: 'agent' });
  await writeJson(root, '.vibe/evidence/08-release/rollback-ready.json', { status: 'PASS' });
  await writeJson(root, '.vibe/evidence/08-release/production-smoke-pass.json', { status: 'PASS' });

  let result = await runAutomaticGateChecks({ root, stageId: '08-release' });
  assert.equal(result.gateResults['owner-ship-authority'], false);

  await writeJson(root, '.vibe/evidence/08-release/owner-ship-authority.json', { status: 'PASS', authority: 'owner' });
  result = await runAutomaticGateChecks({ root, stageId: '08-release' });
  assert.equal(result.gateResults['owner-ship-authority'], true);
});
