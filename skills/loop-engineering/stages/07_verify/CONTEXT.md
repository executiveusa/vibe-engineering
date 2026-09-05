# 07_verify — independently prove the slice

One job: verify in fresh context with the strongest available oracles.

## Inputs
- Working: `SPEC.md`, `GATES.md`, `BUILD-NOTES.md`, changed artifact/revision
- Reference: `_shared/standards/evidence.md`
- Brownfield/release: Full-Stack Wiring Audit when relevant
- Web: mobile + Collins + interaction standards when relevant

## Process
1. Use a fresh reviewer context; do not inherit builder rationale as truth.
2. Re-run every runnable gate against the actual artifact/revision.
3. Exercise failure/error/recovery paths, not only happy path.
4. For UI, capture responsive/browser evidence including mobile; inspect overflow, interaction, keyboard/focus, reduced motion, real wiring.
5. For full-stack controls, trace UI -> handler -> API -> service -> data/executor -> response -> UI result.
6. Mark each gate pass/fail/blocked/stale with evidence. Any changed dependency invalidates dependent evidence.
7. If a gate fails, return the smallest repair set to `06_build`; do not lower the gate.

## Outputs
- Evidence-filled `GATES.md`
- `VERIFY.md`
- `STATE.md` -> `08_gauntlet` only when all slice hard gates pass

## Human check
Review only manual gates that require human judgment; all mechanical oracles are rerun by the verifier.
