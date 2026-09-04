# Bar and Gauntlet contract

A bar is required before substantial work.

## Valid bar

A bar must be:
- **Named** — a specific product, page, repo, benchmark, workflow, or measured target.
- **Fetchable/inspectable** — the critic can open, run, screenshot, or measure it.
- **Comparable** — our artifact and the bar can be judged on the same job.
- **Relevant** — same audience/job/constraint class, not merely famous.

If the user has no bar, propose 2-3 candidates with: `name`, `why comparable`, `what to measure`, `tradeoff`. Wait for one choice.

## Two-part gauntlet

### A. Blind comparator
A fresh critic receives the task, acceptance criteria, the bar, and two unlabeled outputs when feasible. It must pick `A`, `B`, or `TIE` and cite evidence. No self-score as the only proof.

### B. Weighted score
Use the universal score for all projects. For websites, use the web score below as well.

Universal categories (0-10):
- user/commercial value 15%
- correctness 15%
- architecture/wiring 10%
- usability/clarity 10%
- security/privacy 10%
- reliability/failure recovery 10%
- evidence/test quality 10%
- performance 5%
- accessibility/inclusion 5%
- taste/distinction 5%
- sovereignty/rollback 5%

Release floor: overall >= 8.5; correctness/security/reliability >= 9.0; critical failures = 0; unsupported completion claims = 0; rollback documented.

Web score (owner Collins protocol):
- strategy & positioning 12%
- customer understanding 8%
- content 10%
- information architecture 8%
- usability 14%
- visual design 12%
- originality & art direction 12%
- responsive design 7%
- accessibility 7%
- performance & reliability 5%
- conversion & proof 3%
- ownership & rollback 2%

Web floors: overall >= 8.5; usability >= 8.5; visual >= 8.5; originality >= 8.5; accessibility >= 8.5; primary conversion >= 9.0; critical failures/broken controls/mobile overflow/unverified claims = 0.

## Loop rule

If ours loses or a hard floor fails:
1. critic identifies the smallest decisive gaps;
2. route each gap to the correct skill/stage;
3. build a bounded repair slice;
4. re-verify from fresh evidence;
5. compare again.

Stop when ours wins/clears the defined bar, the owner stops, a safety/authority gate blocks, or evidence shows the target itself must change.
