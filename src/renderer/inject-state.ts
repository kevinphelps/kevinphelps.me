import { ApplicationRef, APP_BOOTSTRAP_LISTENER, Provider, RendererFactory2, ViewEncapsulation } from '@angular/core';
import { PlatformState } from '@angular/platform-server';
import { Store } from '@ngrx/store';

import { AppState } from './../app/shared/store/app.state';

export const injectStateListenerProvider: Provider = {
  provide: APP_BOOTSTRAP_LISTENER,
  multi: true,
  useFactory: injectStateListener,
  deps: [ApplicationRef, PlatformState, RendererFactory2, Store]
};

export function injectStateListener(appRef: ApplicationRef, platformState: PlatformState, rendererFactory: RendererFactory2, store: Store<AppState>) {
  return () => {
    appRef.isStable
      .first(isStable => isStable)
      .mergeMap(() => store.select(state => state).first())
      .subscribe(state => {
        try {
          const document: any = platformState.getDocument();
          const transferredStateString = JSON.stringify(state);
          const renderer = rendererFactory.createRenderer(document, {
            id: '-1',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: {}
          });

          const head = document.head;
          if (head.name !== 'head') {
            throw new Error('Please have <head> as the first element in your document');
          }

          const script = renderer.createElement('script');
          renderer.setValue(script, `window._state=${transferredStateString}`);
          renderer.appendChild(head, script);
        } catch (e) {
          console.error(e);
        }
      });
  };
}
