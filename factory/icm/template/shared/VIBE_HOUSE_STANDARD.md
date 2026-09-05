# Vibe Engineering House Standard

Layer 3 global operating doctrine for every Vibe Engineering / ICM-governed project.

## Canonical upstream

- Repository: `https://github.com/executiveusa/vibe-engineering`
- House Skill: `https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md`

When upstream is reachable, inspect the current House Skill before material work. Local copies make Vibe portable; they do not silently fork the method.

## One architecture

```text
VIBE ENGINEERING
Governance / release law
        ↓
ICM
Interpretable context / durable state
        ↓
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
        ↓
ORCHESTRATOR
Routes approved work
        ↓
WORKERS
Replaceable agents or humans
```

Existing physical ICM folders remain compatible:

```text
00_intake → INTENT
01_vision → SPEC
02_blueprint → PLAN
03_build → BUILD
04_verify → PROOF
05_council → COUNCIL
06_judge → JUDGE
07_ship → SHIP
08_improve → OPERATE
```

The semantic lifecycle is authoritative. Physical compatibility names do not create a second method.

## Global project contract

Before substantial work, establish and persist:

- `MODE`
- `OUTCOME`
- `TARGET`
- `CONSTRAINTS`
- `PROOF`
- `COMMERCIAL VALUE`
- `OWNER / AUTHORITY`
- `ROLLBACK`

Separate verified facts from assumptions. Inspect before asking the owner to repeat discoverable information.

## Global execution laws

1. Inspect before change.
2. Reuse before inventing.
3. Specify before building.
4. Build one independently verifiable slice at a time.
5. Keep ICM artifacts current as work moves.
6. Builders cannot approve themselves.
7. Judge returns only `SHIP` or `HOLD`.
8. Ship only the exact proven revision.
9. Verify the live environment after release.
10. Material operational change opens a new `INTENT`.

## Truth rules

```text
BUILT ≠ VERIFIED
CI PASS ≠ CUSTOMER VALUE
DEPLOYED ≠ PRODUCTION PROOF
FORMAT PASS ≠ BEHAVIORAL PROOF
```

Proof must match the claim: tests/build/type/lint when relevant, plus runtime, browser, accessibility, security/privacy, permissions, integrations, data, mobile, deployment, or live-environment evidence when required.

## Heart & Soul inheritance

`HEART_AND_SOUL_STANDARD.md` is the canonical design/experience doctrine under this House Standard.

Heart & Soul governs how human attention, effort, confidence, emotion, trust, and control are shaped. It does not replace lifecycle authority. Design decisions still move through `INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`.

Subtraction remains the design law: remove until another removal would harm user success, comprehension, trust, accessibility, control, emotional resonance, or essential identity.

## Formatting and visual semantics

Prettier is the deterministic formatting layer where configured. It does not define workflow meaning.

Canonical stage labels/colors live in `_config/stage-system.yaml` (or `.vibe/stage-system.yaml` in lightweight installs). Use those tokens consistently in diagrams, dashboards, docs, CLI surfaces, and orchestration interfaces. Text labels remain authoritative.

## Global documentation rule

When architecture, behavior, install flow, deployment, authority, or lifecycle changes, update the durable interior files that teach the system: `AGENTS.md`, `CONTEXT.md`, architecture/design/method docs, relevant stage contracts, the House Skill, and README/install docs when public behavior changes.

Do not leave contradictory legacy doctrine unmarked. Legacy documents may preserve history, but they must point to the current House Standard when their terminology differs.

## Source-of-truth order

1. applicable owner/human authority and safety/legal boundaries;
2. current upstream Vibe House Skill and this House Standard for general method;
3. project-specific `AGENTS.md`, `ICMR.yaml`, `CONTEXT.md`, accepted specs/decisions, and current stage contracts;
4. stable Layer 3 standards and references;
5. Layer 4 working artifacts/evidence;
6. agent preferences or chat memory.

Project facts override generic assumptions. Upstream owns the general method; the project owns its specific reality.

## Finish contract

For material work, report:

- `DECISION`
- `CHANGES`
- `PROOF`
- `STATUS`
- `COMMERCIAL IMPACT`
- `RISKS`
- `ROLLBACK`
- `NEXT`
- `HUMAN APPROVAL` when required

No agent may claim `SHIP` or production success without the evidence required by the current stage.