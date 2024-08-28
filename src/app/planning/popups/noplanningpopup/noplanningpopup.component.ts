import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlanningListService } from '../../services/planning-list.service';
import { PlaningService } from '../../services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-noplanningpopup',
  templateUrl: './noplanningpopup.component.html',
  styleUrls: ['./noplanningpopup.component.css']
})
export class NoplanningpopupComponent {
  myForm!: FormGroup;
  receivedData: any;
  fileData!: string;
  EventFile: any;
  base64Output: any;
  File:any=[];
  FileRowdata:any;
  PlanId :any;
  companyCode:any;
  CfCycle :any;
  planningyear :any;
  remarks:any;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(public dialogRef: MatDialogRef<NoplanningpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any,
    private formBuilder: FormBuilder,
    private planningService : PlaningService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,) { }

  ngOnInit(): void {
    this.receivedData =this.data.message;
    this.companyCode = this.receivedData.companyCode ;
    this.CfCycle = this.receivedData.CfCycleName;
    this.planningyear = this.receivedData.cfCycleYear;
    this.PlanId = `AOP_${this.companyCode}_${this.planningyear}`;
    this.myForm = this.makeForm();

  }
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  onSubmit() {
     this.loaderService.setShowLoading();
    const noPlanning : any ={
      ...this.myForm.value
    }
    noPlanning["id"] = this.receivedData.id;
    noPlanning["status"]= 'No Planning';
      this.planningService.UpdateCfCycle(noPlanning)
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
            response.data === 'Success'
          ) {
            this.loaderService.setDisableLoading();
            this.isFromSubmitted.emit(true);
            this.showSnackbar("No Planning");
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
    })
  }
  onremarks(event :any){
    
    this.remarks = event.target.value
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

}
