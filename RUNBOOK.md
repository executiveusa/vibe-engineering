# Runbook

## Local application

```bash
npm ci
npm run check
npm run dev
```

## Production build

```bash
npm run build
npm audit --audit-level=high
```

## Sandcastle prerequisites

- Node.js 22+
- Git and authenticated GitHub CLI
- Docker Desktop or Docker Engine
- Codex CLI authentication available to the sandbox without committing credentials

## Initialize dependencies

Issue #4 remains `HOLD` until these commands are run in a trusted local environment and their exact output is captured:

```bash
npm install --save-dev @ai-hero/sandcastle@0.6.4 tsx
npx @ai-hero/sandcastle docker build-image --image-name sandcastle:vibe-engineering
```

Commit the resulting `package.json` and lockfile changes on the issue branch only after review.

## Run one approved ticket

```bash
cp .sandcastle/.env.example .sandcastle/.env
# Edit only the non-secret task fields. Configure Codex authentication outside Git.
VIBE_TASK_NUMBER=4 VIBE_BASELINE_BRANCH=main npx tsx .sandcastle/main.ts
```

The runner must create a `sandcastle/issue-<number>-<timestamp>` branch. It must not modify `main`, merge, deploy, or close the issue.

## Verification

After the run:

```bash
git status --short
git branch --list 'sandcastle/*'
npm run check
npm audit --audit-level=high
git log --oneline main..HEAD
git diff --check main...HEAD
```

Confirm implementer and reviewer evidence exists under `docs/evidence/`.

## Rollback

Before merge, delete the isolated branch and worktree if the run fails. After merge, revert the specific pull request merge commit. No database migration is involved.

## Incident response

Stop the run immediately if secrets appear, the agent targets `main`, scope expands beyond the issue, verification cannot run, or Docker isolation fails. Preserve logs without secret values and leave the issue open with a blocker report.
