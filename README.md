# Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

AI can build fast. That is useful, but it also makes it easy to create junk fast.

Vibe Engineering is an open-source set of skills that helps people and AI agents slow down at the right moments, ask better questions, make clearer decisions, catch slop, and prove the important parts actually work.

You do not need to be a developer to use it.

If you can explain what you want, what good looks like, and what would prove it works, you can use Vibe Engineering.

## Why this matters

AI is very good at producing an answer. It is not automatically good at knowing:

- what you really meant;
- whether the idea is worth building;
- whether the design fits your taste;
- whether the code is actually wired up;
- whether the copy sounds like a robot;
- whether the result works outside the demo;
- whether you still control the code, data, and recovery path.

That gap is where most AI slop comes from.

Vibe Engineering puts a repeatable process around that gap.

## The simple version

```text
Choose → See → Shape → Make → Prove → Challenge → Decide → Release → Learn
```

You do not have to memorize the whole system. Most of the time you call one skill for the problem in front of you.

Examples:

```bash
vibe run grill "help me figure out this app idea"
vibe run spec "turn this idea into a clear build plan"
vibe run stop-slop "review this landing page"
vibe run human-voice "make this copy sound like a person wrote it"
vibe run debug "this checkout works locally but fails in production"
vibe run proof "prove this release is actually ready"
```

The same skills are available through CLI, HTTP API, MCP, and the agent plugin.

## The three questions underneath everything

Every important decision uses the same small contract:

```text
Intent → Standard → Evidence
```

**Intent:** What are we actually trying to do, for whom, and why?

**Standard:** What should good look like before we get attached to the first answer?

**Evidence:** What can we check so we know the claim is true?

That is the core of Vibe Engineering.

## Built-in anti-slop

The `stop-slop` skill checks for the common ways AI output looks finished before it is good:

- robotic or generic copy;
- fake certainty and inflated claims;
- repeated ideas dressed up as different sections;
- default AI/SaaS design patterns;
- half-wired features;
- missing mobile, accessibility, empty, or error states;
- “done” claims with no proof;
- lock-in or missing owner control.

`human-voice` focuses on robotic writing. `taste` focuses on design judgment. `deep-work` stops large jobs from being declared finished too early. `proof` checks the important claims. `ship` is the release gate.

## The skill set

The canonical registry lives at [`src/skills/catalog.mjs`](src/skills/catalog.mjs).

It includes Vibe-native versions of the workflows we use most:

```text
ask-vibe           choose the right workflow
grill              align before coding
grill-idea         pressure-test a non-code idea
language           create shared project language
map                plan work too large for one session
spec               turn intent into a build contract
tickets            split work into small end-to-end slices
build              implement a complete slice
test-first         red / green / refactor
debug              diagnose with evidence
prototype          learn with throwaway code
research           answer questions from strong sources
module-design      make interfaces smaller and deeper
architecture-check find codebase design problems
review             review spec fidelity and code quality
merge              resolve conflicts by intent
triage             decide what an issue needs next
human-step         guide steps only a person can perform
handoff            let another agent continue cleanly
teach              teach without dumping information
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

The system was informed by useful ideas in MIT-licensed open-source work from `blader/humanizer`, `Leonxlnx/unlazy`, and `mattpocock/skills`. The Vibe skills are re-authored and adapted rather than copied wholesale. See [`docs/UPSTREAM-INSPIRATION.md`](docs/UPSTREAM-INSPIRATION.md).

## CLI

```bash
npm install
npm run vibe -- explain
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
POST /api/v1/run-skill
{
  "id": "stop-slop",
  "input": {
    "artifact": "landing page copy"
  }
}
```

The response is a deterministic execution packet. The caller or agent performs the procedure. The API does not quietly take external actions on its own.

## MCP

Remote endpoint:

```text
POST /api/mcp
```

MCP tools include:

```text
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

The router reads the canonical skill registry and sends work to the smallest useful Vibe procedure instead of forcing every task through the entire operating system.

## The deeper system

The simple skill layer sits on top of the full Vibe Engineering control plane:

```text
VIBE ENGINEERING
  ├─ human intent + taste
  ├─ callable skill registry
  ├─ anti-slop checks
  ├─ ICM stage contracts
  ├─ truth artifacts
  ├─ deterministic gates
  ├─ evidence + provenance
  │
  ├─ CLI
  ├─ HTTP API
  ├─ MCP
  ├─ agent plugin
  └─ CI / release proof
```

That deeper machinery is there when the work is important enough to need it. It should not make the basic experience confusing.

## Client Zero

This repository is the first Client Zero. Vibe Engineering is used on Vibe Engineering itself.

If the method cannot survive its own checks, it is not ready to teach or ship.

## Run and prove locally

```bash
npm ci
npm run check
npm audit --audit-level=high
npm run dev
```

## Production rule

A polished demo is not the same thing as a verified release.

Build, test, review, merge, deploy, and production verification are separate facts. Only call something shipped when the exact released revision has been checked in the live environment and has a rollback path.
