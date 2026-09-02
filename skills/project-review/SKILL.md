---
name: project-review
description: Run an independent, system-aware review of an exact candidate revision before serious work is called finished or ready to ship.
---

# Project Review

Use this after implementation and before proof/release for consequential work.

## Why

The builder should not be the only reviewer. Vibe Engineering uses `executiveusa/open-code-review`, derived from Alibaba OpenCodeReview (Apache-2.0), as the preferred deterministic review engine when it is available. Vibe adds system-impact review, stop-slop, taste, proof, ownership, rollback, and explicit release authority.

## Procedure

1. Identify the exact candidate revision, diff range, or files being reviewed.
2. Run the repository review engine when available. Prefer the Vibe-enabled `executiveusa/open-code-review` integration rather than an improvised generic review.
3. Review beyond isolated lines of code: callers, contracts, authentication/security, data/state, user journeys, tests, deployments, and connected repositories.
4. Keep reviewer context independent from the builder whenever practical.
5. Resolve, explicitly accept, or escalate material findings. Never silently drop unresolved findings.
6. Pass the reviewed candidate into Stop Slop, Taste, Proof, and the authorized release decision.

## Completion rule

Project Review can report findings and evidence. It cannot authorize production release. `SHIP` or `HOLD` remains with the Vibe Judge, owner, or other explicitly authorized human.

## Attribution

Review engine: `executiveusa/open-code-review`, forked from `alibaba/open-code-review` under Apache-2.0. Vibe-specific governance, system-impact, proof, and release boundaries are authored by Vibe Engineering.
