import { ApplicationRef, APP_ID, APP_INITIALIZER, Inject, Injectable, Injector, Provider } from '@angular/core';
import { EMPTY } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';

import { IsPrerenderingFunction, IS_PRERENDERING } from './transfer-state.tokens';

interface State {
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class TransferStateService {
  private state: State;

  constructor(
    private readonly applicationRef: ApplicationRef,
    @Inject(APP_ID) private readonly appId: string,
    @Inject(IS_PRERENDERING) private readonly isPrerendering: IsPrerenderingFunction
  ) {
    this.state = this.isPrerendering() ? {} : deserializeState(this.appId);
  }

  init() {
    return this.isPrerendering() ? this.serializeStateWhenStable() : EMPTY;
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
        serializeState(this.appId, this.state);
      })
    );
  }
}

export function transferStateServiceInitFactory(injector: Injector) {
  return () => {
    const transferStateService = injector.get(TransferStateService);

    transferStateService.init().subscribe();
  };
}

export const transferStateServiceInitProvider: Provider = {
  provide: APP_INITIALIZER,
  useFactory: transferStateServiceInitFactory,
  deps: [Injector],
  multi: true
};

function serializeState(appId: string, state: State) {
  const script = document.createElement('script');
  script.id = `${appId}-state`;
  script.setAttribute('type', 'application/json');
  script.textContent = escapeHtml(JSON.stringify(state));
  document.body.appendChild(script);
}

function deserializeState(appId: string) {
  const script = document.getElementById(`${appId}-state`);

  return script && script.textContent ? JSON.parse(unescapeHtml(script.textContent)) : {};
}

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
