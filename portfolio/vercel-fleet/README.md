# PAULI STUDIO Vercel Fleet Control

This folder is the governed portfolio workspace for classifying, prioritizing, onboarding, auditing, and dispatching Vercel-connected repositories through the Vibe Engineering factory.

## Current baseline

- Vercel projects: 143
- GitHub-connected deployment records: 113 reported
- CLI-only deployments: 30 reported
- Unique GitHub repositories resolved from the supplied fleet: 101
- Central control-plane repository added: `executiveusa/vibe-engineering`
- Factory queue size: 102
- Broken or unverified Vercel projects: 26 reported
- Source row 83 was truncated and requires live reconciliation.

## Operating sequence

```text
Live Vercel reconciliation
→ canonical repository resolution
→ read-only repository audit
→ project summary and confidence matrix
→ one-question-at-a-time Grill interview
→ Vibe Project Contract PR
→ production-readiness PRD
→ one approved Sandcastle ticket
→ independent review and SHIP/HOLD decision
```

## Format standard

- Markdown stores human-readable project truth, policy, decisions, and evidence.
- YAML stores editable configuration and founder-confirmed state.
- JSON stores validated audit, queue, and Judge outputs.
- POML stores executable intake and agent prompts.

## Files

- `fleet.json` — normalized deployment-level inventory.
- `deployment-checklist.md` — all 143 Vercel projects.
- `repo-batches.md` — unique repository checklist, five per batch.
- `priority-waves.md` — strategic categories and operating sequence.
- `sandcastle-queue.json` — machine-readable queue for future Sandcastle dispatch.
- `audits/` — per-repository audit, confidence, Grill, contract, and evidence records.

## Rules

1. Process repositories, not duplicate Vercel deployment records.
2. Work in batches of five, ordered by commercial and strategic leverage.
3. Do not modify target product code during intake.
4. Inspect evidence before asking the founder a question.
5. Ask one material Grill question at a time and include an expert recommendation.
6. Do not dispatch Sandcastle until the project contract and bounded ticket are approved.
7. Track CLI-only and source-less deployments separately.
8. Never treat HTTP 200 as production readiness.
9. Use live Vercel discovery to reconcile the supplied fleet snapshot before autonomous dispatch.

## Status vocabulary

- `NOT_STARTED`
- `AUDITING`
- `GRILL_IN_PROGRESS`
- `CONTRACT_PR_OPEN`
- `CONTRACTED`
- `PRD_READY`
- `SANDCASTLE_QUEUED`
- `IN_EXECUTION`
- `SHIP_READY`
- `HOLD`
- `PARK`
- `ARCHIVE_CANDIDATE`

## First batch

1. `vibe-engineering`
2. `pauli-cloud`
3. `pauli-hermes-agent`
4. `macs-agent-portal`
5. `maxx-migrations-agentic-systems`

The first audit is active under `audits/vibe-engineering/`.