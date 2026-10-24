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

const CONFIG_SURFACES = ['opencode.json', 'opencode.jsonc',
  path.join('.opencode', 'opencode.json'), path.join('.opencode', 'opencode.jsonc'),
  path.join('.opencode', 'config.json'), path.join('.opencode', 'config.jsonc')];

// Returns null when safe, or a human reason string to HOLD on. Pure + local.
export function projectConfigViolation(root, brokerBaseUrl) {
  for (const name of CONFIG_SURFACES) {
    const pp = path.join(root, name);
    if (!fs.existsSync(pp)) continue;
    let override = 'unparseable';
    try { override = JSON.parse(fs.readFileSync(pp, 'utf8'))?.provider?.openrouter?.options?.baseURL ?? null; }
    catch { /* stays 'unparseable' */ }
    if (override === 'unparseable') return `target ${name} is unparseable (unverifiable)`;
    if (typeof override === 'string' && override && !exactBrokerBase(override, brokerBaseUrl)) {
      return `target ${name} overrides the openrouter baseURL away from the broker`;
    }
  }
  // Plugins execute code with provider access: statically unverifiable.
  for (const pdir of [path.join(root, '.opencode', 'plugin'), path.join(root, '.opencode', 'plugins')]) {
    if (fs.existsSync(pdir) && fs.statSync(pdir).isDirectory()
        && fs.readdirSync(pdir).some((f) => /\.(js|ts|mjs|cjs)$/.test(f))) {
      return `target ships opencode plugins under ${path.relative(root, pdir)} - plugins execute with provider access and are statically unverifiable`;
    }
  }
  return null;
}
