# ASC-BOOTSTRAP-001 — Read-Only System Audit

## Audit state

- Client: Asc3nd Collective
- Mode: **READ ONLY**
- Product-code changes: **NONE**
- Public-facing release state: **HOLD**
- Audit purpose: establish factual system boundaries, deployment state, data risks, and the shortest safe path to one measurable acquisition-to-engagement loop.

## Executive assessment

Asc3nd is not one website. It is a three-repository client system with five Vercel project records, a public frontend, an interactive strategy workbook, a reusable agentic operating-system/backend, Supabase-backed workbook persistence through `api.thepaulieffect.com`, and several duplicated deployment identities.

The system has substantial working assets, but it is not ready for unrestricted public-facing release or autonomous production operation.

The highest-value path is **not** to finish the entire Social Purpose OS. The immediate goal is to make one safe, measurable public engagement loop work end to end, while preserving reusable architecture for later expansion.

## System boundary

### Canonical GitHub repositories

1. `executiveusa/asc3nd-frontend-website-`
   - Role: public-facing site and acquisition layer.
   - Also contains substantial Social Purpose OS/backend scaffolding, creating overlap with the dedicated agentic-system repo.

2. `executiveusa/asce3nd-interactive-document`
   - Role: bilingual strategy workbook used in client delivery.
   - Current implementation uses local storage plus Supabase RPC persistence and a mailer webhook.

3. `executiveusa/ascend-social-purpose-agentic-systems-`
   - Role: reusable operations console, CRM/workflows, approvals, agent/integration architecture, and future production backend.

### Vercel deployment records

Five relevant Vercel projects were verified:

- `asc3nd-frontend-website`
- `asce3nd-interactive-document`
- `asc3nd-interactive-document`
- `ascend-social-purpose-agentic-systems-`
- `ascend-social-purpose-agentic-systems-site`

The two interactive-document projects point to the same repository and same current commit and are duplicate-deployment candidates.

The two agentic-system Vercel projects also point to the same repository/current preview commit and are duplicate-deployment candidates.

## Findings

### P0 / verify before further public expansion

#### 1. Workbook cloud-load privacy and tenant-scoping must be proven safe

Current browser code embeds a Supabase anonymous key and calls:

- `save_submission`
- `load_latest_submission`

through `https://api.thepaulieffect.com/supabase/rest/v1/rpc/`.

The current `load_latest_submission` call sends no explicit project, tenant, workbook, device, or user scope in the request body. The code then merges the returned workbook into local state when it contains more filled fields.

This is **not proof of a data leak**, but it is a release blocker until the RPC implementation, Row Level Security, proxy behavior, and tenant/project scoping are inspected and tested.

Risk is elevated because the workbook contains fields about:

- minors;
- vulnerable people;
- consent requirements;
- sensitive topics;
- images that must not be posted;
- donation claims and approval requirements.

Required proof before SHIP:

- identify the exact production Supabase project/database behind the proxy;
- inspect `save_submission` and `load_latest_submission` definitions;
- verify RLS/permissions and anonymous-call behavior;
- verify Asc3nd data cannot return another client's workbook;
- verify webhook notification does not disclose sensitive workbook content to unintended recipients;
- define retention/consent handling for workbook data.

#### 2. Public site is serving an older production state while newer preview work cannot deploy

The production alias `https://asc3nd-frontend-website.vercel.app` currently returns HTTP 200.

However, the latest Vercel deployment for the project is ERROR with:

`NOW_SANDBOX_WORKER_ROOTDIR_NOT_EXIST`

The configured Root Directory is `apps/site`, but the newer `preview/static-client-preview` branch does not contain that path.

Implication:

- public production is still available;
- newer public-facing work exists on a branch that does not match current Vercel project assumptions;
- "latest code" and "current production" are not the same thing;
- design approval must happen against a known canonical preview, not whichever branch happened to deploy.

### P1 / blocks the first measurable engagement loop

#### 3. English and Spanish public experiences are not equivalent

Live inspection found inconsistent EN/ES functionality and localization.

Examples:

- English production markup does not expose the same public form section visible on `/es`.
- `/es` renders with `<html lang="en">`.
- Spanish navigation remains partly/all English in the rendered nav.
- Some Spanish form UI/explanatory copy remains English.
- Spanish CTA icons render duplicated glyphs in some buttons.
- A visible Spanish typo exists: `Fortalecendo`.

Result: bilingual parity does not currently pass the public-facing quality gate.

#### 4. Several public links are placeholders or generic destinations

Observed live public markup includes generic/non-client-specific destinations:

- donation buttons point to generic `https://www.givelively.org/`;
- social icons point to signup/account creation pages rather than Asc3nd profiles;
- some anchors such as English `#volunteer` do not clearly resolve to a corresponding rendered section;
- `Stories` points to an anchor attached to footer/social content rather than a real stories experience.

These create trust and conversion failures even though the page technically returns 200.

#### 5. Production metadata still contains localhost URLs

Live EN and ES markup contain Open Graph/Twitter image URLs and JSON-LD URLs referencing `http://localhost:3000`.

This breaks production metadata correctness and social/share integrity.

#### 6. One complete acquisition-to-engagement loop is not yet proven

The public site contains discovery and CTA surfaces, and the architecture contains a public bridge, but there is not yet verified production evidence for the entire chain:

`public source → meaningful CTA → safe persistence → staff-visible record → follow-up → attributable measurable result`

This is the primary commercial gap.

### P1 / backend readiness constraints

#### 7. The reusable agentic backend is still partly scaffold/dry-run

Repository production-gap documentation states that:

- Postgres is intended but not proven as the live default production store;
- some storage paths still use JSON/filesystem mode;
- integration adapters remain stubs or credential-gated;
- real Pi/Absurd/Sandcastle execution is deferred/unproven;
- Postiz scheduler is not fully implemented;
- voice workflows are not live;
- multi-tenant operator auth is deferred;
- Rust services are not fully wired into the production runtime.

Recommendation: do **not** attempt to close every backend gap before proving the first engagement loop. Only promote the minimum production-safe backend slice required for that loop.

### P2 / architecture and governance cleanup

#### 8. Frontend/backend repository boundaries overlap

`asc3nd-frontend-website-` contains a large Social Purpose OS architecture similar to the dedicated `ascend-social-purpose-agentic-systems-` repository.

Do not consolidate yet.

First classify which repository is authoritative for:

- public frontend;
- shared ops console;
- backend services;
- tenant kit/SDK;
- deployment/runtime.

Only then decide whether duplicated code should be removed, synchronized, or intentionally preserved.

#### 9. Interactive-workbook documentation is stale and contradictory

Current README and `sql/schema.sql` still describe a zero-database / URL-hash architecture, while current `index.html` uses Supabase RPC persistence and webhook notification.

This is operationally dangerous because future agents may follow documentation that no longer matches runtime behavior.

Documentation should be corrected only after the actual persistence/security model is verified.

#### 10. Duplicate Vercel projects need canonical ownership decisions

Duplicate deployment identities increase confusion and make it harder to know which preview/production is authoritative.

No deletion is recommended during audit.

Classify first, then archive/remove duplicates only when canonical project ownership is proven.

## Working / broken / incomplete / unclear classification

### WORKING

- Production frontend alias returns HTTP 200.
- English and Spanish routes render.
- Interactive workbook has current READY production deployments.
- Workbook local persistence exists.
- Workbook Supabase save/load code exists.
- Workbook save webhook exists.
- Agentic OS preview builds can reach READY state.
- Public-site repo has prior local test/build/doctor evidence.

### BROKEN

- Latest frontend preview deployment cannot initialize because Vercel Root Directory expects `apps/site`.
- Production metadata contains localhost URLs.
- Several public external links are generic/placeholder destinations.
- Spanish localization/parity contains clear defects.

### INCOMPLETE

- Verified staff follow-up loop.
- Acquisition attribution and measurable engagement outcome.
- Production-safe backend data path.
- Full agent/integration runtime.
- Multi-tenant auth.
- Canonical deployment cleanup.
- Joint public-facing design/content approval.

### UNCLEAR / MUST VERIFY

- Exact production Supabase project behind `api.thepaulieffect.com`.
- `save_submission` / `load_latest_submission` RPC authorization and scoping.
- Mailer webhook authentication, recipients, consent, and sensitive-data handling.
- Canonical `asc3nd.org` DNS/deployment relationship versus Vercel aliases.
- Which Vercel project in each duplicate pair should be canonical.
- Which repo is authoritative for shared Social Purpose OS backend code.

## Recommended bounded ticket order

### ASC-001 — Verify and secure workbook persistence boundary

Objective:
Prove that workbook cloud save/load and email notification cannot expose or misroute Asc3nd/client data.

No redesign work should precede this verification if the workbook remains part of active delivery.

### ASC-002 — Resolve canonical deployment map and frontend preview drift

Objective:
Identify one canonical project/domain per component and restore a reliable preview path for current frontend work without changing public production.

### ASC-003 — Build one production-safe engagement journey

Objective:
Choose the shortest safe action path and prove:

`CTA → persistence → staff visibility → follow-up → attribution`

Candidate first loop: **volunteer interest**, because the existing public architecture already contains a volunteer path. Final selection depends on ASC-001/ASC-002 evidence.

### ASC-004 — Public-facing parity and trust corrections

Objective:
Bring EN/ES, metadata, links, forms, navigation, and trust surfaces to a consistent preview-ready state.

### ASC-005 — Founder/cofounder design + content review

Objective:
Review the actual preview together for design, copy, mission accuracy, imagery, Spanish, mobile, CTA hierarchy, trust, and overall public readiness.

Only after this review can `PUBLIC_APPROVED` be emitted.

## Recommendation

**HOLD public-facing release expansion. Do not rebuild Asc3nd.**

Preserve the working production alias while first proving the data boundary and canonical deployment path. Then build exactly one acquisition-to-engagement loop and review the resulting public experience together.

This sequence creates the fastest credible path from a paid-client project to verified business/mission value without attempting to finish every agentic-system capability at once.
