# Voice / Call Proof Standard

Final proof contract for any software that speaks, listens, places or receives calls, records audio, produces transcripts, or hands a live caller between an agent and a person.

## Applicability

Every software candidate writes `docs/evidence/voice-call-proof.json` for the exact SHA. A non-voice product may return `NOT_APPLICABLE` only with `applicability: NON_VOICE`, a specific reason, and a reviewer identity. Any call, speech, microphone, telephony, recording or transcript behavior makes the full gate applicable.

## Consent

- Identify the service/agent plainly at the start where required by the product and law.
- Disclose recording/transcription before capture; do not treat continued silence as affirmative consent.
- Record the consent event and test refusal/revocation during a call.
- Consent to speak is separate from consent to record, transcribe, store or share.

## Recording and transcripts

Declare whether audio/transcripts exist, where they travel, who can access them, retention, redaction, export/deletion and incident handling. Do not send private calls or transcripts to a provider whose data policy is not approved for that class. A product that does not record uses `NOT_RECORDED` consistently and proves no artifact is retained.

## Conversation behavior

- Test turn detection, silence, overlap and end-of-turn behavior with real audio.
- Measure p50 and p95 end-to-end response latency against a declared budget. Averages alone do not pass.
- Test barge-in/interruption: playback stops promptly, the interruption is understood, and partial agent speech does not trigger an unapproved action.
- Test disconnect, reconnect, voicemail, background noise, weak network and provider timeout where applicable.

## Voice QA

Test intelligibility, pronunciation of names/numbers/addresses, identity and approved tone, volume/clipping, noise/device matrix, and clear disclosure when speech recognition or synthesis is uncertain. Synthetic voice must not impersonate a real person without explicit rights and approval.

## Escalation and control

Prove human handoff, failed-transfer recovery, emergency/safety boundary, caller hangup/stop control and a clear path when the agent cannot complete the task. The call agent cannot widen authority or treat conversation sentiment as approval for money, publishing, account changes or other consequential action.

## Pass

`PASS` requires exact-candidate evidence for consent, recording/transcript policy, turn-taking, measured latency, interruption, voice QA and escalation, with an independent reviewer. Missing evidence, an unsafe provider, failed consent/revocation, false transcription certainty or a broken handoff is HOLD.
