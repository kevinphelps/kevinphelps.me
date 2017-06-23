import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import './../rxjs-operators';

import { Http, Response } from '@angular/http';
import { fork } from 'child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { extension as mimeExtension } from 'mime';
import { dirname, join as joinPaths, normalize as normalizePath } from 'path';
import { Observable } from 'rxjs/Observable';

import { BlogService } from './../app/shared/services/blog.service';
import { environment } from './../environments/environment';
import { AppExpressModule } from './app-express.module';
import { getInjector } from './utilities/get-injector';

const clientPath = './dist/client';

(async function () {
  const injector = await getInjector(AppExpressModule);
  const http = injector.get(Http);

  const baseUrl = `http://localhost:${environment.serverPort}`;

  const staticUrls = [
    '/',
    '/404',
    '/resume',
    '/api/blog'
  ];

  const serverProcess = fork('./dist/server/server.js');

  serverProcess.on('exit', code => {
    process.exit(code && code > 0 ? 1 : 0);
  });

  serverProcess.on('message', message => {
    if (message === 'listening') {
      prerender();
    }
  });

  function prerender() {
    const prerenderPages = Observable.from(staticUrls)
      .mergeMap(url => httpGet(`${baseUrl}${url}`))
      .do(response => { save(response); });

    const prerenderBlog = httpGet(`${baseUrl}/api/blog`)
      .map(response => response.json() as string[])
      .mergeMap(filenames => Observable.from(filenames))
      .map(filename => BlogService.parseBlogFilename(filename))
      .mergeMap(filename => httpGet(`${baseUrl}/blog/${filename.date}/${filename.urlSlug}`))
      .do(response => { save(response); });

    Observable.forkJoin(prerenderPages, prerenderBlog)
      .subscribe(() => { }, error => { exit(error); }, () => { exit(); });
  }

  function httpGet(url: string) {
    return http.get(url)
      .catch((response: Response) => response.status === 404 && url.includes('404') ? Observable.of(response) : Observable.throw(response));
  }

  function save(response: Response) {
    const extension = mimeExtension(response.headers.get('Content-Type'));
    const url = response.url.replace(baseUrl, '');
    const urlWithFilename = url.endsWith('/') ? joinPaths(url, `index.${extension}`) : `${url}.${extension}`;
    const filePath = joinPaths(clientPath, urlWithFilename);

    const contents = response.text();

    writeFile(filePath, contents);
  }

  function writeFile(filePath: string, contents: string) {
    filePath = normalizePath(filePath);

    ensureDirectoryExistence(filePath);

    writeFileSync(filePath, contents);
    console.log(`${filePath} written.`);
  }

  function ensureDirectoryExistence(filePath: string) {
    const dirPath = dirname(filePath);

    if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
      ensureDirectoryExistence(dirPath);
      mkdirSync(dirPath);
    }
  }

  function exit(error?: any) {
    if (error) {
      console.log(error.toString());
    }

    process.exit(error ? 1 : 0);
  }
})();
