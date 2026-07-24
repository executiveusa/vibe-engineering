# PAULI STUDIO — A2A AUTONOMOUS SOFTWARE FACTORY WORKFLOW PACKAGE

**Location:** `workflows/a2a-software-factory/`  
**Status:** CANONICAL WORKFLOW PACKAGE  
**Version:** 1.0.0  

---

## Overview

This directory contains the canonical implementation of the **A2A Autonomous Software Factory Workflow Package** for Vibe Engineering.

It defines an autonomous, long-running execution model driven by three primary agent roles:

1. **Architect** (`roles/ARCHITECT.md`): System-level authority. Decides what should exist, maps interconnections, and governs phase progression.
2. **Builder** (`roles/BUILDER.md`): Execution & repair authority. Implements approved phases, maintains verification harness, and repairs PR/CI issues.
3. **Judge** (`roles/JUDGE.md`): Independent proof authority. Validates spec compliance, system impact, security, and quality before merge.

---

## Directory Structure

- `WORKFLOW.md` — Core state machine, operating laws, and workflow modes.
- `roles/` — Role specifications for Architect, Builder, and Judge.
- `contracts/` — Operating policies (Phase contract, Decision contract, A2A messaging, Merge/Release policy, Retry/Recovery policy, System Impact Review).
- `harness/` — Mechanical verification harness rules.
- `schemas/` — Machine-readable YAML schemas for phase directives, receipts, judge verdicts, decisions, and hard blockers.
- `templates/` — Markdown templates for human and agent interaction.
- `examples/` — Execution examples (small repair vs. long-running multi-repo project).

---

## Governance Precedence

1. Repository constitution / Emerald Tablets
2. Vibe Engineering root governance (`docs/GOVERNANCE.md`, `docs/STUDIO-SYSTEM-PROMPT.md`)
3. Consequence Law (`docs/governance/CONSEQUENCE_DOCTRINE.md`)
4. Accepted OpenSpec
5. Recorded Architectural Decision Records (`DECISIONS/`)
6. Beads dependency graph
7. Approved project blueprint
8. Approved phase contract (`contracts/PHASE_CONTRACT.md`)
9. A2A workflow rules (`WORKFLOW.md`)
10. Local agent preferences
