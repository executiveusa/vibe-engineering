# Ultimate Bug Scanner gate

Pinned source: `Dicklesworthstone/ultimate_bug_scanner` revision `47edcd3a6f225b3316825175561943195ababe78`, reported by its CLI as UBS 5.4.4.

License caution: the repository labels its license "MIT License (with OpenAI/Anthropic Rider)" and excludes named restricted parties and their agents/service providers from all rights. This is not standard MIT. Vibe therefore does not vendor, copy, modify, redistribute, host, or package UBS code. It stores only this independently written invocation/receipt contract. Legal/rights review is required before any distribution or use by a restricted party.

## Placement

For every code build candidate:

```text
native test/build
-> UBS deterministic bug scan
-> Open Code Review
-> fresh project review / gauntlet
-> cold ICM walk
-> Judge SHIP or HOLD
```

UBS supplements Open Code Review. It does not replace exact-diff review or release judgment.

## Required invocation contract

- resolve and record the exact installed UBS revision/version;
- run against the candidate worktree before OCR;
- use machine-readable JSON;
- use `--profile=strict --fail-on-warning` unless a project-specific approved profile is pinned;
- store the complete JSON result and hash it;
- record candidate SHA, command, exit code, scan status, scanned languages/files, totals and disposition of every critical/warning finding;
- rerun after repairs on the final exact candidate.

Example executable shape when UBS use is rights-cleared and the pinned revision is installed:

```bash
ubs . --profile=strict --fail-on-warning --format=json > docs/evidence/ultimate-bug-scan-result.json
```

Exit semantics observed from `ubs robot-docs exit-codes` at the pinned revision:

- `0`: all requested scanners completed, with no findings that cross the selected failure threshold;
- `1`: critical findings, or warnings under fail-on-warning;
- `2`: invalid/environment/refusal/partial scan. This is HOLD, not a code-quality PASS;
- `3`: no supported language scanned. This is HOLD, not PASS.

A JSON `status` other than `ok`, missing language/module, partial scan, environment failure, no-scan, stale candidate, missing full output, or unresolved threshold finding is HOLD. `UBS_ALLOW_PARTIAL` and `UBS_ALLOW_NO_SCAN` are forbidden in the factory gate.

## First-run observation

A source-tree smoke scan of the Vibe candidate in this sandbox correctly failed closed with exit 2 and JSON `status: partial` because the JavaScript scanner could not execute its downloaded `ast-grep` dependency. The Python module still reported one warning, but partial output cannot pass the gate. This validates the required failure behavior; it is not a clean UBS receipt for Vibe.
