# ADR-003 — One canonical pipeline, enforced by the repository

**Status:** PROPOSED  
**Date:** 2026-09-26  
**Consequence level:** HIGH  
**Human approval required:** Yes

## Context

The fleet had eight descriptions of "the pipeline": the House lifecycle, the public nine verbs, the loop-engineering stages, the ICM route, the nightly factory, the Terabithia factory plane, the BARS software-factory gate, Hermes's first-mate factory and Orca's one-prompt pipeline. They mostly agreed, but each was enforced only by the prompt that described it.

A review found:

- `main` was unprotected on the fleet repositories, and every agent pushed as the owner's account, so no rule could tell agents from the owner;
- the nightly factory's builder and Judge were the same model, so the Judge shared the builder's blind spots;
- the gauntlet had no stop condition besides "until it wins";
- agents were told to follow upstream `main` of the House Skill at run time, so an unreviewed change to one file could steer every agent;
- the step that ran agent sandboxes also held the fleet GitHub token;
- `approvalsReviewer: "auto_review"` was passed to Sandcastle, which ignores it, so it looked like a control and was not one;
- Terabithia's factory engines reported simulated work as success (fixed separately in terabithia#22).

## Decision

1. `docs/PIPELINE.md` is the one pipeline. The other descriptions are adapters onto it and may not add or remove gates.
2. Rules that matter are enforced by GitHub: protected `main` (`scripts/protect-main.sh`), and a required merge gate that re-checks the Judge receipt, refuses code changed after the Judge ruled, and needs a human for HIGH work (`docs/ENFORCEMENT.md`).
3. The Judge is a different model family from the builder: Codex builds, Claude Code judges.
4. Every loop has a budget and ends in HOLD when it runs out.
5. Projects pin a House version (`.vibe/manifest.json` records `version` and `sourceCommit`); upgrading is a reviewed change.
6. Agent sandboxes get model keys only. Pushing and PR creation happen in a later step.
7. Agents get their own GitHub App identity (owner action), after which `main` also requires the owner's approval.

## Impact graph

- **Direct effects:** nothing reaches `main` without green checks and a current SHIP receipt; the nightly factory needs `ANTHROPIC_API_KEY`.
- **Second-order effects:** a broken runner or a flaky check blocks merges until fixed; this is intended and is what the red-gate watchdog reports.
- **Third-order effects:** the fleet's quality becomes a property of the repositories, not of whichever prompt an agent read.
- **Reversibility:** full. Branch protection and the gate workflow can be removed in minutes by the owner.
- **Inheritors:** the owner, and anyone who later operates Terabithia or the nightly factory.

## Consequences

- The owner must run `scripts/protect-main.sh --apply` with admin rights, add `ANTHROPIC_API_KEY` to the factory secrets, and create the agents' GitHub App.
- Private repositories on GitHub Free cannot use branch protection. Protecting them needs GitHub Pro or public repositories; that is an owner decision about money and visibility.
