# ICM skill routing and independent review

Status: candidate integration. This does not replace House Skill, ICMR, or existing stage gates.

## Authority and lazy load

One House: skills/vibe-engineering/SKILL.md. One ICM entry: AGENTS.md → ICMR.yaml → CONTEXT.md. One metadata registry: skills/workflows/registry.json.

Existing src/skills/index.mjs remains the procedure catalog. Existing skills/workflows/w*/WORKFLOW.md files remain the detailed workflows. The registry links them but does not flatten third-party skills or create an alternate methodology.

| Layer | Content | Load |
| --- | --- | --- |
| 0 | AGENTS.md, owner and authority | Always |
| Step 0 | ICMR.yaml, topology and roles | Always |
| 1 | CONTEXT.md, current slice and next action | Always |
| 2 | Current stage contract + selected WORKFLOW.md | Once selected |
| 3 | Current step SKILL.md, vetted tool docs or reference | At that step only |
| 4 | Evidence, tests, reviews, Judge receipts | After real work |

The router takes task, current stage, optional explicit workflow, changed files, candidate and builder/reviewer models. Explicit workflow wins. Otherwise task match wins over a generic stage; ICM stage resolves ambiguity. Return one workflow, its steps and no more than three optional specialist references. Do not execute external sources during routing.

## Workflow map

| Workflow | ICM placement | Primary capability |
| --- | --- | --- |
| W1 Intake to spec | INTENT, SPEC | grill, spec, tickets |
| W2 Plan and build | PLAN, BUILD | Pauli engineering library, tests, deep-work |
| W3 Proof and independent review | PROOF, COUNCIL, JUDGE | OpenCodeReview, browser journeys, UXAudit |
| W4 Ship and operate | SHIP, OPERATE | exact revision, owner authority, rollback |
| W5 Web design | SPEC, BUILD, PROOF | Inspo/Refero, Taste, mobile UX |
| W6 Copy and voice | SPEC, BUILD, PROOF | Human Voice, anti-slop, fact checking |
| W7 Research and skill sourcing | INTENT, SPEC, PLAN | research, version/license/security review |
| W8 Media generation | SPEC, BUILD, PROOF | selected media engine, rights and evidence |
| W9 Decks and documents | SPEC, BUILD, PROOF | format-specific builder, rendered proof |

W3 remains a mandatory cross-cutting review gate for material work; W5/W6/W8/W9 supply specialist steps within the single canonical lifecycle.

The registry retains original upstream URLs (22 sources). It marks them canonical, optional, reference, project-only, unavailable or quarantined. Existing full source capability remains available at the original location when needed and authorized. Impeccable is quarantined pending risk review, design-ui-ux is inaccessible pending verification, and GSAP/cinematic components are project-scoped libraries. Lauren Tan verification repo is an example, not a runnable driver.

## Entry points

- Filesystem: read skills/workflows/INDEX.md, choose a single workflow, then read only the current step source.
- Website: /#skill-desk shows one workflow, source links, tools, next steps, and a copyable agent handoff; it performs no code or model execution.
- API: GET /api/v1/workflow-router exposes the nine metadata entries; POST /api/v1/workflow-router returns a non-executing one-workflow packet.
- Hermes: wire the pure routeWorkflow and dispatchIndependentReview helpers into an authorized orchestrator adapter. Without a real adapter, dispatch is pending and no review is claimed.

## Review dispatch

1. Freeze the exact candidate and record a rollback.
2. The EXISTING ICM 05-review automatic gate (src/journey/automatic-gates.mjs) runs OpenCodeReview against the candidate. A routing packet merely advertises the command; status is NOT_EXECUTED.
3. Delegate to an independent agent on a different model family. If none is selected, request user choice; if model independence is unverified, HOLD. A different prompt on the same model is insufficient for the Judge independence requirement.
4. Council inspects bug, security, prompt-injection, usability and claim risks proportionately; all findings cite actual evidence. The final project-review happens last before Judge.
5. Judge returns SHIP or HOLD; it never writes code or bypasses required human approval.

Do not send secrets to subagents. A dispatch request is not a completed review.

## Change contract

MODE: brownfield.
OUTCOME: nine workflows discoverable through one routing registry, context limited to the selected workflow and step, and independent review with truthful execution state.
TARGET: Vibe Engineering public website plus its API and agent filesystem entry.
CONSTRAINTS: preserve hero, header, existing House law and all downstream stage names. Avoid new dependencies.
PROOF: targeted router tests, existing native checks, browser walkthrough and independent cross-model review before merge.
COMMERCIAL VALUE: repeatable, lower-context client delivery; revenue unverified.
OWNER: repo maintainer; merges and production release remain approval-gated.
ROLLBACK: revert the isolated PR. No schemas, secrets or stage contracts are removed.

A passing build or a PR is not production proof.
