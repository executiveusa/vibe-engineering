# Instinct Simplicity Review Standard

Standing software review contract inside Vibe Engineering.

## Brand outcome

> Software that gets you out of your seat.

The product should remove work, setup, monitoring, translation, and cleanup from the user. It should not merely hide unfinished complexity or make the interface visually sparse.

## Reference pattern

Use the interaction pattern, not another product's identity:

- one person;
- one conversational front door;
- no routine exposure to infrastructure or orchestration;
- ask only questions that can change the outcome;
- keep setup, routing, tools, workers, retries, and verification under the hood;
- show small truthful states: planning, working, needs approval, ready, or blocked;
- confirm consequential effects before execution;
- verify completion against the real product visually and functionally;
- return the useful result and decisive proof, not implementation noise;
- retain an operator/admin surface for recovery without forcing it into the primary journey.

A chat interface is not mandatory when conversation is wrong for the product. The required test is whether the product provides one obvious, low-effort front door and safely absorbs avoidable complexity.

## Review questions

For every software candidate, inspect the actual primary journey and answer:

1. What does the user have to understand before getting value?
2. Which setup, fields, screens, settings, choices, dashboards, status checks, and handoffs can be removed, merged, inferred, deferred, automated, or moved to an operator surface?
3. Is the system asking the user to translate their outcome into the system's architecture?
4. Is every remaining user decision genuinely decision-changing?
5. Can the user state the outcome in their own language and receive a useful first response without learning the stack?
6. Are working, approval-needed, ready, and blocked states plain and truthful?
7. Are consequential effects shown together with their target before approval?
8. Does the system verify the result in the real target, including pixel inspection where presentation matters?
9. Does the completion view give the result, evidence, limits, and recovery path without infrastructure noise?
10. Is hidden complexity observable and recoverable by an operator?
11. Does a failure return a clear blocker instead of a false completion?
12. Does the product measurably reduce user effort, attention, waiting, or follow-up?

## Required journey measurement

Record the current and proposed burden for the primary journey:

- user inputs and required fields;
- explicit user decisions;
- surfaces/screens visited;
- manual handoffs;
- status checks or follow-ups;
- terms the user must learn;
- time to first useful result;
- recovery steps after the most likely failure.

A PASS needs a reduction or a specific evidence-backed reason the burden is already irreducible. Fewer screens alone is not proof.

## Relationship to the Art of Reduction

The owner supplied `art-of-reduction-global-v1.0.0.zip` in the trusted WhatsApp conversation on 2026-09-14 (message `wamid.HBgLMTMyMzQ4NDI5MTQVAgASGBYzRUIwNjY3NzA4QTc1NUI4MTdEMEIzAA==`) and also named it in prior context on 2026-09-09 (`wamid.HBgLMTMyMzQ4NDI5MTQVAgASGBYzRUIwOEQ0NTU4QjJFRkNCMkMyNDlEAA==`). The current environment retains the upload record but not retrievable archive bytes. Therefore:

- the artifact is confirmed as owner-supplied;
- its contents are not claimed as re-inspected in this revision;
- this standard links it as a named upstream input rather than inventing its missing details;
- when the archive is available, reconcile its exact tests into this contract without creating a second reduction framework.

The existing `SUBTRACTION_GAUNTLET_STANDARD.md` owns element-level KEEP / MERGE / INFER / DEFER / MOVE / REMOVE review. This standard owns end-to-end user burden, conversational/front-door simplicity, under-the-hood verification, and the brand outcome. Run them together; do not duplicate their state machines.

## Required receipt

Write `docs/evidence/simplicity-review.json` for the exact candidate:

```json
{
  "schemaVersion": 1,
  "status": "PASS|REVISE|HOLD",
  "candidate": "<40-character git SHA>",
  "reviewerId": "<fresh reviewer identity>",
  "artifact": "<path or verified URL>",
  "primaryJourney": "<user outcome>",
  "frontDoor": "<single obvious entry>",
  "before": {
    "inputs": 0,
    "decisions": 0,
    "surfaces": 0,
    "handoffs": 0,
    "statusChecks": 0,
    "termsToLearn": []
  },
  "after": {
    "inputs": 0,
    "decisions": 0,
    "surfaces": 0,
    "handoffs": 0,
    "statusChecks": 0,
    "termsToLearn": []
  },
  "removedOrHiddenComplexity": [],
  "remainingUserDecisions": [],
  "visualEvidence": [],
  "functionalEvidence": [],
  "operatorRecoveryPath": "<path>",
  "largestRemainingComplexity": "<specific burden>",
  "protectedQualityThatStopsFurtherReduction": "<quality + evidence>",
  "brandOutcome": "software that gets you out of your seat"
}
```

## Verdict

- **PASS**: the real journey has one obvious front door, avoidable burden is removed or moved under the hood, visual/functional evidence supports completion behavior, recovery remains possible, and the brand outcome is defensible.
- **REVISE**: bounded avoidable complexity remains.
- **HOLD**: the primary journey, evidence, approval behavior, failure truth, or recovery path is missing or unsafe.

The builder cannot be the only simplicity reviewer. Judge and release authority remain separate.
