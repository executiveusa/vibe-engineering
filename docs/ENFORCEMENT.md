# Enforcement

The House Skill says what should happen. This page is how GitHub makes it happen, so the rules still hold when an agent ignores its prompt.

## The four controls

| Control              | What it stops                                                                                        | Where                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Protected `main`     | Direct pushes, force-pushes, merging with red checks or open review threads                          | `scripts/protect-main.sh` (run by the owner, needs admin)                                                                       |
| Vibe merge gate      | Merging without a Judge receipt of SHIP, merging code the Judge never saw, HIGH work without a human | `.github/workflows/vibe-merge-gate.yml` + `scripts/merge-gate.mjs`                                                              |
| Keys-only agent step | An agent in a sandbox pushing, merging or changing settings                                          | `nightly-production-readiness.yml`: the factory step gets model keys and no GitHub token                                        |
| Independent Judge    | The builder grading its own work                                                                     | `factory/run-readiness-sandcastle.mts`: Codex builds, Claude Code judges; `factory/judge-receipt.mjs` refuses same-family pairs |

Merging is then simple: turn on GitHub auto-merge for a PR. It merges only once every required check, including the merge gate, is green. No merge bot holds a token that could skip the rules.

## 1. Protect main

```bash
# Dry run first: shows the required checks it found and the exact settings.
scripts/protect-main.sh executiveusa/terabithia executiveusa/pauli-tars-demo- executiveusa/pauli-starnet
# Then apply.
scripts/protect-main.sh --apply executiveusa/terabithia executiveusa/pauli-tars-demo- executiveusa/pauli-starnet
```

- Required checks default to the checks that passed on the branch's latest commit, so get `main` green first. Or name them with `--checks "test,build"`.
- `--mode checks` (the default): changes land through a pull request only, checks must pass on an up-to-date branch, conversations must be resolved, and nobody can force-push or delete (admins included).
- `--mode review`: adds one approving review and the `vibe / vibe-merge-gate` check. Use it after step 3.
- Private repositories on GitHub Free cannot use branch protection. That needs GitHub Pro, or the repository made public. The script says so when GitHub refuses; both are owner decisions.
- If the self-hosted runner is down, required checks cannot pass and nothing merges. That is intended. Fix the runner, don't remove the protection.

## 2. Add the merge gate to a repository

Create `.github/workflows/vibe-merge-gate.yml` in the target repository:

```yaml
name: vibe-merge-gate
on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  pull_request_review:
    types: [submitted, dismissed]
permissions:
  contents: read
  pull-requests: read
jobs:
  vibe:
    uses: executiveusa/vibe-engineering/.github/workflows/vibe-merge-gate.yml@<vibe-engineering commit SHA>
    with:
      vibe-ref: <the same commit SHA>
      runs-on: '["self-hosted","pauli-self-hosted"]' # private repos without Actions minutes
```

The check is named `vibe / vibe-merge-gate`. It passes only when:

1. `docs/evidence/production-readiness-judge.json` exists and re-checks as SHIP: score of 85 or more, no open P0/P1, every required check PASS (the Judge's own word is not enough);
2. nothing except `docs/evidence/` changed after the commit that added the receipt, so the Judge saw the code being merged;
3. HIGH-consequence work has an approving review from someone other than the PR author.

Pin both SHAs. Upgrading the gate is a reviewed change, like any dependency.

## 3. Give agents their own identity

Today every agent pushes as the owner's own account. GitHub cannot tell them apart, which has two consequences:

- a "require one approval" rule cannot work: GitHub does not let an author approve their own pull request, so the owner could not approve the agents' PRs;
- the audit trail cannot say whether a person or an agent made a change.

The fix is a GitHub App (or a machine user) for agents:

1. Create a GitHub App owned by the owner's account with Contents: write, Pull requests: write, Issues: write. Leave out Administration and Workflows.
2. Install it on the fleet repositories.
3. Store its app id and private key as secrets on the server, never in a repository, and have the factory and Terabithia mint short-lived installation tokens instead of using `FLEET_GITHUB_TOKEN`.
4. Re-run `scripts/protect-main.sh --mode review --apply ...`. Agent PRs now need the owner's approval, and HIGH work passes the merge gate only with it.

Creating the App and its key is an owner action. Agents must never create credentials for themselves.

## What stays a judgment call

The gate proves that a receipt exists, is current and is internally consistent. It cannot prove the Judge read carefully. That is why the Judge is a different model family from the builder, why HIGH work needs a person, and why `docs/PIPELINE.md` keeps the gauntlet's budget visible.
