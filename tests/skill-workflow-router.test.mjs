import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { getWorkflow, listWorkflows, listSkillSources, routeWorkflow, dispatchIndependentReview, runCompletionReview } from '../src/workflows/skill-router.mjs';
import handler from '../api/v1/workflow-router.mjs';

test('nine existing workflows are indexed without loading procedure text', () => {
  const items = listWorkflows();
  assert.equal(items.length, 9);
  assert.equal(new Set(items.map((item) => item.id)).size, 9);
  assert.ok(items.every((item) => !('steps' in item)));
  for (const item of items) {
    assert.ok(existsSync(item.entry), item.entry);
    assert.ok(getWorkflow(item.id).steps.every((step) => existsSync(step.source)), item.id);
  }
});

test('source registry retains optional and quarantined upstream references', () => {
  const sources = listSkillSources();
  assert.equal(sources.length, 43);
  const local = sources.filter((source) => source.kind === 'in-repository');
  assert.equal(local.length, 21);
  for (const item of local) assert.ok(existsSync(item.path), item.path);
  assert.equal(new Set(sources.map((source) => source.id)).size, sources.length);
  assert.equal(sources.find((source) => source.id === 'impeccable').status, 'quarantined');
  assert.equal(sources.find((source) => source.id === 'design-ui-ux').status, 'unavailable');
  assert.ok(sources.some((source) => source.id === 'lauren-verify'));
});

test('stage selection defaults to canonical ICM mapping, including physical folder names', () => {
  assert.equal(routeWorkflow({}).workflow.id, 'w1-intake-to-spec');
  assert.equal(routeWorkflow({ icmStage: '04_verify' }).workflow.id, 'w3-proof-and-review');
  assert.equal(routeWorkflow({ icmStage: 'SHIP' }).workflow.id, 'w4-ship-and-operate');
});

test('job evidence overrides generic stage match when a specialist task is named', () => {
  assert.equal(routeWorkflow({ request: 'Design a mobile homepage', icmStage: 'BUILD' }).workflow.id, 'w5-web-design');
  assert.equal(routeWorkflow({ request: 'Audit checkout usability and user journey', icmStage: 'PROOF' }).workflow.id, 'w3-proof-and-review');
  assert.equal(routeWorkflow({ request: 'Rewrite marketing copy' }).workflow.id, 'w6-copy-and-voice');
  assert.equal(routeWorkflow({ request: 'Create PDF report' }).workflow.id, 'w9-decks-docs');
});

test('routing returns a bounded plan, never all skill bodies or external execution', () => {
  const packet = routeWorkflow({ workflowId: 'w5-web-design', request: 'impeccable design', builderModel: 'Codex' });
  assert.ok(packet.steps.length <= 6);
  assert.ok(packet.specialists.length <= 3);
  assert.ok(packet.specialists.find((source) => source.id === 'impeccable')?.activation === 'blocked');
  assert.deepEqual(packet.readOrder.slice(0, 3), ['AGENTS.md', 'ICMR.yaml', 'CONTEXT.md']);
  assert.equal(packet.review.codeReview.status, 'NOT_EXECUTED');
});

test('required code review is automatically specified for engineering changes', () => {
  const packet = routeWorkflow({ request: 'Refactor module', changedFiles: ['src/App.jsx'], base: 'main', candidate: 'abc123' });
  assert.equal(packet.review.codeReview.required, true);
  assert.match(packet.review.codeReview.command, /ocr review --from main --to abc123/);
  assert.ok(packet.review.codeReview.automaticGate.includes('automatic-gates'));
});

test('untrusted revision names cannot inject shell commands', () => {
  const packet = routeWorkflow({ base: 'main; rm -rf /', candidate: 'branch && whoami' });
  assert.equal(packet.review.codeReview.command, 'ocr review --from <base> --to <candidate>');
  assert.throws(() => routeWorkflow({ workflowId: 'does-not-exist' }), /unknown workflowId/);
  assert.throws(() => routeWorkflow({ request: 'a'.repeat(4001) }), /at most/);
});

test('independent reviewer must be a different model family', () => {
  assert.equal(routeWorkflow({ builderModel: 'GPT-6', reviewerModel: 'Codex' }).review.independent.state, 'INDEPENDENCE_UNVERIFIED');
  assert.equal(routeWorkflow({ builderModel: 'Claude Sonnet', reviewerModel: 'Claude Opus' }).review.independent.state, 'INDEPENDENCE_UNVERIFIED');
  assert.equal(routeWorkflow({ builderModel: 'GPT-6', reviewerModel: 'Claude Sonnet' }).review.independent.state, 'READY_FOR_DISPATCH');
  assert.equal(routeWorkflow({ builderModel: 'GPT-6' }).review.independent.state, 'PICK_REVIEW_MODEL');
});

test('subagent is never claimed as dispatched without an authorized adapter', async () => {
  const ready = routeWorkflow({ request: 'Audit repository', builderModel: 'Codex', reviewerModel: 'Gemini', candidate: 'a'.repeat(40) });
  const pending = await dispatchIndependentReview(ready);
  assert.equal(pending.status, 'PENDING_ADAPTER');
  let calls = 0;
  const dispatched = await dispatchIndependentReview(ready, async (task) => { calls++; return { accepted: true, role: task.role }; });
  assert.equal(dispatched.status, 'DISPATCH_REQUESTED');
  assert.equal(dispatched.verdict, 'HOLD');
  assert.equal(calls, 1);
  const missingCandidate = await dispatchIndependentReview(routeWorkflow({ request: 'Review code', builderModel: 'Codex', reviewerModel: 'Gemini' }));
  assert.equal(missingCandidate.status, 'HOLD');
  assert.equal(missingCandidate.reason, 'EXACT_CANDIDATE_REQUIRED');
  const blocked = await dispatchIndependentReview(routeWorkflow({ builderModel: 'GPT-6', reviewerModel: 'Codex' }), async () => { calls++; });
  assert.equal(blocked.status, 'HOLD');
  assert.equal(calls, 1);
});

function mockResponse() {
  return { statusCode: 200, headers: {}, setHeader(k, v) { this.headers[k] = v; return this; },
    status(code) { this.statusCode = code; return this; }, json(data) { this.data = data; return this; } };
}

test('public API returns metadata, rejects invalid mutations and never executes work', async () => {
  const resGet = mockResponse();
  await handler({ method: 'GET' }, resGet);
  assert.equal(resGet.data.workflows.length, 9);
  const resPost = mockResponse();
  await handler({ method: 'POST', body: { request: 'UX audit', icmStage: 'PROOF' } }, resPost);
  assert.equal(resPost.statusCode, 200);
  assert.equal(resPost.data.workflow.id, 'w3-proof-and-review');
  assert.equal(resPost.data.review.codeReview.status, 'NOT_EXECUTED');
  const rejected = mockResponse();
  await handler({ method: 'POST', body: { request: 'go', executeShell: 'rm -rf /' } }, rejected);
  assert.equal(rejected.statusCode, 400);
});


test('authorized completion invokes existing OpenCodeReview gate and leaves Judge on HOLD', async () => {
  const root = await mkdtemp(join(tmpdir(), 'vibe-skill-review-'));
  try {
    let executed = 0;
    const result = await runCompletionReview({
      root, candidate: 'a'.repeat(40), builderModel: 'Codex', reviewerModel: 'Gemini',
      commandRunner: async (executable, args) => {
        executed++;
        assert.match(executable, /ocr/);
        assert.deepEqual(args, ['review', '--commit', 'a'.repeat(40)]);
        return { ok: true, exitCode: 0, stdout: 'mock OCR clean', stderr: '' };
      },
      dispatchAdapter: async (job) => ({ queued: true, model: job.reviewerModel }),
    });
    assert.equal(executed, 1);
    assert.equal(result.status, 'PENDING_INDEPENDENT_RECEIPT');
    assert.equal(result.judge, 'HOLD');
    assert.ok(result.evidence.some((file) => file.includes('open-code-review-pass')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('completion never launches OCR without an exact candidate hash', async () => {
  assert.deepEqual(await runCompletionReview({ candidate: 'main' }), {
    status: 'HOLD', reason: 'EXACT_CANDIDATE_REQUIRED',
  });
});

test('automated PR review uses a pinned upstream action and fails closed without model authorization', () => {
  const workflow = readFileSync('.github/workflows/vibe-code-review.yml', 'utf8');
  assert.doesNotMatch(workflow, /executiveusa\/open-code-review\/\.github\/workflows\/vibe-review-standard/);
  assert.match(workflow, /uses: alibaba\/open-code-review@[0-9a-f]{40}/);
  assert.match(workflow, /VIBE_OCR_REVIEW_ENABLED/);
  assert.match(workflow, /OCR_LLM_AUTH_TOKEN/);
  assert.match(workflow, /max_tokens_budget: '12000'/);
});

test('relevant in-repo skill paths are exposed as metadata without loading their bodies', () => {
  const design = routeWorkflow({ workflowId: 'w5-web-design' });
  assert.ok(design.availableLocalSkills.some((skill) => skill.id === 'icm-awwwards-taste-gauntlet-audit'));
  assert.ok(design.availableLocalSkills.some((skill) => skill.id === 'cook'));
  assert.ok(design.availableLocalSkills.every((skill) => skill.load === 'on-demand'));
  const proof = routeWorkflow({ workflowId: 'w3-proof-and-review' });
  assert.ok(proof.availableLocalSkills.some((skill) => skill.id === 'multiverse-proof'));
  assert.ok(proof.availableLocalSkills.some((skill) => skill.id === 'project-review'));
});
