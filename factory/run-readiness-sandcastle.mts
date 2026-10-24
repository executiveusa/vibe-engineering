import * as fs from "node:fs";
import * as path from "node:path";
import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";
import { RECEIPT_PATH, assertIndependentJudge, evaluateReceipt, modelFamily } from "./judge-receipt.mjs";
import { DRY_RECEIPT_PATH } from "./dry-receipt.mjs";
import { dryAgent } from "./dry-agent.mjs";
import { resolveModels, assertIndependent, familyOf } from "./model-resolve.mjs";
import { writeStageRecord, writeIndex, sha256File } from "./evidence-chain.mjs";
import { execFileSync } from "node:child_process";

const repo = process.env.TARGET_REPOSITORY;
if (!repo) throw new Error("TARGET_REPOSITORY is required");

// Builder and Judge come from different model families, and each sandbox gets only its own key.
// Codex runs with approvals bypassed inside the container; the container, the missing GitHub
// token and the merge gate are the controls, not an in-agent approval prompt.
const openaiKey = process.env.OPENAI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const openrouterKey = process.env.OPENROUTER_API_KEY;

// Lane is explicit via VIBE_MODEL_LANE and fails closed when unset: an
// implicit default can spend on a paid-capable key route without a conscious
// choice (independent review 2026-10-24). In the FREE lane no provider key
// enters the sandbox at all: agents reach models through factory/free-broker.mjs
// on the runner (model allowlist, injected zero-price ceiling, call cap).
// Lane "dry" (Phase 0): a deterministic in-sandbox agent replaces every model
// call so the whole pipeline can be exercised with zero keys, zero spend and
// zero model output. Its receipt is always HOLD and can never pass the gate.
const lane = process.env.VIBE_MODEL_LANE;

const slug = repo.replace(/[^a-zA-Z0-9._-]/g, "-");
const branch = `vibe/readiness-${slug}-${Date.now()}`;

let finalOutputSha = "";
let baseShaGlobal = "";
const report = (decision: string, extra: Record<string, unknown> = {}) => {
  const output = process.env.GITHUB_OUTPUT;
  if (output) fs.appendFileSync(output, `branch=${branch}\ndecision=${decision}\noutput_sha=${finalOutputSha}\nbase_sha=${baseShaGlobal}\n`, "utf8");
  console.log(JSON.stringify({ repository: repo, branch, decision, lane, output_sha: finalOutputSha, ...extra }));
};

// Fail closed: configuration problems (bad lane, missing credentials) must still
// record a durable HOLD so the workflow reports it instead of failing empty.
const validateConfig = () => {
  if (lane !== "paid" && lane !== "free" && lane !== "dry") {
    throw new Error("VIBE_MODEL_LANE must be set explicitly to paid, free or dry (no default)");
  }
  // The target is interpolated into shell commands by the workflow; reject
  // anything but a plain owner/repo (a leading dash or extra segments become
  // option injection downstream). The clone-time branch is guarded in the
  // workflow itself.
  if (!/^[A-Za-z0-9_][A-Za-z0-9_.-]*\/[A-Za-z0-9_][A-Za-z0-9_.-]*$/.test(repo)) {
    throw new Error(`TARGET_REPOSITORY must be a plain owner/repo: ${JSON.stringify(repo)}`);
  }
  if (lane === "dry") {
    // Hard condition from independent review: the dry lane must run with no
    // model secrets in its environment at all, not merely ignore them.
    const present = ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", "OPENROUTER_API_KEY"].filter(
      (name) => !!process.env[name],
    );
    if (present.length) {
      throw new Error(`dry lane must run with no model keys set; found: ${present.join(", ")}`);
    }
    return;
  }
  if (lane === "paid") {
    if (!openaiKey) throw new Error("OPENAI_API_KEY is required for the builder");
    if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is required for the independent Judge");
  } else if (!openrouterKey) {
    throw new Error("OPENROUTER_API_KEY is required for the free model lane");
  }
};
try {
  validateConfig();
} catch (error) {
  report("HOLD", { level: "config", reasons: [(error as Error).message] });
  throw error;
}
// Phase 1: three roles, three families. The free lane resolves pinned
// preferences against the LIVE :free listing at run time (no silent
// substitution; unresolvable = HOLD, never a paid fallback).
let builderModel = process.env.VIBE_BUILDER_MODEL || "";
let reviewerModel = process.env.VIBE_REVIEWER_MODEL || "";
let judgeModel = process.env.VIBE_JUDGE_MODEL || "";
if (lane === "free" && (!builderModel || !reviewerModel || !judgeModel)) {
  let listing: unknown = null;
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models", { signal: AbortSignal.timeout(20000) });
    listing = ((await res.json()) as { data?: { id?: string }[] }).data?.map((m) => m.id) ?? null;
  } catch { listing = null; }
  const r = resolveModels(listing as string[] | null);
  if (!r.ok) {
    report("HOLD", { level: "model-resolution", reasons: [r.hold as string] });
    throw new Error(`model resolution HOLD: ${r.hold}`);
  }
  builderModel = builderModel || `openrouter/${r.resolved.builder}`;
  reviewerModel = reviewerModel || `openrouter/${r.resolved.reviewer}`;
  judgeModel = judgeModel || `openrouter/${r.resolved.judge}`;
} else if (lane === "paid") {
  builderModel = builderModel || "gpt-5.4";
  judgeModel = judgeModel || "opus";
  reviewerModel = reviewerModel || "openrouter/google/gemma-4-31b-it:free"; // third family vs OpenAI/Anthropic
  if (!openrouterKey) {
    report("HOLD", { level: "config", reasons: ["paid lane needs OPENROUTER_API_KEY for the third-family reviewer"] });
    throw new Error("OPENROUTER_API_KEY is required for the reviewer (paid lane)");
  }
}

// Independence on the effective models (defaults or overrides), not lane defaults:
// overrides collapsing two roles into one family must fail here (codex P2 on PR #66).
// The dry lane uses one deterministic provider for every role, so there is no
// model family to be independent of; the check is skipped ONLY for this lane.
if (lane === "dry") {
  // no model families
} else if (lane === "free") {
  const strip = (m: string) => m.replace(/^openrouter\//, "");
  assertIndependent(strip(builderModel), strip(reviewerModel), strip(judgeModel));
} else {
  assertIndependentJudge(modelFamily(builderModel), modelFamily(judgeModel));
}

// Budgets: every loop stops. An exhausted budget is HOLD, never a pass.
const positiveInt = (name: string, fallback: number) => {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  return value;
};
const maxBuildIterations = positiveInt("VIBE_MAX_BUILD_ITERATIONS", 4);
const budgetMinutes = positiveInt("VIBE_RUN_BUDGET_MINUTES", 120);
const budget = AbortSignal.timeout(budgetMinutes * 60 * 1000);

const builderAgent = (stage: string) => (lane === "dry" ? dryAgent(stage) : builder());
const judgeAgent = (stage: string) => (lane === "dry" ? dryAgent(stage) : judge());
const reviewerAgent = (stage: string) => (lane === "dry" ? dryAgent(stage) : reviewer());
const builder = () =>
  lane === "paid"
    ? sandcastle.codex(builderModel, {
        effort: "high",
        env: { OPENAI_API_KEY: openaiKey as string },
      })
    : sandcastle.opencode(builderModel, {
        env: brokerEnv as Record<string, string>,
      });
const judge = () =>
  lane === "paid"
    ? sandcastle.claudeCode(judgeModel, {
        effort: "high",
        env: { ANTHROPIC_API_KEY: anthropicKey as string },
      })
    : sandcastle.opencode(judgeModel, {
        env: brokerEnv as Record<string, string>,
      });
const reviewer = () =>
  sandcastle.opencode(reviewerModel, {
    env: brokerEnv as Record<string, string>,
  });

// Free lane: the broker alone holds the provider key, on the runner, outside
// the sandbox. opencode receives only the run token + a config pointing its
// openrouter provider at the broker.
// baseURL contract VERIFIED 2026-10-24 (https://opencode.ai/docs/providers/,
// https://opencode.ai/docs/config/): provider baseURL is an opencode config
// option, not an env var; OPENCODE_CONFIG names a custom file loaded between
// global and project config. The broker still enforces the model allowlist,
// the injected zero-price ceiling and the call cap if any config layer
// disagrees. Full opencode-binary smoke against the broker remains a
// pre-dispatch check; the broker's OpenAI-compatible tool/stream flow is
// covered by phase1-broker-proxy tests.
const brokerEvents: { model?: string; served_model?: string; ok?: boolean }[] = [];
let broker: { close: () => Promise<void>; runToken: string } | null = null;
let brokerEnv: Record<string, string> = {};
if (lane === "free") {
  const { createBroker } = await import("./free-broker.mjs");
  const strip = (m: string) => m.replace(/^openrouter\//, "");
  broker = createBroker({
    apiKey: openrouterKey as string,
    allowedModels: [strip(builderModel), strip(reviewerModel), strip(judgeModel)],
    onEvent: (e: { model?: string; served_model?: string; ok?: boolean }) => brokerEvents.push(e),
  }) as unknown as { close: () => Promise<void>; runToken: string };
  const bound = await (broker as unknown as { listen: () => Promise<{ port: number; host: string }> }).listen();
  const cfgPath = path.join(process.cwd(), ".vibe-factory", "opencode.factory.json");
  fs.writeFileSync(cfgPath, JSON.stringify({
    $schema: "https://opencode.ai/config.json",
    provider: { openrouter: { options: { baseURL: `http://${bound.host}:${bound.port}/v1` } } },
  }, null, 2) + "\n");
  brokerEnv = { OPENROUTER_API_KEY: broker.runToken, OPENCODE_CONFIG: cfgPath };
} else if (lane === "paid") {
  brokerEnv = { OPENROUTER_API_KEY: openrouterKey as string }; // paid lane reviewer uses its own third-family key (no broker)
}

const sandbox = await sandcastle.createSandbox({
  branch,
  sandbox: docker({ imageName: "sandcastle:vibe-engineering" }),
  hooks: {
    sandbox: {
      onSandboxReady: [
        { command: "git status --short" },
        // --ignore-scripts: target-controlled install hooks must never execute
        // in an environment that carries provider routes.
        { command: "test ! -f package-lock.json || npm ci --ignore-scripts", timeoutMs: 300000 },
      ],
    },
  },
});

// Evidence chain (Phase 1 spec 4.2): SHAs come from the sandbox worktree,
// records land in evidence/<base_sha>/ on the runner and are uploaded as the
// factory-evidence-<run_id> artifact. Any chain break is a HOLD (fail closed).
const wt = () => sandbox.worktreePath;
const headSha = () => execFileSync("git", ["-C", wt(), "rev-parse", "HEAD"], { encoding: "utf8" }).trim();
const baseSha = headSha();
baseShaGlobal = baseSha;
const evidenceDir = path.join(process.cwd(), "evidence", baseSha);
fs.mkdirSync(path.join(evidenceDir, "logs"), { recursive: true });
let stageNn = 0;
const modelOf = (role: string) =>
  lane === "dry" ? { model: "dry-agent", family: "dry" }
    : role === "builder" ? { model: builderModel, family: familyOf(builderModel.replace(/^openrouter\//, "")) }
    : role === "reviewer" ? { model: reviewerModel, family: familyOf(reviewerModel.replace(/^openrouter\//, "")) }
    : { model: judgeModel, family: familyOf(judgeModel.replace(/^openrouter\//, "")) };

const runStage = async (opts: {
  stage: string; name: string; role: "builder" | "reviewer" | "judge";
  agent: unknown; promptFile: string; maxIterations: number; findingsCount?: number;
}) => {
  stageNn += 1;
  const inputSha = headSha();
  const started = new Date().toISOString();
  const eventMark = brokerEvents.length;
  let status: "ok" | "hold" | "failed" = "ok";
  let result: unknown = null;
  try {
    result = await sandbox.run({
      name: opts.name,
      maxIterations: opts.maxIterations,
      agent: opts.agent,
      promptFile: opts.promptFile,
      signal: budget,
    });
  } catch (e) {
    status = budget.aborted ? "hold" : "failed";
    result = { error: String((e as Error).message || e).slice(0, 500) };
  }
  const finished = new Date().toISOString();
  const outputSha = headSha();
  const logPath = path.join(evidenceDir, "logs", `${String(stageNn).padStart(2, "0")}-${opts.stage}.log`);
  fs.writeFileSync(logPath, JSON.stringify(result, null, 2) + "\n");
  const m = modelOf(opts.role);
  // Bind the stage to what the provider ACTUALLY served during it (broker
  // events); the chain verifier requires served == declared when present.
  const declared = m.model.replace(/^openrouter\//, "");
  const served = [...new Set(brokerEvents.slice(eventMark)
    .filter((e) => e.model === declared && typeof e.served_model === "string")
    .map((e) => e.served_model as string))];
  writeStageRecord(evidenceDir, stageNn, {
    stage: opts.stage, agent: opts.name, model: m.model, model_family: m.family,
    input_sha: inputSha, output_sha: outputSha, started_at: started, finished_at: finished,
    status, findings_count: opts.findingsCount ?? 0, artifacts: [], log_sha256: sha256File(logPath),
    ...(served.length ? { served_models: served } : {}),
  });
  if (status !== "ok") throw new Error(`stage ${opts.stage} ${status}`);
  return result;
};

const REVIEW_JSON = "docs/evidence/review.json";
const readReview = (): { verdict: string; p0: number; p1: number } | null => {
  try {
    const r = JSON.parse(fs.readFileSync(path.join(wt(), REVIEW_JSON), "utf8"));
    return { verdict: String(r.verdict || ""), p0: Number(r.p0) || 0, p1: Number(r.p1) || 0 };
  } catch { return null; }
};

try {
  await runStage({ stage: "audit", name: "completion-auditor", role: "builder", agent: builderAgent("auditor"), promptFile: ".vibe-factory/audit-prompt.md", maxIterations: 1 });
  await runStage({ stage: "prd", name: "prd-builder", role: "builder", agent: builderAgent("prd"), promptFile: ".vibe-factory/prd-builder-prompt.md", maxIterations: 1 });
  const build = (await runStage({ stage: "build", name: "production-builder", role: "builder", agent: builderAgent("builder"), promptFile: ".vibe-factory/builder-prompt.md", maxIterations: maxBuildIterations })) as { commits?: unknown[] };
  if (!build?.commits?.length) throw new Error("Builder produced no commits");

  // Independent reviewer: fresh eyes, may not edit code - enforced by checking
  // the stage's file changes touch ONLY docs/evidence/review.json.
  const reviewIn = headSha();
  await runStage({ stage: "review", name: "independent-reviewer", role: "reviewer", agent: reviewerAgent("reviewer"), promptFile: ".vibe-factory/reviewer-prompt.md", maxIterations: 1 });
  const reviewOut = headSha();
  if (reviewOut !== reviewIn) {
    const changed = execFileSync("git", ["-C", wt(), "diff", "--name-only", `${reviewIn}..${reviewOut}`], { encoding: "utf8" })
      .trim().split("\n").filter(Boolean);
    const disallowed = changed.filter((f) => f !== REVIEW_JSON);
    if (disallowed.length) throw new Error(`reviewer edited outside ${REVIEW_JSON}: ${disallowed.join(", ").slice(0, 300)}`);
  }
  const review = readReview();
  if (!review) throw new Error("reviewer produced no readable review.json");
  if (review.verdict !== "CLEAN" && review.p0 + review.p1 > 0) {
    await runStage({ stage: "build-fix", name: "builder-review-fixes", role: "builder", agent: builderAgent("builder"), promptFile: ".vibe-factory/builder-fix-prompt.md", maxIterations: 2, findingsCount: review.p0 + review.p1 });
  }

  await runStage({ stage: "judge", name: "reviewer-judge", role: "judge", agent: judgeAgent("judge"), promptFile: ".vibe-factory/reviewer-judge-prompt.md", maxIterations: 2 });

  // Chain check BEFORE trusting any receipt: a broken chain is a HOLD.
  const index = writeIndex(evidenceDir, baseSha, process.env.GITHUB_RUN_ID || "local");
  finalOutputSha = (index.finalSha as string) || "";
  if (!index.ok) {
    report("HOLD", { level: "evidence-chain", reasons: [index.reason as string] });
    throw new Error(`evidence chain HOLD: ${index.reason}`);
  }

  // The worktree leaves the run as a git bundle artifact (never pushed).
  execFileSync("git", ["-C", wt(), "bundle", "create", path.join(process.cwd(), "factory.bundle"), "--all"], { stdio: "inherit" });

  // The runner re-checks the receipt; the Judge's word alone is not a SHIP.
  // Dry lane reads back its own distinct receipt path; the real receipt path
  // is never populated by a dry run.
  const receiptFile = path.join(sandbox.worktreePath, lane === "dry" ? DRY_RECEIPT_PATH : RECEIPT_PATH);
  const receipt = fs.existsSync(receiptFile) ? JSON.parse(fs.readFileSync(receiptFile, "utf8")) : null;
  const verdict = evaluateReceipt(receipt);
  report(verdict.decision, { level: verdict.level, reasons: verdict.reasons });
} catch (error) {
  if (!budget.aborted) throw error;
  report("HOLD", { reasons: [`budget exhausted after ${budgetMinutes} minutes`] });
} finally {
  await sandbox.close();
  if (broker) await broker.close();
}
