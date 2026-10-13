# Build

Load when: a spec exists and work should start.
Input: a spec or ticket. Output: a change on a branch with tests.
Load order: this file only. Open a step's source only when you reach that step.

## Steps

1. Set up repo context and rules. Source: repo: skills/setup-vibe, skills/vibe-engineering.
2. Keep large work honest: gates, decomposition. Source: repo: skills/deep-work.
3. Run the zero-to-verified build loop. Source: repo: skills/loop-engineering.
4. Structure an ICM workspace. Source: repo: skills/icmr-universal-compiler.
5. Implement test-first, prototype throwaways, isolate in worktrees. Source: external: implement, tdd, prototype. external: mattpocock/skills @ v1.2.3 (MIT), reference only

## Gate

Builder never verifies own work; go to W3.
