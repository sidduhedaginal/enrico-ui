import { Pipe } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'numberFormat',
})
export class NumericFormatPipe {
  // This method will transform currency/number withot Currency symbol
  // Numeric Format India -> 1.3-3 and Vietnam -> 1.0.0
  transform(
    value: number,
    companyLocale: string,
    numericFormat: string
  ): string {
    if (
      companyLocale === null ||
      companyLocale === undefined ||
      numericFormat === null ||
      numericFormat === undefined
    ) {
      return formatNumber(value, 'en-IN', '1.3-3');
    } else {
      return formatNumber(value, companyLocale, numericFormat);
    }
  }
}
