# Architecture

## Purpose

Vibe Engineering is a portable static React/Vite site plus a versioned governance and skills package for agent-assisted software delivery.

## Current system

```text
Browser
  → Vite static application
  → deterministic Vibe Score module

GitHub
  → source of truth
  → issues and specifications
  → pull requests and CI evidence

Sandcastle
  → isolated Docker worktree
  → Codex implementer
  → fresh Codex reviewer
  → retained branch and evidence

Human / Vibe Judge
  → reviews evidence
  → decides SHIP or HOLD
```

## Boundaries

- `src/` contains the public product interface and deterministic score logic.
- `docs/` contains the methodology, governance, evidence, specifications, and adoption plan.
- `prompts/` contains reusable agent prompts.
- `skills/` maps approved procedures and references.
- `templates/` contains repository onboarding templates.
- `.sandcastle/` contains the isolated sequential execution scaffold.

## Data

The public application has no production database and stores no customer data. GitHub holds repository, issue, pull-request, and release records. Secrets must remain outside Git and chat.

## Deployment

The static build is deployable to Vercel or another static host. A deployment request is not considered live verification.

## Architecture constraints

- Preserve the portable static architecture unless a validated commercial requirement demands a backend.
- Do not add another orchestration or session-management platform until sequential delivery is proven.
- Do not allow Sandcastle workers to merge or deploy.
- Keep issue execution isolated and reversible.
