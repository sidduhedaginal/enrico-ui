import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResourceService } from '../api-resource.service';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { HomeService } from 'src/app/services/home.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}
@Component({
  selector: 'app-initiate-de-boarding-dialog',
  templateUrl: './initiate-de-boarding-dialog.component.html',
  styleUrls: ['./initiate-de-boarding-dialog.component.css'],
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
export class InitiateDeBoardingDialogComponent implements OnInit {

  viewData: any;
  createdForm: FormGroup;
  isLWDDisabled:boolean=false;
  _todayDate:any=new Date();
  setMinDate:any=new Date();
  setMaxDate:any="";
  allExitOptionList:any=[];
  vendor_Sap_ID: any = '';
  vendorName:any="";
  showLoading:boolean = false;
  _getPathUrl=environment.mailDeboardUrl;
  resourceEmployeeName:any="";
  resourcePurchaseOrder:any="";
  resourceDateOfJoining:any="";
  constructor(
    public dialogRef: MatDialogRef<InitiateDeBoardingDialogComponent>,@Inject(MAT_DIALOG_DATA) public initiateData:any,private fb: FormBuilder,private API: ApiResourceService,private snackBar: MatSnackBar,private homeService:HomeService
  ) {
    this.createdForm = this.fb.group({
      exitReason: ['', Validators.required],
      lastWorking: ['', Validators.required],
      reqReplacement: ['1', Validators.required],
      dojReplacement: [''],
      remarks: ['', Validators.required],

    });
  }
  sowJDViewData:any='';
  checkUserRoles:any;
  vendorDetails:any=[];
  vendor_id_value:any="";
  ngOnInit() {
  
this.homeService.getVendorProfile().subscribe((response: any) => {;
if(response && response.data ){
this.vendorDetails=  response.data;
}
});
    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    this.vendor_Sap_ID=_getLoginDetails.profile.vendor_sap_id;
    this.vendorName=_getLoginDetails.profile.name;
    this.vendor_id_value==_getLoginDetails.profile.vendor_id;
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }
    this.getExitReasonList();
    this.viewData = this.initiateData.rowData;
    if(this.initiateData && this.initiateData.reponseAllData && this.initiateData.reponseAllData.resourceDetail[0]){
     this.resourceEmployeeName= this.initiateData.reponseAllData.resourceDetail[0].employeeName;
     this.resourcePurchaseOrder=  this.initiateData.reponseAllData.resourceDetail[0].purchaseOrder;
     this.resourceDateOfJoining=  this.initiateData.reponseAllData.resourceDetail[0].dateOfJoining;

    }
    if(this.initiateData && this.initiateData.reponseAllData && this.initiateData.reponseAllData.sowJdDetails &&  this.initiateData.reponseAllData.sowJdDetails.length>0 ){
      this.sowJDViewData=  this.initiateData.reponseAllData.sowJdDetails[0].sowJdId;
      }
     
      if(this.initiateData && this.initiateData.reponseAllData && this.initiateData.reponseAllData.exitInformation && this.initiateData.reponseAllData.exitInformation[0]){
      let _dataIDB= this.initiateData?.reponseAllData?.exitInformation[0];
   
      
        this.createdForm.patchValue({ 'lastWorking': new Date(_dataIDB?.lastWorkingDate) });
        this.createdForm.patchValue({ 'reqReplacement': _dataIDB?.isReplaceRequest==true?'1':'0' });
        let valR:any=_dataIDB?.isReplaceRequest==true?'1':'0';
       
        if(valR=='0' || valR==0){ 
          this.createdForm.patchValue({dojReplacement: '' });
          setTimeout(()=>{
            this.isreplacementDojDisabled=true;
          },1000)
        
          }
          else if(valR=='1'|| valR==1){
            this.isreplacementDojDisabled=false;
              this.createdForm.patchValue({ 'dojReplacement':  moment(_dataIDB?.dojRequestReplace, "DD/MM/YYYY") });
               let newDate = new Date(this.viewData?.createdOn);
               newDate.setDate(newDate.getDate() +7);
              this.todayDateShowAfterSeven=newDate;
            
      }
       
      this.createdForm.patchValue({ 'remarks': ''   });
    }
  else{
    this.sowJDViewData= '--';
  }
  }

  cancleBtn() {
    this.dialogRef.close();
  }
  
  closeBtn() {
    this.dialogRef.close();
  }
 

getExitReasonList(){
this.API.getExitReasonList().subscribe((response:any)=>{
  if(response && response.data && response.data){//.resourceDbExitReasons
    this.allExitOptionList=[];
  let _filterArray=[];
  let responseDataResourceDbExitReasons=[];
  responseDataResourceDbExitReasons=response?.data?.filter((v=>{return v.exitReason!="No show" && v.exitReason!="BGV Failed"}));
  if(this.viewData.company=='BGSW'){
     _filterArray=responseDataResourceDbExitReasons.filter((v)=>{
      return v.exitReason !="Rotation to Different Project"
     })
     this.allExitOptionList=  _filterArray;
  }
  else {
    this.allExitOptionList=responseDataResourceDbExitReasons;
  }
  if(this.initiateData && this.initiateData.reponseAllData && this.initiateData.reponseAllData.exitInformation && this.initiateData.reponseAllData.exitInformation[0]){
    let _dataIDB= this.initiateData?.reponseAllData?.exitInformation[0];
  let filterExitReason=  this.allExitOptionList;
 this.filterExitReason2= filterExitReason.filter(((v)=>{return v.exitReason==_dataIDB?.exitReason }));
        this.createdForm.patchValue({  exitReason: this.filterExitReason2[0].id});
        this.exitReasonChange(this.filterExitReason2[0].id);
  }
  }
})
}
filterExitReason2:any=[];
changeExitreasonValue:any="";
  exitReasonChange(eventValue:any){
    this.exitResonSelectionNonPerformance='';
    this.changeExitreasonValue=eventValue;
    this.showLoading=true;
    let obj={
      "companyCode": this.viewData.companyCode,
      "location": this.viewData.plantCode || "6527"
    }
 
this.API.getNoOfHolidays(obj).subscribe((res:any)=>{
  this.showLoading=false;
if(res && res.status=="success"){
  let _numHoliday=0;
  if(res && res.data && res.data.dbnoofHoliday){
 _numHoliday= res.data.dbnoofHoliday[0].noOfHoliday;

    let val=eventValue;//event.value;
    this.isLWDDisabled=false;
    this.createdForm.patchValue({
      lastWorking:''
    })
    this.setMaxDate="";
    if(val=='1'){
      this.isLWDDisabled=true;
      if(this.initiateData.type=="Re-Submit"){
        this.createdForm.patchValue({
          lastWorking: new Date(this.initiateData.reponseAllData.resourceDetail[0].dateOfJoining) 
        })   
       
      }
      else{
      this.createdForm.patchValue({
        lastWorking:new Date(this.viewData.dateOfJoining)
      })  
    }
    this.setMinDate=new Date(0);
      this.setMaxDate=new Date();
    
    }
    else if(val=='2' || val=='11'){
      this.isLWDDisabled=false;
      this.createdForm.patchValue({
        lastWorking:new Date()
      })
      let dd=  this.viewData?.dateOfJoining || this.resourceDateOfJoining
      this.setMinDate=new Date(dd);
      this.setMaxDate=new Date();
    }
    else if(val=='3' || val=='6'){
    let _nextFithDaysDate=  this.getNextDaysExceptSatSun(new Date(), 4 + _numHoliday)
      this.isLWDDisabled=true;
      this.createdForm.patchValue({lastWorking:_nextFithDaysDate});
      if(val=='3'){
         this.nonPerformanceValidation();
    }
    }

    else if(val=='4' ||val=='5' ||  val=='7' ||  val=='8'  ||  val=='10' ||  val=='12'){
 
      if(this.initiateData.type=="Re-Submit"){
       let _dd= moment(this.viewData?.createdOn).format('MM/DD/YYYY');
        let _nextThirtyDaysDate=  this.getNextDays(new Date(_dd), 30 + _numHoliday);  
        let _nextNinetyDaysDate=  this.getNexNinetytDays(new Date(_dd), 90 + _numHoliday);     
          this.createdForm.patchValue({lastWorking:_nextThirtyDaysDate})
          this.setMinDate=_nextThirtyDaysDate;
          this.setMaxDate=_nextNinetyDaysDate;
          

      }
      else{
        let _nextThirtyDaysDate=  this.getNextDays(new Date(), 30 + _numHoliday);  
        let _nextNinetyDaysDate=  this.getNexNinetytDays(new Date(), 90 + _numHoliday); 
        if(val=='4' || val=='5' ||  val=='7' ||  val=='8'  ||  val=='10' || val=='12'){
          // this.createdForm.patchValue({lastWorking:_nextThirtyDaysDate})
        }
        else{
          this.createdForm.patchValue({lastWorking:_nextThirtyDaysDate})
        }         
          this.setMinDate=_nextThirtyDaysDate;
          this.setMaxDate=_nextNinetyDaysDate;
     }
    }
    

  }
}
});
  }
  exitResonSelectionNonPerformance:any="";
  nonPerformanceValidation(){ 
    debugger;
    let result =true;
  let dd=  this.viewData?.dateOfJoining || this.resourceDateOfJoining
      this.exitResonSelectionNonPerformance='Non-Performance';
      let dojConsider=moment(dd).format('YYYY-MM-DD');//this.viewData?.dateOfJoining || this.resourceDateOfJoining;   //"2024-07-02T00:00:00" 
      let selectedLWDdate=moment(this.createdForm.controls.lastWorking.value).format('YYYY-MM-DD');
      const date1:any = new Date(dojConsider);
      const date2:any = new Date(selectedLWDdate);
      const difference = date2 - date1;
      const daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24));
        if(daysDifference >= 61){           
       this.snackBar.open("For Non-Performance, deboarding NOT ALLOWED after 60 days from DOJ", 'Close', {
        duration: 7000,
      });
      result =false
      return result;
      }
    
  }

  getNextDays(dateObj, days) {
    for (var i = 0; i < days; i++) {
        if (days > 0) {
            switch (dateObj.getDay()) { 
                default:
                    dateObj.setDate(dateObj.getDate() + 1)
                    break;
            }
        }
    }

    return dateObj;
}
getNexNinetytDays(dateObj, days) {
  for (var i = 0; i < days; i++) {
      if (days > 0) {
          switch (dateObj.getDay()) { 
              default:
                  dateObj.setDate(dateObj.getDate() + 1)
                  break;
          }
      }
  }

  return dateObj;
}
   getNextDaysExceptSatSun(dateObj, days) {
    for (var i = 0; i < days; i++) {
        if (days > 0) {
            switch (dateObj.getDay()) {
                case 6:
                    dateObj.setDate(dateObj.getDate() + 2)
                    break;
                    case  0:
                      dateObj.setDate(dateObj.getDate() + 2)
                      break;
                case 5:
                    dateObj.setDate(dateObj.getDate() + 3)
                    break;
                default:
                    dateObj.setDate(dateObj.getDate() + 1)
                    break;
            }
        }
    }

    return dateObj;
}


  submitBtn(createdForm: any) {
    let _createdOn=moment(new Date()).format('DD-MMM-yyyy');

    let _exitReason = createdForm.controls.exitReason.value;
    let _lastWorking = moment(createdForm.controls.lastWorking.value).format('YYYY-MM-DD'); 
    let _reqReplacement = createdForm.controls.reqReplacement.value;
    let _dojreplacement =  moment(createdForm.controls.dojReplacement.value).format('YYYY-MM-DD'); 
    let _remarks = createdForm.controls.remarks.value;

    if( _exitReason==''|| _exitReason==null || _exitReason==undefined){
      this.snackBar.open("Please select exit Reason", 'Close', {
        duration: 3000,
      });
      return;
    }
    if( _lastWorking==''|| _lastWorking==null || _lastWorking==undefined || _lastWorking=='Invalid date'){
      this.snackBar.open("Please select Last Working*", 'Close', {
        duration: 4000,
      });
      return;
    }
        
    if( _reqReplacement==''|| _reqReplacement==null || _reqReplacement==undefined){
      this.snackBar.open("Please select request replacement", 'Close', {
        duration: 3000,
      });
      return;
    }
if( _reqReplacement=='1' && (_dojreplacement=='Invalid date'|| _dojreplacement==''|| _dojreplacement==null || _dojreplacement==undefined)){
  this.snackBar.open("Please select Date of Joining for Replacement Resource", 'Close', {
    duration: 3000,
  });
  return;
}

if( _remarks==''|| _remarks==null || _remarks==undefined){
  this.snackBar.open("Please enter remarks", 'Close', {
    duration: 3000,
  });
  return;
}

if( _reqReplacement=='0' && (_dojreplacement=='Invalid date'|| _dojreplacement==''|| _dojreplacement==null || _dojreplacement==undefined)){
  _dojreplacement=  moment(new Date(0)).format('YYYY-MM-DD'); 
}

if( this.exitResonSelectionNonPerformance=='Non-Performance'){
 let result=this.nonPerformanceValidation();
 if(result==false || result ==undefined){
  return result;
 }
}  
    let _objModel ={};
    let _companyCode="";
    _companyCode=this.viewData.companyCode;
   let _vendorIDValue="";
   let _getLoginDetails = this.API.getFetchLoginDetailsFor();
  let userDetailsRoles = _getLoginDetails.profile.user_roles[0];
  let vendor_id_value="";
  let _sowjdOwnerNtid='';
  let _sectionSpocNtid='';
  if(this.initiateData.type=="Re-Submit"){
    _vendorIDValue=this.viewData.vendorSAPID
    _sowjdOwnerNtid=this.viewData.sowjdOwnerNtid;
    _sectionSpocNtid=this.viewData.sectionSpocNtid;
    }
   if(userDetailsRoles=='/EnricoUsers'){
    if(this.initiateData.type=="Re-Submit"){
    _vendorIDValue=this.viewData.vendorSAPID
    _sowjdOwnerNtid=this.viewData.sowjdOwnerNtid;
    _sectionSpocNtid=this.viewData.sectionSpocNtid;
    }
    else{
      _vendorIDValue=this.viewData.vendorID;
    }
   }
   else{
    _vendorIDValue=this.vendor_Sap_ID ;
   vendor_id_value=_getLoginDetails.profile.vendor_id;
   }
if((userDetailsRoles=='/Vendors') && (this.vendor_Sap_ID==undefined || this.vendor_Sap_ID==null || this.vendor_Sap_ID=='')){
  _vendorIDValue=this.vendorDetails.vendorSAPID;
}

    if(this.initiateData.type=="Re-Submit"){
    let _dataResource=  this.initiateData.reponseAllData.resourceDetail[0];
    let _dataSowJD= this.initiateData.reponseAllData.sowJdDetails[0];
    let _dataVendor= this.initiateData.reponseAllData.vendorDetail[0];   
     _objModel ={
      "employeeNumber":this.viewData.employeeNumber,
      "deboardingRequestID": this.viewData.employeeNumber + ' - 001',
      "exitReasonId": _exitReason,
      "lastWorkingDay": _lastWorking,
      "isReplaceRequest": Number(_reqReplacement),
      "dojReplaceResource": _dojreplacement,
      "statusID": 1,
      "remark":_remarks,
      "createdBy":this.vendorName,
      "sowjdNumber": _dataSowJD.sowJdId,
      "vendorSAPID":_vendorIDValue,
      "sowjdOwnerNtid":_sowjdOwnerNtid,
      "companyCode":_companyCode,
      "SectionSpocNtid":_sectionSpocNtid,
      "isFirstLevelApproved": false,
      "plantCode":  this.viewData.plantCode,
      "vendorId":  vendor_id_value,
      "isGCNaccessUpdated": false,  
     "isSAPidMUpdated": false, 
      "isTransportUpdated": false
    }  
  }
  else{
     _objModel ={
      "employeeNumber":this.viewData.employeeNumber,
      "deboardingRequestID": this.viewData.employeeNumber + ' - 001',
      "exitReasonId": _exitReason,
      "lastWorkingDay": _lastWorking,
      "isReplaceRequest": Number(_reqReplacement),
      "dojReplaceResource": _dojreplacement,
      "statusID": 1,
      "remark":_remarks,
      "createdBy":this.vendorName,
      "sowjdNumber": this.viewData.sowJdID,
      "vendorSAPID":_vendorIDValue,
      "sowjdOwnerNtid":  this.viewData.sowOwnerNtID,
      "companyCode":_companyCode,
      "SectionSpocNtid":this.viewData.sectionSpocNtID,
      "isFirstLevelApproved": false,
      "groupId": Number(this.viewData.group),
      "buSpocEmployeeNumber": this.viewData.bUspocEmployeeNumber,
      "plantCode": this.viewData.plantCode,
      "vendorId": vendor_id_value,
      "sowJdId":this.viewData.sowJdId,
     "technicalProposalId" :this.viewData.technicalProposalId,
     "isGCNaccessUpdated": false,  
     "isSAPidMUpdated": false, 
      "isTransportUpdated": false
    } 
  } 
 this.showLoading=true;
    this.API.initiateDeboardPost(_objModel).subscribe((response2: any) => {
          if(response2.status=="success"){
            this.dialogRef.close();
            this.snackBar.open("Deboarding Request Created Successfully...!", 'Close', {
              duration: 3000,
            });
            this.showLoading=false;
          if(this.createdForm.controls.exitReason.value ==1 || this.createdForm.controls.exitReason.value ==2 || this.createdForm.controls.exitReason.value ==3 || this.createdForm.controls.exitReason.value ==6){
           
              }
              else{ 
                let _responseDataId:any="";
                if(response2 && response2.data){
                   _responseDataId=response2.data.id;
                }
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
                let _ownerEmail = this.viewData.vendorEmail;
                let ownerNamevalue=(_ownerEmail.split('@')[0]).replace('external.','').replace('.',' ');
                let _sendMailObject = {
                   featureCode:'MasterData-Approval-Process',
                   entityId : _entityId,
                   to: this.viewData.firstApproverMailId,
                   cc: this.viewData.vendorEmail,
                  subject: 'ENRICO | Deboarding | '+  this.viewData.employeeNumber + ' | Request Approval',
                   paraInTemplate: {
                     teamName: 'Team',
                     mainText: 'Below request is awaiting your approval'+ "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.employeeNumber +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Deboarding </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+  ownerNamevalue +" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+_responseDataId+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
                  
                   }
                 };
                     
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
              }
              this.createdForm.reset();
          
          }
        });

  }
  isreplacementDojDisabled:boolean=false;
  todayDateShowAfterSeven:any=new Date();
  requestReplacementChange(val:any){
if(val=='0' || val==0){
this.isreplacementDojDisabled=true;
this.createdForm.patchValue({
  dojReplacement: ''
});
}
else if(val=='1'|| val==1){
  this.isreplacementDojDisabled=false;
  let newDate = new Date();
newDate.setDate(newDate.getDate() +14);
  this.todayDateShowAfterSeven=newDate;

}
  }
  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  }
}
