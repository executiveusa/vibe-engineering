import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createTruthApi } from '../src/truth/api.mjs';

const bundlePath = path.join(process.cwd(), 'dist', 'truth', 'truth-bundle.json');
const bundle = JSON.parse(await readFile(bundlePath, 'utf8'));
const api = createTruthApi(bundle);
const port = Number(process.env.PORT ?? 4317);

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function send(res, response) {
  res.writeHead(response.status, response.headers);
  res.end(JSON.stringify(response.body));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host ?? 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/v1/manifest') return send(res, api.manifest());

    if (req.method === 'GET' && url.pathname.startsWith('/api/v1/truth/')) {
      return send(res, api.truth(decodeURIComponent(url.pathname.slice('/api/v1/truth/'.length))));
    }

    if (req.method === 'GET' && url.pathname.startsWith('/api/v1/workflows/')) {
      return send(res, api.workflow(decodeURIComponent(url.pathname.slice('/api/v1/workflows/'.length))));
    }

    if (req.method === 'POST' && url.pathname === '/api/v1/resolve-context') {
      return send(res, api.resolve(await readJson(req)));
    }

    return send(res, { status: 404, headers: { 'content-type': 'application/json' }, body: { error: 'NOT_FOUND' } });
  } catch (error) {
    return send(res, { status: 400, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }, body: { error: 'BAD_REQUEST', message: error.message } });
  }
});

server.listen(port, () => {
  console.log(`Vibe Truth API listening on http://localhost:${port}`);
});
