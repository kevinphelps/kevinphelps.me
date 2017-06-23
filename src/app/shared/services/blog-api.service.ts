import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { environment } from './../../../environments/environment';
import { BlogEntry } from './../interfaces/blog';

@Injectable()
export class BlogApiService {
  constructor(private http: Http) { }

  getBlogEntries() {
    return this.get<BlogEntry[]>('blog');
  }

  getBlogEntry(date: string, urlSlug: string) {
    return this.get<BlogEntry>(`blog/${date}/${urlSlug}`);
  }

  private get<T>(url: string) {
    return this.http.get(`${environment.api}/${url}`)
      .map(response => response.json() as T);
  }
}
