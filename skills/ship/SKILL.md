---
name: ship
description: Release only the exact revision that passed proof, then verify production and keep rollback ready.
---

# Ship

Freeze the candidate revision. Confirm proof and required independent review. Require an authorized owner, Judge, or human to record `SHIP` or `HOLD`. Stop on `HOLD`. Deploy the exact proven revision only after `SHIP`. Smoke test production, verify provenance and runtime health, and keep a tested rollback target. Do not ship a different revision from the one that passed.
