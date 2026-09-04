# Zero to Finished Product

**Audience:** non-technical founders and operators.

**Goal:** take a fuzzy idea to a proven, releasable product using one walkable filesystem and any capable agent.

The workflow is intentionally simple on the surface. Not every skill runs every time. The **primary lane** is the default path; **support skills** are pulled in only when the work needs them.

## The repeatable path

| Stage | Human question | Primary skills | Support skills | Done when |
|---|---|---|---|---|
| 00 Start | What am I using and where do I begin? | `setup-vibe`, `ask-vibe` | `explain`, `teach` | the project is walkable and the next action is clear |
| 01 Discover | What do I really want to make? | `grill-idea`, `grill` | `interview`, `ask-human`, `research`, `language` | intent, users, assumptions, and important terms are explicit |
| 02 Define | What does good look like? | `map`, `spec` | `prototype` | outcome, standard, boundaries, acceptance checks, and proof are written |
| 03 Plan | What is the smallest safe sequence? | `tickets` | `architecture-check`, `module-design`, `triage` | work is split into ordered verifiable slices |
| 04 Build | Can we make one complete slice? | `build` | `test-first`, `debug`, `deep-work` | each slice works through an observable seam |
| 05 Review | Is the implementation actually good? | `review`, `project-review` | `stop-slop`, `taste`, `human-voice`, `agent-docs` | material findings are resolved or explicitly accepted |
| 06 Prove | What evidence says this is true? | `proof` | — | important claims have evidence tied to the exact candidate |
| 07 Integrate | Can we combine the approved work safely? | `merge` | `handoff` | the combined state is coherent and rechecked |
| 08 Release | Should this exact revision go live? | `ship` | `human-step` | an authorized human/Judge records SHIP, production is smoke-tested, rollback exists |
| 09 Learn | What should the next cycle inherit? | `handoff` | `teach`, `ask-vibe` | context, scars, decisions, and next actions are durable |

## Review law

Skill **#17 `review`** uses `executiveusa/open-code-review` as the dominant code-review engine.

That means deterministic OpenCodeReview machinery owns the core code-review execution: file selection, bundling, rule matching, positioning, reflection, and structured findings. Vibe does **not** replace that with a generic free-form review prompt.

Vibe wraps that engine with the questions OpenCodeReview is not meant to own by itself:

- Did we build the agreed product?
- Did we break another part of the system?
- Is auth, data, deployment, ownership, mobile, accessibility, or user flow affected?
- Does the result meet the stated taste and brand bar?
- Is the proof tied to the exact candidate?
- Is the release authorized and reversible?

Primary engine:

`https://github.com/executiveusa/open-code-review`

Typical branch review:

```bash
ocr review --from main --to feature-branch
```

Single commit:

```bash
ocr review --commit <sha>
```

If the current coding agent should provide the model, use OpenCodeReview delegation mode rather than dropping deterministic review structure:

```bash
ocr delegate preview
```

After fixes, review the final exact candidate again.

## Beginner rule

A person should never need to memorize all 32 skills. The system should tell them the **next useful action**.

The public mental model is:

```text
TELL IT → SET THE BAR → MAKE IT → REVIEW IT → PROVE IT → SHIP IT
```

Underneath that, Vibe routes to the appropriate skill from this workflow.

## Start

```bash
npx --yes --package=github:executiveusa/vibe-engineering vibe install .
npx --yes --package=github:executiveusa/vibe-engineering vibe journey
```

Then tell the agent:

```text
Read AGENTS.md. Follow Vibe. Verify It Before Everything. Take me through the zero-to-product workflow one decision at a time.
```

**No agent soup. One walkable system. Any capable agent can use it.**
