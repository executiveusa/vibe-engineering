# security-audit-skill provenance (vendored validator)

Vendored files from the upstream Cloudflare `security-audit` skill so the
ship gate can validate `findings.json` receipts hermetically, without a
network fetch or an unpinned dependency.

- Source: https://github.com/cloudflare/security-audit-skill
- Upstream path: `skills/security-audit/`
- Pinned upstream commit: `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`
- License: MIT (upstream `LICENSE` copied verbatim to `LICENSE` here)
- Vendored on: 2026-10-06
- Review state: source reviewed before vendoring; defensive, source-first
  audit workflow. Only the findings validator and its schema are vendored
  here; the full skill is registered separately in the agent-skills arsenal.

Vendored files (byte-identical to upstream at the pinned commit):

- `validate-findings.cjs` — sha256 `e85f232e36bfac0f866f244da50376692d6b45c690beadcb00608b0e6c8b5283`
- `report-schema.json` — sha256 `6575c9de4a62255699ea052ebf9a49ebfb373a32891bcd89af6f55cc84b35519`
- `LICENSE` — sha256 `e598e694aa506650c7192d5ea3be0e50aca0d356ea00551c53429f0b01eb6391`

Upgrading this validator is a normal reviewed change: bump the pinned
commit, re-copy the files, refresh the hashes above, and land it through
the same gates as code.
