# ADR-001 — Constitutional Consequence-Aware Decision Upgrade

**ID:** ADR-001
**Date:** 2026-07-21
**Consequence Level:** HIGH
**Status:** approved
**Author:** Antigravity / Vibe Engineering Governance Architect
**Approver:** Studio Owner (Bambu / Pauli Effect)

---

## Summary

Install system-wide consequence-aware decision making across the Vibe Engineering
governance stack. Every material decision must now be evaluated not only for
whether it solves the immediate problem, but for what system it creates, whether
it is reversible, and what successors will inherit.

---

## Context

The existing Vibe Engineering governance is structurally sound. It verifies
whether an implementation is correct, specifies work rigorously, and enforces
sovereignty. What it lacked is an explicit doctrine that forces every decision
to also ask: *what system does this create?*

Without this, two failure modes are possible even in a well-governed system:

1. Local optimization: agents complete tickets correctly while accumulating
   technical debt that degrades system-level quality over time.
2. Invisible patterns: decisions that work today are repeated without scrutiny,
   normalizing weak patterns at scale.

The constitutional upgrade installs the missing doctrine without replacing the
existing governance that works.

---

## Options Considered

### Option A — Minimal patch: add a sentence to STUDIO-SYSTEM-PROMPT.md
**Pros:** Fast, minimal surface.
**Cons:** A sentence is not constitutional. It will not propagate to agent
prompts, factory roles, PR templates, or CI. It will be forgotten under context
compression.
**Rejected.**

### Option B — New standalone document with no cross-file integration
**Pros:** Clean isolation.
**Cons:** Not referenced by any agent prompt or factory role. Will not actually
change behavior.
**Rejected.**

### Option C — Full constitutional upgrade with single-source doctrine (chosen)
**Pros:** Consequence Doctrine in one canonical file. All operating files
reference it. No duplication. Propagates to council roles, judge schema, PR
template, and ADR bootstrap.
**Cons:** More files modified. More surface area.
**Accepted.** The surface area is required for the doctrine to have teeth.

---

## Decision Rationale

A governance upgrade that does not propagate to the tools agents actually read
(prompts, factory roles, PR templates) will not change behavior. Constitutional
rules must live in the materials that are actively consulted. A single canonical
source (`CONSEQUENCE_DOCTRINE.md`) prevents duplication while a targeted
extension of each active file ensures the doctrine is encountered during normal
work.

---

## Impact Graph

**Direct effects:**
- Five files modified: STUDIO-SYSTEM-PROMPT.md, GOVERNANCE.md, agent prompt,
  builder prompt, reviewer-judge prompt
- Five files created: CONSEQUENCE_DOCTRINE.md, DECISION_SYSTEM_CURRENT_STATE.md,
  DECISION_CONTRACT.yaml, this ADR, PR template

**Second-order effects:**
- Future agents will classify decisions before executing
- PRs will require consequence level for MEDIUM/HIGH changes
- Judge schema will include system-impact gate
- DECISIONS/ directory now exists and will accumulate institutional memory

**Third-order effects:**
- Over time, the decision record corpus becomes a learning asset
- Consequence patterns become visible in retrospectives
- New agents onboarding to the repo encounter the doctrine before substantial work

**Reversibility:** Full — all changes are additive text changes. Git reverts
cleanly. No migrations, no schema changes, no infrastructure.

**Inheritors:** All future agents operating on any Vibe Engineering repository;
studio owner and studio team; client-facing project agents.

---

## Future-State Test

**Question:** Six months from now, if something fails at the worst possible time,
would a new engineer understand what was built, why, and how to recover?

**Answer:** Yes.

**Justification:** This ADR documents the decision. The CONSEQUENCE_DOCTRINE.md
documents the law. The DECISION_SYSTEM_CURRENT_STATE.md documents the baseline.
A new engineer reads AGENTS.md → finds STUDIO-SYSTEM-PROMPT.md → finds
CONSEQUENCE_DOCTRINE.md → reads this ADR → has full context.

---

## Council Reviews

### Architect
**Result:** PASS
**Findings:** Single-source doctrine prevents duplication drift. Cross-file
integration is minimal and surgical. No existing rules deleted. The DECISIONS/
bootstrap is long-overdue — it was already referenced in the root policy.

### Sovereignty Guardian
**Result:** PASS
**Findings:** No new dependencies. No infrastructure. No cost. Owner retains
full control. Fully reversible.

### Breaker
**Result:** PASS_WITH_NOTES
**Findings:** Risk of doctrine becoming shelfware if agents are not tested
against it.
**Required actions:** Add at least one scenario-based test (see VERIFY section).

---

## Human Approval

**Required:** Yes (HIGH consequence)
**Approved by:** Studio Owner (Bambu)
**Approval evidence:** User explicitly requested this constitutional upgrade and
approved the implementation plan artifact via review policy.

---

## Rollback

**Strategy:** `git revert` of the upgrade commits.
**Rollback point:** Git commit immediately before first governance file modification.
**Recovery time:** < 5 minutes.
**Recovery owner:** Studio owner or any agent with write access.

---

## Sovereignty Check

- Owner retains full control: ✅
- Lock-in disclosed: N/A — no new dependencies
- Export path documented: N/A — documentation only

---

## Files Changed by This Decision

| File | Action | Reason |
|---|---|---|
| `docs/governance/CONSEQUENCE_DOCTRINE.md` | NEW | Canonical single source for the three laws |
| `docs/governance/DECISION_SYSTEM_CURRENT_STATE.md` | NEW | Pre-upgrade baseline |
| `docs/governance/DECISION_CONTRACT.yaml` | NEW | Machine-readable decision schema |
| `DECISIONS/ADR-001-constitutional-consequence-upgrade.md` | NEW | This record |
| `.github/pull_request_template.md` | NEW | Consequence classification at PR time |
| `docs/STUDIO-SYSTEM-PROMPT.md` | MODIFIED | Add laws, classification, new Council roles, Judge gate |
| `docs/GOVERNANCE.md` | MODIFIED | Add missing Council roles + Consequence Classification |
| `prompts/VIBE-ENGINEERING-AGENT-SYSTEM-PROMPT.md` | MODIFIED | Add laws to non-negotiables, classify in UNDERSTAND, extend Council and Judge |
| `factory/builder-prompt.md` | MODIFIED | Add arch-decision stop-condition |
| `factory/reviewer-judge-prompt.md` | MODIFIED | Extend Judge JSON schema |

---

## System Impact Summary

Installs consequence-aware decision making as a constitutional layer without
altering existing correct behavior. Agents building correctly under the old
governance will continue to pass. Agents making low-quality shortcuts will now
encounter stop conditions earlier.

## Second-Order Risks Accepted

- Governance documents grow in length; mitigated by single-source doctrine
- Agents may over-classify as HIGH to avoid judgment calls; mitigated by
  classification examples in CONSEQUENCE_DOCTRINE.md
