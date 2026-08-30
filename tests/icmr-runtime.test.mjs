import test from 'node:test';
import assert from 'node:assert/strict';
import { detectWork, compileIcmr, validateIcmr } from '../src/icmr/runtime.mjs';

test('detectWork classifies brownfield agent orchestration without claiming proof', () => {
  const result = detectWork({
    description: 'Update an existing repository where an orchestrator routes work to builder and reviewer agents with human approval.',
    repository: 'executiveusa/example',
    roles: ['orchestrator', 'builder', 'reviewer'],
  });

  assert.equal(result.valid, true);
  assert.equal(result.mode, 'brownfield');
  assert.equal(result.roleStructure, 'orchestrator_hub');
  assert.ok(result.confidence <= 0.95);
});

test('compileIcmr emits a portable object and YAML with sovereignty and rollback gates', () => {
  const compiled = compileIcmr({
    title: 'Client Intake System',
    description: 'A workflow moves client records through intake, review, and approval.',
    roles: ['intake agent', 'reviewer'],
    rollbackPoint: 'git tag pre-intake-v1',
  });

  assert.equal(compiled.valid, true);
  assert.equal(compiled.icmr.icmr_version, '1.0');
  assert.equal(compiled.icmr.contracts.builder_self_approval, false);
  assert.equal(compiled.icmr.rollback.required, true);
  assert.match(compiled.yaml, /routing:\n  entry: "AGENTS.md"/);
  assert.equal(validateIcmr({ icmr: compiled.icmr }).valid, true);
  assert.equal(validateIcmr({ icmr: compiled.yaml }).valid, true);
});

test('validateIcmr rejects authority and rollback violations', () => {
  const compiled = compileIcmr({ description: 'Create a new research knowledge library.' });
  const unsafe = structuredClone(compiled.icmr);
  unsafe.contracts.builder_self_approval = true;
  unsafe.rollback.required = false;

  const result = validateIcmr({ icmr: unsafe });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes('builder_self_approval')));
  assert.ok(result.errors.some((error) => error.includes('rollback.required')));
});
