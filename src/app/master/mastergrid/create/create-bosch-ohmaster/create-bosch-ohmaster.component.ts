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
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'lib-create-bosch-ohmaster',
  templateUrl: './create-bosch-ohmaster.component.html',
  styleUrls: ['./create-bosch-ohmaster.component.css'],
  providers: [DatePipe],
})
export class CreateBoschOHMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apiService: ApiCallService,
    private snackBar: MatSnackBar
  ) {}

  public routerdata: any;
  title = 'Create Bosch OH Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;
  formValues: any;
  myForm!: FormGroup;
  buNameList: string[] = [];
  startDate: any;
  endDate: any;

  locationModeList = [
    { id: 1, name: 'Bosch' },
    { id: 2, name: 'Competency Unit at Bosch' },
    { id: 3, name: 'Competency Unit at Partner' },
    { id: 4, name: 'Customer Location' },
  ];

  saveFormEndpoint = `api/BoschOHMaster/CreateBoschOHMaster`;
  updateFormEndpoint = `api/BoschOHMaster/UpdateBoschOHMaster`;

  currentDate = new Date();
  currencyList: string[] = ['USD', 'INR', 'VND', 'EUR'];

  public buList: any = [];

  ngOnInit(): void {
    (async () => {
      await this.getFilters();
    })();

    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
      if (this.routerdata.data) {
        this.title = 'Update Bosch OH Master Data';
        this.apiService
          .get(
            `api/BoschOhMaster/GetBoschOHMasterById?rateId=${this.routerdata.data}`
          )
          .subscribe((res) => {
            console.log('res', res);
            this.formValues = res.result;
            this.setFormData();
          });
      }
    });

    this.myForm = this.formBuilder.group({
      rateId: ['Rate Id', Validators.required],
      companyCode: [
        '42107A86-4928-4D9F-9143-B44814A59C0F',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\-]+$/)],
      ],
      businessUnitName: ['', Validators.required],
      locationModeName: ['', Validators.required],
      costDifference: [
        '',
        [Validators.required, Validators.pattern(/^\d+(\.\d{1,3})?$/)],
      ],
      companyCurrency: ['', Validators.required],
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
        // Validators.min(value),
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

  getFilters() {
    this.showloader = true;
    this.apiService.get('api/BoschOHMaster/GetFilters').subscribe((res) => {
      for (let list of res.result.listBu) {
        this.buList.push(list.buname);
      }
    });
  }

  onSubmit() {
    console.log('this.myForm.value', this.myForm.value);
    this.myForm.value.costDifference = parseFloat(
      this.myForm.value.costDifference
    );
    if (this.routerdata.data) {
      this.myForm.value.createdDate = this.formValues.createdDate;
      this.submitFormData(this.updateFormEndpoint);
    } else {
      this.myForm.value.rateId = undefined;
      this.submitFormData(this.saveFormEndpoint);
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
      this.myForm.value.costDifference = parseFloat(
        this.myForm.value.costDifference
      );
      this.apiService.post(endpoint, this.myForm.value).subscribe((res) => {
        console.log('form submitted ', res);
        if (res.success) {
          this.router.navigate(['/dashboard'], {
            queryParams: { routertitle: JSON.stringify('Bosch OH Master') },
          });
        }
        this.showSnackbar(res.message);
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Bosch OH Master') },
    });
  }

  setFormData() {
    if (this.formValues) {
      this.myForm.get('rateId')?.setValue(this.formValues?.rateId);
      this.myForm
        .get('companyCodeName')
        ?.setValue(this.formValues?.companyCodeName);
      this.myForm
        .get('businessUnitName')
        ?.setValue(this.formValues?.businessUnitName);
      console.log('this.formValues', this.formValues);
      this.myForm
        .get('locationModeName')
        ?.setValue(this.formValues?.locationModeName);
      this.myForm
        .get('costDifference')
        ?.setValue(this.formValues?.costDifference);
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
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 4000 });
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
}
