import { NextFunction, Request, Response } from 'express';

import { environment } from './../../environments/environment';

export function handleRequestError(_request: Request, response: Response, next: NextFunction, error: any) {
  if (environment.production === false) {
    (response as any)['error'] = error;

    console.log(error.toString());
  }

  response.status(500);
  next();
}
