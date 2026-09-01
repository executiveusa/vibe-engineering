# Stage 04 — Verify / Prove

One job: test the claims against the actual artifact and actual environment available at this stage.

## Inputs

- Layer 4: `../03_build/output/`.
- Layer 4: `../02_blueprint/output/reference-bar.md` when present.
- Layer 4: `../02_blueprint/output/design-contract.md` when present.
- Actual code diff, product artifact, and repository state.
- Layer 3: `../../_config/quality-gates.yaml`.
- Layer 3: `../../references/ENGINEERING-WORKFLOW.md`.
- Layer 3: `../../references/SOURCE_PROVENANCE.md`.
- Layer 3: `../../shared/HEART_AND_SOUL_STANDARD.md` for user-facing product or experience work.
- Layer 3: `../../shared/SUBTRACTION_GAUNTLET_STANDARD.md` for user-facing product or experience work.
- Layer 3: `../../shared/NO_SLOP_STANDARD.md`.
- Layer 3: `../../shared/REFERENCE_BAR_STANDARD.md` when comparative quality matters.
- Native test, build, security, accessibility, browser, and deployment commands.

## Process

1. Run the repository's declared checks and the applicable verification/review skills from the mandatory engineering workflow.
2. Use browser/runtime evidence for browser products, security review for sensitive surfaces, and measurement before performance optimization.
3. Run the no-slop check on every changed user-facing or architectural surface. A detector finding is evidence to inspect, not an automatic rewrite order.
4. For user-facing work, run the Subtraction Gauntlet against the actual artifact. Classify material elements as KEEP, MERGE, INFER, DEFER, MOVE, or REMOVE. Require the critic to name the protected quality that stops further subtraction.
5. When a reference bar exists, use a fresh reviewer to inspect the actual output next to the real reference and name the largest remaining gap. Do not let the builder perform the only comparison.
6. Verify the seven Heart & Soul lenses where applicable: human outcome; hierarchy; journey; visual identity; motion/emotion; responsive/accessibility system; trust/proof/sovereignty.
7. Verify source/provenance and media rights requirements that affect distribution. Missing required rights remain `UNVERIFIED` and block publication of that material.
8. Record every finding as fixed, accepted with owner and reason, false positive with proof, or blocked.
9. Separate native checks from live production proof. Passing CI or a production build is evidence for those checks only; it is not live-production proof.

## Outputs

- `verification-report.md` -> `output/`
- `code-review-findings.md` -> `output/`
- `no-slop-review.md` -> `output/`
- `subtraction-review.md` -> `output/` for user-facing or taste-sensitive work
- `reference-comparison.md` -> `output/` when a reference bar exists
- `rights-and-provenance-check.md` -> `output/` when third-party material affects distribution
- `evidence-index.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

Critical findings and unresolved high findings block progression. The builder cannot approve its own implementation or be the sole taste critic. A Subtraction Gauntlet `HOLD` blocks progression; `REVISE` requires bounded correction or authorized disposition. Missing distribution rights block the affected public asset even when the rest of the release may proceed without it.

## Plain-language proof

Separate “the code compiled” from “the product works.” State exactly what was tested, what was removed or retained and why, what was compared, what was rights-cleared, what failed, what quality prevents further subtraction, and what still needs a real person or live target environment.