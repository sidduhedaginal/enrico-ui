import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private http: HttpClient) {}
  private API_URL = environment.API_URL;
  private url = environment.commonAPI;
  loader = new BehaviorSubject<boolean>(false);

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getUserProfile() {
    const url: string = `${this.API_URL}user-profile.json`;
    return this.http.get(url, this.httpOptions);
  }

  getNotifications() {
    return this.http.get(`${this.API_URL}notification.json`);
  }

  getProfileRoles() {
    const urlForUsers = environment.commonAPI;
    const url = `${urlForUsers}/Account/my-profile`;
    return this.http.get(url);
  }

  getVendorProfile(){
    const baseUrl = environment.commonAPI;
    const url = `${baseUrl}/vendors/my-profile`;
    return this.http.get(url);
  }


}
