# Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

Built by The Pauli Effect · 2026 · Part of the Pauli Suite.

Vibe Engineering is a way of thinking before you build.

Take an idea. Break it down. Question it. Test it. Turn it into something real.

AI is part of the process. The bigger skill is learning how to make better decisions.

## The habit

Public memory aid:

```text
Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn
```

Underneath those words is the ICM stage flow:

```text
00_intake
01_vision
02_blueprint
03_build
04_verify
05_council
06_judge
07_ship
08_improve
```

Every material decision uses one small contract:

```text
Intent → Standard → Evidence
```

- **Intent** — what are we trying to change, for whom, and why?
- **Standard** — what does good look like before we get attached to our own answer?
- **Evidence** — what observable result would make the claim true?

See [`docs/VIBE-ENGINEERING-V2-DOCTRINE.md`](docs/VIBE-ENGINEERING-V2-DOCTRINE.md).

## What it teaches

Vibe Engineering is not only an AI workflow.

- Question the answer — critical thinking.
- See what connects — systems thinking.
- Get back to what is true — first principles.
- Build one piece and prove it — discipline.

The public language stays simple. The professional engineering contracts remain available underneath it.

## Client Zero

This repository is the first Client Zero.

The Pauli Effect uses Vibe Engineering on Vibe Engineering before presenting it as a customer standard. Homepage changes, method changes, ICM changes, interfaces, reviews, rights checks, deployment, ownership, and rollback go through the same workflow.

A method that cannot survive its own rules is not ready to teach.

## No slop

AI slop is important output that exists because the model defaulted to it instead of because the project deliberately chose it.

Vibe checks slop across:

- ideas and strategy;
- copy and UI;
- architecture and code;
- business value;
- production claims.

The cure is not a larger banned-pattern list. Use context, a real reference where useful, deterministic detectors where useful, fresh review, and reality.

Ask:

> What part of this exists because we chose it, and what part exists because the model defaulted to it?

## Controlled divergence

Open-ended work can collapse into the same predictable answer. Vibe supports three modes:

- **STANDARD** — factual work, approved implementation, verification, security conclusions, migrations, destructive actions, and release.
- **DIVERGE** — a small set of materially different options for product, UX, positioning, creative direction, architecture alternatives, or debugging hypotheses.
- **FRONTIER** — wider tail exploration only for bounded, reversible experiments where novelty is worth the risk.

Verbalized Sampling can support DIVERGE and FRONTIER. Its probability labels are exploration signals, not truth. The workflow converges before Build.

## Quality and independent review

When taste or comparative quality matters, use a reference bar that is:

1. named;
2. fetchable;
3. comparable.

The builder does not perform the only comparison. Fresh reviewers challenge user value, architecture, failure modes, security/privacy, accessibility/taste, sovereignty/ownership, commercial reality, and proof proportional to consequence.

Judge returns `SHIP` or `HOLD` and does not rewrite the work it judges.

The default Vibe Score release floor remains **8.5/10** with hard stops for security, reliability, and ownership.

## Ownership and retention

A customer should stay because the system keeps producing value, not because leaving was made difficult.

The owner should be able to understand, export, move, replace providers/builders, recover, and continue operating.

Earned retention loop:

```text
measure → show → explain → improve → teach → measure again
```

## One ICM core, many interfaces

There is no Vibe Engineering agent that owns the process.

The method lives in inspectable files and machine-readable truth. Humans and agents use the same core through different adapters:

```text
VIBE ENGINEERING CORE
  ├─ ICM stage contracts
  ├─ Truth artifacts
  ├─ deterministic gates
  ├─ source + evidence records
  │
  ├─ human workspace
  ├─ CLI
  ├─ HTTP API
  ├─ MCP
  ├─ Agent Skill / plugin
  └─ CI / hooks
```

### CLI

Start the local Truth API:

```bash
npm run truth:api
```

Then in another shell:

```bash
npm run vibe -- method
npm run vibe -- manifest
npm run vibe -- truth method.vibe-engineering-v2
npm run vibe -- workflow workflow.a2a-software-factory
npm run vibe -- context executiveusa/vibe-engineering high
```

Set `VIBE_TRUTH_API_URL` to use a remote deployment.

### HTTP API

Existing read-only Truth API:

```text
GET  /api/v1/manifest
GET  /api/v1/truth/:id
GET  /api/v1/workflows/:id
POST /api/v1/resolve-context
```

Canonical method artifact:

```text
method.vibe-engineering-v2
```

### MCP

Remote stateless endpoint:

```text
POST /api/mcp
```

The endpoint targets MCP protocol `2026-07-28` and exposes:

```text
vibe_method
vibe_truth
vibe_workflow
vibe_context
```

Local stdio adapter:

```bash
npm run mcp
```

### Agent skill / plugin

Portable skill:

```text
skills/vibe-engineering/SKILL.md
```

Claude Code plugin metadata lives under `.claude-plugin/`. Other `SKILL.md`-compatible agents can use the skill directly.

## ICM factory

Create a complete governed workspace:

```bash
npm install
npm run factory:new -- --name "Neighborhood Health Guide"
```

Verify the structure:

```bash
npm run factory:doctor -- ./workspaces/neighborhood-health-guide
```

A passing factory doctor proves structure only. It does not prove the product is built, secure, accessible, rights-cleared, deployed, owned correctly, useful to a customer, or live in production.

See [`factory/icm/README.md`](factory/icm/README.md).

## Engineering workflow

`executiveusa/pauli-agent-skills-2026` remains the canonical engineering procedure library beneath Vibe/ICM governance.

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

Vibe/ICM controls what, why, whether, evidence, authority, ownership, and release boundaries. Engineering skills control how an approved software slice is executed.

## Source and provenance

Vibe Engineering combines Pauli Effect practice with credited research and open-source methods. External influence is recorded instead of silently relabeled.

See [`docs/governance/SOURCE-PROVENANCE-LEDGER.md`](docs/governance/SOURCE-PROVENANCE-LEDGER.md).

The ledger currently covers the Agent Skills procedure layer, ICM, Gauntlet/reference-bar thinking, Verbalized Sampling, Impeccable, Uncodixfy, Stop Slop, Humanizer, i-have-adhd, Pauli Scroll World, Proven-Better-New, Google engineering practices, and Council/context influences.

Third-party media intended for public release requires an appropriate rights record. Possession of a file alone is not treated as distribution permission.

## Run and prove locally

```bash
npm ci
npm run check
npm audit --audit-level=high
npm run dev
```

## Repository map

```text
AGENTS.md                                      Layer 0 repository policy
CONTEXT.md                                     Layer 1 repository router
docs/VIBE-ENGINEERING-V2-DOCTRINE.md           Canonical human-readable v2 method
docs/governance/SOURCE-PROVENANCE-LEDGER.md    Influence/license ledger
factory/icm/template/stages/*                   Layer 2 stage contracts
factory/icm/template/shared/*                   Layer 3 Vibe standards
factory/icm/template/references/*               Layer 3 external/project references
truth/sources/vibe-engineering-v2.json          Machine-readable method
src/truth/*                                     Truth compiler/API/runtime
packages/truth-sdk/*                            JavaScript/TypeScript client
scripts/vibe.mjs                                CLI
src/mcp/core.mjs                                MCP method/tool adapter
api/mcp.mjs                                     Remote stateless MCP endpoint
scripts/vibe-mcp-stdio.mjs                      Local stdio MCP adapter
skills/vibe-engineering/SKILL.md                Portable agent skill
.claude-plugin/*                                Plugin packaging
src/                                            Public Client Zero site
```

## Production rule

Build, test, review, merge, preview, and deployment submission are separate facts.

Do not claim production success until the authorized release has occurred and the live target environment has been checked.