# Loop Engineering lifecycle

One job: route one project from intent to verified outcome while preserving owner control.

## Inputs
- Working: `runs/<active>/STATE.md`
- Working: `runs/<active>/PROJECT-LOCK.md`
- Working: `runs/<active>/BAR.md`
- Reference: `_shared/routing/skill-router.md`
- Reference: `_shared/standards/evidence.md`

## Process
1. Read the active run's `STATE.md`.
2. Read only the `CONTEXT.md` for `next_stage`.
3. Load only the references named by that stage and the skill router.
4. Produce the stage outputs in the run folder.
5. Record proof, risk, rollback impact, and the single next stage.
6. Stop only at an explicit human gate, an unsafe/blocked condition, or `PRODUCTION VERIFIED`.

## Outputs
- Updated run artifacts under `runs/<active>/`.
- One receipt per verified slice/release.

## Human check
The owner approves the bar, consequential irreversible actions, and production release. Other checks may be grouped into one approval packet when safe.
