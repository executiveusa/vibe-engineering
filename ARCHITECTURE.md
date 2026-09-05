# Architecture

## Purpose

Vibe Engineering is a portable static React/Vite site plus a versioned governance, skills, review, and ICM software-factory package for agent-assisted delivery.

## Canonical House architecture

The architecture has one global contract, inherited by generated workspaces:

- `skills/vibe-engineering/SKILL.md` — canonical House router;
- `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` — global Layer 3 project law;
- `docs/architecture/VIBE-HOUSE-ARCHITECTURE.md` — full architecture reference;
- `_config/stage-system.yaml` — semantic lifecycle and visual tokens.

```text
Vibe Engineering   = governance and release law
ICM                = interpretable context and filesystem architecture
Artifact lifecycle = INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
Orchestrator        = movement through approved stage contracts
Workers             = replaceable implementation agents/humans
Git + CI + evidence = durable proof, rollback, and owner control
```

Existing physical ICM stage names are preserved for compatibility and mapped to the canonical semantic lifecycle rather than silently renamed.

## Upstream rule

This repository is the canonical upstream. Downstream projects inspect the current House Skill before material work when upstream is reachable. Upstream owns the general method; projects own their specific facts, owner decisions, evidence, credentials boundaries, and intentional deviations.

No vendor adapter, prompt, loop, or local copied skill may silently become a second architecture.

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
  → Layer 3 House + stable configuration/references
  → Layer 4 visible working artifacts

A2A Workflow
  → Architect directive
  → Builder execution
  → verification harness
  → independent Judge verdict

Sandcastle
  → isolated Docker worktree
  → implementer
  → fresh reviewer
  → retained branch and evidence

Human / Vibe Judge
  → reviews evidence and consequence
  → decides SHIP or HOLD
  → approves consequential release actions
```

## Factory relationship

ICM is the durable context and handoff architecture. The existing A2A package is the role and execution protocol. Sandcastle is one approved isolated execution environment. None replaces Git, native project tests, independent review, ownership controls, or live deployment verification.

```text
ICM folders define what context exists and where work moves.
House lifecycle defines which semantic stage is active.
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
- `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` is the inherited global project doctrine.
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
│   ├── VIBE_HOUSE_STANDARD.md
│   └── HEART_AND_SOUL_STANDARD.md
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

## Heart & Soul relationship

Heart & Soul is the canonical design/experience doctrine under the House architecture. It governs human outcome, hierarchy, effort, trust, accessibility, emotion, control, and subtraction. It does not replace the artifact lifecycle or release authority.

Design work still moves through `INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`.

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
- Do not allow builders or workers to approve their own work, merge, or deploy without the required authority.
- Keep issue execution isolated and reversible.
- A scaffold, formatter, doctor, build, CI run, or submitted deployment must never be represented as completed or production-verified product evidence beyond what it actually proves.
