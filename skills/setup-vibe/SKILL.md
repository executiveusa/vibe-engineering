---
name: setup-vibe
description: Configure a repository so Vibe Engineering skills know where project context, decisions, issues, proof, and release rules live.
---

# Setup Vibe

Inspect the repository before writing anything. Reuse existing `AGENTS.md`, project context, decision/ADR folders, issue tracking, CI, and deployment conventions when they already exist.

Settle these basics with the owner only where the repository cannot answer them:

1. Where work is tracked.
2. Where shared project language lives.
3. Where hard-to-reverse decisions are recorded.
4. Which checks prove a change is safe to merge.
5. Who can approve production release.
6. What the rollback path is.

Prefer the existing repository structure over adding parallel Vibe-only files. Add the smallest missing pointers needed so `grill`, `spec`, `tickets`, `review`, `proof`, and `ship` can work without guessing.

Do not overwrite existing owner decisions. Preview material setup changes that affect authority, release, or destructive actions, and require the owner's explicit approval before applying them.
