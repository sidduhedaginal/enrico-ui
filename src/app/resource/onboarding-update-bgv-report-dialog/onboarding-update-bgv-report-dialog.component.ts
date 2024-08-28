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
  selector: 'app-onboarding-update-bgv-report-dialog',
  templateUrl: './onboarding-update-bgv-report-dialog.component.html',
  styleUrls: ['./onboarding-update-bgv-report-dialog.component.scss'],
})
export class OnboardingUpdateBgvReportDialogComponent implements OnInit {
 
 viewData: any;
  remarksModel: any;
  _checkuser:any=[];  
   checkUserRoles:any;
   showLoading:boolean=false;
   createdForm: FormGroup;
  constructor(public dialogRef: MatDialogRef<OnboardingUpdateBgvReportDialogComponent>, @Inject(MAT_DIALOG_DATA) public _Data: any, private snackBar: MatSnackBar, private API: ApiResourceService,private router: Router,private fb: FormBuilder
  ) { 
    
    this.createdForm = this.fb.group({
      bgFileFormControlName: ['', Validators.required],
      bgvStatusFormControlName: ['', Validators.required],
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
      "bgvReportStatus":  this.createdForm.controls.bgvStatusFormControlName.value,
      "remark":  this.createdForm.controls.remarksFormControlName.value,
      "documentName": this.finalResultUpload.documentName,
      "documentURL": this.finalResultUpload.documentURL,
      "fileContent":this.finalResultUpload.fileContent,
      "createdBy": _createdBy || "Bosch",
    }
    
    this.dialogRef.close({ data: obj });

  }
  brUploadFileName:any="";
  changeUploadFile(event:any){      
      let result=  this.validateFileType(event);
      if(result==true){
        var fileInput = (document.getElementById('updateBgvUpload')) as HTMLInputElement;
        this.brUploadFileName= fileInput.value.split('\\').pop();   
        
      this.uploadFileCommonMethod("UpdateBgvReportDocument", event);
      }


  }
  
  deleteUpload(){
    this.brUploadFileName='';
    this.createdForm.patchValue({ 'bgFileFormControlName': null });
    this.finalResultUpload={};
  }
  validateFileType(event:any){
    let result=false;
    let file= event.target.files; 
    var fileName =file[0].name;
    var idxDot = fileName.lastIndexOf(".") + 1;
    var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    if (extFile=="jpg" || extFile=="jpeg" || extFile=="png" || extFile=="pdf"){
        result=true;
return result;
        
    }else{
        this.snackBar.open("Only jpg/jpeg, png and pdf files are allowed!", 'Close', {
          duration: 5000,
        });
        result =false;
        return result;
    }   
}
finalResultUpload: any = {};
uploadFileCommonMethod(uploadFileType, event) {
  let file= event.target.files;  
  const reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = () => {
      let uploadObj :any=[];
      let resUpload = (reader.result.toString()).replace(/^data:image\/[a-z]+;base64,/, "").replace('data:application/pdf;base64,',"");
      uploadObj = {
        "id": null,
        "resourceId": null,
        "resourceType": uploadFileType,
        "documentName": file[0].name,
        "documentURL": null,
        "fileContent": resUpload
      }  
   this.finalResultUpload = uploadObj; 
    };
}
restrictFirstChacterSpace(event:any){
  if (this.createdForm.controls.remarksFormControlName.value.length === 0 && event.which === 32) {
    event.preventDefault();
}
}
}