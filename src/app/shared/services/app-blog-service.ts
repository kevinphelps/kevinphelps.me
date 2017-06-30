import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { BlogService } from 'ng-static-site-generator';
import { AppState } from './../store/app.state';
import { LoadBlogEntryAction, LoadBlogListAction } from './../store/blog/blog.actions';

@Injectable()
export class AppBlogService {
  constructor(private blog: BlogService, private store: Store<AppState>) {
  }

  getBlogList() {
    return this.store.select(state => state.blog.blogList)
      .map(blogList => [...blogList].sort((entryA, entryB) => entryB.date.localeCompare(entryA.date)));
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
      .do(blogEntry => { this.store.dispatch(new LoadBlogEntryAction(blogEntry)); });
  }
}
