# 01_discovery — prove the problem and current truth

One job: establish evidence before architecture or design.

## Inputs
- Working: `PROJECT-LOCK.md`, `BAR.md`
- Reference: `_shared/routing/skill-router.md`
- Greenfield reference when triggered: Proven-Better-New source
- Brownfield reference when triggered: Full-Stack Wiring Audit source

## Process
1. Greenfield: research audience-matched analogs, core mechanics, graveyard cases, buyer language, and smallest atomic tests. Separate instinct from one proposed solution shape.
2. Brownfield: fingerprint stack, run existing checks, map architecture/data/deployment/state ownership, trace promises to runtime, identify fake/static/dead/unsafe paths, record rollback baseline.
3. Record only evidence-supported facts; mark unknowns explicitly.
4. Identify the riskiest assumptions and what evidence would falsify them.

## Outputs
- `BASELINE.md` with evidence and source/revision references
- Project lock updated with discovered constraints/proof requirements
- `STATE.md` -> `next_stage: 02_architecture`

## Human check
Approve only any discovery finding that changes the intended outcome, protected asset, commercial classification, or bar. Otherwise continue autonomously.
