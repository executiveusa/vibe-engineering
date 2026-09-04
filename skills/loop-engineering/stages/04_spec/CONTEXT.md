# 04_spec — make the next slice executable

One job: turn the first/next graph slice into precise acceptance criteria.

## Inputs
- Working: `GRAPH.md`, `BAR.md`, `PROJECT-LOCK.md`, `ARCHITECTURE.md`
- Reference: `_shared/routing/skill-router.md`
- Web when triggered: Collins + Heart/Soul + mobile standards

## Process
1. Specify one smallest valuable vertical slice: entry -> action -> result -> error/recovery -> evidence.
2. State exact content/data/contracts, responsive behavior, states, accessibility, performance, analytics, security, ownership, deployment and rollback requirements that apply.
3. Define gates before implementation. Each gate has a falsifiable oracle and expected result.
4. Route specialist references only for this slice (SEO, interaction, copy, wiring, etc.).
5. Reject vague criteria such as 'premium', 'clean', or 'works'.

## Outputs
- `SPEC.md`
- `GATES.md`
- `STATE.md` -> `next_stage: 05_slice`

## Human check
If the spec changes the approved offer, primary action, protected copy/assets, or irreversible system contract, ask once. Otherwise proceed.
