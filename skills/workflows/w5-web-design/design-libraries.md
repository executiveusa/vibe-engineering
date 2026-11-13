# Design library options

Load when: reached from the Web design workflow's library step and a component library fits the brief.

A component library is a starting style, not an identity. Use one per surface at most, then make it the brand's own. Consistency belongs inside a brand, not across unrelated brands (see skills/visual-independence-governor). If the brief already names a stack or design system, or no library here fits, skip this file and design without one.

## How the model uses a library

Two routes, both fine:

1. Prompt route: paste the library's docs URL into the design prompt and name the library, e.g. "Design an analytics dashboard using the HeroUI component library (https://www.heroui.com)." Works without installing anything; good for exploring options.
2. Install route: follow the library's own install docs inside the target repo. Do this only after the option is chosen for the build. Never install all options at once.

Some libraries sell optional MCP servers. They are not required; the prompt route works without them. Do not buy a paid tier or plan without the owner's approval.

## The options

### Coss UI

- Site: https://coss.com/ui/docs. Code: https://github.com/cosscom/ui.
- Stack: React, Base UI, Tailwind CSS. Copy-paste components you own (shadcn-style).
- Cost/license: free. Mixed repo license (per the repo README): the `apps/ui/` and `apps/origin/` directories are MIT; everything else is AGPLv3. Copy only from the MIT-licensed directories.
- Look: clean, modern, dense, production-grade. Built by the Cal.com team and adopted for Cal.com.
- Best for: internal tools, dashboards, professional apps where consistency matters most.

### Align UI

- Site: https://alignui.com. License: https://www.alignui.com/license.
- Stack: React, Tailwind CSS. Strong Figma component coverage.
- Cost/license: Base Components are MIT and free. Pro components sit behind a paid plan (about $300, per the source video, not independently re-verified). Do not use Pro parts without the owner's approval.
- Look: vibrant, colorful, rounded.
- Best for: fun, colorful apps; teams that also design in Figma.

### Daisy UI

- Site: https://daisyui.com.
- Stack: pure-CSS Tailwind plugin. No JS dependency, works with any framework.
- Cost/license: MIT (project repo), free.
- Look: semantic class names (btn, card, toggle); default themes can lean purple/yellow, so set colors deliberately.
- Best for: Tailwind projects that want less markup, any framework, fast prototypes.

### Hero UI

- Site: https://www.heroui.com.
- Stack: React, React Aria, Tailwind CSS v4.
- Cost/license: Apache-2.0 (project repo), free.
- Look: soft, rounded, Apple-like; accessible primitives.
- Best for: consumer-facing apps with a friendly feel.

### Ant Design

- Site: https://ant.design.
- Stack: React core. Separate community ports exist for Angular (NG-ZORRO, MIT) and Vue (ant-design-vue, license not clearly identified - check before use).
- Cost/license: the React core repo is MIT, free.
- Look: enterprise, corporate, Microsoft/Outlook-like.
- Best for: admin consoles, data-dense enterprise tools, big component coverage including charts.

### Motion Primitives

- Site: https://motion-primitives.com/docs.
- Stack: React, Motion (framer-motion successor), Tailwind CSS. Copy-paste animated components.
- Cost/license: MIT (project repo), free.
- Look: animated building blocks (transitions, reveals, micro-interactions), not a full component set.
- Best for: adding motion on top of one of the libraries above, e.g. marketing pages and interactive surfaces.

### Animate UI

- Site: https://animate-ui.com/. Docs: https://animate-ui.com/docs.
- Stack: React, Motion, Tailwind CSS. Works on top of shadcn/ui-style components: it swaps the primitive imports (e.g. radix-ui) for `@animate-ui/react` animated versions with the same API. Your components keep their structure, styles and API.
- Cost/license: free to use inside any app, website or product, including commercial. License is MIT plus Commons Clause (project LICENSE.md): you may not sell or redistribute the components themselves in their original form, alone or in a bundle.
- The owner-supplied command is `npx @animate-ui/cli@latest animate all`. Per the official CLI docs, it changes your components in place: it rewrites primitive imports for every installed component and removes CSS animations that Motion replaces, and it needs Node.js 22.12 or later. Treat it as an edit to the project, not an install: run it on a branch, then read the diff before keeping it. Do not run it on a project whose components should stay as they are.
- Agent route: `npx skills add imskyleen/animate-ui` gives coding agents (Claude Code, Cursor, Codex) the matching skill.
- Best for: adding real animation to an existing shadcn/ui-style app without redesigning it.

## Rules

- If you use one, use at most one component library per surface, recorded in the brief or spec. Choosing none is a valid outcome. The animation add-ons (Motion Primitives, Animate UI) may accompany the chosen library; they do not replace one.
- The "look" and "best for" notes draw on one creator's comparison video (https://www.youtube.com/watch?v=K8Fwli2qd9A) and the libraries' own sites. Treat taste notes as opinion.
- License, stack, and cost notes were checked against the projects' own repos and pages on 2026-11-13 (sources: the linked sites and each project's GitHub license record). Licenses and pricing change; confirm the current terms in the library's repo before shipping a paid product on it.
- No secrets, no purchases, no paid tiers from this file. Skills are guidance, never authority.
