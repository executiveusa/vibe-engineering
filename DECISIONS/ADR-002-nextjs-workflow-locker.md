# ADR-002 — Next.js Workflow Locker and Teaching Platform

**Status:** PROPOSED  
**Date:** 2026-07-31  
**Consequence level:** HIGH  
**Human approval required:** Yes

## Context

The repository currently contains a strong Vite/React public site, deterministic score engine, governance documents, and an A2A software-factory workflow package. The public product does not yet expose those processes as a browsable workflow locker, a youth-oriented software curriculum, or an editorial system.

The owner requested this target stack:

- Next.js App Router + React 19
- Tailwind CSS with custom fluid typography
- `@studio-freight/lenis`
- `framer-motion`
- Aceternity-style primitives implemented as owned local components
- Supabase RPC through a server-only `/api/rsvp` route
- Barlow and Barlow Condensed through `next/font/google`

## Decision

Migrate the public application incrementally to Next.js App Router while preserving the current Vite site as the rollback baseline until parity, CI, preview, accessibility, and visual gates pass.

The product architecture will contain four bounded layers:

1. **Public manifesto and commercial site** — explains Vibe Engineering and its offers.
2. **Workflow Locker** — renders portable ICM workflow packages from folders and manifests.
3. **Learning Lab** — teaches young people and nontechnical creators software basics, AI first principles, verification, and anti-slop habits.
4. **Editorial system** — begins repository-local and human-approved; Payload CMS remains a later isolated option rather than an immediate dependency.

## Workflow package contract

Each workflow package must remain portable and agent-neutral:

```text
workflows/<workflow-id>/
├── README.md
├── workflow.yaml
├── 01-intake.md
├── 02-context.md
├── 03-plan.md
├── 04-build.md
├── 05-verify.md
├── 06-review.md
├── 07-release.md
├── 08-retro.md
├── templates/
├── schemas/
└── examples/
```

Required manifest fields:

- id
- title
- promise
- audience
- trigger
- mode
- consequence level
- inputs
- stages
- outputs
- proof
- rollback
- human approvals
- commercial value
- version

## Design direction

Premium editorial-industrial rather than generic SaaS:

- Barlow Condensed for large display typography;
- Barlow for body copy;
- fluid type and spacing using `clamp()`;
- restrained motion with clear reduced-motion fallbacks;
- strong black/ivory foundation with one controlled electric accent;
- cinematic transitions used only to explain hierarchy and state;
- local, owned interaction primitives rather than a copied component library aesthetic;
- no excessive glass cards, gradient text, floating blobs, or decorative motion without purpose.

## Content direction

The blog must teach through concrete outcomes:

- software as inputs, rules, state, outputs, and proof;
- how prompts differ from specifications;
- how to inspect before changing;
- why builders cannot approve themselves;
- how tests expose false confidence;
- how to preserve ownership of code, data, domains, and credentials;
- how children can use AI without outsourcing judgment;
- how to recognize and repair AI slop;
- how to turn a real community problem into one verifiable software slice.

## Supabase boundary

No existing Supabase project is approved for this application. The only connected project observed during inspection is named `botanic-creations`; it must not be reused implicitly.

When the owner approves a project, `/api/rsvp` will:

- validate request input;
- call the `create_rsvp` RPC server-side;
- use server-only environment variables;
- apply rate limiting and origin checks;
- return minimal safe error messages;
- log no secrets or sensitive request content.

## Consequences

### Positive

- First-class routing, metadata, server handlers, and content rendering.
- Workflow files remain model- and framework-neutral.
- Stronger SEO and educational publishing foundation.
- Clear path to commercial workflow products and MAXX operations.

### Negative

- Framework migration creates temporary duplicate implementations.
- Package and lockfile changes require CI proof.
- Premium motion can damage performance and accessibility if not governed.
- CMS installation now would expand scope and should remain a separate phase.

## Rollback

- Keep baseline commit `2af209b2a132a4a7e925f94fe272673ea9461a74` deployable.
- Do not delete Vite source before approved preview parity.
- Keep migration isolated to this feature branch and draft PR.
- Revert the migration PR or promote the last known-good Vercel deployment if checks fail.

## Approval gate

The owner must approve:

1. the Next.js migration;
2. the final visual direction;
3. the dedicated Supabase project;
4. any CMS installation;
5. production deployment.
