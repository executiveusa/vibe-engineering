// Factory target source "starnet" (pauli-starnet program/starnet-v2/06): the day's repos come from the StarNet
// gateway's intake queue, which Instinct fills by voice after the captain's grill (max 5 a day, enforced there).
// Selection rules, fail-closed:
//   - only rows still "queued" (building/done/failed rows are never re-run);
//   - a row that relies on an ASSUMED grill answer parks for the captain's morning approval: it is skipped here
//     unless the gateway marks it approved (row.morning_approved === true);
//   - at most 5, and the repo/branch must be plain coordinates.
// Output matches select-nightly-vercel-batch.mjs: matrix={include:[{project,repository,branch,intake_id,...}]}.
// Env: STARNET_GATEWAY_URL, STARNET_GATEWAY_TOKEN (the gateway bearer; the value is never printed).

import fs from 'node:fs';

export const MAX_PER_DAY = 5;
const REPO = /^[A-Za-z0-9_.-]{1,39}\/[A-Za-z0-9_.-]{1,100}$/;
const BRANCH = /^[A-Za-z0-9_./-]{1,120}$/;

export function pickIntakes(list) {
  const rows = list && Array.isArray(list.intakes) ? list.intakes : [];
  const picked = [],
    skipped = [];
  for (const r of rows) {
    if (!r || typeof r !== 'object') continue;
    const why =
      r.status !== 'queued'
        ? 'status ' + r.status
        : !REPO.test(String(r.repo || ''))
          ? 'bad repo'
          : !BRANCH.test(String(r.branch || '')) || String(r.branch).includes('..')
            ? 'bad branch'
            : r.needs_morning_approval && r.morning_approved !== true
              ? 'waits for the captain (assumed grill answers)'
              : picked.length >= MAX_PER_DAY
                ? 'over the daily cap'
                : null;
    if (why) {
      skipped.push({ intake_id: r.id || null, repo: r.repo || null, why });
      continue;
    }
    picked.push({
      project: r.id,
      intake_id: r.id,
      repository: r.repo,
      branch: r.branch,
      state: 'STARNET_INTAKE',
      priority: 0,
    });
  }
  return { picked, skipped };
}

async function main() {
  const out = process.env.GITHUB_OUTPUT ?? 'starnet-batch.out';
  const emit = (include) =>
    fs.appendFileSync(
      out,
      `matrix=${JSON.stringify({ include })}\nhas_targets=${include.length > 0}\n`,
    );
  const base = String(process.env.STARNET_GATEWAY_URL || '').replace(/\/+$/, '');
  const token = process.env.STARNET_GATEWAY_TOKEN || '';
  if (!base || !token) {
    emit([]);
    console.log(
      JSON.stringify({
        has_targets: false,
        reason: 'STARNET_GATEWAY_URL / STARNET_GATEWAY_TOKEN not configured',
      }),
    );
    return;
  }
  const res = await fetch(base + '/v1/factory/intake', {
    headers: { authorization: 'Bearer ' + token },
  });
  if (!res.ok) throw new Error('gateway intake list refused: HTTP ' + res.status);
  const { picked, skipped } = pickIntakes(await res.json());
  emit(picked);
  console.log(JSON.stringify({ source: 'starnet-intake', selected: picked, skipped }, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `StarNet intake: ${picked.length} selected, ${skipped.length} skipped\n`,
    );
  }
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main().catch((e) => {
    console.error(e.message);
    process.exit(1);
  });
}
