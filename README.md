# Vibe Engineering

**Verify It Before Everything.**

Vibe Engineering is a sovereign AI building method for non-technical creators who want the speed of AI without surrendering judgment, quality, maintainability, or ownership.

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

## Eight-stage method

1. **Vision** — name the outcome, user, owner, and reason.
2. **Blueprint** — create a small, testable product contract.
3. **Build** — let AI execute inside explicit boundaries.
4. **Verify** — test claims, behavior, security, and evidence.
5. **Council** — challenge the work through independent perspectives.
6. **Judge** — calculate a visible score and release decision.
7. **Ship** — release only understandable, reversible, owned work.
8. **Improve** — learn from reality and strengthen the system.

## Vibe system

- **Vibe Spec** — plain-language product contract
- **Vibe Flow** — repeatable quality gates
- **Vibe Council** — independent adversarial review
- **Vibe Judge** — final `SHIP` or `HOLD` decision
- **Vibe Score** — visible 0–10 quality standard

The recommended release floor is **8.5/10**. Security, reliability, and ownership are hard stops and must each score at least **7/10**.

## Repository map

```text
.github/workflows/quality.yml          Automated test, build, and audit gate
docs/MANIFESTO.md                     Moral and ownership principles
docs/METHOD.md                        Full eight-stage workflow
docs/GOVERNANCE.md                    Council, Judge, approvals, rollback
docs/VIBE-SCORE.md                    Scoring rubric and release policy
docs/BRAND.md                         Voice and visual rules
examples/project-spec.md              Human-readable Vibe Spec example
examples/vibe.config.json             Machine-readable release configuration
public/llms.txt                        Agent-readable project summary
public/vibe-engineering-foundation-prompt.md
src/vibe-score.mjs                    Deterministic score engine
tests/vibe-score.test.mjs             Release-logic tests
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

AI may plan, build, test, document, and propose release decisions. Explicit human approval remains required for consequential legal, financial, safety, publishing, destructive, and relationship actions.

See [`docs/GOVERNANCE.md`](docs/GOVERNANCE.md).

## Intellectual roots

Vibe Engineering is an original Pauli Effect / Yappyverse methodology informed by established software engineering, test-driven development, evaluation systems, adversarial review, human-centered design, and AI-sovereignty principles.

Direct references:

- [Andrej Karpathy — LLM Council](https://github.com/karpathy/llm-council)
- [Andrej Karpathy — LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

These sources are credited as influences. The Vibe Engineering name, eight-stage flow, sovereignty pledge, Vibe Council roles, Vibe Judge, Vibe Score, and associated product language are the methodology being developed in this repository.
