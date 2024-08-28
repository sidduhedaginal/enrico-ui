import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class CreateVendorRateCardService {
  // private API_URL = environment.apiConfig;
  constructor(private http: HttpClient) { }
  // createVendorRateCard(formdata:any){
  //   // const url = `https://enrico-dev-si-webapp-appservice2-01.azurewebsites.net/api/VendorRateCardMaster/CreateVendorRateCard`;
  //   // return this.http.post(url,formdata);
  //   return this.http.post(
  //     `https://enrico-dev-si-webapp-appservice2-01.azurewebsites.net/api/VendorRateCardMaster/CreateVendorRateCard`,formdata
  //   );
  // }
  // updateVendorRateCard(formdata:any){
  //   return this.http.post(
  //     `https://enrico-dev-si-webapp-appservice2-01.azurewebsites.net/api/VendorRateCardMaster/CreateVendorRateCard`,formdata
  //   );
  // }
}

