import { Component, EventEmitter, OnInit, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonApiServiceService } from '../../../../common-api-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../../../services/loader.service';

@Component({
  selector: 'app-add-update-roles-users',
  templateUrl: './add-update-roles-users.component.html',
  styleUrls: ['./add-update-roles-users.component.css'],
})
export class AddUpdateRolesUsersComponent implements OnInit {
  myForm: FormGroup;
  showLoading: boolean = false;
  receivedData: any;
  businessRoles: any;
  errorMsg = '';
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateRolesUsersComponent>,
    private commonApiService: CommonApiServiceService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      roleId: [
        // { value: '', disabled: data.operation == 'update' },
        { value: '', disabled: false },
        Validators.required,
      ],
      ntiDs: [
        { value: '', disabled: data.operation == 'update' },
        Validators.required,
      ],
    });

    if (data.operation == 'update') {
      this.myForm.addControl(
        'status',
        this.formBuilder.control(data.payload.status, Validators.required)
      );
    }
  }
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  ngOnInit(): void {
    this.receivedData = this.data;
    console.log(this.data);

    if (this.receivedData.operation == 'update') {
      this.getBusinessRolesAndUpdate(this.receivedData);
    } else if (this.receivedData.operation == 'create') {
      this.getBusinessRoles();
    }
  }

  getBusinessRolesAndUpdate(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.getBusinessRole().subscribe({
      next: (response: any) => {
        this.businessRoles = response.data;
        if (this.myForm && this.receivedData?.payload?.roleId !== undefined) {
          this.myForm.get('roleId')?.setValue(this.receivedData.payload.roleId);
        }
        if (this.myForm && this.receivedData?.payload?.ntid !== undefined) {
          this.myForm.get('ntiDs')?.setValue(this.receivedData.payload.ntid);
        }
        if (this.myForm && this.receivedData?.payload?.status !== undefined) {
          this.myForm.get('status')?.setValue(this.receivedData.payload.status);
        }
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        console.log(e);
        this.showSnackbar(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  getBusinessRoles() {
    this.loaderService.setShowLoading();
    this.commonApiService.getBusinessRole().subscribe({
      next: (response: any) => {
        this.businessRoles = response.data;
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        console.log(e);
        this.showSnackbar(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  onSubmit() {
    const formValues = this.myForm.getRawValue();
    if (this.receivedData.operation == 'update') {
      this.updateStatusUserInRole(formValues);
    } else if (this.receivedData.operation == 'create') {
      const ntids = [];
      ntids.push(formValues.ntiDs);
      formValues.ntiDs = ntids;
      this.addBusinessRoleToUser(formValues);
    } else if (this.receivedData.operation == 'delete') {
      const ntids = [];
      ntids.push(this.receivedData.payload.ntid);
      formValues.ntiDs = ntids;
      this.deleteUsersOnRole({
        roleId: this.receivedData.payload.roleId,
        ntiDs: ntids,
      });
    }
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  updateStatusUserInRole(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.updateStatusUserInRole(data).subscribe({
      next: (response: any) => {
        // this.showSnackbar(response.status);
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        // this.showSnackbar(e);
        this.errorMsg = e;
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('Successfully!! Updated');
        setTimeout(()=>{
          window.location.reload();
        },1000)
       
      },
    });
  }

  addBusinessRoleToUser(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.addBusinessRoleToUser(data).subscribe({
      next: (response: any) => {
        // this.showSnackbar(response.status);
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        this.errorMsg = e;
        // this.showSnackbar(e);
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('Successfully! Added');
        setTimeout(()=>{
          window.location.reload();
        },1000)
       
      },
    });
  }

  deleteUsersOnRole(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.deleteUsersOnRole(data).subscribe({
      next: (response: any) => {
        // this.showSnackbar(response.status);
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        // this.showSnackbar(e);
        this.errorMsg = e;
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('Successfully!! Deleted Users in BuisnessRole');
        setTimeout(()=>{
          window.location.reload();
        },1000)
       
      },
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
