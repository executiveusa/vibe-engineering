# Loop Engineering — agent entry

Purpose: route an agent through a complete, evidence-backed engineering lifecycle without stuffing every rule into context.

## Where things live

- `CONTEXT.md` — lifecycle router.
- `stages/NN_*/CONTEXT.md` — current stage contract. Read one at a time.
- `_shared/routing/skill-router.md` — which specialist references to activate and when.
- `_shared/routing/engine-router.md` — when a graph/runtime framework is justified.
- `_shared/standards/` — bar, graph, evidence, release, mobile, commercial rules.
- `_shared/doctrine/` — design/product doctrine distilled from the owner's source material.
- `_shared/source_material/` — original owner-provided standards; read only when the stage contract names them.
- `_templates/RUN/` — blank run packet.
- `runs/` — project/run state. Filesystem state is authoritative.
- `scripts/` — deterministic helpers; no model judgment.

## Route by what just happened

- New idea / no repo -> `stages/00_intake/CONTEXT.md` then `01_discovery`.
- Existing repo / deployed product -> `00_intake` then `01_discovery` in brownfield mode, with baseline + wiring audit before design or code.
- Lock complete -> `02_architecture`.
- Architecture chosen -> `03_graph`.
- Graph admitted -> `04_spec`.
- Spec accepted -> `05_slice`.
- Slice ready -> `06_build`.
- Builder stops -> `07_verify` in a fresh context.
- Verification passes -> `08_gauntlet`.
- Bar is cleared -> `09_release`.
- Release verified -> `10_learn`.

## One rule

Load the smallest set of files that can safely decide the next action. A link beats a copy. Evidence beats a claim.
