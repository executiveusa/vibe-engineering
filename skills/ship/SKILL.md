---
name: ship
description: Release only the exact revision that passed proof, then verify production and keep rollback ready.
---

# Ship

Freeze the candidate revision. Confirm proof and required review. Deploy that exact revision. Smoke test production, verify provenance and runtime health, and keep a tested rollback target. Do not ship a different revision from the one that passed.
