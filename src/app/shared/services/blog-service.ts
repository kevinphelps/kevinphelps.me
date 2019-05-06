import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

export interface BlogEntry {
  url: string;
  date: string;
  title: string;
  description: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private readonly httpClient: HttpClient) {}

  getBlogList() {
    return this.httpClient.get<BlogEntry[]>(`${environment.httpRequestRoot}/blog/index.json`);
  }

  getBlogEntry(blogEntry: string) {
    return this.httpClient
      .get<BlogEntry>(`${environment.httpRequestRoot}/blog/${blogEntry}.json`)
      .pipe(catchError((response: Response) => (response.status === 404 ? of(undefined) : throwError(response))));
  }
}
