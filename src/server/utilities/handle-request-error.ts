import * as express from 'express';

import { environment } from '../../environments/environment';

export function handleRequestError(_req: express.Request, res: express.Response, error: any) {
  if (environment.production) {
    res.status(500).send('500 Internal Server Error');
  } else {
    res.status(500).send(error.toString());
  }
}
