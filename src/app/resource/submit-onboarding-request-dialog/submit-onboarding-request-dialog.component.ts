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
  selector: 'app-submit-onboarding-request-dialog',
  templateUrl: './submit-onboarding-request-dialog.component.html',
  styleUrls: ['./submit-onboarding-request-dialog.component.scss'],
})
export class SubmitOnboardingRequestDialogComponent implements OnInit {
  
   checkUserRoles:any;
   showLoading:boolean=false;
   createdForm: FormGroup;
   _checkuser:any;
   remarksModel:any="";
   viewData:any=[];
   flagBGVSCB:boolean=false;
  constructor(public dialogRef: MatDialogRef<SubmitOnboardingRequestDialogComponent>,@Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router, private fb: FormBuilder) { 
    this.createdForm = this.fb.group({
      checkboxOne: [false, Validators.requiredTrue],
      checkboxtwo: [false, Validators.requiredTrue],
      checkboxThree: [false, Validators.requiredTrue],
      remarksFormControlName: ['', Validators.required],
    })
  }

  ngOnInit() {
    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }

  this._checkuser= StorageQuery.getUserProfile();  
  this.viewData=this._Data;
  if(this.viewData.type== "Resubmit"){
    if(this.viewData.checkButtonType=='EDIT'){

    }
    else{
    this.createdForm.controls['checkboxOne'].setValidators(null);        
    this.createdForm.controls['checkboxtwo'].setValidators(null);
    this.createdForm.controls['checkboxThree'].setValidators(null);
    this.createdForm.controls['checkboxOne'].updateValueAndValidity();
    this.createdForm.controls['checkboxtwo'].updateValueAndValidity();
    this.createdForm.controls['checkboxThree'].updateValueAndValidity();
    } 
  }
if(this.viewData && this.viewData?.checkCompanyCodeGlobal=='38F0'){
this.flagBGVSCB=true;
this.createdForm.controls['checkboxtwo'].setValidators(null);
this.createdForm.controls['checkboxtwo'].updateValueAndValidity();
}
else{
  this.flagBGVSCB=false;
}
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
    let submitType='';
    if(this.viewData.type=="Submit"){
      submitType='SubmitRemarksFirstOBs:'
    }
    else if(this.viewData.type== "Resubmit"){
       submitType='ReSubmitRemarksSecondOBs:'
    }
    let obj={
      "dialogtext":'true',
      "isISPtrainingCompleted": this.createdForm.controls.checkboxOne.value,
      "isBGVcompletedandPassed":this.createdForm.controls.checkboxtwo.value,
      "isConfirmDeclaration":this.createdForm.controls.checkboxThree.value,
      "remark":submitType +' '+ this.createdForm.controls.remarksFormControlName.value,
      "btnStbmitType":this.viewData.checkButtonType
    }
    this.dialogRef.close({ data: obj});
  
  }
  restrictFirstChacterSpace(event:any){
    if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
      event.preventDefault();
  }
}


}