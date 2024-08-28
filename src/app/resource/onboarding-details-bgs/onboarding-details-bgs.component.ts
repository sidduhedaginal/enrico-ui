import { Component, OnInit, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SubmitOnboardingRequestDialogComponent } from '../submit-onboarding-request-dialog/submit-onboarding-request-dialog.component';
import { OnboardDelegateDialogComponent } from '../onboard-delegate-dialog/onboard-delegate-dialog.component';
import { OnboardRejectDialogComponent } from '../onboard-reject-dialog/onboard-reject-dialog.component';
import { OnboardSentBackDialogComponent } from '../onboard-sent-back-dialog/onboard-sent-back-dialog.component';
import { OnboardApproveDialogComponent } from '../onboard-approve-dialog/onboard-approve-dialog.component';
import { OnboardUpdateNtidDialogComponent } from '../onboard-update-ntid-dialog/onboard-update-ntid-dialog.component';
import { OnboardCheckinDialogComponent } from '../onboard-checkin-dialog/onboard-checkin-dialog.component';
import { OnboardIssueidCardDialogComponent } from '../onboard-issueid-card-dialog/onboard-issueid-card-dialog.component';
import { OnboardShareNtidDialogComponent } from '../onboard-share-ntid-dialog/onboard-share-ntid-dialog.component';
import { OnboardingInitiateBackgroundVerificationDialogComponent } from '../onboarding-initiate-background-verification-dialog/onboarding-initiate-background-verification-dialog.component';
import { OnboardingAcknowledgeBvrDialogComponent } from '../onboarding-acknowledge-bvr-dialog/onboarding-acknowledge-bvr-dialog.component';
import { OnboardingExtendDateOfJoiningDialogComponent } from '../onboarding-extend-date-of-joining-dialog/onboarding-extend-date-of-joining-dialog.component';
import { OnboardingUpdateBgvReportDialogComponent } from '../onboarding-update-bgv-report-dialog/onboarding-update-bgv-report-dialog.component';
import { OnboardingNtidDeactivateDialogComponent } from '../onboarding-ntid-deactivate-dialog/onboarding-ntid-deactivate-dialog.component';
import * as moment from 'moment';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/services/loader.service';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
@Component({
  selector: 'app-onboarding-details-bgs.component',
  templateUrl: './onboarding-details-bgs.component.html',
  styleUrls: ['./onboarding-details-bgs.component.css']
})
export class OnboardingDetailsBgsComponent implements OnInit {
  showLoading: boolean = false;
  remarksList: any = [];
  getElementData: any = [];
  _checkuser: any = [];
  _getPathUrl = environment.mailDeboardUrl;
  userDetailsRoles: any = [];
  valueTotalExpYear = 0;
  valueTotalExpMonth = 0;
  valueRelevantExpYear = 0;
  valueRelevantExpMonth = 0;
  photoUploadFileName: any = ""; 
  parentOrgUploadfileName: any = "";
  ispSecurityUploadfileName: any = "";
  salaryLevelStatus: any = "";
  onboardingDetailsList: any = [];
  deboardingDataDetailsList:any=[];
  employeeMasterDetailsList: any = [];
  ntIDDetailsList: any = [];
  resourceCheckInDetailsList: any = [];
  resourceIDcardIsuueDetailsList: any = [];
  resourceShareNtidDetailsList: any = [];
  resourceEmployeeMasterDeactivationDetailsList:any=[];
  onboardingBGVList: any = [];
  bgvCompletedDetailsList: any = [];
  bgvRequestDetailsList: any = [];
  bgvInitiateDetailsList: any = [];
  onboardingUploadFileList: any = [];
  photoDocumentFileGet: any = [];  
  parentOrgFileGet: any = [];
  ispCertificateFileGet: any = [];
  gbBusinnesOptionListData: any = [];
  resourceObSowjdOrderDetailData: any = [];
  resourceObOrganizationDetailData: any = [];
  forDownloadSSNtoken: string = "";
  resourceObResourceDetailsData: any = [];
  educationDetailsData: any = [];
  vendorDetailsData: any = [];
  fcmSecurityCheckinData: any = [];
  sowjdSectionRemarksModel: any = "";
  organizationSectionRemarksModel: any = "";
  vendorSectionRemarksModel: any = "";
  personalInfomationSectionRemarksModel: any = "";
  contactInfomationSectionRemarksModel:any="";
  identityInfomationSectionRemarksModel:any="";
  residenceSectionRemarksModel:any="";
  workExpSectionRemarksModel:any="";
  previousWorkedBoschSectionRemarksModel:any="";
  photoSectionRemarksModel:any="";
parentOrgSectionRemarksModel:any="";
ispCertificateSectionRemarksModel:any="";
  isShowSowJDremarksButtonSaveCancel: boolean = false;
  isShowOrganizationremarksButtonSaveCancel: boolean = false;
  isShowVendorremarksButtonSaveCancel: boolean = false;
  isShowPersoanlInforemarksButtonSaveCancel: boolean = false;
  isShowContactInforemarksButtonSaveCancel:boolean=false;
  isShowIdentityInforemarksButtonSaveCancel:boolean=false;
  isShowResidenceRemarksButtonSaveCancel:boolean=false; 
  isShowWorkExpRemarksButtonSaveCancel:boolean=false;
  isShowPreviousWorkedBoschRemarksButtonSaveCancel:boolean=false;
  isShowPhotoRemarksButtonSaveCancel:boolean=false;
isShowParentOrgRemarksButtonSaveCancel:boolean=false;
isShowIspCertificateRemarksButtonSaveCancel:boolean=false;
  showHideSowJdRemarksForSendBack: boolean = false;
  showHideOrganizationRemarksForSendBack: boolean = false;
  showHideVendorDetailsRemarksForSendBack: boolean = false;
  showHidePersonalInrmationDetailsRemarksForSendBack: boolean = false;
  showHideContactInrmationDetailsRemarksForSendBack: boolean = false;
  showHideIdentityInrmationDetailsRemarksForSendBack: boolean = false;
  showHideResidenceRemarksForSendBack:boolean=false;
  showHideWorkExpRemarksForSendBack:boolean=false;
  showHidePreviousWorkedBoschRemarksForSendBack:boolean=false;
  showHidePhotoRemarksForSendBack:boolean=false;
  showHideParentOrgRemarksForSendBack:boolean=false;  
  showHideIspCertificateRemarksForSendBack:boolean=false;
  confirmSendbackbtnShowHide: boolean = false; 

  sendBackSectionWise: any = [];
  sowJdSection: any = [];
  organizationSection: any = [];
  vendorSection: any = [];
  persoanlInfoSection: any = [];
  contactInfoSection:any=[];
  identityInfoSection:any=[];
  residenceSection:any=[];
  workExpSection:any=[];
  previousWorkedSection:any=[];
  photoSection:any=[];
  parentOrgSection:any=[];
  ispCertificateSection:any=[];
  bgvVendorList:any=[];
  extendDojButtonShowHide:boolean=false;
  filenameBGVReport:any="";
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    setTimeout(() => {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "data": encodeURIComponent('onboarding'),
        }
      };
      this.router.navigate(["Onboarding"], navigationExtras);
    }, 10)
    
  }
  getDategetDateSubmitDate:any="";
  getDateFirstApprovedDate:any="";
  getDateSecondApprovedDate:any="";
  getDateRejectedFirstDate:any=[];
  onboardingFirstApproveList:any=[];
  checkRejectFirst:boolean=false;
  checkRejectSecond:boolean=false;
  getDateRejectedSecondDate:any="";
  getDateSecondLevelSentBackDate:any="";
  getUserProfileData:any=[];
  getElementDataSignOff:any="";
  globalCheckCompanyCode:any="";
  deviceList:any=[];
  subscription: Subscription;
  permissionsBehaviorSubjectOnboarding: PermissionDetails;
  constructor(private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private API: ApiResourceService, private fb: FormBuilder, private snackBar: MatSnackBar, public loaderService: LoaderService, private sowjdService: sowjdService) { 
    this.subscription = this.sowjdService.getUserProfileRoleDetailOnboarding().subscribe((roles: PermissionDetails) => {
      this.permissionsBehaviorSubjectOnboarding = roles;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      debugger;
      if (localStorage.getItem('obIDForStatus') == 'forMyactionOB') {
        debugger;
        this.getElementData = JSON.parse(params.element);
        this.gbBusinnesOptionListData = params.gbBusinnesOptionList;

      }
      else {
        localStorage.removeItem('obIDForStatus');
        this.getElementData = JSON.parse(params.element);
        this.globalCheckCompanyCode=params?.globalCheckCompanyCode;
        //this.gbBusinnesOptionListData = params.gbBusinnesOptionList;
        this.salaryLevelStatus = '';
        if (this.getElementData && (this.getElementData.outSourcingType == "Time and Material" || this.getElementData.outSourcingType.toLowerCase() == "time and material")) {
          this.salaryLevelStatus = 'Level 83';
        }
        else {
          this.salaryLevelStatus = 'Level 84';
        }
      }
    });

    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
    this.getUserProfileData=_getLoginDetails.profile;
    this._checkuser = StorageQuery.getUserProfile();
    this.getDetailsInformation();
    this.API.getSASTokenForUpload(this.userDetailsRoles).subscribe((response: any) => {
      if (response && response.data) {
        this.forDownloadSSNtoken = response.data;
      }
    })
    this.getGbBusinessAreaApi();
   // this.getUserRolesInfo();
  }
  getGbBusinessAreaApi(){
    this.API.getGbBusinessAreaApi(this.getElementData?.id).subscribe((response:any)=>{
      if(response && response.data && response.data.gbBusinessAreaList){
        this.gbBusinnesOptionListData=  response.data.gbBusinessAreaList;
        
      }
      if(response && response.data && response.data.deviceList){
      this.deviceList= response.data.deviceList
      }
    })
  }
  allOnboardingDetails:any=[];
  getDetailsInformation() {
    this.loaderService.setShowLoading();
    this.isSetSendBackButtonVisible=false;
    this.getElementDataSignOff = this.getElementData?.technicalProposalNumber; 
    this.API.getDetailsInformationOBbyID(this.getElementData.id, this.userDetailsRoles).subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      this.allOnboardingDetails=response?.data;
      this.bgvVendorList=[];
if(response && response.data && response.data.resourceBgvVendordetail){
  this.bgvVendorList= response.data.resourceBgvVendordetail;
}
      if (response && response.data && response.data.resourceObSowjdOrderDetail) {
        this.resourceObSowjdOrderDetailData = response.data.resourceObSowjdOrderDetail[0];
        if (this.resourceObSowjdOrderDetailData && (this.resourceObSowjdOrderDetailData.outSourcingType == "Time and Material" || this.resourceObSowjdOrderDetailData.outSourcingType.toLowerCase() == "time and material")) {
          this.salaryLevelStatus = 'Level 83';
        }
        else {
          this.salaryLevelStatus = 'Level 84';
        }
        //Bug:Start FS:Show DOJ extension button to vendor till one day before the expected DOJ
        let findExpectedDoj=moment(this.resourceObSowjdOrderDetailData.expectedDateOfJoing).format('yyyy-MM-DD');
        const specificExpectedDojDate =new Date(findExpectedDoj +' 00:00:00');
        let previousDayFromExpectedDojDate = new Date(specificExpectedDojDate.getTime());
        previousDayFromExpectedDojDate.setDate(specificExpectedDojDate.getDate() - 1);     
        let todayDate=new Date();
        if(todayDate <= previousDayFromExpectedDojDate){
         this.extendDojButtonShowHide=true;
        }
        else{
          this.extendDojButtonShowHide=false;
        }
        //End FS:Show DOJ extension button to vendor till one day before the expected DOJ (20-may-2024)
      }
      this.showHideCheckinSecurityButton=false;
      if (response && response.data && response.data.fcmSecurityInfo) {
        this.fcmSecurityCheckinData = response.data.fcmSecurityInfo[0];
        if(this.getUserProfileData && (this.getUserProfileData?.email?.toLowerCase()== this.fcmSecurityCheckinData?.fcmSecurityEmail?.toLowerCase())){
          this.showHideCheckinSecurityButton=true;
        }
      }

      if (response && response.data && response.data.resourceObOrganizationDetail) {
        this.resourceObOrganizationDetailData = response.data.resourceObOrganizationDetail[0];
      }
      if (response && response.data && response.data.resourceObResourceDetail) {
        this.resourceObResourceDetailsData = response.data.resourceObResourceDetail[0];
      }
      if (response && response.data && response.data.resourceObVendorDetail) {
        this.vendorDetailsData = response.data.resourceObVendorDetail[0];
      }
      if (response && response.data && response.data.resourceObEducationExperienceDetail) {
        this.educationDetailsData = response.data.resourceObEducationExperienceDetail[0];
      }
      if (response && response.data && response.data.resourceObRemarks) {
        this.remarksList = response.data.resourceObRemarks;
        let getDateSubmit=   this.remarksList.filter((v=>{
          return v.statusDescription=="Submitted"
        }));
        if(getDateSubmit && getDateSubmit.length>0){
          this.getDategetDateSubmitDate=getDateSubmit[0].createdOn;
          }


                
          let getDateFirstApproved=   this.remarksList.filter((v=>{
            return v.statusDescription== "First Level Approved"
          }));
          if(getDateFirstApproved && getDateFirstApproved.length>0){
            this.getDateFirstApprovedDate=getDateFirstApproved[0].createdOn;
            }
           
            
            let getDateSecondApproved=   this.remarksList.filter((v=>{
              return v.statusDescription=="Employee Master Created"
            }));
            this.checkRejectFirst=false;
            if(getDateSecondApproved && getDateSecondApproved.length>0){
              this.getDateSecondApprovedDate=getDateSecondApproved[0].createdOn;
              }
           
              let getDateRejectedFirst=   this.remarksList.filter((v=>{
                return v.statusDescription=="Rejected" && v.remark.includes('FirstRejectedButtonOB: ')==true
              }));
              if(getDateRejectedFirst && getDateRejectedFirst.length>0){
                this.getDateRejectedFirstDate=getDateRejectedFirst[0];
                if( this.getDateRejectedFirstDate.remark.includes('FirstRejectedButtonOB: ')==true){
                  this.checkRejectFirst=true;
                }  
              }
              
                this.checkRejectSecond=false;
                  let getDateRejectedSecond=   this.remarksList.filter((v=>{
                    return v.statusDescription=="Rejected" && v.remark.includes('SecondRejectedButtonOB: ')==true
                  }));
                  if(getDateRejectedSecond && getDateRejectedSecond.length>0){
                    this.getDateRejectedSecondDate=getDateRejectedSecond[0];
                    if( this.getDateRejectedSecondDate.remark.includes('SecondRejectedButtonOB: ')==true){
                      this.checkRejectSecond=true;
                    }  
                }

                let getDateSecondLevelSentBack=   this.remarksList.filter((v=>{
                  return v.statusDescription== "Second Level Sent Back"
                }));
                if(getDateSecondLevelSentBack && getDateSecondLevelSentBack.length>0){
                  this.getDateSecondLevelSentBackDate=getDateSecondLevelSentBack[0].createdOn;
                  }


      }
      if (response && response.data && response.data.resourceDeboardingDetails) {
        this.deboardingDataDetailsList = response.data.resourceDeboardingDetails[0];

      }

      if (response && response.data && response.data.resourceOBOnboardingDetail) {
        this.onboardingDetailsList = response.data.resourceOBOnboardingDetail;
        this.employeeMasterDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Employee Master" })[0];
        this.ntIDDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "NT ID" })[0];
        this.resourceCheckInDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Resource Check In" })[0];
        this.resourceIDcardIsuueDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "ID Card Issue" })[0];
        this.resourceShareNtidDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Share NT ID" })[0];
        this.resourceEmployeeMasterDeactivationDetailsList = this.onboardingDetailsList.filter((v: any) => { return v.onboardingDetail == "Employee Master Deactivation" })[0];

      }
      if (response && response.data && response.data.resourceObBgvDetail) {
        this.onboardingBGVList = response.data.resourceObBgvDetail;
        this.bgvCompletedDetailsList = this.onboardingBGVList.filter((v: any) => { return v.backgroundVerification == "BGV Completed" })[0];
        this.bgvRequestDetailsList = this.onboardingBGVList.filter((v: any) => { return v.backgroundVerification == "BGV Request" })[0];
        this.bgvInitiateDetailsList = this.onboardingBGVList.filter((v: any) => { return v.backgroundVerification == "Initiate BGV" })[0];
          
    this.filenameBGVReport = '';
    if(this.bgvCompletedDetailsList && this.bgvCompletedDetailsList.bgvReportUrl){
    this.filenameBGVReport = new URL(this.bgvCompletedDetailsList.bgvReportUrl).pathname.split('/').pop();
    }

      }
      if (response && response.data && response.data.resourceOBDocumentDetail) {
        this.onboardingUploadFileList = response.data.resourceOBDocumentDetail;
        this.photoDocumentFileGet = this.onboardingUploadFileList.filter((v: any) => { return v.resourceType == "PhotoDocument" })[0]; 
        this.parentOrgFileGet = this.onboardingUploadFileList.filter((v: any) => { return v.resourceType == "ParentOrgDocument" })[0];
        this.ispCertificateFileGet = this.onboardingUploadFileList.filter((v: any) => { return v.resourceType == "EHSCertificateDocument" })[0];
    
        this.photoUploadFileName = this.photoDocumentFileGet ? this.photoDocumentFileGet.documentName : "";     
        this.parentOrgUploadfileName = this.parentOrgFileGet ? this.parentOrgFileGet.documentName : "";      
        this.ispSecurityUploadfileName = this.ispCertificateFileGet ? this.ispCertificateFileGet.documentName : "";       
      }



if (response && response.data && response.data.resourceObSendbackRemarkDetail) {
  this.sendBackSectionWise = response.data.resourceObSendbackRemarkDetail;
}
      if(this.getElementData.statusdescription =='Submitted' || this.getElementData.statusdescription =='First Level Approved' || this.getElementData.statusdescription=='Second Level Sent Back'){
     
        this.sowJdSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "SowjdSection" })[0];
        this.organizationSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "OrganizationSection" })[0];
        this.vendorSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "VendorSection" })[0];
        this.persoanlInfoSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "PersonalInformationSection" })[0];
        this.contactInfoSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "ContactInformationSection" })[0];
        this.identityInfoSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "IdentityInformationSection" })[0];
     
        this.residenceSection = this.sendBackSectionWise?.filter((v: any) => { return v.section == "ResidenceSection" })[0];
      
        this.workExpSection=this.sendBackSectionWise?.filter((v: any) => { return v.section == "WorkExperienceSection" })[0];
        this.previousWorkedSection=this.sendBackSectionWise?.filter((v: any) => { return v.section == "PreviousWorkedSection" })[0];
        this.photoSection=this.sendBackSectionWise?.filter((v: any) => { return v.section == "PhotoSection" })[0]; 
        this.parentOrgSection=this.sendBackSectionWise?.filter((v: any) => { return v.section == "ParentOrgCardSection" })[0];
        this.ispCertificateSection=this.sendBackSectionWise?.filter((v: any) => { return v.section == "IspCertificateSection" })[0];  
        if (this.sowJdSection) {
          this.sowjdSectionRemarksModel = this.sowJdSection.remark;
          this.isShowSowJDremarksButtonSaveCancel = true;
          this.showHideSowJdRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }

       
        if (this.organizationSection) {
          this.organizationSectionRemarksModel = this.organizationSection.remark;
          this.isShowOrganizationremarksButtonSaveCancel = true;
          this.showHideOrganizationRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }
    
         if(this.getElementData.statusdescription =='First Level Approved'){
      
        if (this.vendorSection) {
          this.vendorSectionRemarksModel = this.vendorSection.remark;
          this.isShowVendorremarksButtonSaveCancel = true;
          this.showHideVendorDetailsRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }

  
        if (this.persoanlInfoSection) {
          this.personalInfomationSectionRemarksModel = this.persoanlInfoSection.remark;
          this.isShowPersoanlInforemarksButtonSaveCancel = true;
          this.showHidePersonalInrmationDetailsRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }
        
        if (this.contactInfoSection) {
          this.contactInfomationSectionRemarksModel = this.contactInfoSection.remark;
          this.isShowContactInforemarksButtonSaveCancel = true;
          this.showHideContactInrmationDetailsRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }

      
        if (this.identityInfoSection) {
          this.identityInfomationSectionRemarksModel = this.identityInfoSection.remark;
          this.isShowIdentityInforemarksButtonSaveCancel=true;
          this.showHideIdentityInrmationDetailsRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }
        if (this.residenceSection) {
          this.residenceSectionRemarksModel = this.residenceSection.remark;
          this.isShowResidenceRemarksButtonSaveCancel=true;
          this.showHideResidenceRemarksForSendBack = true;
          this.isSetSendBackButtonVisible=true;
        }
       if (this.workExpSection) {
         this.workExpSectionRemarksModel = this.workExpSection.remark;
         this.isShowWorkExpRemarksButtonSaveCancel=true;
         this.showHideWorkExpRemarksForSendBack = true;
         this.isSetSendBackButtonVisible=true;
       }
     
       if (this.previousWorkedSection) {
        this.previousWorkedBoschSectionRemarksModel = this.previousWorkedSection.remark;
        this.isShowPreviousWorkedBoschRemarksButtonSaveCancel=true;
        this.showHidePreviousWorkedBoschRemarksForSendBack = true;
        this.isSetSendBackButtonVisible=true;
      }
    
      if (this.photoSection) {
       this.photoSectionRemarksModel = this.photoSection.remark;
       this.isShowPhotoRemarksButtonSaveCancel=true;
       this.showHidePhotoRemarksForSendBack = true;
       this.isSetSendBackButtonVisible=true;
     }

   
     if (this.parentOrgSection) {
      this.parentOrgSectionRemarksModel = this.parentOrgSection.remark;
      this.isShowParentOrgRemarksButtonSaveCancel=true;
      this.showHideParentOrgRemarksForSendBack = true;
      this.isSetSendBackButtonVisible=true;
    }
  
   if (this.ispCertificateSection) {
    this.ispCertificateSectionRemarksModel = this.ispCertificateSection.remark;
    this.isShowIspCertificateRemarksButtonSaveCancel=true;
    this.showHideIspCertificateRemarksForSendBack = true;
    this.isSetSendBackButtonVisible=true;
  }


}

      }
      if (response && response.data && response.data.firstApprovalInfo) {
        this.onboardingFirstApproveList = response.data.firstApprovalInfo[0];

      }
      this.showFirstApproveButton=false;
      this.showSecondApproveButton=false;
      if(this.getUserProfileData && (this.getUserProfileData?.email?.toLowerCase()== this.onboardingFirstApproveList?.firstApproverEmail?.toLowerCase()) && (this.onboardingFirstApproveList?.isFirstLevelApproved==false)){
        this.showFirstApproveButton=true;
      }

if((this.getUserProfileData && (this.getUserProfileData?.email?.toLowerCase()== this.onboardingFirstApproveList?.secondApproverEmail?.toLowerCase()) && (this.onboardingFirstApproveList?.isFirstLevelApproved==true))){
  this.showSecondApproveButton=true;
}
if (response && response.data && response.data.onboardingAddditionalDetails) {
    this.onboardingAddditionalDetailsData = response.data.onboardingAddditionalDetails[0];

}
if (response && response.data && response.data.resourceDelegationDetails) {
  this.checkDelegateArray=response.data.resourceDelegationDetails;
  this.checkDelegateOneTime=response.data.resourceDelegationDetails[0]
  }
    })
  }
  showFirstApproveButton:boolean=false;
  showSecondApproveButton:boolean=false;
  showHideCheckinSecurityButton:boolean=false;
  onboardingAddditionalDetailsData:any=[];
  checkDelegateOneTime:any=[];
  checkDelegateArray:any=[];
  cancelBtn() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": encodeURIComponent('resourcePlan'),
      }
    };
    this.router.navigate(["Resource-Management"], navigationExtras);
    localStorage.removeItem('deBoardIDForStatus');
  }

  handleMinusYear() {
    this.valueTotalExpYear--;
    if (this.valueTotalExpYear < 0) {
      this.valueTotalExpYear = 0;
    }
  }
  handlePlusYear() {
    this.valueTotalExpYear++;
  }

  handleMinusMonth() {
    this.valueTotalExpMonth--;
    if (this.valueTotalExpMonth < 0) {
      this.valueTotalExpMonth = 0;
    }
  }
  handlePlusMonth() {
    this.valueTotalExpMonth++;
  }
  handleMinusYearRE() {
    this.valueRelevantExpYear--;
    if (this.valueRelevantExpYear < 0) {
      this.valueRelevantExpYear = 0;
    }
  }
  handlePlusYearRE() {
    this.valueRelevantExpYear++;
  }

  handleMinusMonthRE() {
    this.valueRelevantExpMonth--;
    if (this.valueRelevantExpMonth < 0) {
      this.valueRelevantExpMonth = 0;
    }
  }
  handlePlusMonthRE() {
    this.valueRelevantExpMonth++;
  }

  submitDialog() {
    let element = [];
    let _obj = {
      rowData: element,
      type: 'Submit',
    };
    const dialogRef = this.dialog.open(SubmitOnboardingRequestDialogComponent, {
      width: '680px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  onboardDelegateButton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardDelegateDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loaderService.setShowLoading();
      if (result && result.data && result.data.dialogtext == "true") {
        let delData = result.data;
        let remarksValue=delData.remarks;
        let obj = {
          "delegateObjectId": delData.delegateObjectId,
          "delegateObjectType": delData.delegateObjectType,
          "delegatedTo": delData.delegatedTo,
          "remarks": delData.remarks,
          "createdOn": delData.createdOn,
          "delegatedBy": delData.delegatedBy
        }
        this.API.onboardingDelegateApi(obj).subscribe((response: any) => {
          this.showLoading = false;
          if (response && response.status == "success") {
            let _sendMailTo = delData.delegateSelectedMailID;
            let _sendMailCC = "";
            let _mainText = 'Onboarding Request Delegated to you Successfully';
            let buttonTextType = 'Record assigned for Approval';
            let teamName = (delData.delegateSelectedMailID.split('@')[0]).replace('external.', '').replace('.', ' ');
            let successMsg = "Onboarding Request Delegated Successfully..!";

            if((this.getElementData.statusdescription=='Submitted') || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='Submitted')){
              _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail + ','+this.vendorDetailsData?.vendorEmail;
              _mainText = this._checkuser.displayName + ' has delegated the below request for your approval.';
           }
           else if(this.getElementData.statusdescription=='First Level Approved' || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='First Level Approved')){
            _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ','+this.vendorDetailsData?.vendorEmail;
            _mainText = this._checkuser.displayName + ' has delegated the below request for your approval.';
           }
            this.sendMailApiCallMethod('Delegate', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        })
      }
      else {

      }
      this.ngOnInit();
    });
  }
  onboardRejectButton(rejectionType:any) {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardRejectDialogComponent, {
      width: '620px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let remarksValue= recordData.remark;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "remark": rejectionType +': ' + recordData.remark,
          "createdBy": recordData.createdBy,
          "status": recordData.status
        }
        this.API.onboardingSendbackRejectPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = "";
            let _sendMailCC = "";
            let _mainText = 'Below request is rejected.';
            let buttonTextType = 'Request Rejected';
            let teamName = this.vendorDetailsData?.vendorName;
            let successMsg = "Onboarding Request Rejected Saved Successfully..!";
            if((this.getElementData.statusdescription=='Submitted') || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='Submitted')){
              _sendMailTo = this.vendorDetailsData?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail;
            
           }
           else if(this.getElementData.statusdescription=='First Level Approved' || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='First Level Approved')){
            _sendMailTo = this.vendorDetailsData?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ',' +this.onboardingFirstApproveList?.firstApproverEmail;
          
           }
            this.sendMailApiCallMethod('Rejected', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  onboardSentBackButton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardSentBackDialogComponent, {
      width: '620px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let remarksValue= recordData.remark;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "remark": recordData.remark,
          "createdBy": recordData.createdBy,
          "status": recordData.status
        }
        this.API.onboardingSendbackRejectPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = "";
            let _sendMailCC = "";
            let _mainText = 'Onboarding Sent Back Saved Successfully';
            let buttonTextType = 'Onboarding Sent Back';
            let teamName = 'Team';
            let successMsg = "Onboarding Sent Back Saved Successfully..!"
            if((this.getElementData.statusdescription=='Submitted') || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='Submitted')){
              _sendMailTo = this.vendorDetailsData?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail;
           
           }
           else if(this.getElementData.statusdescription=='First Level Approved' || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='First Level Approved')){
            _sendMailTo = this.vendorDetailsData?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ',' +this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsData?.vendorEmail;
            
           }
            this.sendMailApiCallMethod('SentBack', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  onboardApproveButton() {
    let element = this.getElementData;
    let _cCompany="";
    if(element?.module=="On-boarding Request"){
      _cCompany=element?.type;
    }
    else{
   _cCompany=element?.companyCode;
    }
    let _obj = {
      rowData: element,
      gbBusinnesOptionListData: this.gbBusinnesOptionListData,
      deviceList:this.deviceList,
      checkCompany:_cCompany,
      allOnboardingDetails: this.allOnboardingDetails
    };
    const dialogRef = this.dialog.open(OnboardApproveDialogComponent, {
      width: '800px',
      maxHeight: '95vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      let approveData = result.data;
      let remarksValue= approveData.remark;
      if (result && result.data && result.data.dialogtext == "true") {
        let obj = {
          "id": approveData.id,
           "gbCode": approveData.gbBusinessArea,
          "remark": approveData.remark,
          "createdBy": approveData.createdBy || 'Bosch User',
        };
        if((element?.status =='Submitted' || element?.statusdescription =='Submitted')){//element?.companyCode=='38F0' &&
          obj["isBSGV"]= true;
          obj["onboardingBGSVaddditionalDetails"]= {
            "resourceOBRequestID":approveData.id,
            "onboardingDeviceClassMasterId": approveData.onboardingDeviceClassMasterId ,
            "isResourceAccessCardRequired":  approveData.isResourceAccessCardRequired ,
            "isNtidRequired":  approveData.isNtidRequired ,
            "isInternetAccessRequired": approveData.isInternetAccessRequired ,
            "isMailAccessRequired":  approveData.isMailAccessRequired ,
            "buildingAndFloorAccessLevel":  approveData.buildingAndFloorAccessLevel ,
            "deviceClass":  approveData.deviceClass ,
            "createdBy": approveData.createdBy ,
          }
        }
        this.API.onboardingApproveApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = "";
            let _sendMailCC = "";
            let _mainText = 'Onboarding Request Approved Successfully';
            let buttonTextType = '';
            let teamName = 'All';
            let successMsg = "Onboarding Request Approved Successfully..!";
            if((this.getElementData.statusdescription=='Submitted') || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='Submitted')){
              _sendMailTo = this.onboardingFirstApproveList?.secondApproverEmail;
              _sendMailCC = this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsData?.vendorEmail;
              _mainText = 'Below request awaiting your approval';
               teamName = this.onboardingFirstApproveList?.secondApproverName || 'All';
                buttonTextType = 'Request Approval';
            }
            else if(this.getElementData.statusdescription=='First Level Approved' || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='First Level Approved')){
               _sendMailTo = this.onboardingFirstApproveList?.secondApproverEmail;
               _sendMailCC = this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsData?.vendorEmail;
              //_mainText = 'Below request is approved';
              _mainText =  'Resource master created for<b> '+ this.getElementData.firstName + '  ' + this.getElementData.lastName +'</b>. Please raise ITSP ticket for NTID creation.';
              teamName = this.onboardingFirstApproveList?.secondApproverName || 'All';
              buttonTextType = 'Resource Master Created';
            }
            this.sendMailApiCallMethod('Approve', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        })
      }
      else {
      }
      this.ngOnInit();
    });
  }
  getDDMMYYYYDateFormat(val: any) {
    if (val) {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      let mydate = val.split('/');
      let _splitMtDate = mydate[2] + '-' + mydate[1] + '-' + mydate[0] + 'T00:00:00.000-00:00';
      let date = new Date(Date.parse(_splitMtDate));//('2012-01-26T13:51:50.417-07:00') );
      let month = monthNames[date.getMonth()];
      let _dateFinal = `${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`
      return _dateFinal
    }
  }
  updateNTIDValueOB:any="";
  updateNTidbutton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element,
      secondApproverDate: this.getDateSecondApprovedDate
    };
    const dialogRef = this.dialog.open(OnboardUpdateNtidDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let updateNtiidData = result.data;
        let remarksValue= updateNtiidData.remark;
        this.updateNTIDValueOB=updateNtiidData.ntId;
        let obj = {
          "resourceOBRequestID": updateNtiidData.resourceOBRequestID,
          "ntId": updateNtiidData.ntId,
          "ntidCreatedDt": moment(updateNtiidData.ntidCreatedDt).format('YYYY-MM-DDTHH:mm:ss[Z]'),
          "remark": updateNtiidData.remark,
          "createdBy": updateNtiidData.createdBy,
          "boschEmailId": updateNtiidData.boschEmailId
        }
        this.API.onboardingUpdateNtidPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = this.onboardingFirstApproveList?.firstApproverEmail;
            let _sendMailCC = this.onboardingFirstApproveList?.secondApproverEmail+','+this.vendorDetailsData?.vendorEmail;
            let _mainText = `NTID Created for <b> ${this.getElementData.firstName}   ${this.getElementData.lastName}  </b> and expected date of joining is <b> ${moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY')}</b>.<br><br>NTID credentials will be shared with the resource on their email address after collecting the Access Card.<br><br>Remarks: ${updateNtiidData.remark}`;
            let buttonTextType = 'NT ID Created';
            let teamName = this.onboardingFirstApproveList?.firstApproverName;
            let successMsg = "Onboarding Update NTID Saved Successfully..!"
            this.sendMailApiCallMethod('Update NTID', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);

setTimeout(()=>{
  let sendTo = this.onboardingFirstApproveList?.secondApproverEmail;
  let sendCC = this.onboardingFirstApproveList?.firstApproverEmail;
  let teamNameACR=this.onboardingFirstApproveList?.secondApproverName;
  let buttonTextTypeACr = 'Asset Creation Request';
  let mainTextAcr = `NTID Created for <b> ${this.getElementData.firstName}   ${this.getElementData.lastName}  </b> and expected date of joining is <b> ${moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY')}</b>.<br> Please raise ITSP ticket for Asset Request.<br><br>NTID credentials will be shared with the resource on their email address after collecting the Access Card.<br><br>Remarks: ${updateNtiidData.remark}`;
  this.sendMailApiCallMethod('Asset Creation Request', sendTo, sendCC, mainTextAcr, buttonTextTypeACr, teamNameACR, successMsg,remarksValue);
},3000)


          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  checkinCreatedBy:any="";
  checkInbutton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardCheckinDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let updateNtiidData = result.data;
        let remarksValue= updateNtiidData.remark;
       this.checkinCreatedBy=updateNtiidData?.createdBy;
        let obj = {
          "resourceOBRequestID": updateNtiidData.resourceOBRequestID,
          "remark": updateNtiidData.remark,
          "createdBy": updateNtiidData.createdBy
        }
        this.API.onboardingCheckinPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = this.onboardingFirstApproveList?.secondApproverEmail;
            let _sendMailCC = this.vendorDetailsData?.vendorEmail+','+this.fcmSecurityCheckinData?.fcmSecurityEmail?.toLowerCase()+','+ this.onboardingFirstApproveList?.firstApproverEmail;          
            let _mainText = `<b> ${this.getElementData.firstName}   ${this.getElementData.lastName}  </b> from  <b> ${this.vendorDetailsData?.vendorName}</b> checked in at  <b> ${this.resourceObOrganizationDetailData.joiningLocation}</b><br><br>Kindly provide Access card to the resource.<br><br>Remarks: ${updateNtiidData.remark}`;
            let buttonTextType = 'Resource Checked In';
            let teamName =this.onboardingFirstApproveList?.secondApproverName;
            let successMsg = "Onboarding Check In Saved Successfully..!"
            this.sendMailApiCallMethod('Check In', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }

  issueIdCardbutton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardIssueidCardDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let issueIDCardData = result.data;
        let remarksValue= issueIDCardData.remark;
        let obj = {
          "resourceOBRequestID": issueIDCardData.resourceOBRequestID,
          "remark": issueIDCardData.remark,
          "createdBy": issueIDCardData.createdBy
        }
        this.API.onboardingIssueIDcardPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let getCurrentDateTime=moment(new Date()).format('DD-MMM-YYYY hh:mm A');
            let _sendMailTo = this.vendorDetailsData?.vendorEmail+','+ this.onboardingFirstApproveList?.secondApproverEmail + ',' +this.resourceObResourceDetailsData?.officialEmailId;
            let _sendMailCC = this.onboardingFirstApproveList?.firstApproverEmail;
            let _mainText = `Access card has been issues on  <b> ${moment(getCurrentDateTime).format('DD-MMM-YYYY')}</b> by  <b> ${(issueIDCardData.createdBy)}</b>  .<br><br>NT ID Credential will be shared to your verified email address by <b>${this.onboardingFirstApproveList?.secondApproverName}</b>.<br><br>Remarks: ${issueIDCardData.remark}`;
            let buttonTextType = 'Access Card Issued';
            let teamName = `${this.getElementData.firstName}   ${this.getElementData.lastName} `;
            let successMsg = "Onboarding Issue ID Card Saved Successfully..!"
            this.sendMailApiCallMethod('Issue ID Card', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  shareNTIDbutton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element,
      ntidData:this.onboardingFirstApproveList?.ntId
    };
    const dialogRef = this.dialog.open(OnboardShareNtidDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let shareNtidData = result.data;
        let remarksValue= shareNtidData.remark;
        let obj = {
          "resourceOBRequestID": shareNtidData.resourceOBRequestID,
          "ntId": shareNtidData.ntId,
          "ntIdPassword": shareNtidData.ntIdPassword,
          "remark": shareNtidData.remark,
          "createdBy": shareNtidData.createdBy
        }
        this.loaderService.setShowLoading();
        this.API.onboardingShareNtidPostApi(obj).subscribe((response: any) => {
          
          if (response && response.status == "success") {
            let _sendMailObjectRob = {
              featureCode: 'MasterData-Approval-Process',
              to: this.onboardingFirstApproveList?.firstApproverEmail,
              cc: this.onboardingFirstApproveList?.secondApproverEmail +','+this.vendorDetailsData?.vendorEmail  ,
              subject: 'ENRICO|Resource Onboarding| ' + this.onboardingFirstApproveList?.onbordingRequestId + ' | ' + 'Resource Onboarded',
              paraInTemplate: {
                teamName: this.onboardingFirstApproveList?.firstApproverName || 'All', 
                 mainText: `<b> ${this.getElementData.firstName} ${this.getElementData.lastName}</b> from <b>${this.vendorDetailsData?.vendorName}</b> has onboarded against the <Sign off ID>.`  +  "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> -- </td></tr><tr ><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr class='trbg'><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr ><td><b>Group</b></td> <td>"+this.resourceObOrganizationDetailData?.groupName+"</td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY') + " </td></tr><tr class='trbg'><td><b>Contract End Date</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.contractEndDate).format('DD-MMM-YYYY')+"</td></tr><tr ><td><b>SOW JD ID</b></td> <td>"+this.resourceObSowjdOrderDetailData.soWJdID+"</td></tr><tr ><td><b>Skillset</b></td> <td>"+this.resourceObSowjdOrderDetailData.skillset+"</td></tr><tr><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>"
              }
            };
            this.API.sendMailinitiateDeboardPost(_sendMailObjectRob).subscribe((response: any) => {
            }  );

setTimeout(()=>{ 
  this.loaderService.setDisableLoading();
            let _sendMailTo =this.resourceObResourceDetailsData?.officialEmailId;
            let _sendMailCC = "";   
            let _mainText = `Please find the login credentials to access Bosch Network.<br><br>Kindly reset the password after login.
            <style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>NT ID</b></td> <td>${shareNtidData?.ntId}</td></tr><tr class='trbg'><td><b>Password</b></td> <td>${shareNtidData?.ntIdPassword}</td></tr></table><br><br>Remarks: ${shareNtidData.remark}`;
            let buttonTextType = 'NTID Credential';
            let teamName = `${this.getElementData.firstName} ${this.getElementData.lastName} `;
            let successMsg = "Onboarding Share NTID Saved Successfully..!"
            this.sendMailApiCallMethod('Share NTID', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);

},3000)

          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  initiateBGVbutton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element,
      vendorOptionList:this.bgvVendorList
    };
    const dialogRef = this.dialog.open(OnboardingInitiateBackgroundVerificationDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let remarksValue= recordData.remark;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "bgvVendorId": recordData.bgvVendorId,
          "remark": recordData.remark,
          "createdBy": recordData.createdBy,
          "bgvVendorName": recordData.bgvVendorName

        }

        this.API.onboardingInitiateBackgroundVerificationPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = "external.veenit.kumar@in.bosch.com" +','+ 'external.Vetrivel.V@in.bosch.com';
            let _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail;
            let _mainText = `Please acknowledge and initiate BGV for <b> ${this.getElementData.firstName} ${this.getElementData.lastName}</b>.<br><br>Kindly upload the BGV report.`;
            let buttonTextType = 'BGV Initiated';
            let teamName = recordData?.bgvVendorName;
            let successMsg = "Onboarding Initiate Background Verification Saved Successfully..!"
            this.sendMailApiCallMethod('Initiate Background Verification', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  ackknowledgeBGVbutton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardingAcknowledgeBvrDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "remark": recordData.remark,
          "createdBy": recordData.createdBy
        }
        this.API.onboardingAcknowledgeBvPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo =this.onboardingFirstApproveList?.secondApproverEmail;
            let _sendMailCC = "";
            let _mainText = ` <b>BGV Vendor Name</b> has acknowledged the BGV request for <b> ${this.getElementData.firstName} ${this.getElementData.lastName}</b>.`;
            let buttonTextType = 'BGV Request Acknowledged';
            let teamName = this.onboardingFirstApproveList?.secondApproverName ;
            let successMsg = "Onboarding Acknowledge Background Verification Request Saved Successfully..!";
        let tableFormat="";
        tableFormat=  "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.getElementData.onboardingRequestId +"</td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>";
        
            let _sendMailObject = {
              featureCode: 'MasterData-Approval-Process',
              entityId :  '00000000-0000-0000-0000-000000000000',
              to: _sendMailTo,
              cc: _sendMailCC,
              subject: 'ENRICO|Resource Onboarding| ' + this.getElementData.onboardingRequestId + ' | ' + buttonTextType,
              paraInTemplate: {
                teamName: teamName || 'All', 
                 mainText: _mainText  +  tableFormat
              }
            };
            this.snackBar.open(successMsg, 'Close', {
              duration: 4000,
            });
            this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
            }
            );
            setTimeout(() => {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  "data": encodeURIComponent('onboarding'),
                }
              };
              this.router.navigate(["Resource-Management"], navigationExtras);
              localStorage.removeItem('deBoardIDForStatus');
            }, 1000)
    
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  updateBGVreportButton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardingUpdateBgvReportDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "bgvReportStatus": recordData.bgvReportStatus,
          "remark": recordData.remark,
          "documentName": recordData.documentName,
          "documentURL": recordData.documentURL,
          "fileContent": recordData.fileContent,
          "createdBy": recordData.createdBy,
        }

        this.API.onboardingUpdateBGVReportPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo =this.onboardingFirstApproveList?.secondApproverEmail;
            let _sendMailCC = "";          
            let _mainText = ` <b>BGV Vendor Name</b>  has submitted the BGV report for <b> ${this.getElementData.firstName} ${this.getElementData.lastName}</b> and the status is <b>${recordData?.bgvReportStatus}</b>.`;  
                     if(recordData?.bgvReportStatus=='Failed'){
                      _mainText =_mainText + `<br><br>Deboarding request <b> ${this.getElementData?.deboardingRequestID} </b> has been auto initiated for this resource based on the BGV status. `;  
                     }
            let buttonTextType = 'BGV Report';
            let teamName = this.onboardingFirstApproveList?.secondApproverName ;
            let successMsg = "Onboarding Update BGV Report Saved Successfully..!";          
        let tableFormat="";
        tableFormat=  "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.getElementData.onboardingRequestId +"</td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>";
        
            let _sendMailObject = {
              featureCode: 'MasterData-Approval-Process',
              entityId :  '00000000-0000-0000-0000-000000000000',
              to: _sendMailTo,
              cc: _sendMailCC,
              subject: 'ENRICO|Resource Onboarding| ' + this.getElementData.onboardingRequestId + ' | ' + buttonTextType,
              paraInTemplate: {
                teamName: teamName || 'All', 
                 mainText: _mainText  +  tableFormat
              }
            };
            this.snackBar.open(successMsg, 'Close', {
              duration: 4000,
            });
            this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
            }
            );
            setTimeout(() => {
              let navigationExtras: NavigationExtras = {
                queryParams: {
                  "data": encodeURIComponent('onboarding'),
                }
              };
              this.router.navigate(["Resource-Management"], navigationExtras);
              localStorage.removeItem('deBoardIDForStatus');
            }, 1000)
    


          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  extendDojButton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element,
      companyTypeCode:'38F0'
    };
    const dialogRef = this.dialog.open(OnboardingExtendDateOfJoiningDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let extendDOJData = result.data;
        let remarksValue= extendDOJData.remark;
        let obj = {
          "resourceOBRequestID": extendDOJData.resourceOBRequestID,
          "newDoj": moment(extendDOJData.newDoj).format('YYYY-MM-DDTHH:mm:ss[Z]'),
          "remark": extendDOJData.remark,
          "createdBy": this.getUserProfileData.name// extendDOJData.createdBy
        }
        this.API.onboardingExtendDateofJoiningPostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo =this.onboardingFirstApproveList?.secondApproverEmail +','+ this.onboardingFirstApproveList?.firstApproverEmail ;
        let _sendMailCC = this.vendorDetailsData?.vendorEmail;          
        let _mainText = ` <b>${this.vendorDetailsData?.vendorName}</b> has extended the date of joining for the resource  <b> ${this.getElementData.firstName} ${this.getElementData.lastName}</b> from  <b> ${moment(this.getElementData?.expectedDOJ).format('DD-MMM-YYYY')} </b> to <b> ${moment(extendDOJData.newDoj).format('DD-MMM-YYYY')} </b>.`; 
       let buttonTextType = 'Date of Joining Extended';
        let teamName = this.onboardingFirstApproveList?.secondApproverName +','+ this.onboardingFirstApproveList?.firstApproverName;
        let successMsg = "Onboarding Update BGV Report Saved Successfully..!";          
    let tableFormat="";
    tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> -- </td></tr><tr ><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr class='trbg'><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr ><td><b>Group</b></td> <td>"+this.resourceObOrganizationDetailData?.groupName+"</td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY') + " </td></tr><tr class='trbg'><td><b>Contract End Date</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.contractEndDate).format('DD-MMM-YYYY')+"</td></tr><tr ><td><b>SOW JD ID</b></td> <td>"+this.resourceObSowjdOrderDetailData.soWJdID+"</td></tr><tr ><td><b>Skillset</b></td> <td>"+this.resourceObSowjdOrderDetailData.skillset+"</td></tr><tr><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>";
      let _sendMailObject = {
          featureCode: 'MasterData-Approval-Process',
          entityId :  '00000000-0000-0000-0000-000000000000',
          to: _sendMailTo,
          cc: _sendMailCC,
          subject: 'ENRICO|Resource Onboarding| ' + this.getElementData.onboardingRequestId + ' | ' + buttonTextType,
          paraInTemplate: {
            teamName: teamName || 'All', 
             mainText: _mainText  +  tableFormat
          }
        };
        this.snackBar.open(successMsg, 'Close', {
          duration: 4000,
        });
        this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
        }
        );
        setTimeout(() => {
          let navigationExtras: NavigationExtras = {
            queryParams: {
              "data": encodeURIComponent('onboarding'),
            }
          };
          this.router.navigate(["Resource-Management"], navigationExtras);
          localStorage.removeItem('deBoardIDForStatus');
        }, 1000)
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }
  ntidDeactivatedButton() {
    let element = this.getElementData;
    let _obj = {
      rowData: element,
      ntidDate:this.ntIDDetailsList?.createdOn 
    };
    const dialogRef = this.dialog.open(OnboardingNtidDeactivateDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let remarksValue= recordData.remark;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "ntidDeactivatedDate": recordData.ntidDeactivatedDate,
          "ntidDeletedDate": null,
          "remark": recordData.remark,
          "createdBy": recordData.createdBy,
        }

        this.API.onboardingNtidDeactivatePostApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = "";
            let _sendMailCC = "";
            let _mainText = 'Onboarding NTID Deactivated Saved Successfully';
            let buttonTextType = 'NTID Deactivate';
            let teamName = 'Team';
            let successMsg = "Onboarding NTID Deactivated Saved Successfully..!"
            this.sendMailApiCallMethod('NTID Deactivate', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
    });
  }

  sowJDInfoSendBackButton1() {
    this.showHideSowJdRemarksForSendBack = true;
  }
  organizationInfoSendBackButton1() {
    this.showHideOrganizationRemarksForSendBack = true;
  }
  vendorInfoSendBackButton1() {
    this.showHideVendorDetailsRemarksForSendBack = true;
  }

  personalInfoInfoSendBackButton1() {
    this.showHidePersonalInrmationDetailsRemarksForSendBack = true;
  }
  contactInfoInfoSendBackButton1(){
  this.showHideContactInrmationDetailsRemarksForSendBack=true;
}
identityInfoInfoSendBackButton1(){
  this.showHideIdentityInrmationDetailsRemarksForSendBack=true;
}

residenceSendBackButton1(){
  this.showHideResidenceRemarksForSendBack=true;
}

workExpSendBackButton1(){
  this.showHideWorkExpRemarksForSendBack = true;
}
previousWorkedSendBackButton1(){
  this.showHidePreviousWorkedBoschRemarksForSendBack=true;
}
photoSendBackButton1(){
  this.showHidePhotoRemarksForSendBack = true;
}


  parentOrgSendBackButton1(){
  this.showHideParentOrgRemarksForSendBack=true;
  }
  

  ispCertificateSendBackButton1(){
  this.showHideIspCertificateRemarksForSendBack =true;
  }
  

  


  cancelSendBackForSowJD() {
    this.showHideSowJdRemarksForSendBack = false;
    this.showHideOrganizationRemarksForSendBack = false;
    this.confirmSendbackbtnShowHide = false;
  }

  cancelSendBack2(){
    this.showHideSowJdRemarksForSendBack = false;
    this.showHideOrganizationRemarksForSendBack= false;
    this.showHideVendorDetailsRemarksForSendBack= false;
    this.showHidePersonalInrmationDetailsRemarksForSendBack = false;
    this.showHideContactInrmationDetailsRemarksForSendBack = false;
    this.showHideIdentityInrmationDetailsRemarksForSendBack = false;
   
    this.showHideResidenceRemarksForSendBack=false;

    this.showHideWorkExpRemarksForSendBack=false;
    this.showHidePreviousWorkedBoschRemarksForSendBack=false;
    this.showHidePhotoRemarksForSendBack=false;
 
  
    this.showHideParentOrgRemarksForSendBack=false;
  
    this.showHideIspCertificateRemarksForSendBack=false;
 
   
    this.confirmSendbackbtnShowHide = false;
  }


  cancelSowjdRemarks() {
    this.isShowSowJDremarksButtonSaveCancel = true;
  }
  cancelOrganizationRemarks() {
    this.isShowOrganizationremarksButtonSaveCancel = true;
  }
  cancelVendorRemarks() {
    this.isShowVendorremarksButtonSaveCancel = true;
  }
  cancelPersonalInformationRemarks() {
    this.isShowPersoanlInforemarksButtonSaveCancel = true;
  }
  cancelContactInformationRemarks(){
    this.isShowContactInforemarksButtonSaveCancel = true;
  }
  cancelIdentityInformationRemarks(){
this.isShowIdentityInforemarksButtonSaveCancel=true;
  }

  cancelResidenceRemarks(){
    this.isShowResidenceRemarksButtonSaveCancel=true;
      }
     
      cancelWorkExpRemarks(){
        this.isShowWorkExpRemarksButtonSaveCancel=true;
      }
      cancelPreviousWorkedBoschRemarks(){
        this.isShowPreviousWorkedBoschRemarksButtonSaveCancel=true;
      }
      cancelPhotoRemarks(){
        this.isShowPhotoRemarksButtonSaveCancel=true;
      }
   
     
        cancelParentOrgRemarks(){
        this.isShowParentOrgRemarksButtonSaveCancel =true;
        }
     
        cancelIspCertificateRemarks(){
          this.isShowIspCertificateRemarksButtonSaveCancel =true;
        }
    
  saveSowjdRemarks() {
    this.isShowSowJDremarksButtonSaveCancel = true;
    this.commonRemarksSectionSave("SowjdSection", this.sowjdSectionRemarksModel, this.sowJdSection, "SOW JD Send Back Remarks Saved Successfully", 'Sow JD');
  }

  saveOrganizationRemarks() {
    this.isShowOrganizationremarksButtonSaveCancel = true;
    this.commonRemarksSectionSave("OrganizationSection", this.organizationSectionRemarksModel, this.organizationSection, "Organization Send Back Remarks Saved Successfully", "Organization");
  }
  saveVendorRemarks() {
    this.isShowVendorremarksButtonSaveCancel = true;
    this.commonRemarksSectionSave("VendorSection", this.vendorSectionRemarksModel, this.vendorSection, "Vendor Send Back Remarks Saved Successfully", "Vendor");
  }

  savePersonalInformationRemarkss() {
    this.isShowPersoanlInforemarksButtonSaveCancel = true;
    this.commonRemarksSectionSave("PersonalInformationSection", this.personalInfomationSectionRemarksModel, this.persoanlInfoSection, "Personal Information Send Back Remarks Saved Successfully", "Personal Information");
  }
  saveContactInformationRemarkss() {
    this.isShowContactInforemarksButtonSaveCancel = true;
    this.commonRemarksSectionSave("ContactInformationSection", this.contactInfomationSectionRemarksModel, this.contactInfoSection, "Contact Information Send Back Remarks Saved Successfully", "Contact Information");
  }
  saveIdentityInformationRemarkss(){
    this.isShowIdentityInforemarksButtonSaveCancel=true;
    this.commonRemarksSectionSave("IdentityInformationSection", this.identityInfomationSectionRemarksModel, this.identityInfoSection, "Identity Information Send Back Remarks Saved Successfully", "Identity Information");
  }

  saveResidenceRemarkss(){
    this.isShowResidenceRemarksButtonSaveCancel=true; 
    this.commonRemarksSectionSave("ResidenceSection", this.residenceSectionRemarksModel, this.residenceSection, "Residence Details Send Back Remarks Saved Successfully", "Residence");

  }


  saveWorkExpRemarkss(){
    this.isShowWorkExpRemarksButtonSaveCancel=true;
    this.commonRemarksSectionSave("WorkExperienceSection", this.workExpSectionRemarksModel, this.workExpSection, "Work Expereince Send Back Remarks Saved Successfully", "Work Experience");
  }
  savePreviousWorkedBoschRemarkss(){
    this.isShowPreviousWorkedBoschRemarksButtonSaveCancel=true;
    this.commonRemarksSectionSave("PreviousWorkedSection", this.previousWorkedBoschSectionRemarksModel, this.previousWorkedSection, "Previous Worked Send Back Remarks Saved Successfully", "Previous Worked");
  }
  savePhotoRemarkss(){
    this.isShowPhotoRemarksButtonSaveCancel=true;
    this.commonRemarksSectionSave("PhotoSection", this.photoSectionRemarksModel, this.photoSection, "Photo Send Back Remarks Saved Successfully", "Photo");
  }


    
    saveParentOrgRemarkss(){
    this.isShowParentOrgRemarksButtonSaveCancel =true;
    this.commonRemarksSectionSave("ParentOrgCardSection", this.parentOrgSectionRemarksModel, this.parentOrgSection, "Parent Organization ID Card Send Back Remarks Saved Successfully", "Parent Organization ID Card");
    }

    saveIspCertificateRemarkss(){
      this.isShowIspCertificateRemarksButtonSaveCancel =true;
      this.commonRemarksSectionSave("IspCertificateSection", this.ispCertificateSectionRemarksModel, this.ispCertificateSection, "ISP Certificate Send Back Remarks Saved Successfully", "ISP Certificate");
  
    }




  editSowjdRemarks() {
    this.isShowSowJDremarksButtonSaveCancel = false;
  }
  editOrganizationRemarks() {
    this.isShowOrganizationremarksButtonSaveCancel = false;
  }
  editVendorRemarks() {
    this.isShowVendorremarksButtonSaveCancel = false;
  }
  editPersonalInfoRemarks() {
    this.isShowPersoanlInforemarksButtonSaveCancel = false;
  }
  editContactInfoRemarks(){
    this.isShowContactInforemarksButtonSaveCancel = false;
  }
  editIdentityInfoRemarks(){
    this.isShowIdentityInforemarksButtonSaveCancel=false;
  }

  editResidenceRemarks(){
    this.isShowResidenceRemarksButtonSaveCancel=false; 
  }

  editWorkExpRemarks(){
    this.isShowWorkExpRemarksButtonSaveCancel=false;
  }
  editPreviousWorkedBoschRemarks(){
    this.isShowPreviousWorkedBoschRemarksButtonSaveCancel=false;
  }
  editPhotoRemarks(){
    this.isShowPhotoRemarksButtonSaveCancel=false;
  }

    
 
    
    editParentOrgRemarks(){
    this.isShowParentOrgRemarksButtonSaveCancel =false;
    }
   
    editIspCertificateRemarks(){
      this.isShowIspCertificateRemarksButtonSaveCancel =false;
    }


  sendbackEditSowJD() {
    this.confirmSendbackbtnShowHide = true;
  }

  isSetSendBackButtonVisible:boolean=false;
  commonRemarksSectionSave(sectionType: any, modelRemarksData: any, sectionArray: any, msg: any, text: any) {
    this.isSetSendBackButtonVisible=false;
    if (modelRemarksData == "" || modelRemarksData == null || modelRemarksData == undefined) {
      this.snackBar.open(text + " Section's Remarks is empty*", 'Close', {
        duration: 4000,
      });
      return
    }
    let _createdBy = '';
    if (this._checkuser) {
      _createdBy = this._checkuser.displayName;
    }
    let secID = "";
    if (sectionArray) {
      secID = sectionArray.id;
    }
    else {
      secID = "00000000-0000-0000-0000-000000000000";
    }
    let _obj = {
      "id": secID,
      "resourceOBRequestID": this.getElementData.id,
      "remark": modelRemarksData,
      "section": sectionType,
      "createdBy": _createdBy
    }

    this.loaderService.setShowLoading();
    this.API.sowJdSectionSendBackInOb(_obj).subscribe((res: any) => {
      this.loaderService.setDisableLoading();
      if (res && res.status == "success") {
        this.snackBar.open(msg, 'Close', {
          duration: 4000,
        });
        this.isSetSendBackButtonVisible=true;
      }
    })
  }


  confirmSendbackEditSowJD(levelType:any) {
    let element = this.getElementData;
    let _obj = {
      rowData: element
    };
    const dialogRef = this.dialog.open(OnboardSentBackDialogComponent, {
      width: '620px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == "true") {
        let recordData = result.data;
        let remarksValue=recordData.remark;
        let obj = {
          "resourceOBRequestID": recordData.resourceOBRequestID,
          "remark": recordData.remark,
          "createdBy": recordData.createdBy,
          "level":levelType,
        }
        this.API.onboardingSendbackLevelWiseConfirmApi(obj).subscribe((response: any) => {
          if (response && response.status == "success") {
            let _sendMailTo = "";
            let _sendMailCC = "";
            let _mainText = 'Below request send back';
            let buttonTextType = 'Request Sent Back';
            let teamName = 'Team';
            let successMsg = levelType +" Confirm Send Back Saved Successfully."
            if((this.getElementData.statusdescription=='Submitted') || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='Submitted')){
              _sendMailTo = this.vendorDetailsData?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail;           
           }
           else if(this.getElementData.statusdescription=='First Level Approved' || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='First Level Approved')){
            _sendMailTo = this.vendorDetailsData?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ',' +this.onboardingFirstApproveList?.firstApproverEmail;
            
           }
            this.sendMailApiCallMethod('SentBack', _sendMailTo, _sendMailCC, _mainText, buttonTextType, teamName, successMsg,remarksValue);
          }
        });
      }
      else {

      }
      this.ngOnInit();
      this.showHideSowJdRemarksForSendBack = false;
      this.confirmSendbackbtnShowHide = false;
    });
  }

 

  photoClickDownload() {
    let fileURL = this.photoDocumentFileGet.documentURL + '?' + this.forDownloadSSNtoken;
    let fileName = this.photoDocumentFileGet.documentName;
    this.downloadFileMethod(fileURL, fileName);
  }


  parentOrgClickDownload() {
    let fileURL = this.parentOrgFileGet.documentURL + '?' + this.forDownloadSSNtoken;
    let fileName = this.parentOrgFileGet.documentName;
    this.downloadFileMethod(fileURL, fileName);
  }


  ispCertificateClickDownload() {
    let fileURL = this.ispCertificateFileGet.documentURL + '?' + this.forDownloadSSNtoken;
    let fileName = this.ispCertificateFileGet.documentName;
    this.downloadFileMethod(fileURL, fileName);
  }


  bgvReportClickDownload(){
    let fileURL = this.bgvCompletedDetailsList.bgvReportUrl + '?' + this.forDownloadSSNtoken;  
    let fileName = this.filenameBGVReport;
    this.downloadFileMethod(fileURL, fileName);
  }
  downloadFileMethod(fileURL, fileName) {
    const link = document.createElement('a');
   // link.setAttribute('target', '_blank');
    link.setAttribute('href', fileURL);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  sendMailApiCallMethod(btnType: any, _sendMailTo: any, _sendMailCC: any, _mainText: any, buttonTextType: any, teamName: any, successMsg: any,remarkValue:any) {
    let _createdOn = moment(new Date()).format('DD-MMM-yyyy');
    let tableFormat="";
    if(btnType=='Approve' && (this.getElementData.statusdescription=='First Level Approved' || (this.getElementData.module=='On-boarding Request' && this.getElementData.status=='First Level Approved'))){
        tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>Identity/User Type</b></td> <td> External </td></tr><tr><td><b>Resource Number</b></td> <td> -- </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.vendorDetailsData?.vendorId+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.vendorDetailsData?.vendorName+" </td></tr><tr class='trbg'><td><b>Group</b></td> <td>"+this.resourceObOrganizationDetailData?.groupName+"</td></tr><tr><td><b>Department</b></td> <td> "+this.resourceObOrganizationDetailData?.departmentName+" </td></tr><tr class='trbg'><td><b>Create Mail Box</b></td> <td>Yes</td></tr><tr><td><b>External Email Communication</b></td> <td> "+this.resourceObResourceDetailsData?.officialEmailId+" </td></tr><tr class='trbg'><td><b>Internet Access</b></td> <td>--</td></tr><tr><td><b>Date of Joining</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY') + " </td></tr><tr class='trbg'><td><b>Account Valid Until</b></td> <td>--</td></tr><tr><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>";
    }
    else if(btnType=='Update NTID'){
      tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> -- </td></tr><tr ><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr class='trbg'><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr><td><b>NT ID</b></td> <td>"+this.updateNTIDValueOB+"</td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.vendorDetailsData?.vendorId+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.vendorDetailsData?.vendorName+" </td></tr><tr class='trbg'><td><b>Group</b></td> <td>"+this.resourceObOrganizationDetailData?.groupName+"</td></tr><tr><td><b>Date of Joining</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY') + " </td></tr><tr class='trbg'><td><b>Contract End Date</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.contractEndDate).format('DD-MMM-YYYY')+"</td></tr><tr><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>";
    }
else if(btnType=='Asset Creation Request'){
  tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr class='trbg'><td><b>Email ID</b></td> <td> -- </td></tr><tr><td><b>Contact Number</b></td> <td> -- </td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> -- </td></tr><tr><td><b>NT ID</b></td> <td>"+this.updateNTIDValueOB +"</td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.vendorDetailsData?.vendorId+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.vendorDetailsData?.vendorName+" </td></tr><tr class='trbg'><td><b>Group</b></td> <td>"+this.resourceObOrganizationDetailData?.groupName+"</td></tr><tr><td><b>Group Manager Name</b></td> <td>-- </td></tr><tr class='trbg'><td><b>Group Manager Email ID</b></td> <td>--</td></tr><tr><td><b>Work Location</b></td> <td>--</td></tr><tr class='trbg'><td><b>Hiring Type</b></td> <td>--</td></tr><tr><td><b>Type of Hire</b></td> <td>--</td></tr><tr  class='trbg'><td><b>Date of Joining</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY') + " </td></tr><tr><td><b>Contract End Date</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.contractEndDate).format('DD-MMM-YYYY')+"</td></tr><tr  class='trbg'><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>"
}
    else if(btnType=='Check In'){
      let getCurrentDateTime=moment(new Date()).format('DD-MMM-YYYY hh:mm A');
      tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> -- </td></tr><tr ><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr class='trbg'><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr><td><b>NT ID</b></td> <td>"+this.ntIDDetailsList?.ntId +"</td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.vendorDetailsData?.vendorId+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.vendorDetailsData?.vendorName+" </td></tr><tr class='trbg'><td><b>Group</b></td> <td>"+this.resourceObOrganizationDetailData?.groupName+"</td></tr><tr><td><b>Date of Joining</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.expectedDateOfJoing).format('DD-MMM-YYYY') + " </td></tr><tr class='trbg'><td><b>Contract End Date</b></td> <td>"+moment(this.resourceObSowjdOrderDetailData?.contractEndDate).format('DD-MMM-YYYY')+"</td></tr><tr ><td><b>Check In date & Time</b></td> <td>"+getCurrentDateTime+" </td></tr><tr class='trbg'><td><b>Check In By</b></td> <td> "+this.checkinCreatedBy+" </td></tr><tr><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>";
    }
    else if(btnType=='Issue ID Card' || btnType=='Share NTID'){
      tableFormat="";
    }
    else if(btnType=='Initiate Background Verification'){
        tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Onboarding Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+ this.resourceObResourceDetailsData.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+ this.resourceObResourceDetailsData.lastName +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr></table>"
    }
    else{
      tableFormat="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + this.onboardingFirstApproveList?.onbordingRequestId +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Onboarding </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> "+this.vendorDetailsData?.vendorName+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + this._getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr><tr class='trbg'><td><b>Remarks</b></td> <td>" + this.getRemarkTextparagrapg(remarkValue) + "</td></tr></table>"
    }
    let _sendMailObject = {
      featureCode: 'MasterData-Approval-Process',
      to: _sendMailTo,
      cc: _sendMailCC,
      subject: 'ENRICO|Resource Onboarding| ' + this.onboardingFirstApproveList?.onbordingRequestId + ' | ' + buttonTextType,
      paraInTemplate: {
        teamName: teamName || 'All', 
         mainText: _mainText  +  tableFormat
      }
    };
    if(btnType=='Asset Creation Request'){
console.log(successMsg)
    }else{
    this.snackBar.open(successMsg, 'Close', {
      duration: 4000,
    });
  }
    this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
    }
    );
    setTimeout(() => {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "data": encodeURIComponent('onboarding'),
        }
      };
      this.router.navigate(["Resource-Management"], navigationExtras);
      localStorage.removeItem('deBoardIDForStatus');
    }, 1000)
  }
  getRemarkTextparagrapg(remarksValue:any){
    return remarksValue.replace('FirstRejectedButtonOB:',' ').replace('SecondRejectedButtonOB:',' ').replace('SubmitRemarksFirstOBs:',' ').replace('ReSubmitRemarksSecondOBs:',' ')
  }
  clickDeboardingID(){ 
    let element={id:this.deboardingDataDetailsList?.debordingRequestId}

      localStorage.removeItem('deBoardIDForStatus');
      let _rowobjAllDetails = {
        "element": JSON.stringify(element)
      }
      this.router.navigate(['/Resource-Management/De-boarding Request Details'], { queryParams: _rowobjAllDetails, skipLocationChange: true });
    }
    // userDetails: userProfileDetails;
    // roleList = [];
    // checkRoleOnboarding: boolean = false;
    // hrSpocRoleOnly: boolean = false;
    // _roleGetPermission: any = [];
 
    // getUserRolesInfo() {
    //   this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
    //   if(this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail[0] && this.userDetails.roleDetail[0].roleDetails){
    //     this.roleList = this.userDetails?.roleDetail[0]?.roleDetails?.map((item: any) => item.roleName);  
    //   }
    //     this.checkRoleOnboarding= this.findCommonElement(this.roleList, ['BGV Vendor','BGV_Vendor','Vendor', 'Vendor_BGSV', 'Vendor_BGSW','vendor', 'SOW JD Owner','SOW_JD_OWNER','Sow_JD_Owner', 'Sign off Owner','Sign_Off_Owner','Sign_off_Owner','sign_off_owner','BU SPOC/HOT','BU_SPOC_HOT','BU_SPOC_HOT_BGSV','BU_SPOC_HOT_BGSW','OSM Admin','OSM','HR_SPOC','HR SPOC','hr_spoc','hr spoc','HR_SPOC_BGSW', 'HR_SPOC_BGSV','HR SPOC BGSW', 'HR SPOC BGSV','FCM Security','FCM_Security','FCM_SECURITY','Fcm_Security','fcm security','Employee Card','employee card','Employee_Card','employee_card','ASSET_SPOC','ASSET SPOC','asset_spoc','asset spoc','ASSET_SPOC_BGSW', 'ASSET_SPOC_BGSV','ASSET SPOC BGSW', 'ASSET SPOC BGSV','VIEW','View','view']);  
    //     this.hrSpocRoleOnly= this.findCommonElement(this.roleList, ['HR_SPOC','HR SPOC','hr_spoc','hr spoc','HR_SPOC_BGSW', 'HR_SPOC_BGSV','HR SPOC BGSW', 'HR SPOC BGSV']);  

    //    this.getRolePermission();
    // }
  
    findCommonElement(array1, array2) {
      for (let i = 0; i < array1.length; i++) {
        for (let j = 0; j < array2.length; j++) {
          if (array1[i] === array2[j]) {
            return true;
          }
        }
      }
      return false;
    }
    // getRolePermission() {
    //   this._roleGetPermission = [];
    //   if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {
  
    //     let _fetaturedetailsArray = [];
    //     _fetaturedetailsArray = this.userDetails?.roleDetail[0]?.roleDetails[0]?.moduleDetails?.filter((v) => { return v.moduleName == "Resource" });
    //     if (_fetaturedetailsArray && _fetaturedetailsArray.length > 0) {
    //       this._roleGetPermission = (_fetaturedetailsArray[0]?.featureDetails)?.filter(v1 => { return v1.featureCode == "Onboarding" })[0]?.permissionDetails[0];
    //     }
    //     else {
    //       this._roleGetPermission = {
    //         createPermission: false,
    //         importPermission: false,
    //         editPermission: false,
    //         approvePermission: false,
    //         delegatePermission: false,
    //         deletePermission: false,
    //         exportPermission: false,
    //         readPermission: false,
    //         rejectPermission: false,
    //         withdrawPermission: false
    //       }
    //     }
    //   }    
    //  }
  
}
