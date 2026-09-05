# Vibe Engineering context router

This file is Layer 1 of the repository's ICM structure. `AGENTS.md` is Layer 0.

V.I.B.E. means **Verify It Before Everything**.

## Canonical House contract

Current upstream method source:

- Repository: `https://github.com/executiveusa/vibe-engineering`
- House Skill: `skills/vibe-engineering/SKILL.md`
- Global generated-project doctrine: `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md`
- House architecture: `docs/architecture/VIBE-HOUSE-ARCHITECTURE.md`
- Machine-readable lifecycle/visual tokens: `_config/stage-system.yaml`

Public memory aid:

`Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn`

Canonical lifecycle:

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Compatible physical ICM route:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

The semantic lifecycle is authoritative. Physical names remain for compatibility.

## Where am I?

This repository is the Client Zero implementation of Vibe Engineering: public story, governance, ICM factory, deterministic scoring, Truth API/SDK/CLI, MCP adapter, portable House Skill, reference implementation, and upstream source for generated projects.

## Where do I go?

| Request | Primary path |
|---|---|
| Understand the current House method | `skills/vibe-engineering/SKILL.md` |
| Understand global generated-project law | `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` |
| Understand Heart & Soul design doctrine | `factory/icm/template/shared/HEART_AND_SOUL_STANDARD.md` |
| Understand House architecture | `docs/architecture/VIBE-HOUSE-ARCHITECTURE.md`, `ARCHITECTURE.md` |
| Understand public voice and design | `DESIGN.md`, `docs/BRAND.md`, then `src/` |
| Understand studio law | `docs/STUDIO-SYSTEM-PROMPT.md`, `docs/GOVERNANCE.md` |
| Start another repository with current Vibe | `docs/PROJECT-START-PROMPT.md`, `docs/INSTALL.md` |
| Create a governed project | `factory/icm/README.md`, then `npm run factory:new` |
| Route a current project stage | generated workspace `CONTEXT.md` and current `stages/NN_name/CONTEXT.md` |
| Execute an approved software slice | `docs/governance/ENGINEERING-WORKFLOW.md` |
| Inspect no-slop rules | `factory/icm/template/shared/NO_SLOP_STANDARD.md` |
| Inspect decision/divergence rules | `factory/icm/template/shared/VIBE_DECISION_STANDARD.md` |
| Compare against a quality bar | `factory/icm/template/shared/REFERENCE_BAR_STANDARD.md` |
| Inspect ownership/retention rules | `factory/icm/template/shared/OWNERSHIP_RETENTION_STANDARD.md` |
| Inspect source/licensing history | `docs/governance/SOURCE-PROVENANCE-LEDGER.md` |
| Read legacy v2 doctrine/history | `docs/VIBE-ENGINEERING-V2-DOCTRINE.md` |
| Read the machine-readable method | `truth/sources/vibe-engineering-v2.json` |
| Use the HTTP Truth API | `api/v1/`, `src/truth/`, `packages/truth-sdk/` |
| Use MCP | `api/mcp.mjs`, `src/mcp/core.mjs`, `npm run mcp` |
| Use the portable skill/plugin | `skills/vibe-engineering/SKILL.md`, `.claude-plugin/` |
| Inspect current project/commercial status | `PROJECT.yaml` and active GitHub issue/spec |

## Context-loading rule

Read only the files required for the current stage. Do not load the entire repository into one prompt. Stable rules live in Layer 3 references; working artifacts live in Layer 4 output folders.

When upstream is reachable from a downstream project, inspect the current House Skill before material work. Upstream owns the general method; project repositories own their specific facts and owner decisions. Reconcile by intent, not blind replacement.

## ICM map

```text
AGENTS.md                                      Layer 0: identity and law
CONTEXT.md                                     Layer 1: routing
factory/icm/template/stages/*                  Layer 2: stage contracts
factory/icm/template/_config                   Layer 3: stable settings
factory/icm/template/shared/VIBE_HOUSE_STANDARD.md
                                                Layer 3: global House doctrine
factory/icm/template/shared                    Layer 3: supporting Vibe standards
factory/icm/template/references                Layer 3: project/external references
stages/*/output                                Layer 4: working artifacts in generated projects
```

## Source-of-truth order

1. Applicable owner/human authority plus legal, financial, medical, safety, publishing, destructive, production, and rights-sensitive boundaries.
2. `skills/vibe-engineering/SKILL.md`, `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md`, `AGENTS.md`, and applicable studio policy.
3. `PROJECT.yaml`, accepted specifications, architecture decisions, and project-specific owner decisions.
4. Current stage `CONTEXT.md`.
5. Stable Layer 3 references.
6. Current Layer 4 working artifacts/evidence.
7. Agent preferences or chat memory.

## Plain-language rule

Teach the habit before the technical term. A motivated teenager should be able to understand the public explanation without learning software vocabulary first. Keep the exact technical concept available underneath for professionals and agents.

## Completion rule

A generated workspace is not a completed product. A passing doctor proves only factory structure. A passing formatter proves only formatting. A passing build proves only that build. A deployment submission proves only that submission. Product behavior, security, accessibility, rights, ownership, customer value, and live production each require their own evidence. Judge returns `SHIP` or `HOLD`; builders do not self-approve.
