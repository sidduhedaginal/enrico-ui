import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  isLoading: boolean = false;
  constructor(private http: HttpClient) {}
  setShowLoading() {
    this.isLoading = true;
  }
  setDisableLoading() {
    this.isLoading = false;
  }

  getCountryCurrency(): Observable<any> {
    return this.http.get('../../../../assets/country-currency.json');
  }
  getCountryDetailByCurrency(currency: string) {
    switch (currency) {
      case 'INR':
        return {
          countryCurrency: 'INR',
          locale: 'en-IN',
          numericFormat: '1.3-3',
        };
      case 'VND':
        return {
          countryCurrency: 'VND',
          locale: 'en-VN',
          numericFormat: '1.3-3',
        };
      case 'JPY':
        return {
          countryCurrency: 'JPY',
          locale: 'ja-JP',
          numericFormat: '1.3-3',
        };
      case 'EUR':
        return {
          countryCurrency: 'EUR',
          locale: 'de-DE',
          numericFormat: '1.3-3',
        };
      case 'USD':
        return {
          countryCurrency: 'USD',
          locale: 'en-US',
          numericFormat: '1.3-3',
        };
      default:
        return {
          countryCurrency: 'INR',
          locale: 'en-IN',
          numericFormat: '1.3-3',
        };
    }
  }
}
