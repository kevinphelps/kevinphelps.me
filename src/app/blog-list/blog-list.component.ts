import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { BlogEntry } from './../shared/interfaces/blog';
import { BlogApiService } from './../shared/services/blog-api.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {
  readonly blogEntries: Observable<BlogEntry[]>;

  constructor(private blog: BlogApiService) {
    this.blogEntries = this.blog.getBlogEntries().shareReplay(1);
  }

  ngOnInit() {
  }
}
