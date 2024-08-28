import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private http: HttpClient,
    @Inject('Vendor_URL') private vendor_url: string
  ) {}

  getOpenSOWJDDetails(vendorId: any) {
    return this.http.get(`${this.vendor_url}/api/OpenSowJd/${vendorId}`);
  }

  getSOWJDDocuments(sowjdId: any) {
    return this.http.get(
      `${this.vendor_url}/api/OpenSowJd/sowjd-documents/${sowjdId}`
    );
  }

  getVendorRFQTechEvaluation(vendorId: any) {
    return this.http.get(`${this.vendor_url}/api/MySubmissions/${vendorId}`);
  }
  withdraw(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/MySubmissions/rfq-withdraw`,
      input
    );
  }
}
