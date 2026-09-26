# The pipeline

There is one pipeline. Everything else that describes one is an adapter onto it: a different vocabulary, entry point or runtime for the same stages, receipts and gates. Decision record: `DECISIONS/ADR-003-one-canonical-pipeline.md`.

## Stages

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

| Stage   | Output (a file in the repository)                                  | Who                                                  | Gate to leave the stage                                     |
| ------- | ------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------- |
| INTENT  | outcome, target, constraints, consequence level                    | owner or orchestrator                                | consequence level recorded (LOW / MEDIUM / HIGH)            |
| SPEC    | measurable acceptance criteria, the bar                            | architect agent                                      | criteria are testable                                       |
| PLAN    | small slices, each mapped to criteria                              | architect agent                                      | each slice fits one agent session                           |
| BUILD   | commits on an isolated branch                                      | builder agent in a Sandcastle container              | tests and build run in the container                        |
| PROOF   | test output, screenshots, evidence in `docs/evidence/` or `PROOF/` | builder agent                                        | evidence reproduces                                         |
| COUNCIL | reviews required by the consequence level                          | reviewer agents                                      | MEDIUM: Architect; HIGH: full Council + Future-State Test   |
| JUDGE   | `docs/evidence/production-readiness-judge.json`, SHIP or HOLD      | Judge from a different model family than the builder | receipt re-checks as SHIP (`factory/judge-receipt.mjs`)     |
| SHIP    | merged PR                                                          | GitHub auto-merge                                    | protected main + required checks + `vibe / vibe-merge-gate` |
| OPERATE | deploy, monitoring, rollback notes                                 | operator                                             | the red-gate watchdog stays quiet                           |

Every loop inside it has a budget (builder iterations, gauntlet rounds, wall-clock minutes). An exhausted budget ends in HOLD with the best candidate, never in a pass.

## Rigor by consequence

| Level  | COUNCIL                          | Gauntlet       | Human           |
| ------ | -------------------------------- | -------------- | --------------- |
| LOW    | skipped; one independent review  | optional       | no              |
| MEDIUM | Architect                        | up to 3 rounds | no              |
| HIGH   | full Council + Future-State Test | up to 5 rounds | approves the PR |

## Runtime

- **Dispatch:** Terabithia sends each task to a worker. Throughput comes from running many containers at once (the nightly matrix runs 5 in parallel), not from one agent going faster.
- **Execution:** one Sandcastle container per task, one branch per container. Agents get model keys only; the step that pushes and opens the PR runs after the agents finish, with the GitHub token.
- **Receipts:** the Judge receipt and the merge gate result are the record. The Command Center shows them per PR; it does not keep its own idea of status.

## Adapters

These existing descriptions map onto the stages above. They keep their vocabulary for their audience, but none of them adds a stage, removes a gate, or declares SHIP on its own.

| Definition                                                                                     | Where                                                | Maps to                                                                                               |
| ---------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Public nine verbs `Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn` | site and House Skill                                 | memory aid: INTENT, SPEC, PLAN, BUILD, PROOF, COUNCIL, JUDGE, SHIP, OPERATE                           |
| Loop-engineering stages `00_intake … 10_learn`                                                 | `skills/loop-engineering/`                           | the file layout for one run; `08_gauntlet` sits between PROOF and JUDGE and has a budget              |
| Physical ICM route `00_intake … 08_improve`                                                    | `_config/stage-system.yaml`                          | the same stages as folders                                                                            |
| Nightly production-readiness factory                                                           | `.github/workflows/nightly-production-readiness.yml` | audit + PRD = SPEC/PLAN, builder = BUILD/PROOF, reviewer-judge = JUDGE; PR = SHIP candidate           |
| Terabithia factory plane                                                                       | `executiveusa/terabithia`                            | dispatch and approvals; its engines report what an executor really did, and refuse when none is wired |
| BARS software-factory gate                                                                     | `executiveusa/pauli-tars-demo-`                      | the engineering worker for BUILD and PROOF                                                            |
| Hermes first-mate factory                                                                      | Hermes                                               | the orchestrator that turns INTENT into dispatched tasks                                              |
| Orca one-prompt pipeline                                                                       | Orca                                                 | an entry point that produces INTENT and SPEC, then hands off                                          |

If an adapter and this page disagree, this page wins, and the adapter is the thing to fix.
