# Vibe Engineering Workflow Locker

The Workflow Locker is the public and agent-readable library of reusable processes inside this repository.

It applies Interpretable Context Methodology principles: workflows are stored as understandable folders, Markdown instructions, explicit templates, and machine-readable manifests. The workflow remains usable when the model, coding agent, or orchestration platform changes.

## Locker rules

1. A workflow is a process, not a prompt dump.
2. Every workflow names its trigger, inputs, owner, outcome, boundaries, proof, rollback, and approvals.
3. Context is loaded by stage rather than copied into one giant prompt.
4. The builder receives only the context required for the active stage.
5. New discoveries become recorded work; they do not silently expand scope.
6. Mechanical claims require machine-produced evidence.
7. The builder cannot approve its own output.
8. Public release is separate from merge.
9. Every completed run produces a receipt and retrospective.
10. Workflow files remain portable and understandable without proprietary software.

## Canonical ICM stage map

| Stage | Question | Required artifact |
|---|---|---|
| 01 Intake | What signal started this work? | `INTAKE.md` |
| 02 Context | What is true about the system and user? | `CONTEXT.md` |
| 03 Outcome | What measurable result matters? | `OUTCOME.md` |
| 04 Plan | What is the smallest safe sequence? | `PLAN.md` |
| 05 Build | What may the builder change? | `WORK_ORDER.md` |
| 06 Verify | What external evidence proves the claims? | `EVIDENCE.json` |
| 07 Council | Which independent reviews are required? | `COUNCIL.md` |
| 08 Judge | Does the work earn SHIP or HOLD? | `VERDICT.json` |
| 09 Release | How is it deployed and reversed? | `RELEASE.md` |
| 10 Improve | What scar becomes a reusable control? | `RETRO.md` |

## Required package shape

```text
workflows/<workflow-id>/
├── README.md
├── workflow.yaml
├── stages/
│   ├── 01-intake.md
│   ├── 02-context.md
│   ├── 03-outcome.md
│   ├── 04-plan.md
│   ├── 05-build.md
│   ├── 06-verify.md
│   ├── 07-council.md
│   ├── 08-judge.md
│   ├── 09-release.md
│   └── 10-improve.md
├── templates/
├── schemas/
├── examples/
└── CHANGELOG.md
```

Existing packages may retain their current structure while adding `workflow.yaml` and mapping their files to these stages.

## Initial locker collections

### Build safely

- A2A Autonomous Software Factory
- Brownfield Vibe Rescue Sprint
- Greenfield Sovereign Launch
- Pull Request Judge
- Production Verification and Rollback

### Sell before building

- Vibe Audit
- Customer Discovery and Offer Lock
- 30-Day Revenue Experiment
- Proposal, Payment, and Kickoff

### Teach

- Software Basics: Inputs → Rules → State → Outputs → Proof
- Prompt vs Specification
- Testing for Beginners
- AI Slop Detector
- Ownership and Digital Sovereignty
- Build One Verifiable Slice

### Operate

- Incident Recovery
- Content Studio
- Client Handoff
- Weekly MAXX Operations Review
- Decision and Retrospective Promotion

## Publication gate

A workflow may appear publicly in the locker only when:

- its manifest validates;
- its stages are complete;
- at least one example exists;
- expected proof is explicit;
- rollback is explicit;
- owner and approval boundaries are clear;
- a non-author reviewer confirms it is understandable;
- no secrets, private client data, or unsafe operational details are included.
