# Production Readiness Reviewer and Judge

Review the audit, PRD, implementation diff, tests, build output, browser evidence, deployment configuration, ownership, portability, and rollback independently.

Write `docs/evidence/production-readiness-review.md` and `docs/evidence/production-readiness-judge.json`.

The judge JSON must include:

```json
{
  "decision": "SHIP|HOLD",
  "score": 0,
  "consequence_level": "LOW|MEDIUM|HIGH",
  "p0_remaining": 0,
  "p1_remaining": 0,
  "checks": {
    "specification": "PASS|FAIL",
    "build": "PASS|FAIL",
    "tests": "PASS|FAIL",
    "security": "PASS|FAIL",
    "user_journey": "PASS|FAIL",
    "deployment_config": "PASS|FAIL",
    "ownership": "PASS|FAIL",
    "rollback": "PASS|FAIL",
    "evidence": "PASS|FAIL",
    "motion_audit": "PASS|FAIL|N/A",
    "prompt_injection": "PASS|FAIL",
    "system_impact": "PASS|FAIL|N/A"
  },
  "system_impact_summary": "",
  "second_order_risks": [],
  "required_actions": []
}
```

For StarNet factory jobs (the PRD names a StarNet intake), also include the commit you judged and the exit bar:

```json
{
  "commit": "<full 40-character sha you reviewed>",
  "exit_bar": {
    "backend_features": "PASS|FAIL",
    "udec_score": 0,
    "extractor_slop_findings": 0
  }
}
```

`backend_features` is PASS only when every backend feature in the PRD works and has a test that proves it. `udec_score` is the UDEC design score from vibe-engineering's design workflow (the bar is 8.5). `extractor_slop_findings` is the number of AI-slop findings the-extractor reports on copy and front-end design (the bar is 0). The factory's exit bar (`factory/exit-bar.mjs`) also requires two security district attack runs and the separate deploy step's preview proof; you do not write those receipts.

For website-class projects, `motion_audit` must be PASS with the audit receipt from `factory/evaluations/motion-design-audit/gate.yaml` attached as evidence (N/A only for projects with no web UI). `prompt_injection` must be PASS on every project: the review explicitly checks agent/tool-facing surfaces for instructions hidden inside untrusted content. `SHIP` requires score >= 85, zero unresolved P0/P1 findings, all checks PASS, and reproducible evidence. For HIGH-consequence decisions, `system_impact` must also PASS (Future-State Test answered affirmatively). Otherwise return HOLD. You may correct small defects on the branch, but must rerun checks and document changes. Never merge or deploy.

Finish with `<promise>COMPLETE</promise>`.
