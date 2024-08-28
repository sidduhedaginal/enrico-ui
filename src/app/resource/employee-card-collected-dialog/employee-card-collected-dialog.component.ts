import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResourceService } from '../api-resource.service';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from 'src/environments/environment';
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
  selector: 'app-employee-card-collected-dialog',
  templateUrl: './employee-card-collected-dialog.component.html',
  styleUrls: ['./employee-card-collected-dialog.component.scss'],
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
export class EmployeeCardCollectedDialogComponent implements OnInit {
  viewData: any;
  createdForm: FormGroup;
  _checkuser:any=[];
  minDate=new Date();
  emailEclProcessValue:any="";
  showLoading:boolean=false;
  minDate1=new Date();
  maxDateCurrent=new Date();
  minDateDeactivate=new Date();
  getAllDeboardingDataObj:any={};
  _getPathUrl=environment.mailDeboardUrl;
  constructor(
    public dialogRef: MatDialogRef<EmployeeCardCollectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any,private fb: FormBuilder,private API: ApiResourceService,private snackBar: MatSnackBar, public loaderService: LoaderService
  ) {
    this.createdForm = this.fb.group({  
    //  ecardCollectedCbx: [false],
    //  ecardeactivatedCbx: [false],
     // ecardCollectedDate:[''],
      ecardDeactivatedDate:['', Validators.required],
      ecardRemarks:['', Validators.required],
    });
  }

  ngOnInit() {
  
   // this.createdForm.controls.ecardCollectedDate.disable();
   // this.createdForm.controls.ecardDeactivatedDate.disable();
    this.viewData = this._Data;
    this.minDate1=new Date(this.viewData?.initialDate?.substring(0,10));
    this.maxDateCurrent=new Date();
    this._checkuser= StorageQuery.getUserProfile();
    let obj={
      "companyCode":  this.viewData.rowData.companyCode,
      "plant":  this.viewData.rowData.plantCode || '6525',
      "eclType": "ECARD"
    }
  
    if(this.viewData && this.viewData.empCardDetails.length>0 ){
    //  if((this.viewData.empCardDetails && this.viewData.empCardDetails[0].employeeCardCollectDt !=null) && (this.viewData.empCardDetails && this.viewData.empCardDetails[0].isEmployeeCardCollected ==true) ){
       // this.createdForm.patchValue({ecardCollectedCbx: this.viewData.empCardDetails[0].isEmployeeCardCollected});
     //   this.createdForm.patchValue({ecardCollectedDate: this.viewData.empCardDetails[0].employeeCardCollectDt}); 
       // this.createdForm.controls.ecardCollectedCbx.disable();
       // this.createdForm.controls.ecardCollectedDate.disable();
     // }
      if(this.viewData.empCardDetails && this.viewData.empCardDetails[0].remark !=""){
        
        this.createdForm.patchValue({ecardRemarks: this.viewData.empCardDetails[0].remark});
      }
      if((this.viewData.empCardDetails && this.viewData.empCardDetails[0].employeeCardDeactivateDt !=null) && (this.viewData.empCardDetails && this.viewData.empCardDetails[0].isEmployeeCardDeactivated ==true) ){
       // this.createdForm.patchValue({ecardeactivatedCbx: this.viewData.empCardDetails[0].isEmployeeCardDeactivated});
        this.createdForm.patchValue({ecardDeactivatedDate: this.viewData.empCardDetails[0].employeeCardDeactivateDt}); 
      //  this.createdForm.controls.ecardeactivatedCbx.disable();
        this.createdForm.controls.ecardDeactivatedDate.disable();
      }
    }
    
    this.API.getECLProcessMailId(obj).subscribe((response:any)=>{

if(response && response.status=="success" && response.data && response.data.eclProcessEmailId && response.data.eclProcessEmailId.length>0){
  this.emailEclProcessValue= response.data.eclProcessEmailId[0].emailID;
}

    })
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
      lastWorkingDay: moment(getAllDeboardingData?.exitInformation[0].lastWorkingDate).format('DD-MMM-YYYY'),
      replacementRequest:	getAllDeboardingData?.exitInformation[0].isReplaceRequest==true?'Yes':'No',
      dateOfjoiningforReplacement	:getAllDeboardingData?.exitInformation[0].dojRequestReplace,
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
      ntidSpocMail: getAllDeboardingData?.ntidSpocingSpocInfo[0].email
      }

    } 
  }
  // cbx($event,type){
  //   if(type=="collected"){
  //     if($event.checked==true){
  //       this.createdForm.controls.ecardCollectedDate.enable();
  //     }
  //     else{
  //       this.createdForm.controls.ecardCollectedDate.disable();
  //       this.createdForm.patchValue({ecardCollectedDate: ''}); 
  //     }

  //   }
  //   if(type=="deactivated"){
  //     if($event.checked==true){
  //       this.createdForm.controls.ecardDeactivatedDate.enable();
  //     }
  //     else{      
  //       this.createdForm.controls.ecardDeactivatedDate.disable();
  //       this.createdForm.patchValue({ecardDeactivatedDate: ''}); 
  //     }
  //   }

  // }
  cancleBtn() {
    this.dialogRef.close('false');
  }
  closeBtn() {
    this.dialogRef.close('false');
  }
  submitBtn(createdForm: any) {
    let _requestType="";
    let __ecardCollectedId="";
    if(this.viewData && this.viewData.empCardDetails.length==0){
      _requestType='INSERT';
       __ecardCollectedId =  "3fa85f64-5717-4562-b3fc-2c963f66afa6";
    }
    else{
      _requestType='UPDATE';
       __ecardCollectedId =  this.viewData.empCardDetails[0].id;
    }
    localStorage.removeItem('deBoardIDForStatus');
   
   // let _ecardCollectedCbx = createdForm.controls.ecardCollectedCbx.value;
   // let _ecardeactivatedCbx = createdForm.controls.ecardeactivatedCbx.value;
  //  let _ecardCollectedDate = moment(createdForm.controls.ecardCollectedDate.value).format('YYYY-MM-DD'); 
    let _ecardDeactivatedDate = moment(createdForm.controls.ecardDeactivatedDate.value).format('YYYY-MM-DD'); 
    let _ecardRemarks = createdForm.controls.ecardRemarks.value;
    // if(_ecardCollectedCbx==false){
    //   //Please Select Employee Card Collected
    //   this.snackBar.open("Please Select Access Card Collected", 'Close', {
    //     duration: 4000,
    //   });
    //   return;
    // }
// if(_ecardCollectedCbx==true  && (_ecardCollectedDate =='Invalid date' ||_ecardCollectedDate==''|| _ecardCollectedDate==null ||_ecardCollectedDate==undefined )){
//   this.snackBar.open("Please Select Date Access Card Collected on", 'Close', {
//     duration: 4000,
//   });
//   return;
// }
//if(_ecardeactivatedCbx==true && (_ecardDeactivatedDate =='Invalid date' ||_ecardDeactivatedDate==''|| _ecardDeactivatedDate==null ||_ecardDeactivatedDate==undefined )){
if(_ecardDeactivatedDate =='Invalid date' ||_ecardDeactivatedDate==''|| _ecardDeactivatedDate==null ||_ecardDeactivatedDate==undefined ){
  this.snackBar.open("Please Select Date Access Card Deactivated", 'Close', {
    duration: 4000,
  });
  return;
}


let _createdBy='';
if(this._checkuser){
   _createdBy=this._checkuser.displayName;
}

    let _objModel ={
      "id": __ecardCollectedId,
      "resourceDbId":  this.viewData.rowData.id,      
      "isEmployeeCardCollected":false,// _ecardCollectedCbx,
      "isEmployeeCardDeactivated":true,//_ecardeactivatedCbx,
      "employeeCardCollectDt":_ecardDeactivatedDate=='Invalid date'?null:_ecardDeactivatedDate,// _ecardCollectedDate=='Invalid date'?null:_ecardCollectedDate,
      "employeeCardDeactivateDt": null,//_ecardDeactivatedDate=='Invalid date'?null:_ecardDeactivatedDate,
      "remark":_ecardRemarks,
      "createdBy":_createdBy || 'Bosch User',
      "CreatedDate": this.getCurrentDateTime(),
      "requestType":_requestType
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

      
        //==================
    this.API.employeeCardCollectedPost(_objModel).subscribe((response2: any) => {
      this.loaderService.setDisableLoading();
      if(response2.status=="success"){
        this.dialogRef.close('true');
        this.snackBar.open("Access card collected Created Successfully...!", 'Close', {
          duration: 3000,
        }); 
//if((_ecardCollectedCbx==true  && (_ecardCollectedDate !='Invalid date' || _ecardCollectedDate !=null ||_ecardCollectedDate !=undefined )) && ((_ecardeactivatedCbx==true && (_ecardDeactivatedDate !='Invalid date' || _ecardDeactivatedDate!=null ||_ecardDeactivatedDate!=undefined )))){
if(_ecardDeactivatedDate !='Invalid date' || _ecardDeactivatedDate!=null ||_ecardDeactivatedDate!=undefined ){
            this.API.sendMailinitiateDeboardPost(_sendMailObject1).subscribe((response: any) => {
              this.dialogRef.close();
              });
            }
         
      }
    });
   
  }
  getCurrentDateTime(){
    var d = new Date();
var datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) +"-"+("0" + d.getDate()).slice(-2)+'T';
var timestring=("0"+(d.getHours())).slice(-2)+":"+("0"+(d.getMinutes())).slice(-2)+":"+("0"+(d.getSeconds())).slice(-2)+".000Z";
return datestring + timestring
  }
  datecDeactivate(val:any){
    this.minDateDeactivate=new Date(val)
  }
  restrictFirstSpace(event) {
    const textarea = event.target;
    if (textarea.value.length === 0 && event.key === ' ') {
        event.preventDefault();
    }
  }
}
