# Install Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

The canonical product is the filesystem. Claude Code, Codex, Cursor, OpenCode, CLI, MCP, API, and future agents are adapters to the same Vibe Engineering House architecture.

## Claude Code — one-command plugin

```bash
claude plugin marketplace add executiveusa/vibe-engineering && claude plugin install vibe-engineering@vibe-engineering
```

Then invoke:

```text
Use Vibe Engineering.
```

The plugin installs the canonical `vibe-engineering` House Skill plus supporting procedures.

## Codex — one command

From the project you want Codex to work on:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Then tell Codex:

```text
Read AGENTS.md. Use the Vibe Engineering house skill. Continue from current ICM state.
```

Codex enters through the same filesystem contract as every other agent.

## Any capable agent — 60-second install

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Then use:

```text
Read AGENTS.md. Use Vibe Engineering. Continue from current ICM state.
```

The installer is brownfield-safe by default. Existing project files are preserved unless you explicitly pass `--force`.

## Download the House Skill directly

Raw skill file:

```text
https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md
```

Repository path:

```text
skills/vibe-engineering/SKILL.md
```

## What gets installed

```text
AGENTS.md                         project/house law
ICMR.yaml                         portable runtime + lifecycle contract
CONTEXT.md                        current state + next action
PROOF/                            evidence and release proof
.vibe/manifest.json               install provenance
.vibe/stage-system.yaml           semantic lifecycle tokens
.vibe/skills/vibe-engineering/    canonical House Skill
.vibe/skills/                     supporting Vibe procedures
CLAUDE.md                         Claude Code adapter
.cursor/rules/vibe.mdc            Cursor adapter
.vibe/CODEX.md                    Codex adapter
.vibe/OPENCODE.md                 OpenCode adapter
```

The entry order is always:

```text
AGENTS.md → ICMR.yaml → CONTEXT.md
```

The canonical lifecycle is:

```text
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
```

## Existing project

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

If `AGENTS.md`, `ICMR.yaml`, `CONTEXT.md`, `CLAUDE.md`, or the Cursor rule already exists, Vibe preserves it and reports the file as skipped. It also writes `.vibe/INSTALL-NOTES.md` when owner-controlled project law needs to be merged by intent.

Use `--force` only when you intentionally want Vibe to refresh managed files:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install . --force
```

## Minimal install without portable skills

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install . --no-skills
```

This mode installs the filesystem contract and adapters but intentionally omits `.vibe/skills/`.

## Full ICM factory workspace

For a new project where you want the full numbered ICM stage structure rather than the lightweight brownfield installer:

```bash
git clone https://github.com/executiveusa/vibe-engineering.git
cd vibe-engineering
npm ci
npm run factory:new -- --name "My Project" --mode greenfield
```

The full factory preserves the compatible physical stage folders while mapping them to the House lifecycle.

## Use with agents

### Claude Code

The plugin is the cleanest install. The universal filesystem installer also creates a small `CLAUDE.md` adapter that points back to the canonical root files and House Skill.

### Codex

Codex enters through root `AGENTS.md`. `.vibe/CODEX.md` points to the same ICM state and canonical House Skill.

### Cursor

`.cursor/rules/vibe.mdc` is an always-on adapter that tells Cursor to read the same canonical files and router.

### OpenCode

`.vibe/OPENCODE.md` documents the same filesystem entry. Vibe does not require an OpenCode-specific orchestration layer.

### Any other capable agent

Give it the repository and this instruction:

```text
Read AGENTS.md, then ICMR.yaml, then CONTEXT.md. Use .vibe/skills/vibe-engineering/SKILL.md as the canonical router. Verify It Before Everything.
```

No vendor switch should require redesigning the project.

## CLI

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe skills
npx --yes --package=github:executiveusa/vibe-engineering vibe run grill "my idea"
npx --yes --package=github:executiveusa/vibe-engineering vibe run proof "prove this release"
```

## MCP

For a local clone:

```bash
npm run mcp
```

Remote MCP:

```text
POST https://vibe-engineering-lime.vercel.app/api/mcp
```

## API

Skills:

```text
GET https://vibe-engineering-lime.vercel.app/api/v1/skills
```

The API, MCP, CLI, plugin surface, and installed files resolve back to the same Vibe rules and skills.

## Rule

**No agent soup. One walkable system. Any capable agent can use it.**
