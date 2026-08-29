# Vibe Engineering context router

This file is Layer 1 of the repository's ICM structure. `AGENTS.md` is Layer 0.

V.I.B.E. means **Verify It Before Everything**.

Public memory aid:

`Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn`

## Where am I?

This repository is the Client Zero implementation of Vibe Engineering: public story, governance, ICM factory, deterministic scoring, Truth API/SDK/CLI, MCP adapter, portable agent skill, and reference implementation.

## Where do I go?

| Request | Primary path |
|---|---|
| Understand Vibe Engineering v2 | `docs/VIBE-ENGINEERING-V2-DOCTRINE.md` |
| Understand public voice and brand | `docs/BRAND.md`, then `src/` |
| Understand studio law | `docs/STUDIO-SYSTEM-PROMPT.md`, `docs/GOVERNANCE.md` |
| Create a governed project | `factory/icm/README.md`, then `npm run factory:new` |
| Route a current project stage | generated workspace `CONTEXT.md` and current `stages/NN_name/CONTEXT.md` |
| Execute an approved software slice | `docs/governance/ENGINEERING-WORKFLOW.md` |
| Inspect no-slop rules | `factory/icm/template/shared/NO_SLOP_STANDARD.md` |
| Inspect decision/divergence rules | `factory/icm/template/shared/VIBE_DECISION_STANDARD.md` |
| Compare against a quality bar | `factory/icm/template/shared/REFERENCE_BAR_STANDARD.md` |
| Inspect ownership/retention rules | `factory/icm/template/shared/OWNERSHIP_RETENTION_STANDARD.md` |
| Inspect source/licensing history | `docs/governance/SOURCE-PROVENANCE-LEDGER.md` |
| Read the machine-readable method | `truth/sources/vibe-engineering-v2.json` |
| Use the HTTP Truth API | `api/v1/`, `src/truth/`, `packages/truth-sdk/` |
| Use MCP | `api/mcp.mjs`, `src/mcp/core.mjs`, `npm run mcp` |
| Use the portable skill/plugin | `skills/vibe-engineering/SKILL.md`, `.claude-plugin/` |
| Inspect current project/commercial status | `PROJECT.yaml` and active GitHub issue/spec |

## Context-loading rule

Read only the files required for the current stage. Do not load the entire repository into one prompt. Stable rules live in Layer 3 references; working artifacts live in Layer 4 output folders.

## ICM map

```text
AGENTS.md                              Layer 0: identity and law
CONTEXT.md                             Layer 1: routing
factory/icm/template/stages/*          Layer 2: stage contracts
factory/icm/template/_config           Layer 3: stable settings
factory/icm/template/shared            Layer 3: Vibe standards
factory/icm/template/references        Layer 3: project/external references
stages/*/output                        Layer 4: working artifacts in generated projects
```

## Source-of-truth order

1. `AGENTS.md`, `docs/STUDIO-SYSTEM-PROMPT.md`, and other applicable Layer 0 policy.
2. Human-approved legal, financial, medical, safety, publishing, destructive, production, and rights-sensitive decisions within their authorized scope.
3. `docs/VIBE-ENGINEERING-V2-DOCTRINE.md`, `PROJECT.yaml`, accepted specifications, and architecture decision records.
4. Current stage `CONTEXT.md`.
5. Stable Layer 3 references.
6. Current Layer 4 working artifacts/evidence.
7. Agent preferences.

## Plain-language rule

Teach the habit before the technical term. A motivated teenager should be able to understand the public explanation without learning software vocabulary first. Keep the exact technical concept available underneath for professionals and agents.

## Completion rule

A generated workspace is not a completed product. A passing doctor proves only factory structure. A passing build proves only that build. A deployment submission proves only that submission. Product behavior, security, accessibility, rights, ownership, customer value, and live production each require their own evidence.