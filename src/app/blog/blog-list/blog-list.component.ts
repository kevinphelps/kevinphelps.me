import { Component, OnInit } from '@angular/core';
import { BlogEntry } from 'ng-static-site-generator';
import { Observable } from 'rxjs/Observable';

import { AppBlogService } from './../../shared/services/app-blog-service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  readonly blogList: Observable<BlogEntry[]>;

  constructor(private blog: AppBlogService) {
    this.blogList = this.blog.getBlogList()
      .map(blogList => blogList.splice(0, 5));
  }

  ngOnInit() {
    this.blog.loadBlogList().subscribe(() => { });
  }
}
