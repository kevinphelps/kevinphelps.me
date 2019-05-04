import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { BlogEntry, BlogService } from './../../shared/services/blog-service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html'
})
export class BlogListComponent {
  readonly blogList: Observable<BlogEntry[]>;

  constructor(private readonly blogService: BlogService) {
    this.blogList = this.blogService.getBlogList().pipe(shareReplay(1));
  }
}
