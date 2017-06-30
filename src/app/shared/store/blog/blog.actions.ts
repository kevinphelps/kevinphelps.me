import { Action } from '@ngrx/store';
import { BlogEntry } from 'ng-static-site-generator';

export const BlogActionTypes = {
  LOAD_BLOG_LIST: '[blog] Load Blog List',
  LOAD_BLOG_ENTRY: '[blog] Load Blog Entry'
};

export class LoadBlogListAction implements Action {
  readonly type = BlogActionTypes.LOAD_BLOG_LIST;

  constructor(public payload: BlogEntry[]) { }
}

export class LoadBlogEntryAction implements Action {
  readonly type = BlogActionTypes.LOAD_BLOG_ENTRY;

  constructor(public payload: BlogEntry) { }
}
