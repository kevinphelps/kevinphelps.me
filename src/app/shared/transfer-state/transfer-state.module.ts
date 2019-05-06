import { ModuleWithProviders, NgModule } from '@angular/core';

import { TransferStatePipe } from './transfer-state.pipe';
import { transferStateServiceInitProvider } from './transfer-state.service';

@NgModule({
  declarations: [TransferStatePipe],
  exports: [TransferStatePipe]
})
export class TransferStateModule {
  static forRoot(): ModuleWithProviders<TransferStateModule> {
    return {
      ngModule: TransferStateModule,
      providers: [transferStateServiceInitProvider]
    };
  }
}
