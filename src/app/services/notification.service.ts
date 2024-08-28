import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private http: HttpClient) {}
  private baseUrl = environment.commonAPI;

    /////////////////////////////////////////////////////////////////////////////

    getNotifications(FromDate : string, ToDate : string, IsSeen? : boolean){
      let url = `${this.baseUrl}/notifications?FromDate=${FromDate}&ToDate=${ToDate}`;
      if(IsSeen) url  += `&IsSeen=${IsSeen}`;
      return this.http.get(url);
    }
  
    updateNotification(data:any){
      let url =  `${this.baseUrl}/notifications/update-to-seen`;
      return this.http.put(url,data);
    }
  
    postNotifications(data: any){
      const url = `${this.baseUrl}/notifications`;
      return this.http.post(url, data);
    }
    
    /////////////////////////////////////////////////////////////////////////////
    getVendorNotifications(fromDate:string, toDate:string, isSeen? :boolean){
      let url = `${this.baseUrl}/vendors/notifcations?FromDate=${fromDate}&ToDate=${toDate}`;
      if(isSeen) url += `&IsSeen=${isSeen}`;
      return this.http.get(url);
    }
  
    updateVendorNotification(data:any){
      let url =  `${this.baseUrl}/vendors/update-to-seen`;
      return this.http.put(url,data);
    }
  
    // postNotificationsVendor(index:number){
    //   const url = `${this.baseUrl}/vendors/insert-vendor-notification`;
    //   const data = {
    //     "featureId": "58ea73b0-d5b6-4861-98c5-15f81c46470e",
    //     "dataObjectId": "dummy",
    //     "notificationTitle": index + "",
    //     "notificationDescription": index + "description",
    //     "vendorIds": [
    //       "091c2e8f-17aa-4e2f-beb1-010808ca89bd"
    //     ]
    //   };
    //   return this.http.post(url,data);
    // }
  
}
