import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { safeLoad as parseYaml } from 'js-yaml';
import { Observable } from 'rxjs/Observable';

import { environment } from './../../../environments/environment';
import { BlogEntry, BlogEntryMetadata } from './../interfaces/blog';

@Injectable()
export class BlogService {
  constructor(private http: Http) { }

  getBlogEntries() {
    return this.http.get(`${environment.api}/blog`)
      .map(response => response.json() as string[])
      .mergeMap(filenames => Observable.forkJoin(filenames.map(filename => this.getBlogEntryByFilename(filename))));
  }

  getBlogEntry(date: string, urlSlug: string) {
    const filename = `${date}-${urlSlug}.html`;

    return this.getBlogEntryByFilename(filename);
  }

  private getBlogEntryByFilename(filename: string) {
    return this.http.get(`${environment.serverRoot}/blog/${filename}`)
      .map(response => response.text())
      .map(fileContents => BlogService.parseBlogFileContents(filename, fileContents));
  }

  static parseBlogFilename(filename: string) {
    const filenameMatch = /^([0-9]{4}-[0-9]{2}-[0-9]{2})-(.+).html$/g.exec(filename);

    const date = filenameMatch[1];
    const urlSlug = filenameMatch[2];

    return { date, urlSlug };
  }

  private static parseBlogFileContents(filename: string, fileContents: string) {
    const parsedFilename = BlogService.parseBlogFilename(filename);
    const fileContentsMatch = /^---((?:.|\r|\n)+)---((?:.|\r|\n)+)$/g.exec(fileContents);

    const date = parsedFilename.date;
    const url = `/blog/${date}/${parsedFilename.urlSlug}`;
    const metadata: BlogEntryMetadata = parseYaml(fileContentsMatch[1].trim());
    const body = fileContentsMatch[2].trim();

    return { date, url, body, ...metadata } as BlogEntry;
  }
}
