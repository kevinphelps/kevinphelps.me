import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import { BlogEntry, BlogService } from 'ng-static-site-generator';
import { AppState } from './../store/app.state';
import { LoadBlogEntryAction, LoadBlogListAction } from './../store/blog/blog.actions';

@Injectable()
export class AppBlogService {
  constructor(private blog: BlogService, private store: Store<AppState>) {
  }

  getBlogList() {
    return this.store.select(state => state.blog.blogList);
  }

  getBlogEntry(date: string, urlSlug: string) {
    return this.store.select(state => state.blog.blogEntries.find(blogEntry => blogEntry.url === `/blog/${date}/${urlSlug}`));
  }

  loadBlogList() {
    return this.blog.getBlogList()
      .do(blogList => { this.store.dispatch(new LoadBlogListAction(blogList)); });
  }

  loadBlogEntry(date: string, urlSlug: string) {
    return this.blog.getBlogEntry(date, urlSlug)
      .do(blogEntry => { this.store.dispatch(new LoadBlogEntryAction(blogEntry)); })
      .catch((response: Response) => response.status === 404 ? Observable.of<BlogEntry>(undefined) : Observable.throw(response));
  }
}
