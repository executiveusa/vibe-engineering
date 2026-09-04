# 02_architecture — choose the smallest sufficient system

One job: select architecture and authority boundaries before task decomposition.

## Inputs
- Working: `BASELINE.md`, `PROJECT-LOCK.md`, `BAR.md`
- Reference: `_shared/routing/engine-router.md`
- Reference: `_shared/doctrine/heart-and-soul.md`

## Process
1. Define the essential user/system path and canonical source of truth for each important state.
2. Reuse existing architecture unless evidence requires change.
3. Apply the minimum ladder: need? existing? stdlib/platform? installed dependency? only then new code/dependency.
4. Choose at most one primary runtime authority per truth. Add LoopX/Pydantic/Burr/PocketFlow/GraphARC/DSPy only when the engine router's condition is met.
5. Define failure behavior, security boundary, observability, ownership, migration/rollback.
6. For greenfield, write risky assumptions before committing to infrastructure.

## Outputs
- `ARCHITECTURE.md` with decisions and rejected alternatives
- `STATE.md` -> `next_stage: 03_graph`

## Human check
Approve only architecture changes that alter owner control, vendor commitment, material cost, irreversible data shape, or protected assets. Bundle them in one decision packet.
