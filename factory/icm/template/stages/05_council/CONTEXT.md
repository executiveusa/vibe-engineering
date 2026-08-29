# Stage 05 — Council / Challenge

One job: give fresh, separately accountable perspectives permission to find what the builder missed.

## Inputs

- Layer 4: `../02_blueprint/output/`.
- Layer 4: `../04_verify/output/`.
- Product interface, evidence, affected system map, and reference comparison when present.
- Layer 3: `../../shared/NO_SLOP_STANDARD.md`.
- Layer 3: `../../shared/REFERENCE_BAR_STANDARD.md` when comparative quality matters.
- Layer 3: `../../shared/OWNERSHIP_RETENTION_STANDARD.md`.

## Process

Run six independently attributable reviews. Each review names the reviewer or governed review role, evidence examined, findings, and disposition.

1. **User value + commercial reality** — does the work improve the promised outcome for the actual target, and is the value measurable?
2. **Architecture** — will the decision remain understandable, maintainable, and appropriately simple as the system changes?
3. **Failure modes** — what breaks first, how is failure detected, and how does recovery work?
4. **Security + privacy** — are permissions, data, secrets, external input, and exposure proportional to the risk?
5. **Accessibility + taste** — can people use it, does the experience feel intentional, and did model-default slop survive into the artifact?
6. **Sovereignty + ownership** — can the owner understand, export, move, replace providers/builders, recover, and continue operating?

Every review also answers: **What claim here has the weakest proof?**

When a named reference bar exists, reviewers inspect the actual comparison rather than approving from adjectives or screenshots selected by the builder.

Reviewers challenge the work; they do not merely summarize it. A fresh reviewer should not inherit the builder's reasoning as a reason to agree.

## Outputs

- `user-value-review.md` -> `output/`
- `architecture-review.md` -> `output/`
- `failure-modes-review.md` -> `output/`
- `security-privacy-review.md` -> `output/`
- `accessibility-taste-review.md` -> `output/`
- `sovereignty-ownership-review.md` -> `output/`
- `plain-language-summary.md` -> `output/`

## Human gate

Any of the six reviews may issue a documented HOLD. Conflicts are escalated to Judge with evidence. A builder may respond to findings but cannot erase an independent HOLD without new evidence or authorized disposition.

## Plain-language proof

Show what six separately accountable reviewers would worry about before trusting this product with their time, money, privacy, safety, access, ownership, or reputation. Name the weakest claim instead of smoothing it over.