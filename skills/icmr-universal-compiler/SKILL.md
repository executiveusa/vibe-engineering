---
name: icmr-universal-compiler
description: Detect and compile any role, project, workflow, organization, knowledge domain, record system, or existing repository into a reusable ICM Runtime Representation (ICMR) and an agent-walkable ICM workspace. Use before substantial work to choose the correct ICM form, define role boundaries, context contracts, human gates, evidence, sovereignty, rollback, and emit a portable machine-readable manifest any AI agent can execute.
license: MIT
metadata:
  version: "1.0.0"
  tags: "ICM, ICMR, agent workflow, architecture, routing, governance, interoperability"
---

# ICMR Universal Compiler

ICMR = **ICM Runtime Representation**: the portable machine contract an agent reads before entering a governed workspace.

The filesystem remains operational truth. `ICMR.yaml` describes the detected work type, ICM form, roles, authority, contracts, routing, context loading rules, gates, proof, sovereignty, rollback, and declared outputs.

This skill extends ICM; it does not replace it. Preserve one-folder/one-job contracts, small routing files, selective context, factory/product separation, human-editable artifacts, filesystem state, and copy-to-instantiate templates.

## Mandatory Step 0

Before substantial Vibe Engineering work:

`DETECT → ICMR → INTAKE/SPEC → SLICE → BUILD → PROOF → SHIP`

Do not enter the production workflow until `ICMR.yaml` exists and the Step 0 validation passes. For brownfield work, inventory reality before proposing moves or restructuring.

## Universal call contract

```yaml
request:
  subject: <role | project | workflow | repo | organization | knowledge | records | mixed>
  name: <optional name>
  goal: <measurable outcome>
  inputs: [<paths, urls, notes, requirements>]
  constraints: [<must not change>]
  proof: [<evidence required>]
  mode: auto | greenfield | brownfield
  output: detect | icmr | workspace | both
```

When data is incomplete, detect from available evidence first. Ask only when ambiguity materially changes architecture and cannot be bounded as an explicit assumption.

## 0. BASELINE

Determine:
- greenfield or brownfield;
- subject kind;
- current source-of-truth artifacts;
- outcome, target, constraints, proof, and commercial/operational value;
- blast radius and rollback requirements.

## 1. DETECT

Classify four axes independently.

### Work topology
- ordered repeating production → `pipeline`
- several pipelines with shared references → `umbrella`
- accumulating cases/entities/records → `record-library`
- navigable knowledge is the product → `knowledge-bundle`
- teams/process/data/governance relationships → `context-map`
- multiple independently true forms → `composite`

### Role topology
- `single-role`
- `role-chain`
- `role-hub`
- `role-matrix`

Roles are contracts, not simulated personalities. Each role states outcome, authority, forbidden actions, inputs, outputs, escalation, and proof.

### Execution topology
- `human-led`
- `agent-assisted`
- `agent-led-human-gated`
- `autonomous-bounded`

Default to `agent-led-human-gated` when AI execution is desired but irreversible authority has not been explicitly delegated.

### State topology
- `artifact-state`
- `record-state`
- `graph-state`
- `mixed-state`

Use `references/detection.md` for tie-breakers.

## 2. MODEL

Extract the smallest truthful model: repeating unit, entry/exit condition, stable references, run-specific artifacts, natural boundaries, roles, authority, consumed/produced data, human gates, failures, and proof. Do not invent extra stages.

## 3. COMPILE

Emit `ICMR.yaml` against `schemas/icmr.schema.json` and `templates/ICMR.yaml`. The manifest is a catalog, not a content dump: point to source files instead of embedding them.

## 4. MATERIALIZE

If a workspace is requested, create only the folders required by the detected form. Every working folder receives a `CONTEXT.md` defining purpose, exact inputs, references, process, exact outputs, validation, authority/gate, escalation, and do-not-load paths.

## 5. VERIFY

Run:
- **walk test** — root entry plus at most two reads locates the current job;
- **role test** — authority is bounded and builders do not self-approve high-impact output;
- **context test** — pointers, not payload; one authoritative home per fact;
- **proof test** — done means observable evidence;
- **rollback test** — brownfield mutation has a restore point or reverse operation.

Build, CI, merge, preview, or deployment request is never production proof.

## Role-to-ICM rule

A role never becomes one giant system prompt. Split recurring responsibilities into bounded jobs, detect their topology, compile each job into a contract, keep reusable standards in shared references, and keep each case/run output in product folders.

## Brownfield rule

Classify existing files as catalog, contract, factory, product, or dead/superseded candidate. Propose moves before destructive migration. Never silently delete. Preserve owner control of code, domain, hosting, database, credentials, and data.

## Consumer protocol

Any agent consuming ICMR must:
1. read `ICMR.yaml`;
2. resolve `routing.entry`;
3. choose exactly one current job/stage/node;
4. load only declared context and working inputs;
5. respect excludes and authority;
6. write only declared outputs;
7. run declared validations;
8. stop at required human gates.

## Return format

`DETECTED / FORM / ROLES / STATE MODEL / CHANGES / PROOF / STATUS / RISKS / ROLLBACK / NEXT / HUMAN APPROVAL`
