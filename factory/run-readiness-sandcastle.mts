import * as fs from "node:fs";
import * as path from "node:path";
import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";
import { RECEIPT_PATH, assertIndependentJudge, evaluateReceipt } from "./judge-receipt.mjs";

const repo = process.env.TARGET_REPOSITORY;
if (!repo) throw new Error("TARGET_REPOSITORY is required");

// Builder and Judge come from different model families, and each sandbox gets only its own key.
// Codex runs with approvals bypassed inside the container; the container, the missing GitHub
// token and the merge gate are the controls, not an in-agent approval prompt.
const openaiKey = process.env.OPENAI_API_KEY;
const anthropicKey = process.env.ANTHROPIC_API_KEY;
if (!openaiKey) throw new Error("OPENAI_API_KEY is required for the builder");
if (!anthropicKey) throw new Error("ANTHROPIC_API_KEY is required for the independent Judge");
assertIndependentJudge("openai", "anthropic");

const builderModel = process.env.VIBE_BUILDER_MODEL || "gpt-5.4";
const judgeModel = process.env.VIBE_JUDGE_MODEL || "opus";

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
  sandcastle.codex(builderModel, {
    effort: "high",
    env: { OPENAI_API_KEY: openaiKey },
  });
const judge = () =>
  sandcastle.claudeCode(judgeModel, {
    effort: "high",
    env: { ANTHROPIC_API_KEY: anthropicKey },
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
  console.log(JSON.stringify({ repository: repo, branch, decision, builderModel, judgeModel, ...extra }));
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
