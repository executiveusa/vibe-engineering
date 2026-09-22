---
name: icm-awwwards-taste-gauntlet-audit
version: 1.0.0
type: repo-agnostic website audit + remediation skill
status: production-candidate
mode_default: audit_only
governance: ICM
---

# ICM Awwwards Taste Gauntlet — Website Audit & Remediation Skill

## Purpose

This skill is a **repo-agnostic, architecture-aware website judge and remediation workflow** for agents working inside an ICM-governed software factory.

It is designed to answer four questions before any website ships:

1. **Does the site communicate the right thing immediately?**
2. **Does the experience feel deliberate, responsive, tactile, and alive rather than flat or generated?**
3. **Does the implementation fit the actual site, stack, audience, and business objective instead of forcing a template?**
4. **Can the result survive a hostile comparison against a real, fetchable, award-level reference?**

The goal is not to make every website look like an Awwwards portfolio.

The goal is to make every website feel like the **best possible version of what it actually is**.

A law firm should not behave like an experimental music studio.
A nonprofit should not look like a SaaS dashboard.
An eCommerce store should not hide the purchase path behind cinematic effects.
A creative studio should not feel like a government form.
A local service business should not sacrifice comprehension for spectacle.
A product interface should not imitate a brand-film microsite.

**Taste is contextual. The judge must infer the job before judging the execution.**

---

# 1. Governing Philosophy

## 1.1 The central law

> **Understand the site before trying to improve the site.**

Never begin with animation, color, typography, components, frameworks, libraries, or trends.

Begin with:

- what the organization is,
- who the user is,
- what the user needs,
- what the site is supposed to make them understand,
- what action matters,
- what proof must exist,
- what emotional tone is appropriate,
- and what technical system already exists.

The skill is not a style injector.

It is a **reasoning system for taste, clarity, interaction quality, truth, and release discipline**.

---

# 2. Hard Laws

These rules are non-negotiable.

## LAW 01 — Inspect before changing

Do not redesign from screenshots alone when source is available.

Inspect:

- repo structure,
- framework,
- routes,
- component system,
- styling approach,
- motion libraries,
- content sources,
- CMS,
- APIs,
- data dependencies,
- deployment configuration,
- environment assumptions,
- tests,
- analytics,
- accessibility behavior,
- responsive rules,
- and production runtime.

If the repository is brownfield, preserve its architecture unless there is evidence that the architecture itself is the problem.

## LAW 02 — Runtime truth beats source-code assumptions

A file that looks correct is not proof.

The agent must distinguish:

- coded,
- built,
- deployed,
- rendered,
- interactive,
- accessible,
- and verified in production.

Never collapse these states into “done.”

## LAW 03 — No invented proof

Never invent:

- customers,
- testimonials,
- awards,
- usage metrics,
- revenue,
- locations,
- partnerships,
- case studies,
- certifications,
- client outcomes,
- security claims,
- accessibility conformance,
- availability,
- or product capability.

Unknown evidence remains unknown.

Use placeholders only when the user explicitly allows them.

## LAW 04 — One signature idea beats twenty effects

A high-craft website does not need maximum animation.

It needs a **coherent interaction thesis**.

Prefer:

- one memorable spatial behavior,
- one distinctive transition language,
- one clear motion hierarchy,
- one strong visual concept,

over:

- random parallax,
- arbitrary text reveals,
- excessive cursor effects,
- stacked gradients,
- floating blobs,
- decorative 3D,
- endless glass cards,
- and “look what the framework can do” animation.

## LAW 05 — Motion must explain, orient, confirm, or delight

Every motion behavior must earn its existence.

Valid jobs:

- reveal hierarchy,
- show cause and effect,
- preserve orientation,
- communicate state,
- reinforce affordance,
- guide attention,
- create continuity,
- provide tactile-feeling feedback,
- express brand character,
- or create one intentional signature moment.

Invalid jobs:

- “make it more premium,”
- “make it move,”
- “Awwwards sites do this,”
- “the library supports it,”
- or “it looks cool in isolation.”

## LAW 06 — Native control remains sacred

Do not fight the user.

Avoid scroll hijacking, nonstandard pointer capture, trapped gestures, delayed navigation, or animation that prevents normal reading.

Smoothness must not come at the expense of control.

## LAW 07 — Reduced motion is a real experience, not a disabled experience

`prefers-reduced-motion` must preserve:

- comprehension,
- hierarchy,
- state,
- orientation,
- and action.

Do not simply hide important content or remove necessary feedback.

## LAW 08 — Mobile is a composition, not a shrunk desktop

Audit mobile independently.

Do not assume desktop behavior scales down.

Check:

- hierarchy,
- crop,
- reading order,
- tap targets,
- sticky elements,
- viewport height,
- thumb reach,
- motion intensity,
- hover dependencies,
- menu behavior,
- safe areas,
- keyboard behavior,
- form ergonomics,
- and performance.

Minimum touch target: **44 × 44 CSS pixels** unless platform conventions require more.

## LAW 09 — Builders cannot approve themselves

A builder may implement.

A separate critic must judge.

The final Gauntlet comparison must use a **fresh critical context** whenever the environment supports it.

## LAW 10 — No arbitrary scores as the final truth

Scores are diagnostic only.

The decisive Gauntlet question is:

> **When placed beside the chosen real-world reference, which experience is better for this site’s actual job, and why?**

The loop does not end because the site reached “9.2.”

The loop ends because:

- hard gates pass,
- the largest material gap has been removed,
- and the work survives direct comparison.

---

# 3. ICM Architecture Requirement

This skill assumes the repository participates in an ICM architecture.

The agent must begin with an **ICM Walk Test**.

Do not modify the site until the Walk Test passes or the repository is explicitly placed in investigation mode.

---

# 4. ICM Walk Test

A cold agent entering the repository must be able to answer the following without relying on hidden conversational memory.

## Required Walk Test fields

1. **Purpose** — What is this repository and what outcome does it exist to create?
2. **Owner** — Who owns it and who may approve consequential changes?
3. **Current stage** — Intake, strategy, design, build, validation, delivery, publish, maintenance?
4. **Read scope** — What may the agent inspect?
5. **Write scope** — What may the agent change and what is protected?
6. **Required skills / policies** — What governs design, engineering, security, accessibility, brand, and deployment?
7. **Expected outputs** — Audit, diff, PR, screenshots, proof receipt, release note?
8. **Pass bar** — What must be true before the stage is complete?
9. **Proof** — What evidence proves it?
10. **Next handoff** — Which stage or human receives the result?

## Walk Test result states

Use only:

- `PASS`
- `WARN`
- `BLOCK`
- `NOT_APPLICABLE`

Each result must include:

- evidence,
- source/path,
- consequence,
- remediation,
- and whether human approval is required.

## If the Walk Test fails

Do **not** pretend the repo is ICM-compliant.

Set:

```yaml
icm_state: NOT_CONFIGURED
mode: investigative_audit
```

Then:

1. perform read-only architecture discovery,
2. map the repo,
3. locate existing instructions and source-of-truth files,
4. infer the current workflow cautiously,
5. identify what is missing for the Walk Test,
6. continue the website audit only where evidence is sufficient,
7. clearly mark assumptions,
8. do not perform irreversible or broad restructuring,
9. alert the user in the final handoff that the repository does not currently pass the ICM Walk Test.

If safe and explicitly authorized, the agent may propose the minimum ICM routing files needed to make the repo walkable.

---

# 5. Default ICM Stage Model

Use the repository’s canonical ICM structure if one exists.

If no local naming convention overrides it, reason using:

```text
00_intake
10_strategy
20_design
30_validate
40_deliver
50_publish
```

For deeper factories, these may expand into more granular stages.

**One folder, one job.**
**Load only the context required for the current stage.**
Do not flood every worker with the entire repository or every policy.

---

# 6. Operating Modes

## MODE A — `audit_only` (default)

Read-only.

Use when the user asks to audit, review, critique, inspect, assess, compare, diagnose, or plan.

No code changes.

## MODE B — `remediate_branch`

Allowed only when the user asks for implementation.

Requirements:

- clean working tree or isolated worktree,
- named branch,
- bounded scope,
- rollback point,
- baseline evidence before edits,
- changed-file inventory,
- post-change tests.

## MODE C — `release`

Allowed only after:

- hard gates pass,
- independent review passes,
- exact commit is known,
- deployment target is known,
- rollback is documented,
- production evidence is captured.

Never infer deployment success from a merge.

---

# 7. Phase 0 — Establish Runtime Truth

Before design judgment, establish what is actually running.

Capture:

```yaml
baseline:
  repo:
  branch:
  head_sha:
  framework:
  package_manager:
  styling:
  cms:
  motion_stack:
  deployment_target:
  production_url:
  preview_url:
  test_commands:
  build_command:
  known_failures:
```

Verify:

- build status,
- route health,
- console errors,
- broken assets,
- network failures,
- redirects,
- mobile overflow,
- production-vs-branch mismatch,
- stale deploys.

If live behavior differs from source, judge the live behavior and record the drift.

---

# 8. Phase 1 — Identify What Kind of Site This Is

Do not use a universal design rubric without first classifying the site.

Infer the primary archetype.

Possible archetypes include:

- service business,
- local business,
- agency/studio,
- nonprofit,
- advocacy,
- personal/portfolio,
- editorial/publication,
- eCommerce,
- product/SaaS,
- product documentation,
- event,
- restaurant/hospitality,
- education,
- government/public service,
- community,
- entertainment,
- campaign,
- experimental/brand experience,
- internal dashboard,
- authenticated product application,
- hybrid.

Then identify:

```yaml
site_identity:
  archetype:
  primary_audience:
  secondary_audience:
  user_intent:
  business_intent:
  governing_message:
  primary_action:
  secondary_action:
  required_proof:
  emotional_register:
  expected_session_length:
  content_density:
  transaction_risk:
  accessibility_risk:
```

If this cannot be inferred with confidence, stop aesthetic remediation and investigate further.

---

# 9. Phase 2 — Steve Krug Clarity Test

A visitor should not have to think about basic orientation.

Run the test in a clean browser without repository context.

Within approximately two seconds, determine whether a new visitor can answer:

1. Where am I?
2. What is this?
3. Is this for me?
4. What can I do here?
5. What should I do next?
6. Why should I trust this?
7. How do I get back or move forward?

The page fails if the visitor must decode branding language, scroll through a film, open navigation, or understand internal terminology before these answers become available.

---

# 10. The “Understand / Believe / Act / Trust” Model

Every important page must support four states.

## Understand
What is this?

## Believe
Why should I take it seriously?

## Act
What is the next useful action?

## Trust
Is the organization real, competent, safe, and honest?

Do not force every page to display all four with equal weight.

Determine which state is dominant for that page.

---

# 11. Message Architecture Audit

Check:

- governing idea,
- audience fit,
- information hierarchy,
- specificity,
- proof placement,
- CTA clarity,
- CTA competition,
- jargon,
- repetition,
- hidden assumptions,
- unsupported claims,
- internal language exposed to customers,
- technical mechanism shown before outcome,
- content density,
- reading rhythm,
- empty marketing adjectives,
- AI-generated cadence.

Primary marketing copy should generally favor:

> outcome → relevance → proof → action

over:

> technology → mechanism → buzzword → feature pile

unless the technology itself is the product being purchased.

---

# 12. Anti-Slop Double-Cross Check

The site must survive **two independent anti-slop passes**.

## Judge A — Content / product slop

Reject:

- invented proof,
- vague “transform your business” language,
- repeated claims,
- filler sections,
- fake urgency,
- empty social proof,
- redundant feature lists,
- generic AI terms,
- unsupported superlatives,
- placeholder language presented as final,
- explanations that exist only because the design is unclear.

## Judge B — Visual / interaction slop

Reject:

- default shadcn/SaaS card grids when inappropriate,
- purple/blue gradient dependency,
- nested glass cards,
- excessive pills,
- giant meaningless metrics,
- random glowing orbs,
- decorative blobs,
- arbitrary bento layouts,
- over-rounded everything,
- generic dashboard chrome,
- homogeneous section rhythms,
- every section animating the same way,
- every heading using the same reveal,
- parallax added because parallax exists,
- motion that masks weak hierarchy,
- hover-only information,
- cloned Awwwards tropes with no relationship to the brand.

Both judges must pass.

---

# 13. Collins-Level Taste Bar

Treat Collins-level work as a **strategic craft standard**, not a visual preset.

Audit:

- governing idea,
- concept coherence,
- distinction,
- restraint,
- editorial composition,
- typography,
- negative space,
- content hierarchy,
- art direction,
- brand-specific detail,
- cultural intelligence,
- microcopy,
- responsive translation,
- interaction language,
- proof integration,
- consistency across inner pages,
- and the feeling that every element survived a reasoned subtraction pass.

Ask repeatedly:

- Can this be removed?
- Can this be combined?
- Can this be shorter?
- Can this appear only when needed?
- Can the user infer this without explanation?
- Does this element express the governing idea?
- Would the page become clearer if this disappeared?
- Is the design carrying weak content?
- Is motion carrying weak design?

---

# 14. Awwwards-Level Jury Model

Awwwards-style evaluation is useful as a pressure test, but must not turn every site into an experimental portfolio.

Use these four diagnostic lenses:

```text
DESIGN
USABILITY
CREATIVITY
CONTENT
```

A practical weighting for jury simulation:

```text
Design     40%
Usability  30%
Creativity 20%
Content    10%
```

Do not use the weighted score as the final release decision.

Averages cannot conceal a hard usability, truth, accessibility, or production failure.

---

# 15. The Awwwards Interpretation Rule

**Awwwards is a bar for craft, not a required aesthetic.**

The critic must ask:

> Would master-level designers recognize intentionality, coherence, detail, originality, and execution quality here?

Not:

> Does this resemble this month’s Awwwards winners?

A plain, direct nonprofit donation page can meet the taste bar without WebGL.

A high-end creative studio may legitimately need more cinematic behavior.

The site archetype decides the appropriate expressive range.

---

# 16. Reference-Bar Selection

The Gauntlet requires real references.

A valid bar must be:

- named,
- fetchable,
- viewable,
- relevant,
- comparable,
- and current enough to remain useful.

Never use vague bars such as “Apple-level,” “Awwwards-level,” “premium,” “modern,” “luxury,” or “Webflow quality” without also selecting concrete reference artifacts.

---

# 17. Reference Set Strategy

Use a **reference set**, not a clone target.

Select 2–4 references with different jobs:

1. **Clarity reference**
2. **Craft reference**
3. **Motion / interaction reference**
4. **Archetype-specific reference**

The final site should synthesize principles, not copy composition.

---

# 18. Current High-Bar Web References

Use live examples only after confirming they remain accessible.

Useful classes of reference include:

- Webflow Award winners,
- Awwwards Site of the Day / Developer Award work,
- studios with strong case-study craft,
- brand experiences where motion supports storytelling,
- product sites where motion supports comprehension.

Examples discovered during this skill’s research include:

- Webflow Awards “Website Experience of the Year” work,
- Webflow Awards “Best Animated Experience” work,
- award-winning studio work from Refokus,
- award-winning work associated with Ilja van Eck,
- award-winning work associated with Nkenna Amadi,
- Lazarev.agency case studies,
- ThreeSixtyEight,
- 8 Seconds,
- Move Animation,
- Webflow Made in Webflow award-winning interaction examples.

These are **reference pools**, not mandatory templates.

The agent must choose references based on the site being audited.

---

# 19. Gauntlet Loop

The Gauntlet is mandatory for high-craft remediation.

## Step 1 — Builder

The builder receives:

- mission,
- site identity,
- scope,
- constraints,
- governing idea,
- baseline,
- selected references,
- hard gates,
- and the single largest gap.

The builder makes a bounded improvement.

## Step 2 — Fresh critic

A separate critic receives:

- rendered output,
- selected reference,
- page purpose,
- user task,
- hard gates.

The critic should **not** receive the builder’s self-justification unless necessary.

## Step 3 — Blind comparison

Where possible, remove identifying labels.

Ask:

> Which experience better serves the defined job?

Then force explanation across:

- clarity,
- hierarchy,
- flow,
- credibility,
- interaction,
- motion,
- detail,
- mobile,
- accessibility,
- performance,
- originality,
- and taste.

## Step 4 — Identify ONE biggest gap

Do not return a shopping list of subjective tweaks.

Pick the one gap that most limits the experience.

Examples:

- hero does not explain the business,
- motion has no hierarchy,
- mobile card rail fights the thumb,
- CTA is not obvious,
- case-study proof is buried,
- typography has no editorial rhythm,
- navigation feels detached from scroll state,
- components feel stock,
- experience is over-animated,
- route transitions break continuity,
- interaction states feel dead.

## Step 5 — Repair the bounded gap

The builder fixes:

- the biggest gap,
- plus any hard blockers found during the pass.

Nothing else.

## Step 6 — Repeat

No arbitrary number of rounds.

Stop only when:

- the work wins or holds its own in the blind comparison,
- hard gates pass,
- and further complexity would reduce clarity, performance, accessibility, or authenticity.

The critic is allowed to say:

> The simpler version is better. Stop.

---

# 20. Motion Audit — What the MACS Audit Taught Us

A polished static website can still feel unfinished.

During the MACS motion audit, several important failure modes emerged.

The audit must explicitly check for these.

## 20.1 Flat wrapper failure

A site may technically use a motion library while most page sections still behave like static wrappers.

Check:

- Are motion components actually attached to meaningful regions?
- Are the transforms perceptible?
- Are they tied to scroll or interaction state?
- Is the site only “animated” in source code?

## 20.2 Imperceptible transition failure

Route or component transitions can exist but be too subtle to register.

Check:

- duration,
- spatial delta,
- opacity delta,
- easing,
- continuity,
- and whether the user perceives a state change.

Do not confuse “nonzero animation values” with meaningful motion.

## 20.3 Single-plane failure

When image, headline, copy, and controls all move as one layer, the site may still feel flat.

Evaluate whether the composition benefits from separate depth behavior for:

- ambient/background,
- media,
- heading,
- supporting copy,
- navigation,
- and foreground actions.

Use differential depth only when it supports hierarchy.

## 20.4 Uniform-motion failure

If every section enters with the same fade-up animation, the animation becomes a template.

Vary behavior according to function:

- headings may establish,
- media may settle,
- proof may reveal,
- actions may respond,
- navigation may adapt,
- transitions may preserve continuity.

## 20.5 Dead-header failure

A fixed header that never acknowledges scroll position can feel mechanically detached from the page.

Audit whether the header should:

- remain static,
- compress,
- disappear,
- reveal on upward scroll,
- change contrast,
- gain depth,
- or shift navigation priority.

The correct behavior depends on site type and content density.

Do not automatically install a disappearing header.

## 20.6 Dead-control failure

Buttons, menu triggers, cards, arrows, and drawers should acknowledge user input.

Audit:

- hover,
- focus,
- active/pressed,
- selected,
- loading,
- success,
- error,
- disabled.

For premium-feeling surfaces, interaction feedback should be:

- immediate,
- restrained,
- consistent,
- and proportional.

“Tactile” on the web usually means **visual/spatial confirmation**, not literal device vibration.

Examples:

- 1–2px travel,
- slight scale compression,
- shadow response,
- icon shift,
- spring return,
- state-color transition.

Do not overdo it.

## 20.7 Drawer / modal flatness

Drawers and overlays should communicate where they came from and where they go.

Audit:

- entrance origin,
- backdrop,
- focus movement,
- exit direction,
- focus return,
- Escape behavior,
- body scroll,
- reduced motion.

Motion cannot replace accessibility mechanics.

## 20.8 Scroll scaling can break touch targets

A key lesson from the MACS audit:

**Transform scaling on a parent can visually shrink interactive targets below the 44px touch minimum even when CSS dimensions appear correct.**

Therefore measure **rendered bounding boxes**, not just declared `min-height`.

Any scroll scene that scales interactive content must be tested at actual intermediate scroll positions.

Prefer translation/opacity over parent-scale when interactive controls live inside the transformed container.

## 20.9 Motion can destabilize visual QA

Long-running scroll-linked motion, continuously active media, or network-idle assumptions can make screenshot tests hang.

Visual QA should:

- use deterministic page readiness,
- disable or settle unnecessary animation for capture,
- avoid `networkidle` when the page intentionally maintains live activity,
- allow sufficient screenshot timeout,
- and separately test dynamic motion behavior.

Do not “fix” this by removing meaningful runtime behavior solely to satisfy brittle tests.

## 20.10 Pressed-state tests must simulate real interaction

Synthetic event dispatch may not reproduce browser pseudo-state behavior such as `:active`.

For tactile-state validation:

- use real pointer/mouse/touch actions,
- measure rendered transforms/styles,
- and verify release recovery.

## 20.11 Motion needs explicit regression coverage

A serious motion system should test:

- scroll response,
- header state transitions,
- pressed state,
- drawer/modal transitions,
- reduced motion,
- mobile overflow,
- touch-target geometry,
- console cleanliness,
- and representative screenshots.

---

# 21. Motion Intensity Decision Matrix

Do not use the same motion intensity everywhere.

## Low motion

Best for legal, government, medical, accessibility-sensitive content, dense documentation, transactional forms, and high-risk financial workflows.

Favor opacity, short translation, state transitions, clear focus, and minimal continuity motion.

## Medium motion

Best for service businesses, nonprofits, agencies, editorial, education, local brands, and most marketing sites.

Favor layered reveals, modest parallax, responsive headers, tactile controls, route continuity, and selected media choreography.

## High expressive motion

Potentially appropriate for creative studios, entertainment, film, fashion, art, experimental portfolios, and premium launch experiences.

Still require user control, meaningful concept, readable content, mobile translation, reduced motion, and performance discipline.

---

# 22. Interaction Timing Principles

Avoid rigid universal numbers.

Judge by context.

As a practical default:

- direct control feedback should feel immediate,
- most hover/press transitions should be short,
- route transitions should not delay navigation unnecessarily,
- staged entrances should finish before they become a reading obstacle,
- looping ambient motion should never demand constant attention.

If a user notices the animation before the interface, ask whether the animation is too strong.

---

# 23. Motion Implementation Rules

Prefer:

- transform,
- opacity,
- composited effects,
- restrained blur where justified,
- CSS transitions for simple state,
- framework-native animation where already present,
- GSAP only when timeline complexity warrants it,
- Framer Motion / Motion when already part of React architecture,
- Webflow Interactions / GSAP when appropriate to a Webflow build.

Avoid replacing a working motion stack merely because another library is fashionable.

---

# 24. Stack-Aware Behavior

The skill must detect and respect the codebase.

## If Webflow

Inspect interactions, class strategy, components, variables, CMS, custom code, GSAP usage, breakpoints, reusable interaction patterns, accessibility controls, reduced motion, and designer maintainability.

Do not turn a maintainable Webflow project into a custom-code dependency maze without cause.

## If React / Next.js

Inspect component boundaries, Server/Client component decisions, hydration cost, motion library loading, layout shift, route transitions, image behavior, CSS architecture, event handling, focus behavior, and bundle impact.

Do not make every component a client component just to animate it.

## If Vue / Nuxt / Svelte / Astro / other

Use the same principles while respecting local framework idioms.

Do not port React patterns into a different stack without need.

## If static HTML/CSS/JS

Favor simple, dependency-light solutions.

Do not install a framework solely for microinteraction polish.

---

# 25. Full Interaction Surface Audit

For every user-facing interactive element, trace:

```text
surface
→ affordance
→ input
→ handler
→ visual response
→ state transition
→ success/error
→ persisted result (if applicable)
→ evidence
```

Reject dead controls, fake success, toast-only success for consequential actions, forms that never persist, links that look like buttons but do nothing, hover-only essential content, and mobile states with no equivalent interaction.

---

# 26. Haptic-Feeling Web Detail Audit

The agent should inspect the small details that make software feel “finished.”

Check:

- button compression,
- spring return,
- cursor/pointer appropriateness,
- icon travel,
- active nav state,
- selection response,
- focused field response,
- drag resistance,
- scroll boundary behavior,
- disclosure animation,
- loading continuity,
- success confirmation,
- error recovery,
- menu opening direction,
- drawer origin,
- image hover crop,
- card hover elevation,
- link underline behavior,
- tactile hierarchy between primary and secondary actions.

These details should create **confidence**, not spectacle.

---

# 27. Navigation Audit

Ask:

- Is primary navigation obvious?
- Does the user know current location?
- Is the most important action visible?
- Is the menu necessary?
- Does mobile navigation trap and return focus correctly?
- Does Escape close temporary surfaces?
- Does scroll behavior change navigation in a useful way?
- Is the logo a reliable home affordance?
- Are labels human?
- Are there too many choices?
- Is navigation consistent across routes?

---

# 28. CTA Audit

Identify one primary action per page unless the page legitimately requires another structure.

Audit wording, prominence, placement, repetition, competing CTAs, disabled/loading states, tap size, interaction response, destination, and whether the next page fulfills the promise.

A beautiful button that leads to a confusing flow is a failed CTA.

---

# 29. Form Audit

Check:

- only necessary fields,
- clear labels,
- autocomplete,
- correct input types,
- touch ergonomics,
- readable error messages,
- field-level errors,
- focus movement,
- submit state,
- duplicate submission behavior,
- persistence,
- success evidence,
- spam controls,
- privacy context,
- keyboard behavior,
- mobile keyboard overlap.

Do not animate forms in ways that move fields while users are completing them.

---

# 30. Media Audit

Inspect aspect ratio, crop, art direction, source quality, loading, poster state, autoplay behavior, captions, controls, mobile fallback, contrast, text-over-media, rights/provenance, and reduced-motion behavior.

Never use low-resolution media as a “cinematic effect.”

---

# 31. Typography Audit

Judge hierarchy, type roles, optical scale, line length, line height, tracking, weight, responsive behavior, widows/orphans where material, contrast, paragraph rhythm, label rhythm, number styling, and consistency.

Large type is not automatically editorial.

---

# 32. Layout Audit

Check grid logic, alignment, spacing rhythm, visual balance, asymmetry with intention, section pacing, edge behavior, viewport use, fold relationship, media placement, and mobile reading order.

Reject “random offset = creative.”

---

# 33. Depth Audit

Depth may come from layering, overlap, scale, contrast, focus, shadow, motion, perspective, z-order, crop, and texture.

Do not force multiple depth techniques.

Use the minimum needed to make hierarchy feel spatially intentional.

---

# 34. Responsive Matrix

At minimum validate representative widths around:

```text
320
360
390
430
768
1024
1280
1440
```

Add widths based on actual analytics/device audience when available.

Check horizontal overflow, type wrap, orphaned controls, crop, grid collapse, nav, sticky behavior, motion, forms, touch targets, footers, modals/drawers, and safe areas.

---

# 35. Accessibility Hard Gate

A site cannot pass the taste Gauntlet while failing basic accessibility.

Check semantic structure, heading order, landmarks, keyboard access, visible focus, focus trap only where appropriate, focus return, skip navigation where needed, labels, accessible names, color contrast, non-color state cues, reduced motion, media alternatives, zoom, responsive text, error identification, target size, no flashing hazards, and no hover-only essential actions.

Never claim WCAG/ADA compliance unless it has actually been established.

---

# 36. Performance Hard Gate

High-craft motion cannot excuse slow or unstable behavior.

Measure rather than guess.

Watch for oversized video, excessive JavaScript, layout shift, hydration bloat, unbounded observers, continuous animation, heavy filters, WebGL cost, font blocking, image decoding, unnecessary preload, and third-party scripts.

Performance optimization must preserve the governing experience, not flatten it blindly.

---

# 37. Truth / Product Reality Gate

For product sites, trace claims to reality.

For each major capability:

```text
claim
→ visible UI
→ handler
→ service/API
→ canonical state
→ result
→ evidence
```

Mark:

- `PROVEN`
- `PARTIAL`
- `PLANNED`
- `UNKNOWN`
- `FALSE`

Never market `PLANNED` as `PROVEN`.

---

# 38. Visual QA

Visual QA is mandatory.

Capture phone, tablet, and desktop.

At minimum include home, primary conversion page, representative content page, representative product/case-study page, menu open, modal/drawer open, and error state if relevant.

When motion is central, capture both settled-state screenshots and behavioral test evidence.

---

# 39. Independent Critic Prompt

Use this structure:

```text
You are the independent website critic.

You did not build this artifact.

Judge the rendered experience against:
1. the site’s actual job,
2. the named reference bar,
3. Steve Krug clarity,
4. Collins-level strategic craft,
5. anti-slop rules,
6. accessibility,
7. responsive behavior,
8. motion and tactile detail,
9. truthfulness,
10. performance.

Do not reward complexity.

Do not rewrite the site yourself.

Identify:
- the single biggest gap,
- any hard blockers,
- whether the simpler version would be better,
- and which artifact wins in direct comparison.

Support every judgment with observable evidence.
```

---

# 40. “Master Designer” Taste Questions

A harsh critic should ask:

- What is the idea?
- What is the one thing I remember?
- Does the behavior belong to this brand?
- Is the hero doing actual work?
- Is the user being guided or entertained?
- Is the visual rhythm authored or generated?
- Are the inner pages as considered as the homepage?
- Is mobile genuinely designed?
- Are controls alive?
- Does every transition preserve orientation?
- Is there one signature interaction?
- Is any effect compensating for weak content?
- Is anything trying too hard?
- Could 20% be removed with no loss?
- Does the site feel more expensive because of precision, or merely busier?
- Would a human creative director defend each unusual choice?
- Is there a moment of surprise without confusion?
- Is the experience still good with motion disabled?
- Is the experience still good on a mediocre phone?
- Is the website serving its audience or the designer’s reel?

---

# 41. Failure Patterns to Explicitly Search For

## Strategic
- unclear audience,
- unclear offer,
- unclear action,
- mixed positioning,
- too many goals,
- no proof,
- unsupported proof.

## Visual
- template residue,
- stock layout,
- generic cards,
- arbitrary gradients,
- no typographic hierarchy,
- inconsistent radii/shadows,
- unconsidered inner routes,
- spacing drift.

## Motion
- fade-up everywhere,
- opacity-only polish,
- parent scaling that shrinks controls,
- motion with no narrative,
- scroll-jacking,
- over-parallax,
- hover-only behavior,
- no pressed states,
- dead header,
- discontinuous route changes,
- reduced motion broken.

## Mobile
- desktop squeezed down,
- crop failures,
- horizontal overflow,
- tap targets below 44px,
- endless stacked cards,
- sticky CTA covering content,
- menu trap,
- viewport-height bugs.

## Technical
- console errors,
- broken routes,
- stale build,
- preview mismatch,
- deploy mismatch,
- mock success,
- inaccessible dialogs,
- giant bundles,
- layout shift.

---

# 42. Remediation Strategy

Fix in this order unless evidence demands another order:

1. truth / broken function,
2. site purpose and CTA,
3. navigation / orientation,
4. mobile blockers,
5. accessibility blockers,
6. information hierarchy,
7. proof,
8. typography / layout system,
9. interaction states,
10. motion hierarchy,
11. signature moment,
12. polish.

Never start with #11 while #1–#6 are broken.

---

# 43. Minimal-Change Brownfield Rule

For existing sites:

1. record baseline,
2. map architecture,
3. identify blast radius,
4. choose smallest useful slice,
5. make isolated changes,
6. test,
7. visually verify,
8. compare,
9. retain rollback.

Do not perform an unrequested redesign.

---

# 44. Rollback Requirement

Before remediation, capture:

```yaml
rollback:
  branch:
  baseline_sha:
  deployment_id:
  database_change: false
  asset_change: false
  external_side_effects: []
```

If external state changes, rollback instructions must cover it.

---

# 45. Evidence Receipt

Every completed run should emit:

```yaml
audit_receipt:
  repo:
  branch:
  baseline_sha:
  final_sha:
  site_archetype:
  governing_message:
  primary_action:
  icm_walk_test:
  references:
  hard_gates:
  largest_gap_before:
  remediation:
  largest_gap_after:
  lint:
  typecheck:
  build:
  browser_tests:
  responsive:
  accessibility:
  reduced_motion:
  production_deploy:
  production_commit_match:
  rollback:
  unresolved:
```

Never write `PASS` without evidence.

---

# 46. Release Gates

A release is blocked if any of these remain:

- Walk Test `BLOCK` for an ICM-governed repo,
- broken primary route,
- broken primary CTA,
- invented consequential claim,
- inaccessible primary journey,
- mobile horizontal overflow,
- primary tap target below minimum,
- unhandled reduced motion for motion-heavy UX,
- console/runtime failure on primary routes,
- build failure,
- production commit mismatch,
- unknown rollback,
- builder-only approval,
- unresolved security/secrets exposure.

---

# 47. Taste Gate

Even when technical gates pass, do not ship obvious slop.

The final critic must be able to state:

```text
The site has a clear governing idea.
The experience fits its actual audience and purpose.
The visual language is specific rather than generic.
Motion supports meaning and state.
Controls acknowledge interaction.
Mobile feels intentionally composed.
The site remains usable with reduced motion.
No major element appears accidental.
The work survives direct comparison with its chosen bar.
```

If not, identify the largest gap and re-enter the Gauntlet.

---

# 48. When NOT to Add More

Stop adding polish when:

- the primary action becomes less obvious,
- reading becomes slower,
- mobile becomes heavier,
- motion becomes the subject,
- effects compete,
- the page loses calm,
- performance degrades,
- reduced motion becomes a second-class experience,
- or the site starts resembling references more than its own brand.

Subtraction is a design action.

---

# 49. Suggested Agent Workflow

```text
START
  ↓
ICM WALK TEST
  ↓
PASS? ── no ──> INVESTIGATIVE MODE + ALERT
  │
 yes
  ↓
RUNTIME BASELINE
  ↓
REPO / STACK MAP
  ↓
SITE ARCHETYPE + USER JOB
  ↓
MESSAGE / CTA / PROOF MODEL
  ↓
KRUG CLARITY AUDIT
  ↓
COLLINS STRATEGY + TASTE AUDIT
  ↓
ANTI-SLOP DOUBLE-CROSS
  ↓
MOBILE + ACCESSIBILITY + PERFORMANCE
  ↓
MOTION / TACTILE / STATE AUDIT
  ↓
SELECT REAL REFERENCE SET
  ↓
IDENTIFY SINGLE LARGEST GAP
  ↓
AUDIT-ONLY? ── yes ──> REPORT + RECEIPT
  │
 no
  ↓
ISOLATED REMEDIATION
  ↓
BUILD / TEST / BROWSER VERIFY
  ↓
FRESH CRITIC
  ↓
BLIND COMPARISON
  ↓
WORK WINS + HARD GATES PASS?
  │                │
 no                yes
  │                ↓
FIX LARGEST GAP    RELEASE EVIDENCE
  │                ↓
  └──────────────> PRODUCTION VERIFY
                   ↓
                  END
```

---

# 50. Recommended Output Format

## Executive finding

One paragraph covering what the site is, whether the experience serves its job, and the most important problem.

## Site model

- archetype,
- audience,
- message,
- CTA,
- proof.

## ICM status

- Walk Test result,
- missing architecture if any.

## Hard blockers

Only true release blockers.

## Biggest experience gap

One item.

## Audit findings

Grouped by clarity, design, motion, interaction, mobile, accessibility, performance, and truth.

## Reference comparison

Named references and what principles matter.

## Bounded remediation plan

Ordered by impact.

## Proof plan

Tests, screenshots, viewports, runtime evidence.

## Rollback

Exact baseline.

---

# 51. Reference Research Notes

The following principles were reinforced by current public design references and skill research.

## Gauntlet Loop

A strong Gauntlet uses:

- a named, fetchable bar,
- a separate critic,
- direct or blind comparison,
- one largest gap,
- bounded repair,
- repeat until the work wins or further complexity would reduce quality.

Do not exit after an arbitrary number of rounds.

## Award-level web craft

High-level award work consistently values coherent art direction, meaningful motion, strong typography, responsive craft, technical excellence, memorable interaction, and functionality that remains usable.

## Webflow interaction guidance

Motion should be informative, guide attention, provide feedback, support story, remain snappy, and respect reduced-motion preferences.

Motion-heavy design is not automatically better design.

## High-end Webflow practice

Award-recognized Webflow work demonstrates that custom animation, GSAP, Rive, scroll storytelling, layered interaction, and immersive presentation can coexist with maintainable content systems.

The implementation tool is secondary to the quality of the decision.

---

# 52. Reference URLs

These are research references, not mandatory dependencies:

- Gauntlet Loop: https://github.com/robonuggets/gauntlet-loop
- Agents Assemble: https://github.com/bielesibub/agents-assemble
- Awwwards-style skill research: https://github.com/SandroHub013/awwwards-skill
- Webflow award-winning showcase: https://webflow.com/made-in-webflow/award%20winning
- Webflow Awards: https://webflow.com/blog/webflow-awards-2025
- Webflow motion + accessibility: https://webflow.com/blog/motion-and-accessibility
- Webflow interaction design: https://webflow.com/blog/how-to-design-interactions-effectively
- Webflow microinteractions: https://webflow.com/blog/microinteractions
- Lazarev.agency / Webflow case study: https://webflow.com/blog/lazarev-agency

---

# 53. Final System Instruction

When this skill is active:

> Do not decorate first.  
> Do not assume the site archetype.  
> Do not force the same interaction system onto every repo.  
> Do not confuse animation with craft.  
> Do not confuse code with proof.  
> Do not let a score hide a broken user journey.  
> Do not ship generic AI visual language.  
> Do not let the builder approve itself.  
> Do not copy award sites.  
> Use them as adversarial bars.  
>  
> First understand the job.  
> Then understand the architecture.  
> Then understand the user.  
> Then identify the governing idea.  
> Then remove what does not belong.  
> Then make the important interactions feel alive.  
> Then prove it on real devices and routes.  
> Then place it beside a real reference and let a fresh critic decide.  
>  
> If it loses, identify the single largest gap and repeat.  
> If it wins only by becoming more complicated, simplify it.  
> If the ICM Walk Test fails, do not fake certainty—enter investigation mode and report the missing architecture.  
>  
> The final standard is not “looks premium.”  
> The final standard is: **clear, specific, truthful, responsive, tactile, intentional, technically proven, and difficult to mistake for anyone else’s work.**
