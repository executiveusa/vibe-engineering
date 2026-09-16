# Stage 07 — Ship / Release

One job: release the approved work reversibly, with ownership and live proof.

## Inputs

- Layer 4: `../06_judge/output/`.
- Layer 4: `../04_verify/output/rights-and-provenance-check.md` when present.
- Verified release candidate and deployment configuration.
- Ownership, access, backup, monitoring, and rollback records.
- Layer 3: `../../references/SOURCE_PROVENANCE.md`.
- Layer 3: `../../shared/OWNERSHIP_RETENTION_STANDARD.md`.
- Layer 3: `../../references/MISSION-V2-MOBILE-FIRST-SITE-PROOF.md` for every website/web app release.

## Process

1. For a website or web app, run the full owner-supplied MISSION v2 contract as the final product gate. Require all operating work-log fields, an explicit content policy, the applicable proof matrix, classified `UNVERIFIED` items, independent score >=8.5 with no P0/P1, exact-candidate evidence, and rollback. Write `docs/evidence/mission-v2-release.json`. Non-web software must write an exact-candidate `NOT_APPLICABLE` receipt with a specific reason.
2. Run `factory:ship-gate` on the exact candidate. It must confirm pinned Open Code Review PASS on that candidate, cold ICM walk PASS, independent review PASS, and Judge SHIP. Any missing or stale receipt is HOLD.
3. Prepare a reversible release. Verify destination, branch, environment, domains, data ownership, credentials ownership, monitoring, backup, rollback command, and post-release checks.
4. Confirm that every public third-party asset has the required rights/attribution record. Remove or replace any `UNVERIFIED` distribution asset before release rather than weakening the gate.
5. Create `production-verification.md` with status `NOT VERIFIED` before release.
6. After the authorized human approves and the release occurs, run live target-environment checks and record the evidence. Only then may production verification change to `VERIFIED`.
7. Confirm the ownership receipt: another competent builder or agent can find the code, configuration, accounts, data/export path, monitoring, and rollback without reconstructing them from chat.
8. Local, scaffold, build, review, merge, preview creation, and CI results are not production verification.

## Outputs

- `release-plan.md` -> `output/`
- `mission-v2-release.json` -> `../../docs/evidence/` — final website/web-app release contract, or exact-candidate `NOT_APPLICABLE` for non-web software
- `ownership-receipt.md` -> `output/`
- `rights-release-receipt.md` -> `output/` when third-party distributable material exists
- `rollback-receipt.md` -> `output/`
- `production-verification.md` -> `output/` — starts `NOT VERIFIED`; may become `VERIFIED` only after authorized release and successful live target checks.
- `plain-language-summary.md` -> `output/`

## Human gate

The authorized human separately approves production release and any legal, financial, safety, medical, destructive, public-commitment, or rights-sensitive action. Approval permits the action; it does not itself prove production health.

## Plain-language proof

Before release, say `NOT VERIFIED`. For web software, include the MISSION v2 decision, declared content policy, proof-matrix status, and every `UNVERIFIED` item with its handling. After release, state where the product is live, which live checks passed, which public assets are rights-cleared, who owns every important account and key, how health is watched, and exactly how to undo the release.