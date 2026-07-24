# HARNESS SPECIFICATION & BASELINE LAWS

The **Verification Harness** provides mechanical truth for the A2A Autonomous Software Factory.

## Baseline Law

Before any code modification:
1. Capture current `main` git SHA.
2. Run existing test suite and record pass/fail baseline.
3. Record API endpoints or UI screenshots for visual baseline.

## Harness Layers

- Layer 1: Format & Linting (`npm run check`)
- Layer 2: Typecheck (`tsc --noEmit` or equivalent)
- Layer 3: Unit & Integration Tests (`npm test`)
- Layer 4: Build Verification (`npm run build`)
- Layer 5: Runtime & Persistence Smoke Verification
