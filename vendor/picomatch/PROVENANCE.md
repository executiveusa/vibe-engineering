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

## Local safety closure for excluded branches (2026-11-17)

Independent Codex security review found that the previous attempt preserved
ReDoS for unflattenable repeated extglobs, including `+([ab/]*)c` and
`+(a*)b` with `{regex:true}`. The guarded parser now **throws SyntaxError**
on these unsupported dangerous shapes rather than emitting a catastrophic
backtracking expression or quietly literalizing the glob. It also rejects
mixed unflattenable wildcard branches and overlapping repeated branches when
`maxExtglobRecursion:false` would bypass the normal analysis. Safer flattenable
patterns, ordinary globs, and safe alternations retain their existing behavior.

This is an explicit compatibility trade-off: workloads intentionally using the
rejected shapes must rewrite those glob patterns, not disable the safety gate.
Security regression tests use isolated child-process deadlines and positive
matching assertions. `npm audit` passing against a privately versioned
vendored package does **not** prove the patch is secure; human-readable source
review, regression evidence, and independent security approval remain required.
The provenance reference to upstream PR #254 is inspiration only, not an
upstream endorsement or a published fix. Remove the vendor override after an
official fixed release is independently verified.

## Second independent-review closure (2026-11-18)

A separate Codex review of `e29f0d0ac19055b2a21f84f82695c4d82691d5e5` found two additional P1 ReDoS cases:
`+((a+))b` under default options, and `+(ab|abab)c` with overlapping multi-character literal alternatives. It also identified a P2 compatibility regression for escaped and bracketed literal plus characters in regex mode.

The updated parser scans the extglob body while respecting escapes and character classes and guards repeated literal alternatives for any prefix ambiguity, not just repeated single-character literals. Unsafe ambiguity raises an explicit SyntaxError. Tests cover both new attacks in subprocess deadlines and check literal-plus matching. An independent code and security review of the latest exact head is still required; passing tests and a private vendor override alone do not prove complete ReDoS closure.

## Conservative repetition guard (2026-11-18)

An independent reviewer reproduced new P1 ReDoS patterns on `5a2f32146fbb558d23e9d47aa2af71e0ba04ff65`:
`+(a|a[a])b` (literal versus character class) and `+((a|aa))b` (nested alternation). The earlier token scan cannot prove these patterns safe.

The current candidate therefore rejects repeated extglobs unless the body is a single fixed-width token sequence without regex/glob quantifiers, a prefix-free set of **plain literal** alternatives, or a previously validated equivalent wildcard/character-class flattening. This is deliberately stricter than upstream picomatch and can reject advanced patterns that may be harmless. Users of such patterns must rewrite them or obtain an official fixed upstream implementation; do not disable the guard or fall back to unsafe regexes. Tests include positive safe forms and isolated deadline-based regressions for the reviewed bypasses. This remains an unreviewed downstream security patch until exact-head independent code and security receipts pass.

