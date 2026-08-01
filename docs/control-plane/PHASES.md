# Vibe Factory Control Plane — Eight-Phase Program

## Outcome

Make this repository the canonical, versioned source of truth and operating control plane for every approved Vibe Engineering agent, project, workflow, decision, evidence receipt, and release gate.

## Phase 1 — Constitutional truth compiler

Normalize approved laws, workflows, and release policy. Compile deterministic, hashed truth bundles. Add precedence, secret detection, context resolution, and tests.

**Proof:** the same source commit always produces the same bundle hash; invalid or duplicate truth fails.

## Phase 2 — Read-only Truth API and SDK

Migrate or add the bounded Next.js API surface, expose manifest/truth/workflow/context endpoints, add TypeScript SDK and CLI, and publish OpenAPI documentation.

**Proof:** API output matches the compiled bundle for the deployed commit.

## Phase 3 — Dedicated operational data plane

Create a dedicated Supabase project. Add append-only run, stage receipt, evidence, verdict, acknowledgement, permission, and audit tables with RLS.

**Proof:** cross-agent and cross-project access denial tests pass; repository truth remains canonical.

## Phase 4 — Authenticated execution API

Add agent-scoped identities, API keys, idempotency, run creation, stage submission, evidence provenance, Judge verdicts, and policy acknowledgements.

**Proof:** a Builder cannot approve itself, change policy, access owner credentials, or delete audit records.

## Phase 5 — Agent adapters and MCP

Ship adapters for Hermes, Factory, Codex, Claude Code, OpenCode, and a narrow standards-compatible MCP server. Add project bootstrap and truth-version pinning.

**Proof:** two different agent runtimes resolve the same work contract from the same request and truth hash.

## Phase 6 — Workflow Locker and Learning Lab

Complete the premium Next.js public experience, searchable workflow locker, visual stage maps, blog, youth-first curriculum, downloadable process packages, and source-backed public documentation.

**Proof:** public pages consume the same API as agents; no duplicated hand-maintained truth exists.

## Phase 7 — Autonomous factory orchestration

Connect Architect → Builder → Harness → Judge → semantic gate → merge → post-merge verification → recovery. Add model routing, budgets, retry limits, notifications, and project status.

**Proof:** one low-risk project completes autonomously with independent evidence and rollback; high-risk release stops at the human gate.

## Phase 8 — Production hardening and commercial operations

Add observability, backups, disaster recovery, key rotation, performance and security review, customer tenancy, Vibe Audit/Rescue/Sovereign Launch/MAXX templates, billing boundaries, and owner handbooks.

**Proof:** restore rehearsal, incident simulation, access revocation, production canary, and independent Council review pass.

## Release law

Each phase is a separate pull request or bounded set of pull requests. A later phase may not declare an earlier phase complete without its evidence. Merge is not production. Production release remains an explicit gate.
