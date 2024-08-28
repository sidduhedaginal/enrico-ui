import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { DebordingMoreActionDialogComponent } from '../debording-more-action-dialog/debording-more-action-dialog.component';
import { DeBoardingEclDialogComponent } from '../de-boarding-ecl-dialog/de-boarding-ecl-dialog.component';
import { AccessoriesCollectedDialogComponent } from '../accessories-collected-dialog/accessories-collected-dialog.component';
import { DeviceCollectedDialogComponent } from '../device-collected-dialog/device-collected-dialog.component';
import { EmployeeCardCollectedDialogComponent } from '../employee-card-collected-dialog/employee-card-collected-dialog.component';
import { NtidDeactivatedDialogComponent } from '../ntid-deactivated-dialog/ntid-deactivated-dialog.component';
import { ExtendLastWorkingDayDialogComponent } from '../extend-last-working-day-dialog/extend-last-working-day-dialog.component';
import { RetainResourceDialogComponent } from '../retain-resource-dialog/retain-resource-dialog.component';
import { InitiateDeBoardingDialogComponent } from '../initiate-de-boarding-dialog/initiate-de-boarding-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';

@Component({
  selector: 'app-de-boarding-request-details',
  templateUrl: './de-boarding-request-details.component.html',
  styleUrls: ['./de-boarding-request-details.component.css']
})
export class DeBoardingRequestDetailsComponent implements OnInit {

  selectedItem = null;
  isEclInitiateBtn: boolean = false;
  isEclCompleteBtn: boolean = false;
  isEclSubmitBtn: boolean = false;
  isEclDeactivateResourceBtn: boolean = false;
  isRejectedBtn: boolean = false;
  getElementData: any = [];
  getElementAllData: any = [];
  isDeboardingCompleted: boolean = false;
  resourceDetails: any = [];
  vendorDetails: any = [];
  sowJDDetails: any = [];
  exitInformation: any = [];
  exitChecklist: any = [];
  exitCheckListDetails: any = [];
  remarksDetails: any = [];
  resourceExitCheckListStatus: any = [];
  assestSpocInfoData:any=[];
  completeEclSpocInfoData:any=[];
  employeeCardSpocInfoData:any=[];
  hrSpocInfoData:any=[];
  gcnSpocInfoData  :any=[];
  accessorySPOCInfoData:any=[];
  deboardingSPOCInfoData:any=[];
  sapIdmSpocInfoData:any=[];
  transportIdmSpocInfoData:any=[];
  deboardingApproveListInfo:any=[];
  showLoading: boolean = false;

  _accessoriesFilter: any = [];
  _deviceFilter: any = [];
  _employeeCardFilter: any = [];
  _ntIDFilter: any = [];
  _gcnAccessFilter: any = [];
  _sapIdmFilter: any = [];
  _transportFilter: any = [];
  _exitInfoReason: any;
  _exitInfoLWD: any;
  getSignOffID:any;
  _exitInfoisReplaceRequest: any;
  _exitInfoDojRequestReplace: any;
  _exitInfoStatus: any;
  _vendorDetailsInfo: any = [];
  remarksList: any = [];
  userDetailsRoles: any = [];
  _sowJdDetails: any = [];
  allResponseDeboardDetails:any=[];
  filterWithdrawRemarks:any=[];
  initiateEClRemarksFilter:any=[];
  userDetails: userProfileDetails;
//  roleList = [];
 // exitCheckRoleApproveSendbackDelegate:boolean=false;
  //exitCheckRoleWithDrawResubmitExtendLwdRetainResource:boolean=false;
  //exitCheckRoleInitiateECL:boolean=false;
  //exitCheckRoleAccessories:boolean=false;
 // exitCheckRoleDeviceCollected:boolean=false;
 // exitCheckRoleEmpCardCollected:boolean=false;
  //exitCheckRoleNtidDeactivated:boolean=false;
  //exitCheckRoleCompleteEcl:boolean=false;

  _resourceDbAssetcollections:any=[];
  isAccessoriesBtn:boolean=true;
  isDeviceBtn:boolean=true;
  isEmployeeCardBtn:boolean=true;
  isNtidDeactivatedBtn:boolean=true;

  beforeFiveDaysBtnShowHide:boolean=true;


checkAccesoriedCollectedSubmit:boolean=false;
checkDeviceCollectedSubmit:boolean=false;
checkEmployeeCardSubmit:boolean=false;
checkNtidDeactivatedSubmit:boolean=false;
checkGCNSubmit:boolean=false;
checkSAPSubmit:boolean=false;
checkTransportSubmit:boolean=false;

isGCNBtn:boolean=true;
isSAPBtn:boolean=true;
isTransportBtn:boolean=true;
subscription: Subscription;
permissionsBehaviorSubjectDeboarding: PermissionDetails;
  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private API: ApiResourceService, private sowjdService: sowjdService) { 
    this.subscription = this.sowjdService.getUserProfileRoleDetailDeboarding().subscribe((roles: PermissionDetails) => {
      this.permissionsBehaviorSubjectDeboarding = roles;
    });
  }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.getElementData = JSON.parse(params.element);
    });


this.getExitChecklistInfoApi();
localStorage.removeItem('deBoardIDForStatus');
setTimeout(()=>{
localStorage.setItem('deBoardIDForStatus',this._exitInfoStatus);
    this.isEclCompleteBtn = false;
    this.isEclInitiateBtn = false;
    this.isEclSubmitBtn = false;
    this.isEclDeactivateResourceBtn = false;
    this.isRejectedBtn = false;
    this.isDeboardingCompleted = false;  
    if (localStorage.getItem('deBoardIDForStatus') == 'Approved') {
      this.isEclInitiateBtn = true;
      let _initiateEclBtn: HTMLElement | null= document.getElementById('initiateEcllID'); 
      if(_initiateEclBtn !=null){
      _initiateEclBtn.classList.remove("initiateEclIDbtnCs");
      }
    }
    else if (localStorage.getItem('deBoardIDForStatus') == 'Submitted' || (this.getElementData.module=='De-boarding Request' && this.getElementData.status=='Submitted')) {
      this.isEclSubmitBtn = true;
    }
    else if (localStorage.getItem('deBoardIDForStatus') == 'ECL Initiated' || this.getElementData.statusDescription=="ECL Initiated") {
         this.isEclCompleteBtn = true;
    }
    else if (localStorage.getItem('deBoardIDForStatus') == 'ECL Completed'  || this.getElementData.statusDescription=="ECL Completed") {
      this.isEclDeactivateResourceBtn = true;
    }
    else if (localStorage.getItem('deBoardIDForStatus') == 'Rejected' || this.getElementData.statusDescription=='Rejected') {
      this.isRejectedBtn = true;
    }
    else if (localStorage.getItem('deBoardIDForStatus') == 'Deboarding Completed') {
      this.isDeboardingCompleted = true;
    }
 
  },2500)
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0]; 
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
     // this.getUserRolesInfo();
    //  this.getRolePermission();
  }

  getExitChecklistInfoApi() {
    this.showLoading = true;
    let obj = {
      id: this.getElementData.id
    }
    this.API.getExitCheckListInfo(obj).subscribe((res: any) => {
      this.showLoading = false;
      if (res && res.data) {
        let _res = res.data;
        this.allResponseDeboardDetails=_res;
        if (_res.resourceDetail) {
          this.resourceDetails = _res.resourceDetail[0];
        }

    
        if(_res?.assetSPOCInfo && _res?.assetSPOCInfo.length>0){
          this.assestSpocInfoData = _res?.assetSPOCInfo[0];
        }
        if(_res?.completeECLSPOCInfo && _res?.completeECLSPOCInfo.length>0){
          this.completeEclSpocInfoData = _res?.completeECLSPOCInfo[0];
        }
        if(_res?.employeeCardSPOCInfo && _res?.employeeCardSPOCInfo.length>0){
          this.employeeCardSpocInfoData = _res?.employeeCardSPOCInfo[0];
        }
        if(_res?.hrSPOCInfo && _res?.hrSPOCInfo.length>0){
          this.hrSpocInfoData = _res?.hrSPOCInfo[0];
        }
      
        if(_res?.accessorySPOCInfo && _res?.accessorySPOCInfo.length>0){
          this.accessorySPOCInfoData = _res?.accessorySPOCInfo[0];
         }
         if(_res?.deboardingSPOCInfo  && _res?.deboardingSPOCInfo.length>0){
          this.deboardingSPOCInfoData = _res?.deboardingSPOCInfo[0];
         }
       
 if(_res?.gcnSPOCInfo && _res?.gcnSPOCInfo.length>0){
  this.gcnSpocInfoData = _res?.gcnSPOCInfo[0];
 }
 if(_res?.sapIdmSPOCInfo && _res?.sapIdmSPOCInfo.length>0){
  this.sapIdmSpocInfoData = _res?.sapIdmSPOCInfo[0];
 }
 if(_res?.transportSPOCInfo && _res?.transportSPOCInfo.length>0){
  this.transportIdmSpocInfoData = _res?.transportSPOCInfo[0];
 }



if(_res?.resourceApproverDetail && _res?.resourceApproverDetail.length>0){
  this.deboardingApproveListInfo = _res?.resourceApproverDetail[0];
}

        if (_res.resourceDbExitCheckListStatus && _res.resourceDbExitCheckListStatus.length>0) {
          this.resourceExitCheckListStatus = _res.resourceDbExitCheckListStatus[0];
        }
        if (_res.resourceDbExitCheckList && _res.resourceDbExitCheckList.length>0) {
          for (let i = 0; i < _res.resourceDbExitCheckList.length; i++) {
            let a = _res.resourceDbExitCheckList[i].asset;
            if (a == 'Accessories') {
              this._accessoriesFilter = _res.resourceDbExitCheckList[i];
            }
            if (a == 'Device') {
              this._deviceFilter = _res.resourceDbExitCheckList[i];
            }
            if (a == 'Employee Card') {
              this._employeeCardFilter = _res.resourceDbExitCheckList[i];
            }
            if (a == 'NT ID') {
              this._ntIDFilter = _res.resourceDbExitCheckList[i];
            }
            if (a == 'GCNAccess') {
              this._gcnAccessFilter = _res.resourceDbExitCheckList[i];
            }
            if (a == 'SAPIdm') {
              this._sapIdmFilter = _res.resourceDbExitCheckList[i];
            }
            if (a == 'Transport') {
              this._transportFilter = _res.resourceDbExitCheckList[i];
            }
          }

        }
        if (_res.exitInformation && _res.exitInformation.length>0) {
          this._exitInfoReason = _res.exitInformation[0].exitReason;
          this._exitInfoLWD = _res.exitInformation[0].lastWorkingDate;
          this.getSignOffID=_res.exitInformation[0].signoffId;


          this.beforeFiveDaysBtnShowHide=true; 
      if(this._exitInfoReason=="Resignation" ||  this._exitInfoReason=="Bosch payroll conversion" || this._exitInfoReason=="Rotation to Different Project"  || this._exitInfoReason=="Project closure"){
       
        let dtToday = new Date();        
        let _todayGetDate:any=new Date(dtToday.setTime(dtToday.getTime() + (dtToday.getTimezoneOffset() * 60000)));
         if(this.getElementData.companyCode=="38F0"){
          _todayGetDate=this.addUtcHrMinDateTime(_todayGetDate,7,0);
        }
        else if(this.getElementData.companyCode=="6520"){
          _todayGetDate=this.addUtcHrMinDateTime(_todayGetDate,5,30);
        }      
       
        let _formatLWDDat=moment(this._exitInfoLWD,'DD/MM/YYYY').format('MM/DD/YYYY');
         const todaydate =new Date(moment(_todayGetDate).format('MMMM DD, YYYY'));
         const lwdDate = new Date(moment(_formatLWDDat).format('MMMM DD, YYYY'));
         const daysWithOutWeekEnd = [];
         for (var currentDate:any = new Date(todaydate); currentDate <= lwdDate; currentDate.setDate(currentDate.getDate() + 1)) {         
           if (currentDate.getDay() != 0 && currentDate.getDay() != 6) {
             daysWithOutWeekEnd.push(new Date(currentDate));
           }
         } 
         this.beforeFiveDaysBtnShowHide=true;  
          if(daysWithOutWeekEnd.length <=5){
            this.beforeFiveDaysBtnShowHide=false;;
          }
        }


          this._exitInfoisReplaceRequest = _res.exitInformation[0].isReplaceRequest;
          this._exitInfoDojRequestReplace = _res.exitInformation[0].dojRequestReplace;
          this._exitInfoStatus = _res.exitInformation[0].status;

        this.checkAccesoriedCollectedSubmit=_res.exitInformation[0].isAccessoriesCollected;
        this.checkDeviceCollectedSubmit=_res.exitInformation[0].isDeviceCollected;
        this.checkEmployeeCardSubmit=_res.exitInformation[0].isEmployeeCardCollected;
        this.checkNtidDeactivatedSubmit=_res.exitInformation[0].isNtidDeactivated;
if(this.checkAccesoriedCollectedSubmit==true){
this.isAccessoriesBtn=false;
}
if(this.checkDeviceCollectedSubmit==true){
  this.isDeviceBtn=false;
}
if(this.checkEmployeeCardSubmit==true){
  this.isEmployeeCardBtn=false;
}
if(this.checkNtidDeactivatedSubmit==true){
  this.isNtidDeactivatedBtn=false;
}

this.checkGCNSubmit=_res.exitInformation[0].isGCNaccessUpdated;
if(this.checkGCNSubmit==true){
  this.isGCNBtn=false;
}
this.checkSAPSubmit=_res.exitInformation[0].isSAPidMUpdated;
if(this.checkSAPSubmit==true){  
this.isSAPBtn=false;
}
this.checkTransportSubmit=_res.exitInformation[0].isTransportUpdated;
if(this.checkTransportSubmit==true){  
this.isTransportBtn=false;
}


        }

        if (_res.vendorDetail && _res.vendorDetail.length > 0) {
          this._vendorDetailsInfo = _res.vendorDetail[0];
        }
        if (_res.sowJdDetails && _res.sowJdDetails.length >0) {
          this._sowJdDetails = _res.sowJdDetails[0];
        }

        if (_res.resourceDbRemarks && _res.resourceDbRemarks.length>0) {
          this.remarksList = _res.resourceDbRemarks;
          this.filterWithdrawRemarks=this.remarksList?.filter((v=>{return v.statusDescription=="Withdrawn"}))[0];
          this.initiateEClRemarksFilter=this.remarksList?.filter((v=>{return v.statusDescription=="ECL Initiated"}))[0];
        }
       
        if (_res.resourceDbAssetcollections && _res.resourceDbAssetcollections.length>0) {
          this._resourceDbAssetcollections = _res.resourceDbAssetcollections[0];
        }

   
        let getInitiateSubmitDateFLA=   this.remarksList.filter((v=>{
          return v.statusDescription=="Submitted" && v.remark?.split(/[\s,\?\,\.!]+/).some(f=> f === 'FLA:')
        }));
        if(getInitiateSubmitDateFLA && getInitiateSubmitDateFLA.length >0){
        this.getinitiateDeboardSubmitDateFLA=getInitiateSubmitDateFLA[0].createdOn;
        }
     
        let getDateSecondApproved=   this.remarksList.filter((v=>{
          return v.statusDescription=="Approved"
        }));
        if(getDateSecondApproved && getDateSecondApproved.length>0){
          this.getDateSecondApprovedDate=getDateSecondApproved[0].createdOn;
          }
          let getDateFirstRejected=   this.remarksList.filter((v=>{
            return v.statusDescription=="Rejected"
          }));
          if(getDateFirstRejected && getDateFirstRejected.length>0){
            this.getDateFirstRejectedDate=getDateFirstRejected[0].createdOn;
            }
            if (res && res.data && res.data.resourceDelegationDetails) {
              this.checkDelegateArray=res.data.resourceDelegationDetails;
            this.checkDelegateOneTime=res.data.resourceDelegationDetails[0];
            }
      }
    })
  }
  getinitiateDeboardSubmitDateFLA:any="";
  getDateSecondApprovedDate:any="";
  getDateFirstRejectedDate:any="";
  checkDelegateOneTime:any=[];
  checkDelegateArray:any=[];
  onActionClick(item: any) {
    let _approveBtnID: HTMLElement | null= document.getElementById('approveBtnID');  
    let _sendBackBtnID: HTMLElement | null= document.getElementById('sendBackBtnID');
    let _delegateBtnID: HTMLElement | null= document.getElementById('delegateBtnID');
    
    if(item=='Approve')  {
    _approveBtnID.classList.add("approveBtnIDCs"); 
    }
    if(item=='Reject')  {
      _sendBackBtnID.classList.add("sendBackBtnIDCs"); 
      }
      if(item=='Delegate')  {
        _delegateBtnID.classList.add("delegateBtnIDCs"); 
        }
    
    let _obj = {
      rowData: this.getElementData,
      type: item,
      comp: ' De-boarding',
      reponseAllData:this.allResponseDeboardDetails,
    };
    this.selectedItem = item;
    const dialogRef = this.dialog.open(DebordingMoreActionDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
     if(item=='Approve')  {
     _approveBtnID.classList.remove("approveBtnIDCs"); 
     }
     if(item=='Reject')  {
      _sendBackBtnID.classList.remove("sendBackBtnIDCs"); 
      }
      if(item=='Delegate')  {
        _delegateBtnID.classList.remove("delegateBtnIDCs"); 
        }
     if(result=='true'){
      localStorage.removeItem('deBoardIDForStatus');       
        this.ngOnInit();
     }
     else{
     }

    });
    if (item == 'delegate') {
    } else if (item == 'withdraw') {
    } else if (item == 'reject') {
    } else if (item == 'approve') {
    }
  }
  backTo() {
 

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": encodeURIComponent('de-boarding'),
      }
    };

    this.router.navigate(["Resource-Management"], navigationExtras);

    localStorage.removeItem('deBoardIDForStatus');
  }
  onInitiateECLClick(type: any) {
    let _initiateEclBtn: HTMLElement | null= document.getElementById('initiateEcllID'); 
    if(type=='Initiate ECL'){      
      _initiateEclBtn.classList.add("initiateEclIDbtnCs1"); 
      
    }
    else{    
      if(_initiateEclBtn !=null){  
      _initiateEclBtn.classList.remove("initiateEclIDbtnCs1"); 
      }
    }
    let _obj = {
      rowData: this.getElementData,
      type: type,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(DeBoardingEclDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      _initiateEclBtn.classList.remove("initiateEclIDbtnCs1"); 
      if(result=='true'){
        localStorage.removeItem('deBoardIDForStatus');
  this.ngOnInit();
         }
       else{  
       }

    });

  }
  onAccessoriesCollectedClick(type: any) {
    let _accesoriesCollectedIDBtn: HTMLElement | null= document.getElementById('accesoriesCollectedID');      
    _accesoriesCollectedIDBtn.classList.add("accesoriesCollectedIDBtnCs"); 
    
    let _obj = {
      rowData: this.getElementData,
      type: type,
      initialDate:this.initiateEClRemarksFilter.createdOn,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(AccessoriesCollectedDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
     _accesoriesCollectedIDBtn.classList.remove("accesoriesCollectedIDBtnCs"); 
     if(result=='true'){
      this.isAccessoriesBtn=false;
      localStorage.removeItem('deBoardIDForStatus');
this.ngOnInit();
     }
     else{
     }

    });
  }
  completeEclDialog(type: any) {
    let _obj = {
      rowData: this.getElementData,
      type: type,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(DeBoardingEclDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  onDeviceCollectedClick(type: any) {
    
    let _deviceBtn: HTMLElement | null= document.getElementById('deviceCollectedID');      
    _deviceBtn.classList.add("deviceCollectedIDBtnCs"); 
  
    let _obj = {
      rowData: this.getElementData,
      type: type,
      initialDate:this.initiateEClRemarksFilter.createdOn,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(DeviceCollectedDialogComponent, {
      width: '550px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      _deviceBtn.classList.remove("deviceCollectedIDBtnCs");
     if(result=='true'){
      localStorage.removeItem('deBoardIDForStatus');
      this.isDeviceBtn=false;
this.ngOnInit();
     }
     else{
     }

    });
  }
  onEmployeeCardCollectedClick(type: any) {
    
    let _employeeCardIDBtn: HTMLElement | null= document.getElementById('employeeCardID');      
    _employeeCardIDBtn.classList.add("empCardIDBtnCs"); 
    let _obj = {
      rowData: this.getElementData,
      type: type,
      empCardDetails:this.allResponseDeboardDetails.resourceEmployeeCardDetails,
      initialDate:this.initiateEClRemarksFilter.createdOn,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(EmployeeCardCollectedDialogComponent, {
      width: '650px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
     _employeeCardIDBtn.classList.remove("empCardIDBtnCs");
     if(result=='true'){
      this.isEmployeeCardBtn=false;
      localStorage.removeItem('deBoardIDForStatus');
this.ngOnInit();
     }
     else{
     }

    });
  }
  onNTIDDeactivatedCollectedClick(type: any) {
    let _ntIdIDBtn: HTMLElement | null= document.getElementById('ntIdID');      
    _ntIdIDBtn.classList.add("ntIdIDBtnCs"); 
    
    let _obj = {
      rowData: this.getElementData,
      type: type,
      initialDate:this.initiateEClRemarksFilter.createdOn,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(NtidDeactivatedDialogComponent, {
      width: '550px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
     _ntIdIDBtn.classList.remove("ntIdIDBtnCs"); 
     if(result=='true'){
      this.isNtidDeactivatedBtn=false;
      localStorage.removeItem('deBoardIDForStatus');
this.ngOnInit();
     }
     else{
     }

    });
  }
  onExtendLastWorkingDayClick(type: any) {
    let _extendLWDidBtn: HTMLElement | null= document.getElementById('extendLWDid');      
    _extendLWDidBtn.classList.add("extendLWDidBtnCs");
    
    let _obj = {
      rowData: this.getElementData,
      type: type,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(ExtendLastWorkingDayDialogComponent, {
      width: '550px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      _extendLWDidBtn.classList.remove("extendLWDidBtnCs");
     if(result=='true'){
      localStorage.removeItem('deBoardIDForStatus');
this.ngOnInit();
     }
     else{
     }

    });
  }

  onRetainResourceClick(type: any) {
    let _retainResourceIDBtn: HTMLElement | null= document.getElementById('retainResourceID');      
    _retainResourceIDBtn.classList.add("retainResourceIDBtnCs");
    
    let _obj = {
      rowData: this.getElementData,
      type: type,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(RetainResourceDialogComponent, {
      width: '550px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      _retainResourceIDBtn.classList.remove("retainResourceIDBtnCs");
    if(result=='true'){
      localStorage.removeItem('deBoardIDForStatus');
this.ngOnInit();
     }
     else{
     }

    });
  }
  onWidthdrawClick(type: any) {
    let _obj = {
      rowData: this.getElementData,
      type: type,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(DebordingMoreActionDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  onReSubmitClick(type: any) {
    let _obj = {
      rowData: this.getElementData,
      reponseAllData:this.allResponseDeboardDetails,
      type: type
    }
    const dialogRef = this.dialog.open(InitiateDeBoardingDialogComponent, {
      width: '700px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.backTo();
    });

  }
  //checkOnlyDeliveryManager:boolean=false;
  //checkOnlyOSMAdmin:boolean=false;
  //checkOnlySectionSpoc:boolean=false;
  //getUserRolesInfo(){ 
   // this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
  
      // if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {     
      // this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
      //   (item: any) => item.roleName
      // );           
    //  this.exitCheckRoleApproveSendbackDelegate=this.findCommonElement( this.roleList,['OSM Admin', 'OSM','Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG','Department_SPOC_BGSW']);


//this.checkOnlyDeliveryManager=this.findCommonElement( this.roleList,['Delivery Manager','Delivery_Manager']);
//this.checkOnlyOSMAdmin=this.findCommonElement( this.roleList,['OSM Admin','OSM']);
//this.checkOnlySectionSpoc=this.findCommonElement( this.roleList,['Section SPOC BGSW','Section SPOC BGSV','Section_SPOC_BGSW','Section_SPOC_BGSV']);

      // this.exitCheckRoleWithDrawResubmitExtendLwdRetainResource= this.findCommonElement( this.roleList,['OSM Admin', 'Vendor']);
      // this.exitCheckRoleInitiateECL= this.findCommonElement( this.roleList,['OSM Admin','HRS-IN SPOC 1(Initiate ECL)','Department Secretory BGSV']);
       //this.exitCheckRoleAccessories= this.findCommonElement( this.roleList,['OSM Admin', 'Department Secretory BGSV']);
       //this.exitCheckRoleDeviceCollected= this.findCommonElement( this.roleList,['OSM Admin', 'BD-Asset-BGSW','BD-Asset-BGSV']);
     //  this.exitCheckRoleEmpCardCollected= this.findCommonElement( this.roleList,['OSM Admin','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV']);
      // this.exitCheckRoleNtidDeactivated= this.findCommonElement( this.roleList,['OSM Admin', 'BD-NTID-BGSW','DSP-NTID-BGSV']);
       //this.exitCheckRoleCompleteEcl= this.findCommonElement( this.roleList,['OSM Admin','Department Secretory BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2']);
    // }
  
  //}
  // findCommonElement(array1, array2) { 
  //   for (let i = 0; i < array1.length; i++) {  
  //       for (let j = 0; j < array2.length; j++) {
  //           if (array1[i] === array2[j]) {
  //               return true;
  //           }
  //       }
  //   } 
  //   return false;
  // }


 // _roleGetPermission:any=[];
  //showApproveSendBackDelegateBtn:boolean=false;
  //showWithdrawResubmitExtendLwdRetainResourceBtn:boolean=false;
  //showInitiateEclBtn:boolean=false;
  //showAccessoriesCollectedBtn:boolean=false;
  //showDeviceCollectedBtn:boolean=false;
  //showEmployeeCardCollectedBtn:boolean=false;
  //showNTidDeactivatedBtn:boolean=false;
 // showCompleteEclBtn:boolean=false;

 // chkOnlyEmployeeCardButton:boolean=false;
 // getRolePermission(){
   // this._roleGetPermission=[];
    //if(this.userDetails && this.userDetails.roleDetail){
 
   // let _array1=this.userDetails.roleDetail[0].roleDetails;
    //this.showApproveSendBackDelegateBtn= this.findCommonElement( this.roleList,['OSM Admin','OSM','Delivery_Manager', 'Department_SPOC_BGSV','Department_SPOC_BGSW', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG']);
   //this.showWithdrawResubmitExtendLwdRetainResourceBtn=this.findCommonElement( this.roleList,['OSM Admin','Vendor','Vendor_BGSV','Vendor_BGSW']);
   // this.showInitiateEclBtn= this.findCommonElement( this.roleList,['OSM Admin','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV']);
   // this.showAccessoriesCollectedBtn=this.findCommonElement( this.roleList,['OSM Admin','Department Secretory BGSV']);
   // this.showDeviceCollectedBtn=this.findCommonElement( this.roleList,['OSM Admin','BD-Asset-BGSW','BD-Asset-BGSV']);
   // this.showEmployeeCardCollectedBtn=this.findCommonElement( this.roleList,['OSM Admin','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV']);
    //this.showNTidDeactivatedBtn=this.findCommonElement( this.roleList,['OSM Admin','BD-NTID-BGSW','DSP-NTID-BGSV']);
   // this.showCompleteEclBtn=this.findCommonElement( this.roleList,['OSM Admin','Department Secretory BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2']);
  
  
  
  //  let onlyOSmAdmin= this.findCommonElement( this.roleList,['OSM Admin']);
  // let onlyOsm= this.findCommonElement( this.roleList,['OSM']);
  // let onlyVendor=this.findCommonElement( this.roleList,['Vendor','Vendor_BGSV','Vendor_BGSW']);
  // let onlyDeliveryManager= this.findCommonElement( this.roleList,['Delivery_Manager']);
  // let onlyDepartmentSpoc= this.findCommonElement( this.roleList,['Department_SPOC_BGSV','Department_SPOC_BGSW']);
  // let onlySectionSpoc= this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);
  // let onlyHrsSpoc1Initiateecl=this.findCommonElement( this.roleList,['HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1']);
  // let onlyDepartmentSecretory= this.findCommonElement( this.roleList,['Department Secretory BGSV']);
  // let onlyBdAssest=this.findCommonElement( this.roleList,['BD-Asset-BGSW','BD-Asset-BGSV']);
  // let onlyNtid=this.findCommonElement( this.roleList,['BD-NTID-BGSW','DSP-NTID-BGSV']);
  // let onlyHrsSpoc2CompleteEcl= this.findCommonElement( this.roleList,['HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2']);
  // let onlyFcm= this.findCommonElement( this.roleList,['FCM-BGSV']);
  

 // this.chkOnlyEmployeeCardButton=this.findCommonElement( this.roleList,['HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV']);
  
  
    // let _array2:any=[];
    // if(onlyOSmAdmin==true){
    //   _array2=  _array1.filter((item)=>{return item.roleName=='OSM Admin'})[0];
    // }
    // else if(onlyOsm==true && onlyOSmAdmin==false){
    //   _array2=  _array1.filter((item)=>{return item.roleName=='OSM'})[0];
    // }
    // else if(onlyVendor==true && onlyOSmAdmin==false){
    //   _array2=  _array1.filter((item)=>{return (item.roleName=='Vendor') || (item.roleName=="Vendor_BGSW")|| (item.roleName=="Vendor_BGSV")})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDeliveryManager==true){
    //   _array2=  _array1.filter((item)=>{return item.roleName=='Delivery_Manager'})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSpoc==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='Department_SPOC_BGSV') || (item.roleName=="Department_SPOC_BGSW"))})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlySectionSpoc==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='Section_SPOC_BGSW') || (item.roleName=="Section_SPOC_BGSV"))})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyHrsSpoc1Initiateecl==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='HRS-IN SPOC 1') || (item.roleName=='HRS-IN SPOC 1(Initiate ECL)'))})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSecretory==true){
    //   _array2=  _array1.filter((item)=>{return item.roleName=='Department Secretory BGSV'})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyBdAssest==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='BD-Asset-BGSW') || (item.roleName=='BD-Asset-BGSV'))})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyNtid==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='BD-NTID-BGSW') || (item.roleName=='DSP-NTID-BGSV'))})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyHrsSpoc2CompleteEcl==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='HRS-IN SPOC 2 (Complete ECL)') || (item.roleName=='HRS-IN SPOC 2'))})[0];
    // }
    // else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyFcm==true){
    //   _array2=  _array1.filter((item)=>{return ((item.roleName=='FCM-BGSV'))})[0];
    // }
  
    // else{
    //   _array2=  this.userDetails.roleDetail[0].roleDetails[0];
    // }
  
    // let _fetaturedetailsArray=[];
    // _fetaturedetailsArray=_array2.moduleDetails.filter((v)=>{ return v.moduleName=="Resource"});
   
    // if(_fetaturedetailsArray && _fetaturedetailsArray.length >0){
    //   this._roleGetPermission=  (_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Deboarding"})[0].permissionDetails[0]
     
    // }
    // else{
    //   this._roleGetPermission={
    //     createPermission:false,
    //     importPermission:false,
    //     editPermission:false,
    //     approvePermission:false,
    //     delegatePermission:false,
    //     deletePermission:false,
    //     exportPermission:false,
    //     readPermission:false,
    //     rejectPermission:false,
    //     withdrawPermission:false
    //   }
    // }
 // }

  //}
  getRemarksStatus(val:any){
    let _val=false;
    var mainString =val;
    var substr = /FLA:/
    var found = substr.test(mainString)
    if(found){
      _val=true;
    }
    return _val;
  }
  getRemarksDeleagteStatus (val:any){
    let _val=false;
    var mainString =val;
    var substr = /Delegate-Remarks:/
    var found = substr.test(mainString)
    if(found){
      _val=true;
    }
    return _val;
  }
   addUtcHrMinDateTime(date1,hour,minute) {  
    let dt2 = new Date(); 
    dt2 = new Date(date1.getTime() + hour * 60 * 60 * 1000 + minute * 60 * 1000 )
    return dt2;      
    }   
    getDDMMYYYYDateFormat(val:any){
      if(val){
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
      let mydate=val.split('/');
      let _splitMtDate=mydate[2]+'-'+mydate[1]+'-'+ mydate[0] +'T00:00:00.000-00:00';
      let date = new Date( Date.parse(_splitMtDate));//('2012-01-26T13:51:50.417-07:00') );
      let month= monthNames[date.getMonth()];
      let _dateFinal=`${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`
    return _dateFinal
      }
    }
    getStatusTopColor(val:any){
      let color='black';
if(val=='Submitted' || val=='ECL Completed' || val=='Approved'){
  color='darkgreen';
}
if(val=='Withdrawn'){
  color='#f5c77e';
}
if(val=='Rejected'){
  color='red';
}
return color;
    }

    gcnSapTransportClick(type: any) {
      let _obj = {
        rowData: this.getElementData,
        type: type,
        initialDate:this.initiateEClRemarksFilter.createdOn,
        reponseAllData:this.allResponseDeboardDetails,
      };
      const dialogRef = this.dialog.open(DebordingMoreActionDialogComponent, {
        width: '510px',
        maxHeight: '99vh',
        disableClose: true,
        data: _obj
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        if(result=='true'){
        localStorage.removeItem('deBoardIDForStatus');       
        this.ngOnInit();
        if(type=='GCN Access'){
          this.isGCNBtn=false;
        }
        if(type=='SAP IdM'){
          this.isSAPBtn=false;
        }
        if(type=='Transport'){
          this.isTransportBtn=false;
        }
      }
      
       
      });
    }
}
