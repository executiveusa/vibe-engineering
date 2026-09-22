---
name: multiverse-proof
description: Antithesis-style deterministic simulation testing for the vibe factory, free-tier build. Use in the PROOF stage to hunt rare-state bugs before Council - property catalogs, seeded runs, fault matrices, reproducible failures. Websites get the light version; stateful and agent-class projects get the full version.
version: 1.0.0
author: Bambu / Pauli Effect
license: MIT
tags: [vibe-engineering, proof, property-based-testing, chaos, determinism, fault-injection]
---

# Multiverse Proof

Inspired by Antithesis (deterministic simulation testing). Their platform is enterprise-priced; this skill is the free build of the same discipline.

## The idea

A stateful system is a giant state machine. Bugs are rare bad states. A single integration test threads one path; multiverse-proof explores many paths by running your invariants under seeded randomization and injected faults.

Four laws:

1. **Property catalog.** Every project writes "should ALWAYS" invariants for its shape ("checkout always completes or errors readably, never a blank screen"; "the bridge never executes an expired token").
2. **Seed law.** Every run logs its seeds. A failure counts only when its seed reproduces. No seed, no claim. "Can't reproduce it" is dead.
3. **Fault matrix.** Properties never run only in the happy path.
4. **No flaky pass.** A pass must reproduce by rerunning the recorded seed.

## Free toolchain

- JS/TS: fast-check (records and replays failing seeds).
- Python: Hypothesis (same seed discipline).
- Websites: Playwright network interception - APIs return 500, timeout, garbage, HTML-instead-of-JSON; slow 3G; offline mid-flow; clock skew.
- Agents: fault-injecting tool stubs - timeouts, malformed tool results, and instruction-laced tool outputs (doubles as prompt-injection red-team practice).
- Coverage (c8/istanbul) is the exploration signal, the free stand-in for the multiverse map.
- Stretch: coverage-guided fuzzing (fast-check + coverage feedback, Jazzer.js, AFL++ for parsers).

## Procedure

1. Write the invariant catalog (one "should ALWAYS" per line, tied to the project's shape).
2. Implement each invariant as a property test with the seeded runner.
3. Build the fault matrix for the project class (website light / agent full).
4. Run N seeded rounds x the fault matrix. Record seeds, coverage, and every failure with its reproducing seed.
5. Fix what breaks. Rerun the recorded seeds to prove the fix.
6. Emit the receipt: invariants, rounds, seeds, failures + repros, fixes, coverage.

## What real Antithesis adds

Hypervisor-level determinism across every dependency, the multiverse map UI, RL-guided exploration at scale, time-travel debugging. Enterprise pricing; correctly parked until bought.

## Rules

- Automations OFF: this runs on demand as a PROOF review surface. Receipts are artifacts.
- Never weaken an invariant to make a run pass. Change the system or document the owner-accepted risk.
