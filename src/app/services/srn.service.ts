import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SrnService {
  private vendor_url = environment.vendor_API;

  constructor(private http: HttpClient) {}

  vendorSrn = new Subject();

  getBillingMonthData() {
    return this.http.get(
      `${this.vendor_url}/api/srn/get-SRNBilling-PeriodMonths`
    );
  }

  getSowjdForSRN(vendorId: string, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('signoffNumber', searchValue);
    }
    return this.http.get(
      `${this.vendor_url}/api/srn/Srn-GetSowJdRequestBy-Vendor/${vendorId}`,
      {
        params,
      }
    );
  }

  getSowjdMasterData(vendorId: any, searchValue?: string) {
    return this.http.get(
      `${this.vendor_url}/api/srn/Srn-GetSowJdRequestBy-Vendor/${vendorId}`
    );
  }
  getVendorDetailsData(vendorid: any) {
    return this.http.get(
      `${this.vendor_url}/api/srn/Srn-GetVendorDetails-Vendor/${vendorid}`
    );
  }
  getOnBillingMonthChange(billingMonthId: string) {
    return this.http.get(
      `${this.vendor_url}/api/srn/Srn-GetPeriodStartDateEndDate-ForMonth/${billingMonthId}`
    );
  }
  getPurchaseOrderDetails(
    vendorId: any,
    sowjdid: string,
    monthId: string,
    technicalProposalId: string
  ) {
    return this.http.get(
      `${this.vendor_url}/api/srn/Srn-GetPurchaseOrderDetails/${vendorId}/${sowjdid}/${monthId}/${technicalProposalId}`
    );
  }
  onPurchageOrderChange(poid: string) {
    return this.http.get(`${this.vendor_url}/api/srn/Srn-GetLineItems/${poid}`);
  }
  createSRN(srnData: any) {
    return this.http.post(`${this.vendor_url}/api/srn/create-srn`, srnData);
  }

  ResubmitSRN(srnData: any) {
    return this.http.post(`${this.vendor_url}/api/srn/Resubmit-srn`, srnData);
  }

  getSrnListByVendor(vendorid: string) {
    return this.http.get(`${this.vendor_url}/api/srn/srnlist/${vendorid}`);
  }

  withdrawVendorSRN(data: object) {
    const url = `${this.vendor_url}/api/srn/srn-withdrawn`;
    return this.http.post(url, data);
  }

  getSrnDetailsbyid(id: string) {
    return this.http.get(`${this.vendor_url}/api/srn/srn/${id}`);
  }

  deleteSRNDocId(docId: string) {
    return this.http.get(
      `${this.vendor_url}/api/srn/delete-srn-document/${docId}`
    );
  }

  getSRNDetailBySrnId(srnId: string) {
    return this.http.get(`${this.vendor_url}/api/srn/details/${srnId}`);
  }

  getEditSRNDetailBySrnId(srnId: string) {
    return this.http.get(
      `${this.vendor_url}/api/srn/srn-edit-details/${srnId}`
    );
  }

  getSRNDocuments(srnId: string) {
    return this.http.get(
      `${this.vendor_url}/api/srn/get-srn-documents/${srnId}`
    );
  }

  getSRNCommentsData(id: string) {
    return this.http.get(`${this.vendor_url}/api/srn/comments/${id}`);
  }
}
