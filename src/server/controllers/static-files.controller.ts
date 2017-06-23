import { static as expressStatic, Handler, NextFunction, Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';
import { ServeStaticOptions } from 'serve-static';

import { FileCacheService } from './../services/file-cache.service';

const staticOptions: ServeStaticOptions = {
  redirect: false,
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (expressStatic.mime.lookup(path) === 'text/html' || path.includes('service-worker')) {
      res.setHeader('Cache-Control', 'public, max-age=0');
    }
  }
};

@Controller('/')
export class StaticFilesController {
  private readonly indexHtml: string;
  private readonly staticFileHandler: Handler;

  constructor(fileCache: FileCacheService) {
    this.indexHtml = fileCache.getFile('./dist/client/index.html');
    this.staticFileHandler = expressStatic('./dist/client', staticOptions);
  }

  @Get('*')
  getStaticFile(request: Request, response: Response, next: NextFunction) {
    if (request.url !== '/') {
      this.staticFileHandler(request, response, next);
    } else {
      next();
    }
  }
}
