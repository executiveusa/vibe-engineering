# Vibe Engineering ICM Software Factory

This factory turns the Vibe Engineering method into a folder-based production system that people and agents can inspect without learning an orchestration framework.

## Mandatory Step 0 — detect before intake

Every governed workspace starts with **ICMR — ICM Runtime Representation**.

```text
DETECT → ICMR → INTAKE/SPEC → SLICE → BUILD → PROOF → SHIP
```

`ICMR.yaml` records the detected work topology, selected ICM form, roles, authority, routing, context boundaries, proof, sovereignty, and rollback. The default software scaffold starts provisionally as a project pipeline, but agents must update that detection when evidence shows an umbrella, record library, knowledge bundle, context map, or composite is more truthful.

No substantial work should enter `00_intake` until Step 0 passes.

Portable compiler skill:

```text
skills/icmr-universal-compiler/SKILL.md
```

## One-click start

```bash
npm run factory:new -- --name "Neighborhood Health Guide"
```

The default workspace is created at `workspaces/neighborhood-health-guide/` and includes `ICMR.yaml` plus its local JSON schema.

Optional controls:

```bash
npm run factory:new -- \
  --name "Neighborhood Health Guide" \
  --mode greenfield \
  --domain health \
  --audience "urban youth and seniors" \
  --target ./workspaces/neighborhood-health-guide
```

### Modes

- `greenfield` creates the control workspace for a new product.
- `brownfield` creates a separate control workspace for inspecting and governing an existing product.

Brownfield mode does **not** copy into, overwrite, or reorganize the existing source repository. The original repository is linked and inspected during Step 0, Intake, and Blueprint after ownership/location are confirmed. This preserves the brownfield rule: inspect before changing.

## Verify the structure

Validate Step 0 directly:

```bash
npm run icmr:validate -- ./workspaces/neighborhood-health-guide
```

Run the governed factory doctor:

```bash
npm run factory:doctor -- ./workspaces/neighborhood-health-guide
```

The governed doctor runs ICMR Step 0 first, then the normal ICM structure checks. A pass proves structure only. It does not prove that the product works, is secure, is deployed, has customers, or is live in production.

## ICM entry + five layers

```text
ICMR.yaml                      Step 0 — detected runtime representation
AGENTS.md                      Layer 0 — identity and non-negotiable laws
CONTEXT.md                     Layer 1 — routing and workspace map
stages/NN_name/CONTEXT.md      Layer 2 — one stage contract
_config/, references/, shared/ Layer 3 — stable factory rules
stages/*/output/               Layer 4 — working project artifacts
```

## Vibe production line

After Step 0 passes:

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

The existing `workflows/a2a-software-factory/` package supplies the Architect, Builder, Judge, phase receipts, retry law, and release contracts. ICM supplies durable context and human-readable handoffs. ICMR supplies the portable entry contract that tells any capable agent what kind of system it has entered and what it may do.

## Why this structure

- Work topology is detected before it is forced into a workflow.
- A stage does one job.
- The output of one stage becomes the input of the next.
- Every instruction and artifact is plain text.
- Humans can inspect and edit work between stages.
- Agents receive only relevant context.
- Authority and irreversible actions are explicit.
- The customer can own and move the complete workspace.

## Status meanings

- `STEP 0 PASS` — ICMR exists and structural entry checks pass.
- `STRUCTURE READY` — folders and contracts exist.
- `BUILDING` — implementation is underway.
- `BLOCKED` — proof or approval is missing.
- `SHIP` — Judge passed and release preparation may begin.
- `PRODUCTION VERIFIED` — live target evidence and ownership checks passed.

These statuses must not be substituted for one another.
