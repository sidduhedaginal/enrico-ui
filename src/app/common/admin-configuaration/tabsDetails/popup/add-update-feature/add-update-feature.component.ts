import { Component, EventEmitter, OnInit, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { LoaderService } from '../../../../../services/loader.service';
import { AdminconfigService } from '../../../../adminconfig.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-update-feature',
  templateUrl: './add-update-feature.component.html',
  styleUrls: ['./add-update-feature.component.css'],
})
export class AddUpdateFeatureComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateFeatureComponent>,
    private adminConfigService: AdminconfigService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      // disabled: data.operation == 'update'
      moduleId: [
        { value: '', disabled: data.operation == 'update' },
        [Validators.required],
      ],
      featureName: ['', [Validators.required, Validators.maxLength(50)]],
      featureDescription: [
        '',
        [Validators.required, Validators.maxLength(500)],
      ],
      urlPath: ['', [Validators.maxLength(100)]],
      featureCode: ['', [Validators.required, Validators.maxLength(50)]],
    });
  }

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );

  myForm: FormGroup;
  receivedData: any;
  responseData: any;
  moduleList: any;
  errorMsg = '';

  ngOnInit(): void {
    this.receivedData = this.data;
    if (this.receivedData.operation == 'update') {
      this.getModuleAndUpdate(this.receivedData.data);
    } else if (this.receivedData.operation == 'create') {
      this.getModules();
    }
  }

  getModules() {
    this.loaderService.setShowLoading();
    this.adminConfigService.getModules().subscribe({
      next: (response: any) => {
        this.moduleList = response.data;
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        this.showSnackbar(e);
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  getModuleAndUpdate(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.getModules().subscribe({
      next: (response: any) => {
        this.moduleList = response.data;
        this.myForm.patchValue(data);
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

  addModule(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.addModule(data).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Added the module');
      },
    });
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  onSubmit() {
    // const formValues = this.myForm.value;
    const formValues = this.myForm.getRawValue();

    if (this.receivedData.operation == 'delete') {
      this.deleteFeatureById(this.receivedData.id);
    } else {
      if (this.myForm.valid) {
        if (this.receivedData.operation == 'update') {
          formValues['id'] = this.receivedData.data.id;
          formValues['featureNumber'] = 'dummy';
          this.updateFeature(formValues);
        } else if (this.receivedData.operation == 'create') {
          formValues['featureNumber'] = 'dummy';
          this.addFeature(formValues);
        }
      } else {
        this.markFormGroupTouched(this.myForm);
      }
    }
  }

  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }

  addFeature(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.addFeature(data).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Added the Feature');
      },
    });
  }

  updateFeature(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.updateFeature(data).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        this.errorMsg  = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! updated the Feature');
      },
    });
  }

  deleteFeatureById(id: string) {
    this.loaderService.setShowLoading();
    this.adminConfigService.deleteFeature(id).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        // this.showSnackbar(response.status);
      },
      error: (e: any) => {
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Deleted the Feature');
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
