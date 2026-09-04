# Engine router — choose one control primitive, not a framework pile

The Loop Engineering skill itself runs on ICM files. Add a runtime only when the product needs runtime behavior ICM should not fake.

## Decision tree

1. Is this ordinary product engineering with sequential human-reviewed stages? -> stay ICM-only.
2. Does long-running work need durable state across harnesses/days? -> consider LoopX.
3. Is the product itself a Python AI agent with typed tools/outputs/evals? -> consider Pydantic AI.
4. Is behavior best expressed as an explicit persisted state machine with replay/telemetry? -> consider Burr.
5. Is a tiny graph enough and you want almost no abstraction? -> consider PocketFlow.
6. Does an LLM propose task graphs dynamically and must policy/budget admit them before execution? -> consider GraphARC.
7. Is the repeated LM pipeline underperforming against a stable measurable metric? -> consider DSPy optimization after baseline exists.

## Architecture rejection rule

If two frameworks solve the same authority/state problem, choose one or document a clean boundary. Never create two bosses for the same truth.
