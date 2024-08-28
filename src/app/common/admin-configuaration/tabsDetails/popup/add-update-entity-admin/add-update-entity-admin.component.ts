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
  selector: 'app-add-update-entity-admin',
  templateUrl: './add-update-entity-admin.component.html',
  styleUrls: ['./add-update-entity-admin.component.css']
})
export class AddUpdateEntityAdminComponent implements OnInit{

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateEntityAdminComponent>,
    private adminConfigService: AdminconfigService,
    private snackBar: MatSnackBar,
    public loaderService: LoaderService
  ) {
    this.myForm = this.formBuilder.group({
      entityId: [ '',[Validators.required]],
      entityAdminUser: ['', [Validators.required, Validators.maxLength(50)]],
      entityAdminStatus: [ false,  [Validators.required]]
    });
  }

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  myForm: FormGroup;
  receivedData: any;
  errorMsg = "";
  entityList :any;

  ngOnInit(): void {
    this.receivedData = this.data;
    if (this.receivedData.operation == 'update') {
        this.getEntitiesAndUpdate(this.receivedData.data); 
    } else if (this.receivedData.operation == 'create') {
      this.getEntities();
    }
  }

  getEntities(){
    this.loaderService.setShowLoading();
    this.adminConfigService.getEntities().subscribe({
      next: (response: any) => {
        this.entityList = response.data;
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

  getEntitiesAndUpdate(data:any){
    this.loaderService.setShowLoading();
    this.adminConfigService.getEntities().subscribe({
      next: (response: any) => {
        this.entityList = response.data;
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
      this.deleteEntityAdmin(this.receivedData.id);
    } else {
      if (this.myForm.valid) {
        if (this.receivedData.operation == 'update') {
          formValues['id'] = this.receivedData.data.id;
          this.updateEntityAdmin(formValues);
        } else if (this.receivedData.operation == 'create') {
          this.addEntityAdmin(formValues);
        }
      } else {
        this.markFormGroupTouched(this.myForm);
      }
    }
  }

  addEntityAdmin(data:any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.addEntityAdmin(data).subscribe({
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
        this.showSnackbar('SuccessFully!! Added the EntityAdmin');
      },
    });
  }

  updateEntityAdmin(data: any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.updateEntityAdmin(data).subscribe({
      next: (response: any) => {
        this.isFromSubmitted.emit(true);
        this.dialogRef.close();
        this.showSnackbar(response.status);
      },
      error: (e: any) => {
        // this.showSnackbar(e);
        console.log(e);
        this.errorMsg = e;
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar('SuccessFully!! Updated the Entity Admin');
      },
    });
  }

  deleteEntityAdmin(id: string) {
    this.loaderService.setShowLoading();
    this.adminConfigService.deleteEntityAdmin(id).subscribe({
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
        this.showSnackbar('SuccessFully!! Deleted the Entity Admin');
      },
    });
  }

}
