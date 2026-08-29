# Vibe Engineering v2 — Client Zero specification

Issue: #22
Baseline: `6bd796b812a5ff0ca2fb87d00013f33051d48a7c`
Mode: brownfield
Consequence: HIGH
Owner: The Pauli Effect

## Outcome

Use Vibe Engineering on Vibe Engineering itself. The public site must explain the idea to a modern 18–40 creator audience without flattening the deeper method. The repository must encode the same method as inspectable ICM contracts so any supported agent can follow it without a new orchestrator.

## Public promise

Vibe Engineering is a way of thinking before you build. AI is part of the process, but the larger skill is learning how to make better decisions.

V.I.B.E. means **Verify It Before Everything**.

The public story teaches, in plain language:

1. question the idea before following it;
2. understand how the pieces connect;
3. strip a problem down to what is true;
4. build one useful piece at a time;
5. prove the result before trusting the claim;
6. keep ownership of what is created.

The site must identify Vibe Engineering as **Built by The Pauli Effect · 2026** and **Part of the Pauli Suite**.

## Story experience

The homepage becomes a scroll-led story rather than a technical feature catalog. It may borrow the continuous-story discipline of `executiveusa/pauli-scroll-world`, but it must not import another rendering engine or require generated video for the first release.

Required experience:

- clear hero with V.I.B.E. meaning above the fold;
- scroll chapters that move from opportunity → judgment → systems thinking → first principles → discipline → proof → ownership;
- visual system map built with accessible HTML/SVG/CSS, not decorative card grids;
- reduced-motion support;
- keyboard-safe navigation;
- responsive mobile composition;
- an explicit music/sound control that starts silent.

### Soundtrack rights boundary

The user supplied a commercial instrumental as design reference. Do not commit or publicly deploy that file without a rights record authorizing redistribution/public performance. The production code must support a rights-cleared soundtrack through configuration without requiring a source change. When no licensed track is configured, the site must make no broken media request and may use a small original Web Audio pulse as a functional fallback.

## ICM method contract

Keep the existing Stage 00 + eight-stage ICM factory. Strengthen it instead of creating a parallel lifecycle.

The method must encode:

- **Intent → Standard → Evidence** for every material decision;
- Stage 00 reality/commercial gate, including Proven-Better-New thinking where market validation matters;
- controlled divergence using Verbalized Sampling only for open-ended alternatives;
- convergence before Build;
- anti-slop rules at idea, product, copy, UI, architecture, code, business, and production levels;
- named/fetchable/comparable reference bars for Gauntlet work;
- builder/critic/Judge separation;
- earned retention through measurable value, education, portability, and ownership;
- source/provenance records for external methods and licenses.

## Non-goals

- no new agent runtime;
- no replacement orchestrator;
- no rewrite of the Truth API;
- no new database;
- no autoplay with audible sound;
- no publication of unlicensed music;
- no generated 3D/video asset dependency for the first release;
- no weakening of existing release gates.

## Acceptance criteria

1. `npm run check` passes.
2. `npm audit --audit-level=high` passes.
3. Homepage copy is plain, culturally current, and avoids technical-first framing.
4. V.I.B.E. expands to Verify It Before Everything in the hero and method.
5. Footer/site identity says Built by The Pauli Effect · 2026 and Part of the Pauli Suite.
6. Sound is silent by default and requires a user action to become audible.
7. No network request is made for an absent soundtrack.
8. `prefers-reduced-motion` removes scroll animation dependence.
9. Existing Vibe Score behavior remains functional.
10. ICM root/context/stage contracts point to the new v2 doctrine and quality references without duplicating large payloads into routing files.
11. A source/provenance ledger records the method ingredients and their adoption status.
12. Independent CI/review evidence exists before merge.
13. Production is not claimed until the target Vercel deployment is fetched and verified.

## Rollback

Revert the Client Zero merge commit and redeploy the prior `main` release. The baseline SHA above is the known pre-change source point.