// The factory's separate deploy step (pauli-starnet PRD section 8, "safe VPS access").
// It runs in its own job, AFTER the build/judge job, with no model keys and no GitHub token. It is the only code that
// ever sees the deploy-only credential (VIBE_PREVIEW_DEPLOY_TOKEN, a Coolify API token scoped to the preview area).
// No agent runs here and no agent ever holds that credential.
//
// Order, each step fail-closed:
//   1. refuse unless the Judge receipt and both security runs pass the exit bar for this exact commit;
//   2. pin the Coolify preview application to the commit and deploy it;
//   3. wait for the deployment to finish;
//   4. read BUILD_SHA from the preview and require it to equal the judged commit;
//   5. require the preview to be private (an anonymous request is refused) and run the live tests;
//   6. write the deploy receipt (never the token, never the preview host).
// Usage: node factory/deploy-preview.mjs  (inputs from the environment, see readEnv below)

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { evaluateExitBar } from './exit-bar.mjs';
import { laneModels } from './lane-models.mjs';

const DONE = new Set(['finished']);
const FAILED = new Set(['failed', 'cancelled-by-user', 'cancelled']);

export function deployReceiptPath(commit) {
  return path.join('docs', 'evidence', commit, '08-deploy.json');
}

// Everything the exit bar needs before a deploy: the bar minus its deploy clauses.
export function predeployReasons(inputs) {
  return evaluateExitBar({ ...inputs, deployReceipt: null }).reasons.filter(
    (r) => !r.startsWith('deploy:'),
  );
}

export async function deployPreview({
  commit,
  builderModel,
  judgeModel,
  judgeReceipt,
  securityRuns,
  coolifyUrl,
  appUuid,
  token,
  previewUrl,
  previewAccess,
  livePaths = ['/'],
  buildShaPath = '/.well-known/build-sha',
  fetchImpl = globalThis.fetch,
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
  pollMs = 5000,
  maxPolls = 120,
}) {
  const fail = (stage, reason, extra = {}) => ({
    ok: false,
    stage,
    reason,
    receipt: { commit, ...extra, live_tests: 'FAIL', reason },
  });
  const pre = predeployReasons({ commit, builderModel, judgeModel, judgeReceipt, securityRuns });
  if (pre.length)
    return { ok: false, stage: 'gate', reason: 'not deploy-eligible', reasons: pre, receipt: null };
  for (const [k, v] of Object.entries({ coolifyUrl, appUuid, token, previewUrl })) {
    if (!v) return { ok: false, stage: 'config', reason: k + ' is not set', receipt: null };
  }

  const api = (method, p, body) =>
    fetchImpl(coolifyUrl.replace(/\/+$/, '') + '/api/v1' + p, {
      method,
      headers: {
        authorization: 'Bearer ' + token,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  // 2. pin + deploy
  const pin = await api('PATCH', '/applications/' + encodeURIComponent(appUuid), {
    git_commit_sha: commit,
  });
  if (!pin.ok)
    return fail(
      'pin',
      'pinning the preview app to the commit was refused (HTTP ' + pin.status + ')',
    );
  const dep = await api('POST', '/deploy', { uuid: appUuid, force: false });
  if (!dep.ok) return fail('deploy', 'the deploy request was refused (HTTP ' + dep.status + ')');
  const depBody = await dep.json().catch(() => ({}));
  const deploymentUuid =
    depBody &&
    Array.isArray(depBody.deployments) &&
    depBody.deployments[0] &&
    depBody.deployments[0].deployment_uuid;
  if (!deploymentUuid) return fail('deploy', 'Coolify returned no deployment_uuid');

  // 3. wait
  let status = 'queued';
  for (let i = 0; i < maxPolls; i++) {
    const r = await api('GET', '/deployments/' + encodeURIComponent(deploymentUuid));
    if (r.ok) status = String(((await r.json().catch(() => ({}))) || {}).status || status);
    if (DONE.has(status) || FAILED.has(status)) break;
    await sleep(pollMs);
  }
  if (!DONE.has(status))
    return fail('wait', 'deployment ended ' + status, { coolify_deployment_uuid: deploymentUuid });

  // 4-5. read the preview: BUILD_SHA, privacy, live tests
  const base = previewUrl.replace(/\/+$/, '');
  const authed = previewAccess
    ? { authorization: 'Basic ' + Buffer.from(previewAccess).toString('base64') }
    : {};
  const shaRes = await fetchImpl(base + buildShaPath, { headers: authed });
  const served = shaRes.ok ? (await shaRes.text()).trim() : null;
  const anon = await fetchImpl(base + '/', { redirect: 'manual' });
  const visibility = [401, 403].includes(anon.status) ? 'private' : 'public';
  const checks = [];
  for (const p of livePaths) {
    const r = await fetchImpl(base + p, { headers: authed, redirect: 'manual' });
    checks.push({ path: p, status: r.status, ok: r.status >= 200 && r.status < 400 });
  }
  const receipt = {
    commit,
    coolify_deployment_uuid: deploymentUuid,
    deployment_status: status,
    served_build_sha: served,
    visibility,
    live_tests: checks.length && checks.every((c) => c.ok) ? 'PASS' : 'FAIL',
    checks,
    deployed_at: new Date().toISOString(),
  };
  if (served !== commit)
    return {
      ok: false,
      stage: 'build-sha',
      reason: 'the preview serves ' + (served || 'no BUILD_SHA') + ', not the judged commit',
      receipt,
    };
  if (visibility !== 'private')
    return {
      ok: false,
      stage: 'privacy',
      reason: 'the preview answers anonymous requests; it must be private',
      receipt,
    };
  if (receipt.live_tests !== 'PASS')
    return { ok: false, stage: 'live-tests', reason: 'a live test failed', receipt };
  return { ok: true, stage: 'done', receipt };
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

// CLI: every input from the environment; receipts are read from the target checkout (cwd).
async function main() {
  const env = process.env;
  const commit = env.JUDGED_COMMIT;
  const securityRuns = String(env.SECURITY_RUN_FILES || '')
    .split(',')
    .filter(Boolean)
    .map(readJson);
  const models = laneModels(env); // the repository's lane settings, the same resolution the runner used
  const out = await deployPreview({
    commit,
    builderModel: models.builderModel,
    judgeModel: models.judgeModel,
    judgeReceipt: readJson(
      env.JUDGE_RECEIPT_FILE || 'docs/evidence/production-readiness-judge.json',
    ),
    securityRuns,
    coolifyUrl: env.VIBE_PREVIEW_COOLIFY_URL,
    appUuid: env.VIBE_PREVIEW_APP_UUID,
    token: env.VIBE_PREVIEW_DEPLOY_TOKEN,
    previewUrl: env.VIBE_PREVIEW_URL,
    previewAccess: env.VIBE_PREVIEW_ACCESS,
    livePaths: String(env.VIBE_PREVIEW_LIVE_PATHS || '/')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  });
  if (out.receipt) {
    const file = deployReceiptPath(commit);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(out.receipt, null, 2) + '\n');
    console.log('deploy receipt: ' + file);
  }
  console.log(
    JSON.stringify({
      ok: out.ok,
      stage: out.stage,
      reason: out.reason || null,
      reasons: out.reasons || [],
    }),
  );
  if (env.GITHUB_OUTPUT)
    fs.appendFileSync(env.GITHUB_OUTPUT, 'deployed=' + (out.ok ? 'true' : 'false') + '\n');
  process.exit(out.ok ? 0 : 1);
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href)
  main().catch((e) => {
    console.error('deploy step failed: ' + e.message);
    process.exit(1);
  });
