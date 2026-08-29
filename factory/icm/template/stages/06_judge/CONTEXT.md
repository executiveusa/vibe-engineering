# Stage 06 — Judge / Decide

One job: decide whether the verified work deserves to move to release preparation.

## Inputs

- Layer 4: `../00_intake/output/project-contract.md`.
- Layer 4: `../02_blueprint/output/product-spec.md`.
- Layer 4: `../04_verify/output/`.
- Layer 4: `../05_council/output/`.
- Layer 3: `../../_config/quality-gates.yaml`.
- Layer 3: `../../shared/VIBE_DECISION_STANDARD.md`.
- Approved consequence decisions and unresolved dispositions.

## Process

1. Re-read the original Intent → Standard → Evidence contract before looking at the builder's confidence or effort.
2. Score user value, architecture, reliability, security, accessibility/taste, ownership, rollback, evidence, and commercial alignment.
3. Apply hard stops before averaging. Security, reliability, ownership, missing required rights, missing rollback, and missing target evidence cannot be hidden by strong visual or implementation scores.
4. Treat unresolved Council HOLDs and missing proof as blockers until new evidence or authorized disposition exists.
5. Return only SHIP or HOLD. Do not change the work being judged and do not invent missing evidence.

## Outputs

- `judge-report.md` -> `output/`
- `scorecard.json` -> `output/`
- `release-decision.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

A Judge `SHIP` verdict permits release preparation, not automatic production release. Required human approvals remain explicit.

## Plain-language proof

Give the score, the weak points, the hard stops, the weakest claim, and the exact evidence that justifies SHIP or requires HOLD.