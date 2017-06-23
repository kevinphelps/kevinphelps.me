import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { BlogApiController } from './controllers/blog-api.controller';
import { ServerRenderController } from './controllers/server-render.controller';
import { StaticFilesController } from './controllers/static-files.controller';
import { BlogService } from './services/blog.service';
import { FileCacheService } from './services/file-cache.service';
import { FsService } from './services/fs.service';
import { ServerRenderService } from './services/server-render.service';

@NgModule({
  imports: [
    ServerModule,
  ],
  providers: [
    BlogApiController,
    BlogService,
    FileCacheService,
    FsService,
    ServerRenderController,
    ServerRenderService,
    StaticFilesController
  ]
})
export class AppExpressModule {
  ngDoBootstrap() { }
}
