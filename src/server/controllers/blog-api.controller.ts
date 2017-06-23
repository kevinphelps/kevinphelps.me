import { Request, Response } from 'express';
import { readdirSync, readFileSync } from 'fs';
import { join as joinPaths } from 'path';
import { Controller, Get } from 'rx-routes';

import { BlogService } from './../../app/shared/services/blog.service';

const blogPath = './src/blog';

@Controller('/api/blog')
export class BlogApiController {
  constructor() { }

  @Get('')
  getAll(_request: Request, response: Response) {
    const blogEntries = readdirSync(blogPath)
      .map(filename => ({ filename, fileContents: readFileSync(joinPaths(blogPath, filename)).toString() }))
      .map(file => BlogService.parseBlogFileContents(file.filename, file.fileContents, false));

    response.json(blogEntries);
  }
}
