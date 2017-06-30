import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BlogEntry } from 'ng-static-site-generator';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppBlogService } from './../../shared/services/app-blog-service';

interface BlogEntryRouteParams {
  date: string;
  urlSlug: string;
}

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html',
  styleUrls: ['./blog-entry.component.scss']
})
export class BlogEntryComponent implements OnInit, OnDestroy {
  readonly blogEntry: Observable<BlogEntry>;
  readonly trustedBody: Observable<string>;
  readonly notFound = new BehaviorSubject(false);

  private loadSubscription: Subscription;

  constructor(domSanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, private blog: AppBlogService) {
    this.blogEntry = activatedRoute.params
      .switchMap((params: BlogEntryRouteParams) => blog.getBlogEntry(params.date, params.urlSlug));

    this.trustedBody = this.blogEntry
      .map(blogEntry => blogEntry ? domSanitizer.bypassSecurityTrustHtml(blogEntry.body) : undefined);
  }

  ngOnInit() {
    this.loadSubscription = this.activatedRoute.params
      .switchMap((params: BlogEntryRouteParams) => this.blog.loadBlogEntry(params.date, params.urlSlug))
      .subscribe(blogEntry => { this.notFound.next(blogEntry === undefined); });
  }

  ngOnDestroy() {
    if (this.loadSubscription !== undefined) {
      this.loadSubscription.unsubscribe();
      this.loadSubscription = undefined;
    }
  }
}
