import { NgModule } from '@angular/core';
import { NumericFormatPipe } from './numeric-format-pipe';

@NgModule({
  declarations: [NumericFormatPipe],
  exports: [NumericFormatPipe],
})
export class NumericFormatModule {}
