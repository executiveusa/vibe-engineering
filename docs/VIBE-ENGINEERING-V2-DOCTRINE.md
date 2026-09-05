# Vibe Engineering v2 doctrine

> **Status: historical doctrine / compatibility reference.** The current general method is governed by `skills/vibe-engineering/SKILL.md` and `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md`. This document preserves the reasoning and public-language development that led to the House architecture. When terminology differs, use the current House lifecycle: `INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`.

Built by The Pauli Effect · 2026 · Part of the Pauli Suite

## The public idea

Vibe Engineering is a way of thinking before you build.

Take an idea. Break it down. Question it. Test it. Turn it into something real.

AI is part of the process. The bigger skill is learning how to make better decisions.

**V.I.B.E. = Verify It Before Everything.**

The public language stays simple enough to remember:

`Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn`

The technical contracts underneath those words may be rigorous. The person using the method should not need to learn the jargon before they can use the habit.

## Current House mapping

The v2 physical/public stages map to the current semantic House lifecycle:

```text
00 Intake / Choose      → INTENT
01 Vision / See         → SPEC
02 Blueprint / Shape    → PLAN
03 Build / Make         → BUILD
04 Verify / Prove       → PROOF
05 Council / Challenge  → COUNCIL
06 Judge / Decide       → JUDGE
07 Ship / Release       → SHIP
08 Improve / Learn      → OPERATE
```

These names are compatibility/history labels, not a second method.

## What V.I.B.E. trains

Vibe Engineering is not only an AI workflow. It practices four transferable abilities:

1. **Critical thinking** — question the answer before building on top of it.
2. **Systems thinking** — see what a decision connects to and what it changes later.
3. **First principles** — strip a problem down to the facts it cannot work without.
4. **Discipline** — finish and prove small moves instead of collecting unfinished motion.

The goal is a creator who can make better decisions with or without a particular model, tool, employer, or platform.

## The three-part contract

Every material decision carries three fields:

### Intent

What are we trying to change, for whom, and why?

### Standard

What does good look like before the builder becomes attached to its own answer?

A standard should be observable. When taste is involved, prefer a named, fetchable, comparable reference over adjectives such as “premium” or “award-winning.”

### Evidence

What would make the claim true?

Evidence may be a test, browser behavior, customer action, metric, live endpoint, accessibility result, security finding, review artifact, payment, or other observable outcome. Confidence is not evidence.

## Seven operating laws

### 1. Reality before invention

Research the real user, problem, market, product, repository, deployment, and constraints before adding a new answer.

When validating an idea, separate the durable human instinct from the first product shape. Map what is already proven, what is materially better, and what is genuinely new. Treat the new parts as hypotheses rather than identity.

### 2. Diverge before deciding, only when divergence helps

Open-ended work can collapse into the most common model answer. Vibe Engineering may use Verbalized Sampling or another model-agnostic diversity technique to surface materially different options.

Divergence is an exploration tool, not a truth tool.

Use three modes:

- **STANDARD** — one grounded path for factual work, approved implementation, verification, security conclusions, migrations, release, and other reality-convergent work.
- **DIVERGE** — about five materially different candidates for product, UX, positioning, architecture alternatives, debugging hypotheses, and creative direction.
- **FRONTIER** — a larger tail search for bounded experiments when conventional approaches have failed or the upside of novelty is worth the extra risk.

Never select an option because it is rare. Select after constraint checks, independent judgment, and evidence.

### 3. Converge before Build

The Build stage receives one approved slice with boundaries, proof, and rollback. It does not keep redesigning the product while implementing it.

Exploration belongs before commitment. Verification may reopen a decision when evidence proves the committed path wrong.

### 4. Default is not a decision

AI slop is any output that comes from a model default instead of deliberate intent, a reference, evidence, or human judgment.

Slop can appear in ideas, strategy, copy, UI, architecture, code, business, and production claims.

The response is not a larger banned-pattern list. The response is intent + reference + detector + fresh review + reality.

### 5. Fresh eyes beat self-approval

The builder may explain its work but may not be the only authority deciding that the work is ready.

For taste-sensitive work, use a named/fetchable/comparable reference bar and compare the actual artifact against it. For consequential work, Council and Judge retain separate authority. Judge returns only `SHIP` or `HOLD`.

### 6. Small finished moves beat wide unfinished motion

Build one independently verifiable slice at a time. A slice has an objective, constraints, proof, rollback, and a visible end.

### 7. Retention is earned

Do not create customer dependence to manufacture retention.

The customer should be able to understand the system, export the data, move the hosting, replace the model, replace the builder, and continue operating.

Retention is earned when the system keeps producing visible value:

`measure → show → explain → improve → teach → measure again`

## ICM is the operating structure

Vibe Engineering does not require a Vibe Engineering agent.

The method lives in inspectable files. Any capable human or agent can enter through the repository policy and current-stage router.

ICM layers remain:

- **Layer 0** — identity, law, authority;
- **Layer 1** — routing;
- **Layer 2** — one stage, one job;
- **Layer 3** — stable method, quality, brand, source, and domain references;
- **Layer 4** — current working artifacts and evidence.

`factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` is now the global Layer 3 House doctrine. Heart & Soul remains a subordinate design/experience standard within that House contract.

One fact gets one home. Routing files stay small. Working sessions end in artifacts another human or agent can inspect.

## Truth rules now made explicit

```text
BUILT ≠ VERIFIED
CI PASS ≠ CUSTOMER VALUE
DEPLOYED ≠ PRODUCTION PROOF
FORMAT PASS ≠ BEHAVIORAL PROOF
```

## Client Zero rule

The Pauli Effect uses Vibe Engineering on Vibe Engineering before presenting it as a customer standard.

Every major change to the method must leave evidence of approved intent, standard, implementation, verification, independent challenge, source/provenance changes, rollback, and real outcome after release.

A method that cannot survive its own rules is not ready to teach.

## Distribution architecture

There is one canonical method and many adapters.

```text
VIBE ENGINEERING HOUSE
  ├─ House Skill / router
  ├─ VIBE_HOUSE_STANDARD.md
  ├─ ICM context + stage contracts
  ├─ deterministic gates
  └─ source + evidence records
         │
         ├─ CLI
         ├─ HTTP API
         ├─ MCP server
         ├─ Agent Skill / plugin
         ├─ CI / hooks
         └─ human-readable workspace
```

Adapters may change. The method, authority hierarchy, proof rules, and ownership rules do not silently fork by provider.

## Source and provenance rule

Vibe Engineering is a Pauli Effect methodology assembled from original practice plus credited external research and open-source patterns. External ideas remain attributable. Code and text copied or adapted under license keep the notices required by that license.

The canonical ledger is `docs/governance/SOURCE-PROVENANCE-LEDGER.md`.
