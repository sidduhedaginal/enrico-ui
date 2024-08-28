import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

import { ApiCallService } from '../../../services/api-call.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'lib-create-bu-hot',
  templateUrl: './create-bu-hot.component.html',
  styleUrls: ['./create-bu-hot.component.css'],
  providers: [DatePipe],
})
export class CreateBuHOTComponent implements OnInit {
  public vrcmform!: FormGroup;
  constructor(
    private fb: FormBuilder,
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private apiService: ApiCallService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  title = 'Create BU  Hot Master Data';
  formValues: any;
  public routerdata: any;
  myForm!: FormGroup;
  startDate: any;
  endDate: any;
  // public buhotId = "";
  // public buname = "";
  // public hotName = "";

  public validity_startDate = new Date();
  public validity_endDate = new Date();
  // public approveStatus =  "";

  currentDate = new Date();
  nextDay = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);

  public id = 0;
  // public buName = '';
  // public hotName = '';
  public hotMail = '';

  public buid = 0;
  saveFormEndpoint = `api/BuHotMaster/CreateBuHotMaster`;
  updateFormEndpoint = `api/BuHotMaster/UpdateBuHotMaster`;

  public showloader = false;
  isCreate = true;
  errorMessage = '';

  public buList: any = [];
  public approveStatus = [
    {
      value: 0,
      name: 'Approve pending',
    },
    {
      value: 1,
      name: 'Approved',
    },
    {
      value: 2,
      name: 'Reject',
    },
  ];

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
      if (this.routerdata.data) {
        this.title = 'Update BU  Hot Master Data';
        this.apiService
          .get(
            `api/BuHotMaster/GetBuHotMasterById?buhotId=${this.routerdata.data}`
          )
          .subscribe((res) => {
            this.formValues = res.result;
            this.setFormData();
          });
      }
    });

    ('ng Init data');
    (this.routerdata);

    if (this.routerdata.hasOwnProperty('data')) {
      this.isCreate = false;
    }

    this.myForm = this.formBuilder.group({
      buhotId: ['Bu Hot Id', Validators.required,Validators.pattern(/^[A-Za-z0-9\-]+$/)],
      buname: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/)]],
      hotName: [
        '',
        [Validators.required,Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/) ],
      ],
      validityStart: [this.currentDate, Validators.required],
      validityEnd: ['', Validators.required],
      approveStatus: ['', Validators.required],
    });
    this.myForm.controls['validityStart'].valueChanges.subscribe((value) => {
      // Reset the validityEnd control's value and clear the error message
      if (
        this.myForm.controls?.['validityStart'].value >
          this.myForm.controls?.['validityEnd'].value ||
        new Date(
          this.myForm.controls?.['validityStart'].value
        ).toISOString() ===
          new Date(this.myForm.controls?.['validityEnd'].value).toISOString()
      ) {
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
  setFormData() {
    if (this.formValues) {
      this.myForm.get('buhotId')?.setValue(this.formValues?.buhotId);
      this.myForm.get('buname')?.setValue(this.formValues?.buname);
      this.myForm.get('hotName')?.setValue(this.formValues?.hotName);

      this.myForm
        .get('validityStart')
        ?.setValue(this.formValues?.validityStart);
      this.myForm.get('validityEnd')?.setValue(this.formValues?.validityEnd);
      this.myForm
        .get('approveStatus')
        ?.setValue(this.formValues?.approveStatus);
    }
  }
  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('BU HOT') },
    });
  }

  onSubmit() {
    if (this.routerdata.data) {
      this.myForm.value.createdDate = this.formValues.createdDate;
      this.submitFormData(this.updateFormEndpoint);
    } else {
      this.myForm.value.buhotId = this.generateGUID();
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
      (this.myForm.value);
      this.apiService.post(endpoint, this.myForm.value).subscribe((res) => {
        if (res.success) {
          this.router.navigate(['/dashboard'], {
            queryParams: { routertitle: JSON.stringify('BU HOT') },
          });
        }
        this.showSnackbar(res.message);
      });
    }
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
    if (time === 'startTime') {
      this.startDate = formattedDate;
    } else {
      this.endDate = formattedDate;
    }
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 4000 });
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
