import 'reflect-metadata';
import 'zone.js/dist/zone-node';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as expressLogging from 'express-logging';
import * as http from 'http';
import * as logops from 'logops';

import { enableProdMode } from '@angular/core';

import { environment } from '../environments/environment';
import { serverRenderHandler } from './handlers/server-render.handler';
import { indexFallbackHandler, staticFilesHandler } from './handlers/static-files.handler';

enableProdMode();

const app = express();
const server = http.createServer(app);

app.use(expressLogging(logops));
app.use(bodyParser.json());

app.use(serverRenderHandler);
app.use(staticFilesHandler);
app.use(indexFallbackHandler);

server.listen(environment.serverPort, () => { console.log(`listening on port ${environment.serverPort}`); });
