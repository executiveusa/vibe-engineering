# ICM Software Factory v1

## MODE

Brownfield. Preserve the existing React/Vite product, Vibe Engineering governance, Sandcastle scaffold, and A2A Architect–Builder–Judge workflow.

## OUTCOME

Create one deterministic command that scaffolds a complete, inspectable, model-agnostic Vibe Engineering project workspace and one doctor command that proves the workspace is structurally valid.

## TARGET

Non-technical creators, urban youth, seniors, nonprofits, social-purpose teams, and the agents that build software with them.

## CONSTRAINTS

- Do not rewrite the public website or design system.
- Do not add another orchestration framework.
- Reuse the existing eight-stage Vibe method and A2A workflow.
- Keep every stage understandable with plain-text files.
- Preserve human approval for consequential release actions.
- Do not write secrets or claim production verification from scaffold success.

## ICM architecture

The factory follows the five ICM layers:

0. `AGENTS.md` — identity, laws, and boundaries.
1. `CONTEXT.md` — workspace map and routing.
2. `stages/NN_name/CONTEXT.md` — one job, explicit inputs, process, outputs, and human gate.
3. `_config/`, `references/`, and `shared/` — stable factory rules.
4. `stages/*/output/` — working artifacts for the current project run.

The stage sequence maps directly to Vibe Engineering:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

## One-click contract

```bash
npm run factory:new -- --name "Project Name"
```

Optional parameters:

```bash
npm run factory:new -- \
  --name "Neighborhood Health Guide" \
  --mode greenfield \
  --domain health \
  --audience "urban youth and seniors" \
  --target ./workspaces/neighborhood-health-guide
```

The command must:

1. refuse to overwrite a non-empty destination;
2. copy the canonical ICM template;
3. replace project tokens;
4. create every stage output directory;
5. install a self-contained doctor command;
6. write `.factory/state.json`;
7. run the doctor automatically;
8. return the exact next stage instead of claiming the product is complete.

## Verification contract

```bash
npm run factory:doctor -- ./workspaces/project-slug
```

The doctor blocks when required files, stages, or stage-contract sections are missing. It does not claim that application tests, security, deployment, or customer value have been verified.

## Acceptance criteria

- The scaffold command creates all five ICM layers.
- Every stage contract contains Inputs, Process, Outputs, Human gate, and Plain-language proof sections.
- A generated workspace passes its doctor.
- Re-running the scaffold against a non-empty target fails safely.
- Removing a required contract causes the doctor to fail.
- Existing `npm test`, `npm run build`, and dependency audit remain available.

## Commercial value

This turns the methodology into a repeatable product foundation for Vibe Audits, Vibe Rescue Sprints, Sovereign Launches, and MAXX Operations while keeping the customer’s workspace portable, readable, and owner-controlled.

## ROLLBACK

Revert the implementation PR. The public application and existing A2A workflow remain unchanged.