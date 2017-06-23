import { Request, Response } from 'express';
import { Controller, Get } from 'rx-routes';

import { ServerRenderService } from './../services/server-render.service';

@Controller('/')
export class ServerRenderController {
  constructor(private serverRenderService: ServerRenderService) {
  }

  @Get('*')
  get(request: Request, response: Response) {
    return this.serverRenderService.serverRender(request.url, response);
  }
}
