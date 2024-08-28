import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';

@Injectable({
  providedIn: 'root',
})
export class ApiCallService {
   constructor(
    private http: HttpClient,
     @Inject('MASTER_API_URL') private url: string,
  ) {}

  profileDetails : userProfileDetails | string; 
  public get(endpoint: string): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    return this.http.get(url);
  }

  public post(endpoint: string, data: any = null): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data, { headers });
  }

  public delete(endpoint: string, data: any): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    return this.http.delete(url, { body: { data } });
  }

  public postWithQueryString(
    endpoint: string,
    queryString: string
  ): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    const params = new HttpParams().set('query', queryString);
    return this.http.post(url, null, { params });
  }

  getUpdatedRoles(jsonData:any){
    for (const role of jsonData?.data?.roleDetail.slice(0, 1)) {
      for (const roleDtail of role.roleDtails) {
        for (const feature of roleDtail.featureDetails) {
          const permissionDict = {};
          for (const permission of feature.permissionDtails) {
            (permissionDict as any) [permission.permissionName] = true;
          }
          feature.permissionDtails = permissionDict;
        }
      }
    }
    return jsonData;
  }

  getProfileRoles(url : string){ 
    return this.http.get(url);
  }

  getMasterDataWithPagination(pageNumber: number, pageSize: number, menuId : number){
    const url = `${this.url}/api/master-data/getdata?pageNumber=${pageNumber}&pageSize=${pageSize}&menuId=${menuId}`;
    return this.http.get(url);
  }
  postApprovalProcess(
    menuId: number,
    selectedRowIds: any,
    statusCode: any,
    remark:string
  ) {
    const url = `${this.url}/api/approval-process?menuId=${menuId}`;
    const data = {
      data: {
        ids: selectedRowIds,
        approvalId: statusCode,
        remark:remark
      },
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data , {headers});
  }
}