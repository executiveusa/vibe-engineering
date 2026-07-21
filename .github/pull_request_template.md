# Pull Request

## What this changes

<!-- One paragraph: what problem does this solve, and what specifically changed. -->

## Consequence classification

<!-- LOW | MEDIUM | HIGH — see docs/governance/CONSEQUENCE_DOCTRINE.md -->

**Level:** <!-- LOW / MEDIUM / HIGH -->

<!-- For MEDIUM and HIGH, complete the fields below.
     For LOW, delete everything below this line and submit. -->

---

## Impact graph (MEDIUM and HIGH)

**Direct effects:**
<!-- What changes immediately in the system. -->

**Second-order effects:**
<!-- What this makes easier, harder, or necessary next. -->

**Reversibility:** <!-- full / partial / irreversible -->

**Rollback point:**
<!-- Exact commit hash, tag, or procedure to recover if this causes problems. -->

---

## Council reviews (HIGH only)

<!-- For HIGH-consequence changes, at least Architect + one additional Council
     role must review before merge. Paste their PASS / FAIL + findings below. -->

| Role | Result | Key finding |
|---|---|---|
| Architect | | |
| | | |

---

## Evidence

<!-- Link to test output, build logs, screenshots, or evidence docs.
     "I ran it locally" is not evidence. -->

- [ ] `npm test` passes — [link or output]
- [ ] `npm run build` passes — [link or output]
- [ ] Lint / typecheck passes
- [ ] Browser smoke test (if UI changed)
- [ ] ADR filed in `DECISIONS/` (for MEDIUM and HIGH)

## Human approval required?

<!-- List any actions that require owner authority: financial, legal, destructive,
     publishing, security-sensitive, irreversible. -->

- [ ] None required
- [ ] Required — approved by: <!-- name / date -->

## Related

- Issue: #
- ADR: ADR-
- Spec: docs/specs/
