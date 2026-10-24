// Project-config override guard (Phase 1, critic v4 findings 1-2): opencode
// project config WINS over OPENCODE_CONFIG (verified against the real 1.19.4
// binary), so any target-side baseURL redirection would silently un-broker a
// run. The runner neutralizes every project surface with
// OPENCODE_DISABLE_PROJECT_CONFIG=1; this guard keeps any redirection ATTEMPT
// loud, runs before and after EVERY stage, and covers every surface.
import fs from 'node:fs';
import path from 'node:path';

// Finding 1: startsWith() is bypassable - http://HOST:PORT@evil/, HOST:PORT1/
// and HOST.evil/ all carry the prefix. Exactness means parsed-URL equality:
// same protocol+host+port, path exactly /v1, no userinfo, query or fragment.
export function exactBrokerBase(raw, brokerBaseUrl) {
  let u, b;
  try { u = new URL(raw); b = new URL(brokerBaseUrl); } catch { return false; }
  return u.protocol === b.protocol && u.host === b.host
    && u.username === '' && u.password === ''
    && (u.pathname === '/v1' || u.pathname === '/v1/')
    && u.search === '' && u.hash === '';
}

// critic v5cd blocker 2: a denylist of KNOWN-bad config shapes is bypassable
// (custom providers, npm plugins, remote mcp, .opencode agents/tools, model
// overrides, baseURL arrays, baseUrl case variants - and tomorrow's shape).
// The control inverts to a bounded ALLOWLIST: a factory target ships NO
// project opencode surface AT ALL. Any presence HOLDs loudly; the
// OPENCODE_DISABLE_PROJECT_CONFIG kill switch makes inert what slips through,
// and the kill switch stays defense-in-depth, not the primary control.
// Returns null when safe, or a human reason string to HOLD on. Pure + local.
export function projectConfigViolation(root) {
  for (const name of ['opencode.json', 'opencode.jsonc']) {
    if (fs.existsSync(path.join(root, name))) {
      return `target ships ${name} - project opencode config is not permitted in a factory target`;
    }
  }
  if (fs.existsSync(path.join(root, '.opencode'))) {
    return 'target ships a .opencode/ entry - project opencode config/agents/tools/plugins are not permitted in a factory target';
  }
  return null;
}
