---
name: vibe-engineering
description: Govern product and software work with V.I.B.E. — Verify It Before Everything. Canonical house skill for project intake, ICM context, intent/spec/plan artifacts, implementation, verification, Council/Judge review, release, operations, formatting, and agent handoff. Reads the smallest relevant ICM stage instead of loading the whole method.
license: MIT
metadata:
  version: "3.0.1"
  tags: "Vibe Engineering, ICM, house architecture, product, engineering, verification, systems thinking, critical thinking"
---

# Vibe Engineering — House Skill

V.I.B.E. means **Verify It Before Everything**.

This is the canonical router for the Vibe Engineering House system. Use this one skill when the user says `VIBE`, `HOUSE`, `LOCK`, asks to use Vibe Engineering, or asks to take a product from intent through production proof.

Do not create a parallel methodology. Route through the project-local ICM workspace and call smaller procedures only when the current stage requires them.

Public memory aid:

`Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn`

Canonical artifact lifecycle:

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Compatible physical ICM stage route:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

## Canonical upstream

The canonical House method lives at:

```text
https://github.com/executiveusa/vibe-engineering
https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md
```

When upstream is reachable, inspect the current upstream House Skill before material work. A local copy makes Vibe portable; it does not silently become a separate methodology.

If shell access is available in a target repository, install or refresh the portable contract with:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Do not use `--force` unless existing owner-controlled project-law files have been inspected and an intentional merge plan exists.

If local Vibe law differs from upstream:

1. upstream owns the general House method;
2. the target repository owns project-specific facts, owner decisions, requirements, evidence, credentials boundaries, and deployment reality;
3. merge by intent, not blind replacement;
4. record intentional deviations explicitly.

## First action

1. Inspect the repository before changing it.
2. Refresh or inspect current upstream House law when reachable.
3. Read project-local `AGENTS.md`, `ICMR.yaml`, and `CONTEXT.md` when present.
4. Read only the current ICM stage contract and references that stage names.
5. If Vibe MCP is available, use `vibe_method` for the canonical method or `vibe_context` for task-scoped context instead of loading every artifact.

## House architecture contract

The layers have one job each:

1. **Vibe Engineering** — governance: what should be done, by whom, under what proof and ownership constraints.
2. **ICM** — interpretable context: where facts, contracts, artifacts, evidence, and state live.
3. **Artifact lifecycle** — motion: `INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`.
4. **Hermes / orchestrator** — execution routing: which worker acts next and whether the stage gate passed.
5. **Workers** — Claude, Codex, GPT, Gemini, Orca, humans, or other tools. Workers are replaceable and cannot redefine the House architecture.

The filesystem is the durable source of truth. Chat history, model memory, and vendor-specific prompts are adapters, not architecture.

## Stage meanings

- `INTENT` — mode, outcome, target, constraints, proof, commercial value, ownership, authority, and rollback.
- `SPEC` — exact behavior, design, interfaces, acceptance criteria, architecture boundaries, and named reference bars.
- `PLAN` — bounded slices, file/change order, risks, dependencies, tests, proof, and rollback.
- `BUILD` — one independently verifiable slice at a time.
- `PROOF` — deterministic checks plus relevant runtime/browser/security/accessibility/integration evidence.
- `COUNCIL` — independent review of value, architecture, failure, security/privacy, taste/accessibility, sovereignty, maintainability, and proof.
- `JUDGE` — release verdict only: `SHIP` or `HOLD`. Judge does not rewrite the work it judges.
- `SHIP` — exact proven revision, authorized release, live-environment verification, and tested rollback.
- `OPERATE` — monitor outcomes/incidents and create a new intent when change is needed.

## Decision contract

Before substantial work, establish and persist:

```text
MODE
OUTCOME
TARGET
CONSTRAINTS
PROOF
COMMERCIAL VALUE
OWNER / AUTHORITY
ROLLBACK
```

For every material decision record:

1. **Intent** — What are we trying to change, for whom, and why?
2. **Standard** — What does good look like before the builder becomes attached to the answer?
3. **Evidence** — What observable result would make the claim true?

Separate verified facts from assumptions. Confidence, effort, model agreement, and formatting are not behavioral evidence.

## Working rules

- Inspect before change.
- Reuse before inventing.
- Work one independently verifiable vertical slice at a time.
- Keep rollback.
- Keep ICM artifacts and documentation synchronized with reality.
- Do not broaden scope because another idea or defect becomes visible.
- Use project-local formatter/linter rules. Prettier controls formatting, not lifecycle meaning or proof.
- When `_config/stage-system.yaml` exists, use its semantic stage colors in diagrams/status surfaces. Text labels remain authoritative.

Truth rules:

```text
BUILT ≠ VERIFIED
CI PASS ≠ CUSTOMER VALUE
DEPLOYED ≠ PRODUCTION PROOF
FORMAT PASS ≠ BEHAVIORAL PROOF
```

## PROOF

Run the checks appropriate to the claim: tests, type checks, lint/build, browser/runtime, accessibility, security/privacy, performance, permissions, source/rights, mobile, integration, data, failure/recovery, deployment, and live-environment checks where relevant.

A build, preview, merge, formatter pass, or deployment submission is not production proof by itself.

When a reference bar exists, compare the real artifact against the real reference with fresh context and name the largest remaining gap.

## COUNCIL

Material work requires independent challenge proportional to consequence. Review user/commercial value, architecture, failure modes, security/privacy, operations, accessibility/taste, sovereignty/ownership, maintainability, and evidence.

The builder may answer findings but may not be the only reviewer deciding readiness.

## JUDGE

Re-read Intent → Standard → Evidence. Missing proof, failed security/reliability/ownership gates, unresolved material findings, missing rights, or missing rollback produce `HOLD`.

Judge returns `SHIP` or `HOLD`. Judge does not rewrite the work it judges.

## SHIP

Verify destination, branch, environment, domains, data/credential ownership, public-asset rights, monitoring, backup, rollback, and post-release checks.

Ship only the exact proven revision. Production release requires authorized human approval where the project contract requires it. After release, verify the live target before claiming production success.

## OPERATE

Compare the promise with actual use. Measure user/customer outcomes, cost, incidents, accessibility, revenue/savings/validated learning, ownership health, and why people stay or leave.

Production signals may open a new `INTENT`, but consequential remediation follows the same gates. Autonomous maintenance does not bypass Council, Judge, ownership, or rollback.

## No-slop rule

AI slop is any important output that exists because the model defaulted to it instead of because the project chose it.

Check strategy, copy, UI, architecture, code, business logic, and production output. Ask:

**What part of this exists because we chose it, and what part exists because the model defaulted to it?**

A detector or banned-pattern list is evidence to inspect, not a substitute for judgment.

## Reference and rights rule

When taste or comparative quality matters, the bar must be named, fetchable, and comparable.

Record material external methods, code, text, design references, datasets, images, audio, and other third-party inputs with source, owner, license/terms, what was used, what changed, and distribution impact.

Possessing a media file is not by itself permission to publish it.

## Ownership rule

Before release, the owner should be able to find and control the code, data, repository, deployment, domain, billing, critical accounts, export path, documentation, and rollback. Another competent builder or agent should be able to continue without reconstructing the system from chat history.

## Invocation contract

Equivalent entry instructions:

- `Use Vibe Engineering.`
- `HOUSE this project.`
- `LOCK this into the Vibe House architecture.`
- `Refresh upstream and continue from current ICM state.`

The skill decides the current stage from repository state. It does not restart completed work or ask the user to repeat context already present in the filesystem.

## Finish format

For major work, report:

- `DECISION`
- `CHANGES`
- `PROOF`
- `STATUS`
- `COMMERCIAL IMPACT`
- `RISKS`
- `ROLLBACK`
- `NEXT`
- `HUMAN APPROVAL` when required

Do not claim SHIP or production success without the evidence required by the current stage.
