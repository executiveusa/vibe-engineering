import * as fs from "node:fs";
import * as path from "node:path";
import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";
import { RECEIPT_PATH, assertIndependentJudge, evaluateReceipt, modelFamily } from "./judge-receipt.mjs";

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
// Lane is explicit via VIBE_MODEL_LANE. Default is FREE (owner decision 2026-09-26:
// free lane for now, no paid rail) - paid runs only when explicitly selected,
// even if legacy paid secrets still exist on the repo.
const lane = process.env.VIBE_MODEL_LANE || "free";
if (lane !== "paid" && lane !== "free") throw new Error("VIBE_MODEL_LANE must be paid or free");
if (lane === "paid") {
  if (!openaiKey) throw new Error("OPENAI_API_KEY is required for the builder");
  if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is required for the independent Judge");
} else if (!openrouterKey) {
  throw new Error("OPENROUTER_API_KEY is required for the free model lane");
}
const builderModel = process.env.VIBE_BUILDER_MODEL || (lane === "paid" ? "gpt-5.4" : "openrouter/qwen/qwen3.8-27b:free");
const judgeModel = process.env.VIBE_JUDGE_MODEL || (lane === "paid" ? "opus" : "openrouter/google/gemma-4-31b-it:free");

// Independence on the effective models (defaults or overrides), not lane defaults:
// two overrides naming the same family must fail here (codex P2 on PR #66).
assertIndependentJudge(modelFamily(builderModel), modelFamily(judgeModel));

// Budgets: every loop stops. An exhausted budget is HOLD, never a pass.
const positiveInt = (name: string, fallback: number) => {
  const value = Number(process.env[name] || fallback);
  if (!Number.isInteger(value) || value < 1) throw new Error(`${name} must be a positive integer`);
  return value;
};
const maxBuildIterations = positiveInt("VIBE_MAX_BUILD_ITERATIONS", 4);
const budgetMinutes = positiveInt("VIBE_RUN_BUDGET_MINUTES", 120);
const budget = AbortSignal.timeout(budgetMinutes * 60 * 1000);

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

const slug = repo.replace(/[^a-zA-Z0-9._-]/g, "-");
const branch = `vibe/readiness-${slug}-${Date.now()}`;
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

const report = (decision: string, extra: Record<string, unknown> = {}) => {
  const output = process.env.GITHUB_OUTPUT;
  if (output) fs.appendFileSync(output, `branch=${branch}\ndecision=${decision}\n`, "utf8");
  console.log(JSON.stringify({ repository: repo, branch, decision, lane, builderModel, judgeModel, ...extra }));
};

try {
  await sandbox.run({
    name: "completion-auditor",
    maxIterations: 1,
    agent: builder(),
    promptFile: ".vibe-factory/audit-prompt.md",
    signal: budget,
  });
  await sandbox.run({
    name: "prd-builder",
    maxIterations: 1,
    agent: builder(),
    promptFile: ".vibe-factory/prd-builder-prompt.md",
    signal: budget,
  });
  const build = await sandbox.run({
    name: "production-builder",
    maxIterations: maxBuildIterations,
    agent: builder(),
    promptFile: ".vibe-factory/builder-prompt.md",
    signal: budget,
  });
  if (!build.commits.length) throw new Error("Builder produced no commits");
  await sandbox.run({
    name: "reviewer-judge",
    maxIterations: 2,
    agent: judge(),
    promptFile: ".vibe-factory/reviewer-judge-prompt.md",
    signal: budget,
  });

  // The runner re-checks the receipt; the Judge's word alone is not a SHIP.
  const receiptFile = path.join(sandbox.worktreePath, RECEIPT_PATH);
  const receipt = fs.existsSync(receiptFile) ? JSON.parse(fs.readFileSync(receiptFile, "utf8")) : null;
  const verdict = evaluateReceipt(receipt);
  report(verdict.decision, { level: verdict.level, reasons: verdict.reasons });
} catch (error) {
  if (!budget.aborted) throw error;
  report("HOLD", { reasons: [`budget exhausted after ${budgetMinutes} minutes`] });
} finally {
  await sandbox.close();
}
