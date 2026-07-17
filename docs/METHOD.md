# The Vibe Engineering Method

## 1. Vision

Define the owner, user, problem, desired change, value, success signal, and non-goals. The Vision prevents agents from treating every possible feature as required.

**Output:** one-paragraph outcome statement.

## 2. Blueprint

Convert the Vision into a Vibe Spec: scope, user journey, architecture boundaries, dependencies, data ownership, risks, acceptance tests, rollback, and definition of done.

**Output:** small testable product contract.

## 3. Build

Inspect before editing. Reuse existing patterns. Isolate scope. Build complete vertical slices instead of wide collections of placeholders.

**Output:** working implementation with documentation and explicit failure handling.

## 4. Verify

Test behavior and claims. Verification may include unit, integration, build, accessibility, security, mobile, data export, permissions, failure, and recovery checks.

**Output:** evidence register with pass, fail, and unverified states.

## 5. Council

Independent reviewers challenge the work from architecture, adversarial, operational, user, taste, and sovereignty perspectives.

**Output:** disagreements, risks, corrections, and required evidence.

## 6. Judge

Calculate the Vibe Score. Apply hard stops. Decide `SHIP`, `HOLD`, or `REJECT`.

**Output:** visible release decision with reason.

## 7. Ship

Release with a handoff: change summary, impact, configuration, evidence, limitations, rollback, and ownership inventory.

**Output:** reversible release and complete owner handoff.

## 8. Improve

Compare real behavior with the Vibe Spec. Fix incidents and friction. Simplify. Update tests. Re-run the Judge.

**Output:** stronger system, not automatic feature growth.
