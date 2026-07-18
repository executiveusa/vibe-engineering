# Security

## Security owner

- Name/role:
- Reporting channel:

## Scope

List applications, APIs, databases, infrastructure, integrations, and data covered by this policy.

## Data classification

| Data | Sensitivity | Location | Retention | Deletion/export path |
|---|---|---|---|---|
| | | | | |

## Authentication and authorization

Document identity providers, roles, permission boundaries, service accounts, and privileged actions.

## Secrets policy

- Never commit or paste secret values into code, chat, documentation, screenshots, or logs.
- Store secrets in the approved secret manager.
- Apply least privilege and rotate exposed credentials immediately.
- Document names and locations, never values.

## Threats and controls

| Threat | Impact | Control | Evidence |
|---|---|---|---|
| | | | |

## High-risk operations

Require explicit human approval for destructive production actions, irreversible migrations, sensitive permission changes, payments, personal data, and tenant-boundary changes.

## Dependency and supply-chain policy

Document dependency review, lockfiles, vulnerability scanning, update process, and license checks.

## Incident response

1. Contain the issue.
2. Preserve evidence.
3. Revoke or rotate affected credentials.
4. Assess data and user impact.
5. Recover from a verified state.
6. Notify required parties.
7. Record corrective actions.

## Release security gate

A release is `HOLD` when critical secrets, authorization, tenant isolation, privacy, data-loss, or ownership risks remain unresolved.
