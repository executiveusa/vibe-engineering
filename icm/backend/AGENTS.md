# Backend Agent Rules

This directory is the stable ICM facade for Vibe Engineering backend capabilities.

## Read order

1. `/AGENTS.md`
2. `/ICMR.yaml`
3. `/icm/README.md`
4. `/icm/backend/map.mjs`
5. the smallest relevant implementation domain

## Boundaries

- Keep business rules in their canonical domain (`src/truth`, `src/skills`, `src/icmr`, `src/mcp`), not inside transport adapters.
- CLI, HTTP API, and MCP should expose the same capabilities through `icm/backend/index.mjs` where practical.
- Do not create a second source of truth for skills, truth artifacts, lifecycle, release authority, or provenance.
- Do not move working brownfield modules only for folder aesthetics. Make ICM the navigation and interface boundary first; move implementation only when a separate change has evidence that the move reduces real complexity.
- No backend interface self-authorizes SHIP.
- Preserve exact-revision proof and rollback requirements.

## Walk-test invariant

Any new backend domain or public backend interface must be added to `icm/backend/map.mjs` and covered by `npm run icm:walk` before merge.
