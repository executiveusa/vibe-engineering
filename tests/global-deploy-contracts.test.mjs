import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'factory', 'operations', 'global-deploy', 'contracts');
const load = async (name) => JSON.parse(await readFile(path.join(dir, name), 'utf8'));

test('global deploy contracts bind release, artifacts, host, data, secrets, verification and rollback', async () => {
  const release = await load('portable-release-envelope.schema.json');
  for (const key of ['release_id','source','artifacts','targets','services','data','secrets','verification','rollback']) assert.ok(release.required.includes(key));
  const receipt = await load('deployment-receipt.schema.json');
  for (const key of ['candidate_commit','artifact_digests','target','checks','outcome','rollback']) assert.ok(receipt.required.includes(key));
});

test('host readiness is provider-neutral and covers resource, runtime and network facts', async () => {
  const host = await load('host-readiness.schema.json');
  for (const key of ['os','arch','cpu','memory_bytes','disk','container_runtime','network','privilege','clock','result']) assert.ok(host.required.includes(key));
});

test('repo sync separates plan/apply state and cost envelope is attributable', async () => {
  const sync = await load('fleet-repo-sync.schema.json');
  assert.ok(sync.required.includes('mode'));
  assert.ok(sync.required.includes('repos'));
  const cost = await load('agent-cost-envelope.schema.json');
  for (const key of ['provider','account','agent','project','usage','limits']) assert.ok(cost.required.includes(key));
});

test('ops extraction remains a bounded contract shelf', async () => {
  const files = await readdir(dir);
  assert.equal(files.filter((file) => file.endsWith('.json')).length, 5);
  assert.deepEqual(files.filter((file) => /\.(js|py|sh|ts)$/.test(file)), []);
});
