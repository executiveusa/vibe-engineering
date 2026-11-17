import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);
const picomatch = require('picomatch');

test('patched picomatch keeps legitimate single-branch extglob matching', () => {
  for (const [pattern, accepted, rejected] of [
    ['+(*)c', ['abc', 'c'], ['ab!']],
    ['+(*a)', ['a', 'aba', 'aaa'], ['b', 'aaa!']],
    ['+(a*b)', ['ab', 'abab', 'acbab'], ['a', 'aba']],
    ['*(a*b)c', ['c', 'abc', 'ababc'], ['abb']]
  ]) {
    for (const input of accepted) assert.equal(picomatch.isMatch(input, pattern), true, pattern + ': ' + input);
    for (const input of rejected) assert.equal(picomatch.isMatch(input, pattern), false, pattern + ': ' + input);
    const expression = picomatch.makeRe(pattern).source;
    assert.equal(expression.includes(')+') || expression.includes(')*'), false, pattern);
  }
});

test('CVE-2026-112366 crafted failing input completes in isolated deadline', () => {
  const script = `const pm = require('picomatch'); for(const pattern of ['+(*)a', '+(*a)', '*(a*)b', '+(a*b)c']) pm.isMatch('a'.repeat(10000)+'!',pattern);`;
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    timeout: 2500,
    encoding: 'utf8',
  });
  assert.equal(result.error, undefined, String(result.error));
  assert.equal(result.status, 0, result.stderr);
});
