import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SowjdCommonInfoComponent } from './sowjd-common-info.component';
import { AgGridModule } from 'ag-grid-angular';
import { CurrencyModule } from '../currency-pipe/currency.module';
import { NumericFormatModule } from '../numeric-format-pipe/numeric-format.module';
import { CurrencyPipe } from '../currency-pipe/currency.pipe';
import { NumericFormatPipe } from '../numeric-format-pipe/numeric-format-pipe';

@NgModule({
  declarations: [SowjdCommonInfoComponent],
  imports: [CommonModule, AgGridModule, CurrencyModule, NumericFormatModule],
  exports: [SowjdCommonInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CurrencyPipe, NumericFormatPipe],
})
export class SowjdCommonInfoModule {}
