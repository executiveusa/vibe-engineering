#!/usr/bin/env node
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const REQUIRED_PATTERNS = [
  ['icmr_version', /^icmr_version:\s*["']?1\.0["']?\s*$/m],
  ['identity', /^identity:\s*$/m],
  ['detection', /^detection:\s*$/m],
  ['routing', /^routing:\s*$/m],
  ['roles', /^roles:\s*/m],
  ['contracts', /^contracts:\s*/m],
  ['proof', /^proof:\s*$/m],
  ['sovereignty', /^sovereignty:\s*$/m],
  ['rollback', /^rollback:\s*$/m],
  ['outputs', /^outputs:\s*/m],
];

async function isFile(filePath) {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

export async function validateIcmrWorkspace(rootPath) {
  const root = path.resolve(rootPath);
  const manifestPath = path.join(root, 'ICMR.yaml');
  const errors = [];

  if (!(await isFile(manifestPath))) {
    return { status: 'FAIL', errors: ['Missing mandatory Step 0 manifest: ICMR.yaml'], manifestPath };
  }

  const content = await readFile(manifestPath, 'utf8');
  if (!content.trim()) errors.push('ICMR.yaml is empty');

  for (const [label, pattern] of REQUIRED_PATTERNS) {
    if (!pattern.test(content)) errors.push(`ICMR.yaml missing required section: ${label}`);
  }

  if (!/^\s+entry:\s*["']?AGENTS\.md["']?\s*$/m.test(content)) {
    errors.push('ICMR.yaml routing.entry must point to AGENTS.md');
  }
  if (!/^\s+workspace_contract:\s*["']?CONTEXT\.md["']?\s*$/m.test(content)) {
    errors.push('ICMR.yaml routing.workspace_contract must point to CONTEXT.md');
  }

  return { status: errors.length ? 'FAIL' : 'PASS', errors, manifestPath };
}

async function main() {
  const root = process.argv[2];
  if (!root) throw new Error('Usage: node scripts/icmr-validate.mjs <workspace-path>');
  const report = await validateIcmrWorkspace(root);
  if (report.status !== 'PASS') {
    console.error('ICMR Step 0: FAIL');
    for (const error of report.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  console.log('ICMR Step 0: PASS');
}

if (process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  main().catch((error) => {
    console.error(`ICMR validation failed: ${error.message}`);
    process.exitCode = 1;
  });
}
