import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
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

  private originalTitle: string;
  private loadSubscription: Subscription;

  constructor(
    domSanitizer: DomSanitizer,
    private meta: Meta,
    private title: Title,
    private activatedRoute: ActivatedRoute,
    private blog: AppBlogService) {
    this.blogEntry = activatedRoute.params
      .switchMap((params: BlogEntryRouteParams) => blog.getBlogEntry(params.date, params.urlSlug))
      .do(blogEntry => { this.landOnBlogEntry(blogEntry); });

    this.trustedBody = this.blogEntry
      .map(blogEntry => blogEntry ? domSanitizer.bypassSecurityTrustHtml(blogEntry.body) : undefined);
  }

  ngOnInit() {
    this.originalTitle = this.title.getTitle();

    this.loadSubscription = this.activatedRoute.params
      .switchMap((params: BlogEntryRouteParams) => this.blog.loadBlogEntry(params.date, params.urlSlug))
      .subscribe(blogEntry => { this.notFound.next(blogEntry === undefined); });
  }

  ngOnDestroy() {
    this.title.setTitle(this.originalTitle);

    if (this.loadSubscription !== undefined) {
      this.loadSubscription.unsubscribe();
      this.loadSubscription = undefined;
    }
  }

  private landOnBlogEntry(blogEntry: BlogEntry) {
    if (blogEntry !== undefined) {
      this.title.setTitle(blogEntry.title);
      this.meta.updateTag({ name: 'description', content: blogEntry.description });
      this.meta.updateTag({ name: 'twitter:title', content: blogEntry.title });
      this.meta.updateTag({ name: 'twitter:description', content: blogEntry.description });
      this.meta.updateTag({ property: 'og:url', content: `https://kevinphelps.me${blogEntry.url}` });
      this.meta.updateTag({ property: 'og:title', content: blogEntry.title });
      this.meta.updateTag({ property: 'og:description', content: blogEntry.description });
    }
  }
}
