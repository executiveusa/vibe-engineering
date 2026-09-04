---
description: Attempt the final Vibe release gate for the exact proven candidate.
---

Read the active journey state, receipts, proof, exact candidate SHA, review evidence, release authority, and rollback target.

Return `HOLD` unless all required stage receipts exist, the exact candidate passed review and proof, an authorized human records SHIP, and rollback is ready.

If SHIP is authorized, release only the exact proven candidate, smoke test the real target environment, verify provenance/runtime health, and preserve the tested rollback target.
