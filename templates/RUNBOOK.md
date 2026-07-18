# Runbook

## Ownership

- Operational owner:
- Technical owner:
- Escalation contact:

## Local setup

```bash
# fill in exact commands
```

## Required environment variables

List variable names and secret-manager locations only. Never include secret values.

## Standard commands

| Action | Command |
|---|---|
| Install | |
| Develop | |
| Lint | |
| Typecheck | |
| Test | |
| Build | |
| Verify | |
| Preview deploy | |
| Production deploy | |

## Deployment

Document branch, provider, project, build settings, migrations, approvals, and production verification steps.

## Production smoke test

- [ ] URL reachable
- [ ] Correct release visible
- [ ] Critical user journey works
- [ ] Forms/integrations work
- [ ] Mobile behavior checked
- [ ] No critical console errors
- [ ] No critical network errors

## Monitoring

List logs, uptime checks, alerts, analytics, and ownership.

## Backup and recovery

Document backup locations, restore procedure, data-loss window, and last tested date.

## Rollback

Record the exact previous verified release and rollback procedure.

## Incident procedure

1. Stop further changes.
2. Preserve evidence and logs.
3. Assess user and data impact.
4. Roll back when safer than repair-in-place.
5. Notify required humans.
6. Record the incident and prevention action.
