# Stage 04 — Verify

## Inputs

- Layer 4: `../03_build/output/`.
- Actual code diff and repository state.
- Layer 3: `../../_config/quality-gates.yaml`.
- Native test, build, security, accessibility, and deployment commands.

## Process

Run the repository's declared checks and the approved OpenCodeReview completion review. Verify claims against evidence. Record every finding as fixed, accepted with owner and reason, false positive with proof, or blocked.

## Outputs

- `verification-report.md` -> `output/`
- `code-review-findings.md` -> `output/`
- `evidence-index.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

Critical findings and unresolved high findings block progression. The builder cannot approve its own implementation.

## Plain-language proof

Separate “the code compiled” from “the product works.” State exactly what was tested, what was not tested, and what still needs a real person or live environment.
