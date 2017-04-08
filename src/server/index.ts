import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as expressLogging from 'express-logging';
import * as fs from 'fs';
import * as http from 'http';
import * as logops from 'logops';

import { environment } from '../environments/environment';
import { serverRender } from './utilities/server-render';

export const indexHtml = fs.readFileSync('./dist/client/index.html').toString();

(async function() {
  const app = express();
  const server = http.createServer(app);
  const staticFiles = express.static('./dist/client', { redirect: false });

  app.use(expressLogging(logops));
  app.use(bodyParser.json());

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method === 'GET' && req.accepts('html')) {
      serverRender(req, res).subscribe(() => { });
    } else {
      next();
    }
  });

  app.use(staticFiles);

  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method === 'GET' && req.accepts('html')) {
      res.contentType('text/html').send(indexHtml);
    } else {
      next();
    }
  });

  server.listen(environment.serverPort, () => { console.log(`listening on port ${environment.serverPort}`); });
})();
