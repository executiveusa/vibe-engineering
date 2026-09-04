# Install Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

The canonical product is the filesystem. Claude Code, Codex, Cursor, OpenCode, CLI, MCP, API, and future agents are adapters to the same project law.

## 60-second install

From the project you want to improve:

```bash
npx --yes github:executiveusa/vibe-engineering install .
```

Then tell your agent:

```text
Read AGENTS.md. Follow Vibe. Verify It Before Everything.
```

The installer is brownfield-safe by default. Existing project files are preserved unless you explicitly pass `--force`.

## What gets installed

```text
AGENTS.md                 project law
ICMR.yaml                 portable runtime / method contract
CONTEXT.md                current state + next action
PROOF/                    evidence and release proof
.vibe/manifest.json       install provenance
.vibe/skills/             portable Vibe skills
CLAUDE.md                 Claude Code adapter
.cursor/rules/vibe.mdc    Cursor adapter
.vibe/CODEX.md            Codex adapter note
.vibe/OPENCODE.md         OpenCode adapter note
```

The entry order is always:

```text
AGENTS.md → ICMR.yaml → CONTEXT.md
```

## Existing project

```bash
npx --yes github:executiveusa/vibe-engineering install .
```

If `AGENTS.md`, `ICMR.yaml`, `CONTEXT.md`, `CLAUDE.md`, or the Cursor rule already exists, Vibe preserves it and reports the file as skipped.

Use `--force` only when you intentionally want Vibe to refresh managed files:

```bash
npx --yes github:executiveusa/vibe-engineering install . --force
```

## Minimal install without portable skills

```bash
npx --yes github:executiveusa/vibe-engineering install . --no-skills
```

## Local clone

```bash
git clone https://github.com/executiveusa/vibe-engineering.git
cd vibe-engineering
npm ci
node scripts/vibe.mjs install /path/to/your/project
```

## Use with agents

### Claude Code

Claude gets a small `CLAUDE.md` adapter. It points back to the canonical root files instead of duplicating Vibe law.

### Codex

Codex enters through root `AGENTS.md`. `.vibe/CODEX.md` documents the same route for humans and other tooling.

### Cursor

`.cursor/rules/vibe.mdc` is an always-on adapter that tells Cursor to read the same canonical files.

### OpenCode

`.vibe/OPENCODE.md` documents the filesystem entry. Vibe does not require an OpenCode-specific orchestration layer.

### Any other capable agent

Give it the repository and this instruction:

```text
Read AGENTS.md, then ICMR.yaml, then CONTEXT.md. Follow Vibe. Verify It Before Everything.
```

No vendor switch should require redesigning the project.

## CLI

The same package exposes the Vibe CLI:

```bash
npx --yes github:executiveusa/vibe-engineering skills
npx --yes github:executiveusa/vibe-engineering run grill "my idea"
npx --yes github:executiveusa/vibe-engineering run proof "prove this release"
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
