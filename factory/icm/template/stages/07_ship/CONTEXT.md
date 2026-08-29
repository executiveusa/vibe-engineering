# Stage 07 — Ship / Release

One job: release the approved work reversibly, with ownership and live proof.

## Inputs

- Layer 4: `../06_judge/output/`.
- Layer 4: `../04_verify/output/rights-and-provenance-check.md` when present.
- Verified release candidate and deployment configuration.
- Ownership, access, backup, monitoring, and rollback records.
- Layer 3: `../../references/SOURCE_PROVENANCE.md`.
- Layer 3: `../../shared/OWNERSHIP_RETENTION_STANDARD.md`.

## Process

1. Prepare a reversible release. Verify destination, branch, environment, domains, data ownership, credentials ownership, monitoring, backup, rollback command, and post-release checks.
2. Confirm that every public third-party asset has the required rights/attribution record. Remove or replace any `UNVERIFIED` distribution asset before release rather than weakening the gate.
3. Create `production-verification.md` with status `NOT VERIFIED` before release.
4. After the authorized human approves and the release occurs, run live target-environment checks and record the evidence. Only then may production verification change to `VERIFIED`.
5. Confirm the ownership receipt: another competent builder or agent can find the code, configuration, accounts, data/export path, monitoring, and rollback without reconstructing them from chat.
6. Local, scaffold, build, review, merge, preview creation, and CI results are not production verification.

## Outputs

- `release-plan.md` -> `output/`
- `ownership-receipt.md` -> `output/`
- `rights-release-receipt.md` -> `output/` when third-party distributable material exists
- `rollback-receipt.md` -> `output/`
- `production-verification.md` -> `output/` — starts `NOT VERIFIED`; may become `VERIFIED` only after authorized release and successful live target checks.
- `plain-language-summary.md` -> `output/`

## Human gate

The authorized human separately approves production release and any legal, financial, safety, medical, destructive, public-commitment, or rights-sensitive action. Approval permits the action; it does not itself prove production health.

## Plain-language proof

Before release, say `NOT VERIFIED`. After release, state where the product is live, which live checks passed, which public assets are rights-cleared, who owns every important account and key, how health is watched, and exactly how to undo the release.