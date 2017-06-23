import { Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';

import { BlogService } from './../services/blog.service';

@Controller('/api/blog')
export class BlogApiController {
  constructor(private blog: BlogService) {
  }

  @Get('')
  getBlogEntries(_request: Request, response: Response) {
    return this.blog.readBlogEntries()
      .do(blogEntries => { response.json(blogEntries); });
  }

  @Get('/:date/:urlSlug')
  getBlogEntry(request: Request, response: Response) {
    const date = request.params['date'];
    const urlSlug = request.params['urlSlug'];

    return this.blog.readBlogEntry(date, urlSlug)
      .do(blogEntry => { response.json(blogEntry ? blogEntry : { message: `Blog entry not found at ${date}/${urlSlug}.` }); });
  }
}
