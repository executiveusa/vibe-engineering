import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const upstream = 'https://github.com/INSANE0777/Awwwards-mcp';
const pin = '0560b94e646db37edcdba5249beeabf8c58ba6c7';

test('Awwwards is a lazy option in the existing W5 design workflow', () => {
  const workflow = read('skills/workflows/w5-web-design/WORKFLOW.md');
  const refs = read('skills/workflows/w5-web-design/design-references.md');
  assert.match(workflow, /design-references\.md/);
  assert.match(workflow, /Awwwards MCP/);
  assert.match(workflow, /Do not preload/);
  assert.ok(refs.includes(upstream));
  assert.ok(refs.includes(pin));
  assert.match(refs, /personal\/non-commercial/i);
  assert.match(refs, /Node ≥22\.13/);
  assert.match(refs, /not.*auto|do not.*auto/i);
});

test('Source register pins upstream and preserves external-content rights', () => {
  const provenance = read('skills/workflows/sources/SOURCES.md');
  assert.ok(provenance.includes(upstream));
  assert.ok(provenance.includes(pin));
  assert.match(provenance, /not vendored/i);
});
