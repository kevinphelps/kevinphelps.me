---
title: Building a Static Site Using Angular
description: ng-static-site-generator is a webpack-based command line build tool that builds an Angular app and Jekyll-style blog entry html
  files into a static html and css website. It also supports building a client app so you can have static pages that are also capable of
  running dynamic functionality coded in Angular.
---

## Building a Static Site Using Angular

After attending ng-conf 2017, I rewrote my Jekyll site in Angular to learn about rendering with `@angular/platform-server`. But I still
wanted my site to be static. So this weekend, I started playing around with the idea of building a static site/blog based on an Angular app.
The idea is similar to [Gatsby](https://www.gatsbyjs.org/). I wanted to be able to build static static sites using a framework I already
know. And I also wanted to be able to write functionality for the browser within my static site.

The result? `ng-static-site-generator` is a webpack-based command line build tool that builds an Angular app and Jekyll-style blog entry
html files into a static html and css website. It also supports building a client app so you can have static pages that are also capable of
running dynamic functionality coded in Angular. It's not feature-complete yet, but I plan to add more features and options in the near
future. [Check it out on GitHub!](https://github.com/kevinphelps/ng-static-site-generator) Clone [the starter project](https://github.com/kevinphelps/ng-static-site-generator-starter) to get started fast!

### Features
- <input type="checkbox" checked disabled /> Build an Angular app and blog entries into a static html and css website.
- <input type="checkbox" checked disabled /> Build a client app to support dynamic functionality in the browser.
- <input type="checkbox" checked disabled /> Watch build mode to automatically rebuild the site after changes.
- <input type="checkbox" checked disabled /> Generate blog pages from source files written in markdown.
- <input type="checkbox" disabled /> AOT build support for the client app to reduce bundle size.
- <input type="checkbox" disabled /> Server for testing the website when developing and writing blog entries. (`firebase serve` is a good alternative.)

### CLI Commands

- `ng-static-site-generator build`: Builds the static site.
- `ng-static-site-generator watch`: Builds the static site and rebuilds after changes.

### Configuration

`ng-static-static-generator` is configured via a file named `ng-static-static-generator.json` at the root of the project.

```javascript
{
  "distPath": "./dist", // This is where the site will be generated.
  "blogPath": "./src/blog", // This is the folder where your blog entries are located.
  "stylesPath": "./src/styles.scss", // This is the file that contains your global styles.
  "templatePath": "./src/index.html", // This is your template html file. This is passed to HtmlWebpackPlugin.
  "appModule": "./src/app/app.module#AppModule", // This is the path and class name of your AppModule.
  "appRoutes": "./src/app/app-routing.module#routes", // This is the path and export name or your routes.
  "appComponent": "./src/app/app.component#AppComponent", // This is the path and name or your root component.

  // Options for building an optional client app.
  "mainPath": "./src/main.ts", // This is the file that contains the browser bootstrap code.
  "polyfillsPath": "./src/polyfills.ts" // Include this is you need a polyfills bundle.
}
```

### Blog entry source files

`ng-static-site-generator` uses jekyll-style files for blog entries. Files are placed in the `blogPath` folder specifed in `ng-static-static-generator.json`. (Note: Nesting folders within the blog path is not yet supported.)

- filename: `YYYY-MM-DD-url-slug.html` or `YYYY-MM-DD-url-slug.md` (e.g. `2017-06-26-this-is-a-blog-entry.html`)
- file contents: Metadata is given at the top of file delimited by lines containing `---`. Everything after the second `---` is body conten written in html.

Example:

```markdown
---
title: This is the Title of the Blog Entry
description: This is a short description of the blog entry.
customProperty: This is a custom property. (Optional, of course.)
---

##This is the Title of the Blog Entry

This is the content of the blog entry.

<p>You can also write content in html if you want.</p>
```

