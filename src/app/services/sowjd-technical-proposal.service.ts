import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SowjdTechnicalProposalService {
  private url = environment.apiConfig;

  constructor(private http: HttpClient) {}

  getsowjdTechProposalDetails(sowjdId: string) {
    let params = new HttpParams().set('sowJdId', sowjdId);

    return this.http.get(
      `${this.url}/api/sowjd/get-sowjd-TechProposal-Details`,
      { params }
    );
  }

  getApprovalSignOffDetail(sowjdId: string) {
    return this.http.get(
      `${this.url}/api/sowjd/sowjd-sign-off-details/${sowjdId}`
    );
  }

  getPoRemarksBySowJdId(sowjdId: string) {
    const params = new HttpParams().set('featureCode', 'sowjd');
    return this.http.get(`${this.url}/api/sowjd/sowjd-po-remarks/${sowjdId}`, {
      params,
    });
  }

  dmSignOff(signOffObj: any) {
    return this.http.post(`${this.url}/api/DM/signOff`, signOffObj);
  }

  secSpocSignOff(signOffObj: any) {
    return this.http.post(`${this.url}/api/SecSpoc/signOff`, signOffObj);
  }
}
