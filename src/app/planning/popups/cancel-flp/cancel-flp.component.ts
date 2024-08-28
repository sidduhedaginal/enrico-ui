import { Component, ElementRef, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, ReplaySubject, map, startWith } from 'rxjs';
import { PlaningService } from '../../services/planing.service';
import { CreateFLPComponent } from '../create-flp/create-flp.component';
import { UsernameValidator } from './usernameValidator';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-cancel-flp',
  templateUrl: './cancel-flp.component.html',
  styleUrls: ['./cancel-flp.component.css']
})

export class CancelFlpComponent {
  myForm!:FormGroup;
  receivedData: any;
  SectionList:any = []
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
  selectedSection:any = "All";
  planningOrgLevel : any = "All";
  toppings = new FormControl('');
  SendStatus :any;
  @ViewChild('search') searchTextBox: ElementRef;

  selectFormControl = new FormControl();
  searchTextboxControl = new FormControl();
  selectedValues = [];
 public data1: any = [
    'A1',
    'A2',
    'A3',
    'B1',
    'B2',
    'B3',
    'C1',
    'C2',
    'C3'
  ];
  filteredOptions: Observable<any[]>;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  warningcancel : boolean = false;
  public noWhitespace(control:any) {
    let isWhitespace = control.replace(/^\s+/g, '');
    return isWhitespace;
}
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(public dialogRef: MatDialogRef<CreateFLPComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private planningService:PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,)
    
    {}

  ngOnInit(): void {
    this.receivedData =this.data.message;
    this.SendStatus = this.data.status;
    this.myForm = this.makeForm();
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  OnRemarkChange(event:any){
    // const originalString = event.target.value;
    // const result = originalString.replace(/^\s+/g, '');

  }
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
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
    const CreateAOP:any = {
      ...this.myForm.value
    }
    CreateAOP["id"] = this.receivedData.id;
    CreateAOP["status"]=  this.SendStatus,
  
    this.planningService.updateaopfl(CreateAOP)
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
          this.showSnackbar(`First Level Planning ${this.SendStatus}`);
          this.onClose(event);
        } else {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(response.status);
        }
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
  });
   
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
 filterorgLevel(event:any){
  this.SectionList = [];
  this.selectedSection = "All"
  if(event.value == "All"){

  }else{
    this.planningService.getFilters(event.value).subscribe((res:any)=>{
      this.SectionList = res.data;
    });
    this.filteredOptions = this.searchTextboxControl.valueChanges
    .pipe(
      startWith<string>(''),
      map((name:any) => this._filter(name))
    );
  }

}
filterSection(event:any){
  if(event.value == "All"){

  }else{
    
  }
}
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  private _filter(name: string): String[] {
    const filterValue = name.toLowerCase();
    // Set selected values to retain the selected checkbox state 
    this.setSelectedValues();
    this.selectFormControl.patchValue(this.selectedValues);
    let filteredList = this.SectionList.filter((option:any) => option.toLowerCase().indexOf(filterValue) === 0);
    return filteredList;
  }

  selectionChange(event:any) {
    // if (event.isUserInput && event.source.selected == false) {
    //   let index = this.selectedValues.indexOf(event.source.value);
    //   this.selectedValues.splice(index, 1)
    // }
  }

  openedChange(e:any) {
    // Set search textbox value as empty while opening selectbox 
    this.searchTextboxControl.patchValue('');
    // Focus to search textbox while clicking on selectbox
    if (e == true) {
      this.searchTextBox.nativeElement.focus();
    }
  }

  clearSearch(event:any) {
    event.stopPropagation();
    this.searchTextboxControl.patchValue('');
  }


  setSelectedValues() {
    if (this.selectFormControl.value && this.selectFormControl.value.length > 0) {
      // this.selectFormControl.value.forEach((e:any) => {
      //   if (this.selectedValues.indexOf(e) == -1) {
      //     this.selectedValues.push(e);
      //   }
      // });
    }
  }

}  