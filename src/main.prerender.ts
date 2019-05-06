import { enableProdMode } from '@angular/core';
import { renderModule } from '@angular/platform-server';
import * as domino from 'domino';
import * as express from 'express';
import * as htmlMinifier from 'html-minifier';
import * as http from 'http';
import difference from 'lodash-es/difference';
import uniq from 'lodash-es/uniq';
import * as path from 'path';
import 'zone.js/dist/zone-node';

import { readFile, writeFile } from './../build/helpers/fs.helpers';
import { AppServerModule } from './app/app.server.module';

let pendingPages = ['/'];

const port = 4000;
const browserRoot = path.resolve('./dist/browser');
const documentPath = path.join(browserRoot, 'index.html');
const document = readFile(documentPath);

const pages: { [url: string]: string } = {};

enableProdMode();

runServer(async () => {
  do {
    const url = pendingPages[0];

    const pageHtml = await renderModule(AppServerModule, { url, document });

    const pageDocument = domino.createDocument(pageHtml);

    const linkedUrls = Array.from(pageDocument.querySelectorAll<HTMLAnchorElement>('a[href]'))
      .map(anchorElement => anchorElement.href)
      .filter(link => link.startsWith('/'));

    pages[url] = pageHtml;
    pendingPages = difference(uniq(pendingPages.concat(linkedUrls)), Object.keys(pages));

    console.log(`${url} rendered. ${pendingPages.length} pages to go.`);
  } while (pendingPages.length > 0);

  for (const [url, pageHtml] of Object.entries(pages)) {
    const pagePath = path.resolve(path.join(browserRoot, `${url === '/' ? 'index' : url}.html`));
    writeFile(pagePath, minifyHtml(pageHtml));
  }
});

function runServer(onListening: () => Promise<any>) {
  console.log('starting server...');

  const app = express();
  const server = http.createServer(app);

  app.use(express.static(browserRoot, {}));

  server.listen(port, async () => {
    console.log(`listening on port ${port}`);

    await onListening();

    server.close();
  });
}

function minifyHtml(html: string) {
  const options: htmlMinifier.Options = {
    caseSensitive: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true
  };

  return htmlMinifier.minify(html, options);
}
