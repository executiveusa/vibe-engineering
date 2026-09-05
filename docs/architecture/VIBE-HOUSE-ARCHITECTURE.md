# Vibe Engineering House Architecture

## Status

Canonical. This document defines the recognizable architecture every Vibe Engineering project should inherit.

## Principle

Vibe Engineering, ICM, the artifact lifecycle, and execution agents are complementary layers rather than competing frameworks.

```text
Vibe Engineering  = governance and release law
ICM               = interpretable context and filesystem architecture
Artifact lifecycle = ordered work and durable handoffs
Hermes/orchestrator = movement through approved stages
Workers            = replaceable implementation agents
Council + Judge     = independent review and release authority
Git + CI + evidence = durable proof and rollback substrate
```

## Canonical lifecycle

Every substantial project maps to this lifecycle:

```text
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
```

The physical ICM stage names remain versioned implementation details. Their canonical meanings are defined in `_config/stage-system.yaml`.

| Canonical meaning | Current ICM stage | Required artifact or purpose |
| --- | --- | --- |
| Intent | `00_intake` | problem, owner, outcome, target, constraints, proof, commercial value |
| Spec | `01_vision` | approved user/product intent and acceptance boundary |
| Plan | `02_blueprint` | architecture, files, sequence, risks, rollback, verifiable slice |
| Build | `03_build` | isolated implementation output |
| Proof | `04_verify` | deterministic tests, visual evidence, live checks where required |
| Council | `05_council` | independent value, architecture, failure, security, taste, sovereignty review |
| Judge | `06_judge` | SHIP/HOLD verdict from evidence |
| Ship | `07_ship` | authorized release plus tested rollback |
| Operate | `08_improve` | production observation, incidents, maintenance, validated improvement loop |

## Mandatory intake contract

Before substantial work, record:

- MODE: greenfield or brownfield.
- OUTCOME: measurable result.
- TARGET: customer, user, or system.
- CONSTRAINTS: what must not change.
- PROOF: evidence required.
- COMMERCIAL VALUE: revenue, savings, retention, or validated learning.

For portfolio work, also classify the project as SELL, USE, MERGE, PARK, or ARCHIVE.

## ICM contract

ICM remains the canonical context architecture.

- One folder, one job.
- One stable home per fact.
- Each stage has a `CONTEXT.md` contract.
- Stage contracts declare inputs, process, outputs, human gate, and plain-language proof.
- Load the smallest context needed for the current stage.
- Keep intermediate artifacts human-readable and machine-actionable.
- State is visible in files and structured records, not hidden inside an agent conversation.

## Formatting law

Generated projects use Prettier as the deterministic formatting layer. Formatting is not design semantics.

Prettier owns:

- indentation and whitespace;
- wrapping;
- quotes and commas;
- Markdown, JSON, YAML, JavaScript, TypeScript, CSS, and related supported source formatting.

`_config/stage-system.yaml` owns semantic color meaning. Colors must not be invented per project when representing lifecycle state.

## Visual language

The semantic colors are portable tokens for documentation, Mermaid diagrams, dashboards, CLI surfaces, and future orchestration interfaces.

A color is a status/context signal, not proof by itself. The textual stage name must remain available for accessibility and machine interpretation.

## Orchestration boundary

ICM does not become another hidden multi-agent framework. The orchestrator reads stage contracts, routes work, and advances only when required gates pass. Workers may change without changing the project anatomy.

```text
Human / owner
    ↓
Vibe Engineering governance
    ↓
ICM stage contract
    ↓
Orchestrator
    ↓
Replaceable worker
    ↓
Proof
    ↓
Independent Council / Judge
    ↓
Authorized release or HOLD
```

## Change control

Changes to this house architecture are constitutional changes. They require:

1. an isolated branch;
2. an explicit specification;
3. compatibility analysis for existing generated workspaces;
4. deterministic factory validation;
5. independent review before merge.

Do not silently rename or reinterpret stages in downstream repositories. Prefer a versioned semantic mapping and migration path.
