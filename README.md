# Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

Vibe Engineering is a free, open-source quality and architecture layer for building with AI without letting speed turn into slop.

It gives Claude Code, Codex, Cursor, OpenCode, custom agents, and humans the same walkable project system: one filesystem, one House Skill, one artifact lifecycle, and proof before release.

## Start a project

### Claude Code — one-command plugin

```bash
claude plugin marketplace add executiveusa/vibe-engineering && claude plugin install vibe-engineering@vibe-engineering
```

Then say:

```text
Use Vibe Engineering. Refresh from the canonical upstream first, continue from current ICM state, and take this through the next valid gate without skipping proof.
```

### Codex / any repository agent — one command

Run this inside the project:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Then say:

```text
Read AGENTS.md. Use the Vibe Engineering House Skill. Refresh upstream first and continue from current ICM state.
```

The installer is brownfield-safe by default. Existing owner-controlled project-law files are preserved unless you explicitly use `--force`.

## Copy the full upstream-first AI prompt

Use the canonical project-start prompt when you want another AI repository worker to pull the latest Vibe contract before it works:

**[`docs/PROJECT-START-PROMPT.md`](docs/PROJECT-START-PROMPT.md)**

Canonical upstream:

```text
https://github.com/executiveusa/vibe-engineering
```

Canonical House Skill:

```text
https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md
```

The rule is simple: **when upstream is reachable, inspect the current House Skill before material work.** Local copies make Vibe portable; they do not silently become a separate methodology.

## Download the single House Skill

**[Download `Vibe Engineering — House Skill`](https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md)**

Repository path:

```text
skills/vibe-engineering/SKILL.md
```

The umbrella skill is the canonical router. Smaller skills are supporting procedures, not competing frameworks.

## The House architecture

```text
VIBE ENGINEERING
Governance / Constitution
        ↓
ICM
Interpretable context / durable state
        ↓
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
        ↓
HERMES / ORCHESTRATOR
        ↓
CLAUDE / CODEX / GPT / GEMINI / ORCA / HUMANS
```

The layers have one job each:

- **Vibe Engineering** — governance, ownership, release law, proof requirements.
- **ICM** — where facts, assumptions, artifacts, evidence, and current state live.
- **Artifact lifecycle** — how work moves through the project.
- **Orchestrator** — routes approved work to the next worker/stage.
- **Workers** — replaceable implementation agents or humans.

The filesystem is the durable source of truth. Chat history and model memory are adapters, not architecture.

## Canonical lifecycle

```text
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
```

Existing full-factory workspaces keep the compatible physical stage folders:

```text
00_intake      → INTENT
01_vision      → SPEC
02_blueprint   → PLAN
03_build       → BUILD
04_verify      → PROOF
05_council     → COUNCIL
06_judge       → JUDGE
07_ship        → SHIP
08_improve     → OPERATE
```

The physical names remain for compatibility. The semantic House lifecycle is authoritative.

## What gets installed

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

Installed entry order:

```text
AGENTS.md → ICMR.yaml → CONTEXT.md → .vibe/skills/vibe-engineering/SKILL.md
```

**No agent soup. One walkable system. Any capable agent can use it.**

## Semantic stage colors

`_config/stage-system.yaml` defines the canonical meaning and color token for each lifecycle stage. Those tokens can drive Mermaid diagrams, dashboards, documentation, CLI status, and orchestration interfaces.

Color communicates lifecycle meaning. It is not random decoration.

Prettier is separate: it normalizes supported code/text formatting. A formatter pass is never behavioral or production proof.

## Truth rules

```text
BUILT ≠ VERIFIED
CI PASS ≠ CUSTOMER VALUE
DEPLOYED ≠ PRODUCTION PROOF
FORMAT PASS ≠ BEHAVIORAL PROOF
```

Builders cannot approve themselves. Council provides independent challenge. Judge is release authority only and returns `SHIP` or `HOLD`.

## Use Vibe four ways

### 1. Files + folders

Works with any capable agent. Durable truth lives in the repository rather than in one vendor's hidden prompt or previous chat.

### 2. House Skill / plugin

Invoke with any of these:

```text
Use Vibe Engineering.
HOUSE this project.
LOCK this into the Vibe House architecture.
Refresh upstream and continue from current ICM state.
```

### 3. CLI

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
npx --yes --package=github:executiveusa/vibe-engineering vibe skills
npx --yes --package=github:executiveusa/vibe-engineering vibe run grill "my idea"
npx --yes --package=github:executiveusa/vibe-engineering vibe run proof "prove this is ready"
```

### 4. API + MCP

Production app:

```text
https://vibe-engineering-lime.vercel.app
```

Live skills API:

```text
GET https://vibe-engineering-lime.vercel.app/api/v1/skills
```

Remote MCP endpoint:

```text
POST https://vibe-engineering-lime.vercel.app/api/mcp
```

Local MCP:

```bash
npm run mcp
```

The CLI, API, MCP, plugin, and installed-files surfaces resolve back to the same House rules and skill definitions.

## Full factory workspace

For a new project that should start with the complete numbered ICM structure:

```bash
git clone https://github.com/executiveusa/vibe-engineering.git
cd vibe-engineering
npm ci
npm run factory:new -- --name "My Project" --mode greenfield
```

## Core docs

- [`docs/PROJECT-START-PROMPT.md`](docs/PROJECT-START-PROMPT.md) — upstream-first prompt for repository agents.
- [`docs/METHOD.md`](docs/METHOD.md) — canonical lifecycle and stage contracts.
- [`docs/INSTALL.md`](docs/INSTALL.md) — installation/adapters.
- [`docs/architecture/VIBE-HOUSE-ARCHITECTURE.md`](docs/architecture/VIBE-HOUSE-ARCHITECTURE.md) — architecture contract.
- [`docs/agent-context.md`](docs/agent-context.md) — current repository context for agents.
- [`skills/vibe-engineering/SKILL.md`](skills/vibe-engineering/SKILL.md) — canonical House router.

## Callable procedures

The House Skill chooses the smallest procedure required by the current ICM stage. Core procedures include:

```text
vibe-engineering   canonical house router
setup-vibe         configure a repo
project-review     independent system-aware review
grill              get clear before coding
spec               turn intent into a build contract
build              implement a bounded slice
proof              verify important claims
review             review against the spec
merge              resolve conflicts by intent
stop-slop          catch generic AI output
taste              check design judgment
ship               release exact proven revisions
loop-engineering   bounded long-running execution
```

## Upstream influences

Vibe Engineering combines practical lessons from engineering, design, review, and open-source systems under one explicit governance model. Useful methods remain attributed rather than silently renamed.

Important influences include Google Engineering Practices, `mattpocock/skills`, ICM / Jake Van Clief, Alibaba OpenCodeReview via `executiveusa/open-code-review`, Gauntlet Loop, `blader/humanizer`, `Leonxlnx/unlazy`, Impeccable/anti-default design practices, and `ayghri/i-have-adhd` for action-first low-friction communication.

See [`docs/governance/SOURCE-PROVENANCE-LEDGER.md`](docs/governance/SOURCE-PROVENANCE-LEDGER.md) and [`docs/UPSTREAM-INSPIRATION.md`](docs/UPSTREAM-INSPIRATION.md).

## License

MIT.

Use it, fork it, inspect it, improve it, and preserve attribution required by upstream sources.

## Client Zero

This repository is Client Zero. Vibe Engineering is used to build and review Vibe Engineering itself.

A polished demo is not proof. Only call something shipped when the exact released revision has been checked in the real environment and there is a rollback path.
