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
  selector: 'app-onboard-update-ntid-dialog',
  templateUrl: './onboard-update-ntid-dialog.component.html',
  styleUrls: ['./onboard-update-ntid-dialog.component.scss'],
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
export class OnboardUpdateNtidDialogComponent implements OnInit {

   viewData: any;
  remarksModel: any;
  _checkuser:any=[];  
   checkUserRoles:any;
   showLoading:boolean=false;

   _getPathUrl = environment.mailDeboardUrl;
   createdForm: FormGroup;
   todayDate:any=new Date();
   secondApproverDate:any=new Date();
   minDate:any=new Date();
  constructor(public dialogRef: MatDialogRef<OnboardUpdateNtidDialogComponent>, @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router, private fb: FormBuilder
  ) {
    this.createdForm = this.fb.group({
      ntidFormControlName: ['', Validators.required],
      ntidCreatedOnFormControlName: ['', Validators.required],
      bEmailID: ['', [Validators.required,Validators.email]],
      remarksFormControlName: ['', Validators.required],
    })
   }

  ngOnInit() {
    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }
  this._checkuser= StorageQuery.getUserProfile();
  if(this._Data && this._Data.rowData){
    this.viewData = this._Data.rowData;
  }
  if(this._Data && this._Data.secondApproverDate){
    this.secondApproverDate = this._Data.secondApproverDate;
    this.minDate=new Date(this.secondApproverDate?.substring(0,10));
  }
 
  }
  get f() { return this.createdForm.controls; }
  cancleBtn() {
    let obj = {
      "dialogtext": 'false'
    }
    this.dialogRef.close({ data: obj });
  }
  closeBtn() {
    let obj = {
      "dialogtext": 'false'
    }
    this.dialogRef.close({ data: obj });
  }
  submitBtn(createdForm: any) {
    let _createdBy = '';
    if (this._checkuser) {
      _createdBy = this._checkuser.displayName;
    }
    let obj = {
      "dialogtext": 'true',   
      "resourceOBRequestID": this.viewData.id,
      "ntId":  this.createdForm.controls.ntidFormControlName.value,
      "ntidCreatedDt":  this.createdForm.controls.ntidCreatedOnFormControlName.value,
      "remark":  this.createdForm.controls.remarksFormControlName.value,
      "createdBy": _createdBy,
      "boschEmailId": this.createdForm.controls.bEmailID.value,
    }
    this.dialogRef.close({ data: obj });

  }

  restrictFirstChacterSpace(event:any){
    if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
      event.preventDefault();
  }
  
}
restrictFirstChacterSpaceNtid(event:any){
  if (this.createdForm.controls.ntidFormControlName.value.length === 0 && event.which === 32) {
    event.preventDefault();
}
if(event.which === 32){
  event.preventDefault();
}

}
onTextPaste(e) {
  e.preventDefault();
}
}