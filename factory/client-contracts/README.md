# Vibe Client Contract Architecture v1

## Decision

Use a client-level master contract plus lightweight repo-local contracts.

The unit of management is the client delivery system. Repositories are specialized execution components beneath it.

## Client-level master contract

Canonical location:

```text
clients/<client-id>/
├── CLIENT.md
├── COMMERCIAL.md
├── architecture.yaml
├── repositories.yaml
├── success-metrics.yaml
└── decisions/
```

The client-level contract owns:

- client identity and owner;
- commercial objective and offer;
- measurable 30–60 day success target;
- canonical repository/deployment map;
- cross-repo architecture and dependencies;
- shared operating constraints;
- public-facing release requirements;
- decision history;
- observability/client-lane identity.

Business truth is written once at client level and must not be duplicated across repositories unless required for local execution.

## Repo-local contract

Each participating repository keeps only the technical context necessary for safe execution:

```text
VIBE.md
AGENTS.md
.vibe/
└── config.yaml
```

Minimum `.vibe/config.yaml` fields:

```yaml
vibe_contract:
  version: 1
  client_system:
  repo_role:
  canonical_control_plane: executiveusa/vibe-engineering
  client_contract_path:
  public_facing: false
```

Repo-local context owns:

- exact role within the client system;
- build/test/typecheck/lint commands;
- deployment target;
- architecture boundaries specific to the repo;
- integrations/secrets classes without secret values;
- prohibited changes;
- rollback and verification commands;
- local agent instructions.

## Precedence

When instructions conflict:

1. studio/root governance and safety rules;
2. client-level master contract;
3. repo-local contract and existing repository instructions;
4. approved bounded ticket.

A lower layer may be more specific but may not waive a higher-level governance or commercial rule.

## Multi-repo example — MACS / MAXX

One client system can contain multiple canonical repos with distinct roles:

- `macsdigitalmedia` — public marketing and acquisition;
- `macs-agent-portal` — owner portal and agent control;
- `maxx-migrations-agentic-systems` — migration/ERP capability pending boundary audit;
- `maxx-clipz` — content product.

All share one commercial objective and one client decision history while retaining repo-specific execution instructions.

## Why

Full contract duplication creates drift and contradictory business instructions. Fully centralizing all context leaves repo-local agents without enough execution detail. This hybrid model keeps commercial truth centralized and technical truth close to the code.

## Control-center implication

The future founder control center is client-first. Repository and deployment health roll up into the client delivery system rather than appearing as independent businesses.
