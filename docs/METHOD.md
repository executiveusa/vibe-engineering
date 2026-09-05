# The Vibe Engineering Method

**V.I.B.E. = Verify It Before Everything.**

Vibe Engineering is the governance layer. ICM is the durable, interpretable context structure. The artifact lifecycle is how work moves through the system.

Canonical lifecycle:

```text
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
```

## 1. INTENT

Define the owner, user, problem, desired change, commercial or mission value, success signal, non-goals, constraints, authority, and rollback requirement.

Before substantial work, persist:

```text
MODE
OUTCOME
TARGET
CONSTRAINTS
PROOF
COMMERCIAL VALUE
OWNER / AUTHORITY
ROLLBACK
```

Separate verified facts from assumptions.

**Output:** a clear `intent` artifact that says what should change and why.

## 2. SPEC

Turn the intent into an exact product and engineering contract: behavior, user journey, design standard, interfaces, architecture boundaries, dependencies, data ownership, accessibility, risks, acceptance criteria, named reference bars, and definition of done.

**Output:** a testable `spec` artifact.

## 3. PLAN

Convert the spec into bounded, independently verifiable slices. Name the files or systems likely to change, execution order, dependencies, risks, tests, proof requirements, and rollback path for each slice.

A plan should be usable by a different capable worker without requiring hidden chat history.

**Output:** an implementation `plan` artifact.

## 4. BUILD

Inspect before editing. Reuse existing patterns before inventing replacements. Isolate scope. Build one complete vertical slice at a time instead of wide collections of placeholders.

Keep ICM state and project documentation synchronized as decisions become real.

**Output:** working implementation with explicit failure handling and bounded change history.

## 5. PROOF

Test the claims actually being made. Proof may include unit, integration, type, lint, build, accessibility, security, browser, mobile, permissions, data, failure, recovery, deployment, and live-environment checks.

Important truth rules:

```text
BUILT ≠ VERIFIED
CI PASS ≠ CUSTOMER VALUE
DEPLOYED ≠ PRODUCTION PROOF
FORMAT PASS ≠ BEHAVIORAL PROOF
```

**Output:** durable evidence with pass, fail, and unverified states.

## 6. COUNCIL

Independent reviewers challenge the work from value, architecture, adversarial/failure, security/privacy, operational, user, accessibility/taste, sovereignty/ownership, and maintainability perspectives.

The builder cannot be the only reviewer of material work.

**Output:** disagreements, risks, corrections, and required additional evidence.

## 7. JUDGE

Judge is release authority only. It evaluates the spec, proof, Council findings, hard stops, rollback, and ownership constraints.

The verdict is:

```text
SHIP
or
HOLD
```

Judge does not rewrite the work it judges.

**Output:** visible release verdict with reasons and evidence references.

## 8. SHIP

Release the exact proven revision. Preserve configuration, evidence, limitations, ownership inventory, deployment identity, and rollback instructions. Verify the real environment after release.

A preview, scaffold, build artifact, or passing CI run is not production proof by itself.

**Output:** reversible release and owner handoff.

## 9. OPERATE

Monitor real behavior, incidents, customer outcomes, and friction. Simplify where possible. When a material change is needed, create a new INTENT and move through the lifecycle again rather than bypassing governance with ad hoc production patches.

**Output:** stronger system and a durable operational record.

## ICM mapping

Existing full-factory workspaces retain these compatible physical folders:

```text
00_intake      → INTENT
01_vision      → SPEC
02_blueprint   → PLAN
03_build       → BUILD
04_verify      → PROOF
05_council     → COUNCIL
06_judge       → JUDGE
07_ship        → SHIP
08_improve     → OPERATE
```

The folder names remain for compatibility. The semantic House lifecycle is authoritative.

## Core rule

**No agent soup. One walkable system. Any capable agent can use it.**
