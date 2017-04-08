import * as express from 'express';

import { renderModule} from '@angular/platform-server';

import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

import { AppServerModule } from '../app-server.module';

import { indexHtml } from '../index';

export function serverRender(req: express.Request, res: express.Response) {
  return new Observable<void>((observer: Observer<void>) => {
    renderModule(AppServerModule, { url: req.url, document: indexHtml })
      .then(html => {
        res.contentType('text/html').send(html);
        observer.next(void 0);
        observer.complete();
      });
  });
}
