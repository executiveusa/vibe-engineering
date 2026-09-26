#!/usr/bin/env bash
# Protect each repository's main branch so the Vibe rules are enforced by GitHub, not by prompts.
#
#   scripts/protect-main.sh [--mode checks|review] [--branch NAME] [--checks "a,b"] [--apply] OWNER/REPO...
#
# Dry run by default: prints the protection each repo would get. Add --apply to set it.
# Needs `gh` logged in as a repository admin.
#
# Modes:
#   checks  (default) Changes land only through a pull request; required checks must pass on an
#           up-to-date branch; conversations must be resolved; no force-push or deletion; admins
#           included. Use this while agents still push as the owner's own account.
#   review  Everything in `checks`, plus one approving review (stale approvals dismissed, the last
#           pusher cannot approve) and the `vibe / vibe-merge-gate` check (the caller job in docs/ENFORCEMENT.md). Use it once agents push as their
#           own bot identity; until then the owner cannot approve the agents' PRs (GitHub treats
#           them as the owner's own). See docs/ENFORCEMENT.md.
#
# Required checks: --checks, or else every check that passed on the branch's latest commit.
set -euo pipefail

mode=checks branch="" checks_override="" apply=0 repos=()
while [ $# -gt 0 ]; do
  case "$1" in
    --mode) mode="$2"; shift 2 ;;
    --branch) branch="$2"; shift 2 ;;
    --checks) checks_override="$2"; shift 2 ;;
    --apply) apply=1; shift ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) repos+=("$1"); shift ;;
  esac
done
case "$mode" in checks|review) ;; *) echo "--mode must be checks or review" >&2; exit 2 ;; esac
[ ${#repos[@]} -gt 0 ] || { echo "name at least one OWNER/REPO" >&2; exit 2; }
command -v gh >/dev/null || { echo "gh is required" >&2; exit 2; }
command -v jq >/dev/null || { echo "jq is required" >&2; exit 2; }

failed=0
for repo in "${repos[@]}"; do
  target="${branch:-$(gh api "repos/$repo" --jq .default_branch)}"
  if [ -n "$checks_override" ]; then
    checks=$(printf '%s' "$checks_override" | tr ',' '\n' | sed '/^$/d')
  else
    # Check runs and commit statuses that passed on the branch head: what "green" means today.
    checks=$( {
      gh api --paginate "repos/$repo/commits/$target/check-runs" \
        --jq '.check_runs[] | select(.conclusion == "success") | .name'
      gh api "repos/$repo/commits/$target/status" --jq '.statuses[] | select(.state == "success") | .context'
    } | sort -u)
  fi
  if [ "$mode" = review ]; then
    checks=$(printf '%s\nvibe / vibe-merge-gate\n' "$checks" | sed '/^$/d' | sort -u)
    reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true,"require_last_push_approval":true}'
  else
    reviews='{"required_approving_review_count":0,"dismiss_stale_reviews":true}'
  fi
  if [ -n "$checks" ]; then
    status_checks=$(printf '%s\n' "$checks" | jq -R . | jq -s '{strict: true, checks: map({context: .})}')
  else
    status_checks=null
  fi
  body=$(jq -n --argjson checks "$status_checks" --argjson reviews "$reviews" '{
    required_status_checks: $checks,
    enforce_admins: true,
    required_pull_request_reviews: $reviews,
    restrictions: null,
    required_conversation_resolution: true,
    allow_force_pushes: false,
    allow_deletions: false
  }')

  echo "== $repo@$target ($mode)"
  if [ "$status_checks" = null ]; then
    echo "   WARNING: no passing checks found on $target; only the pull-request rule will apply."
    echo "   Get main green first, or pass --checks."
  else
    printf '%s\n' "$checks" | sed 's/^/   required check: /'
  fi
  if [ "$apply" -eq 0 ]; then
    echo "   dry run; add --apply to set:"
    printf '%s\n' "$body" | sed 's/^/     /'
    continue
  fi
  if out=$(printf '%s' "$body" | gh api -X PUT "repos/$repo/branches/$target/protection" --input - 2>&1); then
    echo "   protected."
  else
    failed=1
    echo "   FAILED: $out" >&2
    case "$out" in
      *"Upgrade to GitHub Pro"*|*"403"*)
        echo "   Private repositories on GitHub Free cannot use branch protection; that needs GitHub Pro or making the repository public (owner decision)." >&2 ;;
    esac
  fi
done
exit "$failed"
