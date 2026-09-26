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
5. Repeat build -> verify -> gauntlet until ours wins/clears floors, the owner stops, a safety/authority blocker appears, or the budget runs out.
6. Budget: the round cap for the run's consequence level (MEDIUM 3, HIGH 5, unless `BAR.md` sets a stricter one) plus any wall-clock or spend cap in `BAR.md`. When it runs out, stop with **HOLD**: record the best candidate, its scores, and the decisive gaps still open.
7. Never accept a fixed iteration count as quality evidence. Finishing the budget proves nothing; only clearing the bar passes.

## Outputs
- `GAUNTLET.md` with comparisons, scorecards, decisive gaps, rounds
- If pass: `STATE.md` -> `next_stage: 09_release`
- If fail: updated `GRAPH.md` and `STATE.md` -> smallest repair stage
- If the budget ran out: `GAUNTLET.md` ends with `HOLD — budget exhausted`, best candidate and open gaps; `STATE.md` waits for the owner

## Human check
Only if the bar itself should change. The critic cannot quietly move the finish line.
