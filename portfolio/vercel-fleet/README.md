# Vercel Fleet Control Folder

This folder is the source of truth for onboarding the PAULI STUDIO Vercel-connected portfolio into the Vibe Engineering factory.

## Operating rule

Work proceeds in batches of five **unique GitHub repositories**. Vercel deployments are tracked separately because multiple projects often point to the same repository.

## Current baseline

- Vercel projects: 143
- GitHub-connected deployment records: 113 reported
- CLI-only deployments: 30 reported
- Unique GitHub repositories resolved from the supplied fleet: 101
- Central control-plane repository added: `executiveusa/vibe-engineering`
- Factory queue size: 102
- Broken or unverified Vercel projects: 26 reported
- Source row 83 was truncated and is explicitly marked for verification.

## Files

- `fleet.json` — normalized deployment-level inventory.
- `deployment-checklist.md` — all 143 Vercel projects.
- `repo-batches.md` — unique repository checklist, five per batch.
- `priority-waves.md` — strategic categories and operating sequence.
- `sandcastle-queue.json` — machine-readable queue for future Sandcastle dispatch.

## Status vocabulary

`MISSING` → no project contract installed  
`INTAKE_PR_OPEN` → contract proposed  
`CONTRACTED` → contract merged  
`AUDITED` → read-only audit complete  
`PRD_READY` → bounded production PRD exists  
`IN_SANDCASTLE` → isolated execution running  
`SHIP` → evidence passes production gate  
`HOLD` → owner decision, credentials, or unresolved risk required

## Guardrails

- Never send duplicate Vercel deployments to Sandcastle as separate repositories.
- Never install project contracts directly on `main`; use an intake PR.
- Never auto-merge or auto-deploy during initial rollout.
- Commercial and client-delivery repositories outrank experiments.
- Forks, templates, generic projects, and unknown-purpose repositories require classification before execution.
