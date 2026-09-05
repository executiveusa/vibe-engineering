# Vibe Engineering repository agent policy

Built by The Pauli Effect · 2026 · Part of the Pauli Suite.

V.I.B.E. means **Verify It Before Everything**.

This repository develops and proves Vibe Engineering itself. Treat it as Client Zero: the method must survive the same requirements it applies to client work.

## Canonical House authority

The current method source is:

- `skills/vibe-engineering/SKILL.md` — canonical House Skill/router;
- `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` — global Layer 3 House doctrine inherited by generated projects;
- `docs/architecture/VIBE-HOUSE-ARCHITECTURE.md` — architecture contract;
- `_config/stage-system.yaml` — machine-readable lifecycle and visual semantics;
- `docs/STUDIO-SYSTEM-PROMPT.md` — studio-level authority where applicable.

`docs/VIBE-ENGINEERING-V2-DOCTRINE.md` is retained as historical doctrine and explanatory source. When terminology differs, the current House Skill and House Standard govern the general method.

Canonical lifecycle:

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Compatible physical ICM route:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

## Upstream-first law

This repository is the upstream. Downstream projects should inspect the current House Skill before material work when upstream is reachable.

Upstream owns the general House method. A downstream project owns its project-specific facts, owner decisions, credentials boundaries, product requirements, evidence, and intentional deviations. Reconcile by intent; never overwrite project law blindly.

## Universal filesystem law

Vibe Engineering is agent-neutral by default.

The canonical system is the repository filesystem: files, folders, contracts, skills, proof, and durable decisions. Claude Code, Codex, Cursor, OpenCode, MCP clients, CLIs, APIs, and future agents are adapters to that system. They are not separate sources of truth.

Therefore:

- a new agent must be able to enter through `AGENTS.md → ICMR.yaml → CONTEXT.md` and understand what to do next;
- durable rules belong in files, not chat memory or one vendor's hidden prompt;
- adapters may translate access, but they must not duplicate or fork canonical law;
- do not add another orchestrator, persona, sub-agent hierarchy, or swarm when a file, skill, stage contract, or adapter is enough;
- changing agent vendors must not require redesigning project architecture;
- every supported entry point—files, plugin, CLI, API, or MCP—must resolve to the same House rules and skill definitions.

**No agent soup. One walkable system. Any capable agent can use it.**

## Constitutional advancement law

A project advances only when the current ICM stage satisfies its declared gates and durable proof exists.

For every governed stage:

- the stage contract defines required artifacts, acceptance gates, proof, approvals, and allowed next stage;
- mechanical gates are checked mechanically when possible;
- judgment gates use designated Vibe review procedures rather than confidence language;
- code-review stages re-review the exact final candidate after fixes;
- consequential stages cannot be self-approved by the builder;
- failed or missing gates produce `HOLD`;
- a passing transition creates durable evidence before the next stage becomes active;
- adapters may guide or visualize progression but may not bypass, auto-waive, or silently complete a gate;
- only authorized human authority may satisfy gates explicitly marked human/owner authority.

## Mandatory Step 0 — ICMR

Before substantial governed work, run the ICMR Universal Compiler contract in `skills/icmr-universal-compiler/SKILL.md`.

The House route is:

`DETECT → ICMR → INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

For brownfield work, Step 0 inventories reality before restructuring or migration. If evidence shows the work is not a simple project pipeline, update the detected ICM form rather than forcing the default scaffold.

## Required reading

Read only what the task requires, starting with:

1. `ICMR.yaml` when working inside a governed workspace;
2. `CONTEXT.md`;
3. `skills/vibe-engineering/SKILL.md` when method behavior matters;
4. `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` when changing generated-project law;
5. the approved issue/specification and current ICM stage contract;
6. `docs/governance/ENGINEERING-WORKFLOW.md` for software implementation;
7. `ARCHITECTURE.md`, `DESIGN.md`, `RUNBOOK.md`, or `SECURITY.md` when the task touches those boundaries;
8. Heart & Soul and other Layer 3 standards only when the current stage requires them.

Do not load every method document into every task.

## Global project contract

Before substantial work, persist:

- `MODE`
- `OUTCOME`
- `TARGET`
- `CONSTRAINTS`
- `PROOF`
- `COMMERCIAL VALUE`
- `OWNER / AUTHORITY`
- `ROLLBACK`

Separate verified facts from assumptions. Inspect before asking the owner to repeat information already present in repositories, docs, CI, deployment config, or connected systems.

## Mandatory engineering procedure

`executiveusa/pauli-agent-skills-2026` remains the canonical engineering procedure library for software produced by this factory.

Vibe Engineering and ICM govern what, why, whether, context, and authority. Engineering skills govern how approved software work is executed.

Engineering procedures compose inside—not beside—the House lifecycle. They cannot override ICM scope, Council, Judge, rights, ownership, rollback, or required human approval.

## Heart & Soul / design law

`factory/icm/template/shared/HEART_AND_SOUL_STANDARD.md` is the canonical design doctrine and inherits the House Standard.

Design is not a parallel workflow. User-facing design moves through the same lifecycle and proof gates as engineering. Subtraction remains mandatory: remove until another removal would harm user success, comprehension, trust, accessibility, control, emotional resonance, or essential identity.

## No-slop rule

Default model output is not a product decision.

For consequential work ask:

**What part exists because we chose it, and what part exists because the model defaulted to it?**

Use project context, a real reference where appropriate, deterministic detectors where useful, fresh review, and actual evidence. Anti-slop tools do not replace taste or judgment.

## Truth rules

```text
BUILT ≠ VERIFIED
CI PASS ≠ CUSTOMER VALUE
DEPLOYED ≠ PRODUCTION PROOF
FORMAT PASS ≠ BEHAVIORAL PROOF
```

## ICM rule

- `ICMR.yaml` is Step 0: detected runtime representation and entry contract.
- `AGENTS.md` is Layer 0 identity and law.
- `CONTEXT.md` is Layer 1 routing.
- Each `stages/NN_name/CONTEXT.md` is a Layer 2 stage contract.
- `_config/`, `references/`, and `shared/` are Layer 3 stable context.
- `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` is the global Layer 3 House doctrine.
- `output/` folders are Layer 4 working artifacts/evidence.
- Load only the current stage and references it explicitly names.
- Working decisions end in durable artifacts, not chat memory.

## Source, rights, ownership

Record material third-party methods, code, text, design references, data, images, audio, and other inputs. Possessing a file is not permission to distribute it. Required rights or attribution are release gates.

The owner must be able to understand, export, move, replace providers/builders, recover, and continue operating. Retention is earned through measurable value and improvement, not manufactured lock-in.

## Prohibited changes

- Do not begin substantial governed work without a valid Step 0 contract when ICMR applies.
- Do not advance a stage when required evidence or authority is missing.
- Do not let an adapter, plugin, agent, builder, reviewer, or UI mark a governed stage complete without durable proof.
- Do not create a second House method in a skill, prompt, loop, or vendor adapter.
- Do not rewrite unrelated surfaces during bounded work.
- Do not commit secrets.
- Do not merge, deploy, publish, or close consequential work without required evidence and authority.
- Do not claim live production verification from local, scaffold, build, review, merge, preview, formatter, or CI results.
- Do not publish third-party media with unverified rights.

## Review and release

The builder may explain and repair findings but cannot be the only reviewer approving its own work. Council provides independent challenge. Judge returns only `SHIP` or `HOLD`. Production release remains separately authorized and requires live target-environment verification after release.

For material work, finish with `DECISION`, `CHANGES`, `PROOF`, `STATUS`, `COMMERCIAL IMPACT`, `RISKS`, `ROLLBACK`, `NEXT`, and `HUMAN APPROVAL` when required.
