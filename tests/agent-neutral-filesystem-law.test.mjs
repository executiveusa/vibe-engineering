import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rootLaw = await readFile(new URL('../AGENTS.md', import.meta.url), 'utf8');
const templateLaw = await readFile(new URL('../factory/icm/template/AGENTS.md', import.meta.url), 'utf8');
const homepage = await readFile(new URL('../src/App.jsx', import.meta.url), 'utf8');
const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');

for (const [name, content] of [['root', rootLaw], ['factory template', templateLaw]]) {
  test(`${name} keeps Vibe agent-neutral and filesystem-first`, () => {
    assert.match(content, /Verify It Before Everything/i);
    assert.match(content, /filesystem/i);
    assert.match(content, /AGENTS\.md[^\n]*ICMR\.yaml[^\n]*CONTEXT\.md/i);
    assert.match(content, /agent soup/i);
    assert.match(content, /orchestrator/i);
  });
}

test('public V.I.B.E. language always uses the complete phrase', () => {
  for (const [name, content] of [['homepage', homepage], ['README', readme]]) {
    assert.match(content, /Verify It Before Everything\./i, `${name} must contain the full V.I.B.E. phrase`);
    assert.doesNotMatch(content, /Verify before everything/i, `${name} must never shorten the V.I.B.E. phrase`);
  }
});
