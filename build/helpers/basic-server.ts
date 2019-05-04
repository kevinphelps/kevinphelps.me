import * as express from 'express';
import * as http from 'http';

import { readFile } from './fs.helpers';

export function runBasicServer(port: number, onListening: () => Promise<any>) {
  console.log('starting server...');

  const app = express();
  const server = http.createServer(app);
  const staticFileHandler = express.static('./dist', {});

  app.use((req, res, next) => {
    const fallback: express.NextFunction = () => {
      const extensionlessUrlRegex = /\/[^.]*(\?.+)?$/; // no period except in query string

      if (req.method === 'GET' && extensionlessUrlRegex.test(req.url)) {
        const indexHtml = readFile('./dist/index.html');

        res.setHeader('Cache-Control', 'no-cache');
        res.type('html').send(indexHtml);
      } else {
        next();
      }
    };

    if (req.url === '/service-worker.js') {
      next();
    } else {
      staticFileHandler(req, res, fallback);
    }
  });

  server.listen(port, async () => {
    console.log(`listening on port ${port}`);

    await onListening();

    server.close();
  });
}
