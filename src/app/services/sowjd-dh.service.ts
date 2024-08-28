import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SowjdDhService {
  private url = environment.apiConfig;

  constructor(private http: HttpClient) {}

  getAllSowJdMyRequest() {
    return this.http.get(
      `${this.url}/api/department-head/all-draft-requests-sowjd-list/asc`
    );
  }

  getRFQDetailByRfqId(rfqId: string) {
    const params = new HttpParams().set('featureCode', 'request_for_quote');
    return this.http.get(`${this.url}/api/sowjd/sowjd-details-rfqId/${rfqId}`, {
      params,
    });
  }

  getSignOffDetailByTPId(tpId: string) {
    return this.http.get(
      `${this.url}/api/SowJdTechnicalProposalController/get-sowjd-TechProposal-Details?technicalProposalId=${tpId}`
    );
  }

  deletePO(poNumber: string, tpId: string) {
    const params = new HttpParams().set('featureCode', 'technical_sign_off');
    const poObj = {
      tpId,
      poNumber,
    };
    return this.http.post(`${this.url}/api/sowjd/sowjd/po/DeletePO`, poObj, {
      params,
    });
  }

  getResourceByTPId(tpId: any) {
    return this.http.get(
      `${this.url}/api/SowJdTechnicalProposalController/get-Technicalproposal-resources/${tpId}`
    );
  }

  getWorkPackageByTPId(tpId: any) {
    return this.http.get(
      `${this.url}/api/SowJdTechnicalProposalController/get-sowjd-tpworkpackage-details/${tpId}`
    );
  }

  getAllSowJdMyAction() {
    return this.http.get(
      `${this.url}/api/department-head/group-all-approval-pending-sowjd-list/asc`
    );
  }
  getAllDocumentsBySowJdId(sowJdId: string) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    return this.http.get(`${this.url}/api/sowjd/sowjd-documents/${sowJdId}`, {
      params,
    });
  }

  getSkillsets(sowJdId: string) {
    return this.http.get(`${this.url}/api/sowjd/sowjd-skillset/${sowJdId}`);
  }

  getVendorsSuggestions(sowJdId: string) {
    return this.http.get(`${this.url}/api/sowjd/sowjd-vendors/${sowJdId}`);
  }

  getProposalDocuments(rfqId: any) {
    return this.http.get(`${this.url}/api/rfq/get-Vendor-documents/${rfqId}`);
  }

  getResource(rfqId: any) {
    return this.http.get(`${this.url}/api/rfq/get-vendor-resources/${rfqId}`);
  }

  getWorkPackage(rfqId: any) {
    return this.http.get(
      `${this.url}/api/rfq/get-workpackage-details/${rfqId}`
    );
  }

  getApprovedStatus(sowJdId: string) {
    return this.http.get(`${this.url}/api/sowjd/sowjd-approvals/${sowJdId}`);
  }

  getSowJdRequestById(sowJdId: string) {
    return this.http.get(
      `${this.url}/api/sowjd/sowjd-request-by-id/${sowJdId}`
    );
  }

  updateVendors(sowJdObj: any) {
    return this.http.post(`${this.url}/api/sowjd/update-vendors`, sowJdObj);
  }

  sowJdActionByDH(sowJdDH: any) {
    return this.http.post(
      `${this.url}/api/department-head/sowjd-action-by-department-head`,
      sowJdDH
    );
  }

  delegationDHRequest(delegationObj: any) {
    return this.http.post(
      `${this.url}/api/delegations/sowjd-approver-delegate`,
      delegationObj
    );
  }

  delegationSpocRequest(delegationObj: any) {
    return this.http.post(
      `${this.url}/api/delegations/secspoc-delegation`,
      delegationObj
    );
  }

  vendorSuggestions(sowJdId: string) {
    return this.http.get(
      `${this.url}/api/sowjd/sowjd-vendor-suggestions/${sowJdId}`
    );
  }

  purchaseOrderList(tpId: string, searchValue?: string) {
    let params = new HttpParams();

    if (searchValue) {
      params = params.append('pONumber', searchValue);
    }

    params = params.append('featureCode', 'technical_sign_off');

    return this.http.get(
      `${this.url}/api/sowjd/assign-po-details-TechnicalProposalId/${tpId}`,
      {
        params,
      }
    );
  }

  purchaseOrderByTpId(data: any) {
    const params = new HttpParams().set('featureCode', 'technical_sign_off');
    return this.http.post(`${this.url}/api/sowjd/Add-NewPO`, data, { params });
  }
}
