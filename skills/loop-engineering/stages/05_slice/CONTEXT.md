# 05_slice — prepare an isolated reversible change

One job: make the next build bounded, owned, and rollback-safe.

## Inputs
- Working: `SPEC.md`, `GATES.md`, `GRAPH.md`, `ROLLBACK.md`

## Process
1. Bind the slice to explicit files/resources and current base revision.
2. Record the rollback target before edits.
3. Choose isolated branch/worktree/sandbox when parallel work or blast radius warrants it.
4. Confirm all required inputs exist and no protected asset will be silently changed.
5. Mark only the slice's graph nodes ready.

## Outputs
- Updated `ROLLBACK.md`
- Slice section in `STATE.md`
- `STATE.md` -> `next_stage: 06_build`

## Human check
No routine approval. Stop only if rollback is impossible or the change crosses a previously unapproved consequential boundary.
