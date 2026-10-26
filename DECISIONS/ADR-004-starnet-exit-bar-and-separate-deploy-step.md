# ADR-004 — StarNet exit bar and a separate preview deploy step

**Status:** PROPOSED  
**Date:** 2026-10-26  
**Consequence level:** HIGH  
**Human approval required:** Yes

## Context

The StarNet program (pauli-starnet `program/starnet-v2/_shared/PRD.md` section 8) takes up to five repositories a day from
its intake queue and ends each one about 80% done: the backend complete, attacked by the security district, judged, and
deployed to a private VPS preview the captain opens on the phone. Two problems stood in the way:

- the nightly factory ends at a draft PR. Nothing deployed, and nothing tied a deployed preview to the commit the Judge reviewed;
- the PRD's bar (backend features with tests, UDEC >= 8.5, no AI slop, two security runs, three model families, a private
  preview) was nowhere in code. `evaluateReceipt` checks the Judge's numbers only.

The item-49 guard redesign the captain approved says the builder holds only a read-only GitHub token and no server access,
and that a separate deploy step holds a deploy-only credential that no agent ever holds.

## Decision

1. `factory/exit-bar.mjs` is the StarNet exit bar. It passes ONE commit, and only when all of these hold: the Judge receipt
   passes `evaluateReceipt` and fills `commit` + `exit_bar`; there are two security runs on that commit with no HIGH/CRITICAL
   finding and every MEDIUM fixed or captain-accepted; builder, Judge and auditor are three model families; and the deploy
   receipt shows the private preview serving that commit with passing live tests.
2. The builder and Judge families come from the repository's lane settings (`factory/lane-models.mjs`, kept equal to the
   runner by a test). They never come from a dispatch input or from a receipt an agent wrote.
3. Deploying is its own workflow (`factory-preview-deploy.yml`, environment `vibe-preview`). It holds the only deploy
   credential, has no model keys, and runs no agent. It refuses before any request unless the commit already passes the
   Judge and security clauses. A required reviewer on the environment makes each deploy one tap (PRD yellow).
4. `VIBE_TARGET_SOURCE=starnet` takes targets from the StarNet intake queue. Assumed-answer intakes wait for the captain.

## Impact graph

- **Direct effects:** a factory product can reach a private preview. Nothing changes for the Vercel lane or the merge gate.
- **Second-order effects:** a Coolify API token for the preview area now exists as a secret. Its scope is the preview area only,
  which is an owner/builder setup step. A wrong scope widens what a compromised workflow could reach.
- **Third-order effects:** "done" for a StarNet product becomes checkable by a stranger: four receipts for one sha.
- **Reversibility:** full. Delete the workflow and the environment secret, and unset `VIBE_TARGET_SOURCE`.
- **Inheritors:** the captain, the StarNet builder, and anyone who operates the factory.

## Consequences

- Known gap, not fixed here: the existing PR step pushes with `FLEET_GITHUB_TOKEN` after the workflow verifies that same
  token is read-only, so a real (non-dry) run cannot push its branch yet. The push needs its own narrowly scoped credential
  in a step no agent reaches. That is an owner decision.
- Pinning a Coolify app to a commit uses `PATCH /api/v1/applications/<uuid>` with `git_commit_sha`. The field exists on the
  Application model in Coolify's OpenAPI, but the docs do not show the update endpoint accepting it. If a Coolify version
  refuses it, the deploy step stops at "pin" and nothing is deployed. Either way the BUILD_SHA check is the proof.
