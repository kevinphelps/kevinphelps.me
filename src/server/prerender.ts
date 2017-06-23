import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import './../rxjs-operators';

import { Http, Response } from '@angular/http';
import { fork } from 'child_process';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join as joinPaths, normalize as normalizePath } from 'path';
import { sync as rimrafSync } from 'rimraf';
import { Observable } from 'rxjs/Observable';

const copy = require('copy');

import { environment } from './../environments/environment';
import { AppExpressModule } from './app-express.module';
import { BlogService } from './services/blog.service';
import { getInjector } from './utilities/get-injector';

const clientPath = './dist/client';
const sitePath = './dist/static-site';

(async function () {
  const injector = await getInjector(AppExpressModule);
  const http = injector.get(Http);
  const blogService = injector.get(BlogService);

  const baseUrl = `http://localhost:${environment.serverPort}`;

  const staticUrls = [
    '/',
    '/resume'
  ];

  const blogUrls = blogService.readBlogEntries()
    .map(blogEntries => blogEntries.map(blogEntry => blogEntry.url));

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
    rimrafSync(sitePath);

    const prerenderPages = Observable.from(staticUrls)
      .merge(blogUrls.mergeMap(urls => Observable.from(urls)))
      .mergeMap(url => http.get(`${baseUrl}${url}`))
      .do(response => { save(response); });

    Observable.forkJoin(copyAssets(), prerenderPages)
      .subscribe(() => { }, error => { exit(error); }, () => { exit(); });
  }

  function save(response: Response) {
    const url = response.url.replace(baseUrl, '');
    const urlWithFilename = url.endsWith('/') ? joinPaths(url, 'index.html') : `${url}.html`;
    const filePath = joinPaths(sitePath, urlWithFilename);

    const contents = response.text()
      .replace(/<script.+?><\/script>/g, '');

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

  function copyAssets() {
    return Observable.forkJoin(
      copyFiles(`*.ico`),
      copyFiles(`*.css`),
      copyFiles(`glyphicons-*.*`),
      copyFiles(`assets/**/*.*`, 'assets'));
  }

  function copyFiles(globPath: string, destination = '') {
    return new Observable<string[]>(observer => {
      copy(joinPaths(clientPath, globPath), joinPaths(sitePath, destination), (error: Error, files: string[]) => {
        if (error) {
          observer.error(error);
        } else {
          observer.next(files);
          observer.complete();
        }
      });
    });
  }

  function exit(error?: any) {
    if (error) {
      console.log(error.toString());
    }

    process.exit(error ? 1 : 0);
  }
})();
