# Mobile / operational product doctrine

Source: owner-provided `MISSION.txt`.

Use for brownfield dashboards, control planes, and phone-first operational products.

- Inspect repository, wiring, state ownership, backend authority, tests, CI, and deployment before visual changes.
- Preserve what works. Do not rebuild working backend integrations for aesthetics.
- Runtime truth outranks UI intent. Never fabricate status, success, progress, or data.
- Phone-first: deliberate navigation, ~44px practical touch targets, no hover-only essentials, safe areas, keyboard-aware forms, no accidental horizontal overflow.
- State needs truthful treatments: loading, empty, error, degraded, offline, reconnecting, queued, working, success, blocked.
- Immediate feedback; direct manipulation; interruptible gesture motion; reduced-motion support.
- Use bottom sheets on phones when they preserve context better than desktop modals.
- Voice follows the same governed command path as typed input. TTS is presentation, not authority.
- Partial backend failure degrades the affected surface; it should not falsely block or green-light the whole product.
- Never call production verified without public/runtime evidence from the exact tested revision.
