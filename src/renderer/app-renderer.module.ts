import { NgModule } from '@angular/core';

import { AppModule } from './../app/app.module';
import { injectStateListenerProvider } from './inject-state';

@NgModule({
  imports: [
    AppModule
  ],
  providers: [
    injectStateListenerProvider,
  ],
  exports: [
    AppModule
  ]
})
export class AppRendererModule {
}
