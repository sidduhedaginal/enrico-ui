import { Component,EventEmitter,Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, ReplaySubject } from 'rxjs';
import { PlaningService } from '../../services/planing.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-cancel-slp',
  templateUrl: './cancel-slp.component.html',
  styleUrls: ['./cancel-slp.component.css']
})
export class CancelSLPComponent {
  myForm!:FormGroup;
  receivedData: any;
  fileData!: string;
  EventFile: any;
  base64Output: any;
  File:any=[];
  FileRowdata:any;
  filteredMSBE: string[] = ['MSBE1', 'MSBE2', 'MSBE3', 'MSBE4'];
  selectedMSBE: string[] = [];
  selectedOrgLevel: string = '';
  toppingList : any = []
  private gridApi!: GridApi;
  orgLevelSelect: any;
  SendStatus :any;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  id:any;
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  warningcancel : boolean = false;
  constructor(public dialogRef: MatDialogRef<CancelSLPComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private planningService:PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,)
    {}

  ngOnInit(): void {
    this.receivedData =this.data.message;
    this.id=this.receivedData.id;
    this.SendStatus = this.data.status;
    this.myForm = this.makeForm();
  }
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  setAll(checked:any){
    if(checked == true){
      this.warningcancel = true;
    }else if(checked == false){
      this.warningcancel = false;
      this.myForm.get('Remark')?.reset();
    }
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  onSubmit() {
     this.loaderService.setShowLoading();
    const updateaop:any = {
      ...this.myForm.value
    }
    if(this.SendStatus == 'Rejected' || this.SendStatus == 'Approved'){
      updateaop["id"] = this.receivedData.aopSlId;
    }else{
      updateaop["id"]  =  this.id;
    }
    updateaop["status"] = this.SendStatus,


    
    this.planningService.updateaopsl(updateaop)
    .subscribe({
      next: (response:any) => {
        if (
          response?.status.startsWith('Error') ||
          response?.status?.startsWith('Record already Approved/Cancelled') ||
          response?.status.startsWith('failed')
         
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = response.status;
          this.showErroMessage = true;
          return;
        }
        if (
          response.status === 'Success'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(`Second Level Planning ${this.SendStatus}`);
          this.onClose(event);
        } else {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(response.data);
        }
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
  });
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  makeForm() {
    return this.formBuilder.group({
      Remark: ['',Validators.required],
    })
  }
  uploadFile(event: any) {
    this.EventFile = event.target.files[0];
    this.convertFile(this.EventFile).subscribe((base64:any) => {
      this.base64Output = base64;
      this.EventFile["documentContent"] = this.base64Output;
      this.EventFile["documentName"] = this.EventFile.name;
      this.File.push(this.EventFile);
      this.FileRowdata = this.File
    });
  }
 
  convertFile(file : File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event : any) => result.next(btoa(event.target.result.toString()));
    return result;
  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
 }
 filterMSBEByOrgLevel() {
  if (this.selectedOrgLevel === 'BU') {
    this.filteredMSBE = ['MSBE1', 'MSBE2'];
  } else if (this.selectedOrgLevel === 'Section') {
    this.filteredMSBE = ['MSBE3', 'MSBE4'];
  }
}

}
