---
description: Start or resume the Vibe Journey for this project.
---

Read `AGENTS.md`, `ICMR.yaml`, and `CONTEXT.md` in that order. Then run the Vibe journey status command and present only the current stage, its purpose, required gates, and the single best next action in plain language.

Rules:
- Never advance a stage because the user or agent says it is done.
- Never bypass ICM gates.
- If journey state does not exist, initialize it through the Vibe journey engine.
- Keep the filesystem as source of truth.
- End by guiding the user through the current stage one decision at a time.
