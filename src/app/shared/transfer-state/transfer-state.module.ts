import { ModuleWithProviders, NgModule } from '@angular/core';

import { TransferStatePipe } from './transfer-state.pipe';
import { transferStateServiceInitProvider } from './transfer-state.service';
import { IsPrerenderingFunction, IS_PRERENDERING } from './transfer-state.tokens';

@NgModule({
  declarations: [TransferStatePipe],
  exports: [TransferStatePipe]
})
export class TransferStateModule {
  static forRoot(isPrerendering: IsPrerenderingFunction): ModuleWithProviders<TransferStateModule> {
    return {
      ngModule: TransferStateModule,
      providers: [transferStateServiceInitProvider, { provide: IS_PRERENDERING, useValue: isPrerendering }]
    };
  }
}
