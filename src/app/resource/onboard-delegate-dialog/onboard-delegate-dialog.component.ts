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
  selector: 'app-onboard-delegate-dialog',
  templateUrl: './onboard-delegate-dialog.component.html',
  styleUrls: ['./onboard-delegate-dialog.component.scss'],
})
export class OnboardDelegateDialogComponent implements OnInit {

  viewData: any;
  _listDataDDL: any = {};
  customerList: any = [];
  selectedUser: any = '';
  filterdOptions: any = [];
  remarksModel: any;
  _checkuser: any = [];
  allResponseDeboardDetails: any = [];
  _getPathUrl = environment.mailDeboardUrl;
  checkUserRoles: any;
  showLoading: boolean = false;
  createdForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<OnboardDelegateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService, private router: Router, private fb: FormBuilder
  ) {
    this.createdForm = this.fb.group({
      userFormControlName: ['', Validators.required],
      remarksFormControlName: ['', Validators.required],
    })
  }

  ngOnInit() {
    let _getLoginDetails = this.API.getFetchLoginDetailsFor()
    if (_getLoginDetails && _getLoginDetails.profile && _getLoginDetails.profile.user_roles) {
      this.checkUserRoles = _getLoginDetails.profile.user_roles[0];
    }
    this._checkuser = StorageQuery.getUserProfile();
    this.viewData = this._Data;
    this.getuserList();
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
      "delegateObjectId": this.viewData.rowData.id,//"a0e858d8-3e26-48c7-89f9-91e3e1b87cb9",
      "delegateObjectType": 4,
      "delegatedTo": this.selectedValue,
      "remarks": this.createdForm.controls.remarksFormControlName.value,
      "createdOn": this.getCurrentDateTime(),
      "delegatedBy": _createdBy,
      'delegateSelectedMailID': this.createdForm.controls.userFormControlName.value,
    }
    this.dialogRef.close({ data: obj });

  }
  getuserList() {
    this.API.getUserListOfDelegatesApi().subscribe((response: any) => {
      this._listDataDDL = response;
      this.customerList = this._listDataDDL.data.resourceDelegateUser.filter((v => {
        return (v.ntid != null && v.email != null)
      }));
    })
  }

  filterUsers() {
    if (this.selectedUser == '') {
      this.filterdOptions = [];
    } else {
      if(this.createdForm.controls.userFormControlName.value.length>2){
      this.filterdOptions = this.customerList.filter((item: any) =>
        (item.email !== null && item.email?.toLowerCase().includes(this.selectedUser?.toLowerCase())) || (item.ntid !== null && item.ntid?.toLowerCase().includes(this.selectedUser?.toLowerCase()))
      );
    }
    }
  }
  selectedValue: any = "";
  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.selectedUser = event.option.viewValue;
    this.selectedValue = event.option.value;
  }
  getCurrentDateTime() {
    let _fullUTCDateTime = new Date().toISOString().substring(0, 19) + '.000Z'
    return _fullUTCDateTime;
  }
  restrictFirstChacterSpace(event:any){
    if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
      event.preventDefault();
  }
  }
}