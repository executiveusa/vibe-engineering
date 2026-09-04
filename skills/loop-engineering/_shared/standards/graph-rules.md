# Task graph rules

Use graph engineering to shape work, not to multiply agents.

1. A node is one independently verifiable job with one owner and declared outputs.
2. Draw an edge only if the downstream node actually reads the upstream output. Delete fake edges.
3. Parallelize only nodes that do not need each other's results and do not write the same artifact/state.
4. Use the diamond for split work: `plan -> parallel workers -> separate verifiers -> one merge owner`.
5. Sequential work stays with one context when it needs the full picture.
6. Every mutating node declares `OWNS` paths/resources and `WRITES` state.
7. Dynamic model-proposed graphs must be admitted before execution against allowed node kinds, policy, budget, depth, ownership, and dependency validity.
8. Human gate irreversible/high-cost edges: publish, send, charge/refund, destructive data actions, production deploy, credential/domain ownership changes.
9. Every loop has a budget/round cap as a safety ceiling, but quality exit is evidence/bar based rather than 'three rounds and done'.
10. One owner merges findings. Parallel workers never silently merge themselves.
