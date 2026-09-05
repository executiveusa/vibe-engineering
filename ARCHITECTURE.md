# Architecture

## Purpose

Vibe Engineering is a portable static React/Vite site plus a versioned governance, skills, review, and ICM software-factory package for agent-assisted delivery.

## House architecture

The canonical project architecture is defined in `docs/architecture/VIBE-HOUSE-ARCHITECTURE.md` and inherited by generated workspaces.

```text
Vibe Engineering  = governance and release law
ICM               = interpretable context and filesystem architecture
Artifact lifecycle = INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
Orchestrator       = movement through approved stage contracts
Workers            = replaceable implementation agents
Git + CI + evidence = durable proof, rollback, and owner control
```

The semantic lifecycle and its visual tokens are versioned in `_config/stage-system.yaml`. Existing physical ICM stage names are preserved for compatibility and mapped to the canonical lifecycle rather than silently renamed.

## Current system

```text
Browser
  → Vite static application
  → deterministic Vibe Score module

GitHub
  → source of truth
  → issues and specifications
  → pull requests, reviews, and CI evidence

ICM Factory
  → Layer 0 identity and laws
  → Layer 1 workspace routing
  → Layer 2 stage contracts
  → Layer 3 stable configuration and references
  → Layer 4 visible working artifacts

A2A Workflow
  → Architect directive
  → Builder execution
  → verification harness
  → independent Judge verdict

Sandcastle
  → isolated Docker worktree
  → Codex implementer
  → fresh Codex reviewer
  → retained branch and evidence

Human / Vibe Judge
  → reviews evidence and consequence
  → decides SHIP or HOLD
  → approves consequential release actions
```

## Factory relationship

ICM is the durable context and handoff architecture. The existing A2A package is the role and execution protocol. Sandcastle is one approved isolated execution environment. None of these replaces Git, native project tests, independent review, ownership controls, or live deployment verification.

```text
ICM folders define what context exists and where work moves.
A2A contracts define who decides, builds, reviews, and records evidence.
Execution tools run one approved slice inside those boundaries.
```

## Boundaries

- `src/` contains the public product interface and deterministic score logic.
- `docs/` contains methodology, governance, evidence, specifications, and adoption plans.
- `prompts/` contains reusable agent prompts.
- `skills/` maps approved procedures and references.
- `templates/` contains repository onboarding templates.
- `factory/icm/` contains the canonical model-agnostic project workspace template.
- `scripts/factory-new.mjs` creates a project workspace without overwriting an existing project.
- `scripts/factory-doctor.mjs` validates structure but does not certify product behavior.
- `workflows/a2a-software-factory/` contains Architect, Builder, Judge, receipt, retry, and release contracts.
- `.sandcastle/` contains the isolated sequential execution scaffold.

## Generated project structure

```text
project/
├── AGENTS.md
├── CONTEXT.md
├── .factory/state.json
├── .prettierrc.json
├── .prettierignore
├── _config/
│   └── stage-system.yaml
├── references/
├── shared/
├── docs/
│   └── ARCHITECTURE-MAP.md
├── scripts/factory-doctor.mjs
└── stages/
    ├── 00_intake/      # INTENT
    ├── 01_vision/      # SPEC
    ├── 02_blueprint/   # PLAN
    ├── 03_build/       # BUILD
    ├── 04_verify/      # PROOF
    ├── 05_council/     # COUNCIL
    ├── 06_judge/       # JUDGE
    ├── 07_ship/        # SHIP
    └── 08_improve/     # OPERATE
```

Every stage contains a `CONTEXT.md` contract and a generated `output/` edit surface.

## Formatting and visual semantics

Prettier is the deterministic formatting layer for generated projects. It controls source formatting, not workflow meaning. Semantic stage colors and labels are defined by `_config/stage-system.yaml` and may be reused in Mermaid diagrams, dashboards, documentation, CLI surfaces, and orchestration interfaces. Text labels remain authoritative for accessibility and machine interpretation.

## Data

The public application has no production database and stores no customer data. GitHub holds repository, issue, pull-request, and release records. Generated workspaces store stage state as plain text and JSON. Secrets must remain outside Git and chat.

## Deployment

The static build is deployable to Vercel or another static host. A deployment request is not considered live verification. Generated project workflows validate the ICM structure and then invoke project-declared checks when present.

## Architecture constraints

- Preserve the portable static architecture unless a validated commercial requirement demands a backend.
- Do not add another orchestration or session-management platform until sequential delivery is commercially proven.
- Keep ICM model-agnostic and text-first.
- Keep one stage focused on one job.
- Preserve explicit semantic mapping when physical stage names change; do not silently reinterpret existing workspaces.
- Do not allow builders or Sandcastle workers to approve their own work, merge, or deploy without the required authority.
- Keep issue execution isolated and reversible.
- A scaffold or doctor PASS must never be represented as a completed or production-verified product.
