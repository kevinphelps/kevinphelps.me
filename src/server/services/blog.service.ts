import { Injectable } from '@angular/core';
import { safeLoad as parseYaml } from 'js-yaml';
import { join as pathJoin } from 'path';
import { Observable } from 'rxjs/Observable';

import { BlogEntry, BlogEntryMetadata } from './../../app/shared/interfaces/blog';
import { minifyHtml } from './../utilities/html-minify';
import { FsService } from './fs.service';

const blogPath = './src/blog';

@Injectable()
export class BlogService {
  constructor(private fs: FsService) { }

  readBlogEntries() {
    return this.fs.readDirectory(blogPath)
      .mergeMap(filenames => Observable.forkJoin(filenames.map(filename => this.readBlogEntryByFilename(filename, false))));
  }

  readBlogEntry(date: string, urlSlug: string) {
    const filename = `${date}-${urlSlug}.html`;

    return this.readBlogEntryByFilename(filename);
  }

  private readBlogEntryByFilename(filename: string, setBody = true) {
    return this.fs.readFile(pathJoin(blogPath, filename))
      .catch((error: Error) => {
        if (error.message.includes('ENOENT')) {
          return Observable.of<string>(undefined);
        }

        return Observable.throw(error);
      })
      .map(fileContents => fileContents ? BlogService.parseBlogFileContents(filename, fileContents, setBody) : undefined);
  }

  private static parseBlogFileContents(filename: string, fileContents: string, setBody: boolean) {
    const filenameMatch = /^([0-9]{4}-[0-9]{2}-[0-9]{2})-(.+).html$/g.exec(filename);
    const fileContentsMatch = /^---((?:.|\r|\n)+)---((?:.|\r|\n)+)$/g.exec(fileContents);

    const date = filenameMatch[1];
    const urlSlug = filenameMatch[2].toLowerCase();
    const url = `/blog/${date}/${urlSlug}`;
    const metadata: BlogEntryMetadata = parseYaml(fileContentsMatch[1].trim());
    const body = fileContentsMatch[2].trim();

    return {
      date,
      url,
      ...metadata,
      body: setBody ? minifyHtml(body) : undefined
    } as BlogEntry;
  }
}
