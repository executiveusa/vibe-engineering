import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const rootLaw = await readFile(new URL('../AGENTS.md', import.meta.url), 'utf8');
const templateLaw = await readFile(new URL('../factory/icm/template/AGENTS.md', import.meta.url), 'utf8');

for (const [name, content] of [['root', rootLaw], ['factory template', templateLaw]]) {
  test(`${name} keeps Vibe agent-neutral and filesystem-first`, () => {
    assert.match(content, /Verify It Before Everything/i);
    assert.match(content, /filesystem/i);
    assert.match(content, /AGENTS\.md[^\n]*ICMR\.yaml[^\n]*CONTEXT\.md/i);
    assert.match(content, /agent soup/i);
    assert.match(content, /orchestrator/i);
  });
}
