import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

const taskNumber = process.env.VIBE_TASK_NUMBER;

if (!taskNumber || !/^\d+$/.test(taskNumber)) {
  throw new Error(
    "Set VIBE_TASK_NUMBER to one approved GitHub issue number before running Sandcastle.",
  );
}

const baseline = process.env.VIBE_BASELINE_BRANCH ?? "main";
const branch = `sandcastle/issue-${taskNumber}-${Date.now()}`;

console.log(`Vibe Engineering Sandcastle run`);
console.log(`Task: #${taskNumber}`);
console.log(`Baseline: ${baseline}`);
console.log(`Branch: ${branch}`);

const sandbox = await sandcastle.createSandbox({
  branch,
  sandbox: docker({ imageName: "sandcastle:vibe-engineering" }),
  hooks: {
    sandbox: {
      onSandboxReady: [
        { command: "npm ci", timeoutMs: 300_000 },
        { command: "git status --short" },
      ],
    },
  },
});

try {
  const implement = await sandbox.run({
    name: `implement-issue-${taskNumber}`,
    maxIterations: 1,
    agent: sandcastle.codex("gpt-5.4", {
      effort: "high",
      approvalsReviewer: "auto_review",
    }),
    promptFile: ".sandcastle/implement-prompt.md",
    promptArgs: {
      TASK_NUMBER: taskNumber,
      TARGET_BRANCH: baseline,
    },
  });

  if (!implement.commits.length) {
    throw new Error(
      "The implementer produced no commit. Preserve the worktree and keep the issue open for diagnosis.",
    );
  }

  await sandbox.run({
    name: `review-issue-${taskNumber}`,
    maxIterations: 1,
    agent: sandcastle.codex("gpt-5.4", {
      effort: "high",
      approvalsReviewer: "auto_review",
    }),
    promptFile: ".sandcastle/review-prompt.md",
    promptArgs: {
      TASK_NUMBER: taskNumber,
      TARGET_BRANCH: baseline,
      BRANCH: branch,
    },
  });

  console.log("Implementation and independent review completed.");
  console.log(`Branch retained for evidence and human release judgment: ${branch}`);
} finally {
  await sandbox.close();
}
