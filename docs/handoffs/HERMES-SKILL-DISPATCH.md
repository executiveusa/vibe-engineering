# Hermes handoff — ICM workflow dispatcher and independent review

Status: **SERVER INTEGRATION NOT EXECUTED**. Do not claim the Vibe website is an active job runner. This is a bounded instruction packet for an authorized server agent.

## Inspect first

- Canonical repository: https://github.com/executiveusa/vibe-engineering
- Candidate: https://github.com/executiveusa/vibe-engineering/pull/84
- House: `skills/vibe-engineering/SKILL.md`
- ICM: `AGENTS.md` -> `ICMR.yaml` -> `CONTEXT.md`
- Workflows: `skills/workflows/INDEX.md` and `skills/workflows/registry.json`
- Pure router: `src/workflows/skill-router.mjs`
- Automatic OCR gate: `src/journey/automatic-gates.mjs` at `05-review`
- Authorized completion helper: `runCompletionReview()` from `src/workflows/skill-router.mjs`
- Read-only public API: `/api/v1/workflow-router`

## Job

Integrate the **existing** Hermes/Instinct orchestration and ICM run record with this router. Do not create a new dispatcher, another memory database, duplicated workflow definitions, an unapproved webhook, an always-on service, or an independent Judge. Existing agent command/workflow definitions and credentials stay under the owner's control.

1. Inspect Hermes's real installed services, agent runtime, model providers, review worker queue, authentication and existing GitHub integration. Record exact versions and test a read-only health check. Do not ask the owner for already-known configuration or print secrets.
2. Accept a governed work packet with `repo`, `candidate SHA`, `ICMR form`, current stage, user outcome and receipt location. Use `routeWorkflow()` to select **one** workflow and at most the relevant step sources. Never import all 21 local skill files or 22 external sources into one model context.
3. On code completion, freeze the candidate SHA and invoke the existing OpenCodeReview automatic review gate through `runCompletionReview()` or an equivalent isolated executor, with pinned source and explicit model cost authorization. Review must fail closed if OCR is missing, unconfigured, or reports unresolved findings.
4. Choose a **different model family** from the builder for Council review. Use the owner's existing allowed providers; if none is selected/available, return `PICK_REVIEW_MODEL` to the website/UI or human and hold. A different prompt on the same model is not independent approval.
5. Dispatch an isolated reviewer with the exact candidate, relevant ICM stage contract, acceptance tests, real browser journey evidence and rollback. Apply security, correctness, injection, accessibility/UX and whole-system checks proportionately. Use Lauren Tan's feature inventory pattern for end-to-end journeys; do not assume its sample browser driver is available. Do not grant reviewer write or deploy permissions.
6. Save the actual review receipt under the project ICM PROOF location. Include candidate SHA, builder/reviewer model IDs and families, source/skill versions, review findings with file/line/evidence, OCR run result, user-journey evidence and severity, outstanding risk, timestamps, cost, and exact action required. An orchestration dispatch acknowledgement is not a review receipt.
7. Run final `project-review` independently **after repairs**, then feed Council and Judge. Only the authorized Judge/owner can approve release; hard-stop failures or missing proof = HOLD. Never auto-merge or auto-deploy this PR.
8. Verify through an isolated test repository and representative app journey. Capture both passing and deliberately failing cases: unknown workflow, quarantined source, missing token, no separate model, failed OCR, stale commit, missing external dependency, bad user journey, and rollback. Do not touch production until a separately authorized release is reviewed.

## Proof of completion

- End-to-end run from an actual job to an ICM receipt, showing only required skill instructions loaded at the relevant step.
- A real OCR artifact for the exact candidate and a fresh separate-model Council review.
- No credentials in logs or model prompts; no unapproved spend.
- Repeatable regression tests and a browser walkthrough.
- A dry-run HOLD result for missing reviewer/credentials and demonstration that a builder cannot self-approve.
- Named rollback that restores previous server wiring.

If the agent cannot access Hermes's server or a configured second model, report those blockers explicitly, preserve the branch/receipts, and stop before release. No claims of installation, dispatch or production verification without evidence.
