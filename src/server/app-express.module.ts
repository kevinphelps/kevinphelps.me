import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { BlogService } from './../app/shared/services/blog.service';
import { BlogApiController } from './controllers/blog-api.controller';
import { ServerRenderController } from './controllers/server-render.controller';
import { StaticFilesController } from './controllers/static-files.controller';
import { FileCacheService } from './services/file-cache.service';
import { ServerRenderService } from './services/server-render.service';

@NgModule({
  imports: [
    ServerModule,
  ],
  providers: [
    BlogApiController,
    BlogService,
    FileCacheService,
    ServerRenderController,
    ServerRenderService,
    StaticFilesController
  ]
})
export class AppExpressModule {
  ngDoBootstrap() { }
}
