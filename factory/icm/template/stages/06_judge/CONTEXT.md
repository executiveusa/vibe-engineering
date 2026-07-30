# Stage 06 — Judge

## Inputs

- Layer 4: `../04_verify/output/`.
- Layer 4: `../05_council/output/`.
- Layer 3: `../../_config/quality-gates.yaml`.
- Approved product specification and consequence decisions.

## Process

Score user value, architecture, reliability, security, accessibility/taste, ownership, rollback, evidence, and commercial alignment. Apply hard stops. Return SHIP, HOLD, or BLOCKED without changing the work being judged.

## Outputs

- `judge-report.md` -> `output/`
- `scorecard.json` -> `output/`
- `release-decision.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

A Judge pass permits release preparation, not automatic production release. Required human approvals remain explicit.

## Plain-language proof

Give the score, the weak points, the hard stops, and the exact reason the product deserves to move forward or must stop.
