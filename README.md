# Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

AI can make software fast now.

That is powerful. It also means you can make the wrong thing, badly, faster than ever.

Vibe Engineering is an open-source set of skills that helps you use AI without losing the part that matters most: your judgment.

You do not need to know how to code.

You need to be able to answer three questions:

1. What are we trying to make?
2. What should good look like?
3. How will we know it actually works?

That is Vibe Engineering.

## Why should you care?

AI is good at generating things.

It is not automatically good at knowing what you meant, whether the idea is worth building, whether the design feels right, whether the feature is actually connected, or whether the finished product works outside a demo.

That is how AI slop happens.

You get something that looks finished, sounds confident, and falls apart when you really use it.

Vibe Engineering gives you a repeatable way to catch that before it ships.

It helps you:

- think through an idea before building it;
- get the AI to ask better questions;
- keep your own taste and point of view;
- turn fuzzy ideas into clear build instructions;
- catch robotic writing and generic AI design;
- stop agents from saying “done” too early;
- test important claims;
- keep control of your code, data, and recovery path.

## The simple idea

```text
Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn
```

That is the plain-language memory aid. For substantial software work, the required delivery lifecycle is:

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

You do not need to run the whole process every time. Most of the time, you call the skill you need.

```bash
vibe run setup-vibe "configure this repo"
vibe run grill "help me figure out this app idea"
vibe run spec "turn this idea into a build plan"
vibe run stop-slop "review this landing page"
vibe run human-voice "make this sound like a person wrote it"
vibe run debug "this works locally but breaks in production"
vibe run proof "prove this release is actually ready"
```

The same skills can be called through the CLI, HTTP API, MCP, or an agent plugin.

## Built-in Stop Slop

`stop-slop` is one of the main Vibe skills. It looks for the common ways AI work appears finished before it is actually good:

- robotic copy;
- generic AI or SaaS-looking design;
- repeated ideas pretending to be more content;
- fake certainty;
- inflated claims;
- half-connected features;
- missing mobile, accessibility, empty, or error states;
- “done” claims with no proof;
- lock-in or missing owner control.

Other skills focus on specific problems:

- `human-voice` fixes robotic writing;
- `taste` reviews design judgment;
- `deep-work` stops large jobs from being declared finished too early;
- `proof` checks whether important claims are true;
- `ship` controls release.

## The three questions underneath everything

Every important Vibe decision uses the same small contract:

```text
Intent → Standard → Evidence
```

**Intent:** What are we actually trying to do, for whom, and why?

**Standard:** What should good look like before we fall in love with the first answer?

**Evidence:** What can we check so we know it is true?

If a young builder learns that habit, they are already doing real engineering thinking.

## The backend is walkable by design

The backend is organized around ICM: the filesystem is the map, and a new human or AI agent should be able to enter the repo and understand where things live without guessing.

Start here:

```text
AGENTS.md                repository law
ICMR.yaml                Step 0 runtime contract
icm/README.md            backend router
icm/WALK.md              walk-test instructions
icm/backend/map.mjs      machine-readable backend map
icm/backend/index.mjs    stable backend facade
```

Then open only the domain you need:

```text
src/truth/      approved truth compiler/runtime
src/skills/     callable Vibe procedures
src/icmr/       Step 0 detection/compile/validation
src/mcp/        MCP protocol adapter
factory/icm/    reusable ICM workspace architecture
```

Run the walk test:

```bash
npm run icm:walk
npm run vibe -- map
npm run vibe -- walk
```

A walk-test PASS means the mapped backend structure and interfaces are internally coherent. It does not replace product proof, independent review, or release authority.

## What is inside

The complete callable registry lives at [`src/skills/index.mjs`](src/skills/index.mjs), with the core procedures in [`src/skills/catalog.mjs`](src/skills/catalog.mjs).

Current skills include:

```text
setup-vibe         configure a repo for Vibe skills
ask-vibe           choose the right workflow
grill              get clear before coding
grill-idea         pressure-test an idea
language           create shared project language
map                break down large work
spec               turn intent into a build contract
tickets            split work into small end-to-end pieces
build              implement a complete slice
test-first         red / green / refactor
debug              diagnose with evidence
prototype          learn with throwaway code
research           answer questions from strong sources
module-design      make interfaces smaller and clearer
architecture-check find structural code problems
review             review the work against the spec
merge              resolve conflicts by intent
triage             decide what an issue needs next
human-step         guide steps only a person can perform
handoff            let another agent continue cleanly
teach              explain without dumping information
ask-human          create a focused questionnaire
explain            translate confusing system language
interview          reusable question loop
agent-docs         write instructions agents can follow
stop-slop          catch generic and unfinished AI output
human-voice        remove robotic AI writing
deep-work          stop premature completion
taste              check design judgment
proof              verify important claims
ship               release exact proven revisions
```

## Open source and attribution

Vibe Engineering is MIT licensed.

The system was informed by useful ideas from other MIT-licensed open-source projects, including:

- `blader/humanizer`
- `Leonxlnx/unlazy`
- `mattpocock/skills`

The Vibe versions are re-authored and adapted to fit the Vibe Engineering method rather than copied and silently renamed.

See [`docs/UPSTREAM-INSPIRATION.md`](docs/UPSTREAM-INSPIRATION.md) and [`docs/governance/SOURCE-PROVENANCE-LEDGER.md`](docs/governance/SOURCE-PROVENANCE-LEDGER.md).

## CLI

```bash
npm install
npm run vibe -- explain
npm run vibe -- map
npm run vibe -- walk
npm run vibe -- skills
npm run vibe -- skill grill
npm run vibe -- run stop-slop "review this homepage"
```

Existing truth and context commands still work:

```bash
npm run vibe -- method
npm run vibe -- manifest
npm run vibe -- truth method.vibe-engineering-v2
npm run vibe -- workflow workflow.a2a-software-factory
npm run vibe -- context executiveusa/vibe-engineering high
```

## HTTP API

```text
GET  /api/v1/icm/map
GET  /api/v1/icm/walk
GET  /api/v1/skills
GET  /api/v1/skills/:id
POST /api/v1/run-skill
GET  /api/v1/manifest
GET  /api/v1/truth/:id
GET  /api/v1/workflows/:id
POST /api/v1/resolve-context
```

Example:

```json
{
  "id": "stop-slop",
  "input": {
    "artifact": "landing page copy"
  }
}
```

The API returns deterministic maps, checks, truth, and procedure packets. The calling agent performs procedures under its own permissions. The API does not quietly take external actions or authorize production release.

## MCP

Remote endpoint:

```text
POST /api/mcp
```

Available MCP tools include:

```text
vibe_icm_map
vibe_walk
vibe_skills
vibe_skill
vibe_run_skill
vibe_method
vibe_truth
vibe_workflow
vibe_context
vibe_detect
vibe_compile_icmr
vibe_validate_icmr
```

For substantial work, Vibe still requires reading the applicable repository rules, Step 0 detection, ICMR compilation and validation, then the `DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP` lifecycle.

Local stdio adapter:

```bash
npm run mcp
```

## Agent plugin

Plugin metadata lives in `.claude-plugin/`.

The main router skill is:

```text
skills/vibe/SKILL.md
```

Core direct skills are committed under `skills/`.

To materialize missing or empty generated skill files:

```bash
npm run skills:export
```

The exporter refuses to overwrite a non-empty `SKILL.md` by default. Use `npm run skills:export -- --force` only when you intentionally want to replace generated skill files.

## Under the hood

```text
VIBE ENGINEERING
  ├─ human intent + taste
  ├─ ICM walk/router
  ├─ callable skill registry
  ├─ Stop Slop checks
  ├─ ICM stage contracts
  ├─ truth artifacts
  ├─ deterministic gates
  ├─ evidence + provenance
  │
  └─ icm/backend/index.mjs
       ├─ CLI
       ├─ HTTP API
       └─ MCP
```

The deeper machinery exists when the work needs it. The person using Vibe should not have to understand all of it just to get started.

## Client Zero

This repository is Client Zero. Vibe Engineering is used to build and review Vibe Engineering itself.

If the method cannot survive its own checks, it is not ready to teach or ship.

## Run it locally

```bash
npm ci
npm run check
npm run icm:walk
npm audit --audit-level=high
npm run dev
```

## One rule before shipping

A polished demo is not proof.

Build, test, review, merge, deploy, and production verification are different things.

Only call something shipped when the exact released revision has been checked in the real environment and there is a rollback path.
