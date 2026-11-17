import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const picomatch = require('picomatch');

test('patched picomatch keeps legitimate single-branch extglob matching', () => {
  for (const [pattern, accepted, rejected] of [
    ['+(*)c', ['abc', 'c'], ['ab!']],
    ['+(*a)', ['a', 'aba', 'aaa'], ['b', 'aaa!']],
    ['+(a*)', ['a', 'aba'], ['b']],
    ['+(a*b)', ['ab', 'abab', 'acbab'], ['a', 'aba']],
    ['+(a*b*c)', ['abc', 'abcabc', 'axbyc'], ['ab', 'abc!']],
    ['*(a*b)c', ['c', 'abc', 'ababc'], ['abb']],
    ['x+(*a)y', ['xay', 'xabaay'], ['xby']],
  ]) {
    for (const input of accepted)
      assert.equal(picomatch.isMatch(input, pattern), true, pattern + ': ' + input);
    for (const input of rejected)
      assert.equal(picomatch.isMatch(input, pattern), false, pattern + ': ' + input);
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

test('captures, escapes, alternatives and explicit safety opt-out preserve expected semantics', () => {
  assert.equal(picomatch.isMatch('*a*a', '+(\\\\*a)'), true);
  assert.equal(picomatch.isMatch('foobar', '+(foo|bar)'), true);
  assert.deepEqual(picomatch.makeRe('+(*a)', { capture: true }).exec('aba').slice(1), ['aba', 'ab']);
  assert.match(picomatch.makeRe('+(*a)', { maxExtglobRecursion: false }).source, /\\)\\+/);
});

test('patched picomatch is the sole lockfile resolution, not a hidden vulnerable duplicate', () => {
  const lock = JSON.parse(readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  const root = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const local = JSON.parse(readFileSync(new URL('../vendor/picomatch/package.json', import.meta.url), 'utf8'));
  assert.equal(root.dependencies.picomatch, 'file:./vendor/picomatch');
  assert.equal(lock.packages['node_modules/picomatch'].resolved, 'vendor/picomatch');
  assert.equal(lock.packages['node_modules/picomatch'].link, true);
  assert.equal(lock.packages['vendor/picomatch'].version, '4.0.8');
  assert.equal(local.version, '4.0.8');
  assert.equal(local.private, true);
  assert.equal(local.license, 'MIT');
  assert.equal(Object.keys(lock.packages).filter((name) => name.endsWith('/node_modules/picomatch')).length, 0);
});
