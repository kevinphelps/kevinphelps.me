import { DOCUMENT } from '@angular/common';
import { ApplicationRef, APP_ID, APP_INITIALIZER, Inject, Injectable, Injector, PlatformRef, Provider } from '@angular/core';
import { EMPTY } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

interface State {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class TransferStateService {
  private state: State;

  constructor(
    private readonly applicationRef: ApplicationRef,
    @Inject(APP_ID) private readonly appId: string,
    @Inject(DOCUMENT) private readonly document: Document
  ) {
    this.state = environment.node ? {} : this.deserializeState();
  }

  init() {
    return environment.node ? this.serializeStateWhenStable() : EMPTY;
  }

  get(key: string) {
    return this.state[key];
  }

  set(key: string, value: any) {
    this.state[key] = value;
  }

  private serializeStateWhenStable() {
    return this.applicationRef.isStable.pipe(
      filter(isStable => isStable),
      first(),
      tap(() => {
        this.serializeState();
      })
    );
  }

  private serializeState() {
    const script = this.document.createElement('script');
    script.id = `${this.appId}-state`;
    script.setAttribute('type', 'application/json');
    script.textContent = escapeHtml(JSON.stringify(this.state));
    this.document.body.appendChild(script);
  }

  private deserializeState() {
    const script = this.document.getElementById(`${this.appId}-state`);

    return script && script.textContent ? JSON.parse(unescapeHtml(script.textContent)) : {};
  }
}

export function transferStateServiceInitFactory(injector: Injector) {
  return () => {
    const platformRef = injector.get(PlatformRef);
    const transferStateService = injector.get(TransferStateService);

    const initSubscription = transferStateService.init().subscribe();

    platformRef.onDestroy(() => {
      initSubscription.unsubscribe();
    });
  };
}

export const transferStateServiceInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: transferStateServiceInitFactory,
  deps: [Injector],
  multi: true
};

function escapeHtml(text: string): string {
  const escapedText: { [key: string]: string } = {
    '&': '&a;',
    '"': '&q;',
    "'": '&s;',
    '<': '&l;',
    '>': '&g;'
  };

  return text.replace(/[&"'<>]/g, s => escapedText[s]);
}

function unescapeHtml(text: string): string {
  const unescapedText: { [key: string]: string } = {
    '&a;': '&',
    '&q;': '"',
    '&s;': "'",
    '&l;': '<',
    '&g;': '>'
  };

  return text.replace(/&[^;]+;/g, s => unescapedText[s]);
}
