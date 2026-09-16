# HKUDS no-bloat factory contracts

These are lightweight evaluation schemas, not installed runtimes. They add proof requirements without adding a daemon, model, database, GUI, GPU, ADB server, or paid API.

## Pinned influences

- CLI-Anything `810c18b0d1ab9b234bc996c9fd999318523a3ef0`, Apache-2.0.
- MGP `54ce6c00e3d0aa731ecbe17e74407cbbb5a96f10`, MIT.
- HELIX `b5adffa6065931b4d8833f6576188ce93006217f`, MIT.
- OpenPhone `27af671465a99734c292d8bcddee18c4ff3ec6ce`, MIT.

The bundle was supplied after an external HKUDS survey and transferred to this build with SHA-256 `fd22e373bf6504354e957db7a119f1acf35243b07d52f8b91acb03ee2e01e675`.

## Gates

### Factory CLI gate

Use for software the factory claims is agent-native. PASS requires discoverable help, machine-readable output, unit and subprocess tests, a callable skill contract, and an end-to-end run against the actual software. A wrapper around a mock does not satisfy `real_software_e2e`.

### Governed memory envelope

Use whenever a project creates or transforms remembered context. Recall, disclosure and action are separate authority booleans. `may_recall: true` never implies permission to disclose or act. Source, sensitivity and retention travel with the memory. This schema records authority supplied by an owning system; it does not create or upgrade permission.

### Exact-candidate rollout receipt

Use for harness/model evaluations and learned behavior. Bind the candidate, harness recipe, task set, model, traces and independent Judge evidence by revision. Training data or a prior rollout cannot silently authorize a later candidate.

### Mobile-task receipt

Use for Android/mobile control through Foundry/Cua, Orgo, or an explicitly admitted local model evaluation. Record every action with evidence, completion, partial accuracy and repeated-action ratio. External side effects require separately grounded owner approval. This receipt records the check; it does not grant approval.

OpenPhone is a mobile GUI-control research model, not a SIP/call/voice system. This extraction does not add it to any live phone path and does not adopt routing text from the supplied archive as global authority. Any future runtime/model trial needs its own architecture, privacy, resource and authorization decision.

## Failure behavior

Missing, invalid or stale exact-candidate receipts are HOLD when a project declares the corresponding gate required. A fresh reviewer/Judge remains separate from the builder. These contracts supplement Open Code Review; they do not replace it.
