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
  selector: 'app-add-update-entity',
  templateUrl: './add-update-entity.component.html',
  styleUrls: ['./add-update-entity.component.css']
})
export class AddUpdateEntityComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateEntityComponent>,
    private adminConfigService: AdminconfigService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      entityName: [ '',[Validators.required,Validators.maxLength(10)]],
      entityFullName: ['', [Validators.required, Validators.maxLength(255)]],
      companyCode: [ '',  [Validators.required,Validators.maxLength(4)]]
    });
  }

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  
  myForm: FormGroup;
  receivedData: any;
  responseData: any;
  moduleList: any;
  errorMsg = "";

  ngOnInit(): void {
    this.receivedData = this.data;
    if (this.receivedData.operation == 'update') {
      this.myForm.patchValue(this.receivedData.data);
    } else if (this.receivedData.operation == 'create') {
    
    }
  }

  addEntity(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.addEntities(data).subscribe({
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
        this.showSnackbar('SuccessFully!! Added the Entity');
      },
    });
  }

  updateEntity(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.updateEntities(data).subscribe({
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
        this.showSnackbar('SuccessFully!! Updated the Entity');
      },
    });
  }

  deleteEntity(id: string) {
    this.loaderService.setShowLoading();
    this.adminConfigService.deleteEntities(id).subscribe({
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
        this.showSnackbar('SuccessFully!! Deleted the Entity');
      },
    });
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
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

  onSubmit() {

    const formValues = this.myForm.value;
    // const formValues = this.myForm.getRawValue();

    if (this.receivedData.operation == 'delete') {
      this.deleteEntity(this.receivedData.id);
    } else {
      if (this.myForm.valid) {
        if (this.receivedData.operation == 'update') {
          formValues['id'] = this.receivedData.data.id;
          this.updateEntity(formValues);
        } else if (this.receivedData.operation == 'create') {
          formValues['isDeleted'] = false;
          this.addEntity(formValues);
        }
      } else {
        this.markFormGroupTouched(this.myForm);
      }
    }
  }

}
