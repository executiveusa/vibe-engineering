# Vibe Engineering Factory — Mandatory Engineering Workflow

## Decision

Vibe Engineering adopts `executiveusa/pauli-agent-skills-2026` as the canonical engineering procedure library for software work produced by the factory.

This standard applies to every software product, including products created or operated through Polyspace, ICM workspaces, agent-driven builders, CI workers, browser agents, and future factory runtimes.

The Agent Skills library does **not** replace Vibe Engineering governance, ICM, the Council, the Judge, commercial gates, ownership rules, or human authority boundaries. It operates beneath them.

## Authority hierarchy

1. Legal, safety, and explicit owner authority.
2. Vibe Engineering Studio governance and project-specific approved decisions.
3. ICM routing, stage contracts, approved specification, and current slice.
4. This mandatory engineering workflow.
5. Repository conventions and implementation details.
6. Model or tool preference.

When a lower layer conflicts with a higher layer, the higher layer wins.

## Factory rule

Every software project starts with these gates before implementation:

1. **Classify** — `SELL`, `USE`, `MERGE`, `PARK`, or `ARCHIVE`.
2. **Mode** — `greenfield` or `brownfield`.
3. **Outcome** — measurable result.
4. **Target** — customer, user, or system.
5. **Constraints** — what must not change.
6. **Proof** — evidence required before the claim can be accepted.
7. **Commercial value** — revenue, savings, retention, or validated learning.
8. **Specification** — no non-trivial build without an approved contract.
9. **Slice** — one independently verifiable unit at a time.

Only then does the engineering procedure library execute.

## Mandatory engineering lifecycle

The canonical procedure is:

`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`

Map work to the appropriate skills from `pauli-agent-skills-2026`.

### DEFINE

- `interview-me` when material intent is unclear.
- `idea-refine` when a concept needs structured exploration.
- `spec-driven-development` for every new product, feature, or significant change.

### PLAN

- `planning-and-task-breakdown` converts an approved specification into small, ordered, verifiable tasks.

### BUILD

- `incremental-implementation` for thin vertical slices.
- `test-driven-development` for logic and behavior changes.
- `context-engineering` to load only the context needed for the current slice.
- `source-driven-development` when framework, API, platform, or library decisions depend on external documentation.
- `doubt-driven-development` for production, security-sensitive, unfamiliar, costly, or otherwise consequential decisions.
- `frontend-ui-engineering` for user-facing interfaces.
- `api-and-interface-design` for APIs and public/internal contracts.

### VERIFY

- `browser-testing-with-devtools` for browser behavior.
- `debugging-and-error-recovery` for failures, regressions, broken builds, or unexpected runtime behavior.
- Verification must produce evidence. "Looks right" and "build passed" are not production proof.

### REVIEW

- `code-review-and-quality` before merge.
- `code-simplification` after correctness when complexity can be removed without changing behavior.
- `security-and-hardening` for auth, data, secrets, payments, external input, permissions, or production exposure.
- `performance-optimization` when performance matters; measure before optimizing.

### SHIP

- `git-workflow-and-versioning` for isolated, atomic changes and recoverable history.
- `ci-cd-and-automation` for automated quality gates.
- `documentation-and-adrs` for consequential decisions.
- `observability-and-instrumentation` for software that will run in production.
- `deprecation-and-migration` for retiring or moving systems.
- `shipping-and-launch` for staged release, monitoring, and rollback.

## Skill routing rule

Before implementation, check whether a skill applies. If a relevant skill exists, follow its workflow rather than improvising a parallel process.

Multiple skills may compose in sequence. A typical new software product is:

`commercial gate → spec-driven-development → planning-and-task-breakdown → context-engineering → source-driven-development → incremental-implementation → test-driven-development → code-review-and-quality → code-simplification → shipping-and-launch`

Use only the skills required by the risk and scope. Do not invoke extra skills merely to create activity.

## ICM mapping

Vibe Engineering remains the governing lifecycle:

`Intent → Discover → Understand → Specify → Slice → Build → Prove → Challenge → Judge → Ship → Learn`

The engineering skills fit inside it:

- **Intent / Discover / Understand** → classification, mode, context, source verification.
- **Specify** → `spec-driven-development`.
- **Slice** → `planning-and-task-breakdown`.
- **Build** → incremental implementation plus domain-specific skills.
- **Prove** → TDD, browser verification, debugging, runtime evidence.
- **Challenge** → code, security, performance, simplification reviews plus Vibe Council.
- **Judge** → Vibe Judge only. A builder or skill cannot self-authorize release.
- **Ship** → git, CI/CD, observability, launch, rollback.
- **Learn** → durable evidence, ADRs, incidents, reusable improvements.

## Polyspace and factory-runtime contract

Polyspace and any other factory runtime must consume this policy as a shared engineering standard rather than inventing a separate lifecycle.

A runtime may choose different models, agents, tools, hosting, or execution environments, but it must preserve:

- the Vibe/ICM authority hierarchy;
- specification before implementation;
- one verifiable slice at a time;
- skill-driven engineering procedures;
- independent review;
- evidence before claims;
- Judge or authorized-human release decision;
- owner sovereignty;
- rollback before release.

Tool substitution is allowed. Governance substitution is not.

## Brownfield rule

For an existing product, do not start at BUILD.

First:

1. record the baseline and rollback point;
2. inspect architecture, repository, deployment, data, and existing checks;
3. run existing checks;
4. identify conventions and reusable modules;
5. define blast radius;
6. write or update the approved specification;
7. create the smallest verifiable slice;
8. then enter the engineering lifecycle.

Rewrites require an explicit architecture decision and evidence that migration is safer and more valuable than preserving the current system.

## Greenfield rule

For a new product, validate the user, problem, smallest valuable scope, risky assumptions, commercial path, architecture, ownership, specification, and tickets before implementation.

New code without a customer/user/system outcome and measurable proof is drift.

## Completion and release gate

Engineering skill completion is necessary but not sufficient for `SHIP`.

A release still requires Vibe Engineering evidence for:

- security;
- reliability;
- user value;
- ownership and portability;
- rollback;
- observability where applicable;
- target-environment verification;
- commercial alignment;
- independent Council review proportional to risk;
- Judge or explicit authorized-human approval.

Recommended Judge floor remains `8.5/10` with all hard gates passing.

## Source and update policy

Canonical procedure source:

`https://github.com/executiveusa/pauli-agent-skills-2026`

Do not copy and independently mutate the entire skill pack into every project. Projects should reference or install the canonical pack using the integration supported by their agent/runtime. Project-local overrides may narrow behavior but may not weaken Vibe Engineering hard gates without an explicit recorded owner decision.

When the skill library changes materially, verify compatibility with this document before adopting the new revision factory-wide.

## Stop conditions

Stop and return to governance when:

- code is proposed before the commercial and specification gates;
- a tool duplicates an existing capability without justification;
- scope expands beyond the approved slice;
- ownership is unclear;
- engineering replaces outreach, proposals, payment, or validated learning;
- evidence is missing;
- a builder is about to approve itself;
- rollback is undefined;
- a runtime claims production success from CI, preview, or deployment submission alone.
