# Consumers: how to mount this

The shared machine-readable registry is `skills/workflows/registry.json`. The read-only `src/workflows/skill-router.mjs` helper returns a focused plan for one ICM stage. HTTP: GET or POST `/api/v1/workflow-router`. The website's Skill Dispatch Desk offers a copyable handoff, not remote execution. Real agent delegation requires an explicitly connected adapter, independent model family, exact-candidate receipts, Council and Judge. See `docs/architecture/SKILL-DISPATCH-ICM.md`.

## Any coding agent (Claude Code, Codex, similar)

Point the agent at `skills/workflows/INDEX.md` as the entry. Add one line to the project's agent instructions: "Before a task, read skills/workflows/INDEX.md and AGENTS.md; load only the matching workflow."

## Hosted personal assistant (personal skills folder)

Copy or link `skills/workflows/` into the personal skills area. Keep INDEX.md as the entry. Do not duplicate step sources; the INDEX points to them. Update by pulling this repo, not by editing copies.

## Multi-agent orchestrators

Mount this repo's `skills/workflows/` read-only next to any existing skill inventory. The orchestrator selects a workflow from INDEX.md by trigger, then hands each worker only the steps it needs. Workers get the WORKFLOW.md and the current step's source, nothing else. The inventory stays the inventory; this folder is the routing.

## Keeping it current

Change a workflow through a pull request. Review by an agent or person other than the author. Record the pinned revision of any external source in sources/SOURCES.md.

This folder defers to the repository root AGENTS.md route and does not replace the House method or its gates.
