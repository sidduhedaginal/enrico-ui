import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { Observable, ReplaySubject } from 'rxjs';
import { PlaningService } from '../../services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { SapApiService } from '@micro-app/core';
import { LoaderService } from '../../../../app/services/loader.service';
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-create-aoppopup',
  templateUrl: './create-aoppopup.component.html',
  styleUrls: ['./create-aoppopup.component.css']
})
export class CreateAOPpopupComponent {
  myForm!: FormGroup;
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
  PlanId :any;
  companyCode:any;
  CfCycle :any;
  planningyear :any;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  exchangeRate: number = 0 ;
  // BGSV = 24560.00
  // BGSW = 83.15
  fromCurrency: any;
  toCurrency: any;
  environment = environment;

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(public dialogRef: MatDialogRef<CreateAOPpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private formBuilder: FormBuilder,
    private planningService:PlaningService,
    private snackBar: MatSnackBar,
    private http : HttpClient,
    // private sapApi: SapApiService,
    private loaderService: LoaderService,
    ){}
  
    ngOnInit(): void {
      this.receivedData =this.data.message;
      this.companyCode = this.receivedData.companyCode ;
      this.CfCycle = this.receivedData.CfCycleName;
      this.planningyear = this.receivedData.cfCycleYear;
      this.PlanId = `${this.companyCode}_AOP_${this.CfCycle}_${this.planningyear}`;
      this.myForm = this.makeForm();
      if( this.companyCode== "6520"){
        // this.exchangeRate = 83.15;
        this.ExchangeRate();
      }else if(this.companyCode== "38F0"){
        // this.exchangeRate = 24560.00;
        this.ExchangeRate();

      }
     
    }
    space(event:any){
      if(event.target.selectionStart === 0 && event.code === 'Space'){
        event.preventDefault();
      }
    }
    ExchangeRate(){
      this.loaderService.setShowLoading();
      this.http.get(`${environment.commonAPI}/ExchangeRate?fromCurrency=USD&toCurrency=${this.receivedData.currency}`).subscribe({
        next:(res:any)=>{
          if(res != null){       
          this.exchangeRate = res.exchangeRate;
          this.fromCurrency = res.fromCurrency
          this.toCurrency = res.toCurrency;
          this.loaderService.setDisableLoading();
          }else{
            this.loaderService.setDisableLoading();
            this.showErroMessage = true;
            this.errorMessage = `Unable to fetch the Exchange Rate please contact admin..!`;
          }
          
        },
        error: (e:any) => {
          this.loaderService.setDisableLoading();
          this.showErroMessage = true;
          this.errorMessage = `Unable to fetch the Exchange Rate please contact admin..!`;
        },
        complete: () => {
        }
      })
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
      const createAOP:any = {
        ...this.myForm.value
      }
      createAOP["cfCycleId"] = this.receivedData.id;
      createAOP["ExchangeRate"] = this.exchangeRate
      this.planningService.CreateAOP(createAOP)
      .subscribe({
          next: (response:any) => {
            if (
              response?.data?.startsWith('Error') ||
              response?.data?.startsWith(' Error')
            ) {
              this.loaderService.setDisableLoading();
              this.errorMessage = response.data;
              this.showErroMessage = true;
              return;
            }
            if (
              response.data === 'Record added successfully.' ||
              response.data === 'Record updated successfully.' ||
              response.data === 'Record added successfully' ||
              response.data === 'Success'
            ) {
              this.loaderService.setDisableLoading();
              this.isFromSubmitted.emit(true);
              this.showSnackbar("AOP Created Successfully");
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
    makeForm() {
      return this.formBuilder.group({
        Remark: ['',Validators.required],
        ValueIn: ['Thousand',Validators.required],
       
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
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

}
