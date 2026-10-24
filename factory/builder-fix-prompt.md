# Builder - review fix pass

The independent reviewer (a different model family than you) reviewed your branch
and wrote `docs/evidence/review.json`. Read it now.

Fix every P0 and P1 finding. For each one: make the smallest change that resolves
the reviewer's exact claim at the cited location - do not refactor around it, do
not touch unrelated files, do not re-open decisions the PRD already settled.

If a finding is wrong, do NOT argue in code comments; fix the underlying confusion
only when it is real (a misleading name, a missing guard). Otherwise leave the code
and note the dispute in `docs/evidence/fix-notes.md` (`F<n>: disputed - reason`).

P2 findings are optional; fix only when trivially safe.

When done, append one line per finding to `docs/evidence/fix-notes.md`:
`F<n>: fixed - <file>` or `F<n>: disputed - <reason>`, then commit.
You have at most 2 iterations. Unresolved P0/P1 after that is a HOLD, not a pass.
