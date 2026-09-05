# {{PROJECT_NAME}} agent policy

## Identity

This is a Vibe Engineering project for {{PROJECT_AUDIENCE}} in the domain of {{PROJECT_DOMAIN}}.

## Canonical House source

Before material work, use the current Vibe Engineering House contract when upstream is reachable:

- Repository: `https://github.com/executiveusa/vibe-engineering`
- House Skill: `https://raw.githubusercontent.com/executiveusa/vibe-engineering/main/skills/vibe-engineering/SKILL.md`
- Local global standard: `shared/VIBE_HOUSE_STANDARD.md`

Upstream owns the general House method. This project owns its project-specific facts and owner decisions. Reconcile by intent; never overwrite local project law blindly.

Canonical lifecycle:

`INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Compatible physical route:

`00_intake → 01_vision → 02_blueprint → 03_build → 04_verify → 05_council → 06_judge → 07_ship → 08_improve`

## Non-negotiable laws

- Verify It Before Everything.
- The filesystem is the source of truth. Agents are adapters, not architecture.
- Any capable agent must be able to enter through `AGENTS.md → ICMR.yaml → CONTEXT.md`.
- Durable rules and decisions belong in files, not chat memory or vendor-specific hidden prompts.
- Do not add an orchestrator, persona, or agent swarm when a file, skill, stage contract, or adapter is enough.
- Detect and compile ICMR before substantial work.
- Inspect before changing.
- Reuse before adding.
- Specify before building.
- Build one verifiable slice at a time.
- Preserve owner control of code, data, accounts, credentials, infrastructure, and documentation.
- Never expose secrets.
- Never confuse a build, CI result, formatter pass, deployment request, or preview with verified production.
- The builder cannot approve its own work.
- Judge returns only `SHIP` or `HOLD`.
- Use the Vibe Engineering mandatory engineering workflow for software changes.
- Keep README, architecture, method, context, proof, and deployment references synchronized when reality changes.

**No agent soup. One walkable system. Any capable agent can use it.**

## Mandatory Step 0 — ICMR

Read `ICMR.yaml` first. It is the portable runtime contract for the detected work topology, role boundaries, routing, context, proof, sovereignty, and rollback.

The required order is:

`DETECT → ICMR → INTENT → SPEC → PLAN → BUILD → PROOF → COUNCIL → JUDGE → SHIP → OPERATE`

Do not enter `stages/00_intake/` for substantial work until `ICMR.yaml` exists and Step 0 validation passes. If evidence shows the project needs a different ICM form, update the detection rather than forcing the default pipeline assumption.

For brownfield work, inventory the current repository/system before proposing restructuring, migration, or deletion.

## Mandatory engineering workflow

The canonical engineering procedure library is:

`https://github.com/executiveusa/pauli-agent-skills-2026`

Vibe Engineering and ICM govern what, why, whether, and authority. Agent Skills governs how software engineering is executed.

Before implementation:

1. confirm Step 0 ICMR is valid;
2. classify the work: `SELL`, `USE`, `MERGE`, `PARK`, or `ARCHIVE`;
3. declare `greenfield` or `brownfield`;
4. state `MODE`, `OUTCOME`, `TARGET`, `CONSTRAINTS`, `PROOF`, `COMMERCIAL VALUE`, `OWNER/AUTHORITY`, and `ROLLBACK`;
5. create or confirm the approved specification;
6. slice into one independently verifiable unit.

Then follow the applicable engineering lifecycle inside the House stages:

`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`

Use applicable skills rather than improvising a parallel process. Multiple skills may compose, but do not add ceremony that does not match the task or risk.

Engineering completion alone cannot authorize release. Council/Judge, ownership, rollback, target-environment proof, and human authority rules still apply.

## ICM navigation

1. Read `ICMR.yaml` for Step 0 routing and authority.
2. Read this file for identity and boundaries.
3. Read `CONTEXT.md` for workspace routing.
4. Open only the current stage `CONTEXT.md`.
5. Load `shared/VIBE_HOUSE_STANDARD.md` and only the other Layer 3 references named by that stage.
6. Read and write Layer 4 artifacts only in stage `output/` folders.

## Audience rule

Explain each consequential decision in plain language first, then give the exact technical term. Lead with the next useful action. Suppress tangents. Keep the current state visible. Use respectful examples and never talk down to the reader.

## Completion rule

Do not claim the project is done until PROOF, Council, Judge, ownership, rollback, and target-environment verification are complete. Human approval remains required for legal, financial, medical, safety, publishing, destructive, and production-release actions.
