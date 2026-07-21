# Studio Adoption Plan

## Objective

Apply Vibe Engineering to the studio itself before presenting it as a course, product, or client standard.

The first proof must be that the method reduces unfinished work, undocumented decisions, tool duplication, deployment uncertainty, and owner dependence across the Pauli Effect / Yappyverse portfolio.

## Success conditions

The rollout succeeds when:

- every active project has a canonical status record;
- no active repository begins major implementation without classification, a spec, and acceptance criteria;
- production claims include verifiable evidence;
- secrets are referenced rather than pasted;
- new infrastructure requires an architecture decision;
- each release has rollback instructions;
- each project can be handed to another agent or developer without reconstructing its history from chat;
- the owner controls repositories, domains, deployment accounts, databases, data exports, and critical credentials;
- active work in progress is limited and visible.

## Phase 0 — Stop the leak

Effective immediately:

1. Do not start another framework or agent-runtime experiment without recording what existing capability it replaces.
2. Do not paste new secrets into chat, source code, screenshots, or documentation.
3. Do not claim production success without a live URL check or clearly mark it `HOLD`.
4. Do not rewrite brownfield repositories before running their current checks and mapping the architecture.
5. Do not add more than three active studio workstreams:
   - one revenue flagship;
   - one shared-platform workstream;
   - one experiment.

## Phase 1 — Create the studio registry

Create a canonical registry containing every repository and product.

Minimum fields:

| Field | Meaning |
|---|---|
| Project ID | Stable machine-readable name |
| Owner | Human or entity with final authority |
| Business goal | Why the project exists |
| Revenue model | How it sustains itself |
| Repository | Source-of-truth code location |
| Deployment | Production and preview locations |
| Mode | Greenfield or brownfield |
| Stage | Discovery, specified, building, verifying, production, parked |
| Current objective | One measurable active outcome |
| Agent | Operational agent or persona |
| Dependencies | Shared services and repositories |
| Health | Build, tests, security, UX, ownership, revenue |
| Last verified | Date and evidence reference |
| Rollback point | Last known recoverable state |

### Initial portfolio classification

Start with:

1. `vibe-engineering` — shared methodology and standards;
2. MAXX agent-managed website / migration offer — flagship revenue candidate;
3. `pauli-cloud` or designated control-plane repository — shared platform;
4. one bounded experiment only;
5. park all other projects until they receive an explicit activation decision.

## Phase 2 — Standardize every active repository

For each active repository:

1. classify greenfield or brownfield;
2. create or validate `AGENTS.md`;
3. create `PROJECT.yaml`;
4. create `ARCHITECTURE.md`;
5. create `RUNBOOK.md`;
6. create `SECURITY.md`;
7. create `DECISIONS/`;
8. create `docs/specs/`, `docs/evidence/`, and `docs/handoffs/`;
9. normalize commands for setup, development, test, audit, build, and verification;
10. record deployment and rollback paths.

Recommended command contract:

```bash
npm run setup
npm run dev
npm run lint
npm run typecheck
npm run test
npm run audit
npm run build
npm run verify
```

Equivalent commands are acceptable for non-Node projects, but the repository must expose a predictable interface.

## Phase 3 — Brownfield audit of the studio

Run the brownfield workflow on every active project.

For each repository:

1. record the base commit and branches;
2. inventory documentation and scripts;
3. run existing checks;
4. map frontend, backend, data, auth, deployment, external services, and agents;
5. identify duplicated dependencies and abandoned infrastructure;
6. identify incomplete or misleading production claims;
7. identify security and ownership gaps;
8. produce a Vibe Score;
9. return `SHIP`, `HOLD`, or `PARK`.

Do not fix everything during the audit. Separate discovery from implementation.

## Phase 4 — Choose the flagship proof

Use one commercial project to prove the full workflow from offer to operation.

Recommended flagship:

> MAXX agent-managed website and nonprofit migration service.

Required proof:

- clear target buyer;
- productized offer and price;
- repeatable onboarding;
- documented migration workflow;
- agent-managed lead and support flow;
- production deployment;
- observable operations;
- customer data ownership;
- offboarding and export procedure;
- support-cost and gross-margin model;
- first real or simulated customer completion packet.

The studio should not activate another flagship until this system is demonstrably repeatable.

## Phase 5 — Build shared skills only from proven steps

Promote a workflow into a reusable skill only after it has succeeded manually.

Each skill must include:

- trigger;
- purpose;
- prerequisites;
- inputs;
- approved tools;
- procedure;
- outputs;
- quality rubric;
- automated checks;
- failure handling;
- escalation rules;
- version;
- owner;
- example evidence packet.

Initial skills:

1. `vibe-router` — classify project and route workflow;
2. `vibe-scan` — inspect repository and current state;
3. `vibe-grill` — resolve material ambiguity;
4. `vibe-spec` — generate measurable contract;
5. `vibe-slice` — produce context-sized tickets;
6. `vibe-build` — implement approved ticket;
7. `vibe-proof` — gather evidence;
8. `vibe-council` — independent review;
9. `vibe-judge` — release decision;
10. `vibe-handoff` — transfer operation and context.

## Phase 6 — Enforce through automation

After the manual process is stable, add:

- pull-request templates requiring spec and evidence links;
- branch protection;
- mandatory CI quality gates;
- secret scanning;
- dependency auditing;
- build and test checks;
- accessibility and browser smoke checks;
- ownership and release metadata validation;
- deterministic Vibe Judge output;
- scheduled stale-project and broken-deployment checks.

Automation must enforce a proven process, not hide an unclear one.

## Phase 7 — Turn the internal system into the youth course

Only teach the parts that have survived real project use.

Each module should contain:

- one familiar analogy;
- one engineering principle;
- one AI-assisted exercise;
- one project artifact;
- one evidence requirement;
- one reflection on ownership and dependence.

Students should finish with a product they can explain, export, repair, and hand to another person—not merely a generated demo.

## First 30-day sequence

### Week 1 — Control

- lock the system prompt;
- create the studio registry;
- select three active workstreams;
- park the rest;
- establish secrets and evidence rules.

### Week 2 — Normalize

- apply repository contracts to the three active projects;
- map architecture and deployments;
- standardize commands;
- create current-state Vibe Scores.

### Week 3 — Prove

- write the flagship Vibe Spec;
- slice it into tickets;
- execute one complete vertical slice;
- collect the completion packet;
- run Council and Judge.

### Week 4 — Automate

- convert the proven flow into the first skills;
- add PR and CI enforcement;
- record lessons;
- draft the first youth lesson from the actual case study.

## Operating cadence

### Per request

`Intent → Scan → Spec → Slice → Build → Proof → Council → Judge`

### Per release

- acceptance review;
- security review;
- ownership review;
- live verification;
- rollback record;
- completion packet.

### Weekly

- portfolio registry review;
- active-work limit review;
- costs and revenue review;
- stale blockers;
- deployment health;
- skill improvements.

### Monthly

- delete or consolidate redundant tools;
- archive abandoned repositories;
- review vendor dependence;
- test one recovery or export process;
- promote successful patterns into shared skills.

## Primary metric

Do not measure success by repositories created, prompts written, features started, or agent activity.

Measure:

> Verified, owned, operating products that can continue without the original builder.
