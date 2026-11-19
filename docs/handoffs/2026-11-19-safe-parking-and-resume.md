# VIBE Engineering — safe parking / resume handoff (2026-11-19)

## Decision
**PARK the release; preserve working production and all unmerged feature branches.** Do not claim the latest consolidated code is live. Do not merge branches simply to empty the PR queue. Resume from this document, not a conversation transcript.

## Verified baseline
- Canonical repository: https://github.com/executiveusa/vibe-engineering
- Consolidation: PR #91 **merged** into `main` at `71d36941ec174060f9aa1c3fb8328e58b7a47918` on 2026-11-19. It integrates MASTER MODE, ICM skill routing, growth, G15 law, Trail opt-in, W5 references, and selected review infrastructure. The exact live `main` HEAD may have moved; fetch it before acting.
- PRs #79, #71, #88 closed **without merging** as superseded; #62 closed without merging as an intentional negative merge-gate probe.
- 2026-11-19 live GitHub inventory of remaining original PRs: #60, #68, #70, #73, #76, #77, #84, #85, #87, #89, #90 — all OPEN when checked. Recheck live state on resume.
- Netlify site `vibeengineering20` was READY on production commit `9e7fea18e0063632f76a9126f25be600e97e9e8e` (2026-09-27), **older** than consolidation.
- Vercel project `vibe-engineering` exists; production alias `https://vibe-engineering-nine.vercel.app` returned HTTP 200 for homepage. `/api/v1/workflow-router` and `/api/skills` returned HTTP 404 when checked; these two URLs were probes, not proof of the canonical route contract. Project's only listed production deployment was READY but older than consolidation. Recent preview deployments included CANCELED runs.
- GitHub combined status and PR-triggered workflow-run lookup for consolidation merge SHA returned empty arrays. This does **not** prove checks passed or failed. Exact-head independent judge/SHIP and production validation are NOT VERIFIED.
- Repository configuration previously observed: `vercel.json` disables Git deployment (`git.deploymentEnabled=false`). Inspect current config before enabling any automatic deployment.

## Open PR triage (not approval to merge)
| PR | Classification | Required resume decision |
|---|---|---|
| #60 | MERGE or close after reconciliation | Main has style-firewall principles but the older branch contains unique wording; compare line-by-line; preserve governance semantics. |
| #68 | Reconcile | Caller workflow already on main; old `docs/evidence/production-readiness-judge.json` exists only on branch. Do not import stale SHIP receipt. |
| #70 | Reconcile | Alternative OpenCodeReview workflow; preserve canonical independent review chain; do not replace review gates blindly. |
| #73 | Reconcile | Trail cache/docs on main; branch has additional `AGENTS.md` usage instructions. |
| #76 | Reconcile | Growth skill set integrated via #91; check post-merge branch differences. |
| #77 | PARK | StarNet preview lane: separate security-sensitive production change; require owner scope and review. |
| #84 | Reconcile | ICM router integrated via #91; check any unique post-consolidation changes. |
| #85 | Reconcile | MASTER MODE integrated via #91; ensure no drift in authority/agent roles and code-review receipts. |
| #87 | Reconcile | Picomatch security patch included in #91; verify installed lockfile and npm audit independently. |
| #89 | PARK | VIBE FORGE separate feature; do not merge into parking release. |
| #90 | PARK | Ecosystem authority architecture may have unique owner decisions; review separately. |

## Resume checklist
1. Fetch live `main` HEAD and list open PRs, checks, branch protection and deployment settings. Inspect before changing.
2. Reconcile each overlapping PR against `main` by actual file contents and tests, not Git ahead/behind counts. Close only fully superseded PRs with evidence comments. Preserve #77/#89/#90 as separate workstreams until authorized.
3. Run clean-install/build/test/security audit and exact-candidate independent reviewer/Judge receipt. Do not edit or disable failing gates. Keep secrets out of logs and source.
4. Identify the actual canonical API paths from source, then verify them on a **preview** deployment. Test homepage, mobile, API/MCP, auth and rollback. If checks fail, HOLD.
5. With approved release evidence, deploy pinned SHA to the intended Vercel production project. Verify live SHA, routes and logs directly; retain prior production as rollback. Netlify remains legacy until production verified and retirement explicitly approved.
6. Publish a concise VERIFIED/CLAIMED evidence report with tested SHA, URLs, failures, approvals and rollback. Only then declare production complete.

## Owner / agent authority
Bambu -> Instinct -> Heisenberg -> Paperclip (only queue) -> workers (Hermes/Cosmos specs; CodeDen coding factory) -> independent judge. This handoff is not a new queue or standing automation. No unattended production changes.


## Explicit residual risks (not cleared by merging this handoff)
- **Release evidence risk:** No independently verified exact-head review/Judge SHIP or GitHub checks were established for the consolidation. A documentation merge is not a production release approval.
- **Deployment drift risk:** Vercel/Netlify production builds are not verified against consolidated `main`; the two probed API paths returned 404 and canonical paths require source inspection.
- **Open-branch risk:** Eleven original PRs remain open, including security/review changes and separately scoped Forge/StarNet work. They must not be bulk-merged or discarded.
- **Automation risk:** The existing hourly **MASTER MODE Merge Gate** automation was previously configured to watch PR #85. Its live state and whether it has been paused or retargeted were **not verified**; check and update the existing automation before trusting future notifications. Do not create a duplicate loop.
- **Rollback risk:** Previous production deployments exist, but a live rollback exercise has **not** been verified. Preserve them and test rollback before a release.

## Current release disposition
**HOLD / PARKED SAFELY.** Code is merged in GitHub, but final production is not verified. No credentials or production settings were changed as part of this handoff. The existing live sites remain untouched.
