import { Pipe } from '@angular/core';

@Pipe({
  name: 'countryCurrency',
})
export class CurrencyPipe {
  // This method will transform currency/number with Currency symbol
  transform(val: string, companyCurrency: string, companyLocale: string) {
    if (
      companyCurrency === null ||
      companyCurrency === undefined ||
      companyLocale === null ||
      companyLocale === undefined
    ) {
      return new Intl.NumberFormat('en-IN', {
        //locale
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 3,
      }).format(Number(val));
    } else {
      return new Intl.NumberFormat(companyLocale, {
        //locale
        style: 'currency',
        currency: companyCurrency,
        minimumFractionDigits: 3,
      }).format(Number(val));
    }
  }
}
