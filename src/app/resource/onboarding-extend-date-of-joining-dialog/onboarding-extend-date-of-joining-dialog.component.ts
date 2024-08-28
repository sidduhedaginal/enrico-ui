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
  selector: 'app-onboarding-extend-date-of-joining-dialog',
  templateUrl: './onboarding-extend-date-of-joining-dialog.component.html',
  styleUrls: ['./onboarding-extend-date-of-joining-dialog.component.scss'],
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
export class OnboardingExtendDateOfJoiningDialogComponent implements OnInit {

  viewData: any;
  remarksModel: any;
  _checkuser:any=[];  
   checkUserRoles:any;
   showLoading:boolean=false;
   createdForm: FormGroup;
   todayDateShow: any = new Date();
   todayDateShowAfterSeven:any=new Date();
   companyTypeCode:any="";
  constructor(public dialogRef: MatDialogRef<OnboardingExtendDateOfJoiningDialogComponent>, @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router,private fb: FormBuilder
  ) { 
    this.createdForm = this.fb.group({
      newDateJoiningFormControlName: ['', Validators.required],
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
    this.todayDateShow = new Date(+new Date(this.viewData?.expectedDOJ) + 86400000);
    let newDate = new Date(this.todayDateShow );
    newDate.setDate(newDate.getDate() +13);
    this.todayDateShowAfterSeven=newDate;
  }
  if(this._Data && this._Data?.companyTypeCode=="38F0"){
this.companyTypeCode  =this._Data.companyTypeCode;
this.todayDateShow = new Date(+new Date(this.viewData?.expectedDOJ) + 86400000);
let newDate = new Date(this.todayDateShow );
newDate.setDate(newDate.getDate() +21);
this.todayDateShowAfterSeven=newDate;
  }
  
  }
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
      "newDoj": this.createdForm.controls.newDateJoiningFormControlName.value,  
      "remark":  this.createdForm.controls.remarksFormControlName.value,
      "createdBy": _createdBy
    }
    this.dialogRef.close({ data: obj });
  }
  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  }
  restrictFirstChacterSpace(event:any){
    if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
      event.preventDefault();
  }
}

}