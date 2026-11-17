# Temporary patched picomatch (private vendored dependency)

This folder contains the complete **runtime** source of MIT-licensed `picomatch` 4.0.7 (tag: https://github.com/micromatch/picomatch/tree/4.0.7), with the focused single-branch wildcard-repeat patch from https://github.com/micromatch/picomatch/pull/254, patch head `c63a5bf4e61dbdb81bc41e97dc2616c30acce337`. Copyright and original MIT LICENSE are preserved.

The local package version `4.0.8-patched.1` is **not an upstream npm release**; this is a private, clearly labeled security maintenance patch for GHSA-fc5q-39xc-vjpf / CVE-2026-112366. Do **not** publish the package or assume an npm release of this version exists. It is used solely through an explicit `file:` npm override in the consuming repository.

Only `lib/parse.js` is changed from upstream runtime source. The patch collapses one branch of ordinary wildcard tokens into a non-repeating equivalent, preventing nested unbounded regex quantifiers for the exploited patterns. Unrelated input classes and explicit `maxExtglobRecursion: false` retain upstream behavior. Existing upstream test coverage is described in PR #254, but its maintainer review was pending when adopted. This local adoption still requires independent security review and application test coverage.

**Acceptance:** `npm ci`, `npm audit --audit-level=high`, `npm test`, `npm run build` and the local malicious-pattern regression all pass on the exact release SHA; compare against official fixed release when one appears.

**Maintenance / rollback:** On publication of an official security fix, review the changelog and security advisory, remove the `overrides.picomatch` entry, remove this folder and the dedicated regression test only if equivalent upstream tests cover it, regenerate `package-lock.json`, and verify all gates. For a failed deployment, revert the reviewed release commit, not just the override.
