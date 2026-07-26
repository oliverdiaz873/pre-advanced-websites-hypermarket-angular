import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';

const angularApp = new AngularNodeAppEngine();

const server = createServer((req, res) => {
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
  angularApp.handle(req).then(response => {
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  }).catch(error => next(error));
};

export default createNodeRequestHandler(handler);
