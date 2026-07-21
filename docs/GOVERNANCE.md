# Vibe Engineering Governance

## Authority model

The method separates execution from approval.

- **Builder:** plans and implements within the Vibe Spec.
- **Verifier:** gathers evidence and reports uncertainty.
- **Council:** challenges the work through independent roles.
- **Judge:** applies the score and release policy.
- **Human owner:** approves consequential actions and owns the final business decision.

## Council roles

Canonical role names (use exactly as written across all governance documents):

1. **User Advocate** — clarity, accessibility, whether the product solves the intended problem
2. **Architect** — structure, maintainability, boundaries, reuse, data flows
3. **Breaker** — adversarial failure, regressions, abuse cases, edge conditions
4. **Security Guardian** — authentication, authorization, secrets, privacy, tenant isolation
5. **Taste Director** — hierarchy, clarity, brand authenticity, mobile experience, finish
6. **Sovereignty Guardian** — portability, ownership, exportability, lock-in, replacement paths
7. **Operator** — deployment, monitoring, alerting, recovery, and runbook completeness
8. **Systems Steward** — consequence classification, second-order effects, Future-State Test for HIGH decisions
9. **Commercial Steward** — recurring costs, licensing, lock-in disclosure, revenue impact

A reviewer should not suppress disagreement to create a clean consensus narrative.

Not every release requires all nine roles. Required minimum by consequence level:
- LOW: Architect or domain reviewer
- MEDIUM: Architect + one additional role
- HIGH: Architect + Systems Steward + at least two additional roles

## Human approval requirements

Explicit human approval is required before consequential:

- financial transactions,
- legal agreements,
- public claims or publishing,
- destructive production changes,
- credential and permission changes,
- medical, legal, financial, or safety decisions,
- consent representations,
- irreversible actions.

## Consequence classification

Every material decision must carry a consequence level before execution.
See canonical definition in `docs/governance/CONSEQUENCE_DOCTRINE.md`.

| Level | Criteria | Required gate |
|---|---|---|
| LOW | One module, fully reversible, no security/cost/user impact | Standard slice + evidence |
| MEDIUM | Crosses modules, new dependency or API surface | Blast-radius analysis + Architect review |
| HIGH | System boundary crossing, irreversibility, cost, data, security, or commercial obligation | Full Council + Future-State Test + human gate |

## Release states

- **SHIP:** release floor passed and no hard stops remain.
- **HOLD:** current direction is valid, but release blockers remain.
- **REJECT:** direction violates the product contract, safety requirements, consent, or sovereignty principles.

## Rollback policy

A consequential change cannot receive `SHIP` without:

- a known previous state,
- recovery instructions,
- ownership of required credentials,
- confirmation that backups or reversible deployment mechanisms exist.

For HIGH-consequence decisions: the Future-State Test must be answered affirmatively
in writing before execution, and a decision record must exist in `DECISIONS/`.

## Evidence policy

Important claims must be linked to evidence such as test results, build output, screenshots, logs, configuration checks, or source review. Unknown is a valid state. Invented certainty is not.
