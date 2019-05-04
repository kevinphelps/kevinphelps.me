import { Inject, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

import { TransferStateService } from './transfer-state.service';
import { IsPrerenderingFunction, IS_PRERENDERING } from './transfer-state.tokens';

@Pipe({
  name: 'appTransferState'
})
export class TransferStatePipe implements PipeTransform {
  constructor(
    private readonly transferStateService: TransferStateService,
    @Inject(IS_PRERENDERING) private readonly isPrerendering: IsPrerenderingFunction
  ) {}

  transform<T>(source: Observable<T>, transferStateKey: string) {
    if (this.isPrerendering()) {
      return source.pipe(
        tap(value => {
          this.transferStateService.set(transferStateKey, value);
        })
      );
    } else {
      return source.pipe(startWith(this.transferStateService.get(transferStateKey)));
    }
  }
}
