import { Component,EventEmitter,Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, ReplaySubject } from 'rxjs';
import { PlaningService } from '../../services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-create-slp',
  templateUrl: './create-slp.component.html',
  styleUrls: ['./create-slp.component.css']
})
export class CreateSLPComponent {
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
  SectionList:any = [];
  selectedSection:any = "All";
  filteredData = [];
  selectedBU : any ;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  allProviders: any[] = [];
  filteredProviders: any[] = []; 
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(public dialogRef: MatDialogRef<CreateSLPComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private planningService:PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,)
    
    {}
    handleInput(event: KeyboardEvent): void{
      event.stopPropagation();
   }

  ngOnInit(): void {
    this.receivedData =this.data.message;
    this.myForm = this.makeForm();
    this.myForm.get('ids')?.disable();
    this.setForm();
  }
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  onSubmit() {
     this.loaderService.setShowLoading();
    const CreateSLOP:any ={
      ...this.myForm.value
    }
    CreateSLOP["aopId"] = this.receivedData.aopId
    CreateSLOP["aopFLId"]= this.receivedData.id;
    this.planningService.CreateSLOP(CreateSLOP)
    .subscribe({
      next: (response:any) => {
        if (
          response?.status?.startsWith('Error') ||
          response?.status?.startsWith(' Error!!')
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = response.status;
          this.showErroMessage = true;
          return;
        }
        if (
          response.status === 'Record added success.' ||
          response.data === 'Record updated successfully.' ||
          response.data === 'Record added successfully' ||
          response.status === 'success'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar("Second Level Planning Created Successfully");
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
  setForm(){
    if(this.receivedData.planningOrgLevel == 'section'){
      this.myForm.get('planningOrgLevel')?.setValue('department');
      this.selectedBU  = 'department';
      this.myForm.get('ids')?.enable();
      this.planningService.getFilterLevel(this.receivedData.organizationUnitId,this.receivedData.planningOrgLevel,'department',this.receivedData.companyCode)
      .subscribe({
        next:(res:any) =>{
           this.SectionList = res;
           this.allProviders = res;
           this.filteredProviders = this.allProviders;
          this.loaderService.setDisableLoading();
        },
        error: (e:any) => {
          this.loaderService.setDisableLoading();
        },
    });
    }else if(this.receivedData.planningOrgLevel == 'bu'){
      this.myForm.get('planningOrgLevel')?.setValue('section');
      this.selectedBU  = 'section';
      this.myForm.get('ids')?.enable();
      this.planningService.getFilterLevel(this.receivedData.organizationUnitId,this.receivedData.planningOrgLevel,'section',this.receivedData.companyCode)
      .subscribe({
        next:(res:any) =>{ 
          this.SectionList = res;
          this.allProviders = res;
          this.filteredProviders = this.allProviders;
          this.loaderService.setDisableLoading();
        },
        error: (e:any) => {
          this.loaderService.setDisableLoading();
        },
    });
      
    }
  }
  makeForm() {
    return this.formBuilder.group({
      planningOrgLevel: ['',Validators.required],
      ids:[[],Validators.required],
      remark:["",Validators.required]
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
  filterorgLevel(event:any){
    this.selectedBU = event.value;
    this.SectionList = [];
    this.selectedSection = "All";
    this.myForm.get('ids')?.enable();
    this.myForm.get('ids')?.reset();
    // if(this.selectedBU == "All"){
  
    // }else{
      this.planningService.getFilterLevel(this.receivedData.organizationUnitId,this.receivedData.planningOrgLevel,this.selectedBU,this.receivedData.companyCode)
      .subscribe({
        next:(res:any) =>{ 
          this.SectionList = res;
          this.allProviders = res;
          this.filteredProviders = this.allProviders;
          this.loaderService.setDisableLoading();
        },
        error: (e:any) => {
          this.loaderService.setDisableLoading();
        },
    });
    // }
  
  }
  onSearchUnit(event:any) {
    if(event.data != null){
      this.filteredData = this.SectionList.filter((row: any) =>
        Object.values(row).some((value: any) => {
          if (value !== null && (typeof value === 'string' || typeof value === 'number')) {
            const lowerCaseValue = String(value).toLowerCase();
            const lowerCaseSearchText = event.data.toLowerCase();
            return lowerCaseValue.includes(lowerCaseSearchText);
          }
          return false;
        })
      );
      this.SectionList = this.filteredData;    
    }else if(event.data == null){
      this.planningService.getFilterLevel(this.receivedData.organizationUnitId,this.receivedData.planningOrgLevel,this.selectedBU,this.receivedData.companyCode)
      .subscribe({
        next:(res:any) =>{ 
          this.SectionList = res;
          this.allProviders = res;
          this.filteredProviders = this.allProviders;
          this.loaderService.setDisableLoading();
        },
        error: (e:any) => {
          this.loaderService.setDisableLoading();
        },
    });
    }
  
  }
  filterSection(event:any){
    if(event.value == "All"){
      this.myForm.controls.ids.setValue(this.SectionList);
    }else{
      
    }
  }
  //drpdown with search and multi-select
  onInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();    
    this.filteredProviders = this.allProviders.filter(({ name }) => {      
      const prov = name.toLowerCase();
      return prov.includes(searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    searchInput.value = "";
    this.filteredProviders = this.allProviders;
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
showSnackbar(content: string) {
  this.snackBar.open(content, undefined, { duration: 5000 });
}


}
