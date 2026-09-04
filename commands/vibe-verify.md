---
description: Verify the current ICM stage. HOLD on any failed gate; otherwise write a receipt and advance.
---

Read the current stage contract and its required evidence. Evaluate every declared gate using deterministic checks where possible and the appropriate Vibe skills where judgment is required.

For software review gates, run `executiveusa/open-code-review` as the dominant code-review engine and re-run it after fixes against the final exact candidate.

Return one of only two stage decisions:
- `HOLD` with the failed gates and the next repair action; or
- `PASS` with the durable receipt path and the newly active stage.

Never infer PASS from confidence, appearance, or user pressure. The stage advances only after all required gates pass and the receipt is written.
