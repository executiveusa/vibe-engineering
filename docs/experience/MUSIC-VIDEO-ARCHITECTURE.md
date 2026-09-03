# Vibe Engineering music-video scroll architecture

Status: canonical Client Zero experience rule.

## Governing idea

The homepage is not a slideshow and not a soundtrack pasted onto a website. It is a user-controlled visual story where **scroll controls narrative position** and **the soundtrack controls impact timing**.

V.I.B.E. remains **Verify It Before Everything**.

## Two clocks, one experience

### Scroll clock — meaning

Scroll decides where the visitor is in the story. It controls scene progression, camera/parallax movement, reading order, and the journey from idea → bar → ICM → verification → outputs → open-source CTA.

Never force scroll position to chase the song. A visitor must be able to move at their own speed, stop, reverse, use a keyboard, or browse silently.

### Music clock — rhythm

When the visitor explicitly enables sound, the player reports its current playback time. The beat layer derives beat/downbeat timing from:

- `VITE_VIBE_SOUNDTRACK_BPM`
- `VITE_VIBE_SOUNDTRACK_BEAT_OFFSET`
- `VITE_VIBE_SOUNDTRACK_BEATS_PER_BAR`

Scene-entry impact frames are quantized to the next beat. Downbeats may trigger restrained page flashes and scale/type hits. The music clock decorates meaning; it never hides or delays it.

The current fallback tempo preserves the previous visual pulse only. Release-grade sync requires BPM and first-beat offset to be calibrated against the owner-authorized production track.

## Calibration

Append `?calibrate=1` to the homepage, enable sound, and tap eight steady beats in the hidden production calibration panel. Record the resulting BPM and offset as Vite production environment values, then verify again on mobile and desktop.

The calibration surface is intentionally absent from the normal visitor journey.

## Scene contract

Every scene must have:

1. one idea;
2. one dominant visual composition;
3. one short eyebrow;
4. one memorable headline;
5. one compact explanation;
6. one impact cue;
7. a reduced-motion fallback.

The canonical narrative is:

`AI can make almost anything → set the bar → keep the work walkable with ICM → Verify It Before Everything → apply the same discipline to image/video/SaaS/design → get Vibe free`

## Visual system

Use only the Quiet Signal family unless a later approved design decision replaces it:

- ink `#171512`
- ink soft `#24211d`
- paper `#efe8dc`
- paper strong `#f7f1e7`
- bone `#d7c9b7`
- oxide `#b65f3d` for large visual signal only
- oxide dark `#7c3c27` where normal-size text needs stronger contrast
- smoke `#6d675e`

Acid/neon green is not part of the current public identity.

## Mobile law

Mobile is a composed version of the story, not a desktop crop.

- one-column scene hierarchy;
- touch targets at least 44px;
- controls respect safe-area insets;
- no horizontal overflow at 320px;
- comic visuals scale or recompose rather than disappear;
- soundtrack control stays reachable without covering primary copy;
- reduced motion remains fully readable;
- large type may tighten but must not clip.

If future Scroll World generated media is added, follow the Scroll World rule: use a native 9:16 chain for premium mobile output rather than treating a center crop as final.

## Technology boundary

Reuse the existing React/Vite/GSAP stack. `executiveusa/pauli-scroll-world` supplies the scene/seam/story discipline; it does not become a second application runtime.

ICM remains filesystem-first:

`AGENTS.md → ICMR.yaml → CONTEXT.md → stage/output/proof`

No orchestrator, persona, swarm, or agent hierarchy is added to make the homepage move.

## Release gate

A music-video homepage cannot be called finished until:

- native repository checks pass;
- 320/390/768/mobile layouts show no overflow or blocked controls;
- desktop layout preserves hierarchy;
- silent entry works;
- sound entry works from a user gesture;
- sound can be turned off and back on;
- beat timing reads from actual playback time rather than an independent CSS timer alone;
- reduced-motion mode remains complete;
- exact deployed SHA passes self-test and ICM walk;
- final visual inspection finds no color clash, clipped type, broken scene, or CTA conflict.
