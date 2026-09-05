# Agent Context — Vibe Engineering

## Repository purpose

`executiveusa/vibe-engineering` is the canonical upstream for the Vibe Engineering House system: governance, ICM context architecture, lifecycle semantics, portable skills, factory templates, proof/review rules, CLI/API/MCP surfaces, and the public reference app.

V.I.B.E. means **Verify It Before Everything**.

## Canonical lifecycle

```text
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
```

Existing full-factory workspaces retain these compatible physical stage folders:

```text
00_intake → 01_vision → 02_blueprint → 03_build → 04_verify
→ 05_council → 06_judge → 07_ship → 08_improve
```

## Canonical sources

Read these before redefining behavior:

```text
skills/vibe-engineering/SKILL.md
_config/stage-system.yaml
factory/icm/template/
docs/architecture/VIBE-HOUSE-ARCHITECTURE.md
docs/METHOD.md
docs/PROJECT-START-PROMPT.md
```

The House Skill is the canonical router. Smaller skills are supporting procedures and must not create competing architectures.

## Project-start rule

For any repository adopting Vibe Engineering, retrieve the latest House Skill from:

```text
https://github.com/executiveusa/vibe-engineering
https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md
```

When shell access is available, install or refresh with:

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
```

Preserve owner-controlled project law unless an intentional merge is required. Do not use `--force` blindly.

## Main repository areas

```text
src/                         public React/Vite reference app
public/                      static assets
skills/                      canonical and supporting portable skills
factory/icm/template/        full ICM project template
_config/stage-system.yaml    semantic lifecycle and visual tokens
scripts/                     CLI, factory, verification, and distribution tools
docs/                        method, installation, architecture, governance, and evidence docs
api/                         public API/MCP surfaces where present
```

## Build and verification

Use the repository's committed scripts as the source of truth. The normal deterministic gate is:

```bash
npm ci
npm run check
```

Relevant work may require additional proof beyond the deterministic gate. Formatting, tests, build output, preview deployment, and production verification are distinct evidence classes.

## Deployment

Canonical public production domain:

```text
https://vibe-engineering-lime.vercel.app
```

Public API examples:

```text
GET  https://vibe-engineering-lime.vercel.app/api/v1/skills
POST https://vibe-engineering-lime.vercel.app/api/mcp
```

Do not call a deployment production-verified without checking the exact live environment.

## Agent behavior

1. Inspect before change.
2. Refresh or inspect current upstream House law before material work.
3. Read only the smallest relevant ICM context.
4. Separate facts from assumptions.
5. Work one verifiable slice at a time.
6. Builders cannot approve themselves.
7. Judge returns `SHIP` or `HOLD` and does not rewrite judged work.
8. Keep README/docs/ICM/proof synchronized with reality.
9. Preserve rollback and owner control.

## Current next action

Continue to evolve Vibe Engineering through the locked House lifecycle itself. Any change to the House method is constitutional work and must update the skill, machine-readable semantics, docs, tests, and distribution surfaces together.
