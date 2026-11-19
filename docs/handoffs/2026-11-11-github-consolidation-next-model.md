# V.I.B.E. Engineering — GitHub consolidation handoff

**Recorded:** 2026-11-11 (UTC). **Status:** PARTIAL / BLOCKED; do not claim merges completed.  
**Canonical repository:** https://github.com/executiveusa/vibe-engineering  
**Tracking issue:** https://github.com/executiveusa/vibe-engineering/issues/78  
**Next model's first task:** verify current state, renew the code-review credential through an authorized credential manager, obtain fresh current-head reviews, and merge safely **only** when requirements are met.

This document records an evidence-backed historical snapshot, not perpetual truth. Re-fetch remote SHA, branch protections, PR state, Actions results and evidence on entry. Do **not** treat GitHub `mergeable: true`, old green checks, CodeRabbit status, or text written here as proof of release readiness.

## Verified baseline (last observed 2026-11-11)

- Default `main` head: `f7ac9354b1eeb7928a06f91275ba11e80a3a1fad` (re-fetch on entry).
- GitHub branch endpoint reported `main.protected: true` and required check **`verify` only**. The new Vibe merge gate was **not** a required branch-protection check. Direct protection details could not be inspected by the GitHub app (403); owner-admin must verify full settings.
- Eight PRs were open: [#60](https://github.com/executiveusa/vibe-engineering/pull/60), [#62](https://github.com/executiveusa/vibe-engineering/pull/62), [#68](https://github.com/executiveusa/vibe-engineering/pull/68), [#70](https://github.com/executiveusa/vibe-engineering/pull/70), [#71](https://github.com/executiveusa/vibe-engineering/pull/71), [#73](https://github.com/executiveusa/vibe-engineering/pull/73), [#76](https://github.com/executiveusa/vibe-engineering/pull/76), [#77](https://github.com/executiveusa/vibe-engineering/pull/77).
- Initial full read-only scan found **60 branches**, of which **43** were divergent with unique ahead commits, **7** behind-only, **2** ahead-only, **7** without a common ancestor, and `main` itself. Branch histories overlap: do not sum ahead counts or merge unrelated histories blindly.
- Sequential merge conflicts have **not** been proven absent: GitHub reports instantaneous mergeability against current `main`, not future integrated mergeability after other PRs.
- **No PR in this consolidation mission had been merged at this handoff.** No production release was made.

## Changes already made to open PR branches (not main)

| PR | Current handoff head | Changes made | Evidence / blockers |
| --- | --- | --- | --- |
| [#70 — OCR review repair](https://github.com/executiveusa/vibe-engineering/pull/70) | `3474b454a58d5a549afd4c3866b03ba103121d25` | Added per-PR concurrency, documented explicit fail-closed fork/Dependabot behavior. Resolved 2 review threads, left fork/Dependabot trust issue open. | Quality Gate **PASS**; [Vibe Code Review 43084933845](https://github.com/executiveusa/vibe-engineering/actions/runs/43084933845) **FAIL**: actual upstream provider returned **HTTP 401 `API key expired`**; prior October OCR success is stale. |
| [#73 — Trail/ICM](https://github.com/executiveusa/vibe-engineering/pull/73) | `f4a0bed7d452413a053c318065f06c8936d2d837` | Clarified that `.trail/hook.cjs` and `.claude/settings.json` are **not present or running**, made Trail opt-in, preserved ICM fallback, corrected literal search. Addressed 2 review threads. | [Quality Gate 43085478291](https://github.com/executiveusa/vibe-engineering/actions/runs/43085478291) **PASS**; [Vibe Code Review 43085478366](https://github.com/executiveusa/vibe-engineering/actions/runs/43085478366) **FAIL**. No fresh independent approval on the updated head. |
| [#68 — merge gate caller](https://github.com/executiveusa/vibe-engineering/pull/68) | `c9a8a1aa93b8790222b82c286bb2b7ac86ecdf6c` | Evidence comment added; workflow not yet repaired. | P1 design issue: `pull_request_review` run binds to default-branch context, not automatically to the PR head. Current workflow pins a historical reusable gate and holds a PR-specific Judge receipt. **HOLD** until exact-head evidence and positive/negative tests. |

**Owner action opened:** [Issue #78](https://github.com/executiveusa/vibe-engineering/issues/78) documents the expired OpenRouter token and safe rotation procedure.

**Credential-management discovery:** A separate OpenRouter account connection was awaiting user authorization. The attempted Composio GitHub secret-management connection returned `401 Bad credentials` and likewise required reauthorization. Those connections were **not verified ready** at handoff. No key was rotated and no GitHub Actions secret was modified. Never paste tokens into chat, issues, reports, commits or Actions logs.

## Next model: ordered execution mission

### Slice 0 — inspect, baseline, prove ownership (read-only)

1. Confirm `executiveusa/vibe-engineering` is the target repo, `main` HEAD, current PR heads, `AGENTS.md`, `ICMR.yaml`, House skill and applicable stage context.
2. Inspect required branch checks and any ruleset requirements with sufficient admin scope; distinguish unavailable enforcement data from proven settings.
3. Inspect the latest review workflow logs. Read currently pinned upstream action/workflow SHA; do not replace it with a floating ref or unreviewed alternative.
4. Record baseline checks, exact SHA, conflicts and risks in the PR/issue evidence. Establish a rollback branch/commit per candidate.

### Slice 1 — restore independent code review, then #70

1. Use **authorized account access** to create an OpenRouter key specifically for the review lane, with budget/usage controls and least scope. If paid model, funding or new recurring cost is required, request human approval first.
2. Write the value exclusively to the GitHub Actions secret `OPENROUTER_API_KEY` using encrypted secret management. Never expose raw token in conversation or artifacts; verify only metadata.
3. Trigger a fresh PR #70 review at the **exact latest PR head SHA**. Require an OCR **complete** result, reviewer findings dispositioned, the `Quality Gate`, the actual required `verify` check, and independent reviewer evidence at that SHA. Fork/Dependabot review remains fail-closed until a separate trusted-review policy is approved.
4. Simulate merge into a fresh checkout of current `main`, run the repo's available comprehensive checks (`npm run check` where available and relevant security tests). Do not paper over failed checks.
5. Only if **all** gates pass, merge #70 using GitHub `expected_head_sha`, verify GitHub's merge result and the resulting `main` SHA, then run post-merge checks. If a gate fails, leave #70 open/HOLD and record exact blocker.

### Slice 2 — #68 HIGH-consequence enforcement fix

1. Repair gate event/checkout/head-SHA binding. A `pull_request_review` run green on `main` does not prove the candidate was checked.
2. Require current-head, provenance-bound Judge receipt, authenticated owner decisions, independent approval, and freshness after revisions.
3. Test **positive** authorized approval and **negative** missing/stale/forged receipt, approval dismissal, new commit after approval, unauthenticated waiver and failed reviewer. Save links to actual failing gate logs.
4. Independently review security and gate changes. Do not require the new gate in branch protection until tested and owner-admin authorizes the change.
5. Only then merge #68 with head-SHA pinning; report protection settings separately. Never weaken existing required checks.

### Slice 3 — #73 documentation integration

1. Refresh #73 onto merged main and inspect `AGENTS.md` carefully for overwritten canonical rules.
2. Preserve optional Trail/index status; no implied hook, install or cache. Run tests, verify review at new head, simulate clean merge.
3. Only then merge #73; verify on `main`.

### Slice 4 — close test PR #62 **without merge**

Use #62 as an intentional negative test: prove a PR without valid Judge receipt cannot pass the future merge gate. Save test evidence, then close as obsolete probe without merging.

### Remaining work — keep isolated and explicitly queued

- **#60:** governance has diverged from newer canonical standards; selective cherry-pick/integration only; not wholesale overwrite.
- **#71:** HIGH security audit law; unresolved enforcement and unauthenticated-waiver findings; hold for implementation plus independent review.
- **#76:** growth skills/gallery; conflicts with #70 reviewer workflow; take feature value without overwriting restored review controls, test callable skill policy.
- **#77:** DRAFT factory/StarNet private-preview deployment; hold pending independent security review, verified private destination, credential scope and owner release approval.
- Other branches: classify `SELL / USE / MERGE / PARK / ARCHIVE`; isolate homepage variants and ICM platform work into follow-up PRs. No speculative unrelated-history merges.

## Explicit STOP conditions

**Never** merge with failed/missing current-head required checks, incomplete review receipt, unauthenticated waiver, unapproved credential spending, unresolved material P1/P0, unproven conflict resolution or missing rollback. GitHub auto-merge is not enabled. No `pull_request_target` on untrusted candidate code; no direct pushes to protected `main`; never force merge, disable security or alter protection without owner approval.

If AI reviewer funding/connection is blocked, conduct other read-only diagnosis and branch-contained repairs, but mark the integration **BLOCKED**, not DONE. Do not substitute an old unrelated green status for a current reviewer.

## What DONE means

- Credential rotated safely; current-head independent OpenCodeReview and comprehensive quality gates truly green.
- PRs #70, #68, #73 merged sequentially with independent reviews, fresh integration conflict simulations, exact-head protections and verifiable final `main` checks.
- PR #62 negative-test receipt preserved; test PR closed unmerged.
- No secrets leaked, no branch protections weakened, no unauthorized deployment.
- Remaining #60/#71/#76/#77 explicitly held or separately scoped with ownership.
- Accurate issue/PR evidence, merge SHA, rollback and business impact recorded.

## Mandatory report back (paste as a GitHub issue #78 comment)

```md
# V.I.B.E. Consolidation Execution Report
Status: DONE | PARTIAL | BLOCKED
Time (UTC):
Agent identity:
Repository:
Starting main SHA:
Final main SHA:

| PR | Previous head | Verified head | Quality | Independent review | Merge simulation | Action/merge SHA |
|----|---------------|---------------|---------|--------------------|------------------|------------------|

Credential status: UPDATED | NOT UPDATED (never include any key)
Exact evidence: [PR links], [Actions job runs], [Judge receipts], [independent reviews], [merge commits]
Protection: required check names, exact-head binding evidence, remaining gaps
Negative tests: input condition, exact run URL, actual failure reason
Security approval: authority, scope, timestamp (no secret values)
Risks/blocked items:
Rollback: per-merge revert PR or reset of isolated branch, no rewriting main
Next ONE bounded action:
Human decision needed:
```

After the agent posts the report, the next ChatGPT model must **independently re-fetch** latest `main`, PR state and current check run results before certifying anything. Report link alone is not verification.

## Commercial scope

This is **USE / shared platform reliability**, not a new revenue offer. Avoid displacing the existing revenue workstream with unbounded factory expansion. Measurable outcome: zero unverified merges, restored reliable review, fewer contradictory workflows, and clear autonomous handoffs.
