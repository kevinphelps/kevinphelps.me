import * as htmlMinifier from 'html-minifier';
// tslint:disable-next-line:import-blacklist (cannot use 'lodash-es/trimStart' in ts-node)
import { difference, uniq } from 'lodash';
import * as puppeteer from 'puppeteer';
import * as parseUrl from 'url-parse';

import { runBasicServer } from './helpers/basic-server';
import { writeFile } from './helpers/fs.helpers';

const port = 4000;
const host = `http://localhost:${port}`;

let pendingPages = ['/'];

const pages: { [url: string]: string } = {};

runBasicServer(port, async () => {
  const browser = await puppeteer.launch();

  do {
    const page = await browser.newPage();

    const url = pendingPages[0];
    await page.goto(`${host}${url}?prerendering=${true.toString()}`);

    pages[url] = await page.evaluate(() => document.documentElement.outerHTML);
    console.log(`${url} rendered.`);

    const allLinksOnPage = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href')).map(anchorElement => anchorElement.href)
    );

    const linkedUrls = allLinksOnPage.filter(link => parseUrl(link).hostname === 'localhost').map(link => link.replace(host, ''));
    pendingPages = difference(uniq(pendingPages.concat(linkedUrls)), Object.keys(pages));

    await page.close();
  } while (pendingPages.length > 0);

  await browser.close();

  for (const [url, pageHtml] of Object.entries(pages)) {
    writeFile(`./dist/${url === '/' ? 'index' : url}.html`, minifyHtml(pageHtml));
  }
});

export function minifyHtml(html: string) {
  const options: htmlMinifier.Options = {
    caseSensitive: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true
  };

  return htmlMinifier.minify(html, options);
}
