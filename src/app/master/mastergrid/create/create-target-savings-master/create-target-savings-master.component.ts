import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ApiCallService } from '../../../services/api-call.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'lib-create-target-savings-master',
  templateUrl: './create-target-savings-master.component.html',
  styleUrls: ['./create-target-savings-master.component.css'],
  providers: [DatePipe],
})
export class CreateTargetSavingsMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private apiService: ApiCallService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  title = 'Create  Target Savings Master Data';
  public routerdata: any;

  public isCreate = true;
  formValues: any;
  myForm!: FormGroup;
  createFormEndpoint = `api/TargetSavingsMaster/CreateTargetSavingMaster`;
  updateFormEndpoint = `api/TargetSavingsMaster/UpdateTargetSavingMaster`;
  startDate: any;
  endDate: any;

  currentDate = new Date();

  public targetSavingId = '';
  public companyCode = '6520';
  public companyCurrency = 'INR';

  public companyCodeGuid = '1234';
  public targetSavingValue = '';
  public validity_startDate = new Date();
  public validity_endDate = new Date();
  public showloader = false;
  public errorMessage = '';

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      console.log(params); // { orderby: "price" }
      this.routerdata = params;
      console.log('path data');
      console.log(this.routerdata); // price
    });

    if (this.routerdata.hasOwnProperty('data')) {
      this.isCreate = false;
    }

    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
      if (this.routerdata.data) {
        this.title = 'Update Target Savings Master Data';
        this.apiService
          .get(
            `api/TargetSavingsMaster/GetTargetSavingsMasterById?targetSavingRateId=${this.routerdata.data}`
          )
          .subscribe((res) => {
            console.log('res', res);
            this.formValues = res.result;
            this.setFormData();
          });
      }
    });

    this.myForm = this.formBuilder.group({
      targetSavingId: ['Target Saving Id', Validators.required],
      companyCode: [
        '42107A86-4928-4D9F-9143-B44814A59C0F',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\-]+$/)],
      ],
      targetSavingValue: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,3})?$/)],
      ],
      companyCurrency: [this.companyCurrency, Validators.required],
      validityStart: [this.currentDate, Validators.required],
      validityEnd: ['', Validators.required],
    });

    this.myForm.controls['validityStart'].valueChanges.subscribe((value) => {
      // Reset the validityEnd control's value and clear the error message
      console.log('value ', value);
      if(
        this.myForm.controls?.['validityStart'].value>
        this.myForm.controls?.['validityEnd'].value||
        new Date(this.myForm.controls?.['validityStart'].value
        ).toISOString()===
        new Date(this.myForm.controls?.['validityEnd'].value).toISOString()
        ){
        this.myForm.controls['validityEnd'].setValue(null);
        this.myForm.controls['validityEnd'].setErrors(null);
         }


      // Update the minimum date for validityEnd control
      this.myForm.controls['validityEnd'].setValidators([
        Validators.required,
        Validators.min(value),
      ]);
      this.myForm.controls['validityEnd'].updateValueAndValidity();
    });
  }

  validateDates = (): ValidatorFn => {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const validityStart = control.get('validityStart')?.value;
      const validityEnd = control.get('validityEnd')?.value;

      if (validityStart && validityEnd && validityEnd < validityStart) {
        return { dateRangeInvalid: true };
      }

      return null;
    };
  };

  onSubmit() {
    console.log('this.myForm.value', this.myForm.value);
    this.myForm.value.targetSavingValue = parseFloat(
      this.myForm.value.targetSavingValue
    );
    if (this.routerdata.data) {
      this.myForm.value.createdDate = this.formValues.createdDate;
      this.myForm.value.targetSavingId = this.formValues.targetSavingId;

      this.submitFormData(this.updateFormEndpoint);
    } else {
      this.myForm.value.targetSavingId = this.generateGUID();
      this.submitFormData(this.createFormEndpoint);
    }
  }

  submitFormData(endpoint: string) {
    if (this.startDate) {
      this.myForm.value.validityStart = this.startDate;
    } else {
      this.logStartDate(this.myForm.value.validityStart);
      this.myForm.value.validityStart = this.startDate;
    }
    if (!this.endDate && this.myForm.controls?.['validityEnd'].value) {
      this.myForm.value.validityEnd = this.formValues?.validityEnd;
    } else {
      this.myForm.value.validityEnd = this.endDate;
    }
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.apiService.post(endpoint, this.myForm.value).subscribe((res) => {
        console.log('form submitted ', res);
        if (res.success) {
          this.router.navigate(['/dashboard'], {
            queryParams: {
              routertitle: JSON.stringify('Target Savings Master'),
            },
          });
        }
        this.showSnackbar(res.message);
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Target Savings Master') },
    });
  }

  setFormData() {
    if (this.formValues) {
      this.myForm
        .get('targetSavingId')
        ?.setValue(this.formValues?.targetSavingId);
      this.myForm.get('companyCode')?.setValue(this.formValues?.companyCode);
      this.myForm
        .get('targetSavingValue')
        ?.setValue(this.formValues?.targetSavingValue);
      this.myForm
        .get('companyCurrency')
        ?.setValue(this.formValues?.companyCurrency);
      this.myForm
        .get('validityStart')
        ?.setValue(new Date(this.formValues?.validityStart));
      this.myForm
        .get('validityEnd')
        ?.setValue(new Date(this.formValues?.validityEnd));
    }
  }

  limitDecimalPlaces(event: KeyboardEvent, decimalPlaces: number) {
    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;
    const decimalIndex = currentValue.indexOf('.');

    if (
      decimalIndex !== -1 &&
      inputElement.selectionStart !== null &&
      inputElement.selectionStart > decimalIndex &&
      currentValue.length - decimalIndex > decimalPlaces
    ) {
      event.preventDefault();
    }
  }

  getValidityEndMinDate(): Date | null {
    const validityStartValue = this.myForm.controls['validityStart'].value;

    if (validityStartValue) {
      const minDate = new Date(validityStartValue);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    }

    return null;
  }

  logStartDate(event: any) {
    if (this.myForm.controls?.['validityStart'].value && !this.startDate) {
      this.formatDate(this.myForm.controls?.['validityStart'].value);
      return;
    }
    if (this.formValues?.validityStart === this.startDate) {
      return;
    }
    this.formatDate(event.value);
  }

  logEndDate(event: any) {
    if (this.myForm.controls?.['validityEnd'].value && !this.endDate) {
      this.formatDate(this.myForm.controls?.['validityEnd'].value, 'endTime');
      return;
    }
    if (this.formValues?.validityEnd === this.endDate) {
      return;
    }
    this.formatDate(event.value, 'endTime');
  }

  formatDate(value: any, time: string = 'startTime') {
    const selectedDate = new Date(value);
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
    const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset);
    const formattedDate = adjustedDate.toISOString();
    console.log('Selected Date:', formattedDate);
    if (time === 'startTime') {
      this.startDate = formattedDate;
    } else {
      this.endDate = formattedDate;
    }
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 4000 });
  }

  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}
