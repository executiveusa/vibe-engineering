# OPERATING CONTRACT — RETRY & RECOVERY POLICY

## Five-Attempt Repair Law

When Builder encounters mechanical failures (CI, test, build, lint, merge conflict), Builder is granted up to **5 meaningful attempts** per failure class.

### Meaningful Retry Criteria
Each attempt MUST include at least one of:
- New diagnostic evidence (log analysis)
- New hypotheses regarding root cause
- Targeted code or configuration fix
- Verification of a transient network/environment issue

*Blindly re-running the exact same failing command without changes DOES NOT count as a meaningful attempt.*

If 5 attempts fail:
Issue a `HARD_BLOCKER` report detailing:
- Failure trace & logs
- Summary of all 5 attempted fixes
- Safe recovery point
- Exact human input required
