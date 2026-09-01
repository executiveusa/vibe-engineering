import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createTruthApi } from '../src/truth/api.mjs';
import { getSkill, listSkills, runSkill } from '../src/skills/index.mjs';

const bundlePath = path.join(process.cwd(), 'dist', 'truth', 'truth-bundle.json');
const bundle = JSON.parse(await readFile(bundlePath, 'utf8'));
const api = createTruthApi(bundle);
const port = Number(process.env.PORT ?? 4317);
const MAX_BODY_BYTES = 32 * 1024;
const jsonHeaders = { 'content-type': 'application/json', 'cache-control': 'no-store' };

async function readJson(req) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      const error = new Error('PAYLOAD_TOO_LARGE');
      error.code = 'PAYLOAD_TOO_LARGE';
      throw error;
    }
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function send(res, response) {
  res.writeHead(response.status, response.headers);
  res.end(JSON.stringify(response.body));
}

function skillResponse(status, body, cache = 'no-store', headers = {}) {
  return { status, headers: { 'content-type': 'application/json', 'cache-control': cache, ...headers }, body };
}

function validRunSkillRequest(body) {
  if (!body || Array.isArray(body) || typeof body !== 'object') return false;
  const keys = Object.keys(body);
  if (keys.some((key) => key !== 'id' && key !== 'input')) return false;
  if (typeof body.id !== 'string' || !body.id.trim()) return false;
  if (body.input !== undefined && (body.input === null || Array.isArray(body.input) || typeof body.input !== 'object')) return false;
  return true;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

    if (url.pathname === '/api/v1/skills' && req.method !== 'GET') return send(res, skillResponse(405, { error: 'METHOD_NOT_ALLOWED' }, 'no-store', { allow: 'GET' }));
    if (url.pathname.startsWith('/api/v1/skills/') && req.method !== 'GET') return send(res, skillResponse(405, { error: 'METHOD_NOT_ALLOWED' }, 'no-store', { allow: 'GET' }));
    if (url.pathname === '/api/v1/run-skill' && req.method !== 'POST') return send(res, skillResponse(405, { error: 'METHOD_NOT_ALLOWED' }, 'no-store', { allow: 'POST' }));

    if (req.method === 'GET' && url.pathname === '/api/v1/manifest') return send(res, api.manifest());
    if (req.method === 'GET' && url.pathname === '/api/v1/skills') return send(res, skillResponse(200, { skills: listSkills() }, 'public, max-age=60'));
    if (req.method === 'GET' && url.pathname.startsWith('/api/v1/skills/')) {
      const id = decodeURIComponent(url.pathname.slice('/api/v1/skills/'.length));
      const found = getSkill(id);
      return send(res, found ? skillResponse(200, found, 'public, max-age=60') : skillResponse(404, { error: 'SKILL_NOT_FOUND', id }));
    }
    if (req.method === 'POST' && url.pathname === '/api/v1/run-skill') {
      const body = await readJson(req);
      if (!validRunSkillRequest(body)) return send(res, skillResponse(400, { error: 'INVALID_RUN_SKILL_REQUEST' }));
      const result = runSkill(body.id, body.input ?? {});
      return send(res, result ? skillResponse(200, result) : skillResponse(404, { error: 'SKILL_NOT_FOUND', id: body.id }));
    }
    if (req.method === 'GET' && url.pathname.startsWith('/api/v1/truth/')) return send(res, api.truth(decodeURIComponent(url.pathname.slice('/api/v1/truth/'.length))));
    if (req.method === 'GET' && url.pathname.startsWith('/api/v1/workflows/')) return send(res, api.workflow(decodeURIComponent(url.pathname.slice('/api/v1/workflows/'.length))));
    if (req.method === 'POST' && url.pathname === '/api/v1/resolve-context') return send(res, api.resolve(await readJson(req)));
    if (req.method === 'POST' && url.pathname === '/api/v1/detect') return send(res, api.detect(await readJson(req)));
    if (req.method === 'POST' && url.pathname === '/api/v1/compile-icmr') return send(res, api.compileIcmr(await readJson(req)));
    if (req.method === 'POST' && url.pathname === '/api/v1/validate-icmr') return send(res, api.validateIcmr(await readJson(req)));

    return send(res, { status: 404, headers: jsonHeaders, body: { error: 'NOT_FOUND' } });
  } catch (error) {
    if (error.code === 'PAYLOAD_TOO_LARGE') {
      return send(res, { status: 413, headers: jsonHeaders, body: { error: 'PAYLOAD_TOO_LARGE', maxBytes: MAX_BODY_BYTES } });
    }
    return send(res, { status: 400, headers: jsonHeaders, body: { error: 'BAD_REQUEST' } });
  }
});

server.listen(port, () => {
  console.log(`Vibe Truth API listening on http://localhost:${port}`);
});
