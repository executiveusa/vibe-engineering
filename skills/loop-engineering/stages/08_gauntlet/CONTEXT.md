# 08_gauntlet — compare against the bar

One job: decide whether verified work actually reaches the chosen standard.

## Inputs
- Working: `BAR.md`, `SPEC.md`, `VERIFY.md`, artifact/screenshots/metrics
- Reference: `_shared/standards/bar-and-gauntlet.md`
- Relevant doctrine selected by skill router

## Process
1. Open/fetch the real bar. If it is unavailable, stop: comparison cannot be honest.
2. Run a fresh harsh critic. Blind labels when feasible.
3. Require a binary `ours/bar/tie` choice plus evidence, then calculate the applicable weighted score.
4. Identify only decisive gaps, route each to the correct stage/skill, and create bounded repair nodes.
5. Repeat build -> verify -> gauntlet until ours wins/clears floors, the owner stops, or a safety/authority blocker appears.
6. Never accept a fixed iteration count as quality evidence.

## Outputs
- `GAUNTLET.md` with comparisons, scorecards, decisive gaps, rounds
- If pass: `STATE.md` -> `next_stage: 09_release`
- If fail: updated `GRAPH.md` and `STATE.md` -> smallest repair stage

## Human check
Only if the bar itself should change. The critic cannot quietly move the finish line.
