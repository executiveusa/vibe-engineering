import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateExitBar, MIN_UDEC } from '../factory/exit-bar.mjs';
import { deployPreview, predeployReasons } from '../factory/deploy-preview.mjs';
import { pickIntakes, MAX_PER_DAY } from '../scripts/select-starnet-intake.mjs';
import { settleBody } from '../scripts/report-starnet-intake.mjs';
import { laneModels } from '../factory/lane-models.mjs';
import { readFileSync } from 'node:fs';

const SHA = 'a'.repeat(40);
const OTHER = 'b'.repeat(40);
const checks = Object.fromEntries(
  [
    'specification',
    'build',
    'tests',
    'security',
    'user_journey',
    'deployment_config',
    'ownership',
    'rollback',
    'evidence',
    'prompt_injection',
  ].map((k) => [k, 'PASS']),
);
const judgeReceipt = (over = {}) => ({
  decision: 'SHIP',
  score: 90,
  consequence_level: 'LOW',
  p0_remaining: 0,
  p1_remaining: 0,
  checks: { ...checks, motion_audit: 'PASS', system_impact: 'N/A' },
  commit: SHA,
  exit_bar: { backend_features: 'PASS', udec_score: 8.7, extractor_slop_findings: 0 },
  ...over,
});
const run = (over = {}) => ({
  commit: SHA,
  auditor_model: 'openrouter/deepseek/deepseek-v4.1-flash',
  findings: [{ severity: 'LOW' }],
  ...over,
});
const voices = {
  builderModel: 'openrouter/qwen/qwen3.8-27b:free',
  judgeModel: 'openrouter/google/gemma-4-31b-it:free',
};
const deployReceipt = (over = {}) => ({
  commit: SHA,
  served_build_sha: SHA,
  live_tests: 'PASS',
  visibility: 'private',
  ...over,
});
const all = (over = {}) => ({
  commit: SHA,
  ...voices,
  judgeReceipt: judgeReceipt(),
  securityRuns: [run(), run()],
  deployReceipt: deployReceipt(),
  ...over,
});

test('exit bar: everything for one commit is SHIP', () => {
  assert.deepEqual(evaluateExitBar(all()), { decision: 'SHIP', reasons: [] });
});

test('exit bar: each clause holds the product', () => {
  const hold = (over, re) => {
    const v = evaluateExitBar(all(over));
    assert.equal(v.decision, 'HOLD');
    assert.ok(
      v.reasons.some((r) => re.test(r)),
      `expected ${re} in ${JSON.stringify(v.reasons)}`,
    );
  };
  hold({ commit: 'abc' }, /full 40-character sha/);
  hold({ judgeReceipt: judgeReceipt({ decision: 'HOLD' }) }, /judge: Judge decision/);
  hold({ judgeReceipt: judgeReceipt({ commit: OTHER }) }, /judge: receipt is for b+/);
  hold(
    {
      judgeReceipt: judgeReceipt({
        exit_bar: { backend_features: 'FAIL', udec_score: 9, extractor_slop_findings: 0 },
      }),
    },
    /backend_features is FAIL/,
  );
  hold(
    {
      judgeReceipt: judgeReceipt({
        exit_bar: {
          backend_features: 'PASS',
          udec_score: MIN_UDEC - 0.1,
          extractor_slop_findings: 0,
        },
      }),
    },
    /udec_score/,
  );
  hold(
    {
      judgeReceipt: judgeReceipt({
        exit_bar: { backend_features: 'PASS', udec_score: 9, extractor_slop_findings: 2 },
      }),
    },
    /extractor_slop/,
  );
  hold({ securityRuns: [run()] }, /two attack runs/);
  hold(
    { securityRuns: [run(), run({ findings: [{ severity: 'HIGH' }] })] },
    /HIGH\/CRITICAL.*never waivable/,
  );
  hold(
    { securityRuns: [run(), run({ findings: [{ severity: 'MEDIUM' }] })] },
    /MEDIUM.*neither fixed nor captain-accepted/,
  );
  hold({ securityRuns: [run(), run({ commit: OTHER })] }, /security run 2: is for b+/);
  hold({ judgeModel: voices.builderModel }, /Judge family .* equals the builder/);
  hold(
    { securityRuns: [run(), run({ auditor_model: 'openrouter/google/gemma-x' })] },
    /auditor family google equals/,
  );
  hold({ deployReceipt: null }, /deploy step has not run/);
  hold({ deployReceipt: deployReceipt({ served_build_sha: OTHER }) }, /serves BUILD_SHA b+/);
  hold({ deployReceipt: deployReceipt({ visibility: 'public' }) }, /must be private/);
  hold({ deployReceipt: deployReceipt({ live_tests: 'FAIL' }) }, /live tests are FAIL/);
});

test('exit bar: a captain-accepted or fixed MEDIUM does not hold', () => {
  const v = evaluateExitBar(
    all({
      securityRuns: [
        run({ findings: [{ severity: 'MEDIUM', fixed: true }] }),
        run({ findings: [{ severity: 'MEDIUM', accepted_by: 'captain' }] }),
      ],
    }),
  );
  assert.equal(v.decision, 'SHIP');
});

// A fake Coolify + preview: records every request so the test can prove what the deploy step sent.
function fakeServers({
  servedSha = SHA,
  anonStatus = 401,
  liveStatus = 200,
  finalStatus = 'finished',
  pinStatus = 200,
} = {}) {
  const calls = [];
  const res = (status, body) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  });
  let polls = 0;
  const fetchImpl = async (url, opts = {}) => {
    calls.push({
      url,
      method: opts.method || 'GET',
      headers: opts.headers || {},
      body: opts.body ? JSON.parse(opts.body) : null,
    });
    if (url.startsWith('https://coolify.test/api/v1/applications/')) return res(pinStatus, {});
    if (url === 'https://coolify.test/api/v1/deploy')
      return res(200, { deployments: [{ deployment_uuid: 'dep-1', resource_uuid: 'app-1' }] });
    if (url === 'https://coolify.test/api/v1/deployments/dep-1')
      return res(200, { status: ++polls < 2 ? 'in_progress' : finalStatus });
    if (url === 'https://preview.test/.well-known/build-sha') return res(200, servedSha + '\n');
    if (url === 'https://preview.test/' && !(opts.headers && opts.headers.authorization))
      return res(anonStatus, '');
    if (url.startsWith('https://preview.test/')) return res(liveStatus, 'ok');
    return res(404, {});
  };
  return { calls, fetchImpl };
}
const deployArgs = (fetchImpl, over = {}) => ({
  commit: SHA,
  ...voices,
  judgeReceipt: judgeReceipt(),
  securityRuns: [run(), run()],
  coolifyUrl: 'https://coolify.test',
  appUuid: 'app-1',
  token: 'deploy-only-token',
  previewUrl: 'https://preview.test',
  previewAccess: 'viewer:pw',
  livePaths: ['/', '/api/health'],
  fetchImpl,
  sleep: async () => {},
  ...over,
});

test('deploy step: refuses before touching Coolify unless the commit passed the judge and security', async () => {
  const f = fakeServers();
  const out = await deployPreview(deployArgs(f.fetchImpl, { securityRuns: [run()] }));
  assert.equal(out.ok, false);
  assert.equal(out.stage, 'gate');
  assert.equal(f.calls.length, 0, 'no request was made with the deploy credential');
  assert.ok(
    predeployReasons({
      commit: SHA,
      ...voices,
      judgeReceipt: judgeReceipt({ decision: 'HOLD' }),
      securityRuns: [run(), run()],
    }).length > 0,
  );
});

test('deploy step: pins the commit, deploys, and proves BUILD_SHA on a private preview', async () => {
  const f = fakeServers();
  const out = await deployPreview(deployArgs(f.fetchImpl));
  assert.equal(out.ok, true, JSON.stringify(out));
  assert.deepEqual(
    f.calls[0].body,
    { git_commit_sha: SHA },
    'the preview app is pinned to the judged commit',
  );
  assert.equal(f.calls[0].method, 'PATCH');
  assert.deepEqual(f.calls[1].body, { uuid: 'app-1', force: false });
  assert.ok(
    f.calls
      .filter((c) => c.url.startsWith('https://coolify.test'))
      .every((c) => c.headers.authorization === 'Bearer deploy-only-token'),
    'the deploy credential goes only to Coolify',
  );
  assert.ok(
    f.calls
      .filter((c) => c.url.startsWith('https://preview.test'))
      .every((c) => !String(c.headers.authorization || '').includes('deploy-only-token')),
    'the deploy credential never reaches the preview',
  );
  assert.equal(out.receipt.served_build_sha, SHA);
  assert.equal(out.receipt.visibility, 'private');
  assert.equal(out.receipt.live_tests, 'PASS');
  assert.ok(
    !JSON.stringify(out.receipt).includes('deploy-only-token') &&
      !JSON.stringify(out.receipt).includes('preview.test'),
    'the receipt holds no token and no host',
  );
  assert.equal(
    evaluateExitBar(all({ deployReceipt: out.receipt })).decision,
    'SHIP',
    'the receipt it writes completes the exit bar',
  );
});

test('deploy step: each failure is a HOLD with a reason', async () => {
  const cases = [
    [{ servedSha: OTHER }, 'build-sha'],
    [{ anonStatus: 200 }, 'privacy'],
    [{ liveStatus: 500 }, 'live-tests'],
    [{ finalStatus: 'failed' }, 'wait'],
    [{ pinStatus: 422 }, 'pin'],
  ];
  for (const [opts, stage] of cases) {
    const out = await deployPreview(deployArgs(fakeServers(opts).fetchImpl));
    assert.equal(out.ok, false, stage);
    assert.equal(out.stage, stage);
  }
  const noToken = await deployPreview(deployArgs(fakeServers().fetchImpl, { token: '' }));
  assert.equal(noToken.stage, 'config');
});

test('starnet intake: only queued, approved, well-formed repos, at most five', () => {
  const rows = [
    { id: 'i1', repo: 'executiveusa/a', branch: 'main', status: 'queued' },
    { id: 'i2', repo: 'executiveusa/b', branch: 'main', status: 'done' },
    {
      id: 'i3',
      repo: 'executiveusa/c',
      branch: 'main',
      status: 'queued',
      needs_morning_approval: true,
    },
    {
      id: 'i4',
      repo: 'executiveusa/d',
      branch: 'main',
      status: 'queued',
      needs_morning_approval: true,
      morning_approved: true,
    },
    { id: 'i5', repo: 'not a repo', branch: 'main', status: 'queued' },
    { id: 'i6', repo: 'executiveusa/e', branch: '../x', status: 'queued' },
    ...Array.from({ length: 6 }, (_, n) => ({
      id: 'x' + n,
      repo: 'executiveusa/x' + n,
      branch: 'main',
      status: 'queued',
    })),
  ];
  const { picked, skipped } = pickIntakes({ intakes: rows });
  assert.equal(picked.length, MAX_PER_DAY);
  assert.deepEqual(
    picked.slice(0, 2).map((p) => p.intake_id),
    ['i1', 'i4'],
  );
  const why = Object.fromEntries(skipped.map((s) => [s.intake_id, s.why]));
  assert.match(why.i2, /status done/);
  assert.match(why.i3, /waits for the captain/);
  assert.equal(why.i5, 'bad repo');
  assert.equal(why.i6, 'bad branch');
  assert.ok(skipped.some((s) => s.why === 'over the daily cap'));
});

test('starnet report: done carries both receipts, anything else is failed', () => {
  assert.deepEqual(
    settleBody({
      intakeId: 'i1',
      commit: SHA,
      decision: 'SHIP',
      securityReceipt: `evidence/${SHA}/07-security-run-2.json`,
    }),
    {
      intake_id: 'i1',
      status: 'done',
      evidence: {
        judge_receipt: `evidence/${SHA}/06-judge.json`,
        security_receipt: `evidence/${SHA}/07-security-run-2.json`,
      },
    },
  );
  assert.deepEqual(settleBody({ intakeId: 'i1', commit: SHA, decision: 'HOLD' }), {
    intake_id: 'i1',
    status: 'failed',
    evidence: {},
  });
});

test('lane models: the deploy step resolves the same models the runner launches', () => {
  const runner = readFileSync(
    new URL('../factory/run-readiness-sandcastle.mts', import.meta.url),
    'utf8',
  );
  for (const lane of ['paid', 'free']) {
    const m = laneModels({ VIBE_MODEL_LANE: lane });
    assert.ok(
      runner.includes(JSON.stringify(m.builderModel)),
      `runner builder default for ${lane} is ${m.builderModel}`,
    );
    assert.ok(
      runner.includes(JSON.stringify(m.judgeModel)),
      `runner judge default for ${lane} is ${m.judgeModel}`,
    );
  }
  assert.deepEqual(
    laneModels({ VIBE_MODEL_LANE: 'free', VIBE_BUILDER_MODEL: 'x/y', VIBE_JUDGE_MODEL: 'z/w' })
      .builderModel,
    'x/y',
  );
  assert.equal(
    laneModels({ VIBE_MODEL_LANE: 'dry' }).builderModel,
    null,
    'the dry lane names no builder, so the exit bar holds',
  );
  assert.equal(
    laneModels({}).judgeModel,
    null,
    'no lane = no models = HOLD (no default lane, like the runner)',
  );
});
