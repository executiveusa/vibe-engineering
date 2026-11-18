# Design reference sources

Load when: a build needs real designs to aim at, usually before the Cook step or any reference-matching work. References are how the agent learns what good looks like; a short prompt plus strong references beats a long prompt. Sources below are options, not requirements. Pick what fits the brief; choosing none is valid.

## The sources

### Dribbble

- Site: https://dribbble.com. Search for the kind of app, screenshot the parts you want, paste them into the agent.
- Cost: free to browse. No install, no account needed for search.
- Best for: quick human-picked references for a specific screen or component.

### Inspo (MCP)

- Site: https://inspomcp.dev. Code: https://github.com/Nutlope/inspo. npm: `inspo-mcp`.
- What it gives the agent: a curated archive of real production sites (832 sites, 2,320 pages at pin time) with screenshots, palettes, fonts, DESIGN.md per site, and copy-pasteable reference components, over MCP. Fifteen read-only tools; `recommend(brief)` composes them.
- Install: `npx -y inspo-mcp install` detects the installed agent clients (Claude Code, Codex, Cursor, VS Code, Windsurf, Zed, Claude Desktop) and writes their MCP config. Privacy note: by default it points each client at Inspo's hosted endpoint (`https://inspomcp.dev/api/mcp`), so the agent's tool calls leave the machine for Inspo's server. Per the repo README that endpoint logs tool name, success and duration per call, never IPs or query text; treat that as the vendor's claim, not a guarantee. In an interactive terminal the installer prints the plan and asks before writing, but in a non-interactive (non-TTY) run it writes after printing the plan without asking, and its `-y` flag skips the prompt entirely - so always run `npx -y inspo-mcp install --dry-run` first and read the plan before any real run. `--dry-run` writes nothing, `--client <id>` targets one client, and edited config files are backed up alongside (`mcp.json.inspo-backup`). `--local` wires a local stdio server instead of the hosted URL, but that still downloads the catalogue from Inspo's CDN and its live-fetch feature reaches out, so it is not a fully local/private setup either. Run `--dry-run` first and read the plan before any write.
- Cost/license: MIT, free, no API key needed for the default tools (an optional `TOGETHER_API_KEY` only enables semantic search; do not add keys). Read-only tools with an SSRF guard on live fetches (per the repo README, checked 2026-11-16).

### Awwwards MCP

- Code: https://github.com/INSANE0777/Awwwards-mcp. npm: `awwwards-mcp`. Source pin: `0560b94e646db37edcdba5249beeabf8c58ba6c7` (2026-11-16); repository package manifest version `1.20.0` (npm publication must be verified separately). License: MIT for the code; Awwwards source media and data remain separately protected.
- **When to load:** only when the project needs named award-level website comparisons, reference-specific typography/layout/motion analysis, or before a bounded visual Gauntlet. Prefer existing screenshots/Inspo for simple UI tasks; do not automatically preload this MCP alongside every other design resource.
- **Minimal sequence:** `search_sites` (compact) → `get_site_details` for 1–3 candidates → `compare_sites` or `create_design_brief` for a clear, attributed target. Stop if the brief is adequate. Only for an approved URL/site with a browser lane: `analyze_page_structure`, `get_motion_dna`, `analyze_scroll_map`, `capture_live_site` or `verify_build`. Record source URLs and evidence, do not replicate protected assets or user journeys one-to-one.
- **Install route for agent-compatible local environments:** Node ≥22.13; verify `awwwards-mcp@1.20.0` exists, pin the exact version, then start as local stdio only when selected. The basic `npx` route omits Playwright/ffmpeg browser features. Browser captures and motion verification require the upstream browser-enabled setup, owner approval, sandboxing and explicit resource limits. Do not turn on automatic updates, external page crawling or bulk scraping by default.
- **Security and rights:** any live-site capture, bundle/network inspection or local file analysis is an active operation, not merely visual inspiration. Check target authorization, browser isolation, outbound network, cache retention and source terms first. The README limits Awwwards content to personal/non-commercial inspiration; commercial client use requires rights/terms review. Do not republish screenshots, raw assets, source bundles, site descriptions or proprietary designs.
- What it gives the agent: award-winning sites as references, with screenshots, "design DNA", live capture and motion recording, and build-vs-reference verify tools.
- Install: `claude mcp add awwwards -- npx -y awwwards-mcp` (Codex: `codex mcp add awwwards -- npx -y awwwards-mcp`). The npx path covers search and analysis only; the capture, record and verify tools need the repo's separate browser-enabled install with Playwright and ffmpeg — skip that unless a build actually needs it.
- Cost/license: MIT, free, no API key.
- Limits: the code is plain MIT, but the author scopes the fetched Awwwards content to "personal, non-commercial design-inspiration use" (README per-tool notes on the index, collections, directory, annual-awards and audit tools, plus its Ethics & terms section: no bulk-scraping, redistributing or republishing fetched pages; "If you use this commercially, review awwwards.com's terms yourself"; the project is not affiliated with Awwwards). So: fine as an inspiration source; never republish or redistribute what it fetches; for paid client work, awwwards.com's own terms are the open check, and audit only URLs you are authorized to inspect.

### Agent Browser

- Site: https://agent-browser.dev. Code: https://github.com/vercel-labs/agent-browser (Apache-2.0). npm: `agent-browser`.
- What it gives the agent: a browser it can drive one command at a time (open, snapshot, click, screenshot, record video) so it can walk a reference site like a visitor and study layout and motion.
- Install: heaviest of this list. `npm install -g agent-browser` then `agent-browser install` downloads Chrome for Testing (Linux: `--with-deps` also installs system libraries). Lightest start: no install, `npx agent-browser open <url>`. MCP clients can use `agent-browser mcp`; agent harnesses can take the thin skill via `npx skills add vercel-labs/agent-browser`.
- Cost/license: Apache-2.0, free, no key. Note the fleet already has browser lanes; add this for coding agents doing design study, not as a second general browser platform.

### No-install routes (always available)

- Name an existing app in the prompt; the agent studies it with its web tools.
- Marked-up screenshots: draw on the parts to copy or fix.
- Reference videos for motion; the agent reviews them frame by frame and never copies one element 1:1.

## Rules

- References are a target to match in spirit, not to clone. Same quality and feel in the brand's own style; never pass off a copied design as original work.
- No paid tier, subscription or account from this file without the owner's approval. Everything listed is free at pin time.
- Installers that write agent config (`inspo-mcp install`) run with `--dry-run` first. Global installs and browser downloads (agent-browser) only when a build needs them.
- Third-party screens and clips are working references only. Never publish them; publish only references the owner made or owns.
- Pins and licenses checked 2026-11-16 against the linked repos; confirm current terms before shipping client work on them.
