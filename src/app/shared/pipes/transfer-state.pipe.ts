import { Pipe, PipeTransform } from '@angular/core';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';

@Pipe({
  name: 'appTransferState'
})
export class TransferStatePipe implements PipeTransform {
  constructor(private readonly transferState: TransferState) {}

  transform<T>(source: Observable<T>, key: string) {
    const stateKey = makeStateKey<T>(key);

    if (environment.node) {
      return source.pipe(
        tap(value => {
          this.transferState.set(stateKey, value);
        })
      );
    } else {
      return source.pipe(startWith(this.transferState.get(stateKey, undefined)));
    }
  }
}
