# 03_graph — shape the work

One job: convert the accepted architecture into an admitted task graph.

## Inputs
- Working: `ARCHITECTURE.md`, `PROJECT-LOCK.md`, `BASELINE.md`
- Reference: `_shared/standards/graph-rules.md`
- Reference: `_shared/schemas/task-node.yaml`

## Process
1. Create nodes that each produce one verifiable output.
2. Add edges only for real data/output dependencies; delete fake edges.
3. Identify safe parallel diamonds; otherwise keep sequential work in one context.
4. Declare `reads`, `writes`, `owns`, acceptance, skills, risk, and human gates for every mutating node.
5. Admit the graph: no ownership collisions among parallel nodes, no missing dependency, no unbounded spawn, no irreversible edge without gate, no node outside scope.
6. Prefer one vertical end-to-end slice before broad fan-out.

## Outputs
- `GRAPH.md` with Mermaid diagram + node table
- `STATE.md` -> `next_stage: 04_spec`

## Human check
Only approve graph edges that cross a consequential human gate. Routine decomposition continues without another meeting.
