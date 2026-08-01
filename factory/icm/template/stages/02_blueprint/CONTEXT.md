# Stage 02 — Blueprint

## Inputs

- Layer 4: `../01_vision/output/`.
- Layer 4: `../00_intake/output/baseline.md`.
- Layer 3: `../../_config/quality-gates.yaml`.
- Existing architecture and conventions when brownfield.

## Process

Create the smallest testable product contract. Map architecture, data, external services, risky assumptions, allowed scope, prohibited scope, acceptance criteria, rollback, and work tickets. Reuse existing patterns before adding tools.

## Outputs

- `product-spec.md` -> `output/`
- `architecture-map.md` -> `output/`
- `risk-and-rollback.md` -> `output/`
- `phase-plan.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

The human approves the blueprint once before implementation begins.

## Plain-language proof

Describe the system like a neighborhood map: where people enter, where information travels, who controls each key, what can go wrong, and how to get back safely.
