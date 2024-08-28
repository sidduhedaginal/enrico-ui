import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RateCardMasterService {

  constructor(private http: HttpClient,  @Inject ('Vendor_URL') private vendor_url :string) { }

  getRateCardListByVendorID(vendorId:any){
    return this.http.get(
      `${this.vendor_url}/api/vendors/get-vendor-ratecards?vendorId=${vendorId}`
    );
  }

  getCompanyVendorID(vendorId:any){
    return this.http.get(
      `${this.vendor_url}/api/vendors/get-company-details?vendorId=${vendorId}`
    );
  }

  createRateCard(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/create-vendor-ratecard`,input
    );
  }

  updateRateCard(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/update-vendor-ratecard`,input
    );
  }

  deleteRateCard(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/Delete-vendor-ratecard`,input
    );
  }

  deleteMultipleRateCard(input:any){
    return this.http.post(
      `${this.vendor_url}/api/vendors/MultiDelete-vendor-ratecard`,input
    );
  }
}
