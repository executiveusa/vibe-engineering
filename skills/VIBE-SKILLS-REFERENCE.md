# Vibe Engineering Skills Reference

This file maps each Vibe Engineering stage to the source skills that agents should read and invoke. It is a routing layer, not a replacement for the original skill instructions.

## Source repositories

Primary reference:

- AI Hero skills catalog: `https://www.aihero.dev/skills`
- Matt Pocock skills repository: `https://github.com/mattpocock/skills`

Install the source skills using the repository’s documented installer or vendor them according to project policy. Preserve original licenses and attribution. Do not silently copy third-party skills and rename them as original Vibe Engineering work.

Expected source tree after installation or vendoring:

```text
skills/
├── engineering/
├── productivity/
├── misc/
└── ...
```

If the skills are installed in another standard agent directory, resolve the equivalent path before proceeding.

## Loading rule

Do not load the entire skills library into every context. Read only the skill needed for the current stage. Read its complete `SKILL.md` before executing it. Read linked reference files only when the skill instructs you to or the task requires them.

The priority order is:

1. repository-local agent and security rules;
2. approved project specification and decisions;
3. Vibe Engineering hard gates;
4. the selected source skill procedure.

## Orientation and routing

### Ask Matt

Source:

- `skills/engineering/ask-matt/SKILL.md`

Use when:

- the agent is unsure which Matt Pocock skill should come next;
- the user needs an explanation of the skills workflow;
- a project is newly configured and needs orientation.

Do not use as a substitute for project-specific architecture decisions.

### Wayfinder

Source:

- `skills/engineering/wayfinder/SKILL.md`

Use when:

- the current state is unclear;
- the work needs to be routed between grilling, research, prototype, specification, tickets, implementation, or review;
- there are multiple plausible next moves.

Vibe command mapping: `SCAN`, `MAP`, `NEXT`.

## Intent and discovery

### Grill with Docs

Source:

- `skills/engineering/grill-with-docs/SKILL.md`

Use when:

- a product or change idea is still vague;
- the repository must be inspected while interviewing the owner;
- decisions should be recorded in project context and architecture records;
- greenfield intent or brownfield change boundaries are unclear.

Expected outputs:

- shared understanding;
- settled material decisions;
- updated durable context or decisions;
- a clear path to prototype, specification, or implementation.

Vibe command mapping: `GRILL`.

### Grill Me and Grilling

Sources:

- `skills/productivity/grill-me/SKILL.md`
- `skills/productivity/grilling/SKILL.md`

Use when:

- the interview is not primarily tied to repository documentation;
- gathering founder, brand, business, operational, or personal workflow requirements;
- preparing structured inputs before product work.

Use `grill-with-docs` instead when the interview must remain stateful inside a code repository.

### Research

Source:

- `skills/engineering/research/SKILL.md`

Use when:

- an external technical fact, library behavior, standard, API, market constraint, or established practice must be verified;
- internal reasoning cannot settle the question reliably;
- current primary sources are required.

Research findings must distinguish facts, inferences, uncertainties, and recommendations. Prefer primary sources.

Vibe stage mapping: `DISCOVER`, `UNDERSTAND`.

## Architecture and domain understanding

### Domain Modeling

Sources:

- `skills/engineering/domain-modeling/SKILL.md`
- `skills/engineering/domain-modeling/CONTEXT-FORMAT.md`
- `skills/engineering/domain-modeling/ADR-FORMAT.md`

Use when:

- business language is inconsistent;
- domain boundaries are unclear;
- a monolith, service boundary, data model, or workflow needs a shared vocabulary;
- architectural decisions must be captured durably.

Expected outputs:

- bounded context or domain context;
- glossary or ubiquitous language;
- architecture decision record where required.

Vibe command mapping: `MAP`, `LOCK`.

### Codebase Design

Sources:

- `skills/engineering/codebase-design/SKILL.md`
- `skills/engineering/codebase-design/DEEPENING.md`
- `skills/engineering/codebase-design/DESIGN-IT-TWICE.md`

Use when:

- selecting between materially different implementation designs;
- defining module boundaries or public APIs;
- a new subsystem needs deliberate architecture before implementation.

Use especially for greenfield architecture or approved brownfield extensions. Do not use it to justify unnecessary rewrites.

### Improve Codebase Architecture

Sources:

- `skills/engineering/improve-codebase-architecture/SKILL.md`
- `skills/engineering/improve-codebase-architecture/HTML-REPORT.md`

Use when:

- the explicit task is to assess or improve architecture;
- duplicated logic, coupling, unclear boundaries, or structural debt has been established through evidence;
- a brownfield audit needs a prioritized architecture report.

This skill does not authorize broad refactoring. Improvements must be specified, sliced, regression-tested, and reversible.

## Risk reduction

### Prototype

Sources:

- `skills/engineering/prototype/SKILL.md`
- `skills/engineering/prototype/LOGIC.md`
- `skills/engineering/prototype/UI.md`

Use when:

- a material question cannot be settled through discussion or documentation;
- library behavior, performance, browser behavior, model capability, integration feasibility, or user interaction needs runnable evidence;
- a risky assumption should be tested before committing to architecture.

A prototype is disposable evidence unless explicitly promoted through a reviewed specification. Never present prototype code as production-ready.

Vibe stage mapping: `UNDERSTAND` before `SPECIFY`.

### Diagnosing Bugs

Source:

- `skills/engineering/diagnosing-bugs/SKILL.md`

Use when:

- a test, build, deployment, browser check, or production behavior fails;
- the cause is not yet proven;
- repeated speculative fixes are occurring.

Require reproduction, evidence, hypothesis ranking, controlled tests, root cause, regression protection, and documented resolution.

Vibe command mapping: `PROOF` when failing, then `BUILD` for the approved fix.

## Specification and planning

### To Spec

Source:

- `skills/engineering/to-spec/SKILL.md`

Use when:

- discussion and discovery must be compressed into a durable product or change specification;
- work spans multiple contexts or agents;
- final implementation must later be reviewed against an authoritative contract.

The resulting specification must also satisfy the Vibe Engineering requirements for ownership, security, accessibility, observability, costs, rollback, and human approvals.

Vibe command mapping: `SPEC`.

### To Tickets

Source:

- `skills/engineering/to-tickets/SKILL.md`

Use when:

- a specification is too large for one strong context;
- work needs independent slices, sequencing, or parallel ownership;
- each implementation unit needs its own acceptance criteria and proof.

Each ticket should fit one strong agent context whenever practical. Do not create tickets that merely repeat the entire specification.

Vibe command mapping: `SLICE`.

### Triage

Sources:

- `skills/engineering/triage/SKILL.md`
- `skills/engineering/triage/AGENT-BRIEF.md`
- `skills/engineering/triage/OUT-OF-SCOPE.md`

Use when:

- issues, requests, incidents, or discovered debt need classification;
- deciding what is active, blocked, parked, duplicate, invalid, or out of scope;
- work-in-progress limits must be enforced.

Vibe command mapping: `CUT`, `PARK`, `NEXT`.

## Implementation

### Test-Driven Development

Sources:

- `skills/engineering/tdd/SKILL.md`
- `skills/engineering/tdd/tests.md`
- `skills/engineering/tdd/mocking.md`

Use when:

- behavior can be expressed as an executable test;
- regression risk is meaningful;
- changing business logic, data transformations, authorization, calculations, migrations, or important workflows.

Tests must prove behavior rather than merely mirror implementation. Mock only at justified boundaries.

### Implement

Source:

- `skills/engineering/implement/SKILL.md`

Use when:

- the current slice is approved and sufficiently specified;
- baseline state is known;
- acceptance criteria and verification commands exist.

Implementation must remain within the approved slice. The Vibe Engineering completion packet and release gates remain mandatory even if the source skill reports success.

Vibe command mapping: `BUILD`.

### Resolving Merge Conflicts

Source:

- `skills/engineering/resolving-merge-conflicts/SKILL.md`

Use when:

- branches, worktrees, or parallel agents produced conflicts;
- conflict resolution needs to preserve both intended behavior and repository conventions.

After resolution, rerun all relevant verification. Conflict-free text is not proof of correct behavior.

## Review and release

### Code Review

Source:

- `skills/engineering/code-review/SKILL.md`

Use when:

- an implementation slice or pull request is ready for independent review;
- checking against the specification and repository standards;
- seeking defects with fresh context.

Run review in a fresh agent or isolated context whenever possible. Add Vibe Council reviews for security, user experience, taste, and sovereignty where the code-review skill does not cover them.

Vibe command mapping: `COUNCIL` and `PROOF`.

### Git Guardrails

Source:

- `skills/misc/git-guardrails-claude-code/SKILL.md`

Use when:

- configuring agents that can create commits, branches, or pull requests;
- preventing destructive Git actions, unsafe force pushes, wrong-branch commits, or unauthorized merges.

Repository-specific Git policy overrides generic defaults.

### Setup Pre-Commit

Source:

- `skills/misc/setup-pre-commit/SKILL.md`

Use when:

- the repository lacks local lightweight checks before commits;
- repeated formatting, lint, secret, or basic validation failures reach CI.

Do not add hooks that are slow, fragile, undocumented, or impossible for contributors to bypass during recovery.

## Continuity and teaching

### Handoff

Source:

- `skills/productivity/handoff/SKILL.md`

Use when:

- transferring work to another agent or person;
- ending a context window;
- pausing a ticket;
- preserving exact state, evidence, decisions, blockers, and next action.

Vibe command mapping: automatic before context transfer, `PARK`, or unresolved `HOLD`.

### Claude Handoff

Source:

- `skills/in-progress/claude-handoff/SKILL.md`

Use only when the target environment specifically requires this experimental format. Prefer the stable general handoff skill otherwise.

### Teach

Sources:

- `skills/productivity/teach/SKILL.md`
- `skills/productivity/teach/GLOSSARY-FORMAT.md`
- `skills/productivity/teach/LEARNING-RECORD-FORMAT.md`
- `skills/productivity/teach/MISSION-FORMAT.md`
- `skills/productivity/teach/RESOURCES-FORMAT.md`

Use when:

- converting completed, verified work into a lesson;
- building the urban-youth Vibe Engineering curriculum;
- explaining concepts using missions, analogies, glossary terms, and learning records.

Teach from proven artifacts and real evidence. Do not teach an untested workflow as settled practice.

### Writing Great Skills

Sources:

- `skills/productivity/writing-great-skills/SKILL.md`
- `skills/productivity/writing-great-skills/GLOSSARY.md`

Use when:

- a repeated workflow has succeeded enough times to become a reusable skill;
- updating an existing skill based on incidents, evidence, or improved procedures.

A new Vibe skill must define trigger conditions, inputs, outputs, tools, procedure, quality rubric, failure handling, escalation, version, and owner.

## Default end-to-end routes

### Small greenfield change

```text
grill-with-docs
→ prototype only if needed
→ to-spec
→ tdd where appropriate
→ implement
→ code-review
→ Vibe Council
→ Vibe Judge
→ handoff or ship
```

### Large greenfield project

```text
wayfinder
→ grill-with-docs
→ research
→ domain-modeling
→ codebase-design
→ prototype risky assumptions
→ to-spec
→ to-tickets
→ implement one ticket at a time
→ code-review each slice
→ system proof
→ Vibe Council
→ Vibe Judge
→ ship
→ teach or writing-great-skills after real use
```

### Small brownfield change

```text
SCAN baseline
→ grill-with-docs
→ diagnosing-bugs when applicable
→ focused spec
→ tdd
→ implement
→ regression proof
→ code-review
→ Vibe Judge
→ ship with rollback
```

### Large brownfield modernization

```text
wayfinder
→ baseline preservation
→ grill-with-docs
→ domain-modeling
→ improve-codebase-architecture
→ research or prototype
→ architecture decisions
→ to-spec
→ to-tickets
→ isolated implementation slices
→ continuous regression proof
→ independent code-review
→ full Vibe Council
→ Vibe Judge
→ staged release and rollback
```

## Final rule

Skills provide procedures. Vibe Engineering provides governance.

A skill completing its procedure does not automatically authorize release. Only verified evidence, passing hard gates, owner control, required human approval, and the Vibe Judge can produce `SHIP`.
