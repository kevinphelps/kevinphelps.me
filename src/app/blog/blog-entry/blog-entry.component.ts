import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { BlogEntry } from './../../shared/interfaces/blog';
import { BlogService } from './../../shared/services/blog.service';

interface BlogEntryRouteParams {
  date: string;
  urlSlug: string;
}

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.scss']
})
export class BlogEntryComponent implements OnInit {
  readonly blogEntry: Observable<BlogEntry>;

  notFound = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private blog: BlogService) {

    this.blogEntry = this.activatedRoute.params
      .mergeMap((params: BlogEntryRouteParams) => this.blog.getBlogEntry(params.date, params.urlSlug))
      .do(blogEntry => { this.notFound = blogEntry === undefined; })
      .shareReplay(1);
  }

  ngOnInit() {
  }
}
