# Stage 03 — Build / Make

One job: implement one approved, independently verifiable slice.

## Inputs

- Layer 4: `../02_blueprint/output/product-spec.md`.
- Layer 4: `../02_blueprint/output/architecture-map.md`.
- Layer 4: `../02_blueprint/output/risk-and-rollback.md`.
- Layer 4: `../02_blueprint/output/phase-plan.md`.
- Layer 4: `../02_blueprint/output/reference-bar.md` when present.
- Layer 3: `../../references/ENGINEERING-WORKFLOW.md`.
- Layer 3: `../../shared/VIBE_DECISION_STANDARD.md`.
- Layer 3: `../../shared/NO_SLOP_STANDARD.md`.
- Current approved phase directive, repository-local conventions, and tests.
- Existing A2A contracts when agent roles are used.

Do NOT load discarded Blueprint candidates unless new evidence formally reopens the decision.

## Process

1. Capture the current rollback point and blast radius; work on an isolated branch or equivalent safe surface.
2. Route the slice through the applicable skills in the mandatory `DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP` engineering procedure. Do not invoke extra skills merely to create activity.
3. Implement the smallest complete vertical slice. Reuse before adding. Preserve existing brownfield behavior outside the approved change.
4. Add or update tests proportional to risk and handle expected failure explicitly.
5. Check the changed surface against the no-slop standard: every material choice should trace to intent, repository convention, approved reference, or evidence rather than model habit.
6. Do not broaden scope because unrelated defects, new ideas, or prettier architectures become visible. New consequence returns to governance.

## Outputs

- `phase-receipt.md` -> `output/`
- `change-map.md` -> `output/`
- `test-plan.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

No routine pause is required after an approved blueprint unless a hard blocker, new consequence, rights question, cost boundary, or prohibited-scope decision appears.

## Plain-language proof

Explain what changed, what was deliberately left alone, why the important choices exist, and which visible behavior should now be different.