# Provenance and local guardrails

Vendored from https://github.com/Leonxlnx/cook at commit `b23cac6fd9439dfddcab61b14808e7bf72549b46` (2026-10-31), MIT license (copyright Leon Lin, see LICENSE in this folder). Added 2026-11-16 at the owner's request after his shared walkthrough of the workflow. Files are verbatim upstream with two local additions: this note, and one sentence appended to the SKILL.md frontmatter description directing loaders here first. Update by re-vendoring a newer upstream commit and re-applying that sentence, not by hand edits.

## Local guardrails (vibe-engineering house rules)

These guardrails are binding, not advisory: they override the skill's own defaults wherever the two conflict, and both the web-design workflow and the SKILL.md frontmatter in this repo say so at load time.

Cook's upstream defaults are built for unattended runs of 8-40+ hours and large token budgets. In this repo those defaults are overridden by the house method:

- A Cook run only starts with an explicit time cap and usage budget recorded in `cook/BRIEF.md`. This overrides two upstream defaults by name: the "at least 8h" demo floor is not a default here, and a run may be as short as its cap says.
- Upstream's ask-nothing-after-intake rule does not apply here. The agent stops and asks whenever a decision needs the owner: spend, publishing, a new tool or credential, or anything the house method routes to him. "The user may be asleep" is not license to bypass those gates.
- No paid model calls, top-ups or new subscriptions just to run it. Free/approved lanes only, per the standing spend rules.
- Cook's own gate already holds the final render for user approval; that gate is mandatory here, not optional.
- Publishing anything from a run (repo, video, post) needs the owner's explicit yes, same as any SHIP.

The skill itself is guidance plus one local script (`scripts/side-by-side.mjs`, needs Node 18+ and ffmpeg, no network calls). Nothing installs or runs on add.
