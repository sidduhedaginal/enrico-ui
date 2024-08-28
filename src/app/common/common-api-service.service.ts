import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CommonApiServiceService {

  constructor(private http: HttpClient) {}
  private baseUrl = environment.commonAPI;

  testApi(endPoint : string){ 
    const url = `${this.baseUrl}/${endPoint}`;
    return this.http.get(url);  
  }

  testPostApi(endPoint: string, data:any){
    const url = `${this.baseUrl}/${endPoint}`;
    return this.http.post(url, data);
  }

  //////////////////////////////////////////////////////////////////////// 
  getVendors(){
    const url = `${this.baseUrl}/vendors/home/menus`;
    return this.http.get(url);
  }

  ///////////////////////////////////////////////////////////////////////
  getBusinessRole(){
    const url = `${this.baseUrl}/api/BusinessRole`;
    return this.http.get(url);  
  }
  addBusinessRole(data: any){
    const url = `${this.baseUrl}/api/BusinessRole`;
    return this.http.post(url, data);  
  }
  updateBusinessRole(data: any){
    const url = `${this.baseUrl}/api/BusinessRole`;
    return this.http.put(url, data);  
  }
  getBusinessRoleById(id:string){
    const url = `${this.baseUrl}/api/BusinessRole/${id}`;
    return this.http.get(url);  
  }
  deleteBusinessRoleById(id : string){
    const url = `${this.baseUrl}/api/BusinessRole/${id}`
    return this.http.delete(url);
  }
   /////////////////////////////////////////////////////////////////////////

  getUsersInBusinessRoles(entityId: string,sortDirection : number, pageIndex : number, pageSize: number){
    const url = `${this.baseUrl}/users-in-role?EntityId=${entityId}&SortDirection=${sortDirection}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    return this.http.get(url);  
  }

  getEntities(){
    const url =`${this.baseUrl}/entities`;
    return this.http.get(url);
  }

  addBusinessRoleToUser(data:any){
    const url = `${this.baseUrl}/users-in-role/insert-users-on-role`;
    return this.http.post(url, data);  
  }

  updateStatusUserInRole(data: any){
    const url = `${this.baseUrl}/users-in-role/update-status?roleId=${data.roleId}&ntid=${data.ntiDs}`;
    return this.http.put(url, {"status" :  data.status});  
  }
  deleteUsersOnRole(data: any){
    const url = `${this.baseUrl}/users-in-role/delete-users-on-role`;
    // return this.http.delete(url, data);
    const options = { body: data};
    return this.http.delete(url, options);  
  }

  // ////////////////////////////////////////////////////////////////////
  getPermissionsOnBusinessRoles(entityId: string, pageIndex : number, pageSize:number){
    //const url =`${this.baseUrl}/permissionsOnBusinessRoles?EntityId=${entityId}`;
    const url =`${this.baseUrl}/permissions-on-business-roles?EntityId=${entityId}&PageIndex=${pageIndex}&PageSize=${pageSize}`;
    return this.http.get(url);
  }

  addOrUpdatePermissionsOnBusinessRoles(data :any){
    const url = `${this.baseUrl}/permissions-on-business-roles/create-or-update`;
    return this.http.post(url, data);  
  }

  getFeaturesAndBusinessForPermissionsOnBusinessRoles(entityId: string){
    const url =`${this.baseUrl}/permissions-on-business-roles/features-and-roles?EntityId=${entityId}`;
    return this.http.get(url); 
  }

  //////////////////////////////////////////////////////////////////////
  
  getEmailSettings(sortDirection : number, pageIndex :number, pageSize:number){
    const url = `${this.baseUrl}/EmailSettings?SortDirection=${sortDirection}&PageIndex=${pageIndex}&PageSize=${pageSize}`
    return this.http.get(url);
  }

  addEmailSettings(data:any){
    const url = `${this.baseUrl}/EmailSettings`;
    return this.http.post(url, data);
  }
  updateEmailSettings(data:any){
    const url = `${this.baseUrl}/EmailSettings`;
    return this.http.put(url, data);
  }

  deleteEmailSettings(id : string){
    const url = `${this.baseUrl}/EmailSettings/${id}`
    return this.http.delete(url);
  }

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

  //////////////////////////////////////////////////////////////////////////////
  getDocument(ModuleId:string, FeatureId:string,SortDirection :number,PageIndex:number,PageSize:number){
    let url = `${this.baseUrl}/documents?ModuleId=${ModuleId}&FeatureId=${FeatureId}&SortDirection=${SortDirection}&PageIndex=${PageIndex}&PageSize=${PageSize}`;
    return this.http.get(url);
  }

  /////////////////////////////////////////////////////////////////////////////////

}
