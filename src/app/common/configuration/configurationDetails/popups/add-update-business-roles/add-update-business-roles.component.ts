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
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from '../../../../../services/loader.service';

@Component({
  selector: 'app-add-update-business-roles',
  templateUrl: './add-update-business-roles.component.html',
  styleUrls: ['./add-update-business-roles.component.css'],
})
export class AddUpdateBusinessRolesComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateBusinessRolesComponent>,
    private commonApiService: CommonApiServiceService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      entityId: [{ value: '', disabled: true }, Validators.required],
      entityBusinessRoleName: ['', Validators.required],
      entityBusinessRoleStatus: ['false', Validators.required],
      firstApprover: ['false', Validators.required],
      secondApprover: ['false', Validators.required],
    });
  }

  myForm: FormGroup;
  showLoading: boolean = false;
  receivedData: any;
  entitiesDropdown: any;
  selectedRecord: any;
  entityId = '';
  errorMsg = '';
  userProfileDetails: userProfileDetails | string;

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  ngOnInit(): void {
    this.receivedData = this.data;
    this.userProfileDetails = StorageQuery.getUserProfile();

    if (
      typeof this.userProfileDetails === 'object' &&
      this.userProfileDetails !== null
    ) {
      // this.entityId = this.userProfileDetails.roleDetail[0].entityId;
      this.entityId = this.userProfileDetails?.entityId;
    }

    if (this.receivedData.operation == 'update') {
      this.getEntityAndGetBusineesRolesById(this.receivedData?.id);
    } else if (this.receivedData.operation == 'create') {
      this.getEntity();
    }
  }
  onSubmit() {
    const formValues = this.myForm.getRawValue();
    formValues.entityBusinessRoleStatus =
      formValues.entityBusinessRoleStatus === 'true';
    formValues.firstApprover = formValues.firstApprover === 'true';
    formValues.secondApprover = formValues.secondApprover === 'true';

    if (this.receivedData.operation == 'update') {
      formValues['id'] = this.receivedData.id;
      this.updateBusinessRole(formValues);
    } else if (this.receivedData.operation == 'create') {
      this.addBusinessRole(formValues);
    } else if (this.receivedData.operation == 'delete') {
      this.deleteBusinessRoleById(this.receivedData.id);
    }
  }

  updateBusinessRole(formValues: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.updateBusinessRole(formValues).subscribe({
      next: (response: any) => {
        console.log(response);
        //  this.showSnackbar(response.status);
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
        this.showSnackbar('Successfully Updated Business Role');
      },
    });
  }

  addBusinessRole(formValues: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.addBusinessRole(formValues).subscribe({
      next: (response: any) => {
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
        this.showSnackbar('Successfully Added BusinessRole');
      },
    });
  }

  deleteBusinessRoleById(id: string) {
    this.loaderService.setShowLoading();
    this.commonApiService.deleteBusinessRoleById(id).subscribe({
      next: (response: any) => {
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
        this.showSnackbar('Successfully!! Deleted the BusinessRole');
      },
    });
  }

  getEntity() {
    this.loaderService.setShowLoading();
    this.commonApiService.getEntities().subscribe({
      next: (response: any) => {
        this.entitiesDropdown = response.data;
        if (this.myForm) {
          this.myForm.get('entityId')?.setValue(this.entityId);
        }
      },
      error: (e: any) => {
        console.log(e);
        this.showSnackbar(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  getEntityAndGetBusineesRolesById(id: string) {
    this.loaderService.setShowLoading();
    this.commonApiService.getEntities().subscribe({
      next: (response: any) => {
        this.entitiesDropdown = response.data;
        this.getBusinessRoleById(id);
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        console.log(e);
        this.showSnackbar(e);
      },
      complete: () => {
        // this.showLoading = false;
      },
    });
  }

  getBusinessRoleById(id: string) {
    this.loaderService.setShowLoading();
    this.commonApiService.getBusinessRoleById(id).subscribe({
      next: (response: any) => {
        this.selectedRecord = response.data;
        this.selectedRecord.entityBusinessRoleStatus =
          this.selectedRecord.entityBusinessRoleStatus === true
            ? 'true'
            : 'false';
        this.selectedRecord.firstApprover =
          this.selectedRecord.firstApprover === true ? 'true' : 'false';
        this.selectedRecord.secondApprover =
          this.selectedRecord.secondApprover === true ? 'true' : 'false';
        this.myForm.patchValue(this.selectedRecord);
      },
      error: (e: any) => {
        console.log(e);
        this.showSnackbar(e);
        this.loaderService.setDisableLoading();
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
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
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
