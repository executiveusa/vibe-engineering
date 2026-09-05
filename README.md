# Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

A free, open-source quality and architecture layer for building with AI without letting speed turn into slop.

Bring the idea. Vibe gives Claude Code, Codex, Cursor, OpenCode, custom agents, and humans the same walkable project system: one filesystem, one house skill, one artifact lifecycle, and proof before release.

## Install Vibe

### Claude Code — one-command plugin

```bash
claude plugin marketplace add executiveusa/vibe-engineering && claude plugin install vibe-engineering@vibe-engineering
```

Then invoke the canonical router with:

```text
Use Vibe Engineering.
```

### Codex — one command

Run this from the project you want Codex to work on:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Then tell Codex:

```text
Read AGENTS.md. Use the Vibe Engineering house skill. Continue from current ICM state.
```

### Any capable agent — one command

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

The installer is brownfield-safe by default. Existing owner-controlled project-law files are preserved unless you explicitly pass `--force`.

### Download the single House Skill

**[Download `Vibe Engineering — House Skill`](https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md)**

Or browse it first: [`skills/vibe-engineering/SKILL.md`](skills/vibe-engineering/SKILL.md).

The umbrella skill is the canonical router. Smaller skills remain available as internal procedures, but they do not create competing architectures.

See [`docs/INSTALL.md`](docs/INSTALL.md) for the complete installation contract.

## The Vibe Engineering house architecture

Vibe Engineering is the governance layer. ICM is the interpretable context architecture. The artifact lifecycle is how work moves. Orchestrators route work. Workers execute bounded slices.

```text
VIBE ENGINEERING
Governance / Constitution
        ↓
ICM
Context / durable state
        ↓
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
        ↓
HERMES / ORCHESTRATOR
        ↓
CLAUDE / CODEX / GPT / GEMINI / ORCA / HUMANS
```

The canonical artifact lifecycle is:

```text
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
```

Existing full-factory workspaces keep the compatible physical ICM folders:

```text
00_intake → 01_vision → 02_blueprint → 03_build → 04_verify
→ 05_council → 06_judge → 07_ship → 08_improve
```

Those directory names are mapped to the house lifecycle instead of being renamed, so existing workspaces do not need migration.

The canonical source lives in:

```text
skills/vibe-engineering/SKILL.md        one house router
_config/stage-system.yaml              lifecycle semantics + visual tokens
factory/icm/template/                  full project anatomy
docs/architecture/VIBE-HOUSE-ARCHITECTURE.md
```

## Semantic stage colors

`_config/stage-system.yaml` defines the canonical meaning and color token for each stage. The same tokens can drive Mermaid diagrams, dashboards, documentation, CLI status, and future Jarvis/Hermes surfaces.

Color communicates lifecycle state. It is not random decoration.

Prettier is separate: it normalizes code and supported text formatting. A formatter pass is never behavioral or production proof.

## One filesystem. Any capable agent.

The installed entry order is always:

```text
AGENTS.md → ICMR.yaml → CONTEXT.md
```

A universal install adds:

```text
AGENTS.md                         house law
ICMR.yaml                         machine-readable method/lifecycle
CONTEXT.md                        current state + next action
PROOF/                            evidence
.vibe/stage-system.yaml           semantic stage tokens
.vibe/skills/vibe-engineering/    canonical House Skill
.vibe/skills/                     supporting procedures
.vibe/manifest.json               install provenance
CLAUDE.md                         Claude Code adapter
.vibe/CODEX.md                    Codex adapter
.cursor/rules/vibe.mdc            Cursor adapter
.vibe/OPENCODE.md                 OpenCode adapter
```

Adapters point back to the same canonical filesystem instead of duplicating the law.

**No agent soup. One walkable system. Any capable agent can use it.**

## Use Vibe four ways

### 1. Files + folders

Works with any capable agent. Durable truth lives in the repository, not one vendor's hidden prompt or chat memory.

### 2. House skill / plugin

The canonical umbrella skill is:

```text
skills/vibe-engineering/SKILL.md
```

Use any of these equivalent instructions:

```text
Use Vibe Engineering.
HOUSE this project.
LOCK this into the Vibe house architecture.
Read the Vibe Engineering skill and continue from current ICM state.
```

Supporting skills include setup, grill, Project Review, Stop Slop, Human Voice, Deep Work, Taste, Proof, Ship, Loop Engineering, and the broader callable registry.

### 3. CLI

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
npx --yes --package=github:executiveusa/vibe-engineering vibe skills
npx --yes --package=github:executiveusa/vibe-engineering vibe run grill "my idea"
npx --yes --package=github:executiveusa/vibe-engineering vibe run proof "prove this is ready"
```

Or work from a clone:

```bash
git clone https://github.com/executiveusa/vibe-engineering.git
cd vibe-engineering
npm ci
npm run vibe -- skills
```

### 4. API + MCP

Live skills API:

```text
https://vibe-engineering-lime.vercel.app/api/v1/skills
```

Remote MCP endpoint:

```text
POST https://vibe-engineering-lime.vercel.app/api/mcp
```

Local MCP stdio adapter:

```bash
npm run mcp
```

The CLI, API, MCP, plugin, and installed-files surfaces resolve back to the same Vibe rules and skill definitions.

## The simple public workflow

For people who do not need the machinery underneath:

```text
TELL IT → SET THE STANDARD → MAKE IT → CHECK IT → PROVE IT
```

For every material decision:

```text
Intent → Standard → Evidence
```

**Intent:** What are we actually trying to do?

**Standard:** What should good look like?

**Evidence:** What proves we got there?

## We did the research so you do not have to

Vibe Engineering came from a practical problem: AI made building dramatically easier, but it did not automatically make judgment, review, usability, security, design taste, ownership, or production proof easier.

We studied experienced engineers, designers, open-source communities, review systems, and real production practices. Useful methods are adapted under one system, their sources stay visible, and no upstream work is silently renamed as original Vibe work.

Important influences include:

- Google Engineering Practices;
- `mattpocock/skills`;
- ICM / Jake Van Clief;
- Alibaba OpenCodeReview through `executiveusa/open-code-review`;
- Gauntlet Loop;
- `blader/humanizer`;
- `Leonxlnx/unlazy`;
- Impeccable and anti-default design work;
- `ayghri/i-have-adhd` for action-first, low-friction communication patterns.

See [`docs/governance/SOURCE-PROVENANCE-LEDGER.md`](docs/governance/SOURCE-PROVENANCE-LEDGER.md) and [`docs/UPSTREAM-INSPIRATION.md`](docs/UPSTREAM-INSPIRATION.md).

## Callable procedures

You do not need to memorize these. The House Skill chooses the smallest procedure required by the current ICM stage.

Core procedures include:

```text
vibe-engineering   canonical house router
setup-vibe         configure a repo
project-review     independent system-aware review
grill              get clear before coding
spec               turn intent into a build contract
build              implement a complete slice
proof              verify important claims
review             review against the spec
merge              resolve conflicts by intent
stop-slop          catch generic AI output
taste              check design judgment
ship               release exact proven revisions
loop-engineering   bounded long-running execution mode
```

The broader callable registry remains available through the CLI/API/MCP.

## Project Review

`project-review` is Vibe's dedicated completion-review procedure.

When available, Vibe standardizes on [`executiveusa/open-code-review`](https://github.com/executiveusa/open-code-review), a Vibe-enabled fork of Alibaba OpenCodeReview (Apache-2.0), for deterministic changed-file selection and structured AI review.

Vibe then adds system-impact checks, Stop Slop, taste, proof, ownership, rollback, and human release authority.

The review engine cannot authorize its own production release.

## ICM: the portable structure underneath Vibe

ICM makes the filesystem the map. A new human or agent should be able to enter a project and know where to look next without loading a swarm of personas or relying on previous chat history.

The reusable full project template lives under `factory/icm/template/`. The lightweight universal installer uses the same filesystem law without forcing a new application's source tree into a pre-existing project.

## Why it is free

Vibe Engineering is the operating system behind The Pauli Effect's AI-native product studio.

Giving the system away lets builders use our process before they ever hire us. The repository is inspectable. The rules are editable. Your code stays yours.

## License

MIT.

Use it, fork it, inspect it, improve it, and keep the attribution required by the upstream sources we rely on.

## Client Zero

This repository is Client Zero. Vibe Engineering is used to build and review Vibe Engineering itself.

A polished demo is not proof. Only call something shipped when the exact released revision has been checked in the real environment and there is a rollback path.
