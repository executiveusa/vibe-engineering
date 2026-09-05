---
description: Start or resume Loop Engineering as the long-running, end-to-end Vibe execution mode.
---

Use the canonical `loop-engineering` skill as a separate execution mode from the normal guided Vibe Journey.

When the user selects Loop Engineering:

1. Read `skills/loop-engineering/SKILL.md` exactly as the router contract.
2. Preserve the ICM filesystem as source of truth.
3. Start or resume one Loop Engineering run packet.
4. Move through `INTENT -> BAR -> LOCK -> EVIDENCE -> GRAPH -> SPEC -> SLICE -> BUILD -> VERIFY -> GAUNTLET -> RELEASE -> LEARN`.
5. Operate autonomously between required human gates, but never over human authority.
6. Use the current Vibe skills only when the active Loop stage routes to them.
7. At VERIFY and GAUNTLET, use fresh review context and the dominant OpenCodeReview-backed review skill for code review.
8. Do not call work finished from code presence, CI, or deployment alone.
9. Require rollback and exact-revision production evidence before `PRODUCTION VERIFIED`.

This mode is intended for long-running work and may traverse the full Vibe Engineering workflow from zero to verified production. It is an option, not the default guided mode.
