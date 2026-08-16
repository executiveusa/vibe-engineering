# Stage 03 — Build

## Inputs

- Layer 4: `../02_blueprint/output/`.
- Layer 3: `../../references/ENGINEERING-WORKFLOW.md`.
- Current approved phase directive.
- Repository-local conventions and tests.
- Existing A2A contracts when agent roles are used.

## Process

Implement one approved, independently verifiable slice. Capture the baseline, work on an isolated branch, make the smallest change, add or update tests, and preserve rollback. Do not broaden scope because unrelated defects are visible.

Before implementation, route the slice through the applicable skills in the mandatory engineering workflow. Use the canonical `DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP` procedure without replacing ICM authority, approved scope, Council, or Judge gates.

For brownfield work, prove the baseline and blast radius before changing code. For greenfield work, do not build until the user/problem/scope/architecture/specification/tickets are approved.

## Outputs

- `phase-receipt.md` -> `output/`
- `change-map.md` -> `output/`
- `test-plan.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

No routine pause is required after an approved blueprint unless a hard blocker, new consequence, or prohibited-scope decision appears.

## Plain-language proof

Explain what changed, what was deliberately left alone, and which visible behavior should now be different.
