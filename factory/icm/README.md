# Vibe Engineering ICM Software Factory

This factory turns the Vibe Engineering method into a folder-based production system that people and agents can inspect without learning an orchestration framework.

## One-click start

```bash
npm run factory:new -- --name "Neighborhood Health Guide"
```

The default workspace is created at `workspaces/neighborhood-health-guide/`.

Optional controls:

```bash
npm run factory:new -- \
  --name "Neighborhood Health Guide" \
  --mode greenfield \
  --domain health \
  --audience "urban youth and seniors" \
  --target ./workspaces/neighborhood-health-guide
```

## Verify the structure

```bash
npm run factory:doctor -- ./workspaces/neighborhood-health-guide
```

The doctor verifies the ICM structure and stage contracts. It does not prove that the product works, is secure, is deployed, or has customers.

## Five ICM layers

```text
AGENTS.md                      Layer 0 — identity and non-negotiable laws
CONTEXT.md                     Layer 1 — routing and workspace map
stages/NN_name/CONTEXT.md      Layer 2 — one stage contract
_config/, references/, shared/ Layer 3 — stable factory rules
stages/*/output/               Layer 4 — working project artifacts
```

## Vibe production line

```text
00 Intake
  → 01 Vision
  → 02 Blueprint
  → 03 Build
  → 04 Verify
  → 05 Council
  → 06 Judge
  → 07 Ship
  → 08 Improve
```

The existing `workflows/a2a-software-factory/` package supplies the Architect, Builder, Judge, phase receipts, retry law, and release contracts. ICM supplies the durable context and human-readable handoff surface around that workflow.

## Why this structure

- A stage does one job.
- The output of one stage becomes the input of the next.
- Every instruction and artifact is plain text.
- Humans can inspect and edit work between stages.
- Agents receive only relevant context.
- The customer can own and move the complete workspace.

## Status meanings

- `STRUCTURE READY` — folders and contracts exist.
- `BUILDING` — implementation is underway.
- `BLOCKED` — proof or approval is missing.
- `SHIP` — Judge passed and release preparation may begin.
- `PRODUCTION VERIFIED` — live target evidence and ownership checks passed.

These statuses must not be substituted for one another.