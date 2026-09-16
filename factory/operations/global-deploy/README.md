# Global Deploy Controller contract

This is the missing thin release layer for one-click deployment of StarNet, agents and projects to a reviewed target. It is not another agent framework and does not install anything yet.

Source bundle verified at SHA-256 `0cc059f9b192c56560b933987ffc4af8444b142ee6a0b83fa753713f6358b8d6`. Technical influences are pinned in `factory/factory-lock.json`.

## ACFS boundary

`Dicklesworthstone/agentic_coding_flywheel_setup` bootstraps an Ubuntu coding VPS. It does not deploy a versioned StarNet release across providers. A bootstrap script is not a global deploy controller, and `curl | bash` is not the production one-click interface.

## Release flow

```text
reviewed exact candidate
-> compile PortableReleaseEnvelope
-> preview target plan and unresolved money/region/domain/data decisions
-> host readiness check
-> resolve vault references at runtime
-> backup
-> pull signed artifacts by digest
-> ordered migrations
-> canary or blue/green deploy
-> health checks + real synthetic mission
-> promote or automatic rollback
-> exact DeploymentReceipt
```

## Required proof before enabling a target

- one release ID binds exact source commits, image/artifact digests, SBOM and provenance;
- target facts cover OS, amd64/arm64, CPU, RAM, reserved disk, container runtime, network, privilege and clock;
- secrets are references, never copied into images, logs or receipts;
- data contract names volumes, backup, migration order, compatibility and restore path;
- canary/blue-green rollout, dependency ordering and rollback trigger are explicit;
- every service reaches readiness and a representative synthetic mission finishes;
- central health evidence, disk pressure, process triage and provider/project cost limits are recorded;
- update, rollback, restore and host-loss replacement are tested in disposable targets;
- a failed deploy rolls back or returns BLOCKED. It never claims partial success as a global deployment.

Initial executable adapter should be the existing Coolify/Docker Compose path. Other providers/architectures are added only after conformance proof, not from generic claims.

## Fleet repository sync

Repo sync is plan then apply. Every repo is pinned. Dirty trees refuse mutation. Divergence/conflicts become explicit state. JSON results and exit semantics are required. A sync receipt is not deployment proof.

## Runtime safety and cost

The included YAML is an evaluation candidate from the supplied extraction, not user authority. Before executable adoption, reconcile its thresholds and destructive-action language with owner-approved policy and each target's capacity. The durable requirements are: preserve secrets/databases/backups/receipts, measure disk reserve before builds, classify processes before changes, deny unapproved destructive actions, and record provider/account/agent/project usage against explicit limits.
