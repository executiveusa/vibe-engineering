# Vibe Engineering

**V.I.B.E. = Verify It Before Everything.**

A free, open-source quality layer for building with AI without letting speed turn into slop.

Bring the idea. Vibe helps your AI:

1. understand what you want;
2. decide what good means;
3. make it;
4. check it;
5. prove it before you ship it.

You do **not** need to learn the machinery underneath before using it.

## Get Vibe in under 60 seconds

From the project you want to improve:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Then tell your agent:

```text
Read AGENTS.md. Follow Vibe. Verify It Before Everything.
```

That is the entire public onboarding contract.

The installer is brownfield-safe by default: existing project-law files are preserved unless you explicitly pass `--force`. When it preserves owner-controlled files, it leaves `.vibe/INSTALL-NOTES.md` instead of pretending Vibe law was automatically merged.

See [`docs/INSTALL.md`](docs/INSTALL.md) for the install contract and adapter details.

## One filesystem. Any capable agent.

Vibe is built so Claude Code, Codex, Cursor, OpenCode, custom agents, and future tools can all enter the same filesystem instead of each needing a different architecture.

The installed entry order is always:

```text
AGENTS.md → ICMR.yaml → CONTEXT.md
```

The installer also adds `PROOF/`, portable skills under `.vibe/skills/`, and thin adapter files for Claude Code, Codex, Cursor, and OpenCode. Those adapters point back to the same canonical files instead of duplicating the law.

**No agent soup. One walkable system. Any capable agent can use it.**

## Use Vibe four ways

### 1. Files + folders — works with any capable agent

The filesystem is canonical:

```text
AGENTS.md           law and boundaries
ICMR.yaml           portable runtime contract
CONTEXT.md          current state + next action
PROOF/              evidence
.vibe/skills/       portable procedures
.vibe/manifest.json install provenance
```

Agents are adapters to those files. Durable truth does not live in one vendor's hidden prompt or chat memory.

### 2. Plugin / skills

Portable skills live under `skills/` in this repository and install under `.vibe/skills/` in a target project. Plugin metadata lives under `.claude-plugin/`.

Claude Code and other skill-compatible agents can use the same committed procedures. The direct Vibe skills include setup, interview/grill, Project Review, Stop Slop, Human Voice, Deep Work, Taste, Proof, and Ship, backed by the full callable registry.

To materialize generated skill files when needed:

```bash
npm run skills:export
```

### 3. CLI

Use the GitHub package directly:

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

## The five-step public workflow

```text
TELL IT → SET THE STANDARD → MAKE IT → CHECK IT → PROVE IT
```

Underneath that simple memory aid, consequential software work still follows the governed lifecycle:

```text
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

And every material decision can be reduced to three questions:

```text
Intent → Standard → Evidence
```

**Intent:** What are we actually trying to do?

**Standard:** What should good look like?

**Evidence:** What proves we got there?

## We did the research so you do not have to

Vibe Engineering came from a practical problem: AI made building dramatically easier, but it did not automatically make judgment, review, usability, security, design taste, ownership, or production proof easier.

So we studied experienced engineers, designers, open-source communities, review systems, and real production practices. Useful methods are adapted under one system, their sources stay visible, and no upstream work is silently renamed as original Vibe work.

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

## 32 callable Vibe skills

You do not need to memorize these. `ask-vibe` can help choose the smallest useful procedure.

```text
setup-vibe         configure a repo
project-review     independent system-aware review
ask-vibe           choose the right workflow
grill              get clear before coding
grill-idea         pressure-test an idea
language           create shared project language
map                break down large work
spec               turn intent into a build contract
tickets            split work into verifiable pieces
build              implement a complete slice
test-first         red / green / refactor
debug              diagnose with evidence
prototype          learn with throwaway code
research           answer from strong sources
module-design      simplify interfaces
architecture-check find structural problems
review             review against the spec
merge              resolve conflicts by intent
triage             decide what an issue needs
human-step         guide human-only steps
handoff            let another agent continue
teach              explain without dumping
ask-human          create a focused questionnaire
explain            translate confusing language
interview          reusable question loop
agent-docs         write agent-readable instructions
stop-slop          catch generic AI output
human-voice        remove robotic writing
deep-work          stop premature completion
taste              check design judgment
proof              verify important claims
ship               release exact proven revisions
```

## Project Review

`project-review` is Vibe's dedicated completion-review skill.

When available, Vibe standardizes on [`executiveusa/open-code-review`](https://github.com/executiveusa/open-code-review), a Vibe-enabled fork of Alibaba OpenCodeReview (Apache-2.0), for deterministic changed-file selection and structured AI review.

Vibe then adds system-impact checks, Stop Slop, taste, proof, ownership, rollback, and human release authority.

The review engine cannot authorize its own production release.

## ICM: the portable structure underneath Vibe

ICM makes the filesystem the map.

A new human or agent should be able to enter a project and know where to look next without loading a swarm of personas or relying on previous chat history.

The reusable full project template lives under `factory/icm/template/`. The lightweight universal installer uses the same filesystem law without forcing a new application's source tree into a pre-existing project.

## Why it is free

Vibe Engineering is the operating system behind The Pauli Effect's AI-native product studio.

Giving the system away lets builders use our process before they ever hire us. The repository is inspectable. The rules are editable. Your code stays yours.

If Vibe makes your own AI work better, the open-source system has already done its job.

## License

MIT.

Use it, fork it, inspect it, improve it, and keep the attribution required by the upstream sources we rely on.

## Client Zero

This repository is Client Zero. Vibe Engineering is used to build and review Vibe Engineering itself.

A polished demo is not proof. Only call something shipped when the exact released revision has been checked in the real environment and there is a rollback path.
