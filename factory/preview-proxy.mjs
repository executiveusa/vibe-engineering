// Trusted preview proxy (Phase 1 preview isolation): authentication terminates
// HERE, in pinned control-repo code on the runner - never in the untrusted
// judged app. The app's own preview password and API key are RUN-ONLY randoms
// generated per run; the proxy injects them when forwarding. The only real
// secret (FACTORY_PREVIEW_BASIC_AUTH, how a human views the preview) exists
// solely in this process's env and never enters the app's environment.
import http from 'node:http';
import { randomBytes } from 'node:crypto';

export function createPreviewProxy({ basicAuth, appHost = '127.0.0.1', appPort = 8000, appAuth, listenHost = '127.0.0.1' }) {
  // basicAuth: 'user:password' the PUBLIC must present (the real secret).
  // appAuth: { user, password, apiKey } run-only randoms the app checks.
  if (!basicAuth || !basicAuth.includes(':')) throw new Error('proxy needs basicAuth user:password');
  const expected = 'Basic ' + Buffer.from(basicAuth).toString('base64');
  const appBasic = 'Basic ' + Buffer.from(`${appAuth.user}:${appAuth.password}`).toString('base64');

  const server = http.createServer((req, res) => {
    const deny = () => {
      res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="factory preview"', 'content-type': 'text/plain' });
      res.end('authentication required');
    };
    if (req.headers.authorization !== expected) return deny();
    const headers = { ...req.headers };
    delete headers.authorization;
    if (req.url.startsWith('/api/')) headers.authorization = `Bearer ${appAuth.apiKey}`;
    else headers.authorization = appBasic;
    const up = http.request({ host: appHost, port: appPort, path: req.url, method: req.method, headers }, (r) => {
      res.writeHead(r.statusCode, r.headers);
      r.pipe(res);
    });
    up.on('error', () => { res.writeHead(502); res.end('app unreachable'); });
    req.pipe(up);
  });
  return {
    listen: (port = 0) => new Promise((r) => server.listen(port, listenHost, () => r(server.address().port))),
    close: () => new Promise((r) => server.close(r)),
  };
}

export function runOnlyAppAuth() {
  return {
    user: 'preview',
    password: randomBytes(24).toString('hex'),
    apiKey: 'run-only-' + randomBytes(24).toString('hex'),
  };
}

// CLI: FACTORY_PREVIEW_BASIC_AUTH (real secret, this process only) +
// RUN_ONLY_PREVIEW_PASSWORD / RUN_ONLY_API_KEY (generated per run) + APP_PORT.
if (import.meta.url === `file://${process.argv[1]}`) {
  const basicAuth = process.env.FACTORY_PREVIEW_BASIC_AUTH || '';
  const appAuth = {
    user: 'preview',
    password: process.env.RUN_ONLY_PREVIEW_PASSWORD || '',
    apiKey: process.env.RUN_ONLY_API_KEY || '',
  };
  if (!basicAuth.includes(':') || !appAuth.password || !appAuth.apiKey) {
    console.error('preview-proxy: FACTORY_PREVIEW_BASIC_AUTH (user:pass) + RUN_ONLY_PREVIEW_PASSWORD + RUN_ONLY_API_KEY required');
    process.exit(2);
  }
  // APP_HOST: inside compose the app is a sibling service on the internal
  // network; on a bare runner it is 127.0.0.1. PROXY_HOST: the container must
  // listen on 0.0.0.0 (compose publishes to host 127.0.0.1 only).
  const proxy = createPreviewProxy({
    basicAuth,
    appHost: process.env.APP_HOST || '127.0.0.1',
    appPort: Number(process.env.APP_PORT || 8000),
    appAuth,
    listenHost: process.env.PROXY_HOST || '127.0.0.1',
  });
  proxy.listen(Number(process.env.PROXY_PORT || 8010)).then((p) => console.log(`preview-proxy on ${process.env.PROXY_HOST || '127.0.0.1'}:${p} -> ${process.env.APP_HOST || '127.0.0.1'}:${process.env.APP_PORT || 8000}`));
}
