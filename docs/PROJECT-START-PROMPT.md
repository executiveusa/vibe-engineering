# Canonical Project Start Prompt

Use this prompt with Claude Code, Codex, Cursor, OpenCode, ChatGPT, Gemini, Orca, or any capable repository agent.

The purpose is simple: **the project must consult the current upstream Vibe Engineering House Skill before it starts material work.** Do not rely on a copied prompt, old chat memory, or an older local skill when upstream is reachable.

## Copy/paste prompt

```text
USE VIBE ENGINEERING — UPSTREAM FIRST.

Canonical upstream repository:
https://github.com/executiveusa/vibe-engineering

Canonical House Skill:
https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md

Your first job is to establish the current Vibe Engineering contract before changing this repository.

1. Inspect this repository before editing anything. Determine whether it is greenfield or brownfield, identify the current branch/state, existing project law, architecture, tests, deployment configuration, open work, and rollback points.

2. Retrieve the current upstream Vibe Engineering House Skill from executiveusa/vibe-engineering/main. If shell access is available, install or refresh the portable filesystem contract with:

   npx --yes --package=github:executiveusa/vibe-engineering vibe install .

   Do not use --force unless existing owner-controlled files have been inspected and an intentional merge plan exists.

3. Read the local Vibe entry files in this order when present:

   AGENTS.md → ICMR.yaml → CONTEXT.md → .vibe/skills/vibe-engineering/SKILL.md

   If the local House Skill differs from current upstream, treat upstream as the method source and merge changes into the project deliberately. Preserve project-specific facts, owner decisions, credentials boundaries, product requirements, and evidence. Never overwrite project law blindly.

4. Follow the canonical lifecycle:

   INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE

   Vibe Engineering is governance.
   ICM is durable interpretable context and state.
   The artifact lifecycle is the movement of work.
   Orchestrators route work.
   Workers implement bounded slices.

5. Before substantial work, establish and persist:

   MODE
   OUTCOME
   TARGET
   CONSTRAINTS
   PROOF
   COMMERCIAL VALUE
   OWNER / AUTHORITY
   ROLLBACK

   Separate verified facts from assumptions. Resolve material unknowns through inspection whenever possible instead of asking the owner to repeat information already available in the repository.

6. Work one independently verifiable slice at a time. Inspect before change. Reuse before inventing. Keep changes bounded. Keep ICM artifacts current. Use project-local formatter and lint rules. Prettier or formatting checks are formatting proof only; never confuse them with behavioral or production proof.

7. PROOF must support the actual claims being made. Run relevant deterministic tests/build/lint/type checks plus runtime, browser, accessibility, security, permissions, integration, data, mobile, or deployment checks when the claim requires them. BUILT is not VERIFIED. CI PASS is not customer value. DEPLOYED is not production proof.

8. COUNCIL review must be independent of the builder for material work. Review value, architecture, failure modes, security/privacy, accessibility/taste, sovereignty/ownership, maintainability, and evidence.

9. JUDGE is release authority only. The verdict is SHIP or HOLD. Judge must not rewrite the work it judges. Builders cannot approve themselves.

10. SHIP only the exact proven revision. Verify the live environment after release and preserve a tested rollback path. Do not call a preview, scaffold, build artifact, or passing formatter production-ready.

11. OPERATE by monitoring real outcomes and incidents. When change is needed, create a new INTENT and move through the lifecycle again rather than patching production outside the method.

12. Keep documentation synchronized with reality. Update README, architecture docs, install/run instructions, ICM context, proof receipts, and deployment references when behavior or architecture changes. Remove or clearly mark stale instructions instead of leaving contradictory documentation.

13. For conflicts between this project's local copy and upstream Vibe Engineering:
   - upstream owns the general House method;
   - this repository owns project-specific facts and owner decisions;
   - merge by intent, not by blind replacement;
   - record any intentional deviation explicitly.

14. End material work with:

   DECISION
   CHANGES
   PROOF
   STATUS
   COMMERCIAL IMPACT
   RISKS
   ROLLBACK
   NEXT
   HUMAN APPROVAL

Start now by inspecting the repository and retrieving the current upstream House Skill. Do not begin implementation until INTENT, constraints, proof requirements, and rollback are clear enough for the first bounded slice.
```

## Short invocation

Once the repository has Vibe installed, the short form is:

```text
Use Vibe Engineering. Refresh from the canonical upstream first, continue from current ICM state, and take this through the next valid gate without skipping proof.
```

## Upstream rule

The canonical method lives in `executiveusa/vibe-engineering`. Local copies make the method portable, but they are not permission to silently fork the method. When upstream is reachable, inspect it before material work and reconcile intentionally.
