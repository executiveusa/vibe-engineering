// Phase 1 phone journey (architect 0016 section 4.4). Written by the builder
// agent's operator, NEVER by the factory's builder model. Runs against the
// preview tunnel with basic auth; API steps use the Bearer key.
// Grounded (builder 0017 Q18): foundry-computer's web UI is a static landing
// page - no workspace form exists, so steps 3-5 use the documented API and the
// journey receipt records that explicitly.
import { test, expect, request, devices } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'node:fs';

const URL_ = process.env.TUNNEL_URL || '';
const BASIC = process.env.FACTORY_PREVIEW_BASIC_AUTH || ''; // user:pass (viewer secret; the proxy injects run-only app creds)
// The journey drives pages served by the UNTRUSTED judged app: the real
// viewer secret answers a Basic challenge ONLY for the tunnel origin, so an
// app redirect/frame to another origin can never harvest it.
const TUNNEL_ORIGIN = (() => { try { return new URL(URL_).origin; } catch { return undefined; } })();
const JUDGED_SHA = process.env.JUDGED_SHA || '';
const OUT = process.env.JOURNEY_OUT || 'evidence/journey';
const steps: { step: string; pass: boolean; note?: string }[] = [];
const record = (step: string, pass: boolean, note?: string) => { steps.push({ step, pass, ...(note ? { note } : {}) }); };

test.use({
  ...devices['iPhone 15'],
  httpCredentials: BASIC.includes(':')
    ? { username: BASIC.split(':')[0], password: BASIC.split(':').slice(1).join(':'), ...(TUNNEL_ORIGIN ? { origin: TUNNEL_ORIGIN } : {}) }
    : undefined,
});

test.describe.configure({ mode: 'serial' });

test('foundry preview phone journey', async ({ page }, testInfo) => {
  test.setTimeout(120000);
  mkdirSync(OUT, { recursive: true });
  const shot = async (n: string) => { await page.screenshot({ path: `${OUT}/${n}.png`, fullPage: true }); };

  // 0. Hard prerequisites: the tunnel must refuse anonymous browsers.
  const anon = await request.newContext();
  const anonRes = await anon.get(`${URL_}/`);
  record('anonymous browser refused (401)', anonRes.status() === 401, `status ${anonRes.status()}`);
  expect(anonRes.status()).toBe(401);

  // 1. Open /: renders, no console errors.
  const consoleErrors: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(String(e)));
  await page.goto(`${URL_}/`, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toBeVisible();
  await shot('01-home');
  record('home renders, no console errors', consoleErrors.length === 0, consoleErrors.join('; ').slice(0, 300) || undefined);
  expect(consoleErrors).toEqual([]);

  // 2. GET /BUILD_SHA equals the judged output_sha.
  const shaRes = await page.request.get(`${URL_}/BUILD_SHA`);
  const bodySha = shaRes.ok ? (await shaRes.text()).trim() : '';
  record('BUILD_SHA equals judged output_sha', shaRes.ok && bodySha === JUDGED_SHA, `got ${bodySha.slice(0, 12) || 'n/a'} want ${JUDGED_SHA.slice(0, 12)}`);
  expect(bodySha).toBe(JUDGED_SHA);

  // 3. Create a workspace via the documented API (no UI form exists - grounded).
  // API calls go through the same trusted proxy with the viewer basic auth;
  // the proxy injects the run-only Bearer. No app credential exists here.
  const api = await request.newContext({ baseURL: URL_, extraHTTPHeaders: { Authorization: 'Basic ' + Buffer.from(BASIC).toString('base64') } });
  const name = `journey-${Date.now()}`;
  const create = await api.post('/api/workspaces', { data: { name } });
  record('create workspace via API (no UI form exists)', create.status() === 201, `status ${create.status()}`);
  expect(create.status()).toBe(201);
  const ws = await create.json();
  await shot('03-workspace-created');

  // 4. See it listed.
  const list = await api.get('/api/workspaces');
  const items = list.ok ? await list.json() : [];
  const found = Array.isArray(items) && items.some((w: { id?: string }) => w.id === ws.id);
  record('workspace listed', found, `status ${list.status()}`);
  expect(found).toBe(true);

  // 5. Computer in that workspace via the computers API (no computer page exists).
  const comp = await api.post('/api/computers', { data: { workspace_id: ws.id, name: 'journey-c1' } });
  let compOk = comp.status() === 201;
  let compNote = `status ${comp.status()}`;
  if (compOk) {
    const c = await comp.json();
    const getC = await api.get(`/api/computers/${c.id}`);
    compOk = getC.ok;
    compNote = `computer ${String(c.id).slice(0, 8)} readable: ${getC.status()}`;
  }
  await shot('05-computer');
  record('computer created + readable via API (no computer page exists)', compOk, compNote);
  expect(compOk).toBe(true);

  writeFileSync(`${OUT}/10-journey.json`, JSON.stringify({
    judged_sha: JUDGED_SHA, url_seen: true, steps,
    pass: steps.every((s) => s.pass), finished_at: new Date().toISOString(),
  }, null, 2) + '\n');
  expect(steps.every((s) => s.pass)).toBe(true);
});
