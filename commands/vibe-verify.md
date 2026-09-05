---
description: Execute the current ICM stage gates. HOLD on any failed gate; otherwise write a receipt and advance.
---

Run the Vibe Journey gate engine for the active stage instead of manually declaring the stage complete:

```bash
vibe verify-stage
```

When the work is tied to a release candidate, bind verification to the exact revision:

```bash
vibe verify-stage --candidate <sha>
```

The gate engine must:
- run mechanical checks itself when they are executable, including tests and builds;
- run `executiveusa/open-code-review` as the dominant code-review engine at the review stage;
- require durable PASS evidence for judgment gates such as Stop Slop, Taste, product intent, proof, rollback, and production smoke;
- require explicit human/owner/Judge authority for human-only gates;
- write gate evidence under `.vibe/evidence/<stage>/`;
- return `HOLD` when any required gate is missing or fails;
- write a stage receipt and advance only when every declared gate passes.

Do not translate a missing judgment artifact into PASS. Help the user complete the missing evidence, then run verification again.

Return one of only two stage decisions:
- `HOLD` with failed gates and the smallest repair action; or
- `PASS`/`ADVANCE` with the durable receipt path and newly active stage.

Never infer PASS from confidence, appearance, a demo, or user pressure. The project levels up only after the ICM gate engine earns the transition through evidence.
