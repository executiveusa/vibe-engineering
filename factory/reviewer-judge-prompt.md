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
    "system_impact": "PASS|FAIL|N/A"
  },
  "system_impact_summary": "",
  "second_order_risks": [],
  "required_actions": []
}
```

`SHIP` requires score >= 85, zero unresolved P0/P1 findings, all checks PASS, and reproducible evidence. For HIGH-consequence decisions, `system_impact` must also PASS (Future-State Test answered affirmatively). Otherwise return HOLD. You may correct small defects on the branch, but must rerun checks and document changes. Never merge or deploy.

Finish with `<promise>COMPLETE</promise>`.
