import * as express from 'express';
import * as url from 'url';

import { renderModule } from '@angular/platform-server';
import { Routes } from '@angular/router';

import { routes as appRoutes } from '../../app/app-routing.module';
import { AppServerModule } from '../app-server.module';

import { indexHtml } from './static-files.handler';

const routePaths = getRoutePaths(appRoutes);

export function serverRenderHandler(req: express.Request, res: express.Response, next: express.NextFunction) {
  const path = url.parse(req.url).pathname;

  if (routePaths.includes(path)) {
    renderModule(AppServerModule, { url: req.url, document: indexHtml })
      .then(html => { res.contentType('text/html').send(html); });
  } else {
    next();
  }
}

function getRoutePaths(routes: Routes, baseUrl = '/') {
  const urls: string[] = [];

  for (const route of routes) {
    const slash = route.path.length && !baseUrl.endsWith('/') ? '/' : '';
    const routeUrl = `${baseUrl}${slash}${route.path}`;

    urls.push(routeUrl);

    if (route.children && route.children.length) {
      urls.push(...getRoutePaths(route.children, routeUrl));
    }
  }

  return urls.filter((item, pos, self) => self.indexOf(item) === pos);
}
