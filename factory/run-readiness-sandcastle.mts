import * as sandcastle from "@ai-hero/sandcastle";
import { docker } from "@ai-hero/sandcastle/sandboxes/docker";

const target = process.env.TARGET_BRANCH ?? "main";
const repo = process.env.TARGET_REPOSITORY;
if (!repo) throw new Error("TARGET_REPOSITORY is required");

const slug = repo.replace(/[^a-zA-Z0-9._-]/g, "-");
const branch = `vibe/readiness-${slug}-${Date.now()}`;
const sandbox = await sandcastle.createSandbox({
  branch,
  sandbox: docker({ imageName: "sandcastle:vibe-engineering" }),
  hooks: { sandbox: { onSandboxReady: [
    { command: "git status --short" },
    { command: "test ! -f package-lock.json || npm ci", timeoutMs: 300000 }
  ] } }
});

const agent = () => sandcastle.codex("gpt-5.4", { effort: "high", approvalsReviewer: "auto_review" });

try {
  await sandbox.run({ name: "completion-auditor", maxIterations: 1, agent: agent(), promptFile: ".vibe-factory/audit-prompt.md" });
  await sandbox.run({ name: "prd-builder", maxIterations: 1, agent: agent(), promptFile: ".vibe-factory/prd-builder-prompt.md" });
  const build = await sandbox.run({ name: "production-builder", maxIterations: 4, agent: agent(), promptFile: ".vibe-factory/builder-prompt.md" });
  if (!build.commits.length) throw new Error("Builder produced no commits");
  await sandbox.run({ name: "reviewer-judge", maxIterations: 2, agent: agent(), promptFile: ".vibe-factory/reviewer-judge-prompt.md", promptArgs: { TARGET_BRANCH: target, BRANCH: branch } });
  console.log(JSON.stringify({ repository: repo, branch, status: "PR_READY_FOR_HUMAN_OR_AUTOMERGE_GATE" }));
} finally {
  await sandbox.close();
}
