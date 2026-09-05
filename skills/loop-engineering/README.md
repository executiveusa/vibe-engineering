# Loop Engineering

An ICM (Interpretable Context Method) skill for taking a digital product from zero or an existing state to a verified release.

The mental model is simple:

- **ICM is the memory and control surface.** Folder structure scopes context; plain files carry state.
- **The graph is the plan.** Jobs are nodes; real dependencies are edges; independent work may fan out.
- **The loop is the engine.** Build one bounded slice, gather evidence, let an independent critic compare it with the bar, then repeat only where it loses.
- **The bar is the finish line.** A named, fetchable, comparable reference plus measurable acceptance criteria.
- **The gauntlet is the judge.** Fresh-context reviewers cannot accept unsupported claims.

It is intentionally framework-neutral. LoopX, Pydantic AI, Burr, PocketFlow, DSPy, GraphARC, Ralphy, and other tools are routed only when their specific capability is justified.

## Use

Tell the agent: `Use loop-engineering on <project>.` If you already know the quality bar, include it. If not, the skill proposes 2-3 real bars and waits for one choice.

For Hermes, use `adapters/HERMES-HANDOFF.md` as the handoff prompt.

## Proof commands

```bash
python scripts/validate-workspace.py .
python scripts/init-run.py demo --root .
python scripts/score-gauntlet.py _shared/schemas/example-scorecard.json
```
