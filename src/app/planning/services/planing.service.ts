import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';

@Injectable({
  providedIn: 'root'
})
export class PlaningService {
  private selectedRow : any = [] ;
  selectedIndex: any;
  constructor( 
      @Inject('MASTER_API_URL') private url :string,
  private http : HttpClient) { }

  updateTabIndex(index :any){
    this.selectedIndex = index;
  }
  getUpdatedRoles(jsonData:any){

    //  the json is the sample json.
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
  getPlanningAuth(){
    const url = `https://enrico-dev-si-webapp-appservice2-01.azurewebsites.net/Account/my-profile`;
    return this.http.get(url);
  }
  profileDetails : userProfileDetails | string; 
  public get(endpoint: string): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    return this.http.get(url);
  }

  getTabIndex(){
    return this.selectedIndex;
  }
  getCFCycleList(){
    const url = `${this.url}/api/planning/getcfcycles?featureCode=CFCyclePlanning`;
    return this.http.get(url);
  }
  UpdateCfCycle(data:any){
    const url = `${this.url}/api/planning/updatecfcycle?featureCode=CFCyclePlanning`;
    return this.http.post(url,data);
  }

  CreateAOP(data:any){
    const url = `${this.url}/api/planning/createaop?featureCode=AOPPlanning`;
    return this.http.post(url,data);
    
  }
  getAopList(){
    const url = `${this.url}/api/planning/getaops?featureCode=AOPPlanning`;
    return this.http.get(url);
    
  }
  UpdateAOP(data:any){
    const url = `${this.url}/api/planning/updateaop?featureCode=AOPPlanning`;
    return this.http.post(url,data);
    
  }
  getFilters(type:any){
    const url = `${this.url}/api/planning/getfilters/${type}`;
    return this.http.get(url);
  }
  getFiltersBU(type:any,companycode:string){
    const url = `${this.url}/api/planning/getfilters/${type}/${companycode}`;
    return this.http.get(url);
  }
  getaopfls(){
    const url = `${this.url}/api/planning/getaopfls?featureCode=FirstLevelPlanning`;
    return this.http.get(url);
  }
  getaopsls(){
    const url = `${this.url}/api/planning/getaopsls?featureCode=SecondLevelPlanning`;
    return this.http.get(url);
  }
  CreateFLOP(data:any){
    const url = `${this.url}/api/planning/createflaop?featureCode=FirstLevelPlanning`;
    return this.http.post(url,data);
  }
  updateaopfl(data:any){
    const url = `${this.url}/api/planning/updateaopfl?featureCode=FirstLevelPlanning`;
    return this.http.post(url,data);
    
  }
  updateaopsl(data:any){
    
    const url = `${this.url}/api/planning/updateaopsl?featureCode=SecondLevelPlanning`;
    return this.http.post(url,data);
  }
  CreateSLOP(data:any){
    const url = `${this.url}/api/planning/createslaop?featureCode=SecondLevelPlanning`;
    return this.http.post(url,data);
  }

  GetSecondLevelDetails(SlAop:any){
    const url = `${this.url}/api/planning/GetAopDetails?SlAop=${SlAop}`;
    return this.http.get(url);
  }
  GetFirstLevelDetails(FlAop:any){
    const url = `${this.url}/api/planning/GetAopDetails?FlAop=${FlAop}`;
    return this.http.get(url);
  }
  GetAOPDetails(Aop:any){
    const url = `${this.url}/api/planning/GetAopDetails?Aop=${Aop}`;
    return this.http.get(url);
  }
  EditSecondLevel(data:any){
    const url = `${this.url}/api/planning/plan/resource/create-update`;
    return this.http.post(url,data);
  }
  getResourceFilters(companyid){
    const url = `${this.url}/api/planning/get-resource-planning-filters?companyId=${companyid}`;
    return this.http.get(url);
  }

  getPoList(){
    const url = `${this.url}/api/planning/plan/get-all-po-planning`;
    return this.http.get(url);
  }
  getPoDetails(data: any){
    const url = `${this.url}/api/planning/plan/get-po-details`;
    return this.http.post(url,data);
  }

  getAllPoNumbersAndOtherDetails(data:any){
    
    const url = `${this.url}/api/planning/plan/get-po-list?featureCode=PODetails`;
    return this.http.post(url,data);
  }

  attachPo(data: any){
    const url = `${this.url}/api/planning/plan/attach-po-planning`;
    return this.http.post(url,data);
  }

  getMyactions(){
    const url = `${this.url}/api/planning/plan/my-actions`;
    return this.http.get(url);
  }
  getRemarks(data:any){
    const url = `${this.url}/api/planning/getremarks`;
    return this.http.post(url,data);
  }
  getEmployeMaster(){
    const url = `${this.url}/api/master-data/?menuId=29`;
    return this.http.get(url);
  }
  getPONumber(data:any){
    const url = `${this.url}/api/master-data/?menuId=39`;
    return this.http.post(url,data);
  }
  DelegateUser(data:any){
    const url = `${this.url}/api/planning/delegate`;
    return this.http.post(url,data);
  }
  getResourceRate(data:any){
    const url = `${this.url}/api/planning/rate-card/get-resource-rate`;
    return this.http.post(url,data);
  }
  getFilterLevel(id:any,org:any,type:any,companyCode:string){
    const url = `${this.url}/api/planning/get-filters-by-level?id=${id}&orgLevel=${org}&type=${type}&companyCode=${companyCode}`;
    return this.http.get(url);
  }

  SaveColumnFilter(data:any){
    const url = `${this.url}/api/master-data/save-columns?menuId=16`;
    return this.http.post(url,data);
  }

  updateDetailsData(data :any){
    this.selectedRow = data
  }
  getDetailsData(){
    return this.selectedRow
  }
  DeletePO(poid:any){
    const url = `${this.url}/api/planning/po?Id=${poid}`;
    return this.http.delete(url);
  }
  OwnerShipUpdate(data:any){
    const url = `${this.url}/api/owner/update`;
    return this.http.post(url,data);
  }
  AOPEditEndDate(data:any){
    const url = `${this.url}/api/planning/updateaop/enddate?featureCode=AOPPlanning`;
    return this.http.post(url,data);
  }
  ExportGrid(data:any){
    const url = `${this.url}/api/export`;
    return this.http.post(url,data);
  }
  ExportSecondLevelGrid(data:any){
    const url = `${this.url}/api/export/export-supply-planning`;
    return this.http.post(url,data);
  }
  ExchangeRate(){
    const url = `${this.url}/api/usd-exchange`;
    return this.http.get(url);
  }
  getAOPSubmitList(AOPID:any,companycode:any,cfCycleYear:any){
    const url = `${this.url}/api/planning/plan/get-aop-submit-list?aopid=${AOPID}&companycode=${companycode}&cfCycleYear=${cfCycleYear}`;
    return this.http.get(url);
  }
  saveColSettings(menuid:number,data:any){
    const url = `${this.url}/api/master-data/save-columns?menuId=${menuid}`;
    return this.http.post(url,data);
  }
  getdeafultcolmuns(menuid:number){
    const url = `${this.url}/api/planning/planning-get-default-columns?menuId=${menuid}`;
    return this.http.get(url);
  }
  saveimporteddata(data:any,flag:any){
    const url = `${this.url}/api/planning/import-data?flag=${flag}&featureCode=SecondLevelPlanning`;
    return this.http.post(url,data);
    
  }
  public post(endpoint: string, data: any = null): Observable<any> {
    const url = `${this.url}/${endpoint}`;
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, data, { headers });
  }
  downloadTemplate(){
    const url = `${this.url}/api/planning/download-supply-planning-template?featureCode=SecondLevelPlanningdelete-supply-planning`;
    return this.http.get(url);
    
  }
  getColSequence(menuid:number){
    const url = `${this.url}/api/grid-setting/get-column-sequence?menuId=${menuid}`;
    return this.http.get(url);
  }
  setColSequence(data:any){
    const url = `${this.url}/api/grid-setting/save-column-sequence`;
    return this.http.post(url,data);
  }
  getColFilters(menuid:number){
    const url = `${this.url}/api/grid-setting/get-column-filters?menuId=${menuid}`;
    return this.http.get(url);
    
  }
  saveColFilters(data:any){
    const url = `${this.url}/api/grid-setting/save-column-filters`;
    return this.http.post(url,data);
  }
  deleteSupplyPlanning(id:any){
    const url = `${this.url}/api/planning/delete-supply-planning?id=${id}&featureCode=SecondLevelPlanning`;
    return this.http.delete(url);
  }
}
