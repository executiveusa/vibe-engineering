# No-slop standard

AI slop is output produced from a model default instead of deliberate intent, a useful reference, evidence, or human judgment.

A longer banned-pattern list is not the cure. Use context + reference + detector + fresh review + reality.

## Idea slop

Symptoms: obvious product clone, invented audience assumptions, “nothing like this exists,” feature lists before user/problem research.

Check: research the instinct, audience-matched analogs, proven mechanics, failed attempts, and what is still genuinely new.

## Strategy slop

Symptoms: generic growth advice, vague ICP, standard pricing advice, activity presented as value.

Check: named customer, current evidence, commercial outcome, smallest test, real behavior.

## Copy slop

Symptoms: inflated importance, sales filler, statistical AI phrases, forced punchlines, predictable rhythm, vague authority, repeated structural clichés.

Check: preserve the claim, remove filler, use the project's voice, name real evidence, read it aloud.

## UI slop

Symptoms: repeated AI layout defaults, card-everything composition, decorative badges, generic gradients/glass, weak typography hierarchy, copied aesthetics without product reason, accessibility traded for novelty.

Check: PRODUCT/DESIGN context, named references, information hierarchy, task clarity, responsive behavior, accessibility, deterministic detectors where available, browser comparison.

## Architecture slop

Symptoms: fashionable stack changes, duplicate abstractions, new services without a boundary problem, rewrites because they feel cleaner.

Check: inspect first, reuse first, document why a new boundary is necessary, calculate blast radius, preserve rollback.

## Code slop

Symptoms: placeholders presented as done, swallowed errors, duplicate helpers, cleverness without need, unnecessary dependencies, tests written only after the implementation cannot be challenged.

Check: small slice, behavior test, explicit failure handling, code review, simplification after correctness.

## Business slop

Symptoms: shipping features without a customer outcome, manufactured lock-in, vanity metrics, retention confused with captivity.

Check: customer value, cost, revenue/savings/validated learning, portability, handoff, actual retention reason.

## Production slop

Symptoms: “deployed” treated as “verified,” preview screenshots used as production proof, missing monitoring, unknown rollback, credentials or data ownership unclear.

Check: target-environment evidence, health checks, ownership receipt, backup, rollback, observability, authorized release.

## Final question

For any material output ask: **What part of this exists because we chose it, and what part exists because the model defaulted to it?**

Anything important in the second category goes back through intent, reference, and proof.