import { Component, EventEmitter, OnInit,Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA,MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LoaderService } from '../../../../../services/loader.service';
import { AdminconfigService } from '../../../../adminconfig.service';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-add-update-module',
  templateUrl: './add-update-module.component.html',
  styleUrls: ['./add-update-module.component.css']
})
export class AddUpdateModuleComponent  implements OnInit{

  constructor
  (
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUpdateModuleComponent>,
    private adminConfigService:AdminconfigService,
    private snackBar: MatSnackBar,
    public loaderService:LoaderService,
  ) {
    this.myForm = this.formBuilder.group({

      moduleName: ['', [Validators.required, Validators.maxLength(255)]],
      moduleIcon: ['', [Validators.maxLength(255)]],
      moduleDescription: ['', [Validators.required, Validators.maxLength(500)]],
      urlPath: ['', [Validators.maxLength(100)]],
      isBelongToVendor: [false, Validators.required]
    });
  }

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  myForm: FormGroup;
  receivedData :any;
  responseData : any;
  errorMsg = "";

  ngOnInit(): void {
    this.receivedData = this.data;
    
    if(this.receivedData.operation =='update'){
      this.getModuleByIdAndUpdate(this.receivedData?.id);   
    }
  }


  getModuleByIdAndUpdate(id: string) {
    this.loaderService.setShowLoading();
    this.adminConfigService.getModuleById(id).subscribe({
      next: (response: any) => {
        this.responseData = response.data;
        this.myForm.patchValue(this.responseData);

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

  deleteModuleById(id: string) {
    this.loaderService.setShowLoading();
    this.adminConfigService.deleteModuleById(id)
    .subscribe({
      next: (response:any) => {
        
          this.isFromSubmitted.emit(true);
          this.dialogRef.close();
          // this.showSnackbar(response.status);
      },  
      error: (e:any) => {
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        
        this.loaderService.setDisableLoading();
        this.showSnackbar("SuccessFully!! Deleted the Module");

      }
    });
  }

  addModule(data:any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.addModule(data)
    .subscribe({
      next: (response:any) => {
        
          this.isFromSubmitted.emit(true);
          this.dialogRef.close();
          // this.showSnackbar(response.status);
      },  
      error: (e:any) => {
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
        this.showSnackbar("SuccessFully!! Added the Module");
      }
    });
  }

  updateModule(data:any) {
    this.loaderService.setShowLoading();
    this.adminConfigService.updateModule(data)
    .subscribe({
      next: (response:any) => {
        
          this.isFromSubmitted.emit(true);
          this.dialogRef.close();
          // this.showSnackbar(response.status);
      },  
      error: (e:any) => {
        this.errorMsg = e;
        console.log(e);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        
        this.loaderService.setDisableLoading();
        this.showSnackbar("SuccessFully!! Updated the Module");
      }
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

  onSubmit(){
    const formValues = this.myForm.value;
    if (this.receivedData.operation == 'delete') {
      this.deleteModuleById(this.receivedData.id);
    } else {
      if (this.myForm.valid) {
        if(this.receivedData.operation =='update'){
          formValues["id"] = this.receivedData.id;
          this.updateModule(formValues); 
        }
        else if (this.receivedData.operation == 'create') {
          this.addModule(formValues);
        }
      }
      else {
        this.markFormGroupTouched(this.myForm);
      }
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
