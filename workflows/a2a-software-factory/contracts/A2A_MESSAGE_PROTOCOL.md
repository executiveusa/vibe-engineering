# OPERATING CONTRACT — A2A MESSAGE PROTOCOL

This protocol governs machine-readable communication between Architect, Builder, and Judge agents.

## Message Types

1. `PHASE_DIRECTIVE` (Architect → Builder): Assigns work, boundaries, and acceptance criteria.
2. `PHASE_RECEIPT` (Builder → Judge / Architect): Submits finished implementation with test evidence.
3. `JUDGE_VERDICT` (Judge → Architect): Delivers independent verification findings and verdict.
4. `ARCHITECT_GATE` (Architect → System): Issues final phase decision (`PASS_CONTINUE`, `CORRECTION_REQUIRED`, etc.).
