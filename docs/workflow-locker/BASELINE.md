# Workflow Locker Brownfield Baseline

**Date:** 2026-07-31  
**Mode:** BROWNFIELD  
**Branch:** `feature/icm-workflow-locker-nextjs`  
**Baseline commit:** `2af209b2a132a4a7e925f94fe272673ea9461a74`

## Outcome

Convert the existing Vibe Engineering repository into a premium public teaching site and a portable workflow locker based on Interpretable Context Methodology: explicit folders, Markdown contracts, machine-readable schemas, independent review, and deterministic evidence gates.

## Current application

- Framework: Vite 8 + React 19
- Motion: GSAP + ScrollTrigger
- Styling: custom CSS
- Build: `vite build`
- Tests: Node test runner for the deterministic Vibe Score engine
- Deployment target documented in README: Vercel or another static host
- Canonical workflow package already present: `workflows/a2a-software-factory/`
- Governance already present: Council, Judge, Vibe Score, Consequence Doctrine, ADRs, rollback and release policy

## Verified strengths

1. Clear sovereign product promise.
2. Eight-stage method is already coherent and teachable.
3. Deterministic release scoring exists.
4. A2A Architect/Builder/Judge contracts and schemas already exist.
5. Merge and public release are treated as separate gates.
6. The repository already prefers reusable, inspectable files over hidden orchestration.

## Gaps

1. Workflow packages are not surfaced as a searchable public locker.
2. No canonical workflow manifest connects audience, trigger, inputs, steps, proof, rollback, and outputs.
3. No Next.js App Router architecture.
4. No blog or curriculum content model.
5. No structured path for children and nontechnical learners.
6. No content approval workflow or content truth ledger.
7. No verified Supabase project dedicated to this application.
8. No confirmed Vercel project linked specifically to this repository.
9. Current build could not be executed in the inspection runtime; migration work must remain preview-only until CI proves it.

## Constraints

- Preserve the existing Vibe Engineering language and governance.
- Reuse the A2A package; do not create a second factory doctrine.
- Do not connect the existing `botanic-creations` Supabase project without explicit owner approval.
- Do not publish generated articles automatically.
- Do not deploy directly to production.
- Do not delete the current Vite implementation until the Next.js replacement passes parity review.

## Required proof for migration

- Existing content parity or approved changes.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass in CI.
- Workflow locker routes render on mobile and desktop.
- Blog index and article routes render with correct metadata.
- Reduced-motion behavior works.
- Supabase RPC is authenticated, rate-limited, and tested if RSVP remains in scope.
- Preview deployment returns HTTP 200 and passes visual review.
- Rollback to baseline commit and deployment is documented.
