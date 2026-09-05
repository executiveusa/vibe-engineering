# RFC — Heart & Soul + Subtraction Design Governance

**Status:** IMPLEMENTED / HOUSE-INHERITED  
**Mode:** Brownfield / Client Zero  
**Issue:** #30  
**Original branch:** `design/heart-soul-subtraction-icm`

## Current authority

This RFC is implemented and no longer defines an independent process.

Current general method authority:

1. `skills/vibe-engineering/SKILL.md` — canonical House router.
2. `factory/icm/template/shared/VIBE_HOUSE_STANDARD.md` — global Layer 3 House law.
3. `factory/icm/template/shared/HEART_AND_SOUL_STANDARD.md` — canonical design/experience doctrine under the House law.
4. `factory/icm/template/shared/SUBTRACTION_GAUNTLET_STANDARD.md` — independent subtraction critic contract.
5. Product-level `DESIGN.md` — product/surface-specific direction, never universal methodology.

Canonical lifecycle:

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Design is governed inside this lifecycle. Heart & Soul does not create a second state machine.

## Decision

Make design a first-class governed Vibe Engineering process without creating a second design orchestrator or replacing ICM.

The design system uses distinct artifacts with one authoritative responsibility each:

1. `VIBE_HOUSE_STANDARD.md` — global House lifecycle, authority, proof, upstream, and documentation law.
2. `HEART_AND_SOUL_STANDARD.md` — stable design philosophy for what good human experience means.
3. `SUBTRACTION_GAUNTLET_STANDARD.md` — stable independent critic contract.
4. `docs/workflow-locker/ICM-DESIGN-SEVEN-LENS-PROMPT.md` — reusable execution prompt for any capable agent operating through ICM.
5. Product-level `DESIGN.md` — specific visual/interaction direction for the current product.

## Why

Vibe Engineering already governs product truth, ICM routing, no-slop review, reference bars, independent Council review, Judge authority, ownership, proof, rollback, and release. Heart & Soul supplies the portable design doctrine that explains:

- what human outcome the design serves;
- how psychology, hierarchy, rhythm, emotion, and restraint participate in quality;
- how to distinguish essential product identity from accumulated interface complexity;
- how to subtract without harming accessibility, trust, control, usefulness, or emotional resonance;
- how any agent can execute design work without inventing a second workflow.

## Governing principle

> Keep removing until another removal would harm user success, comprehension, trust, accessibility, control, emotional resonance, or essential product identity.

Minimalism is optional. Essentiality is mandatory.

## Seven lenses

The design process evaluates one experience through seven high-level lenses:

1. Human Outcome
2. Information & Hierarchy
3. Interaction & Journey
4. Visual & Identity
5. Motion, Rhythm & Emotion
6. System, Responsive & Accessibility
7. Trust, Proof & Sovereignty

The lenses are not seven independent agents and do not create seven parallel state machines. They converge into one approved design contract before BUILD.

## House lifecycle integration

### INTENT / `00_intake`

Establish the human outcome, target, constraints, proof, ownership, rollback, and why the experience matters.

### SPEC / `01_vision`

Load Heart & Soul for user-facing or experience work. Define desired feeling, trust requirement, primary journey, accessibility expectations, and essential qualities before feature choices.

### PLAN / `02_blueprint`

Apply the seven lenses, preserve incumbent brownfield design truth, name a reference bar where comparison matters, converge to one direction, and record what must survive subtraction.

### BUILD / `03_build`

Build only the approved bounded slice. The builder does not keep redesigning the product during implementation.

### PROOF / `04_verify`

Run the Subtraction Gauntlet on the actual artifact. Classify material elements as KEEP, MERGE, INFER, DEFER, MOVE, or REMOVE. Verify responsive/device behavior, accessibility, task behavior, trust/recovery, and relevant runtime evidence.

### COUNCIL / `05_council`

Fresh review challenges whether the seven lenses converged, whether model-default slop remains, whether evidence supports the claims, and whether subtraction stopped at a defensible essential form.

### JUDGE / `06_judge`

Judge treats unresolved material design/proof findings as `HOLD`. Judge returns only `SHIP` or `HOLD` and does not redesign the work.

### SHIP / `07_ship`

Release only the exact proven revision with authority and rollback. Verify the real live environment after release.

### OPERATE / `08_improve`

Measure real use and friction. Material change opens a new INTENT.

## External influences and boundaries

This RFC learns from already-recorded sources in the provenance ledger:

- ICM — filesystem/context architecture and bounded jobs;
- Gauntlet Loop — real comparison, independent critic, largest-gap iteration;
- Impeccable — durable product/design context, anti-default UI thinking, deterministic detectors, critique vocabulary;
- Stop Slop — directness, rhythm, trust, authenticity, density, and removal of cuttable output.

External references are quality mechanisms and research inputs, not identities to copy. Source/provenance and rights rules remain release gates where applicable.

## Rejected alternatives

### A. Put everything into root `DESIGN.md`

Rejected. Product direction and universal design doctrine require separate homes.

### B. Create a new design orchestrator/agent

Rejected. ICM already governs routing, roles, authority, context, evidence, and state.

### C. Seven specialist agents

Rejected as the default architecture. The seven concepts are lenses, not a swarm.

### D. Pure minimalism

Rejected. Accessibility, comprehension, trust, emotional resonance, identity, and human control are protected qualities.

### E. Taste with no evidence

Rejected. Taste remains judgment-sensitive, but real references, actual artifacts, user behavior, accessibility, runtime evidence, and fresh critique provide observable support.

## Acceptance criteria — current state

- Heart & Soul has one canonical Layer 3 home.
- Global House law has one canonical Layer 3 home.
- Subtraction Gauntlet has one canonical Layer 3 home.
- Seven-lens prompt remains executable by any capable ICM consumer.
- Product-specific `DESIGN.md` remains separate.
- Builders cannot self-approve taste-sensitive work.
- Judge returns only `SHIP` or `HOLD`.
- External influences remain attributable and bounded.
- Native repository checks pass before merge.
- Merge does not itself constitute production verification.

## Rollback

The implementation is fully reversible through Git. Revert the commits/PR that alter the canonical standards if the House integration is rejected. Existing physical ICM stage names remain compatible and do not require workspace migration.
