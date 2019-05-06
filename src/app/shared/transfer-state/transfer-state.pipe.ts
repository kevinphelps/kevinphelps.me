import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { startWith, tap } from 'rxjs/operators';

import { environment } from './../../../environments/environment';
import { TransferStateService } from './transfer-state.service';

@Pipe({
  name: 'appTransferState'
})
export class TransferStatePipe implements PipeTransform {
  constructor(private readonly transferStateService: TransferStateService) {}

  transform<T>(source: Observable<T>, transferStateKey: string) {
    if (environment.node) {
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
