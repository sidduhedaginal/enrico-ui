import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SowjdDetailsService {
  constructor(
    private http: HttpClient,
    @Inject('Vendor_URL') private vendor_url: string
  ) {}

  getSOWJDDetailsById(sowjdId: any, vendorId: any) {
    return this.http.get(`${this.vendor_url}/api/rfq/${sowjdId}/${vendorId}`);
  }
  getAllSOWJDDetailsById(sowjdId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-sowjddetails-vendor?sowJdId=${sowjdId}`
    );
  }
  getTechnicalProposalDetailsBySOWJDId(sowjdId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-SowJdRfq-techproposal/${sowjdId}`
    );
  }
  getProposalDocuments(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-Vendor-documents/${rfqId}`
    );
  }
  uploadProposalDocuments(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/create-vendor-documents`,
      input
    );
  }
  deleteProposalDocuments(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/Delete-vendor-documents`,
      input
    );
  }
  getRfqResourceProfileDocuments(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-resource-profiles/${rfqId}`
    );
  }
  uploadRFQResourceProfileDoc(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/create-resource-profiles`,
      input
    );
  }
  deleterfqResourceProdileDoc(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/Delete-resource-profiles`,
      input
    );
  }

  uploadTechnicalProposalDocuments(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-techproposal-documents`,
      input
    );
  }
  getTechicalProposalDocuments(tpId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-techproposal-documents/${tpId}`
    );
  }
  deleteTechnicalProposalDoc(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Delete-techproposal-documents`,
      input
    );
  }
  createTpResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-Technicalproposal-resource`,
      input
    );
  }
  updateTPResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Update-Technicalproposal-resources`,
      input
    );
  }
  getTPResource(tpId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-Technicalproposal-resources/${tpId}`
    );
  }
  deleteTPResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Delete-Technicalproposal-resources`,
      input
    );
  }
  getTPResourceProfileDocuments(tpId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-techproposal-resource-profiles/${tpId}`
    );
  }
  uploadTPResourceProfileDoc(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-techproposal-resource-profiles`,
      input
    );
  }
  deleteTPResourceProdileDoc(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Delete-techproposal-resource-profiles`,
      input
    );
  }
  TPsaveOrSubmit(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/TechProposal-saveOr-submit`,
      input
    );
  }
  sowstatatusNotInterested(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/set-sowjdvendor-status`,
      input
    );
  }
  sowstatatussaveOrSubmit(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/rfq-saveOr-submit`,
      input
    );
  }
  getResource(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-vendor-resources/${rfqId}`
    );
  }

  getWorkPackage(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-workpackage-details/${rfqId}`
    );
  }

  createResource(input: any) {
    return this.http.post(`${this.vendor_url}/api/rfq/create-resource`, input);
  }

  createWorkPackageResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/create-resource-for-WorkPackage`,
      input
    );
  }

  createWorkPackage(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/create-workpackage-details`,
      input
    );
  }

  createTPWorkPackage(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/create-sowjd-tpworkpackage`,
      input
    );
  }

  updateResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/Update-vendor-resources`,
      input
    );
  }
  deleteResource(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/Delete-vendor-resources`,
      input
    );
  }

  deleteWorkPackage(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/rfq/Delete-workpackage-details`,
      input
    );
  }

  getRFQSkillsets(rfqId: any, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('skillsetName', searchValue);
    }
    return this.http.get(
      `${this.vendor_url}/api/rfq/get-vendorSkillset-ByRfqId/${rfqId}`,
      {
        params,
      }
    );
  }

  getTpSkillsets(tpId: any, searchValue?: string) {
    let params;
    if (searchValue) {
      params = new HttpParams().set('skillSetName', searchValue);
    }
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-vendorSkillset-ByTechnicalProposalId/${tpId}`,
      {
        params,
      }
    );
  }
  getGrades(vendorId: any) {
    return this.http.get(
      `${this.vendor_url}/api/vendors/get-AllGrades-ByVendorId/${vendorId}`
    );
  }
  getSignOffDetails(sowJDId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/get-vendorsignoff-Details/${sowJDId}`
    );
  }
  getEligibleForSignOff(rfqId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/sowJd-Eligiblevendor-SignOff/${rfqId}`
    );
  }
  getPoLinkedDetails(sowJDId: any) {
    return this.http.get(
      `${this.vendor_url}/api/techproposal/vendor-po-remarks/${sowJDId}`
    );
  }
  vendorSignOff(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/sowJd-vendor-SignOff`,
      input
    );
  }
  linkThePo(input: any) {
    return this.http.post(
      `${this.vendor_url}/api/techproposal/Add-NewPO`,
      input
    );
  }
}
