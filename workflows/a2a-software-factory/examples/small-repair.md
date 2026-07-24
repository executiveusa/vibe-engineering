# EXAMPLE — SMALL REPAIR SCENARIO

## Overview
A bug report indicates an edge-case calculation error in a utility module.

## Execution Flow

1. **Architect Directive:** Issues `PHASE-01-BUGFIX` with `LOW` consequence level and targeted file scope.
2. **Builder Execution:**
   - Captures baseline SHA and confirms failing test case.
   - Applies 3-line bugfix.
   - Runs `npm test` → PASS.
   - Generates Phase Receipt.
3. **Judge Review:** Performs mechanical checks and confirms fix passes without regressions → `PASS`.
4. **Architect Gate:** Evaluates semantic impact → `PASS_CONTINUE`.
5. **Merge:** PR merged automatically.
