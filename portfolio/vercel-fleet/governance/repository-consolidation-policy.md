# Repository Consolidation Policy v1

## Decision

Preserve existing repository boundaries by default. Consolidate, archive, or merge repositories only when repository evidence proves duplication, obsolete scope, unnecessary maintenance burden, elevated failure risk, or avoidable founder attention.

## Classification

Every repository encountered during intake should be classified as one of:

- `CANONICAL_COMPONENT`
- `SHARED_INFRASTRUCTURE`
- `DUPLICATE`
- `OBSOLETE`
- `EXPERIMENT`
- `FORK_UPSTREAM`
- `UNKNOWN`

## Preserve separate boundaries when justified by

- distinct security or credential boundaries;
- distinct deployment or runtime requirements;
- distinct ownership or client responsibility;
- independent product lifecycle;
- reusable shared infrastructure;
- licensing or upstream-fork constraints.

## Consolidate or archive only when evidence shows

- duplicated functionality or overlapping systems;
- duplicate deployments with no distinct production purpose;
- abandoned versions or obsolete branches/repositories;
- overlapping agent systems that increase operating complexity;
- measurable maintenance, cost, reliability, or founder-attention burden that consolidation would reduce.

## Rule

Do not reorganize architecture merely because it looks messy. Preserve working boundaries first. Consolidate only when doing so measurably reduces duplication, operating cost, failure risk, or founder attention.

## Commercial constraint

Repository cleanup is not a commercial outcome by itself. Consolidation work must be tied to revenue, delivery reliability, operating cost, security, or owner capability before implementation is approved.
