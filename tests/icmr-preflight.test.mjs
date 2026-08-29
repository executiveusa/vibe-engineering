import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { validateIcmrWorkspace } from '../scripts/icmr-validate.mjs';

const VALID_ICMR = `icmr_version: "1.0"
identity:
  name: "Example"
  purpose: "Prove Step 0"
  mode: "greenfield"
detection:
  subject_kind: "project"
  primary_form: "pipeline"
  role_topology: "role-chain"
  execution_topology: "agent-led-human-gated"
  state_topology: "artifact-state"
  confidence: 0.9
  assumptions: []
routing:
  entry: "AGENTS.md"
  workspace_contract: "CONTEXT.md"
  routes: []
roles: []
contracts: []
proof:
  required: []
sovereignty:
  owner_controls: []
rollback:
  strategy: "none"
outputs: []
`;

test('ICMR Step 0 passes for a structurally complete manifest', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'icmr-pass-'));
  try {
    await writeFile(path.join(root, 'ICMR.yaml'), VALID_ICMR, 'utf8');
    const report = await validateIcmrWorkspace(root);
    assert.equal(report.status, 'PASS', report.errors.join('; '));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ICMR Step 0 blocks a workspace with no manifest', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'icmr-missing-'));
  try {
    const report = await validateIcmrWorkspace(root);
    assert.equal(report.status, 'FAIL');
    assert.match(report.errors.join('\n'), /Missing mandatory Step 0 manifest: ICMR\.yaml/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
