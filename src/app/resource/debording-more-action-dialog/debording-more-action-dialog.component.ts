import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResourceService } from '../api-resource.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { LoaderService } from 'src/app/services/loader.service';
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}

@Component({
  selector: 'app-debording-more-action-dialog',
  templateUrl: './debording-more-action-dialog.component.html',
  styleUrls: ['./debording-more-action-dialog.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class DebordingMoreActionDialogComponent implements OnInit {
  viewData: any;
  _listDataDDL: any = {};
  customerList: any = [];
  selectedUser: any = '';
  filterdOptions: any = [];
  remarksModel: any;
  _checkuser:any=[];
  allResponseDeboardDetails:any=[];
   _getPathUrl=environment.mailDeboardUrl;
   checkUserRoles:any;
   showLoading:boolean=false;
   gcnAcceessDateModel:any=new Date();
   minDate1=new Date();
   maxDateCurrent=new Date();
   getAllDeboardingDataObj:any={};
  constructor(
    public dialogRef: MatDialogRef<DebordingMoreActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router, public loaderService: LoaderService
  ) { }

  ngOnInit() {

    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }




  this._checkuser= StorageQuery.getUserProfile();
    this.viewData = this._Data;
    if(this.viewData.type=="Delegate"){
      this.getuserList();
    } 
    let obj = {
      id: this.viewData.rowData.id
    }    
    this.API.getExitCheckListInfo(obj).subscribe((res: any) => {   
      if (res && res.data) {
        let _res = res.data;
        this.allResponseDeboardDetails=_res;
      }
    });
    if (this.viewData.type == 'GCN Access'){
this.minDate1=new Date(this.viewData?.initialDate?.substring(0,10));
this.maxDateCurrent=new Date();
    }
    if(this.viewData && this.viewData?.reponseAllData){
      let getAllDeboardingData:any=[];
      getAllDeboardingData= this.viewData?.reponseAllData;
      this.getAllDeboardingDataObj={
      deboardingRequestID	:this.viewData?.rowData?.deboardingRequestID || this.viewData?.rowData?.requestId,
      resourceNumber	:getAllDeboardingData?.resourceDetail[0].employeeNumber,
      ntidData	:getAllDeboardingData?.resourceDetail[0].ntID,
      firstName	:getAllDeboardingData?.resourceDetail[0]?.employeeName?.split(' ')[0],
      lastName	:getAllDeboardingData?.resourceDetail[0]?.employeeName?.split(' ')[1],
      vendorSAPID:	getAllDeboardingData?.vendorDetail[0]?.vendorSAPID,
      vendorName	:getAllDeboardingData?.vendorDetail[0]?.vendorName,
      dateofJoining:moment(getAllDeboardingData?.resourceDetail[0].dateOfJoining).format('DD-MMM-YYYY') || '--',
      exitReason	:getAllDeboardingData?.exitInformation[0].exitReason,
      lastWorkingDay:moment(getAllDeboardingData?.exitInformation[0].lastWorkingDate).format('DD-MMM-YYYY'),
      replacementRequest:	getAllDeboardingData?.exitInformation[0].isReplaceRequest==true?'Yes':'No',
      dateOfjoiningforReplacement	:moment(getAllDeboardingData?.exitInformation[0].dojRequestReplace).format('DD-MMM-YYYY'),
      firstApproverName:  getAllDeboardingData?.resourceApproverDetail[0].firstApproverName ,
      firstApproverEmail: getAllDeboardingData?.resourceApproverDetail[0].firstApproverMailId ,
      secondApproverName: getAllDeboardingData?.resourceApproverDetail[0].secondApproverName ,
      secondApproverEmail: getAllDeboardingData?.resourceApproverDetail[0].secondApproverMailId,
      vendorEmail:getAllDeboardingData?.vendorDetail[0].email,
      accesoriesMail:  getAllDeboardingData?.accessorySPOCInfo[0]?.email,
      transportMail: getAllDeboardingData?.transportSPOCInfo[0]?.email,
      sapIdmMail:  getAllDeboardingData?.sapIdmSPOCInfo[0]?.email,
      assestMail:   getAllDeboardingData?.assetSPOCInfo[0]?.email,
      ntidMail:"",
      completeEclMail: getAllDeboardingData?.completeECLSPOCInfo[0]?.email,
      signOffOwnerEmail:  getAllDeboardingData?.exitInformation[0].signOffOwnerEmail,
      ntidSpocMail: getAllDeboardingData?.ntidSpocingSpocInfo[0].email,
      accessCardMail:getAllDeboardingData?.accessCardSpocInfo[0].email,
      accessCardName:getAllDeboardingData?.accessCardSpocInfo[0].spocFullName
      }
      
    }    
  }
  cancleBtn() {
    this.dialogRef.close('false');
  }
  closeBtn() {
    this.dialogRef.close('false');
  }
  submitBtn() {
let _createdBy='';
if(this._checkuser){
   _createdBy=this._checkuser.displayName;
}
    if (this.remarksModel == '' || this.remarksModel == null || this.remarksModel == undefined) {
      this.snackBar.open("Please enter remarks", 'Close', {
        duration: 3000,
      });
      return;
    }
    if (this.viewData.type == 'Approve') {
let _remarksType="";
if((this.viewData && this.viewData.rowData && this.viewData.rowData.isFirstLevelApproved==false) || (this.viewData.rowData.module=="De-boarding Request" && this.viewData.rowData.status== "Submitted")){
  _remarksType='FLA: ';
}
      let _objModel = {
        "id":this.viewData.rowData.id,
        "remark": _remarksType + this.remarksModel,
        "createdBy":_createdBy || 'Bosch User'  
          };
          let _createdOn=moment(new Date()).format('DD-MMM-yyyy');  
          let _sendMailTo="";
          let _sendMailCC="";
          let _mainText='';
          let teamName="";
          let subjectText="";
          if(this.viewData.rowData.isFirstLevelApproved==false || (this.viewData.rowData.module=="De-boarding Request" && this.viewData.rowData?.status=="Submitted")){
             _sendMailTo=this.getAllDeboardingDataObj?.secondApproverEmail;//this.viewData.rowData.secondApproverMailId;
             _sendMailCC= this.getAllDeboardingDataObj?.vendorEmail +','+this.getAllDeboardingDataObj?.firstApproverEmail;//this.viewData.rowData.firstApproverMailId;
             _mainText= 'Below request is approved in first level, awaiting your approval second level'+ "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.getAllDeboardingDataObj?.deboardingRequestID +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Deboarding </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+  this.getAllDeboardingDataObj?.vendorName +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>";
            teamName="Team";
            subjectText='Request Approval'
            }
           else if(this.viewData.rowData.isFirstLevelApproved==true || (this.viewData.rowData.module=="De-boarding Request" && this.viewData.rowData?.status=="Submitted2")){
             _sendMailTo=this.getAllDeboardingDataObj?.secondApproverEmail;  // this.viewData.rowData.ownerEmailId
              _sendMailCC= this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail;//this.viewData.rowData.secondApproverMailId;
         
              _mainText= "<br><br>Deboarding request for <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> is approved by the respective Delivery Manager and Partner Program Manager.<br><br>Please initiate exit process by clicking the link <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr><tr><td><b>Replacement Request</b></td> <td>"+this.getAllDeboardingDataObj?.replacementRequest+" </td></tr><tr class='trbg'><td><b>Date of joining for Replacement </b></td> <td>"+this.getAllDeboardingDataObj?.dateOfjoiningforReplacement +"</td></tr></table>";  
              subjectText='Initiate Exit Process' ;  
              teamName=   this.getAllDeboardingDataObj?.secondApproverName;  
             }
         
     let _sendMailObject = {  
    featureCode: 'MasterData-Approval-Process',
      to:_sendMailTo,
      cc: _sendMailCC,      
      subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | '+subjectText,
      paraInTemplate: {
        teamName: teamName,
       mainText:_mainText 
      }
    };
    this.loaderService.setShowLoading(); 
      this.API.deboardApprovePost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == "success") {
           this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
                  this.dialogRef.close();         
                  }          
                );
          this.snackBar.open("Deboarding Request Approved Successfully..!", 'Close', {
            duration: 3000,
          });
         
          this.dialogRef.close('true');
          setTimeout(()=>{
           this.goBack();
          },1000)
        }
      });
    }
    if (this.viewData.type == 'Reject' ||  this.viewData.type =='Rejected') {
      let _objModel = {
        "id":this.viewData.rowData.id,
        "remark": this.remarksModel,
        "createdBy": _createdBy || 'Bosch User'  
      }
      let _sendMailTo=this.viewData.rowData.firstApproverMailId;
      let _mainText='Deboarding Request Send Back Successfully'; 
      let _createdOn=moment(new Date()).format('DD-MMM-yyyy');           
              let _sendMailObject = {
                featureCode:'MasterData-Approval-Process',
                to:_sendMailTo,
                cc: this.viewData.rowData.firstApproverMailId+','+ this.viewData.rowData.secondApproverMailId,
               subject: 'ENRICO | Deboarding | '+  this.viewData.rowData.deboardingRequestID + ' | Request Sent Back',
                paraInTemplate: {
                  teamName: 'Team',
                mainText:_mainText + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.rowData.deboardingRequestID +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Deboarding </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+   this.viewData.rowData.ownerName +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
               
                }
              };
              this.loaderService.setShowLoading(); 
      this.API.deboardRejectPost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == "success") {
          this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
            this.dialogRef.close();         
            }          
          );
          this.snackBar.open("Deboarding Request Rejected Successfully..!", 'Close', {
            duration: 3000,
          });
          this.dialogRef.close('true');
          setTimeout(()=>{
            this.goBack();
          },1000)
        }
      });
    }
    if (this.viewData.type == 'Delegate') {
      if (this.selectedUser == "" || this.selectedUser==null || this.selectedUser==undefined) {
        this.snackBar.open("Please select user*", 'Close', {
          duration: 3000,
        });
        return;
      } 
      let _ntidData="";
      if(this._Data && this._Data.reponseAllData)  {
      _ntidData= this._Data?.reponseAllData?.resourceDetail[0]?.ntID;
      }
      else{
         _ntidData= this.allResponseDeboardDetails?.resourceDetail[0]?.ntID;
      }
     
     let _objModel= {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "delegateObjectId": this.viewData.rowData.id,
        "delegateObjectType": 4,
        "delegatedTo": this.selectedValue,
        "remarks":'Delegate-Remarks: ' +this.remarksModel,
        "createdOn": this.getCurrentDateTime(),
        "delegatedBy":_ntidData
      }

      let _sendMailTo=this.selectedUser;
      let _sendMailCC="";
      let _subject='Resource Delegation';
      let _mainText='Deboarding Request Delegated to you Successfully';
      if(this.viewData.rowData.isFirstLevelApproved==false){
         _mainText='';
         _mainText=  this._checkuser.displayName + ' has delegated the below request for your approval.';
         _sendMailCC=this.viewData.rowData.firstApproverMailId +','+ this.viewData.rowData.ownerEmailId;
        }
      else if(this.viewData.rowData.isFirstLevelApproved==true){
          _mainText='';
          _mainText=   this._checkuser.displayName  + ' has delegated the below request for your approval.';
        
          _sendMailCC=this.viewData.rowData.secondApproverMailId +','+ this.viewData.rowData.ownerEmailId;
         }  
        let _createdOn=moment(new Date()).format('DD-MMM-yyyy');
 let _sendMailObject = {
  featureCode:'MasterData-Approval-Process',
   to: _sendMailTo,
   cc: _sendMailCC,
  subject: 'ENRICO | Deboarding | '+  this.viewData.rowData.deboardingRequestID + ' | Record assigned for Approval',
  paraInTemplate: {
    teamName: (this.selectedUser.split('@')[0]).replace('external.','').replace('.',' '),
    mainText:_mainText + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.rowData.deboardingRequestID +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Deboarding </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+  this.viewData.rowData.ownerName +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
 
  }
};
this.loaderService.setShowLoading(); 
      this.API.deboardDelegatePost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == "success") {
          this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
            this.dialogRef.close();         
            }          
          );
          this.snackBar.open("Deboarding Request Delegate Successfully..!", 'Close', {
            duration: 3000,
          });
          this.dialogRef.close('true');
          setTimeout(()=>{
            this.goBack();
          },1000)
        }
      });
      

    }
    if (this.viewData.type == 'Withdraw') {     
        _createdBy=this._checkuser.vendorName;
      let _objModel = {
        "id":this.viewData.rowData.id,
        "remark": this.remarksModel,
        "createdBy": _createdBy || 'Bosch User'
      }

    //  let _mainText='Below request is Cancelled.'; 
    //  let _createdOn=moment(new Date()).format('DD-MMM-yyyy');  
      
      let _entityId:any="";
      let _userProfile:any="";
      if(this.checkUserRoles=='/Vendors')
      {
         _entityId =  '00000000-0000-0000-0000-000000000000'
      }
      else
      {
        _userProfile =StorageQuery.getUserProfile();
        _entityId = _userProfile.entityId;
      }


              let _sendMailObject = {
                featureCode:'MasterData-Approval-Process',
                entityId : _entityId,
                to: this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
                cc: this.getAllDeboardingDataObj?.vendorEmail,
                subject: 'ENRICO | Resource Deboarding | '+  this.viewData.rowData.deboardingRequestID + ' | Request Cancelled',
                paraInTemplate: {
                  teamName: this.getAllDeboardingDataObj?.firstApproverName,
                mainText: "Approval process not completed for the deboarding request of <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> by "+ this.getAllDeboardingDataObj?.firstApproverName+"<br><br> Deboarding request has been cancelled as there is no action performed.<br><br>Please check the details by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr><tr><td><b>Replacement Request</b></td> <td>"+this.getAllDeboardingDataObj?.replacementRequest+" </td></tr><tr class='trbg'><td><b>Date of joining for Replacement </b></td> <td>"+this.getAllDeboardingDataObj?.dateOfjoiningforReplacement +"</td></tr></table>"
                }
              };
         
              this.loaderService.setShowLoading(); 
      this.API.deboardWithdrawPost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == "success") {
          this.snackBar.open("Deboarding Request Withdraw Successfully..!", 'Close', {
            duration: 3000,
          });
          if(this.checkUserRoles=='/Vendors'){
            this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
              this.dialogRef.close();         
              }          
            );
            }
            else{
          this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
            this.dialogRef.close();         
            }          
          );
            }
        
          this.dialogRef.close('true');
          setTimeout(()=>{
            this.goBack();
          },1000)
        }
      });
    }

    if (this.viewData.type == 'GCN Access'){
      if(this.gcnAcceessDateModel=="" || this.gcnAcceessDateModel==null || this.gcnAcceessDateModel==undefined || this.gcnAcceessDateModel=="Invalid date"){
        this.snackBar.open("Please Select Access Removed On Date", 'Close', {
          duration: 3000,
        });
      }
      let _objModel = {
        "resourceDbId":this.viewData?.rowData?.id,
        "remark": this.remarksModel,
        "accessRemovedOn":this.gcnAcceessDateModel,
        "createdBy": _createdBy || 'Bosch User'
      }
    
      this.loaderService.setShowLoading(); 
      this.API.deboardGCNPost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == "success") {
        this.snackBar.open("GCN Access created successfully.", 'Close', {
          duration: 4000,
        });
        this.dialogRef.close('true');
        setTimeout(()=>{
         // this.goBack();
        },1000)
      }
      });
    }

   if (this.viewData.type == 'SAP IdM'){
    let _objModel = {
      "resourceDbId":this.viewData?.rowData?.id,
      "remark": this.remarksModel,
      "createdBy": _createdBy || 'Bosch User'
    }
    this.loaderService.setShowLoading(); 
        //=================================
        let _mainTextTable="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr></table>" ;
    
        let _sendMailObject1 = {
          featureCode:'MasterData-Approval-Process',
          to: this.getAllDeboardingDataObj?.completeEclMail,// this.emailEclProcessValue +','+
           cc: this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail  +','+ this.getAllDeboardingDataObj?.accesoriesMail +',' + this.getAllDeboardingDataObj?.transportMail +',' +  this.getAllDeboardingDataObj?.sapIdmMail  +',' +   this.getAllDeboardingDataObj?.assestMail +','+ this.getAllDeboardingDataObj?.secondApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail +','+ this.getAllDeboardingDataObj?.ntidSpocMail,
           subject: 'ENRICO | Resource Deboarding | ' +this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Complete Exit Clearance ',
          paraInTemplate: {
            teamName: 'All',
            mainText: "Exit clearance received from all the stakeholders and please complete the exit process by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable        
          }
        };  
    
        let _sendMailObject2 = {
          featureCode:'MasterData-Approval-Process',
          to: this.getAllDeboardingDataObj?.accessCardMail,
          cc: this.getAllDeboardingDataObj?.secondApproverEmail +',' + this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
         subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Access Card Clearance',
          paraInTemplate: {
            teamName: this.getAllDeboardingDataObj?.accessCardName,
            mainText: "Exit process has been initiated for  <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> and please collect and deactivate the access card by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable      
          }
        };  
        //==================
    this.API.deboardSAPidmPost(_objModel).subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      if (response.status == "success") {
      this.snackBar.open("SAP IdM created successfully.", 'Close', {
        duration: 4000,
      });

      this.API.sendMailinitiateDeboardPost(_sendMailObject1).subscribe((response: any) => {
        console.log('Sap IDM Send Mail success')
        });
        this.API.sendMailinitiateDeboardPost(_sendMailObject2).subscribe((response: any) => {
          console.log('Sap IDM Send Mail success')
          });
    this.dialogRef.close('true');
  }
  });
    }
    if (this.viewData.type == 'Transport'){
      let _objModel = {
        "resourceDbId":this.viewData?.rowData?.id,
        "remark": this.remarksModel,
        "createdBy": _createdBy || 'Bosch User'
      }
      this.loaderService.setShowLoading(); 
      //=================================
    let _mainTextTable="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr></table>" ;
    
    let _sendMailObject1 = {
      featureCode:'MasterData-Approval-Process',
      to: this.getAllDeboardingDataObj?.completeEclMail,// this.emailEclProcessValue +','+
       cc: this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail  +','+ this.getAllDeboardingDataObj?.accesoriesMail +',' + this.getAllDeboardingDataObj?.transportMail +',' +  this.getAllDeboardingDataObj?.sapIdmMail  +',' +   this.getAllDeboardingDataObj?.assestMail +','+ this.getAllDeboardingDataObj?.secondApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail +','+ this.getAllDeboardingDataObj?.ntidSpocMail,
       subject: 'ENRICO | Resource Deboarding | ' +this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Complete Exit Clearance ',
      paraInTemplate: {
        teamName: 'All',
        mainText: "Exit clearance received from all the stakeholders and please complete the exit process by clicking the link   <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable        
      }
    };  

    let _sendMailObject2 = {
      featureCode:'MasterData-Approval-Process',
      to: this.getAllDeboardingDataObj?.accessCardMail,
      cc: this.getAllDeboardingDataObj?.secondApproverEmail +',' + this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
     subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Access Card Clearance',
      paraInTemplate: {
        teamName: this.getAllDeboardingDataObj?.accessCardName,
        mainText: "Exit process has been initiated for  <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> and please collect and deactivate the access card by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable      
      }
    };  
    //==================
      this.API.deboardTransportPost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        this.snackBar.open("Transport created successfully.", 'Close', {
          duration: 4000,
        });
         
        this.API.sendMailinitiateDeboardPost(_sendMailObject1).subscribe((response: any) => {
          console.log('Transport Send Mail success')
          });
          this.API.sendMailinitiateDeboardPost(_sendMailObject2).subscribe((response: any) => {
            console.log('Transport Send Mail success')
            });
      this.dialogRef.close('true');
 

    });
    }



  }
  getuserList() {
    this.API.getUserListOfDelegatesApi().subscribe((response:any)=>{
      this._listDataDDL =response;
      this.customerList = this._listDataDDL.data.resourceDelegateUser.filter((v=>{
        return (v.ntid !=null && v.email !=null)
      }));
    })
 

  }

  filterUsers() {
    if (this.selectedUser == '') {
      this.filterdOptions = [];
    } else {
      if(this.selectedUser.length>2){
      this.filterdOptions = this.customerList.filter((item: any) =>
      (item.email !== null && item.email?.toLowerCase().includes(this.selectedUser?.toLowerCase())) || (item.ntid !== null && item.ntid?.toLowerCase().includes(this.selectedUser?.toLowerCase()))

      );
    }
  }
  }
  selectedValue:any="";
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.selectedUser =event.option.viewValue;
this.selectedValue=event.option.value;
  }
  getCurrentDateTime(){
 let _fullUTCDateTime=   new Date().toISOString().substring(0, 19)+'.000Z'
return _fullUTCDateTime;
  }
goBack(){
  let navigationExtras: NavigationExtras = {
    queryParams: {
      "data": encodeURIComponent('de-boarding'),
    }
  };        
  this.router.navigate(["Resource-Management"], navigationExtras);        
  localStorage.removeItem('deBoardIDForStatus');
}
restrictFirstSpace(event) {
  const textarea = event.target;
  if (textarea.value.length === 0 && event.key === ' ') {
      event.preventDefault();
  }
}
}