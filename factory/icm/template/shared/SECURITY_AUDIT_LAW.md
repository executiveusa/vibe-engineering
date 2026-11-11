# Security audit law (G15)

**Law.** No app ships without a security audit receipt for the exact commit being shipped. No receipt, or a stale one, is an automatic HOLD.

Ordered as law for vibe-engineering and the software factory by the owner on 2026-10-09. Source: the Oct 5 Nick Automates short "Free AI skill finds and fixes security holes in your vibe coded apps", which demonstrates Cloudflare's MIT `security-audit` skill. The skill is vendored and pinned in this repo (`factory/vendor/security-audit-skill/`, upstream commit `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`) and registered in the agent-skills arsenal. The basic gate (G15) merged 2026-10-06 in PR #69; this document expands it to the full law.

## The six phases

All six are required, in order:

1. **RECON** — parallel agents map architecture, trust boundaries, and input surfaces.
2. **HUNT** — parallel agents attack: injection, access control, business logic, crypto, feature abuse, chained attacks, wildcard. AI apps also get prompt-injection hunted.
3. **VALIDATE** — a separate agent whose only job is to DISPROVE each finding. Only survivors count.
4. **REPORT** — human-readable report plus traces for MEDIUM and up, every issue with its fix.
5. **STRUCTURED OUTPUT** — `findings.json` that passes the schema validator.
6. **INDEPENDENT VERIFICATION** — fresh agents check every claim against the actual source.

## The rules

- **R1.** Only report what is exploitable. "Could theoretically" is not a finding.
- **R2.** Severity = likelihood x impact. A missing second layer when the first blocks it is a hardening note, not a vulnerability.
- **R3.** No self-audit. The auditor is never the builder, never the judge; the finder never validates.
- **R4.** One run catches about half. Every release gets at least 2 runs; the second run targets gaps.
- **R5.** Exact-SHA receipt. A mismatch is a HOLD; fail closed.
- **R6.** Pass = zero confirmed CRITICAL or HIGH findings. MEDIUM and above must be FIXED or WAIVED, and a waiver needs the owner's words, not agent judgment.
- **R7.** Nothing auto-fixes. The audit reports; the owner approves changes. No attacks on production; sandbox only.
- **R8.** Rejected findings stay in the record, with the reason.
- **R9.** Placement: after the storm drill, before final code review and the Judge. (This keeps the placement already merged with the basic gate on 2026-10-06: after tests, before the Judge's SHIP.)
- **R10.** Install check: the registered skill's `SKILL.md` must list the six phases.

## Receipt mechanics (as enforced)

- The auditor records each run with `scripts/security-audit-gate.mjs`, which writes `docs/evidence/security-audit.json`.
- The receipt binds the exact candidate SHA and the findings hash. Two distinct completed audit-run evidence files are required for the exact candidate SHA, each binding its findings file SHA-256, auditor identity, and completion time.
- The final gate re-runs the pinned validator (`factory/vendor/security-audit-skill/`) and derives severity counts and fingerprint disposition coverage from the findings bytes. A claimed run count or a bare receipt assertion never passes.
- Findings must pass the schema validator; `findings.json` is the structured receipt, not prose.
- Sandbox targets only: source/local checks, no production credentials, no live-target attacks.

## Scope

- Applies to every app before it ships, and any time code gets written through the factory.
- Existing apps get audit-only runs first, non-blocking, until the owner says otherwise. New ships cannot go out without a pass.
