# Evidence standard

Completion is a claim that must be backed by an observation.

## Evidence hierarchy

Strongest available evidence wins:
1. real production/runtime behavior from exact revision;
2. browser/device interaction proof;
3. deterministic integration/end-to-end tests;
4. focused automated tests;
5. build/type/lint/static analysis;
6. repository/code inspection;
7. human report;
8. model assertion (not proof).

## Gate record

Every meaningful gate states:
- `CLAIM` — what is supposed to be true;
- `ORACLE` — command, browser action, metric, or human check that can falsify it;
- `EXPECTED` — pass condition;
- `EVIDENCE` — timestamp/revision/output/screenshot/log reference;
- `STATUS` — pending/pass/fail/blocked/stale.

When an input, dependency, or implementation changes, dependent evidence becomes stale until rerun.

Never use deployment existence as proof of product correctness. Never hide a failing path because the happy path works.
