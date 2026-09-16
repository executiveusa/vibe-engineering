# MISSION v2 — Mobile-First Site Optimization, Motion, and Proof

## Purpose

Use this workflow for any existing website, web app, portfolio, campaign, or dashboard that must become genuinely usable, credible, and polished across phones, tablets, and desktop.

This is a **brownfield** workflow by default. Preserve working architecture, owner control, approved visual direction, and verified content. Improve the smallest surface that solves the observed problem. Do not confuse a successful build, a screenshot, a preview, or a deployment request with verified production.

The standard is not visual imitation of Apple, Collins, Linear, or any other brand. The standard is precise behavior: native input, clear hierarchy, calm composition, reliable state, accessible controls, and evidence.

---

## Operating Contract

Before editing, write these facts in the work log:

| Field | Required decision |
| --- | --- |
| Mode | Brownfield unless the repository is empty or the user explicitly requests a new build. |
| Outcome | Measurable visitor or operator outcome, such as a completed inquiry, readable portfolio, completed booking, or usable control flow. |
| Target | Real audience, route, device context, and primary task. |
| Constraints | What cannot change: approved copy, imagery, hero, gallery, desktop composition, integration, brand direction, or hosting. |
| Content policy | `LOCKED`, `REDUCE_WITH_APPROVAL`, or `REWRITE_WITH_APPROVAL`. Never infer this. |
| Proof | Exact routes, viewports, interactions, and runtime evidence required before release. |
| Ownership | Repository, branch, hosting project, domain, data destination, and rollback location. |
| Commercial value | Revenue, booking conversion, retention, operating time saved, or validated learning. |

If any owner-controlled destination is unknown—form delivery, social handle, email, CRM, domain, analytics, or payment path—do not invent it. Mark it `UNVERIFIED` and keep the current working destination intact.

---

## Non-Negotiable Laws

1. Inspect before changing.
2. Keep native scroll native. Never intercept finger scrolling to simulate momentum on mobile.
3. Content is visible and readable before JavaScript, animation, fonts, or images finish loading.
4. Do not hide a layout defect with global overflow clipping, a giant overlay, blank screen, or arbitrary timeout.
5. A control is not complete until its real route, state transition, destination, and error behavior are verified.
6. Use exact production evidence. A local build does not prove CDN, forms, routes, or deployed assets.
7. Add a dependency only when native CSS, the existing stack, or a declared dependency cannot safely satisfy the requirement.
8. Animation is information, not decoration. If a movement communicates nothing, remove it.
9. Never fabricate client names, testimonials, social accounts, contact details, counts, availability, outcomes, status, or success.
10. Never expose credentials, browser tokens, API keys, or private URLs in source or reports.
11. Keep every release reversible: a known prior deployment, commit, or immutable version must exist before publishing.
12. Builders provide evidence; an independent review gate decides whether the result is ready.

---

## Phase 0 — Baseline and System Map

Read only the files needed to establish the current system:

- package manager, framework, scripts, lockfile, and existing dependencies;
- route map and component ownership;
- styling system, design tokens, media queries, fonts, image pipeline, and animation primitives;
- forms, mail/CRM/API routes, validation, error states, and success states;
- external links: telephone, mail, WhatsApp, Instagram, social accounts, booking, payments, maps, and downloads;
- auth, data sources, server routes, analytics, service worker/PWA behavior when present;
- deployment provider, build output, CDN/cache behavior, production URL, preview URL, and rollback path;
- existing tests, CI, screenshots, open branches/PRs, and unresolved incidents.

Produce a compact architecture map:

`SURFACE → COMPONENT → HANDLER → ROUTE/SERVICE → DESTINATION → VERIFIED STATE`

Classify each path: `VERIFIED`, `PARTIAL`, `BROKEN`, `DEAD`, `FAKE`, `UNSAFE`, or `UNKNOWN`.

Do not polish a site with a broken conversion path. Fix or honestly reroute the primary action first.

---

## Phase 1 — Live Baseline

Inspect the actual preview or production site before editing. If access is restricted, report the limitation; do not bypass authentication or pretend visual QA happened.

Capture the baseline at these viewports:

| Class | Viewport |
| --- | --- |
| Small Android | 320 × 568 and 360 × 800 |
| Compact iPhone | 375 × 812 |
| Standard iPhone | 390 × 844 |
| Wide phone | 414 × 896 and 430 × 932 |
| Tablet portrait | 768 × 1024 |
| Tablet landscape | 1024 × 768 |
| Desktop | 1440 × 900 |

Use landscape phone testing when a route contains a viewer, media player, fixed control, image dialog, drawer, or long form.

For every key route, record:

- rendered page title and route identity;
- initial viewport, mid-page, footer, and any full-screen interaction;
- `scrollWidth`, `clientWidth`, viewport dimensions, and horizontal overflow source;
- browser console errors, failed assets, hydration errors, and runtime exceptions;
- cumulative visual failures: clipped text, overlap, 1-word orphans, inaccessible contrast, unstable images, bad crop, unbalanced grids, hidden focus, and blocked controls;
- the actual tap path for every primary action.

Never rely on a headless screenshot alone. Inspect DOM state, console, link targets, and at least one real interaction per important surface.

---

## Phase 2 — Mobile Composition and Typography

Mobile is an intentional composition, not a squeezed desktop.

### Layout

- Preserve information; change its presentation when needed.
- Use `minmax(0, 1fr)` in grids so long content can shrink instead of forcing overflow.
- Audit each image/card/list wall for mathematically balanced rows. A 6-item logo set should be a 3 × 2 desktop grid and a 2 × 3 mobile grid only if its content and reading order support that structure.
- Do not force every grid into two columns. Use one column for editorial images, dense labels, readable cards, or any content that would become too narrow.
- Keep only one dominant focal point per viewport. Whitespace is structure, not an empty area to fill.
- Use `svh`/`dvh` carefully. Never make a mobile hero taller merely to mimic desktop drama. Give a sticky hero only enough additional scroll runway for its framing motion to be perceptible.

### Typography

- Main body text is normally at least 16px with 1.45–1.65 line height.
- Labels used regularly are normally at least 14px; reserve 12–13px for true metadata.
- Treat `clamp()` as a tested range, not an automatic solution. Inspect both endpoints and all specified viewports.
- Do not use `white-space: nowrap` to force a wordmark or heading unless it is proven to fit at the smallest supported width; otherwise use a deliberate line break, smaller mobile range, or alternate composition.
- Remove inline typography styles that block responsive overrides unless they are a documented invariant.
- Check glyph collision using the actual font, weight, tracking, line height, and user text scaling—not only the nominal CSS size.

### Images and Frames

- Preserve supplied photography. Improve framing with `object-position`, aspect ratio, safe masks, and non-destructive transforms; never distort or regenerate a client image unless asked.
- Reserve image dimensions/aspect ratio to prevent layout shift.
- Use responsive formats and lazy loading for below-fold media. Keep the immediate hero eager only when it is above the fold.
- Optimize a derivative asset only after visual comparison at the rendered size. Retain originals unless the user authorizes removal.
- Test portrait, landscape, low-contrast, and face crops independently. A single `object-position` should not be assumed correct for all device widths.

---

## Phase 3 — Touch, Navigation, and Forms

### Touch contract

- Every essential control must expose a usable hit area of at least 44 × 44 CSS pixels; 48–52px is preferred for isolated mobile actions.
- Small visible icons may have a larger semantic button wrapper. Never make a decorative glyph itself the only tap target.
- Use `touch-action: manipulation` on genuine tap controls when it does not conflict with a required gesture.
- Do not rely on hover for navigation, affordance, labels, or essential feedback.
- On touch, a control may compress by about 1.5–3.5% with a fast recovery. Use `transform`, not layout changes.
- Keep focus visible for keyboard users; active styling cannot replace focus styling.

### Mobile navigation

- Choose navigation behavior based on the existing product and task. A short in-page menu may be more usable than a new bottom sheet.
- Use a bottom sheet only when it improves reachability or supports a real list of secondary options. It must support Escape, focus management, visible close affordance, scroll containment, safe-area padding, and a predictable return to the trigger.
- Menus must not hide the user’s location or strand them. Every route needs a clear way home and an understandable current-page identity.
- A mobile panel must be tested with browser zoom, long labels, device safe areas, keyboard focus, and reduced motion.

### Forms and conversion

- Preserve visible labels; placeholders never count as labels.
- On mobile, inputs, selects, and textareas need a computed font size of at least 16px to prevent Safari auto-zoom.
- Use correct `type`, `inputMode`, `autocomplete`, validation, error proximity, and keyboard traversal.
- Test the keyboard with the final submit control visible or recoverable.
- A success message must follow actual server or provider acknowledgment. Do not show a false toast, fake success, or local-only completion for a lead that was not delivered.
- Verify every external link with its protocol: `tel:`, `mailto:`, `https://wa.me/`, verified social URL, or known booking destination.

---

## Phase 4 — Motion and Scroll Framing

### Motion decision gate

For every proposed movement, answer:

1. What does it help the user notice, understand, or operate?
2. Is it safe if JavaScript is delayed, disabled, interrupted, or reduced?
3. Can CSS and the existing dependency set accomplish it?
4. Does it preserve native touch scroll, browser chrome behavior, and normal keyboard navigation?
5. Does it stay inside the animation budget?

If any answer is no, do not add it.

### Safe motion rules

- Never scrolljack phones: no Lenis, Locomotive, virtual scroll, touch-wheel interception, or synthetic momentum unless the product explicitly requires it and the user approved the tradeoff.
- Scroll-linked framing happens inside a bounded sticky stage. The page itself uses the browser’s normal scroll physics.
- Prefer `transform` and `opacity`. Avoid scroll-linked `filter`, `backdrop-filter`, `clip-path`, large box-shadow, `height`, `width`, `top`, `left`, `margin`, and `padding` animation.
- Keep base content visible. Do not set important content to `opacity: 0`, translated off-screen, masked away, or dependent on an intersection event for basic readability.
- Use a restrained entrance range: typically 8–20px translation, 180–500ms duration, once per element. Do not stack delayed reveals that make visitors wait for the page.
- Use critically damped motion for normal UI. No decorative bounce on buttons, cards, headings, or navigation.
- Use `prefers-reduced-motion` to eliminate decorative motion and preserve final readable framing. Reduced motion is a separately tested state, not an afterthought.
- Animate only the leaf components that need it. Avoid a global page state, root data attribute, or full-viewport overlay to orchestrate a hero intro.

### Image-safe cinematic framing

- Use a base image as the source of truth.
- A masked duplicate may establish a foreground plane only when it stays registered to the base asset; test for seams at every viewport and during scroll.
- Move planes at restrained relative speeds. If foreground registration risks seams, move it with the base and create depth using the frame, wash, typography, or sky plane instead.
- Set a short mobile scroll runway—usually 20–35svh beyond the sticky stage—only if it makes the framing legible. Do not create a 200vh text reveal.
- Keep the image subject clear of headline, CTA, browser safe areas, and progress UI on every target viewport.

---

## Phase 5 — Accessibility, Performance, and Delivery Resilience

### Accessibility

Audit and test:

- logical heading order and landmarks;
- skip link; keyboard order; visible focus; Escape behavior; dialog focus entry/trap/return;
- screen-reader names and state; `aria-expanded`; `aria-controls`; live status where justified;
- contrast, text resizing to 200%, orientation, touch targets, safe areas, and color-independent state;
- reduced motion and reduced transparency when the design relies on translucent layers.

### Performance

Measure or inspect:

- image payload and dimensions; font loading; render-blocking imports; client bundle cost; hydration cost; long tasks; layout shift; unnecessary rerenders; and animation compositing;
- only declare a performance improvement after before/after evidence or a clearly measured asset reduction;
- add `will-change` only to short-lived, known animated surfaces; do not scatter it across the page;
- respect battery and mobile GPU limits. A site that looks premium only on a developer machine fails this mission.

### Deployment resilience

- Confirm the production host supports the repository’s framework and build output. A successful build that produces an incompatible runtime is not a deployment.
- Verify that production serves the exact tested revision and route output—not only that the provider reported `READY`.
- Check the root route and at least one interior route for current HTML, CSS, scripts, images, and no chunk/hydration failures.
- Do not add speculative reverse rewrites, forced dynamic rendering, or self-reload scripts to paper over cache problems. First identify the actual cache policy and provider behavior. Use correct HTML revalidation/cache headers, immutable hashed assets, provider purge, or a documented hosting change.
- Verify the configured domain and preview domain separately when both matter. A working preview does not prove the custom domain.

---

## Phase 6 — Execution Slices

Work in small reversible slices. Do not mix structural wiring repair, a visual redesign, and new animation in one unreviewable patch.

1. **Truth slice:** repair fake, dead, unsafe, or unknown primary actions.
2. **Mobile structure slice:** fix overflow, composition, hierarchy, typography, safe areas, images, and navigation without changing approved copy.
3. **Interaction slice:** touch targets, focus, dialogs, menus, form feedback, and real link destinations.
4. **Motion slice:** add or tune bounded, native-scroll-safe framing only after the static mobile composition passes.
5. **Performance slice:** responsive media, font and bundle costs, image derivatives, and layout stability.
6. **Release slice:** build, browser tests, visual evidence, independent review, versioned publish, production smoke test, and rollback record.

Each slice records:

`DECISION · CHANGE · PROOF · RISK · ROLLBACK · NEXT`

---

## Required Verification Matrix

### Static and route checks

- Install/build/typecheck/lint using the repository’s existing scripts.
- Test every major route and each route containing a primary CTA, dialog, gallery, drawer, viewer, form, or external contact link.
- Confirm there are no new console errors, failed assets, hydration errors, or unhandled promise rejections.

### Browser checks per viewport

- `document.documentElement.scrollWidth <= window.innerWidth`.
- No clipped text, accidental horizontal scroll, overlapping controls, overflowed image frames, or labels concealed by a fixed header.
- Open/close mobile navigation, any drawer, every gallery dialog, and all menus.
- Test keyboard traversal, Escape, focus restoration, and screen-reader names where supported.
- Trigger form validation without transmitting personal information; verify error placement and correct virtual keyboard configuration. Only submit live data when the user explicitly asks and approves the data/destination.
- Verify social/contact URLs against known official destinations. Mark unknown accounts `UNVERIFIED`.
- Test native scroll through sticky/motion sections, rapid reversal, interrupted interaction, reduced motion, and return from an external link.

### Visual evidence

Capture baseline and final proof for:

- hero/top navigation;
- main mobile content composition;
- every altered grid or image frame;
- open mobile menu/drawer;
- gallery/lightbox or other modal;
- form and footer/contact routes;
- tablet and desktop regression view.

Use screenshots as supporting evidence, not as the only test.

---

## Independent Review Gate

Score each dimension 0–10:

| Dimension | Question |
| --- | --- |
| Value | Does the change make the visitor’s primary task easier? |
| Clarity | Can a distracted person orient and act without interpretation? |
| Craft | Are spacing, typography, images, and framing deliberate across devices? |
| Interaction | Are touch, keyboard, dialog, and feedback behaviors reliable? |
| Accessibility | Can people use the result with assistive settings and reduced motion? |
| Performance | Did the site remain fast enough on a normal phone? |
| Truth | Do visible claims, status, and conversions have verified sources? |
| Sovereignty | Does the owner retain code, hosting, domain, destinations, and rollback? |
| Release | Is the exact deployed revision tested on its actual host? |

`PRODUCTION VERIFIED` requires an independent score of at least 8.5/10, no unresolved P0/P1 issue, and public/runtime evidence.

---

## Final Report Format

Return only evidence-backed claims in this structure:

1. **Decision** — `NOT READY`, `READY FOR PREVIEW`, `PREVIEW VERIFIED`, or `PRODUCTION VERIFIED`.
2. **Scope and constraints** — including content policy and what was deliberately preserved.
3. **Before → after matrix** — component, issue, root cause, exact fix, and device impact.
4. **Architecture and delivery map** — primary controls and destinations classified by truth state.
5. **Motion ledger** — each motion, purpose, property animated, reduced-motion behavior, and why it is safe.
6. **Mobile and Krug review** — orientation, affordance, scanning, hierarchy, forms, and cognitive-load findings.
7. **Accessibility and performance results** — measured evidence and remaining gaps.
8. **Browser proof** — routes, devices, interactions, console state, and screenshots.
9. **Risks** — explicitly separate unresolved facts from assumptions.
10. **Rollback** — precise prior version/commit/deployment.
11. **Next** — one highest-value verified action, not an unbounded wish list.

## Completion Gate

Do not mark a site complete until all applicable statements are true:

- [ ] baseline, ownership, architecture, and delivery path documented;
- [ ] content policy followed exactly;
- [ ] primary conversion/action path is real and tested;
- [ ] all essential controls are discoverable, keyboard reachable, and tap-safe;
- [ ] no unwanted horizontal overflow at every specified viewport;
- [ ] mobile composition, images, typography, and safe areas pass visual QA;
- [ ] motion uses native scroll and has a content-first/reduced-motion fallback;
- [ ] build and relevant automated checks pass;
- [ ] live browser checks show no known application/asset/hydration failure;
- [ ] actual deployed revision and custom domain/preview behavior are verified as required;
- [ ] rollback target exists;
- [ ] independent review passes.

