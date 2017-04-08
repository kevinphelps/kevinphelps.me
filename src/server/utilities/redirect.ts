import * as express from 'express';

import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

export function handleRedirectOr404(req: express.Request, res: express.Response, next: express.NextFunction, expectedUrl: Observable<string>) {
  return expectedUrl
    .do(expected => {
      if (req.url === expected) {
        next();
      } else {
        res.redirect(expected);
      }
    })
    .catch((error: Response) => {
      if (error.status === 404) {
        res.status(404).send('404 Not Found');
      } else {
        return Observable.throw(error);
      }
    });
}
