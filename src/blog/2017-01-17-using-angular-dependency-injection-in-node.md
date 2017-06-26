---
title: Using Angular Dependency Injection In Node
description: Angular's dependency injection system can be used to manage dependencies in any Javascript application. As an example, I will
  demonstrate how to use it in a generic Node application.
---

## Brief Introduction to Dependency Injection in Angular

Angular's dependency injection system is core to the framework. Is is used to expose framework services to the running application and to
inject an application's services into its own components and services.

In an Angular app, this happens more or less behind the scenes. The programer only needs to 1) add the `@Injectable` decorator to classes
and 2) import modules and declare providers when creating the `NgModule`.

```typescript
@NgModule({
  declarations: [
    AppComponent,
    ...
  ],
  imports: [
    HttpModule,
    ...
  ],
  providers: [
    AuthenticationService,
    WidgetService,
    { provide: ErrorService: use: SomeErrorService }
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }
```

Each `NgModule` holds an injector instance and uses it to instantiate whatever components it needs to render the application. But before a
component can be instantiated, its dependencies, whether they are framework services like `Http`, services defined by the application
itself, or services from third-party libraries, must be resolved (including dependencies of dependencies and so on).

>This is beauty of dependency injection: it allows for seamless access to framework services *and* seamless code re-use within the
application itself.

### Using Angular's Dependency Injection in Node

Because Angular is designed to be a modular system, we can import
[RelectiveInjector)(https://angular.io/docs/ts/latest/api/core/index/ReflectiveInjector-class.html)
from the `@angular/core` project in order to use the Angular dependency injection system to manage dependencies in any Javascript
application. As an example, I will demonstrate how to use it in a generic Node application.

**Required project dependencies:**
@angular/core, reflect-metadata, and rxjs (not used directly, but required by @angular/core).<br />
(Run `yarn add @angular/core reflect-metadata rxjs` or `npm install --save-dev @angular/core reflect-metadata rxjs`.)

First, we **define our services**. For this example, I will define two services: `ApiService` and `WidgetService`. The `WidgetService` will
require an instance of (i.e. be dependent on) `ApiService`.

```typescript
// api.service.ts

import { Injectable } from '@angular/core';

const data = {
  'widgets': [
    { 'id': 1, 'name': 'Toy Car' },
    ...
  ]
};

@Injectable()
export class ApiService {
  constructor() {
  }

  get(path: string): any[] {
    return data[path];
  }
}

// widget.service.ts

import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable()
export class WidgetService {
  constructor(private api: ApiService) {
  }

  get(): any[] {
    return this.api.get('widgets');
  }
}
```

Next, we will **define our providers**. I usually do this in a separate file for code organiziation purposes be that's not required. At
minumum, the `providers` array contains a list of classes that can be instantiatied by the injector. Refer to the
(docs)[https://angular.io/docs/ts/latest/guide/dependency-injection.html#!#injector-providers] for other providers you can use. Note that
all dependencies of any included provider must also be "provided."

```typescript
// providers.ts

import { ApiService } from './services/api.service';
import { WidgetService } from './services/widget.service';

export const providers = [
  ApiService,
  WidgetService
];
```

And finally, we will **create and use the injector**.

```typescript
// index.ts

import 'reflect-metadata';

import { ReflectiveInjector } from '@angular/core';

import { providers } from './providers';
import { WidgetService } from './services/widget.service';

const injector = ReflectiveInjector.resolveAndCreate(providers);
const widgets: WidgetService = injector.get(WidgetService);

console.log(widgets.get());
```

The magic happens when we call `injector.get(WidgetService)`. The injector handles resolving and instantiating dependencies for us and just
gives us the instance we requested. In this example, the injector first instantiates an `ApiService` and then uses it to instantiate a
`WidgetService`.

This is an extemely simple example of a very powerful tool. This technique can be used in a relatively complex [Express](http://expressjs.com/)
server or to share services between an Angular app running in an [Electron](http://electron.atom.io/) app and a companion CLI interface.
I have done both, and it has worked extremely well.

[Full code sample on GitHub](https://github.com/kevinphelps/blog-companion-projects/tree/master/using-angular-dependency-injection-in-node)
