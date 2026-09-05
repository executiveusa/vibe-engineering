# 06_build — implement only the admitted slice

One job: build the specified slice with the minimum justified change.

## Inputs
- Working: `SPEC.md`, `GATES.md`, `GRAPH.md`, `ROLLBACK.md`
- Reference: specialist files selected by `_shared/routing/skill-router.md`

## Process
1. Inspect touched code/context before editing.
2. Reuse before adding. Apply the Ponytail ladder without cutting validation, security, accessibility, or recovery.
3. Keep one writer per owned artifact. Parallelize only admitted independent nodes.
4. Run fast local checks while building, but do not mark gates passed from builder self-report.
5. Record exactly what changed and known uncertainties.
6. Stop at the slice boundary; do not opportunistically expand scope.

## Outputs
- Code/artifact changes
- `BUILD-NOTES.md`
- `STATE.md` -> `next_stage: 07_verify`

## Human check
None unless a consequential operation is required. The builder never approves the slice.
