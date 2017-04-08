import * as express from 'express';
import * as fs from 'fs';

export const indexHtml = fs.readFileSync('./dist/client/index.html').toString();

export const staticFilesHandler = express.static('./dist/client', { redirect: false });

export function indexFallbackHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.method === 'GET' && req.accepts('html')) {
    res.contentType('text/html').send(indexHtml);
  } else {
    next();
  }
}
