# Proof and review

Load when: anything is about to be called done, merged, or shipped.
Input: a candidate revision. Output: evidence per claim and a recommendation.
Load order: this file only. Open a step's source only when you reach that step.

## Steps

1. Independent review of the exact revision. Source: repo: skills/project-review. Cannot authorize release.
2. Check every claim that matters on the exact revision. Source: repo: skills/proof.
3. Hunt rare-state bugs (optional). Source: repo: skills/multiverse-proof.
4. Catch generic or unproven output. Source: repo: skills/stop-slop.
5. Code review, bug diagnosis (optional). Source: external: code-review, diagnosing-bugs. external: mattpocock/skills @ v1.2.3 (MIT), reference only

## Gate

Order: project-review, then proof. A human or named judge decides SHIP or HOLD, never the builder.
