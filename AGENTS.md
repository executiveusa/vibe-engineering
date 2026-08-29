# Vibe Engineering repository agent policy

Built by The Pauli Effect · 2026 · Part of the Pauli Suite.

V.I.B.E. means **Verify It Before Everything**.

This repository develops and proves Vibe Engineering itself. Treat it as Client Zero: the method must survive the same requirements it applies to client work.

## Authority

This repository inherits the authoritative studio policy in `docs/STUDIO-SYSTEM-PROMPT.md`.

For Vibe v2 method decisions, also read `docs/VIBE-ENGINEERING-V2-DOCTRINE.md`. It adds plain-language public framing, Intent → Standard → Evidence, controlled divergence, no-slop quality, source/provenance, earned retention, and Client Zero rules without weakening existing studio authority.

## Required reading

Before substantial work, read only what the task requires, starting with:

1. `CONTEXT.md`
2. `PROJECT.yaml`
3. the approved issue/specification
4. the current ICM stage contract and references it names
5. `docs/STUDIO-SYSTEM-PROMPT.md` and `docs/VIBE-ENGINEERING-V2-DOCTRINE.md` when governance or method behavior is involved
6. `docs/governance/ENGINEERING-WORKFLOW.md` for software implementation
7. `ARCHITECTURE.md`, `RUNBOOK.md`, or `SECURITY.md` when the task touches those boundaries

Do not load every method document into every task.

## The public memory aid

`Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn`

Technical route:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

Every material decision carries:

`Intent → Standard → Evidence`

## Mandatory engineering procedure

`executiveusa/pauli-agent-skills-2026` is the canonical engineering procedure library for software produced by this factory.

Vibe Engineering and ICM govern **what, why, whether, and authority**. Agent Skills govern **how approved engineering work is executed**.

For software work, use:

`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`

Apply only the skills relevant to the current slice. More skills do not equal more quality. No skill may override ICM scope, Council, Judge, rights, ownership, or required human approval.

## Divergence rule

Use `STANDARD` for factual work, approved implementation, verification, security conclusions, migrations, destructive actions, and release.

Use `DIVERGE` for open-ended product, UX, positioning, creative direction, architecture alternatives, or debugging hypotheses when materially different options are useful.

Use `FRONTIER` only for bounded reversible experiments where novelty is worth the risk.

Verbalized Sampling may support DIVERGE/FRONTIER. Its probability labels are exploration signals, not truth or approval. Converge before Build.

## No-slop rule

Default model output is not a product decision. For consequential work ask:

**What part exists because we chose it, and what part exists because the model defaulted to it?**

Use project context, a real reference where appropriate, deterministic detectors where useful, fresh review, and actual evidence. Anti-slop tools do not replace taste or judgment.

## Commands

```bash
npm ci
npm run check
npm audit --audit-level=high
npm run truth:api
npm run vibe -- method
npm run mcp
```

Factory commands:

```bash
npm run factory:new -- --name "Project Name"
npm run factory:doctor -- ./workspaces/project-name
```

## ICM rule

- `AGENTS.md` is Layer 0 identity and law.
- `CONTEXT.md` is Layer 1 routing.
- Each `stages/NN_name/CONTEXT.md` is a Layer 2 stage contract.
- `_config/`, `references/`, and `shared/` are Layer 3 stable context.
- `output/` folders are Layer 4 working artifacts/evidence.
- Load only the current stage and references it explicitly names.
- Working decisions end in durable artifacts, not chat memory.
- Public-facing explanations use plain language first; technical terms remain available underneath.

## Source and rights rule

Record material third-party methods, code, text, design references, data, images, audio, and other inputs. Possessing a file is not by itself permission to distribute it. Required rights or attribution are release gates for the affected asset.

## Ownership and retention rule

The owner must be able to understand, export, move, replace providers/builders, recover, and continue operating. Retention is earned through measurable value, education, and improvement, not manufactured lock-in.

## Prohibited changes

- Do not rewrite unrelated product surfaces during infrastructure tickets.
- Do not add another orchestrator when an adapter to the existing Vibe/ICM core is sufficient.
- Do not commit secrets or `.sandcastle/.env`.
- Do not overwrite a non-empty project destination with the factory scaffold.
- Do not merge, deploy, publish, or close issues without required evidence and authority.
- Do not claim live production verification from local, scaffold, build, review, merge, preview, or CI results.
- Do not bypass mandatory engineering procedure because direct implementation appears faster.
- Do not publish a third-party media asset with unverified distribution rights.

## Review and release

The builder may explain and repair findings but cannot be the only reviewer approving its own work. Fresh review produces evidence. Judge returns `SHIP` or `HOLD`. Production release remains separately authorized and requires live target-environment verification after release.
