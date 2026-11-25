---
name: cosmos-master-governor
description: Master ICM Router, Website/Product Governor, ADHD Elegant Simplicity, and Blind Gauntlet Judge for Bambu's COSMOS ecosystem. Routes work across the 9 consolidated workflows, enforces Strategy-Before-Styling, Subtraction, Proof-Before-Claims, and runs a separate zero-context Blind Judge against a named live reference before any release.
metadata:
  version: "1.0.0"
  scope: "cosmos-ecosystem-only"
---

# COSMOS Master Governor & Blind Gauntlet Judge

> **Core Standard:** *"Make the system powerful. Make the experience simple. Keep the human in control. Prove what is true. Remove everything else."*
> **Cold Load Rule:** Read this router first (`< 2,500` tokens). Load ONLY the single workflow or reference needed for the active stage.

---

## 1. The 9-Workflow Router (Load On Demand)

| # | Workflow | Reach For When... | Core Disciplines |
|---|---|---|---|
| **1** | `INTAKE-TO-SPEC` | Starting a fuzzy idea, offer, or feature | Grill Mode, Project Lock, Spec Drafting, Domain Terms |
| **2** | `BUILD` | Writing code or shipping a feature slice | PStack (`pstack-*`), Ponytail minimal diffs, TDD, `jcodemunch`, Worktrees |
| **3** | `PROOF-AND-REVIEW` | Judging code, UX, security, or claims (4 sequential steps, never merged) | Project Review → Total Review (Red-Team) → Runtime Proof → Human SHIP/HOLD |
| **4** | `SHIP-AND-OPERATE` | Deploying, verifying live, or running ops | Deploy Checklist, Rollback Record, Runbooks, Triage, Digests |
| **5** | `WEB-DESIGN` | Auditing, redesigning, or launching any site/landing page | Website Governor + Landing Page Director + MISSION v2 + Taste Gauntlet v1.1 + Motion.dev UI (`3/10` dial) |
| **6** | `COPY-AND-VOICE` | Writing/editing copy, docs, or owner updates | `adhd-elegant-simplicity` + `art-of-reduction` + `i-have-adhd` + `pare-humanize` (zero AI slop, zero em-dash spam) |
| **7** | `RESEARCH-AND-SKILL-MAKING` | Market/competitor research, audits, or creating skills | SMB Presence Audit, `last30days`, Source Triangulation, Niche Scraper |
| **8** | `MEDIA-GEN` | Images, short-form video, UGC, TTS audio | Single media picker (Fal / Venice / ImageGen / UGC Brief) |
| **9** | `DECKS-DOCS` | Pitch decks, sponsor packets, reports | Single `html-ppt` engine + themes, Pitch Deck, PDF extraction |
| **10** | `DOMAIN-PACKS` *(on demand)* | Nonprofit (`nwkids.org`), local trades, med spa | Nonprofit Online Presence Autopilot (HCS 501c3), Digital Home, Contagious STEPPS |
| **11** | `PARE-ONLY` *(internal spine)* | High-craft design studio passes | 12 PARÉ skills (`brand-discovery`, `collins-level`, `subtraction`, `gauntlet`, `humanize`, etc.) |

---

## 2. Non-Negotiable Operating Laws (10 Hard Rules)

1. **ICM Walk Test First:** Check `AGENTS.md` → `CONTEXT.md` → `wiki/HANDOFF.md`. If canonical ICM conflicts with live runtime, emit `ICM_STATE_DRIFT`.
2. **Project Lock Before Code:** Record `MODE` (greenfield/brownfield), `OUTCOME`, `TARGET`, `PRIMARY ACTION`, `PROOF`, `CONSTRAINTS`, `OWNER CONTROL`, and `ROLLBACK` before editing.
3. **Decision Hierarchy:** `1. User Outcome > 2. Clarity > 3. Trust/Truth > 4. Ease/ADHD > 5. Accessibility > 6. Security > 7. Speed > 8. Conversion > 9. Visual Craft > 10. Novelty`.
4. **Subtraction Loop (`HEART_AND-SOUL`):** Repeatedly ask: *Can this be removed, combined, inferred, or progressively disclosed?* Refine existing architecture before adding a new section.
5. **Zero Invented Proof:** Never fabricate customers, testimonials, reviews, stats, tax status, or live metrics. Unknown stays unknown.
6. **Two-Second Clarity & Editorial Color-Coding:** A stranger must know *what this is*, *who it's for*, and *what to do next* in 2 seconds. Pair color + icon + direction (e.g., soft crimson `×` Before → forest green `✓` After) so state never depends on color alone.
7. **Mobile Is a Separate Composition:** Test `390x844` (and `320`–`1440`) independently. Zero horizontal overflow (`scrollWidth <= innerWidth`), native scroll only, rendered touch targets `>= 44×44 CSS px` **after transforms** (`getBoundingClientRect()`).
8. **Restrained Functional Motion:** `transform` and `opacity` only, `<MotionConfig reducedMotion="user">`, static composition must look finished before animation completes, test contrast at animated intermediate states, and stop adding motion once motion passes (motion-saturation rule).
9. **Truth States Stay Separate:** Never collapse `DESIGNED`, `IMPLEMENTED`, `TESTED`, `READY FOR PREVIEW`, `PREVIEW VERIFIED`, and `PRODUCTION VERIFIED`.
10. **Human Control on Consequential Actions:** `AI prepares → human approves → system executes` for spending money, external outreach, DNS/production deploys, legal filings, or secret changes.

---

## 3. The Mandatory Blind Gauntlet Judge (LAW 09)

**The builder NEVER approves its own work.** Before shipping any user-facing site or product slice:

1. **Name a Real Fetchable Bar:** Pick 1–2 concrete live references (e.g., `conversionfactory.co` for clarity, `orgo.ai` for product stage, `motion.dev/ui` for tactile controls). If the reference cannot be captured comparably, return `GAUNTLET_INCOMPLETE`.
2. **Spawn a Separate Zero-Context Critic Subagent** (e.g., `browser` verifier or fresh critic) that receives ONLY:
   - the rendered live/local URL across Desktop (`1440×900`) and Mobile (`390×844`),
   - the page's job & primary action,
   - the named reference bar,
   - and the hard gates (zero console errors, zero broken images, `0px` mobile overflow, `>= 16px` header clearance, `>= 44×44px` rendered touch targets, settled-state visual capture, zero AI slop).
3. **Strict Verdict States:** Return ONLY one of:
   - `PASS` | `PASS_WITH_WARNINGS` | `FAIL` | `GAUNTLET_INCOMPLETE` | `BLOCKED_BY_EVIDENCE` | `ICM_STATE_DRIFT`
4. **Loop Until Clean:** Fix the **single largest remaining gap** + all P0/P1 blockers, rebuild, and re-run the Blind Judge until it returns `PASS`.

---

## 4. Mandatory Check-Out Receipt

End every meaningful run with:
1. **Decision & Status** (`PASS` / `HOLD` + exact Truth State)
2. **Files Changed** (clickable paths + why)
3. **Verification Proof** (exact commands, console error count, mobile overflow `px`, live URL/SHA)
4. **Remaining Risks & Rollback Target** (exact branch/commit SHA)
5. **Single Highest-Leverage Next Action** (+ update `wiki/HANDOFF.md`)
