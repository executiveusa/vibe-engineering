# Vibe Engineering repository agent policy

This repository inherits the authoritative studio policy in `docs/STUDIO-SYSTEM-PROMPT.md`.

## Repository purpose

Develop and prove the Vibe Engineering method, governance package, reference implementation, templates, and educational materials.

## Required reading

Before substantial work, read:

1. `docs/STUDIO-SYSTEM-PROMPT.md`
2. `PROJECT.yaml`
3. `ARCHITECTURE.md`
4. `RUNBOOK.md`
5. `SECURITY.md`
6. the approved GitHub issue or specification
7. `skills/VIBE-SKILLS-REFERENCE.md`

## Commands

```bash
npm ci
npm run check
npm audit --audit-level=high
```

## Prohibited changes

- Do not rewrite the landing page or design system during infrastructure tickets.
- Do not add parallel agent execution until a sequential paid delivery is proven.
- Do not commit secrets or `.sandcastle/.env`.
- Do not merge, deploy, publish, or close issues without required evidence and authority.
- Do not claim live production verification from local or CI results.

## Sandcastle rule

Sandcastle may implement only one approved issue per isolated branch. The implementer leaves the issue open. A fresh reviewer produces independent evidence. A separate Judge or human decides `SHIP` or `HOLD`.
