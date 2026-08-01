# Vibe Engineering

**Verify It Before Everything.**

Vibe Engineering is a sovereign AI building method and software factory for non-technical creators who want the speed of AI without surrendering judgment, quality, maintainability, or ownership. It is designed to make complicated technology understandable and useful for urban youth, seniors, nonprofits, and social-purpose teams working across health, science, nature, ecology, learning, and positive technology use cases.

> Power without principles breeds chaos.  
> Freedom without ownership is just another dependency.

## The shift

Vibe coding asks AI to make something.

Vibe Engineering creates the rules, evidence, independent review, and release gates that decide whether the result deserves to ship.

## Product promise

- Stop vibe coding. Start vibe engineering.
- Learn the small set of engineering principles that matter most.
- Lock those principles into an automated, repeatable workflow.
- Verify architecture, behavior, security, accessibility, taste, and ownership before release.
- Give the customer the agreed code, data, accounts, workflows, access, and documentation.
- Charge for human time and compute—not manufactured dependence.

## One-click software factory

Create a complete ICM-based project workspace with one command:

```bash
npm install
npm run factory:new -- --name "Neighborhood Health Guide"
```

This creates a portable workspace at `workspaces/neighborhood-health-guide/` with:

- Layer 0 identity and agent laws;
- Layer 1 context routing;
- Layer 2 contracts for Intake, Vision, Blueprint, Build, Verify, Council, Judge, Ship, and Improve;
- Layer 3 mission, quality, reference, and plain-language standards;
- Layer 4 output folders for visible, editable working artifacts;
- a self-contained factory doctor and GitHub structure gate.

Verify any generated workspace:

```bash
npm run factory:doctor -- ./workspaces/neighborhood-health-guide
```

A passing doctor means the factory structure is complete. It does **not** mean the application is built, secure, deployed, or production-verified.

See [`factory/icm/README.md`](factory/icm/README.md).

## Eight-stage method

1. **Vision** — name the outcome, user, owner, and reason.
2. **Blueprint** — create a small, testable product contract.
3. **Build** — let AI execute inside explicit boundaries.
4. **Verify** — test claims, behavior, security, and evidence.
5. **Council** — challenge the work through independent perspectives.
6. **Judge** — calculate a visible score and release decision.
7. **Ship** — release only understandable, reversible, owned work.
8. **Improve** — learn from reality and strengthen the system.

Generated factory workspaces include a Stage 00 Intake step before this eight-stage method so baseline, proof, constraints, and commercial value are established before Vision.

## Vibe system

- **Vibe Spec** — plain-language product contract
- **Vibe Flow** — repeatable quality gates
- **Vibe Council** — independent adversarial review
- **Vibe Judge** — final `SHIP` or `HOLD` decision
- **Vibe Score** — visible 0–10 quality standard
- **Vibe ICM Factory** — inspectable folder architecture for human and agent collaboration

The recommended release floor is **8.5/10**. Security, reliability, and ownership are hard stops and must each score at least **7/10**.

## Repository map

```text
AGENTS.md                              Layer 0 repository policy
CONTEXT.md                             Layer 1 repository router
factory/icm/                           One-click ICM workspace template
scripts/factory-new.mjs                Safe project scaffold command
scripts/factory-doctor.mjs             Deterministic structure validator
workflows/a2a-software-factory/        Architect, Builder, and Judge workflow
.github/workflows/quality.yml          Automated test, build, and audit gate
docs/MANIFESTO.md                      Moral and ownership principles
docs/METHOD.md                         Full eight-stage workflow
docs/GOVERNANCE.md                     Council, Judge, approvals, rollback
docs/VIBE-SCORE.md                     Scoring rubric and release policy
docs/BRAND.md                          Voice and visual rules
examples/project-spec.md               Human-readable Vibe Spec example
examples/vibe.config.json              Machine-readable release configuration
public/llms.txt                        Agent-readable project summary
public/vibe-engineering-foundation-prompt.md
src/vibe-score.mjs                     Deterministic score engine
tests/vibe-score.test.mjs              Release-logic tests
tests/factory-scaffold.test.mjs        One-click factory safety tests
```

## Run locally

```bash
npm install
npm run check
npm run dev
```

## Production build

```bash
npm run build
```

The generated `dist/` directory can deploy to Vercel or another static host.

## Governance

AI may plan, build, test, document, and propose release decisions. Explicit human approval remains required for consequential legal, financial, medical, safety, publishing, destructive, production, and relationship actions.

See [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md).

## Intellectual roots

Vibe Engineering is an original Pauli Effect / Yappyverse methodology informed by established software engineering, test-driven development, evaluation systems, adversarial review, human-centered design, AI sovereignty, and Interpretable Context Methodology principles.

Direct references:

- [Andrej Karpathy — LLM Council](https://github.com/karpathy/llm-council)
- [Andrej Karpathy — LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- Jake Van Clief and David McDermott — *Interpretable Context Methodology: Folder Structure as Agent Architecture*

These sources are credited as influences. The Vibe Engineering name, eight-stage flow, sovereignty pledge, Vibe Council roles, Vibe Judge, Vibe Score, educational language system, and associated product language are the methodology being developed in this repository.
