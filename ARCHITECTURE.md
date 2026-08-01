# Architecture

## Purpose

Vibe Engineering is a portable static React/Vite site plus a versioned governance, skills, review, and ICM software-factory package for agent-assisted delivery.

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
├── _config/
├── references/
├── shared/
├── scripts/factory-doctor.mjs
└── stages/
    ├── 00_intake/
    ├── 01_vision/
    ├── 02_blueprint/
    ├── 03_build/
    ├── 04_verify/
    ├── 05_council/
    ├── 06_judge/
    ├── 07_ship/
    └── 08_improve/
```

Every stage contains a `CONTEXT.md` contract and a generated `output/` edit surface.

## Data

The public application has no production database and stores no customer data. GitHub holds repository, issue, pull-request, and release records. Generated workspaces store stage state as plain text and JSON. Secrets must remain outside Git and chat.

## Deployment

The static build is deployable to Vercel or another static host. A deployment request is not considered live verification. Generated project workflows validate the ICM structure and then invoke project-declared checks when present.

## Architecture constraints

- Preserve the portable static architecture unless a validated commercial requirement demands a backend.
- Do not add another orchestration or session-management platform until sequential delivery is commercially proven.
- Keep ICM model-agnostic and text-first.
- Keep one stage focused on one job.
- Do not allow builders or Sandcastle workers to approve their own work, merge, or deploy without the required authority.
- Keep issue execution isolated and reversible.
- A scaffold or doctor PASS must never be represented as a completed or production-verified product.
