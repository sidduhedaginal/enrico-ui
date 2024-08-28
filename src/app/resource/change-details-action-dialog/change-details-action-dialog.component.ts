import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResourceService } from '../api-resource.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-change-details-action-dialog',
  templateUrl: './change-details-action-dialog.component.html',
  styleUrls: ['./change-details-action-dialog.component.css']
})
export class ChangeDetailsActionDialogComponent implements OnInit {
  viewData: any;
  _listDataDDL: any = {};
  customerList: any = [];
  selectedUser: any = '';
  filterdOptions: any = [];

  remarksModel: any;
  _checkuser: any = [];
  effectiveDateModel:any=new Date();
  _getPathUrl=environment.mailDeboardUrl;
  showLoading:boolean=false;
  checkUserRoles:any;
  viewDataGBbusinessList:any=[];
  gbBusinessModelCM:any="";
  getParentRowData:any=[];
  constructor(
    public dialogRef: MatDialogRef<ChangeDetailsActionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService
  ) { }

  ngOnInit() {
    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }

    this.viewData = this._Data;
    this._checkuser = StorageQuery.getUserProfile();
    if (this.viewData.type == "Delegate") {
      this.getuserList();
    }
    if(this.viewData.type=='Approve' && (this.viewData?.element?.status=='Initiated' || this.viewData?.element?.status=='ReSubmitted' || this.viewData?.element?.status== "Submit")){
     this.viewDataGBbusinessList=this.viewData.gbBusinessAreaList;     
    }
    if(this.viewData && this.viewData?.getElementParentRow){
      this.getParentRowData=this.viewData?.getElementParentRow;
    }

  }
  cancleBtn() {
    this.dialogRef.close();
  }
  closeBtn() {
    this.dialogRef.close();
  }

  getuserList() {
    this.API.getUserListOfDelegatesApi().subscribe((response: any) => {
      this._listDataDDL = response;
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


  submitBtn() {

    let _createdBy = '';
    if (this._checkuser && this.checkUserRoles=='/Vendors') {
      _createdBy = this._checkuser?.vendorName;
    }
    if(this._checkuser && this.checkUserRoles=='/EnricoUsers'){
      _createdBy = this._checkuser?.displayName
    }
    if (this.remarksModel == '' || this.remarksModel == null || this.remarksModel == undefined) {
      this.snackBar.open("Please enter remarks", 'Close', {
        duration: 3000,
      });
      return;
    }
    if (this.viewData.type == 'Submit') {  
      let _objModel={};
     
        if(this.viewData.dataPass.selectDropDown=="SOW JD"){
          if(this.viewData && this.viewData.dataPass && this.viewData.dataPass.typeBtn=="Re-Submit"){
            _objModel=
           {
             "resourceCrId":  this.viewData.dataPass.resourceCrId,  
             "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,  
             "crStatusTypeId": this.viewData.dataPass.crStatusTypeId, 
             "employeeNumber": this.viewData.dataPass.employeeNumber,
             "validityStart": this.viewData.dataPass.validityStart,
             "validityEnd": this.viewData.dataPass.validityEnd,
             "sowJdId": this.viewData.dataPass.sowJdId,
             "skillSetId": this.viewData.dataPass.skillSetId,
             "gradeId": this.viewData.dataPass.gradeId,
             "poId": this.viewData.dataPass.poId,
             "PoIdLineItemId": this.viewData.dataPass.PoIdLineItemId,
             "PersonalAreaId": this.viewData.dataPass.PersonalAreaId ,
             "PersonalSubAreaId": this.viewData.dataPass.PersonalSubAreaId,
             "organisationUnitId":this.viewData.dataPass.organisationUnitId,
             "remarks":this.remarksModel,
             "modifiedBy":_createdBy || 'Bosch User',
             "sowEndDate":this.viewData.dataPass.sowEndDate,
             "isSamePO": this.viewData.dataPass.isSamePO, 
             "isSamePOLineItem": this.viewData.dataPass.isSamePOLineItem,
             "isSameOrg": this.viewData.dataPass.isSameOrg,
             "signoffId":  this.viewData.dataPass.signoffId
           }
                 }
                 else{
          _objModel={   
            "vendorId":this.viewData.dataPass.vendorId,
            "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
            "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
            "employeeNumber": this.viewData.dataPass.employeeNumber,
            "validityStart": this.viewData.dataPass.validityStart,
            "validityEnd":  this.viewData.dataPass.validityEnd,
            "sowJdId": this.viewData.dataPass.sowJdId,
            "skillSetId":  this.viewData.dataPass.skillSetId,
            "gradeId": this.viewData.dataPass.gradeId,
            "poId": this.viewData.dataPass.poId,
            "PoIdLineItemId":  this.viewData.dataPass.PoIdLineItemId,
            "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId,
            "PersonalSubAreaId": this.viewData.dataPass.PersonalSubAreaId,
            "organisationUnitId":  this.viewData.dataPass.organisationUnitId,
            "remarks": this.remarksModel,
            "createdBy": _createdBy || 'Bosch User',
            "sowEndDate":this.viewData.dataPass.sowEndDate,
            "isSamePO": this.viewData.dataPass.isSamePO, 
            "isSamePOLineItem": this.viewData.dataPass.isSamePOLineItem,
            "isSameOrg":  this.viewData.dataPass.isSameOrg,
            "signoffId":  this.viewData.dataPass.signoffId
          }
        }
        }
        else if(this.viewData.dataPass.selectDropDown=="Billable/Non-Billable"){
          
          if(this.viewData && this.viewData.dataPass && this.viewData.dataPass.typeBtn=="Re-Submit"){
            _objModel={   
              "resourceCrId":this.viewData.dataPass.resourceCrId,
              "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
              "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
              "employeeNumber": this.viewData.dataPass.employeeNumber,
              "validityStart": this.viewData.dataPass.validityStart,
              "validityEnd":  this.viewData.dataPass.validityEnd,
              "sowJdId": this.viewData.dataPass.sowJdId,
              "skillSetId":  this.viewData.dataPass.skillSetId,
              "gradeId": this.viewData.dataPass.gradeId,           
              "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId,
              "billable":  this.viewData.dataPass.billable,
              "remarks": this.remarksModel,
              "modifiedBy": _createdBy || 'Bosch User',
              "sowEndDate":this.viewData.dataPass.sowEndDate
            }
          }
          else{
          _objModel={   
            "vendorId":this.viewData.dataPass.vendorId,
            "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
            "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
            "employeeNumber": this.viewData.dataPass.employeeNumber,
            "validityStart": this.viewData.dataPass.validityStart,
            "validityEnd":  this.viewData.dataPass.validityEnd,
            "sowJdId": this.viewData.dataPass.sowJdId,
            "skillSetId":  this.viewData.dataPass.skillSetId,
            "gradeId": this.viewData.dataPass.gradeId,           
            "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId,
            "billable":  this.viewData.dataPass.billable,
            "remarks": this.remarksModel,
            "createdBy": _createdBy || 'Bosch User',
            "sowEndDate":this.viewData.dataPass.sowEndDate
          }
        }
        }
        else if(this.viewData.dataPass.selectDropDown=="Personal Sub-Area"){
          if(this.viewData && this.viewData.dataPass && this.viewData.dataPass.typeBtn=="Re-Submit"){
            _objModel={   
              "resourceCrId":this.viewData.dataPass.resourceCrId,
              "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
              "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
              "employeeNumber": this.viewData.dataPass.employeeNumber,
              "validityStart": this.viewData.dataPass.validityStart,
              "validityEnd":  this.viewData.dataPass.validityEnd,
              "sowJdId": this.viewData.dataPass.sowJdId,
              "skillSetId":  this.viewData.dataPass.skillSetId,
              "gradeId": this.viewData.dataPass.gradeId,           
              "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId,
              "personalSubAreaId":  this.viewData.dataPass.PersonaSublAreaId.id,
              "remarks": this.remarksModel,
              "modifiedBy": _createdBy || 'Bosch User',
              "sowEndDate":this.viewData.dataPass.sowEndDate 
            }
          }
          else{
          _objModel={   
            "vendorId":this.viewData.dataPass.vendorId,
            "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
            "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
            "employeeNumber": this.viewData.dataPass.employeeNumber,
            "validityStart": this.viewData.dataPass.validityStart,
            "validityEnd":  this.viewData.dataPass.validityEnd,
            "sowJdId": this.viewData.dataPass.sowJdId,
            "skillSetId":  this.viewData.dataPass.skillSetId,
            "gradeId": this.viewData.dataPass.gradeId,           
            "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId,
            "personalSubAreaId":  this.viewData.dataPass.PersonaSublAreaId.id,
            "remarks": this.remarksModel,
            "createdBy": _createdBy || 'Bosch User',
            "sowEndDate":this.viewData.dataPass.sowEndDate
          }
        }
        }

        else if(this.viewData.dataPass.selectDropDown=="Purchase Order"){
          if(this.viewData && this.viewData.dataPass && this.viewData.dataPass.typeBtn=="Re-Submit"){
            _objModel={ 
              "resourceCrId":this.viewData.dataPass.resourceCrId,
              "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
              "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
              "employeeNumber": this.viewData.dataPass.employeeNumber,
              "validityStart": this.viewData.dataPass.validityStart,
              "validityEnd":  this.viewData.dataPass.validityEnd,
              "sowJdId": this.viewData.dataPass.sowJdId,
              "skillSetId":  this.viewData.dataPass.skillSetId,
              "gradeId": this.viewData.dataPass.gradeId,          
              "poId": this.viewData.dataPass.poId,
              "PoIdLineItemId": this.viewData.dataPass.PoIdLineItemId,
              "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId,  
              "sowEndDate":this.viewData.dataPass.sowEndDate ,         
              "remarks": this.remarksModel,
              "modifiedBy": _createdBy || 'Bosch User',
            }
          }
          else{
            _objModel={ 
              "vendorId":this.viewData.dataPass.vendorId,
            "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
            "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
            "employeeNumber": this.viewData.dataPass.employeeNumber,
            "validityStart": this.viewData.dataPass.validityStart,
            "validityEnd":  this.viewData.dataPass.validityEnd,
            "sowJdId": this.viewData.dataPass.sowJdId,
            "skillSetId":  this.viewData.dataPass.skillSetId,
            "gradeId": this.viewData.dataPass.gradeId,   
              "poId": this.viewData.dataPass.poId,
              "PoIdLineItemId": this.viewData.dataPass.PoIdLineItemId,
              "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId, 
              "sowEndDate":this.viewData.dataPass.sowEndDate ,          
              "remarks": this.remarksModel,
              "createdBy": _createdBy || 'Bosch User',
            }
          }
        }
        else if(this.viewData.dataPass.selectDropDown=="Grade"){
  if(this.viewData && this.viewData.dataPass && this.viewData.dataPass.typeBtn=="Re-Submit"){
    _objModel={ 
      "resourceCrId":this.viewData.dataPass.resourceCrId,
              "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
              "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
              "employeeNumber": this.viewData.dataPass.employeeNumber,
              "validityStart": this.viewData.dataPass.validityStart,
              "validityEnd":  this.viewData.dataPass.validityEnd,
              "sowJdId": this.viewData.dataPass.sowJdId,
              "skillSetId":  this.viewData.dataPass.skillSetId,
              "gradeId":  this.viewData.dataPass.gradeId,
              "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId, 
              "sowEndDate":this.viewData.dataPass.sowEndDate ,    
              "remarks": this.remarksModel,
              "modifiedBy": _createdBy || 'Bosch User',
    }
          }
          else{
            _objModel={ 
              "vendorId":this.viewData.dataPass.vendorId,
              "crStatusTypeId": this.viewData.dataPass.crStatusTypeId,
              "crInitiateTypeId": this.viewData.dataPass.crInitiateTypeId,
              "employeeNumber": this.viewData.dataPass.employeeNumber,
              "validityStart": this.viewData.dataPass.validityStart,
              "validityEnd":  this.viewData.dataPass.validityEnd,
              "sowJdId": this.viewData.dataPass.sowJdId,
              "skillSetId":  this.viewData.dataPass.skillSetId,
              "gradeId":  this.viewData.dataPass.gradeId,
              "PersonalAreaId":  this.viewData.dataPass.PersonalAreaId, 
              "sowEndDate":this.viewData.dataPass.sowEndDate ,    
              "remarks": this.remarksModel,
              "createdBy": _createdBy || 'Bosch User',
            }
          }
        }



   let _createdOn=moment(new Date()).format('DD-MMM-yyyy'); 
   let _crEmpNum="";
   if(this.viewData && this.viewData.dataPass && this.viewData.dataPass.employeeNumber) {
  _crEmpNum= this.viewData.dataPass.employeeNumber;
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
   //console.log(this.getParentRowData);
   let _getPathUrl = environment.mailDeboardUrl;
   let firstAproverName=(this.getParentRowData?.firstApproverMailId?.split('@')[0])?.replace('external.','').replace('.',' ');
   let vendorName=this.getParentRowData?.vendorName;
   let _sendMailObject = {
     featureCode:'MasterData-Approval-Process',
     entityId : _entityId,
     to:  this.getParentRowData?.firstApproverMailId,
     cc: this.getParentRowData?.vendorEmail,
     subject: 'ENRICO | Change Management | '+  _crEmpNum + ' | Request Approval',
     paraInTemplate: {
       teamName: firstAproverName,
       mainText: 'Below Request is awaiting your approval.' + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + _crEmpNum +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Change Management </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> "+vendorName+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+_getPathUrl+"/Resource-Management?data=changeManagement target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + _getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr></table>",
     }
   };
 
this.showLoading=true;
_objModel["sowOwnerNtID"]= this.viewData.dataPass?.sowOwnerNtID||"";
_objModel["sectionSpocNtID"]= this.viewData.dataPass?.sectionSpocNtID||"";
      this.API.changeInitiateSubmitPost(_objModel).subscribe((response: any) => {
        this.showLoading=false;
        if(response && response.data && response.status=='success'){
     let obj=   {
          "id": response.data.crId,
          "cmRequestID":response.data.crNumber,
          "signOffId": this.viewData.sowjdInfo?.signOfId,
          "sowJdID": this.viewData.sowjdInfo?.sowjd,
          "skillSet": this.viewData.sowjdInfo?.skillset,
          "grade": this.viewData.sowjdInfo?.grade,
          "purchaseOrder": this.viewData.sowjdInfo?.purchaseOrder,
          "poLineItem": this.viewData.sowjdInfo?.poLineItem,
          "personalArea": this.viewData.sowjdInfo?.personalArea,
          "personalSubArea": this.viewData.sowjdInfo?.personalSubArea,
          "organizationUnit": this.viewData.sowjdInfo?.group,
          "sowJdEndDate": this.viewData.sowjdInfo?.sowjdEndDate,
          "changeType":this.viewData.dataPass.selectDropDown=='Billable/Non-Billable'?'BillableNonBillable':this.viewData.dataPass.selectDropDown,          
          "billable": this.viewData.sowjdInfo?.billable,
          "createdBy": _createdBy 
        }
        this.API.saveSOWjdInformationCM(obj).subscribe((response: any) => {
if(response && response.data==true){
console.log("Data Saved");
}
else if(response && response.data==false){
  this.snackBar.open("Something goes wrong", 'Close', {
    duration: 3000,
  });
}
        });
      }
        if(response.status=="success" && this.viewData.dataPass.typeBtn=="Re-Submit"){
        this.dialogRef.close('true');
        this.snackBar.open("Resource Change Request ReSubmitted Sucessfully !!!", 'Close', {
          duration: 3000,
        });
        
      }
      else if(response.status=="success" && ( this.viewData.dataPass && this.viewData.dataPass.typeBtn !="Re-Submit")){
          this.dialogRef.close('true');
          this.snackBar.open("Change Initiate Created Successfully...!", 'Close', {
            duration: 3000,
          });
        }  
      });
      if(this.checkUserRoles=='/Vendors')
        {     
          this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
           this.dialogRef.close();         
           }          
        );
       }
       else {
      this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
        this.dialogRef.close();         
        }          
     );
    }

    
    }

    if (this.viewData.type == 'Approve') {
      let _crStatusTypeId="";
      if(this.viewData.element.status=="First Approval" || this.viewData.element.status=="FirstApprove"){       
        _crStatusTypeId= "5";
      }
      else{
        _crStatusTypeId="4";         
      }
      let _objModel ={
    "resourceCrId": this.viewData.element.id,
    "crInitiateTypeId": "1", 
    "crStatusTypeId": _crStatusTypeId,
    "remarks": this.remarksModel,
    "modifiedBy":_createdBy || 'Bosch User',
    
      }
      if(this.viewData.element.status=='Initiated' ||this.viewData.element.status=='ReSubmitted'){
        _objModel['gbCode']=this.gbBusinessModelCM;
      }
let _toMail="";
let _ccMail="";
if(this.viewData && this.viewData.element && this.viewData.element.ownerEmailId){
  _ccMail=this.viewData.element.ownerEmailId;
}
let _mainText='Change Request Approved Successfully';
let _createdOn=moment(new Date()).format('DD-MMM-yyyy'); 
let _ownerEmail = this.viewData.element.ownerEmailId;
let ownerNamevalue="";
if(_ownerEmail){
ownerNamevalue=(_ownerEmail.split('@')[0]).replace('external.','').replace('.',' '); 
}
      if(this.viewData && this.viewData.element && this.viewData.element.status=="Initiated"){
         _toMail=this.viewData.element.secondApproverEmail; 
         _ccMail=this.viewData.element.firstApproverEmail +','+ _ownerEmail;
          _mainText= 'Below request is approved in first level, awaiting your approval second level.'
      }
      else if(this.viewData && this.viewData.element && (this.viewData.element.status=="First Approval" || this.viewData.element.status=="FirstApprove")){
        _toMail= this.viewData.element.ownerEmailId;
        _ccMail=this.viewData.element.secondApproverEmail +','+ this.viewData.element.firstApproverEmail ;
         _mainText= 'Below request is approved.'
      }
      
      let _sendMailObject = {
     featureCode: 'MasterData-Approval-Process',
       to: _toMail ,
       cc: _ccMail,
       subject: 'ENRICO | Change Management | '+  this.viewData.element.crId + ' | Request Approval',
       paraInTemplate: {
         teamName: 'Team',
        mainText:_mainText + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.element.crId +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Change Management </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+ ownerNamevalue+"</td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=changeManagement&getChangeRequestUrlID="+this.viewData.element.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
       }
     };
  this.showLoading=true;
      this.API.changeInitiateSubmitPost(_objModel).subscribe((response: any) => {
        this.showLoading=false;
        if(response.status=="success"){
          this.dialogRef.close('true');
          this.snackBar.open("Change Initiate Approved Successfully...!", 'Close', {
            duration: 3000,
          });
          this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
            this.dialogRef.close();         
            }          
          );
      
        }
      });
  
    }
    if (this.viewData.type == 'Reject' || this.viewData.type=='Rejected') {
      let _objModel =       {
        "resourceCrId": this.viewData.element.id,
        "crInitiateTypeId": "1",    
        "crStatusTypeId": "2",
        "remarks":this.remarksModel,
        "modifiedBy":  _createdBy || 'Bosch User'
    }
    let _createdOn=moment(new Date()).format('DD-MMM-yyyy');  
    let _sendMailTo='';
    let _ownerEmail = this.viewData.element.ownerEmailId;
    let _ccMail="";
    if(this.viewData && this.viewData.element && this.viewData.element.ownerEmailId){
      _ccMail=this.viewData.element.ownerEmailId;
    }
    if(this.viewData && this.viewData.element && (this.viewData.element.status=="Initiated" ||this.viewData.element.status=="ReSubmitted")){
      _sendMailTo=_ownerEmail;
      _ccMail= this.viewData.element.firstApproverEmail;
   }
   else if(this.viewData && this.viewData.element && (this.viewData.element.status=="First Approval" || this.viewData.element.status=="FirstApprove")){
    _sendMailTo=_ownerEmail; 
    _ccMail=this.viewData.element.firstApproverEmail +','+this.viewData.element.secondApproverEmail;
   }

    let _mainText='Change Request Send Back Successfully';  
      
    let ownerNamevalue="";
    if(_ownerEmail){
     ownerNamevalue=(_ownerEmail.split('@')[0]).replace('external.','').replace('.',' ');  
    }          
            let _sendMailObject = {
              featureCode:'MasterData-Approval-Process',
              to:_sendMailTo,
             cc: _ccMail,           
             subject: 'ENRICO | Change Management | '+  this.viewData.element.crId + ' | Sent Back',
              paraInTemplate: {
                teamName: 'Team',
                mainText:_mainText + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.element.crId +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Change Management </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+ownerNamevalue+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=changeManagement&getChangeRequestUrlID="+this.viewData.element.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
              }
            };   
            this.showLoading=true;
    this.API.changeInitiateSubmitPost(_objModel).subscribe((response: any) => {
      this.showLoading=false;
       if(response.status=="success"){
        this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
          this.dialogRef.close();         
          }          
        );
         this.dialogRef.close('true');
         this.snackBar.open("Change Initiate Rejected Successfully...!", 'Close', {
           duration: 3000,
         });
       }
     });

    }
    if (this.viewData.type == 'Delegate') {
      if(this.selectedUser=="" || this.selectedUser==undefined || this.selectedUser==null){
        this.snackBar.open("Please select user", 'Close', {
          duration: 3000,
        });
        return;
      }
   
  let _mainText='Change Request Delegated to you Successfully';
  let _createdOn=moment(new Date()).format('DD-MMM-yyyy');
  let _ccMail="";
  let _ownerEmail = this.viewData?.element?.ownerEmailId;
  let ownerNamevalue="";
  if(_ownerEmail){
  ownerNamevalue=(_ownerEmail.split('@')[0]).replace('external.','').replace('.',' ');
  }
  if(this.viewData && this.viewData.element && this.viewData.element.status=="Initiated"){
    _ccMail= this.viewData.element.firstApproverEmail + ','+_ownerEmail;
   _mainText = this._checkuser.displayName + ' has delegated the below request for your approval.';
  }
  else if(this.viewData && this.viewData.element && (this.viewData.element.status=="First Approval" || this.viewData.element.status=="FirstApprove")){
    _ccMail= this.viewData.element.secondApproverEmail  + ','+_ownerEmail;
    
            _mainText = this._checkuser.displayName + ' has delegated the below request for your approval.'
  }

 let _sendMailObject = {
  featureCode:'MasterData-Approval-Process',
  to: this.selectedUser ,
  cc:_ccMail,
  subject: 'ENRICO | Change Management | '+  this.viewData.element.crId + ' | Record assigned for Approval',
  paraInTemplate: {
    teamName: ( this.selectedUser.split('@')[0]).replace('external.','').replace('.',' '),
    mainText:_mainText + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.element.crId +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Change Management </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>" + ownerNamevalue+ "</td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=changeManagement&getChangeRequestUrlID="+this.viewData.element.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
  }
};


let _objModel =
{
  "resourceCrId":this.viewData.element.id, 
  "crInitiateTypeId": "1",    
  "crStatusTypeId": "7", 
  "delegatedUser":this.selectedValue,
  "remarks": this.remarksModel,
  "modifiedBy": _createdBy || 'Bosch User'
}
this.showLoading=true;
    this.API.changeInitiateSubmitPost(_objModel).subscribe((response: any) => {
      this.showLoading=false;
       if(response.status=="success"){
         this.dialogRef.close('true');
         this.snackBar.open("Change Request Delegate Successfully...!", 'Close', {
           duration: 3000,
         });
       }
       this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
        this.dialogRef.close();         
        }          
      );
      
     });

    }
    if (this.viewData.type == 'Withdraw') {
      let _objModel = {
        "resourceCrId": this.viewData.element.id,        
        "crInitiateTypeId": "1",   
        "crStatusTypeId": "6", 
        "remarks":this.remarksModel,
        "modifiedBy":_createdBy || 'Bosch User',
    }
    let _createdOn=moment(new Date()).format('DD-MMM-yyyy');   
    let _mainText='Below request is Cancelled.'; 
    let _toMail="";
if(this.viewData && this.viewData.element && this.viewData.element.ownerEmailId){
  _toMail=this.viewData.element.ownerEmailId;
}   
let _ownerEmail = this.viewData.element.ownerEmailId;
let ownerNamevalue="";
if(_ownerEmail){
 ownerNamevalue=(_ownerEmail.split('@')[0]).replace('external.','').replace('.',' '); 
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
    let _sendMailObject = {
      featureCode:'MasterData-Approval-Process',
      entityId : _entityId,
      to:_toMail,
      subject: 'ENRICO | Change Management | '+  this.viewData.element.crId + + ' | Request Cancelled',
      paraInTemplate: {
        teamName: 'Team',
        mainText:_mainText + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.element.crId +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Change Management </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td> "+ownerNamevalue+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href="+this._getPathUrl+"/Resource-Management?data=changeManagement&getChangeRequestUrlID="+this.viewData.element.id+" target='_blank'><u>Link</u></a> </td></tr><tr><td><b>My Action </b></td> <td> <a href="+this._getPathUrl+"/my-actions target='_blank'><u>Link</u></a></td></tr></table>",
      }
    };
    this.showLoading=true;
    this.API.changeInitiateSubmitPost(_objModel).subscribe((response: any) => {
      this.showLoading=false;
       if(response.status=="success"){
         this.dialogRef.close('true');
         this.snackBar.open("Change Initiate Withdraw Successfully...!", 'Close', {
           duration: 3000,
         });
         if(this.checkUserRoles=='/Vendors')
          {     
            this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
             this.dialogRef.close();         
             }          
          );
         }
         else {
        this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
          this.dialogRef.close();         
          }          
       );
      }
       }
     });


    }
    if (this.viewData.type == 'Change Effective Date') {
      let _objModel = {
        "resourceCrId": this.viewData.element.id,
        "validityStart":this.effectiveDateModel,
        "remarks": this.remarksModel,
        "crStatusTypeId": 0,
        "createdBy":  _createdBy || 'Bosch User',
        "modifiedBy": _createdBy || 'Bosch User'
      }
      this.showLoading=true;
      this.API.changeEffectiveDatePostApi(_objModel).subscribe((response: any) => {
        this.showLoading=false;
         if(response.status=="success"){
           this.dialogRef.close('true');
           this.snackBar.open("Change Effective Date Created Successfully...!", 'Close', {
             duration: 3000,
           });
         }
       });
    }
    if (this.viewData.type == 'Cancel Request') {
      let _objModel = { 
         "resourceCrId":  this.viewData.element.id,
         "remarks": this.remarksModel, 
         "crStatusTypeId": 0, 
          "createdBy": _createdBy || 'Bosch User'
        }
        
        let _sendMailTo="";
        if(this.viewData && this.viewData.element && this.viewData.element.ownerEmailId){
          _sendMailTo=this.viewData.element.ownerEmailId;
        }
        let _mainText='Change Request Cancelled Successfully';   
        let _ownerEmail = this.viewData.element.ownerEmailId;
        let ownerNamevalue="";
        if(_ownerEmail){
         ownerNamevalue=(_ownerEmail.split('@')[0]).replace('external.','').replace('.',' '); 
        }   
        let _createdOn=moment(new Date()).format('DD-MMM-yyyy');  
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
              to:_sendMailTo,           
              subject: 'ENRICO | Change Management | '+  this.viewData.element.crId + ' | Cancel Change Request',
              paraInTemplate: {
                teamName: 'Team',
                mainText:_mainText +  "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.element.crId +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Change Management </td></tr><tr><td><b>Created On</b></td> <td>"+  _createdOn+"</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>"+_createdOn +"</td></tr><tr><td><b>Owner Name</b></td> <td>"+ownerNamevalue+" </td></tr></table>",
              
              }
            };   
this.showLoading=true;
        this.API.cancelRequestePostApi(_objModel).subscribe((response: any) => {
          this.showLoading=false;
           if(response.status=="success"){
            if(this.checkUserRoles=='/Vendors')
              {     
                this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
                 this.dialogRef.close();         
                 }          
              );
             }
             else {
            this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
              this.dialogRef.close();         
              }          
           );
          }
             this.dialogRef.close('true');
             this.snackBar.open("Cancel Request Created Successfully...!", 'Close', {
               duration: 3000,
             });
           }
         });
    }
    
  }
  restrictFirstSpace(event) {
    const textarea = event.target;
    if (textarea.value.length === 0 && event.key === ' ') {
        event.preventDefault();
    }
  }


}