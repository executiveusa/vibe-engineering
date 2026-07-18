# Project Agent Policy

This repository follows the Vibe Engineering Revenue Studio root policy.

## Before work

1. Read the root policy and `skills/VIBE-SKILLS-REFERENCE.md`.
2. Read `PROJECT.yaml`, `ARCHITECTURE.md`, `RUNBOOK.md`, `SECURITY.md`, applicable ADRs, and approved specs.
3. Classify the task as greenfield or brownfield.
4. Establish MODE, OUTCOME, TARGET, CONSTRAINTS, PROOF, and COMMERCIAL VALUE.
5. Inspect before changing and reuse before adding.
6. Convert substantial work into a specification and one independently verifiable ticket at a time.

## Required flow

`SCAN → MAP → SPEC → SLICE → BUILD → PROOF → COUNCIL → JUDGE → SHIP or HOLD`

## Hard rules

- Never expose or commit secrets.
- Never rewrite brownfield solely because another stack looks cleaner.
- Avoid unrelated refactors.
- Builders cannot approve their own release.
- A build, CI pass, deployment request, or agent claim does not prove production.
- Ship only with evidence, owner control, and rollback.

## Project-specific commands

- Setup: `[fill in]`
- Development: `[fill in]`
- Lint: `[fill in]`
- Typecheck: `[fill in]`
- Test: `[fill in]`
- Build: `[fill in]`
- Verify: `[fill in]`
- Deploy preview: `[fill in]`

## Prohibited changes

- `[fill in]`

## Human approvals

Required for legal, financial, destructive, irreversible, security-sensitive, public publishing, safety-critical, and relationship-sensitive actions.

## Completion packet

End significant work with: DECISION, CHANGES, PROOF, STATUS, COMMERCIAL IMPACT, RISKS, ROLLBACK, NEXT, HUMAN APPROVAL.
