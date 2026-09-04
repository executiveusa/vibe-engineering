# Loop Engineering integration

Loop Engineering is a separate Vibe execution mode for long-running, end-to-end engineering work.

## Product boundary

- **Vibe Journey** is the guided stage-by-stage mode for a human who wants to move through one verified level at a time.
- **Loop Engineering** is the long-running mode for a capable agent or harness that should continue through many stages autonomously between human gates.

They share the same constitutional Vibe laws, ICM filesystem truth, proof, review, rollback, owner authority, and exact-revision release rules. Loop Engineering does not bypass Journey gates; it is a different execution topology over the same governed system.

## Plugin option

Claude Code users can select:

`/vibe-loop`

The command loads `skills/loop-engineering/SKILL.md` as the router and follows the Loop lifecycle.

## Lifecycle

`INTENT -> BAR -> LOCK -> EVIDENCE -> GRAPH -> SPEC -> SLICE -> BUILD -> VERIFY -> GAUNTLET -> RELEASE -> LEARN`

The outer loop repeats only when evidence says the result has not cleared the chosen bar. Independent verification and the gauntlet remain separate from the builder.

## Long-running behavior

Loop Engineering may continue for hours or across harness sessions by writing all durable state into the project filesystem. It may fan out only genuinely independent graph nodes. Human approval is still required wherever the project contract marks owner/Judge/release authority.

## Canonical source

The owner-provided Loop Engineering v1.0.0 `SKILL.md` router is copied verbatim into `skills/loop-engineering/SKILL.md`. Its lifecycle and terminology are preserved rather than rewritten into a new methodology.
