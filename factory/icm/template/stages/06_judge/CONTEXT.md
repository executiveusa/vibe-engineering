# Stage 06 — Judge / Decide

One job: decide whether the verified work deserves to move to release preparation.

## Inputs

- Layer 4: `../00_intake/output/project-contract.md`.
- Layer 4: `../02_blueprint/output/product-spec.md`.
- Layer 4: `../02_blueprint/output/design-contract.md` when present.
- Layer 4: `../04_verify/output/`.
- Layer 4: `../05_council/output/`.
- `../../docs/evidence/open-code-review.json` for the exact candidate.
- `../../docs/evidence/icm-cold-walk.json` produced from a zero-chat-memory root walk.
- `../../docs/evidence/independent-review.json` proving the builder did not approve its own work.
- Layer 3: `../../_config/quality-gates.yaml`.
- Layer 3: `../../shared/VIBE_DECISION_STANDARD.md`.
- Layer 3: `../../shared/HEART_AND_SOUL_STANDARD.md` for user-facing product or experience work.
- Layer 3: `../../shared/SUBTRACTION_GAUNTLET_STANDARD.md` for user-facing product or experience work.
- Approved consequence decisions and unresolved dispositions.

## Process

1. Re-read the original Intent → Standard → Evidence contract before looking at the builder's confidence or effort.
2. Score user value, architecture, reliability, security, accessibility/taste, ownership, rollback, evidence, and commercial alignment.
3. For user-facing work, confirm that subtraction evidence exists, the largest remaining experience gap is dispositioned, and the protected quality that stops further subtraction is connected to the approved design contract.
4. Confirm Open Code Review passed on the exact candidate, the ICM cold walk passed, and the independent reviewer is distinct from the builder. Missing, failing, or stale evidence is a hard HOLD.
5. Apply hard stops before averaging. Security, reliability, accessibility, ownership, missing required rights, missing rollback, unresolved Subtraction Gauntlet HOLD, and missing target evidence cannot be hidden by strong visual or implementation scores.
6. Treat unresolved Council HOLDs and missing proof as blockers until new evidence or authorized disposition exists.
7. Return only SHIP or HOLD. Do not change the work being judged and do not invent missing evidence.

## Outputs

- `judge-report.md` -> `output/`
- `scorecard.json` -> `output/`
- `release-decision.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

A Judge `SHIP` verdict permits release preparation, not automatic production release. Required human approvals remain explicit.

## Plain-language proof

Give the score, the weak points, the hard stops, the largest unresolved experience gap, the weakest claim, and the exact evidence that justifies SHIP or requires HOLD.