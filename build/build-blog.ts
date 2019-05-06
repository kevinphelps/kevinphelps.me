import * as fs from 'fs';
import { safeLoad as parseYaml } from 'js-yaml';
import * as path from 'path';

import { readFile, writeFile } from './helpers/fs.helpers';

const blogPath = './src/blog';
const publicRootPath = './dist/browser';

interface BlogEntryMetadata {
  title: string;
  description: string;
}

interface BlogEntry extends BlogEntryMetadata {
  date: string;
  url: string;
  body: string;
}

(() => {
  const blogEntries = getBlogEntries();

  writeBlogEntryJsonFiles(blogEntries);
  writeBlogIndexJsonFile(blogEntries);
})();

function writeBlogEntryJsonFiles(blogEntries: BlogEntry[]) {
  for (const blogEntry of blogEntries) {
    const jsonFilePath = path.join(publicRootPath, `${blogEntry.url}.json`);
    writeFile(jsonFilePath, JSON.stringify(blogEntry, undefined, 0));
  }
}

function writeBlogIndexJsonFile(blogEntries: BlogEntry[]) {
  const blogIndex = blogEntries.sort((a, b) => a.date.localeCompare(b.date)).map(blogEntry => ({ ...blogEntry, body: undefined }));

  const blogIndexFilePath = path.join(publicRootPath, 'blog', 'index.json');
  writeFile(blogIndexFilePath, JSON.stringify(blogIndex, undefined, 0));
}

function getBlogEntries() {
  return fs
    .readdirSync(blogPath)
    .map(filename => parseBlogEntry(filename, readFile(path.join(blogPath, filename))))
    .filter(blogEntry => new Date(blogEntry.date) <= new Date());
}

export function parseBlogEntry(filename: string, fileContents: string) {
  const [date] = /^[0-9]{4}-[0-9]{2}-[0-9]{2}/g.exec(filename);
  const [, metadataYaml, body] = /^---(?:\r|\n)((?:.|\r|\n)+?)(?:\r|\n)---(?:\r|\n)((?:.|\r|\n)+)$/g.exec(fileContents);

  const metadata: BlogEntryMetadata = parseYaml(metadataYaml);

  const blogEntry: BlogEntry = {
    ...metadata,
    date,
    body: body.trim().replace(/\r?\n/g, '\n'),
    url: `/blog/${filename.replace(/\.md+$/, '')}`
  };

  return blogEntry;
}
