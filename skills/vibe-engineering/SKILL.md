---
name: vibe-engineering
description: Govern product and software work with V.I.B.E. — Verify It Before Everything. Canonical house skill for project intake, ICM context, intent/spec/plan artifacts, implementation, verification, Council/Judge review, release, operations, formatting, and agent handoff. Reads the smallest relevant ICM stage instead of loading the whole method.
license: MIT
metadata:
  version: "3.0.0"
  tags: "Vibe Engineering, ICM, house architecture, product, engineering, verification, systems thinking, critical thinking"
---

# Vibe Engineering — House Skill

V.I.B.E. means **Verify It Before Everything**.

This is the canonical router for the Vibe Engineering house system. Use this one skill when the user says `VIBE`, `HOUSE`, `LOCK`, asks to use Vibe Engineering, or asks to take a product from intent through production proof.

Do not create a parallel methodology. Route through the project-local ICM workspace and call smaller procedures only when the current stage requires them.

Public memory aid:

`Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn`

Canonical artifact lifecycle:

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Compatible physical ICM stage route:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

## First action

If the project contains a Vibe ICM workspace, read its root `CONTEXT.md`, then read only the current stage contract and the references that stage names.

If the Vibe MCP server is available, call `vibe_method` for the canonical method or `vibe_context` for task-scoped context. Do not load every artifact by default.

If neither is available, use this skill as the router and follow the project-local source of truth.

## House architecture contract

The layers have one job each:

1. **Vibe Engineering** — governance: what should be done, by whom, under what proof and ownership constraints.
2. **ICM** — interpretable context: where facts, contracts, artifacts, evidence, and state live.
3. **Artifact lifecycle** — motion: `INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`.
4. **Hermes / orchestrator** — execution routing: which worker acts next and whether the stage gate passed.
5. **Workers** — Claude, Codex, GPT, Gemini, Orca, humans, or other tools. Workers are replaceable and cannot redefine the house architecture.

The filesystem is the durable source of truth. Chat history, model memory, and vendor-specific prompts are adapters, not architecture.

### Semantic stage meanings

- `INTENT` — mode, outcome, target, constraints, proof, commercial value, ownership, and rollback requirement.
- `SPEC` — exact behavior, design, interfaces, acceptance criteria, and named reference bars.
- `PLAN` — bounded slices, file/change order, risks, dependencies, tests, and rollback.
- `BUILD` — one independently verifiable slice at a time.
- `PROOF` — deterministic checks plus relevant runtime/browser/security/accessibility evidence.
- `COUNCIL` — independent review of value, architecture, failure, security/privacy, taste/accessibility, sovereignty, and proof.
- `JUDGE` — release verdict only: `SHIP` or `HOLD`. Judge does not rewrite the work it judges.
- `SHIP` — exact proven revision, authorized release, live-environment verification, and tested rollback.
- `OPERATE` — monitor outcomes/incidents and create a new intent when change is needed.

### Visual semantics

When a project contains `_config/stage-system.yaml`, use those tokens as the canonical stage colors for diagrams, dashboards, status surfaces, and generated architecture maps. Color communicates stage meaning; it is not decorative branding.

### Formatting law

Use project-local formatter/linter rules. In the canonical Vibe factory, Prettier normalizes supported text/code formatting; it does not define semantic colors. Formatting gates must never be represented as behavioral or production proof.

## The decision contract

For every material decision, record:

1. **Intent** — What are we trying to change, for whom, and why?
2. **Standard** — What does good look like before the builder becomes attached to the answer?
3. **Evidence** — What observable result would make the claim true?

Confidence, effort, and model agreement are not evidence.

## Four thinking habits

- **Question the answer** — critical thinking.
- **See what connects** — systems thinking. Name dependencies, downstream effects, people affected, recurring cost, and what the choice makes normal.
- **Get back to what is true** — first principles. Separate facts, constraints, assumptions, and inherited convention.
- **Build one piece and prove it** — discipline.

Use the plain phrase before the technical term when working with non-technical users or young creators.

## Stage rules

### Choose / Intake / Intent

Inspect reality before changing it. Capture baseline, outcome, target, constraints, proof, commercial value, rollback, source rights, and greenfield/brownfield mode.

When a market/product idea is materially unproven, separate the durable human instinct from the first product shape. Research what is already proven, what can be made better, and what remains genuinely new.

### See + Shape / Vision + Blueprint / Spec

Name the smallest valuable human outcome, primary user journey, success signal, ownership promise, and what is intentionally out of scope. Create one buildable product/architecture contract. Reuse existing systems before adding new ones. For taste-sensitive work, name a real reference bar.

Choose a divergence mode:

- `STANDARD`: factual work, approved implementation, verification, security conclusions, migrations, destructive operations, and release.
- `DIVERGE`: about five materially different options for product, UX, positioning, creative direction, architecture alternatives, or debugging hypotheses.
- `FRONTIER`: broader tail exploration only for bounded, reversible experiments where novelty is worth the risk.

Verbalized Sampling may be used for `DIVERGE` or `FRONTIER`. Never treat a low verbalized probability as evidence of quality or truth.

Converge to one approved slice before Build.

### Plan

Turn the approved spec into independently verifiable slices. Name the files/surfaces likely to change, dependencies, risks, checks, proof, rollback, and human gates. The plan should be sufficient for a fresh worker to act without reconstructing the originating conversation.

### Make / Build

Implement one independently verifiable vertical slice. Inspect before editing. Reuse before adding. Keep rollback. Do not broaden scope because another idea or defect becomes visible.

Route engineering through the project’s canonical skills/workflow, but do not let a skill override ICM authority, scope, Council, Judge, rights, or human approval gates.

### Prove / Verify

Run native tests and the checks appropriate to the changed surface: browser/runtime, accessibility, security, performance, source/rights, code review, and no-slop review.

When a reference bar exists, compare the real artifact against the real reference with fresh context. Name the largest remaining gap.

A build, preview, merge, or deployment submission is not production proof.

### Challenge / Council

Use separately accountable perspectives for user value/commercial reality, architecture, failure, security/privacy, accessibility/taste, sovereignty/ownership, and proof proportional to consequence.

The builder may answer findings but may not be the only reviewer deciding readiness.

### Decide / Judge

Re-read Intent → Standard → Evidence. Apply hard stops before averaging scores. Missing proof, failed security/reliability/ownership gates, unresolved HOLDs, missing rights, or missing rollback produce `HOLD`.

Judge returns `SHIP` or `HOLD`; Judge does not rewrite the work it judges.

### Release / Ship

Verify destination, branch, environment, domains, data/credential ownership, public-asset rights, monitoring, backup, rollback, and post-release checks. Production release requires authorized human approval. After release, verify the live target environment before claiming production success.

### Operate / Learn / Improve

Compare the promise with actual use. Measure customer/user outcome, cost, incidents, accessibility, revenue/savings/validated learning, ownership health, and why people stay or leave.

Production signals may open a new `INTENT`, but consequential remediation still follows the same gates. Autonomous maintenance does not bypass Council, Judge, ownership, or rollback requirements.

Retention is earned through:

`measure → show → explain → improve → teach → measure again`

Do not use lock-in as a retention strategy.

## No-slop rule

AI slop is any important output that exists because the model defaulted to it instead of because the project chose it.

Check idea, strategy, copy, UI, architecture, code, business, and production output. Use context + reference + detector + fresh review + reality. A banned-pattern list or detector is evidence to inspect, not a substitute for judgment.

Ask: **What part of this exists because we chose it, and what part exists because the model defaulted to it?**

## Reference bar rule

When taste or comparative quality matters, the bar must be:

1. named;
2. fetchable;
3. comparable.

Pair it with a measurable standard when one exists. A fresh critic inspects both artifacts and names the largest remaining gap. Do not use adjectives like “premium” or “award-winning” as the quality bar.

## Source and rights rule

Record material external methods, code, text, design references, datasets, images, audio, and other third-party inputs with source, owner, license/terms, what was used, what changed, and distribution impact.

Possessing a media file is not by itself permission to publish it.

## Ownership rule

Before release, the owner should be able to find and control the code, data, repository, deployment, domain, billing, critical accounts, export path, documentation, and rollback. Another competent builder or agent should be able to continue without reconstructing the system from chat history.

## Invocation contract

Use one of these equivalent entry instructions:

- `Use Vibe Engineering.`
- `HOUSE this project.`
- `LOCK this into the Vibe house architecture.`
- `Read the Vibe Engineering skill and continue from current ICM state.`

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
