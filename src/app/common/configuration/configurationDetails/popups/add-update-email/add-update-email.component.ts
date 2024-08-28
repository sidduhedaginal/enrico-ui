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
  selector: 'app-add-update-email',
  templateUrl: './add-update-email.component.html',
  styleUrls: ['./add-update-email.component.css'],
})
export class AddUpdateEmailComponent implements OnInit {
  myForm: FormGroup;
  showLoading: boolean = false;
  receivedData: any;
  entitiesDropdown: any;
  selectedRecord: any;
  entityId = '';
  errorMsg = '';
  userProfileDetails: userProfileDetails | string;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateEmailComponent>,
    private commonApiService: CommonApiServiceService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      featureCode: ['', Validators.required],
      subject: ['', Validators.required],
      to: ['', Validators.required],
      cc: ['', Validators.required],
      remindedInDays: ['', Validators.required],
      isReminded: [false, Validators.required],
      template: [null, Validators.required], // Assuming fileInput will hold the file
    });
  }

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
      this.entityId = this.userProfileDetails?.entityId;
    }
    if (this.receivedData.operation == 'update') {
      this.myForm.patchValue(this.receivedData.payload);
    } else if (this.receivedData.operation == 'create') {
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.myForm.patchValue({
        template: file,
      });
    }
  }

  onSubmit() {
    const formValues = this.myForm.value;
    const formData = this.getFormData(this.myForm.value);
    // const formValues = this.myForm.getRawValue();

    if (this.receivedData.operation == 'delete') {
      this.deleteEmailSettings(this.receivedData.id);
    } else {
      if (this.myForm.valid) {
        if (this.receivedData.operation == 'update') {
          formData.append('Id', this.receivedData.payload.id);
          this.updateEmailSettings(formData);
        } else if (this.receivedData.operation == 'create') {
          this.addEmailSettings(formData);
        }
      } else {
        this.markFormGroupTouched(this.myForm);
      }
    }
  }

  getFormData(formValues: any) {
    const formData = new FormData();
    const file: File = formValues.template;
    formData.append('EntityId', this.entityId);
    // formData.append('EntityId', '60c5b556-6c64-4c10-8b67-4b21aed8e6c8');
    formData.append('FeatureCode', formValues.featureCode);
    formData.append('Subject', formValues.subject);
    formData.append('To', formValues.to);
    formData.append('CC', formValues.cc);
    formData.append('RemindedInDays', formValues.remindedInDays);
    formData.append('IsReminded', formValues.isReminded);
    formData.append('Template', file);
    return formData;
  }

  addEmailSettings(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.addEmailSettings(data).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        // this.showSnackbar(e);
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Added');
      },
    });
  }

  updateEmailSettings(data: any) {
    this.loaderService.setShowLoading();
    this.commonApiService.updateEmailSettings(data).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        // this.showSnackbar(e);
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Updated');
      },
    });
  }

  deleteEmailSettings(id: string) {
    this.loaderService.setShowLoading();
    this.commonApiService.deleteEmailSettings(id).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        // this.showSnackbar(e);
        console.log(e);
        this.errorMsg = e;
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Deleted');
      },
    });
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

  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
}
