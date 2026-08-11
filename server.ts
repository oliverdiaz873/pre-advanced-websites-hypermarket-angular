import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { createServer, request as httpRequest, type IncomingMessage, type ServerResponse } from 'node:http';
import { fileURLToPath } from 'node:url';

const angularApp = new AngularNodeAppEngine();

/**
 * Reenvío same-origin de `/api/*` al backend (A1). Mantiene cookies httpOnly
 * (SameSite + host-only) funcionando también bajo SSR/prerender y en producción,
 * donde el storefront y la API comparten origen. `API_TARGET` permite apuntar a
 * otro backend (p. ej. en CI o despliegues separados).
 */
const API_TARGET = process.env['API_TARGET'] || 'http://localhost:3000';

function isApiRequest(url: string | undefined): url is string {
  return url === undefined ? false : url === '/api' || url.startsWith('/api/');
}

function forwardApi(req: IncomingMessage, res: ServerResponse): void {
  const target = new URL(API_TARGET);
  const headers: Record<string, string | string[] | number | undefined> = { ...req.headers };
  headers['host'] = target.host;

  const upstream = httpRequest(
    {
      hostname: target.hostname,
      port: target.port || (target.protocol === 'https:' ? 443 : 80),
      path: req.url ?? '/',
      method: req.method,
      headers,
    },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, upstreamRes.headers);
      upstreamRes.pipe(res);
    },
  );

  upstream.on('error', () => {
    res.writeHead(502, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ success: false, statusCode: 502, code: 'INTERNAL_ERROR', message: 'API unreachable' }));
  });

  req.pipe(upstream);
}

const server = createServer((req, res) => {
  if (isApiRequest(req.url)) {
    forwardApi(req, res);
    return;
  }

  angularApp.handle(req).then(response => {
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  }).catch(error => {
    console.error('SSR error:', error);
    res.writeHead(500);
    res.end('Internal server error');
  });
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  server.listen(port, () => {
    console.log(`Angular SSR server listening on http://localhost:${port}`);
  });
}

const handler: import('@angular/ssr/node').NodeRequestHandlerFunction = (req, res, next) => {
  if (isApiRequest(req.url)) {
    forwardApi(req, res);
    return;
  }

  angularApp.handle(req).then(response => {
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  }).catch(error => next(error));
};

export default createNodeRequestHandler(handler);