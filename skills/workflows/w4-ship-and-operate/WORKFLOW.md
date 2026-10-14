# Ship and operate

Load when: proof passed and a release is wanted.
Input: a passing candidate. Output: a verified release with rollback ready.
Load order: this file only. Open a step's source only when you reach that step.

## Steps

1. Release only the exact revision that passed proof, verify production. Source: repo: skills/ship.
2. Triage incoming issues and PRs. Source: external: triage. external: mattpocock/skills @ v1.2.3 (MIT), reference only

## Gate

Keep rollback ready. No release without a recorded proof receipt.
