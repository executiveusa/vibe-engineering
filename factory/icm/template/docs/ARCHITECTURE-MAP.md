# Vibe Engineering Architecture Map

This workspace inherits the Vibe Engineering house architecture.

```text
VIBE ENGINEERING
Governance / release law
        ↓
ICM
Interpretable context + stage contracts
        ↓
INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE
        ↓
ORCHESTRATOR
Routes approved work between stages
        ↓
WORKERS
Replaceable implementation agents
        ↓
GIT + CI + EVIDENCE + ROLLBACK
Durable proof and owner control
```

## Current physical stage mapping

```mermaid
flowchart TD
    I[00_intake · INTENT] --> S[01_vision · SPEC]
    S --> P[02_blueprint · PLAN]
    P --> B[03_build · BUILD]
    B --> V[04_verify · PROOF]
    V --> C[05_council · COUNCIL]
    C --> J[06_judge · JUDGE]
    J --> SH[07_ship · SHIP]
    SH --> O[08_improve · OPERATE]
    O -. incident / validated improvement .-> I

    style I fill:#3B82F6,color:#fff
    style S fill:#8B5CF6,color:#fff
    style P fill:#F59E0B,color:#111
    style B fill:#06B6D4,color:#111
    style V fill:#22C55E,color:#111
    style C fill:#F97316,color:#111
    style J fill:#EF4444,color:#fff
    style SH fill:#10B981,color:#111
    style O fill:#64748B,color:#fff
```

The canonical token definitions live in `_config/stage-system.yaml`. Text labels remain authoritative; color is a supplemental visual signal.
