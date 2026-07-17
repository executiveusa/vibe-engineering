# Vibe Engineering Governance

## Authority model

The method separates execution from approval.

- **Builder:** plans and implements within the Vibe Spec.
- **Verifier:** gathers evidence and reports uncertainty.
- **Council:** challenges the work through independent roles.
- **Judge:** applies the score and release policy.
- **Human owner:** approves consequential actions and owns the final business decision.

## Council roles

1. Architect — structure and maintainability
2. Breaker — adversarial failure and security
3. Operator — deployment, monitoring, recovery
4. User Advocate — clarity, accessibility, consequences
5. Taste Judge — hierarchy, restraint, finish
6. Sovereignty Steward — custody, consent, export, vendor replacement

A reviewer should not suppress disagreement to create a clean consensus narrative.

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

## Evidence policy

Important claims must be linked to evidence such as test results, build output, screenshots, logs, configuration checks, or source review. Unknown is a valid state. Invented certainty is not.
