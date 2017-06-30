import { Action } from '@ngrx/store';
import { BlogEntry } from 'ng-static-site-generator';

import { BlogActionTypes } from './blog.actions';
import { initialBlogState } from './blog.state';

export function blogReducer<T extends Action>(state = initialBlogState, action: T) {
  switch (action.type) {
    case BlogActionTypes.LOAD_BLOG_LIST:
      const blogList: BlogEntry[] = action.payload;
      return { ...state, blogList };

    case BlogActionTypes.LOAD_BLOG_ENTRY:
      const blogEntry: BlogEntry = action.payload;
      const blogEntries = state.blogEntries
        .filter(entry => entry.url !== blogEntry.url)
        .concat(blogEntry);
      return { ...state, blogEntries };

    default:
      return state;
  }
}
