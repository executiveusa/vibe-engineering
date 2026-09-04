import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs/promises';
import { DEFAULT_GATES, getJourneyStatus, verifyJourneyStage } from '../src/journey/engine.mjs';

test('journey starts at level 1 and cannot advance with missing gates', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vibe-journey-'));
  const status = await getJourneyStatus(root);
  assert.equal(status.currentStage, '00-start');
  assert.equal(status.currentLevel, 1);
  const result = await verifyJourneyStage({ root, gateResults: {} });
  assert.equal(result.verdict, 'HOLD');
  assert.deepEqual(result.failed, DEFAULT_GATES['00-start']);
  const after = await getJourneyStatus(root);
  assert.equal(after.currentStage, '00-start');
});

test('journey writes receipt before advancing', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'vibe-journey-'));
  const gateResults = Object.fromEntries(DEFAULT_GATES['00-start'].map((gate) => [gate, true]));
  const result = await verifyJourneyStage({ root, gateResults, evidence: ['PROOF/intake.md'], approvedBy: 'owner' });
  assert.equal(result.verdict, 'ADVANCE');
  assert.equal(result.next, '01-discover');
  const receipt = JSON.parse(await fs.readFile(path.join(root, result.receipt), 'utf8'));
  assert.equal(receipt.status, 'PASS');
  assert.equal(receipt.approvedBy, 'owner');
  const after = await getJourneyStatus(root);
  assert.equal(after.currentStage, '01-discover');
  assert.equal(after.currentLevel, 2);
});
