# Vibe Client-Lane Observability Event Contract v1

## Decision

All concurrent client delivery systems emit the same state-transition event contract. Client-specific business metrics may differ, but operational telemetry uses one shared schema.

## Why

The control center must compare and coordinate five client lanes without custom integrations per client. The system should capture meaningful business and execution transitions without logging every token, command, or internal reasoning step.

Execution detail remains in logs. Important state changes become structured events. Events update one client-level status record. The control center renders progress, blockers, decisions, cost, verification, and commercial outcomes from that shared state.

## Required event types

- `client_intake_started`
- `audit_completed`
- `ticket_selected`
- `agent_started`
- `implementation_completed`
- `verification_failed`
- `verification_passed`
- `preview_ready`
- `decision_required`
- `pr_opened`
- `judge_ship`
- `judge_hold`
- `public_review_required`
- `public_approved`
- `deployed`
- `commercial_outcome_recorded`

## Core event fields

```yaml
event_version: 1
event_type:
timestamp:

client_id:
project_id:
repo:
deployment:
sandbox_id:
ticket_id:

agent_role:
phase:
status:

runtime_seconds:
estimated_cost_usd:

evidence:
blocker:
decision_needed:
rollback_point:

commercial_goal:
commercial_progress:
```

## Rules

1. Emit events only at meaningful state transitions.
2. Do not store private chain-of-thought or unrestricted prompt transcripts in the event stream.
3. Keep detailed command/tool logs separate from the client-level event contract.
4. Every event must identify the client lane and bounded ticket when applicable.
5. Verification failures and HOLD decisions must include evidence and blocker context.
6. Public-facing deployment requires `public_review_required` followed by explicit `public_approved` before `deployed`.
7. Commercial outcomes must be recorded separately from technical completion.
8. Cost and runtime should be reported when available and marked unknown rather than invented when unavailable.

## Client-specific commercial metrics

The schema is shared, while success measures remain lane-specific:

- MACS / MAXX: downstream paying client onboarded through Stacy and receiving a measurable result.
- Asc3nd: one acquisition-to-engagement loop working end-to-end in production.
- Kupuri / Synthia: one higher-value managed client project closed, onboarded, and delivered through the system.
- Verified Vallarta: one verified local business converted into a paying client through the directory ecosystem.
- Lane 5: metric defined after portfolio audit selects the highest revenue-to-effort opportunity.

## Control-center requirement

The event stream must support a founder view that answers in under one minute:

1. What advanced?
2. What is blocked?
3. What needs a human decision?
4. What is closest to revenue?

## Authority boundary

During the first 30 days, agents may execute in isolated sandboxes, create branches, PRs, previews, tests, and evidence. They may not autonomously merge protected production branches or publicly deploy client-facing changes.
