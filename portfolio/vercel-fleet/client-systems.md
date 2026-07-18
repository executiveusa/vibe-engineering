# PAULI STUDIO — Initial Client Delivery Systems

This file maps business/client systems to their canonical repositories and deployment aliases. The unit of work is the client delivery system, not an individual repository or Vercel project.

## Lane 1 — MACS / MAXX

**Owner/operator:** Stacy / MACS Digital Media
**Strategic role:** Highest-leverage proof that a non-technical owner can operate an AI-enabled business system and use it across an existing client network.
**Commercial outcome:** Make Stacy visibly successful with a working, understandable system that can onboard clients, deliver services, and generate measurable revenue without requiring him to become technical.

### Canonical repositories

- `executiveusa/macsdigitalmedia` — public marketing/application surface and synthetic MAXX demonstration.
- `executiveusa/macs-agent-portal` — Agent MAXX front page, Stacy operator dashboard, mission/agent execution surface.
- `executiveusa/maxx-migrations-agentic-systems` — migration/ERP/backend capability; requires intake clarification because the root README currently presents upstream ERPNext rather than the MAXX business boundary.
- `executiveusa/maxx-clipz` — Stacy's content/video SaaS capability, including auth, billing, clip generation, and production setup.

### Deployment aliases to collapse

- `macsdigitalmedia` → `macsdigitalmedia`
- `macs-agent-portal` and `macs-agent-portal-main` → `macs-agent-portal`
- `maxx-migrations-agentic-systems` and `maxx-migrations-agentic-systems-1ybt` → `maxx-migrations-agentic-systems`
- `maxx-clipz` → `maxx-clipz`
- `client-preview` → CLI deployment; classify during intake before attaching to this lane.

### Factory treatment

One client delivery system with multiple repositories. Audit all repos independently, then produce one client-level dependency map, one commercial outcome, and coordinated bounded tickets. Do not send duplicate Vercel aliases as separate Sandcastle jobs.

---

## Lane 2 — Asc3nd

**Client status:** First confirmed paying client.
**Strategic role:** First external proof that the Vibe Engineering process improves a real paid client system rather than only PAULI STUDIO-owned assets.
**Commercial outcome:** A production-ready, measurable digital operating system that supports awareness, participation, lead capture, content operations, and future managed services.

### Canonical repositories confirmed

- `executiveusa/asce3nd-interactive-document` — interactive client/workbook/document system.
- `executiveusa/ascend-social-purpose-agentic-systems-` — agentic/backend system and related site deployment.

### Likely related repository to verify during intake

- `executiveusa/asc3nd-frontend-website-` — previously identified as the public frontend; include unless current repo evidence shows it has been superseded.

### Deployment aliases to collapse

- `asce3nd-interactive-document` and `asc3nd-interactive-document` → `asce3nd-interactive-document`
- `ascend-social-purpose-agentic-systems-` and `ascend-social-purpose-agentic-systems-site` → `ascend-social-purpose-agentic-systems-`

---

## Lane 3 — Kupuri / Synthia

**Owner/operator:** Veronika / Kupuri Media
**Strategic role:** Turn an existing collection of site, operating-system, agent, onboarding, and client-delivery assets into a coherent Spanish-first business system without rebuilding what already works.
**Positioning direction:** AI-enabled project management, brand operations, digital systems coordination, creative production, and social-purpose implementation for companies and organizations operating in Mexico and Spanish-speaking markets.
**Commercial outcome:** A working bilingual client-acquisition and delivery system that proves Kupuri can manage higher-value brand, digital, AI, and purpose-driven projects rather than being positioned as a commodity social-media/design provider.

### Canonical repositories confirmed

- `executiveusa/kupuri-media-main-site` — main public site.
- `executiveusa/AKASHPORTFOLIO` — Kupuri operating system, called **Synthia**.
- `executiveusa/Synthia-avatar` — Ivette agent/avatar/gateway capability associated with the operating system; verify exact operator and gateway boundaries during intake.

### Related deployment without confirmed GitHub source

- `kupuri-onboarding-flipbook` — CLI deployment; source repository must be resolved before Sandcastle dispatch.

### Important operating rule

Reuse and repair existing assets. Do not rebuild the Kupuri system from scratch. Intake must first identify what is canonical, what is already functional, what is duplicated, and what requires only integration or repositioning.

### Market direction to validate later

Primary: Mexico.
Expansion candidates: Spain and Puerto Rico for currency/market advantages; Guam as a later focused experiment rather than an assumed primary market.

---

## Lane 4 — Verified Vallarta / Vallarta Voyage Explorer

**Canonical repository:** `executiveusa/vallarta-voyage-explorer`
**Production:** `https://vallarta-voyage-explorer.vercel.app/`
**Strategic role:** Trust and lead-generation network built around verified local businesses and people, with monorepo/microsite capability for client acquisition and service delivery.
**Commercial outcome:** Turn verified local relationships and business data into measurable leads, paid microsites/services, directory visibility, and a reusable local-business acquisition channel.

### Factory treatment

Treat the directory as a platform/client-acquisition system, not merely a tourism website. Audit data ownership, business verification workflow, microsite generation, lead capture, CRM/data flow, and monetization separately from visual polish.

---

## Lane 5 — Open revenue lane

Reserved until portfolio evidence identifies the strongest existing asset capable of producing a paying customer, booking, sale, or recurring contract in 30–60 days without inventing a new business model.

## Cross-lane rules

1. Client delivery systems are the portfolio unit; repositories are components.
2. Duplicate deployments never consume independent factory slots.
3. Shared infrastructure must be declared explicitly instead of copied into each client system.
4. Each lane receives one client-level commercial outcome and one dependency map.
5. Each repository receives its own Vibe Project Contract and read-only audit before implementation.
6. Sandcastle executes bounded tickets in isolated workspaces with common observability events.
7. Founder-facing control center will aggregate all lane telemetry after the five-lane pilot defines the real event schema.
