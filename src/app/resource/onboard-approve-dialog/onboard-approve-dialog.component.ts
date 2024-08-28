import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResourceService } from '../api-resource.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-onboard-approve-dialog',
  templateUrl: './onboard-approve-dialog.component.html',
  styleUrls: ['./onboard-approve-dialog.component.scss'],
})
export class OnboardApproveDialogComponent implements OnInit {
  viewData: any;
  remarksModel: any;
  _checkuser:any=[];  
   checkUserRoles:any;
   showLoading:boolean=false;
   createdForm: FormGroup;
   viewDataGBbusinessList:any;
   viewDataDeviceListt:any=[];
   viewApproveAdditionalData:any=[];
  constructor(public dialogRef: MatDialogRef<OnboardApproveDialogComponent>, @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router
  , private fb: FormBuilder) { 
    this.createdForm = this.fb.group({
      gbBusinessFormControlName: [''],
      isResourceAccessCardFormControlName: [''],
      buildingFloorFormControlName: [''],
      ntIDrequiredFormControlName: ['true'],
      deviceClassFormControlName: [''],
      internetAccessFormControlName: [''],
      isPermissionMailOutsideFormControlName: [''],
      remarksFormControlName: ['', Validators.required],
    })
  }

  ngOnInit() {
    this.createdForm.controls['ntIDrequiredFormControlName'].disable();
    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }
  this._checkuser= StorageQuery.getUserProfile();
  if(this._Data && this._Data.rowData){
    this.viewData = this._Data.rowData;
  }
  if(this._Data && this._Data.gbBusinnesOptionListData){
    this.viewDataGBbusinessList = Array.from(new Set(this._Data.gbBusinnesOptionListData));
  }
  if(this._Data && this._Data.deviceList){
    this.viewDataDeviceListt = Array.from(new Set(this._Data.deviceList));
  }
 
  if(this._Data && this._Data.allOnboardingDetails && this._Data.allOnboardingDetails?.onboardingAddditionalDetails?.length>0 && this.viewData.status =='Submitted' || this.viewData.statusdescription =='Submitted'){
   this.viewApproveAdditionalData =this._Data.allOnboardingDetails?.onboardingAddditionalDetails[0];

   this.createdForm.patchValue({ 'gbBusinessFormControlName': this._Data.allOnboardingDetails?.firstApprovalInfo[0]?.gbCode });
   this.createdForm.patchValue({ 'isResourceAccessCardFormControlName': String(this.viewApproveAdditionalData.isResourceAccessCardRequired) });
   this.createdForm.patchValue({ 'buildingFloorFormControlName': this.viewApproveAdditionalData.buildingAndFloorAccessLevel });
   this.createdForm.patchValue({ 'ntIDrequiredFormControlName': String(this.viewApproveAdditionalData.isNtidRequired) });

  this.createdForm.patchValue({'deviceClassFormControlName':this._Data.allOnboardingDetails?.onboardingAddditionalDetails[0]?.onboardingDeviceClassMasterId});

   this.createdForm.patchValue({ 'internetAccessFormControlName': String(this.viewApproveAdditionalData.isInternetAccessRequired) });
   this.createdForm.patchValue({ 'isPermissionMailOutsideFormControlName': String(this.viewApproveAdditionalData.isMailAccessRequired) });
  }

  if(this.viewData.status =='Submitted' || this.viewData.statusdescription =='Submitted'){
    this.createdForm.controls['gbBusinessFormControlName'].setValidators([Validators.required]);
  }
  else{
    this.createdForm.controls['gbBusinessFormControlName'].setValidators(null);
  }
  this.createdForm.controls['gbBusinessFormControlName'].updateValueAndValidity();

  if((this.viewData.status =='Submitted' || this.viewData.statusdescription =='Submitted')){//this._Data?.checkCompany=='38F0' &&
    this.createdForm.controls['isResourceAccessCardFormControlName'].setValidators([Validators.required]);
    this.createdForm.controls['buildingFloorFormControlName'].setValidators(null);
    this.createdForm.controls['ntIDrequiredFormControlName'].setValidators([Validators.required]);
    this.createdForm.controls['deviceClassFormControlName'].setValidators([Validators.required]);
    this.createdForm.controls['internetAccessFormControlName'].setValidators([Validators.required]);
    this.createdForm.controls['isPermissionMailOutsideFormControlName'].setValidators([Validators.required]);
  }
else{
  this.createdForm.controls['isResourceAccessCardFormControlName'].setValidators(null);
  this.createdForm.controls['buildingFloorFormControlName'].setValidators(null);
  this.createdForm.controls['ntIDrequiredFormControlName'].setValidators(null);
  this.createdForm.controls['deviceClassFormControlName'].setValidators(null);
  this.createdForm.controls['internetAccessFormControlName'].setValidators(null);
  this.createdForm.controls['isPermissionMailOutsideFormControlName'].setValidators(null);
}
this.createdForm.controls['isResourceAccessCardFormControlName'].updateValueAndValidity();
this.createdForm.controls['buildingFloorFormControlName'].updateValueAndValidity();
this.createdForm.controls['ntIDrequiredFormControlName'].updateValueAndValidity();
this.createdForm.controls['deviceClassFormControlName'].updateValueAndValidity();
this.createdForm.controls['internetAccessFormControlName'].updateValueAndValidity();
this.createdForm.controls['isPermissionMailOutsideFormControlName'].updateValueAndValidity();
  }
  cancleBtn() {
    let obj={
      "dialogtext":'false'
    }
    this.dialogRef.close({ data: obj});
  }
  closeBtn() {
    let obj={
      "dialogtext":'false'
    }
    this.dialogRef.close({ data: obj});
  }
  submitBtn(createdForm:any) {
    this.showLoading=true;
    let _createdBy='';
    if(this._checkuser){
       _createdBy=this._checkuser.displayName;
    }   
      let obj = {
        "dialogtext":'true',
        "id":this.viewData.id,
        "gbBusinessArea": this.createdForm.controls.gbBusinessFormControlName.value,
        "remark":this.createdForm.controls.remarksFormControlName.value,
        "createdBy":_createdBy || 'Bosch User',
        "createdOn":  this.getCurrentDateTime() ,
          };
         
          if((this.viewData.status =='Submitted' || this.viewData.statusdescription =='Submitted')){ // this._Data?.checkCompany=='38F0' &&
            let _filterDeviceName=this.viewDataDeviceListt?.filter(v=>{return v.id==this.createdForm.controls.deviceClassFormControlName.value})
              obj["onboardingDeviceClassMasterId"]= this.createdForm.controls.deviceClassFormControlName.value;
              obj["isResourceAccessCardRequired"]= JSON.parse(this.createdForm.controls.isResourceAccessCardFormControlName.value);
              obj["isNtidRequired"]= JSON.parse(this.createdForm.controls.ntIDrequiredFormControlName.value);
              obj["isInternetAccessRequired"]= JSON.parse(this.createdForm.controls.internetAccessFormControlName.value);
              obj["isMailAccessRequired"]= JSON.parse(this.createdForm.controls.isPermissionMailOutsideFormControlName.value);
              obj["buildingAndFloorAccessLevel"]= this.createdForm.controls.buildingFloorFormControlName.value;
              obj["deviceClass"]=_filterDeviceName[0]?.deviceName;//  this.createdForm.controls.deviceClassFormControlName.value.deviceName;
             
            
          }
    this.dialogRef.close({ data: obj});
    this.showLoading=false;
  
    
  }

  getCurrentDateTime(){
    let _fullUTCDateTime=   new Date().toISOString().substring(0, 19)+'.000Z'
   return _fullUTCDateTime;
     }
     restrictFirstChacterSpace(event:any){
      if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
        event.preventDefault();
    }   
  }
  showHideBuildingAccessLevel:boolean=true;
  isAccessCardChange(event:any){
    let valAccesss=event.value;
    this.createdForm.controls['buildingFloorFormControlName'].reset()
    if(valAccesss=='true'){
this.showHideBuildingAccessLevel=true;
this.createdForm.controls['buildingFloorFormControlName'].setValidators([Validators.required]);
    }
    else{
      this.showHideBuildingAccessLevel=false;
      this.createdForm.controls['buildingFloorFormControlName'].setValidators(null);
    }
    this.createdForm.controls['buildingFloorFormControlName'].updateValueAndValidity();

  }
  restrictFirstChacterSpaceBuild(event:any){
   let _val=this.createdForm.controls.buildingFloorFormControlName.value;
  if ((_val== null || _val?.length===0) && event.which === 32) {
    event.preventDefault();
}
}
}