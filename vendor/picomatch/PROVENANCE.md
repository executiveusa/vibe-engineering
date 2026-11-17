# Vendored picomatch emergency security patch

This is a scoped, temporary, **local** replacement for the single picomatch transitive dependency. It is not published or independently versioned upstream.

- Provenance: upstream `micromatch/picomatch` tag `4.0.7`, MIT licensed.
- Change: `lib/parse.js` uses the single-branch wildcard repetition flattening logic from upstream proposed [PR #254](https://github.com/micromatch/picomatch/pull/254), inspected 2026-11-17 at commit `c63a5bf4e61dbdb81bc41e97dc2616c30acce337`.
- Advisory: [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf), CVE-2026-112366.
- Local private version `4.0.8-master-mode.1` distinguishes the audited patched source from vulnerable official `4.0.7`; **it is not an upstream release**.
- `package.json` and lockfile intentionally resolve `picomatch` to this local package using npm `overrides.picomatch = "$picomatch"`, not to an unverified third-party publisher.
- Additional regressions are in `tests/security-picomatch.test.mjs`. Must pass `npm ci`, `npm audit --audit-level=high`, `npm test`, `npm run build`, and independent review before merge.
- Release/rollback: remove the local dependency and override, re-resolve `package-lock.json`, and delete this vendor directory once an upstream published patched version is verified. Do not downgrade to a vulnerable upstream build.
- This is a supply-chain exception requiring independent security review of the patch and its compatibility with Vite; the version string itself is not proof of safety.

- Independent Codex P2 review found incorrect flattening for slash-consuming bracket patterns and regex quantifiers; this local copy excludes those cases and adds regressions. The original upstream PR #254 alone is not asserted fully safe.
