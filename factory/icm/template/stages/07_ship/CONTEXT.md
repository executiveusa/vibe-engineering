# Stage 07 — Ship

## Inputs

- Layer 4: `../06_judge/output/`.
- Verified release candidate and deployment configuration.
- Ownership, access, backup, and rollback records.

## Process

Prepare a reversible release. Verify destination, branch, environment, domains, data ownership, credentials ownership, monitoring, backup, rollback command, and post-release checks. Do not equate merge with production.

## Outputs

- `release-plan.md` -> `output/`
- `ownership-receipt.md` -> `output/`
- `rollback-receipt.md` -> `output/`
- `production-verification.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

The authorized human approves production release and any legal, financial, safety, medical, destructive, or public commitment.

## Plain-language proof

State where the product is live, who owns every important account and key, how health is checked, and the exact steps to undo the release.
