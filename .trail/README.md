# Optional Trail index

Vibe Engineering's canonical context is the repository filesystem:
`AGENTS.md → ICMR.yaml → CONTEXT.md → current stage contract`.
Trail is an optional, per-machine code graph to accelerate discovery. A fresh
clone does **not** have an index or an automatic session-start hook.

## Setup (optional)

```sh
npm i -g @trailhq/trail-code
trail build
trail map
```

The local cache is kept in `.trail/cache/` and excluded from version control.
Agents without Trail should continue using ordinary file search and the ICM
context files; they must not block on installing another tool.

## Session learning

If a session required investigation that would otherwise be repeated, a short
verified Markdown summary may be added under `.trail/learnings/`. Record the
decision, evidence, rejected alternatives and pitfalls; never transcripts,
client secrets, credentials or personal data.

## Claude Code integration

The optional `.trail/hook.cjs` and `.claude/settings.json` SessionStart
integration is **not included in this PR** and is **not automatically active**.
Adding those files is a separate reviewed decision; do not claim the hook is
operational until those files exist and a clean-clone test proves it.
