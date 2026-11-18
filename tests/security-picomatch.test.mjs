import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import picomatch from '../vendor/picomatch/index.js';

test('CVE-2026-112366: repeated wildcard extglobs do not produce nested unbounded quantifiers', () => {
  for (const [pattern, yes, no] of [
    ['+(*)c', ['abc', 'c'], ['ab!']],
    ['+(*a)', ['a', 'aba', 'aaa'], ['b', 'aaa!']],
    ['+(a*)', ['a', 'aba'], ['b']],
    ['+(a*b)', ['ab', 'abab', 'acbab'], ['a', 'aba']],
    ['+(a*b*c)', ['abc', 'abcabc', 'axbyc'], ['ab', 'abc!']],
    ['*(a*b)c', ['c', 'abc', 'ababc'], ['abb']],
    ['x+(*a)y', ['xay', 'xabaay'], ['xby']]
  ]) {
    for (const input of yes) assert.equal(picomatch.isMatch(input,pattern),true,pattern + ': ' + input);
    for (const input of no) assert.equal(picomatch.isMatch(input,pattern),false,pattern + ': ' + input);
    assert.doesNotMatch(picomatch.makeRe(pattern).source,/\)[+*]/,pattern);
  }
});

test('CVE-2026-112366: hostile non-matches complete inside 2 second isolated deadline', () => {
  const script = "const p=require('./vendor/picomatch');for(const pattern of ['+(*)a','+(*a)','*(a*)b','+(a*b)c']) p.isMatch('a'.repeat(10000)+'!',pattern)";
  const result=spawnSync(process.execPath,['-e',script],{timeout:2000,encoding:'utf8'});
  assert.equal(result.error,undefined,String(result.error));
  assert.equal(result.status,0,result.stderr);
});

test('preserve safe alternation, escapes, captures and bracket matching', () => {
  assert.equal(picomatch.isMatch('*a*a','+(\\*a)'),true);
  assert.equal(picomatch.isMatch('foobar','+(foo|bar)'),true);
  assert.deepEqual(picomatch.makeRe('+(*a)',{capture:true}).exec('aba').slice(1),['aba','ab']);
  assert.equal(picomatch.isMatch('aba', '+(a[bc]*)'), true);
  assert.equal(picomatch.isMatch('a+a+', '+(a\\+)', { regex: true }), true);
  assert.equal(picomatch.isMatch('a+a+', '+(a[+])', { regex: true }), true);
});

test('CVE-2026-112366: explicitly reject unsupported ReDoS-prone repeated branches', () => {
  for (const [pattern, options] of [
    ['+([ab/]*)c', {}],
    ['+([ab/]*)', {}],
    ['+(a*)b', { regex: true }],
    ['+(a[bc]*)', { regex: true }],
    ['+(a+)', { regex: true }],
    ['+(*a|b)c', {}],
    ['*(a*)b', { regex: true }],
    ['+(*a)', { maxExtglobRecursion: false }],
    ['+(a|aa)b', { maxExtglobRecursion: false }],
    ['+((a+))b', {}],
    ['+(ab|abab)c', {}],
    ['+(ab|abab)c', { maxExtglobRecursion: false }],
  ]) {
    assert.throws(() => picomatch.isMatch('aba', pattern, options),
      /Unsafe repeated extglob/, pattern);
  }
});

test('CVE-2026-112366: previously excluded nested-quantifier attacks have bounded subprocess runtime', () => {
  const script = String.raw`const assert=require('node:assert/strict');
  const p=require('./vendor/picomatch');
  for(const [pattern, opts] of [
    ['+([ab/]*)c',{}], ['+(a*)b',{regex:true}],
    ['+([ab/]*)',{}], ['+(a[bc]*)',{regex:true}],
    ['+(*a|b)c',{}], ['+(a+)',{regex:true}],
    ['+(*a)',{maxExtglobRecursion:false}], ['+(a|aa)b',{maxExtglobRecursion:false}], ['+((a+))b',{}], ['+(ab|abab)c',{}]
  ]) assert.throws(()=>p.isMatch('a'.repeat(10000)+'!',pattern,opts),/Unsafe repeated extglob/);`;
  const result = spawnSync(process.execPath, ['-e', script],
    { timeout: 2000, encoding: 'utf8' });
  assert.equal(result.error, undefined, String(result.error));
  assert.equal(result.status, 0, result.stderr);
});
