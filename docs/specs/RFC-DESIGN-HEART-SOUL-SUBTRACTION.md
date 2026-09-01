# RFC — Heart & Soul + Subtraction Design Governance

**Status:** ACCEPTED FOR REVIEW  
**Mode:** Brownfield / Client Zero  
**Issue:** #30  
**Branch:** `design/heart-soul-subtraction-icm`

## Decision

Make design a first-class governed Vibe Engineering process without creating a second design orchestrator or replacing ICM.

Adopt four distinct artifacts with one authoritative responsibility each:

1. `factory/icm/template/shared/HEART_AND_SOUL_STANDARD.md` — stable Layer 3 philosophy for what good design means.
2. `factory/icm/template/shared/SUBTRACTION_GAUNTLET_STANDARD.md` — stable Layer 3 independent critic contract.
3. `docs/workflow-locker/ICM-DESIGN-SEVEN-LENS-PROMPT.md` — reusable execution prompt for any capable agent operating through ICM.
4. Product-level `DESIGN.md` — specific visual/interaction direction for the current product; never the universal philosophy.

## Why

Vibe Engineering already governs product truth, ICM routing, no-slop review, reference bars, independent Council review, Judge authority, ownership, proof, and rollback. The missing piece was a portable design doctrine that explains:

- what human outcome the design serves;
- how psychology, hierarchy, rhythm, emotion, and restraint participate in quality;
- how to distinguish essential product identity from accumulated interface complexity;
- how to subtract without harming accessibility, trust, control, or usefulness;
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

The lenses are not seven independent agents and do not create seven parallel state machines. They converge into one approved design contract before Build.

## ICM integration

### 01 Vision / See

Load Heart & Soul only for user-facing or experience work. Define desired feeling, trust requirement, and essential qualities before feature choices.

### 02 Blueprint / Shape

Apply the seven lenses, preserve incumbent brownfield design truth, name a reference bar where comparison matters, converge to one direction, and record what must survive subtraction.

### 03 Build / Make

Build only the approved bounded slice. The builder does not keep redesigning the product during implementation.

### 04 Verify / Prove

Run the Subtraction Gauntlet on the actual artifact. Classify material elements as KEEP, MERGE, INFER, DEFER, MOVE, or REMOVE. A fresh critic names the largest remaining gap and the protected quality that stops further subtraction.

### 05 Council / Challenge

Accessibility + taste review challenges whether the seven lenses actually converged, whether model-default slop remains, and whether subtraction stopped at a defensible essential form.

### 06 Judge / Decide

Judge requires subtraction evidence for user-facing work and treats an unresolved Subtraction Gauntlet HOLD as a hard stop. Judge does not redesign the work.

## External influences and boundaries

This RFC learns from already-recorded sources in the provenance ledger:

- ICM — filesystem/context architecture and bounded jobs;
- Gauntlet Loop — real comparison, independent critic, largest-gap iteration;
- Impeccable — durable product/design context, anti-default UI thinking, deterministic detectors, critique vocabulary;
- Stop Slop — directness, rhythm, trust, authenticity, density, and removal of cuttable output.

The user-provided Adobe Scan design essay and Antoine de Saint-Exupéry quotation informed the subtraction framing: good design is achieved by removing until only necessary value remains. The repository does not copy Adobe Scan's product design, interface, or proprietary implementation, and does not treat the quotation as a software license.

Vibe Engineering does not copy Impeccable's identity, visual motifs, command system, or implementation. External tools remain replaceable.

## Rejected alternatives

### A. Put everything into root `DESIGN.md`

Rejected. The current file is product/surface-specific. Mixing universal law with product direction would create duplicate authority and context pollution.

### B. Create a new design orchestrator/agent

Rejected. ICM already governs routing, roles, authority, context, evidence, and state. Design is a governed job inside that system.

### C. Seven specialist agents

Rejected as the default architecture. The seven concepts are lenses. Specialist delegation may happen inside an approved bounded job, but the method must remain usable by one capable agent.

### D. Pure minimalism

Rejected. Removing everything is not the goal. Accessibility, comprehension, trust, emotional resonance, identity, and human control are protected qualities.

### E. Taste with no evidence

Rejected. Taste remains judgment-sensitive, but named references, actual artifacts, user behavior, accessibility, runtime evidence, and fresh critique provide observable support.

## Acceptance criteria

- Root ICMR exists for the Client Zero change.
- Heart & Soul has one canonical Layer 3 home.
- Subtraction Gauntlet has one canonical Layer 3 home.
- Seven-lens prompt remains executable by any capable ICM consumer.
- Vision, Blueprint, Verify, Council, and Judge route design context only when relevant.
- Builders cannot self-approve taste-sensitive work.
- Product-specific `DESIGN.md` remains separate.
- External influences remain attributable and bounded.
- Native repository checks pass before merge.
- Independent PR review identifies the largest remaining gap.
- Merge does not itself constitute production verification.

## Rollback

The bounded change lives on `design/heart-soul-subtraction-icm`. If review rejects the architecture, close the PR or revert the design-governance commits. The pre-change main baseline remains `6335af5f49c2750d28faa8163ed2af096af5384c`.

## Release authority

RFC acceptance authorizes review, not merge or production release. Existing Vibe Engineering Judge, human approval, CI, rights, rollback, and live target verification rules remain authoritative.
