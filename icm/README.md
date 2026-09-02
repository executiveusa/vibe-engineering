# Vibe Engineering ICM

Start here when an AI agent or new contributor needs to understand the backend.

The goal is simple: **walk the filesystem and know what the system does, where authority lives, and how every interface reaches the same core.**

## Walk order

1. Read `/AGENTS.md` — repository law and non-negotiable gates.
2. Read `/ICMR.yaml` — the Step 0 runtime contract.
3. Read `/icm/backend/map.mjs` — machine-readable backend map.
4. Read `/icm/WALK.md` — the human walk test and expected path.
5. Enter only the domain needed for the current job:
   - Truth → `/src/truth/` + `/truth/sources/`
   - Skills → `/src/skills/` + `/skills/`
   - ICMR → `/src/icmr/` + `/factory/icm/`
   - MCP → `/src/mcp/`
   - Release/proof → `/.github/workflows/` + `/docs/evidence/`
6. Use `/icm/backend/index.mjs` as the stable backend facade for adapters.
7. Use the public interface that fits the caller: CLI, HTTP API, or MCP.

## One core, three main interfaces

```text
                    VIBE ICM BACKEND
                           │
                 icm/backend/index.mjs
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
       CLI               HTTP API             MCP
 scripts/vibe.mjs         api/v1/*           api/mcp.mjs
```

The adapters do not own the method. They expose the same underlying truth, ICMR, skills, and governance rules.

## Required lifecycle

For substantial software work:

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

Before planning or execution, Step 0 requires ICMR detection, compilation, and validation. Before SHIP, the exact candidate needs proof, independent review, explicit release authority, production verification, and rollback.

## Walk-test command

```bash
npm run icm:walk
npm run vibe -- walk
```

A passing walk test means the repository is structurally understandable and its mapped backend entrypoints exist. It does **not** mean a product change is automatically secure, useful, accessible, or authorized for release.
