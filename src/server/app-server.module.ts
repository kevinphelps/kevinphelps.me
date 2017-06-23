import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';

import { AppComponent } from './../app/app.component';
import { AppModule } from './../app/app.module';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    NoopAnimationsModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppServerModule { }
