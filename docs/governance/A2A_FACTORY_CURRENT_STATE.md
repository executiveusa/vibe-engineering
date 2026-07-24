# A2A AUTONOMOUS SOFTWARE FACTORY — CURRENT STATE AUDIT

**Date:** 2026-07-23  
**Status:** AUDITED — Pre-installation Baseline

---

## 1. Existing System Components

| Component | Status | Path | Purpose / Notes |
|---|---|---|---|
| **Root Governance** | Installed | `docs/GOVERNANCE.md` & `docs/STUDIO-SYSTEM-PROMPT.md` | Contains 9 Council roles, Consequence Law, and release floor logic |
| **Consequence Doctrine** | Installed | `docs/governance/CONSEQUENCE_DOCTRINE.md` | Canonical decision law (LOW/MEDIUM/HIGH) |
| **Decision Contract** | Installed | `docs/governance/DECISION_CONTRACT.yaml` | YAML schema for consequence-aware decision records |
| **Decision ADRs** | Active | `DECISIONS/ADR-001-constitutional-consequence-upgrade.md` | Repository ADR tracking |
| **Factory Prompts** | Legacy/Partial | `factory/` (`builder-prompt.md`, `reviewer-judge-prompt.md`, `prd-builder-prompt.md`, `audit-prompt.md`) | Prompts for individual roles, uncoordinated as an autonomous package |
| **Workflow Package** | Missing | `workflows/a2a-software-factory/` | Target location for the complete executable workflow package |

---

## 2. Reuse & Integration Plan

- **Reuse `docs/governance/CONSEQUENCE_DOCTRINE.md`**: Do not create a duplicate decision doctrine; link to it directly from `DECISION_CONTRACT.md` inside the workflow package.
- **Reuse `docs/governance/DECISION_CONTRACT.yaml`**: Ensure workflow schemas reference or extend this schema.
- **Promote `factory/` prompts**: Formalize Architect, Builder, and Judge contracts inside `workflows/a2a-software-factory/roles/` with deterministic phase directive/receipt loops.
- **New Package Root**: Mount at `workflows/a2a-software-factory/`.

---

## 3. Planned Package Structure

```text
workflows/a2a-software-factory/
├── README.md
├── WORKFLOW.md
├── roles/
│   ├── ARCHITECT.md
│   ├── BUILDER.md
│   └── JUDGE.md
├── contracts/
│   ├── PHASE_CONTRACT.md
│   ├── DECISION_CONTRACT.md
│   ├── A2A_MESSAGE_PROTOCOL.md
│   ├── MERGE_RELEASE_POLICY.md
│   ├── RETRY_RECOVERY_POLICY.md
│   └── SYSTEM_IMPACT_REVIEW.md
├── harness/
│   └── HARNESS.md
├── schemas/
│   ├── project-blueprint.schema.yaml
│   ├── phase-directive.schema.yaml
│   ├── phase-receipt.schema.yaml
│   ├── judge-finding.schema.yaml
│   ├── judge-verdict.schema.yaml
│   ├── decision.schema.yaml
│   └── hard-blocker.schema.yaml
├── templates/
│   ├── project-blueprint.md
│   ├── phase-directive.md
│   ├── phase-receipt.md
│   ├── judge-report.md
│   ├── decision-record.md
│   ├── rollback-receipt.md
│   └── hard-blocker.md
└── examples/
    ├── small-repair.md
    └── long-running-multi-repo-project.md
```
