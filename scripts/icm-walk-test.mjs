#!/usr/bin/env node
import process from 'node:process';
import { runIcmWalk } from '../icm/backend/walk.mjs';

const result = await runIcmWalk();
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exitCode = 1;
