# Mandatory Engineering Workflow

This project inherits the Vibe Engineering factory engineering standard.

Canonical skill library:

`https://github.com/executiveusa/pauli-agent-skills-2026`

## Authority

Vibe Engineering and ICM govern what, why, whether, and authority. The Agent Skills library governs how software engineering work is executed.

## Required opening gate

Before non-trivial implementation:

1. classify `SELL`, `USE`, `MERGE`, `PARK`, or `ARCHIVE`;
2. declare `greenfield` or `brownfield`;
3. state measurable outcome;
4. state target customer, user, or system;
5. state constraints and what must not change;
6. state required proof;
7. state commercial value: revenue, savings, retention, or validated learning;
8. confirm the approved specification;
9. select one independently verifiable slice.

## Engineering lifecycle

`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`

Use the applicable skills from the canonical library. Typical routing:

- DEFINE: `interview-me`, `idea-refine`, `spec-driven-development`
- PLAN: `planning-and-task-breakdown`
- BUILD: `incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `doubt-driven-development`, `frontend-ui-engineering`, `api-and-interface-design`
- VERIFY: `browser-testing-with-devtools`, `debugging-and-error-recovery`
- REVIEW: `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`
- SHIP: `git-workflow-and-versioning`, `ci-cd-and-automation`, `documentation-and-adrs`, `observability-and-instrumentation`, `deprecation-and-migration`, `shipping-and-launch`

Use only the skills that apply to the current scope and risk. Do not invent a competing engineering lifecycle.

## Non-negotiable release boundary

Skill completion cannot authorize release. Vibe Council/Judge or authorized human approval, evidence, ownership, rollback, and target-environment verification remain required.

A build, passing CI, preview, or deployment submission is not verified production.
