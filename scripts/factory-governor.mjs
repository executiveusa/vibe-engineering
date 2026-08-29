#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspectWorkspace } from './factory-doctor.mjs';
import { validateIcmrWorkspace } from './icmr-validate.mjs';

async function main() {
  const root = process.argv[2];
  if (!root) throw new Error('Usage: npm run factory:doctor -- <workspace-path>');

  const icmr = await validateIcmrWorkspace(root);
  if (icmr.status !== 'PASS') {
    console.error('ICMR Step 0: FAIL');
    for (const error of icmr.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  const report = await inspectWorkspace(root);
  if (report.status !== 'PASS') {
    console.error('Factory Doctor: FAIL');
    for (const error of report.errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }

  console.log('ICMR Step 0: PASS');
  console.log('Factory Doctor: PASS');
  if (report.warnings?.length) {
    for (const warning of report.warnings) console.warn(`- ${warning}`);
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(`Factory governance check failed: ${error.message}`);
    process.exitCode = 1;
  });
}
