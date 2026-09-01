import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { BUILD_SOURCE_COMMIT } from '../src/truth/source-provenance.mjs';

function firstNonEmpty(...values) {
  return values.find((value) => typeof value === 'string' ? value.trim().length > 0 : value != null);
}

const sourceCommit = firstNonEmpty(
  process.env.GITHUB_SHA,
  process.env.VIBE_SOURCE_COMMIT,
  process.env.VERCEL_GIT_COMMIT_SHA,
  BUILD_SOURCE_COMMIT === 'local' ? undefined : BUILD_SOURCE_COMMIT,
) ?? 'local';

const target = path.join(process.cwd(), 'src', 'truth', 'source-provenance.mjs');
await writeFile(target, `export const BUILD_SOURCE_COMMIT = ${JSON.stringify(sourceCommit)};\n`);
console.log(`Source provenance: ${sourceCommit}`);
