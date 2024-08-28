import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SowjdSecSpocService {
  private url = environment.apiConfig;

  constructor(private http: HttpClient) {}

  getAllSowJdMyRequest() {
    return this.http.get(
      `${this.url}/api/SecSpoc/all-draft-requests-sowjd-list/asc`
    );
  }

  getAllSowJdMyAction() {
    return this.http.get(
      `${this.url}/api/SecSpoc/group-all-approval-pending-sowjd-list/asc`
    );
  }

  delegationRequest(sowJdDH: any) {
    return this.http.post(
      `${this.url}/api/delegation/delegate-request`,
      sowJdDH
    );
  }

  sowJdActionBySecSpoc(sowJdSecSpoc: any) {
    return this.http.post(
      `${this.url}/api/SecSpoc/acions-by-sec-spoc`,
      sowJdSecSpoc
    );
  }

  sowJdActionSecSpocRFQFloat(RFQFloatObj: any) {
    return this.http.post(
      `${this.url}/api/SecSpoc/rfq-float-by-sec-spoc`,
      RFQFloatObj
    );
  }

  getUsers() {
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }
}
