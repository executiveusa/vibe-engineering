# Stage 02 — Blueprint / Shape

One job: turn the approved human outcome into one buildable decision contract.

## Inputs

- Layer 4: `../01_vision/output/`.
- Layer 4: `../00_intake/output/baseline.md`.
- Layer 4: `../00_intake/output/source-provenance.md`.
- Layer 3: `../../_config/quality-gates.yaml`.
- Layer 3: `../../shared/VIBE_DECISION_STANDARD.md`.
- Layer 3: `../../shared/REFERENCE_BAR_STANDARD.md`.
- Layer 3: `../../shared/NO_SLOP_STANDARD.md`.
- Existing architecture and conventions when brownfield.

## Process

1. Create the smallest testable product contract: Intent → Standard → Evidence.
2. Map architecture, data, external services, ownership boundaries, risky assumptions, allowed scope, prohibited scope, acceptance criteria, rollback, and work tickets.
3. Reuse existing patterns before adding tools or infrastructure.
4. When multiple valid approaches materially affect the result, choose `DIVERGE` or `FRONTIER` from the decision standard and generate materially different candidates. Verbalized Sampling may help surface non-default options. Cluster duplicates and record why candidates differ.
5. For taste-sensitive or comparative work, name the fetchable/comparable reference bar and any measurable half.
6. Converge to one approved path before Build. Record one safe fallback or bounded experiment only when it is useful; Build does not keep exploring the whole option set.

## Outputs

- `product-spec.md` -> `output/`
- `architecture-map.md` -> `output/`
- `decision-options.md` -> `output/` when divergence was used
- `reference-bar.md` -> `output/` when comparative quality matters
- `risk-and-rollback.md` -> `output/`
- `phase-plan.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

The human approves the blueprint once before implementation begins, including any HIGH-consequence architecture, cost, rights, data, or ownership choice.

## Plain-language proof

Describe the system like a neighborhood map: where people enter, where information travels, who controls each key, which choices were considered, what “good” is being compared against, what can go wrong, and how to get back safely.