# Mobile acceptance

Activate for any user-facing web/app surface unless explicitly out of scope.

Minimum viewports: 320, 360, 375, 390, 414, 430, 768, 1024, 1440 CSS px as relevant.

Must verify:
- no accidental horizontal overflow;
- intentional mobile content order and navigation;
- touch targets roughly 44x44 CSS px for important controls;
- no hover-only essential action;
- keyboard does not hide critical input/action;
- safe-area behavior where installed/PWA/mobile browser surfaces need it;
- readable type and deliberate line breaks;
- imagery preserves focal points; mobile-specific assets/crops when needed;
- loading/error/empty/degraded states;
- reduced motion and keyboard/focus behavior;
- performance on a phone-class viewport/device profile.

Mobile is a separate composition decision, not desktop squeezed smaller.
