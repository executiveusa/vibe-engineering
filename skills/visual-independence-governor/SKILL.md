---
name: visual-independence-governor
description: Prevent cross-project aesthetic convergence while preserving global quality standards. Use for any website, app, brand, interface, campaign, design system, redesign, design review, or AI-generated visual work where a project could inherit model defaults, portfolio habits, or another brand's appearance.
license: MIT
metadata:
  version: "1.0.0"
  tags: "design, visual identity, anti-convergence, anti-slop, portfolio, brand, UX, accessibility, ADHD, governance"
---

# Visual Independence Governor

## Purpose

Preserve quality across a software/design pipeline without turning quality standards into a reusable house aesthetic.

Core law:

> **Consistency belongs inside a brand, not across unrelated brands.**

Permanent companion law:

> **Preserve standards. Forget style. Every brand earns its own world.**

This skill is repository-agnostic. It may be used by humans, coding agents, design agents, orchestration systems, CI reviewers, design factories, website generators, and software factories.

It does not create a new product lifecycle. It plugs into the host system's existing discovery, specification, build, review, proof, and release stages.

## Trigger conditions

Invoke this skill when any of the following is true:

- a new visual product or brand is being created;
- a brownfield product is being redesigned;
- an agent is generating UI, web, app, brand, campaign, deck, visual system, or frontend code;
- multiple projects are beginning to look alike;
- a reference such as Apple, Collins, Awwwards, Stripe, Linear, shadcn, or another admired product is being used;
- a model proposes familiar defaults without project-specific justification;
- the same typography, palette, hero, layout, card system, spacing rhythm, or visual composition appears across unrelated projects;
- a design is being judged for originality, identity, or portfolio distinction;
- the owner asks for "clean," "premium," "modern," "simple," "high-end," "polished," or similar ambiguous aesthetic language.

## Inputs

Use what is available. Do not invent missing facts.

Minimum useful inputs:

- project intent and primary user outcome;
- audience;
- product or brand category;
- existing identity constraints, if brownfield;
- known cultural, geographic, historical, industry, or founder context;
- relevant references and anti-references;
- portfolio or sibling-project examples when available.

Optional inputs:

- screenshots;
- deployed URLs;
- source code and design tokens;
- customer research;
- analytics;
- brand guidelines;
- competitive references;
- content strategy;
- motion references;
- physical-world references.

## Output contract

Before implementation, produce a **Visual World Brief** containing:

1. WORLD
2. EMOTIONAL TARGET
3. AUDIENCE + CONTEXT
4. CULTURAL SOURCES
5. TYPOGRAPHY LOGIC
6. COLOR BEHAVIOR
7. SPATIAL DENSITY
8. COMPOSITION LOGIC
9. IMAGE LANGUAGE
10. MOTION LANGUAGE
11. INTERACTION CHARACTER
12. ANTI-REFERENCES
13. PORTFOLIO NEIGHBORS
14. REQUIRED DIFFERENTIATORS
15. ACCESSIBILITY + CLARITY CONSTRAINTS
16. PROOF PLAN

Do not treat a moodboard or adjectives alone as a sufficient Visual World Brief.

## 1. Separate quality memory from aesthetic memory

The system may preserve and reuse global quality principles such as:

- clear hierarchy;
- accessibility;
- responsive behavior;
- ADHD-friendly cognitive simplicity;
- strong information architecture;
- purposeful interaction;
- reduced unnecessary copy and UI;
- performance;
- trust;
- recovery;
- owner control;
- evidence;
- good typography;
- deliberate spacing;
- progressive disclosure;
- clear actions;
- coherent motion;
- real content;
- strong mobile behavior;
- anti-slop editing;
- verification before release.

These are **quality constraints**, not visual directions.

Do not translate them automatically into:

- white or cream backgrounds;
- editorial minimalism;
- oversized whitespace;
- giant display type;
- serif/sans pairings;
- Inter;
- Geist;
- Space Grotesk;
- Manrope;
- DM Sans;
- split-screen heroes;
- muted neutral palettes;
- black-and-cream palettes;
- thin horizontal rules;
- rounded cards;
- magazine layouts;
- centered CTA compositions;
- sticky minimal navigation;
- subdued gray supporting text.

Any of those may still be correct when the project's evidence supports them.

## 2. Zero default aesthetic

Begin every unrelated project with **zero inherited aesthetic assumptions**.

Do not ask:

> What style worked in previous projects?

Ask:

> What visual world belongs to this project?

Derive the world from project-specific evidence:

- audience;
- culture;
- geography;
- industry;
- history;
- behavior;
- founder or organization character;
- customer expectations;
- physical environment;
- references;
- competitive category;
- emotional target;
- age group;
- price position;
- content format;
- device;
- real-world use.

No visual choice is protected merely because it was approved elsewhere.

## 3. Build a visual world before a page

Before choosing components or writing production UI, define the Visual World Brief.

Every major choice should be traceable to that brief.

If the design cannot explain why its typography, palette, density, imagery, motion, and composition belong to this project, it is not ready to become a system.

## 4. Portfolio anti-convergence gate

When portfolio or sibling-project access exists:

1. identify the three visually closest existing projects;
2. compare typography;
3. compare palette;
4. compare hero/composition;
5. compare navigation;
6. compare section rhythm;
7. compare cards and geometry;
8. compare spacing density;
9. compare background treatment;
10. compare imagery;
11. compare headline scale;
12. compare CTA structure;
13. compare motion;
14. compare footer;
15. compare iconography.

Ask:

> If logos and copy disappeared, could a reasonable viewer still tell these were different brands?

If not, the design direction fails.

If portfolio access does not exist, run the same test against the project's references, category conventions, and common AI-generated defaults.

## 5. Three-dimension differentiation rule

Every unrelated brand must meaningfully differ from its nearest portfolio neighbors in at least **three major visual dimensions**.

Eligible dimensions include:

- typography;
- composition;
- palette;
- spatial density;
- imagery;
- interaction model;
- texture;
- motion;
- navigation pattern;
- geometry;
- layout rhythm;
- iconography;
- information density;
- photographic treatment.

Changing only color is not differentiation.

Changing only font is not differentiation.

Changing only hero media is not differentiation.

## 6. Simplicity is not minimalism

ADHD-friendly design means reducing **cognitive friction**, not reducing visual richness by default.

Clarity can exist inside:

- maximalism;
- manga;
- graffiti;
- sports culture;
- brutalism;
- retro computing;
- luxury;
- streetwear;
- editorial;
- cyberpunk;
- hand-drawn systems;
- indigenous visual systems;
- documentary experiences;
- dense professional software;
- gaming;
- cinematic products.

The requirement is:

> **Easy to understand, not visually empty.**

## 7. Benchmarks are quality references, never templates

Named references must be decomposed into mechanisms.

Examples:

- Collins -> rigor, narrative, typography, craft, originality.
- Apple -> clarity, confidence, usability, responsiveness, polish.
- Awwwards -> originality, execution, memorable interaction.
- Steve Krug -> comprehension and obvious next action.
- shadcn -> reusable behavior and accessible primitives.
- an admired site -> extract the specific mechanism being referenced.

Never copy a reference's brand identity merely because it is the quality bar.

Record:

- what mechanism is being borrowed;
- what appearance must not be copied;
- how the project-specific implementation differs.

## 8. Reuse engineering, not brand appearance

Reuse freely:

- accessibility utilities;
- auth;
- forms;
- data flows;
- analytics;
- CMS patterns;
- responsive primitives;
- performance techniques;
- deployment systems;
- testing;
- design-token infrastructure;
- component behavior;
- interaction primitives.

Do not let shared components silently impose:

- one palette;
- one font family;
- one corner-radius system;
- one hero;
- one card treatment;
- one spacing personality;
- one motion language;
- one brand geometry.

Shared systems should expose tokens and behavior while leaving identity project-specific.

Reuse the machine.

Do not reuse the costume.

## 9. Typography anti-default rule

Do not select a common UI font merely because it is safe.

Typography must be justified by the project's world, medium, language, accessibility needs, licensing, performance, and identity.

Repeated type pairings across unrelated projects require explicit justification.

Legibility is mandatory.

Sameness is not.

## 10. Whitespace anti-default rule

Whitespace is a tool, not a quality score.

Spacing should follow:

- information density;
- user task;
- content type;
- device;
- atmosphere;
- culture;
- rhythm;
- accessibility.

"Premium," "clean," "modern," and "simple" do not automatically authorize large empty sections.

Premium may be dense.
Clear may be colorful.
High-end may be raw.
Elegant may be expressive.

## 11. Brownfield rule

For existing products:

1. inspect before changing;
2. document the current visual language;
3. identify what users already recognize;
4. preserve distinctive strengths;
5. identify actual defects separately from taste differences;
6. improve quality without homogenizing identity;
7. keep rollback;
8. compare before/after with real evidence.

Do not redesign merely to make a product resemble current portfolio taste.

## 12. Greenfield rule

For new products:

1. understand user and outcome;
2. establish the visual world;
3. inspect category conventions;
4. identify category clichés;
5. define anti-references;
6. generate at least three meaningfully different directions when visual identity is material;
7. compare them by project fit, not fashion;
8. choose and record the rationale;
9. then build the system.

The three directions must differ structurally, not merely by palette.

## 13. Memory policy

Systems and agents may remember:

- successful user flows;
- accessibility patterns;
- interaction evidence;
- engineering patterns;
- copy principles;
- production failures;
- performance lessons;
- testing methods;
- deployment lessons.

Do not automatically promote a previous project's visual appearance into a preferred future aesthetic.

Past success becomes **knowledge**, not a template.

## 14. Visual independence review

Before a design is approved, answer:

### Identity
Does this express this project's identity rather than a model or portfolio default?

### Distinction
Can it be distinguished from nearby projects without the logo?

### Context
Can each major aesthetic choice be traced to project-specific evidence?

### Default detection
What exists because the system defaulted to it?

### Originality
Is there at least one memorable visual or interaction idea that belongs naturally to this project?

### Usability
Is the experience still clear, accessible, responsive, and easy to operate?

A failure in distinction or context returns the work to design, not build.

## 15. Agent self-correction

If the system notices recurring use of:

- clean white pages;
- cream backgrounds;
- oversized editorial headlines;
- familiar serif/sans pairings;
- repeated split heroes;
- broad empty bands;
- repeated card systems;
- identical navigation;
- repeated landing-page section order;
- default SaaS/editorial compositions;
- repeated motion recipes;

stop and record:

> **CONVERGENCE ALERT: the design is drifting toward a learned default.**

Then return to the Visual World Brief and derive a different solution.

## 16. Pipeline integration

This skill should sit before visual BUILD and again during independent design review.

Recommended generic route:

```text
DISCOVER / INTENT
-> VISUAL WORLD BRIEF
-> ANTI-CONVERGENCE CHECK
-> SPEC
-> BUILD
-> VISUAL INDEPENDENCE REVIEW
-> ACCESSIBILITY / RESPONSIVE PROOF
-> INDEPENDENT TASTE REVIEW
-> RELEASE DECISION
```

For systems with different stage names, preserve the intent:

- derive before building;
- compare before approving;
- prove before shipping.

## 17. Proof

A visual-independence claim requires evidence proportionate to the project.

Useful evidence includes:

- side-by-side screenshots;
- contact sheets;
- visual token comparisons;
- typography comparison;
- structural page comparison;
- mobile and desktop captures;
- motion recordings;
- design rationale mapped to the Visual World Brief;
- independent review;
- user comprehension evidence where appropriate.

A polished screenshot alone is not proof of independence.

## 18. Failure handling

If evidence is incomplete:

- mark the missing evidence;
- do not invent portfolio comparisons;
- proceed only with the strongest available project-specific reasoning;
- require review when access becomes available.

If the project has a locked or legally protected design system:

- preserve it;
- treat this skill as an anti-cross-brand-contamination rule;
- do not force differentiation that violates the approved brand.

If accessibility conflicts with a visual choice:

- accessibility wins;
- find a different expression of the same identity.

If a reference is essential:

- preserve the mechanism;
- remove copied identity.

## 19. Quality rubric

A strong result should satisfy all of these:

- project-specific world is explicit;
- quality standards are preserved;
- identity is not inherited from unrelated projects;
- at least three major dimensions differ from closest neighbors;
- defaults are identified and justified or removed;
- cognitive clarity survives expressive design;
- reusable engineering remains reusable;
- accessibility and responsiveness pass;
- design rationale is auditable;
- release evidence exists.

## 20. Final law

> **Preserve standards. Forget style. Every brand earns its own world.**
