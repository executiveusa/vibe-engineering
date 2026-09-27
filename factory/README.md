# Nightly Production Readiness Factory

This factory audits and advances five Vercel-connected repositories per nightly run.

## Flow

1. Discover Vercel projects and connected GitHub repositories.
2. Rank broken, undeployed, and unaudited projects first.
3. Select five distinct repositories.
4. Clone each repository into its own workspace.
5. Run the A2A Repo Completion Auditor in read-only mode.
6. Generate `docs/prd/production-readiness.md` from validated findings.
7. Execute only the bounded PRD slices required for production readiness.
8. Run a fresh reviewer and Vibe Judge on a different model family (Claude Code judges Codex's work). The runner re-checks the Judge receipt with `factory/judge-receipt.mjs`.
9. Push an isolated branch and open a PR with audit, PRD, implementation, tests, risks, and rollback evidence.

## Safety

- Five repositories may run concurrently, but no repository shares a worktree or branch.
- No direct commits to `main`.
- No production deployment from the nightly job.
- No automatic merge until the Judge report is `SHIP`, required checks pass, and the PR is explicitly eligible. The `vibe / vibe-merge-gate` check enforces this on protected `main` (`docs/ENFORCEMENT.md`).
- Every run has a budget (`VIBE_RUN_BUDGET_MINUTES`, default 120; `VIBE_MAX_BUILD_ITERATIONS`, default 4). When it runs out the result is `HOLD`.
- The step that runs agents gets model keys only. The GitHub token is used to clone before it and to push and open the PR after it.
- Missing credentials, unclear product intent, destructive migrations, billing changes, or unresolved P0 findings result in `HOLD`.
- Existing recovery agents are not duplicated; this system evaluates completion and advances product readiness.

## Required runner

Use a trusted self-hosted Linux runner with Docker. Configure repository secrets:

- Model lane: default is the free lane (`OPENROUTER_API_KEY` only; builder and Judge run as OpenRouter `:free` models through OpenCode). Set repository variable `VIBE_MODEL_LANE=paid` to use the paid lane instead, which requires `OPENAI_API_KEY` (builder) and `ANTHROPIC_API_KEY` (independent Judge). Owner decision 2026-09-26: free lane for now, no paid rail.
- `OPENROUTER_API_KEY` (free lane)
- `VERCEL_TOKEN`
- `VERCEL_TEAM_ID`
- `FLEET_GITHUB_TOKEN`

The GitHub token must have access to the target repositories and permission to create branches, issues, and pull requests. Secrets must never be written into audit artifacts, prompts, logs, commits, or PR bodies.
