# Vibe Engineering context router

This file is Layer 1 of the repository's Interpretable Context Methodology structure. `AGENTS.md` is Layer 0.

## Where am I?

This repository contains the public Vibe Engineering method, governance, deterministic scoring, reusable skills, and the software-factory reference implementation.

## Where do I go?

| Request | Primary path |
|---|---|
| Understand the philosophy | `docs/MANIFESTO.md`, `docs/METHOD.md` |
| Understand studio law | `docs/STUDIO-SYSTEM-PROMPT.md`, `docs/GOVERNANCE.md` |
| Create a new governed project | `factory/icm/README.md`, then `npm run factory:new` |
| Run an autonomous delivery phase | `workflows/a2a-software-factory/WORKFLOW.md` |
| Review a completed change | `04_verify`, Council, Judge, and the configured code-review workflow |
| Score a release | `docs/VIBE-SCORE.md`, `src/vibe-score.mjs` |
| Work on the public site | `src/` and the approved product specification |
| Inspect commercial status | `PROJECT.yaml` and the active SELL issue |

## Context-loading rule

Read only the files required for the current stage. Do not load the entire repository into one prompt. Stable rules live in Layer 3 reference folders; working artifacts live in Layer 4 output folders.

## Factory map

```text
AGENTS.md                         Layer 0: identity and laws
CONTEXT.md                        Layer 1: routing
factory/icm/template/stages/*     Layer 2: stage contracts
factory/icm/template/_config      Layer 3: stable factory settings
factory/icm/template/shared       Layer 3: shared standards
factory/icm/template/references   Layer 3: project references
stages/*/output                   Layer 4: working artifacts in generated projects
```

## Source-of-truth order

1. `AGENTS.md`, `docs/STUDIO-SYSTEM-PROMPT.md`, and other applicable Layer 0 repository policies.
2. Human-approved project contracts and legal, financial, medical, safety, publishing, destructive, or production decisions. These are authoritative within their approved scope but cannot override applicable Layer 0 policy.
3. `PROJECT.yaml`, accepted specifications, and architecture decision records.
4. Current stage `CONTEXT.md`.
5. Stable Layer 3 reference files.
6. Current Layer 4 working artifacts.
7. Agent preferences.

## Plain-language requirement

Every stage must produce a plain-language explanation that a motivated teenager or older adult can understand without specialized software vocabulary. Technical terms must be defined with a concrete analogy and followed by the exact technical name.

## Completion rule

A created workspace is not a completed product. A passing doctor proves only that the factory structure is readable and complete. Application behavior, security, accessibility, deployment, ownership, and customer value require separate evidence.
