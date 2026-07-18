# Decision 9 — First 30-day agent authority

**Selected: B — Execute in isolated sandboxes and open PRs, but no autonomous merge or public deployment.**

## Allowed

Agents may:

- inspect all repositories in an approved client delivery system;
- create or update the Vibe Project Contract on isolated branches;
- run read-only audits and create bounded implementation tickets;
- modify code only inside isolated sandboxes or branches;
- run build, lint, typecheck, test, browser, and deployment-preview verification;
- fix failures within the approved ticket scope;
- create pull requests and preview deployments;
- collect telemetry, evidence, runtime, cost, blocker, rollback, and Judge state;
- stop and escalate when policy, credentials, destructive migrations, unclear requirements, or public-facing quality gates block progress.

## Prohibited without human approval

Agents may not:

- merge to protected production branches automatically;
- publish or publicly deploy client-facing changes automatically;
- perform destructive database migrations automatically;
- make pricing, legal, contractual, or customer commitments;
- publish public content autonomously;
- materially increase spend outside approved limits;
- bypass the public-facing cofounder review gate.

## Release sequence

Agent builds → independent review → Vibe Judge → preview → Jeremy + digital cofounder public-facing review → approve or revise → merge and deploy.

## Reasoning

This level creates real five-lane parallel execution without allowing an unproven factory to damage multiple businesses at once. It removes repetitive implementation work from the founder while preserving human judgment over irreversible, public, commercial, legal, and destructive actions.

## Graduation rule

After approximately 30 days, autonomy may increase only by evidence and by action category. Review failed runs, rollback frequency, rejected PRs, production incidents, false SHIP decisions, cost per completed ticket, and founder intervention frequency. Low-risk categories may graduate from propose/PR authority to bounded autonomous merge/deploy only after the evidence supports it.
