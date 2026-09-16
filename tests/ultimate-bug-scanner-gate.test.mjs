import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = path.join(root, 'factory', 'evaluations', 'ultimate-bug-scanner', 'receipt.schema.json');

test('UBS receipt is exact-candidate, complete-scan, zero-threshold and fail-closed', async () => {
  const schema = JSON.parse(await readFile(schemaPath));
  assert.ok(schema.required.includes('candidate'));
  assert.equal(schema.properties.engineRevision.const, '47edcd3a6f225b3316825175561943195ababe78');
  assert.equal(schema.properties.exitCode.const, 0);
  assert.equal(schema.properties.scanStatus.const, 'ok');
  assert.equal(schema.properties.files.minimum, 1);
  assert.equal(schema.properties.totals.properties.critical.const, 0);
  assert.equal(schema.properties.totals.properties.warning.const, 0);
  assert.equal(schema.properties.findingsResolved.const, true);
});
