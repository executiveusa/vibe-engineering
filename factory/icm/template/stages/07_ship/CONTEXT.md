# Stage 07 — Ship

## Inputs

- Layer 4: `../06_judge/output/`.
- Verified release candidate and deployment configuration.
- Ownership, access, backup, and rollback records.

## Process

Prepare a reversible release. Verify destination, branch, environment, domains, data ownership, credentials ownership, monitoring, backup, rollback command, and post-release checks. Create `production-verification.md` with status `NOT VERIFIED` before release. After the authorized human approves and the release occurs, run live target-environment checks and record the evidence. Only then may the artifact be changed to `VERIFIED`. Local, scaffold, build, review, merge, and CI results are not production verification.

## Outputs

- `release-plan.md` -> `output/`
- `ownership-receipt.md` -> `output/`
- `rollback-receipt.md` -> `output/`
- `production-verification.md` -> `output/` — starts as `NOT VERIFIED`; may become `VERIFIED` only after authorized release and successful live target checks.
- `plain-language-summary.md` -> `output/`

## Human gate

The authorized human separately approves production release and any legal, financial, safety, medical, destructive, or public commitment. This approval is required before release but does not itself prove production health.

## Plain-language proof

Before release, state `NOT VERIFIED`. After authorized release, state where the product is live, which live checks passed, who owns every important account and key, how health is monitored, and the exact steps to undo the release. Never use local, scaffold, build, review, merge, or CI evidence as a substitute for live production proof.
