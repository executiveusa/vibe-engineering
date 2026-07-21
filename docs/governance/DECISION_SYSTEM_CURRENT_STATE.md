# Decision System — Current State

**Captured:** 2026-07-21
**Captured by:** Antigravity / Vibe Engineering Governance Architect
**Purpose:** Map the existing governance layers, identify gaps, and establish
canonical locations before the constitutional upgrade is applied.

---

## Repository Under Review

`vibe-engineering-main` — the Vibe Engineering method, governance package,
reference implementation, templates, and educational materials.

---

## Existing Governance Layers

### Layer 1 — Root Policy
| File | Size | Role | Strength | Gap |
|---|---|---|---|---|
| `docs/STUDIO-SYSTEM-PROMPT.md` | 461 lines | Master operating doctrine for all agents | Comprehensive — covers flow, spec, council, judge, sovereignty | No consequence classification; no second-order thinking law; Future-State Test absent |

### Layer 2 — Agent Instructions
| File | Size | Role | Strength | Gap |
|---|---|---|---|---|
| `AGENTS.md` | 40 lines | Repository-local agent policy | Clean — required reading list, commands, prohibitions, sandcastle rule | References STUDIO-SYSTEM-PROMPT but adds no consequence analysis |
| `prompts/VIBE-ENGINEERING-AGENT-SYSTEM-PROMPT.md` | 337 lines | Full operating prompt for all project agents | Strong operating loop, council roles, judge schema, sovereignty gate | Council incomplete (missing Operator, Systems Steward, Commercial Steward); Judge schema lacks system-impact gate; no consequence level field in completion packet |

### Layer 3 — Governance Reference
| File | Size | Role | Strength | Gap |
|---|---|---|---|---|
| `docs/GOVERNANCE.md` | 55 lines | Authority model, council roles, release states | Clean authority separation | Council lists 6 roles but omits Operator, Systems Steward, Commercial Steward; no consequence classification section; Future-State Test absent |
| `docs/METHOD.md` | 50 lines | 8-stage method summary | Clear, well-structured | Specify stage has no consequence classification trigger; Judge stage has no system-impact gate |
| `docs/MANIFESTO.md` | 48 lines | Philosophy and foundational principles | Philosophically aligned — already captures ownership and freedom principles | Minor — could explicitly reference Consequence Doctrine once created |

### Layer 4 — Factory Agent Prompts
| File | Size | Role | Strength | Gap |
|---|---|---|---|---|
| `factory/builder-prompt.md` | 19 lines | Slice implementation rules for Builder agent | Solid — preserves arch, prohibits secrets/speculative features | No stop-condition when Builder discovers material arch decision not in approved spec |
| `factory/reviewer-judge-prompt.md` | 33 lines | Reviewer and Judge rules + JSON schema | Clear SHIP/HOLD threshold | Judge JSON schema missing `system_impact`, `second_order_risks`, `consequence_level` fields |
| `factory/audit-prompt.md` | 24 lines | Read-only audit agent | Good artifact list, evidence-backed findings | No consequence classification in audit scope |
| `factory/prd-builder-prompt.md` | 25 lines | PRD synthesis from audit | Well-structured slice + acceptance criteria | No consequence level required in slices |

### Layer 5 — CI Gates
| File | Size | Role | Strength | Gap |
|---|---|---|---|---|
| `.github/workflows/quality.yml` | 30 lines | Quality gate: install, test, build, audit | Clean, fast, minimal | No governance metadata validation; no consequence classification check |
| `.github/workflows/nightly-production-readiness.yml` | varies | Nightly production readiness | Automated PRD pipeline | No consequence-level hooks |

### Layer 6 — Templates
| File | Status | Gap |
|---|---|---|
| `.github/pull_request_template.md` | **DOES NOT EXIST** | Every PR lacks structured consequence classification, evidence checklist, system-impact statement |
| Ticket/issue template | **DOES NOT EXIST** | Issues lack consequence level field; no acceptance criteria template enforced |

### Layer 7 — Decision Records
| File | Status | Gap |
|---|---|---|
| `DECISIONS/` directory | **DOES NOT EXIST** (referenced in STUDIO-SYSTEM-PROMPT.md and agent prompt but absent) | No versioned architecture decision records; no consequence classification history |

### Layer 8 — Brand and Vision
| File | Size | Role | Strength |
|---|---|---|---|
| `docs/BRAND.md` | 1056 bytes | Brand identity and aesthetic principles | In scope for taste decisions only |
| `docs/VIBE-SCORE.md` | 1203 bytes | Vibe Score methodology | Scoring reference |
| `docs/STUDIO-ADOPTION-PLAN.md` | 8323 bytes | Studio rollout plan | Commercial and adoption roadmap |

---

## Canonical Locations After Upgrade

| Artifact type | Canonical location |
|---|---|
| Consequence doctrine (law) | `docs/governance/CONSEQUENCE_DOCTRINE.md` |
| Current-state governance map | `docs/governance/DECISION_SYSTEM_CURRENT_STATE.md` (this file) |
| Machine-readable decision schema | `docs/governance/DECISION_CONTRACT.yaml` |
| Architecture decision records | `DECISIONS/ADR-NNN-<slug>.md` |
| Root operating policy | `docs/STUDIO-SYSTEM-PROMPT.md` |
| Repository agent instructions | `AGENTS.md` |
| Full agent operating prompt | `prompts/VIBE-ENGINEERING-AGENT-SYSTEM-PROMPT.md` |
| Governance authority model | `docs/GOVERNANCE.md` |
| Factory role prompts | `factory/` |
| PR governance template | `.github/pull_request_template.md` |

---

## Duplication and Conflicts Identified

| Issue | Files | Resolution |
|---|---|---|
| Council roles listed in three places with slightly different names | `STUDIO-SYSTEM-PROMPT.md`, `GOVERNANCE.md`, `prompts/` | Normalize to consistent list; `GOVERNANCE.md` is canonical for names; others reference it |
| No single source for "what makes a decision HIGH-consequence" | Multiple implied in sovereignty gate, hard gates, human authority | New `CONSEQUENCE_DOCTRINE.md` becomes single source |
| `DECISIONS/` referenced but absent | `STUDIO-SYSTEM-PROMPT.md` L91, agent prompt L31 | Create directory + bootstrap ADR |
| Completion packet in two places (STUDIO-SYSTEM-PROMPT + agent prompt) | Both files | This is acceptable — they serve different audiences; no conflict |

---

## Pre-Upgrade Governance Health Score

| Dimension | Score | Notes |
|---|---|---|
| Prime directive clarity | 9/10 | Excellent — "Verify It Before Everything" is clear |
| Flow definition | 8/10 | 11-stage loop well-defined |
| Specification requirements | 9/10 | Comprehensive |
| Consequence awareness | 3/10 | Absent as an explicit doctrine |
| Decision records | 0/10 | Directory missing |
| PR governance | 0/10 | Template missing |
| Second-order thinking | 2/10 | Implicit in sovereignty gate only |
| Council completeness | 6/10 | Missing Operator, Systems Steward, Commercial Steward |
| Judge rigor | 7/10 | Good schema but no system-impact gate |
| Sovereignty | 9/10 | Strong — comprehensive gate |

**Overall pre-upgrade score: 5.3/10**
**Target post-upgrade score: 8.5/10**

---

## Post-Upgrade Success Criteria

- Consequence Law appears in root doctrine and agent operating loop
- Decision Classification (LOW/MEDIUM/HIGH) is defined in exactly one place
- All Council roles are consistent across all three governance files
- Judge schema includes `consequence_level` and `system_impact`
- `DECISIONS/` directory exists with bootstrap ADR
- PR template enforces consequence classification for MEDIUM/HIGH
- No competing definitions of any governance term across files
- `npm test` and `npm run build` still pass
