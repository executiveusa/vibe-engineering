# OPERATING CONTRACT — SYSTEM IMPACT REVIEW

Do not review code in isolation. Evaluate diffs across the entire affected system graph:

```text
Diff → Callers → Contracts → Auth/Security → Database/State → UI/UX Journeys → Tests → Deployments → Connected Repos
```

## System Impact Checklist

1. **First-Order Effects:** Does the change directly fulfill the spec without breaking existing tests?
2. **Second-Order Effects:** Does this change create hidden side-effects in downstream consumers, background jobs, or database performance?
3. **Future-State Effects:** If this pattern is repeated 10x or 100x across the codebase, does it improve maintainability or create tech debt?
