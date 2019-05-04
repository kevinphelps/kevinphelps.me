import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

import { BlogEntry, BlogService } from './../../shared/services/blog-service';

@Component({
  selector: 'app-blog-entry',
  templateUrl: './blog-entry.component.html'
})
export class BlogEntryComponent {
  readonly blogEntry: Observable<BlogEntry>;
  readonly notFound = new BehaviorSubject(false);

  constructor(private readonly title: Title, private meta: Meta, private activatedRoute: ActivatedRoute, private blogService: BlogService) {
    this.blogEntry = this.getBlogEntry().pipe(shareReplay(1));
  }

  private getBlogEntry() {
    return this.activatedRoute.params.pipe(
      switchMap(({ blogEntry }) => this.blogService.getBlogEntry(blogEntry)),
      tap(blogEntry => {
        this.landOnBlogEntry(blogEntry);
      })
    );
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
