import { BlogEntry } from 'ng-static-site-generator';

export interface BlogState {
  blogList: BlogEntry[];
  blogEntries: BlogEntry[];
}

export const initialBlogState: BlogState = {
  blogList: [],
  blogEntries: []
};
