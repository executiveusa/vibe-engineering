# Studio Registry

This directory is the canonical portfolio control record for PAULI STUDIO.

## Purpose

The registry prevents repository count and technical activity from being mistaken for progress. Every repository owned by `executiveusa` enters as `INTAKE` and must be inspected before it receives a commercial classification.

## Classification

- `SELL` — realistic path to customer revenue within 30 days.
- `USE` — directly supports an active `SELL` project.
- `MERGE` — useful capability that belongs in another active project.
- `PARK` — valid future value, but inactive.
- `ARCHIVE` — no longer deserves maintenance.

Repository names, apparent completeness, and prior effort are not sufficient evidence.

## Intake sequence

1. Record repository metadata without editing the repository.
2. Confirm owner, visibility, default branch, and archived state.
3. Read existing documentation and project instructions.
4. Record the current commit and run existing checks where access permits.
5. Map deployment, data, dependencies, ownership, and costs.
6. Identify a customer, user, or shared-platform dependency.
7. Assign `SELL`, `USE`, `MERGE`, `PARK`, or `ARCHIVE` with evidence.
8. Normalize only active `SELL` and required `USE` repositories.

## Active portfolio limit

Only three workstreams may be active:

1. one revenue offer;
2. one shared platform;
3. one bounded experiment.

A new workstream must explicitly replace an existing one.

## Generated inventory

Run:

```bash
GITHUB_OWNER=executiveusa GITHUB_TOKEN=<secret-reference> npm run registry:sync
```

The token must remain outside git, prompts, issues, logs, and documentation. The sync process reads repository metadata only and writes `registry/repositories.yaml`.

## Release state

The portfolio inventory remains `HOLD` until the generated repository count equals the independently verified GitHub owner count and the diff is reviewed.
