import * as fs from "node:fs";
import * as path from "node:path";
import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";
import { RECEIPT_PATH, assertIndependentJudge, evaluateReceipt, modelFamily } from "./judge-receipt.mjs";
import { DRY_RECEIPT_PATH } from "./dry-receipt.mjs";
import { dryAgent } from "./dry-agent.mjs";

const repo = process.env.TARGET_REPOSITORY;
if (!repo) throw new Error("TARGET_REPOSITORY is required");

// Builder and Judge come from different model families, and each sandbox gets only its own key.
// Codex runs with approvals bypassed inside the container; the container, the missing GitHub
// token and the merge gate are the controls, not an in-agent approval prompt.
const openaiKey = process.env.OPENAI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
const openrouterKey = process.env.OPENROUTER_API_KEY;

// Model lane: "paid" uses OpenAI builder + Anthropic judge; "free" uses OpenRouter
// :free models through OpenCode (builder qwen3.8-27b, judge gemma-4-31b - families
// still differ). Owner decision 2026-09-26 (voice note): free lane for now, no paid
// rail. The free lane authenticates with an OpenRouter key only - never a GitHub
// token - so the agent sandbox still holds nothing that can push or merge.
// Lane is explicit via VIBE_MODEL_LANE and fails closed when unset: an
// implicit default can spend on a paid-capable key route without a conscious
// choice (independent review 2026-10-24). An earlier comment here claimed a
// 2026-09-26 owner decision defaulting to free; that claim lives only in this
// repo's content and is unverified, so the code no longer relies on it.
// Lane "dry" (Phase 0): a deterministic in-sandbox agent replaces every model
// call so the whole pipeline can be exercised with zero keys, zero spend and
// zero model output. Its receipt is always HOLD and can never pass the gate.
const lane = process.env.VIBE_MODEL_LANE;

const slug = repo.replace(/[^a-zA-Z0-9._-]/g, "-");
const branch = `vibe/readiness-${slug}-${Date.now()}`;

const report = (decision: string, extra: Record<string, unknown> = {}) => {
  const output = process.env.GITHUB_OUTPUT;
  if (output) fs.appendFileSync(output, `branch=${branch}\ndecision=${decision}\n`, "utf8");
  console.log(JSON.stringify({ repository: repo, branch, decision, lane, ...extra }));
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
const builderModel = process.env.VIBE_BUILDER_MODEL || (lane === "paid" ? "gpt-5.4" : "openrouter/qwen/qwen3.8-27b:free");
const judgeModel = process.env.VIBE_JUDGE_MODEL || (lane === "paid" ? "opus" : "openrouter/google/gemma-4-31b-it:free");

// Independence on the effective models (defaults or overrides), not lane defaults:
// two overrides naming the same family must fail here (codex P2 on PR #66).
// The dry lane uses one deterministic provider for both roles, so there is no
// model family to be independent of; the check is skipped ONLY for this lane.
if (lane !== "dry") {
  assertIndependentJudge(modelFamily(builderModel), modelFamily(judgeModel));
}
// The models the runner ACTUALLY launched, for the exit bar's three-voices check (factory/exit-bar.mjs).
// A receipt an agent wrote never decides which families ran.
if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `builder_model=${builderModel}\njudge_model=${judgeModel}\n`, "utf8");
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
const builder = () =>
  lane === "paid"
    ? sandcastle.codex(builderModel, {
        effort: "high",
        env: { OPENAI_API_KEY: openaiKey as string },
      })
    : sandcastle.opencode(builderModel, {
        env: { OPENROUTER_API_KEY: openrouterKey as string },
      });
const judge = () =>
  lane === "paid"
    ? sandcastle.claudeCode(judgeModel, {
        effort: "high",
        env: { ANTHROPIC_API_KEY: anthropicKey as string },
      })
    : sandcastle.opencode(judgeModel, {
        env: { OPENROUTER_API_KEY: openrouterKey as string },
      });

const sandbox = await sandcastle.createSandbox({
  branch,
  sandbox: docker({ imageName: "sandcastle:vibe-engineering" }),
  hooks: {
    sandbox: {
      onSandboxReady: [
        { command: "git status --short" },
        { command: "test ! -f package-lock.json || npm ci", timeoutMs: 300000 },
      ],
    },
  },
});

try {
  await sandbox.run({
    name: "completion-auditor",
    maxIterations: 1,
    agent: builderAgent("auditor"),
    promptFile: ".vibe-factory/audit-prompt.md",
    signal: budget,
  });
  await sandbox.run({
    name: "prd-builder",
    maxIterations: 1,
    agent: builderAgent("prd"),
    promptFile: ".vibe-factory/prd-builder-prompt.md",
    signal: budget,
  });
  const build = await sandbox.run({
    name: "production-builder",
    maxIterations: maxBuildIterations,
    agent: builderAgent("builder"),
    promptFile: ".vibe-factory/builder-prompt.md",
    signal: budget,
  });
  if (!build.commits.length) throw new Error("Builder produced no commits");
  await sandbox.run({
    name: "reviewer-judge",
    maxIterations: 2,
    agent: judgeAgent("judge"),
    promptFile: ".vibe-factory/reviewer-judge-prompt.md",
    signal: budget,
  });

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
}
