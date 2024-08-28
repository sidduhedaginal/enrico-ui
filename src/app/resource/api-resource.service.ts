import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ApiResourceService {
  private resource_path_url = environment.resource_API_Path;
  baseUrl: any = environment.vendor_API;
  baseapiPath: any = '/api/resource';
  baseAPIConfig:any=environment.apiConfig;
  constructor(private http: HttpClient) {}

  getFetchLoginDetailsFor() {
    let tokenKey = environment.localStorageKeyWord;
    let _data: any = localStorage.getItem(tokenKey);
    let _data2 = JSON.parse(_data);
    return _data2;
  }
  getFetchCreatedByVal() {
    let tokenKey =
      'oidc.user:https://login.microsoftonline.com/0ae51e19-07c8-4e4b-bb6d-648ee58410f4/v2.0/:3800bb56-45cb-4c0a-bd89-7394b0d57720';
    let _data: any = localStorage.getItem(tokenKey);
    let _data2 = JSON.parse(_data);
    return _data2;
  }

  getResourceMaster() {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/resourceMaster';

    return this.http.get(url);
  }
  getDeboarding() {
    let url = this.baseUrl + this.baseapiPath + '/deboardMaster';

    return this.http.get(url);
  }
  getChangeRequest() {
    let url =
      this.baseUrl + this.baseapiPath + '/changeRequest/getResourceCrDetails';
    return this.http.get(url);
  }

  sendMailinitiateDeboardPost(obj: any) {
    let url = environment.commonAPI + '/emails/send';
    return this.http.post(url, obj);
  }

  initiateDeboardPost(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/deboardingRequests';
    return this.http.post(url, obj);
  }
  deboardApprovePost(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/deboardingRequests/approve';
    return this.http.post(url, obj);
  }

  deboardRejectPost(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/deboardingRequests/reject';
    return this.http.post(url, obj);
  }
  deboardWithdrawPost(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/deboardingRequests/withdraw';
    return this.http.post(url, obj);
  }
  deboardDelegatePost(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/delegateUser';
    return this.http.post(url, obj);
  }
  deboardECLInitiatedPost(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/initiateECL';
    return this.http.post(url, obj);
  }
  getExitReasonList() {
    let url =  this.baseAPIConfig + this.baseapiPath + '/ExitReasonMaster';
   // let url = '../../assets/tempJson/exitReasonDDL.json';
    return this.http.get(url);
  }

  deviceCollectedPost(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/deviceCollected';
    return this.http.post(url, obj);
  }
  accessoryCollectedPost(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/deboardingRequests/accessoryCollected';
    return this.http.post(url, obj);
  }
  employeeCardCollectedPost(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/deboardingRequests/employeeCardCollected';
    return this.http.post(url, obj);
  }
  ntidDeactivatedPost(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/ntidDeactivate';
    return this.http.post(url, obj);
  }
  extendLwdPost(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/deboardingRequests/extendLwd';
    return this.http.post(url, obj);
  }
  getUserListOfDelegatesApi() {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/getDelegateUser';
    return this.http.get(url);
  }
  getExitCheckListInfo(obj) {
    let url =
      this.baseUrl + this.baseapiPath + `/getDeboardingDetails/${obj.id}`;
    return this.http.get(url);
  }
  deboardECLCompletePost(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/completeECL';
    return this.http.post(url, obj);
  }
  retainResourcePost(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/retainResource';
    return this.http.post(url, obj);
  }
  getChangeRequestDataForDropdown(obj?) {
    let url = '';
    let doj=String(moment(obj.dateOfJoining).format('DD-MMM-yyyy'));
    if (obj && obj.roles == '/Vendors') {
      url =this.baseUrl + this.baseapiPath + '/changeRequest/getResourceCrMasters/' + obj.vendorID+'?dateOfJoining='+doj;
    } else {
      url =
        this.baseUrl + this.baseapiPath + '/changeRequest/getResourceCrMasters';
    }

    return this.http.get(url);
  }
  changeInitiateSubmitPost(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/changeRequest/initiateCR';
    return this.http.post(url, obj);
  }
  changeEffectiveDatePostApi(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/changeRequest/changeEffectiveDate';
    return this.http.post(url, obj);
  }

  getCmInfoByEmpNumerApi(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/changeRequest/cminfoByEmployeeNumber/' +
      obj;
    return this.http.get(url);
  }
  getCmDateByCRnumberApi(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/changeRequest/cmDataByCrNumber/' +
      obj;
    return this.http.get(url);
  }
  cancelRequestePostApi(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/changeRequest/cancelCmRequest';
    return this.http.post(url, obj);
  }
  getExistingCompetencyAPI(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/changeRequest/getExistingCompetency/' +
      obj;
    return this.http.get(url);
  }
  getEffectiveFromDateCMApi(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/SRNbillingperiodStartDt';
    return this.http.post(url, obj);
  }
  getNoOfHolidays(obj) {
    let url =
      this.baseUrl + this.baseapiPath + '/deboardingRequests/getNoOfHoliday';
    return this.http.post(url, obj);
  }
  sendVendorMailinitiateDeboardPost(obj: any) {
    let url = environment.commonAPI+ '/vendors/send';
    return this.http.post(url, obj);
  }
  getECLProcessMailId(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/deboardingRequests/GetECLProcessMailId';
    return this.http.post(url, obj);
  }
  getOnboardingOpenOrderList() {
    let url =
      environment.apiConfig +
      this.baseapiPath +
      '/onboarding/getResourcePlanOpenOrder';
    return this.http.get(url);
  }
  getOnboardingOpenOrderListVendors(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/onboarding/getResourcePlanOpenOrder/' +
      obj.vendorID;
    return this.http.get(url);
  }
  getNamtionaltyListOB() {
    let url = '../assets/tempJson/nationalityNameList.json';
    return this.http.get(url);
  }
  getStdCountryListOB() {
    let url = '../assets/tempJson/countryStdCodeOB.json';
    return this.http.get(url);
  }
  saveOnboardingPostApi(obj: any) {
    let url =
      this.baseUrl + this.baseapiPath + '/onboarding/onboardingRequests';
    return this.http.post(url, obj);
  }
  sendMailOnboardingPost(obj: any) {
    let url = environment.commonAPI + '/emails/send';
    return this.http.post(url, obj);
  }
  sendVendorMailinitiateOnboarding(obj: any) {
    let url = environment.commonAPI+ '/vendors/send';
    return this.http.post(url, obj);
  }
  onboardingDelegateApi(obj: any) {
    // https://enrico-dev-si-webapp-appservice3-01.azurewebsites.net/api/resource/onboarding/delegateUser
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/delegateUser';
    return this.http.post(url, obj);
  }
  onboardingApproveApi(obj: any) {
    let url = environment.apiConfig + this.baseapiPath + '/onboarding/approve';
    return this.http.post(url, obj);
  }
  getOnboardingOBList() {
    // https://enrico-dev-si-webapp-appservice4-01.azurewebsites.net/api/resource/onboarding/getResourceOnboardingRequest/00000000-0000-0000-0000-000000000000
    let url =
      environment.apiConfig +
      this.baseapiPath +
      '/onboarding/getResourceOnboardingRequest';
    return this.http.get(url);
  }
  getOnboardingOBListtVendors(obj: any) {
    let url =
      this.baseUrl +
      this.baseapiPath +
      '/onboarding/getResourceOnboardingRequest/' +
      obj.vendorID;
    return this.http.get(url);
  }
  onboardingUpdateNtidPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/updateNTId';
    return this.http.post(url, obj);
  }
  onboardingCheckinPostApi(obj: any) {
    let url = environment.apiConfig + this.baseapiPath + '/onboarding/checkIn';
    return this.http.post(url, obj);
  }
  onboardingIssueIDcardPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/issueIdCard';
    return this.http.post(url, obj);
  }
  onboardingShareNtidPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/shareNTId';
    return this.http.post(url, obj);
  }
  onboardingExtendDateofJoiningPostApi(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/onboarding/extendDoj';
    return this.http.post(url, obj);
  }
  onboardingInitiateBackgroundVerificationPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/initiateBGV';
    return this.http.post(url, obj);
  }
  onboardingAcknowledgeBvPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/acknowledgeBGV';
    return this.http.post(url, obj);
  }
  onboardingUpdateBGVReportPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/updateBgvReport';
    return this.http.post(url, obj);
  }
  onboardingSendbackRejectPostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/rejectOrSendback';
    return this.http.post(url, obj);
  }
  onboardingNtidDeactivatePostApi(obj: any) {
    let url =
      environment.apiConfig + this.baseapiPath + '/onboarding/ntidDeactivation';
    return this.http.post(url, obj);
  }
  getDetailsInformationOBbyID(objID: any, userLoginType: any) {
    let url = '';
    if (userLoginType == '/EnricoUsers') {
      url =
        environment.apiConfig +
        this.baseapiPath +
        '/onboarding/getOnboardingRequestDetails' +
        `/${objID}`;
    } else {
      url =
        this.baseUrl +
        this.baseapiPath +
        '/onboarding/getOnboardingRequestDetails' +
        `/${objID}`;
    }

    return this.http.get(url);
  }

  getSASTokenForUpload(userLoginType: any) {
    let url = '';
    if (userLoginType == '/EnricoUsers') {
      url = environment.apiConfig + this.baseapiPath + '/getOnboardingSASToken';
    } else {
      url = this.baseUrl + this.baseapiPath + '/getOnboardingSASToken';
    }
    return this.http.get(url);
  }

  getUpdateRequestOB(userLoginType: any, obj: any) {
    let url = '';
    if (userLoginType == '/EnricoUsers') {
      url =
        environment.apiConfig +
        this.baseapiPath +
        '/onboarding/updateObRequests';
    } else {
      url = this.baseUrl + this.baseapiPath + '/onboarding/updateObRequests';
    }
    return this.http.post(url, obj);
  }

  sowJdSectionSendBackInOb(obj: any) {
    let url =
      environment.apiConfig +
      this.baseapiPath +
      '/onboarding/sectionwiseSendback';
    return this.http.post(url, obj);
  }
  onboardingSendbackLevelWiseConfirmApi(obj: any) {
    let url =
      environment.apiConfig +
      this.baseapiPath +
      '/onboarding/updateSentbackStatus';
    return this.http.post(url, obj);
  }
  deleteOBTableRowDetailsIDwise(obj: any) {
    let url = this.baseUrl + this.baseapiPath + '/onboarding/deleteOBDraft';
    return this.http.post(url, obj);
  }


getPOLineItemBasedPlantIdOB(obj: any){
  let url = this.baseUrl + this.baseapiPath + '/onboarding/getPoLineItem/'+obj.purchaseOrder+'?Id='+obj.plantID; 
  return this.http.get(url); 
}
getGbBusinessAreaApi(obj:any){
  let url =   environment.apiConfig   + this.baseapiPath + '/onboarding/getGBBusinessArea/'+obj; 
  return this.http.get(url); 
}

getDeboardAprroverDetails(objID:any){
  let url =   environment.apiConfig   + this.baseapiPath + '/onboarding/getApproverDetails/'+objID; 
  return this.http.get(url); 
}
getCheckExitEmailOB(objMailID:any){
  let url =   this.baseUrl   + this.baseapiPath + '/checkEmailExit?emailId='+objMailID; 
  return this.http.get(url); 

}
deboardGCNPost(obj: any) {
  let url =   environment.apiConfig   + this.baseapiPath + '/SaveResourceGCNAccess';
  return this.http.post(url, obj);

}
deboardSAPidmPost(obj: any) {
  let url =    environment.apiConfig  + this.baseapiPath + '/SaveResourceSAPidm';
  return this.http.post(url, obj);

}
deboardTransportPost(obj: any) {
  let url =   environment.apiConfig   + this.baseapiPath + '/SaveResourceTransport';
  return this.http.post(url, obj);

}
getPOLineItemBasedPlantIdCM(obj: any){
  let url = this.baseUrl + this.baseapiPath + '/onboarding/getPoLineItem/'+obj.purchaseOrder+'?Id='+obj.plantID; 
  return this.http.get(url); 
}

saveSOWjdInformationCM(obj: any) {
  let url =  this.baseUrl + this.baseapiPath + '/changeRequest/saveSOWjdInformation';
  return this.http.post(url, obj);

}
getSowJDInfoChangeManagement(obj){
  let url = this.baseUrl + this.baseapiPath + '/changeRequest/getSOWjdInformation?cmChangeRequestId='+obj; 
  return this.http.get(url); 
}
}
