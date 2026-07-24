# OPERATING CONTRACT — MERGE & RELEASE POLICY

## Core Principle

> Merge is not public release.

- **Merge:** Integrating a verified PR into the default branch (`main`) after passing Judge and Architect gates.
- **Public Release:** Promoting code to live customer-facing environments.

## Autonomy Tiers

- **LOW Risk:** Fully autonomous merge & deploy.
- **MEDIUM Risk:** Autonomous merge & staging deploy; automated canary verification.
- **HIGH Risk:** Autonomous design, build, test, and PR preparation. **HUMAN GATE REQUIRED** before production deployment or irreversible schema/data actions.
