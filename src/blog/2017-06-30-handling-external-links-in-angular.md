---
title: Handling External Links in Angular
description: Use an Angular directive to automatically open external links in a new tab and patch the target="_blank" security vulnerability
  by setting rel="noopenner noreferer".
---

## Handling External Links in Angular

If you want all external links in your Angular app to open in a new tab, making sure each link tag has `target="_blank"` set can be very
time consuming, tedious, and error prone. But we can use a directive on the `a` element to have Angular take care of this for us! And you
can have the directive also set `rel="noopener noreferrer"` on all external links to disallow setting `window.opener` in the target window.
This is patches a [very serious phishing vulernability](https://www.jitbit.com/alexblog/256-targetblank---the-most-underestimated-vulnerability-ever/).

The directive code is very simple. We add an `@Input()` for the `href` property bind to the `rel` and `target` attibutes using
`@HostBinding`. In `ngOnInit`, we can simply set the `rel` and `target` attributes (if not already set) of the link if the `href` points to
an external site. You can use any condition you want here. I just check for urls that start with "http" which indicates that the link is not
relative to the app.

Note that initializing `rel` and `target` to an empty string when running in a browser prevents the `HostBinding` from setting the
attributes to `"undefined"` as that would make non-external links open and new tab. When rendering in node, Angular ignores undefined host
bindings and doesn't add the attibute.

Here is sample code for the directive:

```typescript
import { Directive, HostBinding, Inject, Input, OnInit } from '@angular/core';

const browser = typeof window !== 'undefined';

@Directive({ selector: 'a' })
export class LinkDirective implements OnInit {
  @Input() href: string;
  @HostBinding('rel') rel: string;
  @HostBinding('target') target: string;

  constructor() { }

  ngOnInit() {
    if (this.href !== undefined && this.href.startsWith('http')) {
      this.rel = this.rel || 'noopener noreferrer';
      this.target = this.target || '_blank';
    }

    if (browser && this.rel === undefined) {
      this.rel = ''; // prevent browser from setting `rel="undefined"`
    }

    if (browser && this.target === undefined) {
      this.target = ''; // prevent browser from setting `target="undefined"`
    }
  }
}
```

Don't forget to declare the directive in your `AppModule`, `SharedModule`, or wherever you declare shared directives and components:

```typescript
@NgModule({
  declarations: [
    LinkDirective
  ]
})
export class AppModule { }
```

Using a directive is a easy way to make sure your external links always open in a new tab and help protect against exposing your users to
the `window.opener` vulnerability with less headache!