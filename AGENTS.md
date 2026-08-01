# Vibe Engineering repository agent policy

This repository inherits the authoritative studio policy in `docs/STUDIO-SYSTEM-PROMPT.md`.

## Repository purpose

Develop and prove the Vibe Engineering method, governance package, one-click ICM software factory, reference implementation, templates, and educational materials for non-technical creators, urban youth, seniors, nonprofits, and social-purpose teams.

## Required reading

Before substantial work, read:

1. `docs/STUDIO-SYSTEM-PROMPT.md`
2. `CONTEXT.md`
3. `PROJECT.yaml`
4. `ARCHITECTURE.md`
5. `RUNBOOK.md`
6. `SECURITY.md`
7. the approved GitHub issue or specification
8. `skills/VIBE-SKILLS-REFERENCE.md`
9. `factory/icm/README.md` for factory or project-scaffolding work

## Commands

```bash
npm ci
npm run check
npm audit --audit-level=high
```

Factory commands:

```bash
npm run factory:new -- --name "Project Name"
npm run factory:doctor -- ./workspaces/project-name
```

## ICM rule

- `AGENTS.md` is Layer 0 identity and law.
- `CONTEXT.md` is Layer 1 routing.
- Each `stages/NN_name/CONTEXT.md` is a Layer 2 stage contract.
- `_config/`, `references/`, and `shared/` are Layer 3 stable factory context.
- `output/` folders are Layer 4 working artifacts.
- Load only the current stage and the references it explicitly names.
- Every consequential artifact must include a respectful plain-language explanation and the exact technical term.

## Prohibited changes

- Do not rewrite the landing page or design system during infrastructure tickets.
- Do not add parallel agent execution until a sequential paid delivery is proven.
- Do not commit secrets or `.sandcastle/.env`.
- Do not overwrite a non-empty project destination with the factory scaffold.
- Do not merge, deploy, publish, or close issues without required evidence and authority.
- Do not claim live production verification from local, scaffold, build, review, or CI results.

## Sandcastle and A2A rule

Sandcastle may implement only one approved issue per isolated branch. The implementer leaves the issue open. The existing A2A Architect–Builder–Judge package governs phase execution. A fresh reviewer produces independent evidence. A separate Judge or human decides `SHIP` or `HOLD`.
