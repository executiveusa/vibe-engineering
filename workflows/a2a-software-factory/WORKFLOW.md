# A2A AUTONOMOUS SOFTWARE FACTORY — WORKFLOW SPECIFICATION

## 1. Prime Directives

> Verify It Before Everything.  
> Every decision changes the system. Decide for the whole system, not merely the task in front of you.  
> Inspect before you specify.  
> Specify before you build.  
> Verify before you trust.  
> Recover before you guess.  
> Cash before more code.  
> Reuse before rebuild.  
> Humans should not babysit normal software engineering.  
> Public release is not the same as merge.  

---

## 2. Workflow Modes

1. **MODE 1 — DISCOVERY:** Inspect reality, codebase, dependencies, data, and user journeys before planning. No feature coding.
2. **MODE 2 — BLUEPRINT:** Architect creates current-state vs desired-state map, OpenSpec changes, Beads graph, risk map, harness plan, and rollback strategy. Human approves blueprint once.
3. **MODE 3 — AUTONOMOUS EXECUTION:** Continuous loop: Architect directive → Builder execution → Harness → Judge review → Architect semantic gate → Merge → Post-merge verify → Next phase.
4. **MODE 4 — RECOVERY:** Triggered by failures/regressions. Executes rollback contract, halts dependent phases, and preserves evidence.
5. **MODE 5 — PUBLIC RELEASE:** Gate separating technical merge from public deployment/release.

---

## 3. Factory State Machine

```text
PROJECT_DISCOVERY
        ↓
SYSTEM_BLUEPRINT
        ↓
HUMAN_BLUEPRINT_APPROVED
        ↓
PHASE_QUEUED
        ↓
ARCHITECT_PHASE_DIRECTIVE
        ↓
BUILDER_HYDRATE_CONTEXT
        ↓
BASELINE_CAPTURED
        ↓
SPEC_VALIDATED
        ↓
WORKSPACE_PROVISIONED
        ↓
IMPLEMENTATION_LOOP
        ↓
LOCAL_HARNESS
        ↓
PR_CREATED_OR_UPDATED
        ↓
PR_REPAIR_LOOP
        ↓
JUDGE_REVIEW
        ├── CORRECTION_REQUIRED → BUILDER_REPAIR → HARNESS → JUDGE_REVIEW
        └── PASS
                ↓
        ARCHITECT_SEMANTIC_GATE
                ├── CORRECTION_REQUIRED → BUILDER_REPAIR
                └── PASS_TO_MERGE
                        ↓
                    MERGE
                        ↓
                POST_MERGE_VERIFY
                        ├── FAIL → RECOVERY
                        └── PASS
                             ↓
                     PHASE_RECEIPT_FINAL
                             ↓
                     NEXT_PHASE_AUTOMATIC
```

---

## 4. Autonomous Continuation & Five-Attempt Law

- **Autonomous Continuation:** Once the Project Blueprint is approved, agents MUST NOT pause to ask "Should I continue?" between successful phases.
- **Five-Attempt Limit:** Builder is allowed up to 5 meaningful repair attempts for any blocking failure class (CI, test, build, lint). If exhausted, issue a `HARD_BLOCKER` with full evidence.
