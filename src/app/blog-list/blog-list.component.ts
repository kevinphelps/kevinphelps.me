import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BlogEntry } from './../shared/interfaces/blog';
import { BlogService } from './../shared/services/blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  readonly blogList: Observable<BlogEntry[]>;

  constructor(private blog: BlogService) {
    this.blogList = this.blog.getBlogList().shareReplay(1);
  }

  ngOnInit() {
  }
}
