# OPERATING CONTRACT — DECISION CONTRACT

All material architectural and technical decisions made during workflow execution MUST comply with the Vibe Engineering Consequence Law.

## Reference Authority

Canonical doctrine: [`docs/governance/CONSEQUENCE_DOCTRINE.md`](../../docs/governance/CONSEQUENCE_DOCTRINE.md)  
Decision contract schema: [`docs/governance/DECISION_CONTRACT.yaml`](../../docs/governance/DECISION_CONTRACT.yaml)

## Core Consequence Test

> What system exists if this decision becomes the default?

## Mandatory Fields by Consequence Level

- **LOW:** Objective, changes, verification.
- **MEDIUM:** + System impact graph, 1st & 2nd order risks, rollback plan.
- **HIGH:** + Future-State Test, alternative evaluations, formal ADR in `DECISIONS/`, Council review.
