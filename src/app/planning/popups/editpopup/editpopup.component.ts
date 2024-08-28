import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaningService } from '../../services/planing.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}
const MY_DATE_FORMAT = {
  // parse: {
  //   dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  // },
  // display: {
  //   dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
  //   monthYearLabel: 'MMMM YYYY',
  //   dateA11yLabel: 'LL',
  //   monthYearA11yLabel: 'MMMM YYYY',
  // },
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'L',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-editpopup',
  templateUrl: './editpopup.component.html',
  styleUrls: ['./editpopup.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE,MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE]},
 
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})

export class EditpopupComponent {
  receivedData: any;
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  myForm!: FormGroup;
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor(public dialogRef: MatDialogRef<EditpopupComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar:MatSnackBar,
    private planningservice : PlaningService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
     }

  ngOnInit(): void {
    this.receivedData = this.data.message;
    this.myForm = this.makeForm();
    this.myForm.get('startDate')?.disable();
    
  }
  makeForm() {
    return this.formBuilder.group({
      startDate: [this.receivedData.defaultStartDate,Validators.required],
      cfCyclePlanningEndate: [this.receivedData.defaultEndDate,Validators.required],
     
    })
  }

  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }

  onSave() {
     this.loaderService.setShowLoading();
    const updateaop:any = {
      ...this.myForm.value
    } 
    updateaop["changeDate"] = true ;
    updateaop["id"] = this.receivedData.id;
    updateaop["status"]=this.receivedData.status;
    updateaop["Remark"] = "Update End Date";
    const formPayload = this.formatValues(updateaop);
    this.planningservice.AOPEditEndDate(formPayload)
    .subscribe({
      next: (response:any) => {
        if (
          response?.status.startsWith('Error') ||
          response?.status.startsWith('failed')
         
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = response.status;
          this.showErroMessage = true;
          return;
        }
        if (
          response.status === 'AOP end date updated successfully.'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(response.status);
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

  formatValues(formValues: any) { 
    const selectedDate = new Date(formValues.cfCyclePlanningEndate);
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
    const adjustedDate = new Date(
    selectedDate.getTime() - timezoneOffset
    );          
    const formattedDate = adjustedDate.toISOString();
    formValues.cfCyclePlanningEndate = formattedDate || null;
    return formValues;
  }


  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

}
