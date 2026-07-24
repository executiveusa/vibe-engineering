# EXAMPLE — LONG-RUNNING MULTI-REPO PROJECT SCENARIO

## Overview
A major system upgrade spanning backend API services and frontend web applications.

## Execution Flow

1. **Discovery & Blueprint:** Architect creates a multi-phase Project Blueprint detailing system boundaries, contract schema changes, and risk tier (`HIGH`).
2. **Human Approval:** Human approves the Project Blueprint once.
3. **Autonomous Execution:**
   - **Phase 1 (API Schema - MEDIUM):** Architect directive → Builder implementation → Judge verification → Architect gate → Autonomous merge.
   - **Phase 2 (Frontend Integration - MEDIUM):** Architect directive → Builder implementation → Judge visual/E2E verification → Architect gate → Autonomous merge.
   - **Phase 3 (Production Cutover & Migration - HIGH):** Architect directive → Builder staging & rollback rehearsal → Judge verification → Architect gate → **HUMAN GATE REQUIRED** for live database migration.
4. **Post-Approval:** Upon human ACK, final production deployment executes and validates runtime smoke tests automatically (`PROJECT_COMPLETE`).
