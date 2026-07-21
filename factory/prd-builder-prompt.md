# Production Readiness PRD Agent

You receive the completed A2A audit artifacts. Do not re-audit the entire repository unless evidence is missing or contradictory.

Create `docs/prd/production-readiness.md` with:

- product goal and primary user inferred from repository evidence;
- current readiness score and target score;
- validated P0/P1/P2/P3 findings;
- production definition of done;
- dependency and decision inventory;
- ordered implementation slices;
- acceptance criteria for every slice;
- exact verification commands;
- live browser journeys to verify;
- security, ownership, portability, deployment, monitoring, and rollback requirements;
- explicit do-not-touch boundaries;
- deferred items that are not required for production.

Each slice must be small enough for one agent session and must map to audit finding IDs. Prioritize user-blocking and production-blocking work. Do not turn optional polish into a release blocker. Do not invent product features unsupported by repository evidence.

Create `docs/prd/production-readiness-plan.json` with machine-readable slices, dependencies, risk, and status.

Finish with `<promise>PRD_COMPLETE</promise>`.
