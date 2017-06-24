import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogEntry, BlogService } from 'ng-static-site-generator';

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
  readonly blogEntry: BlogEntry;

  notFound = false;

  constructor(private activatedRoute: ActivatedRoute, private blog: BlogService) {
    const params = activatedRoute.snapshot.params as BlogEntryRouteParams;

    this.blogEntry = this.blog.getBlogEntry(params.date, params.urlSlug);
  }

  ngOnInit() {
  }
}
