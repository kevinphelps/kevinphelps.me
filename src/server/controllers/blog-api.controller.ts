import { Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';

import { FsService } from './../services/fs.service';

const blogPath = './src/blog';

@Controller('/api/blog')
export class BlogApiController {
  constructor(private fs: FsService) {
  }

  @Get('')
  getBlogEntries(_request: Request, response: Response) {
    return this.fs.readDirectory(blogPath)
      .do(filenames => { response.json(filenames); });
  }
}
