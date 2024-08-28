import { Component,EventEmitter,Inject, Output } from '@angular/core';
import { PlaningService } from '../../services/planing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, ReplaySubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-withdraw-aop',
  templateUrl: './withdraw-aop.component.html',
  styleUrls: ['./withdraw-aop.component.css']
})
export class WithdrawAOPComponent {
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
  orgLevelsNames = ["name1", "name2"];
  sectionList:any = [];
  allProviders: any[] = [];
  filteredProviders: any[] = []; 
  searchInput : any = "a ";
  searchEmploye : string = '';
  dropdownList : any = [];
  OragUnit :string;
  Approver : string;
  AOPID :any;
  AOPSubmitList : any = [];

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(public dialogRef: MatDialogRef<WithdrawAOPComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private planningService:PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,)
    {}


  ngOnInit(): void {
    this.receivedData = this.data.message;
    this.getAOPSubmitList();
    this.OragUnit = this.receivedData.poPlanningLevel;
    this.Approver = this.receivedData.activitySpocId;
    this.searchEmploye = this.Approver;
    this.getEmployList();
    
    this.SendStatus = this.data.status;
    this.getEmployList();
    this.myForm = this.makeForm();
  }
  getAOPSubmitList(){
    if(this.SendStatus == 'Rejected' || this.SendStatus == 'Approved'){
      this.AOPID = this.receivedData.aopId;
    }else{
      this.AOPID  = this.receivedData.id;
    }
    this.planningService.getAOPSubmitList(this.AOPID,this.receivedData.companyCode,this.receivedData.cfCycleYear).subscribe({
      next:(res:any)=>{
        this.AOPSubmitList = res
        
      },error:(error)=>{
      }
    })
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
    const updateaop:any = {
      ...this.myForm.value
    }
    if(this.SendStatus == 'Rejected' || this.SendStatus == 'Approved'){
      updateaop["id"] = this.receivedData.aopId;
    }else{
      updateaop["id"]  = this.receivedData.id;
    }
   
    updateaop["status"] = this.SendStatus,
    updateaop["activitySop"] = String(updateaop["activitySop"]);
    this.planningService.UpdateAOP(updateaop)
    .subscribe({
      next: (response:any) => {
        if (
          response?.status?.startsWith(' "Record already Approved/Cancelled') 
                  ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = response.status;
          this.showErroMessage = true;
          return;
        }
        if (
          response.data === 'Success'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(`AOP ${this.SendStatus}`);
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

  getEmployeMaster(){
     this.loaderService.setShowLoading();
    this.planningService.getEmployeMaster()
    .subscribe({
      next: (response:any) => {
        this.loaderService.setDisableLoading();
        this.sectionList = response.data.object;
         this.allProviders = response.data.object;
        this.filteredProviders = this.allProviders.filter(({ Fullname }) => {      
          const prov = Fullname.toLowerCase();
          return prov.includes(this.searchInput);
        }); 
        
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
  });
  }
  OnEmploySearch(event:any,fieldName:any){
    this.searchEmploye = event.target.value
    this.getEmployList();
  }
  handleInput(event: KeyboardEvent): void{
  event.stopPropagation();
  }
  getEmployList(){
     this.loaderService.setShowLoading();
 
    this.planningService.get(`api/master-data-filter?searchFor=SpocName&filter=${this.searchEmploye}`).subscribe({
      next:(res:any)=>{
      
        this.dropdownList = res;       
        this.loaderService.setDisableLoading();
      }, error:(error:any)=>{
        this.loaderService.setDisableLoading();
        console.log(error);
        
      }
    });
  }

  //drpdown with search and multi-select
  onInputChange(event: any) {
    this.filteredProviders = this.allProviders;
    this.searchInput = event.target.value.toLowerCase();    
    this.filteredProviders = this.allProviders.filter(({ Fullname }) => {      
      const prov = Fullname.toLowerCase();
      return prov.includes(this.searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    searchInput.value = "";
    this.filteredProviders = this.allProviders;
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  makeForm() {

    const form: FormGroup = this.formBuilder.group({
      Remark: ['', Validators.required],
    });
  
    if (this.SendStatus == 'Submitted') {

      form.addControl('activitySop', this.formBuilder.control(this.Approver, Validators.required));
      form.addControl('poPlanning', this.formBuilder.control('', Validators.required));
    }
    return form;
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
