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
  selector: 'app-onboarding-acknowledge-bvr-dialog',
  templateUrl: './onboarding-acknowledge-bvr-dialog.component.html',
  styleUrls: ['./onboarding-acknowledge-bvr-dialog.component.scss'],
})
export class OnboardingAcknowledgeBvrDialogComponent implements OnInit {

  viewData: any;
  remarksModel: any;
  _checkuser:any=[];  
   checkUserRoles:any;
   showLoading:boolean=false;
   createdForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<OnboardingAcknowledgeBvrDialogComponent>, @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router,private fb: FormBuilder
  ) {
    this.createdForm = this.fb.group({
      remarksFormControlName: ['', Validators.required],
    })
   }

  ngOnInit() {
    let _getLoginDetails=this.API.getFetchLoginDetailsFor()
    if(_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles){
    this.checkUserRoles=_getLoginDetails.profile.user_roles[0];
    }
  this._checkuser= StorageQuery.getUserProfile();
  this.viewData = this._Data.rowData;
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
      "remark":  this.createdForm.controls.remarksFormControlName.value,
      "createdBy": _createdBy,
    }
    this.dialogRef.close({ data: obj });

  }
  restrictFirstChacterSpace(event:any){
    if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
      event.preventDefault();
  }
}

}