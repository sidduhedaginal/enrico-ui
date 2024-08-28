import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private url = environment.apiConfig;

  constructor(private http: HttpClient) {}
  verifyToken() {
    let headerOptions = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      skip: 'true',
    });
    const requestOptions = {
      headers: headerOptions,
      withCredentials: true,
    };
    return this.http.get(`${this.url}/Auth/GetNTID`, requestOptions);
  }
}
