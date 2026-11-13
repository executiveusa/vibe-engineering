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

## StarNet lane (exit bar + separate deploy step)

Set repository variable `VIBE_TARGET_SOURCE=starnet` and the factory takes its repos from the StarNet gateway intake
queue (`scripts/select-starnet-intake.mjs`; `STARNET_GATEWAY_URL` variable + `STARNET_GATEWAY_TOKEN` secret) instead of
the Vercel batch. Queued rows only; a row relying on an assumed grill answer waits for the captain.

A StarNet product leaves the factory only through `factory/exit-bar.mjs`, for one commit:

1. the Judge receipt is SHIP and fills `commit` + `exit_bar` (backend features PASS with tests, UDEC >= 8.5, zero AI-slop findings);
2. two security district attack runs on that commit, no HIGH/CRITICAL, every MEDIUM fixed or captain-accepted;
3. builder, Judge and security auditor are three different model families (builder/Judge from the lane settings, `factory/lane-models.mjs`);
4. the separate deploy step put that commit on the private VPS preview and the preview serves it.

The deploy step is its own workflow, `.github/workflows/factory-preview-deploy.yml`, in the `vibe-preview` environment.
It holds the only deploy credential (`VIBE_PREVIEW_DEPLOY_TOKEN`, a Coolify API token for the preview area) and no
model keys, and no agent runs there. It refuses unless the Judge and security receipts pass for the exact commit. It
pins the Coolify app to the commit, deploys it, and requires the preview to serve that sha at `/.well-known/build-sha`,
to refuse anonymous requests, and to pass the live tests. Then it writes `docs/evidence/<sha>/08-deploy.json` (no token,
no host) and reports the verdict to the StarNet intake. Requiring a reviewer on the `vibe-preview` environment makes
each deploy a one-tap approval. Public go-live is never done here.
