import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VendorService {
  private vendor_url = environment.vendor_API;

  data = JSON.parse(localStorage.getItem(environment.localStorageKeyWord));
  vendorId = this.data?.profile?.vendor_id; //'0B0C8FDC-62BA-424C-A4A6-CB466D2D684B'
  vendorSAPId = this.data?.profile?.vendor_sap_id; //97259048

  constructor(private http: HttpClient) {}

  getRFQDetailByRfqId(rfqId: string) {
    return this.http.get(`${this.vendor_url}/api/rfq/rfq-details/${rfqId}`);
  }

  getODCList(data: any) {
    let odcObj = {
      vendorid: data.vendorId,
      monthid: data.monthId,
      companyid: data.companyId,
    };
    return this.http.post(`${this.vendor_url}/api/srn/odc-masterdata`, odcObj);
  }

  getSignoffDetailByTpId(tpId: string) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-sowjd-TechProposal-Details?technicalProposalId=${tpId}`
    );
  }
  getVendorSignoffRemarks(tpId: string) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/my-Technical-proposal-remarks/${tpId}`
    );
  }
  getResource(tpId: string) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-Technicalproposal-resources/${tpId}`
    );
  }
  createResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-Technicalproposal-resource`,
      input
    );
  }

  createWorkPackageResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-Technicalproposal-resourceforwp`,
      input
    );
  }

  deleteResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Delete-Technicalproposal-resources`,
      input
    );
  }
  getWorkPackage(tpId: string) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-sowjd-tpworkpackage-details/${tpId}`
    );
  }
  createWorkPackage(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-sowjd-tpworkpackage`,
      input
    );
  }
  deleteWorkPackage(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Delete-sowjd-tpworkpackage-details`,
      input
    );
  }
  getProposalDocuments(tpId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-techproposal-documents/${tpId}`
    );
  }

  getAllDocumentsBySowJdId(sowJdId: string) {
    return this.http.get(
      `${this.vendor_url}/api/OpenSowJd/sowjd-documents/${sowJdId}`
    );
  }

  postSignOffRemarksForm(data: object) {
    const url = `${this.vendor_url}/api/techproposal/Technical-proposal-status-update`;
    return this.http.post(url, data);
  }

  uploadProposalDocuments(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-techproposal-documents`,
      input
    );
  }
  deleteProposalDocuments(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Delete-techproposal-documents`,
      input
    );
  }
  submitTechnicalProposal(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/TechProposal-saveOr-submit`,
      input
    );
  }
  // Fliter Chips API
  getColFiltersVendor(menuid: number, vendorid: string) {
    const url = `${this.vendor_url}/api/GridSettings/get-column-filters?menuId=${menuid}&vendorid=${vendorid}`;
    return this.http.get(url);
  }
  saveColFiltersVendor(data: any) {
    const url = `${this.vendor_url}/api/GridSettings/save-column-filters`;
    return this.http.post(url, data);
  }
  //Save col
  saveColSettingsVendor(data: any) {
    const url = `${this.vendor_url}/api/GridSettings/save-setting-column`;
    return this.http.post(url, data);
  }
  getdeafultcolmunsVendor(menuid: number, vendorid: string) {
    const url = `${this.vendor_url}/api/GridSettings/get-default-columns?menuId=${menuid}&vendorid=${vendorid}`;
    return this.http.get(url);
  }
}
