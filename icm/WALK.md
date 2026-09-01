# ICM Walk Test

The walk test answers one question:

> Can a fresh human or AI agent enter this repository, follow a deterministic path, and identify the system's purpose, rules, backend domains, interfaces, proof path, and release authority without guessing?

## Expected walk

### 0. Law
Read `AGENTS.md`.

You should learn that substantial work cannot jump straight to implementation, production claims need proof, the builder cannot be the only approver, and release requires authority and rollback.

### 1. Runtime contract
Read `ICMR.yaml`.

You should be able to identify the work topology, authority boundaries, constraints, and required Step 0 behavior.

### 2. Backend map
Read `icm/backend/map.mjs`.

You should be able to answer:
- Where does approved truth live?
- Where are callable skills defined?
- Where is ICMR detection/validation implemented?
- Where is MCP implemented?
- Where is release evidence governed?
- Which CLI, HTTP, and MCP entrypoints expose the backend?

### 3. Stable facade
Read `icm/backend/index.mjs`.

Adapters should reach backend capabilities through this ICM boundary instead of inventing parallel business logic.

### 4. Domain dive
Open only the domain needed for the task. Do not load the whole repository into context by default.

### 5. Interface proof
Confirm these surfaces point at the same backend:
- CLI: `scripts/vibe.mjs`
- HTTP: `api/v1/*`
- MCP: `api/mcp.mjs` and `src/mcp/core.mjs`

### 6. Lifecycle and authority
Confirm substantial work follows:

`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`

Confirm no skill/API/CLI/MCP call can self-authorize production release.

## Deterministic check

Run:

```bash
npm run icm:walk
```

The command checks required mapped files, lifecycle terms, skill/MCP availability, and interface entrypoints. PASS means the map is internally walkable. Product/release proof remains a separate gate.
