import { Compiler, Injectable, NgModuleFactory } from '@angular/core';
import { renderModuleFactory } from '@angular/platform-server';
import { Response } from 'express';
import { Observable } from 'rxjs/Observable';

import { minifyHtml } from '../utilities/html-minify';
import { AppServerModule } from './../app-server.module';
import { FileCacheService } from './file-cache.service';

@Injectable()
export class ServerRenderService {
  private readonly document: string;
  private readonly moduleFactory: NgModuleFactory<AppServerModule>;

  constructor(fileCache: FileCacheService, private compiler: Compiler) {
    this.document = fileCache.getFile('./dist/client/index.html');
    this.moduleFactory = this.compiler.compileModuleSync(AppServerModule);
  }

  serverRender(url: string, response?: Response) {
    return Observable.of(undefined)
      .mergeMap(() => renderModuleFactory(this.moduleFactory, { url, document: this.document }))
      .map(html => html ? minifyHtml(html) : undefined)
      .do(html => { this.sendResponse(html, response); });
  }

  private sendResponse(html: string, response: Response) {
    if (response) {
      response.status(200).type('html').send(html);
    }
  }
}
