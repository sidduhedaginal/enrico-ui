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
  selector: 'lib-create-plant-master',
  templateUrl: './create-plant-master.component.html',
  styleUrls: ['./create-plant-master.component.css'],
  providers: [DatePipe],
})
export class CreatePlantMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private apiService: ApiCallService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  title = 'Create  Plant Master Data';
  public routerdata: any;

  public isCreate = true;
  formValues: any;
  myForm!: FormGroup;
  createFormEndpoint = `api/TargetSavingsMaster/CreateTargetSavingMaster`;
  updateFormEndpoint = `api/TargetSavingsMaster/UpdateTargetSavingMaster`;
  startDate: any;
  endDate: any;

  currentDate = new Date();

  public companyCode = '6520';
  public companyCurrency = 'INR';
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
        this.title = 'Create  Plant Master Data';
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
      plant_code: ['plant code', Validators.required],
      companyCode: [
        '42107A86-4928-4D9F-9143-B44814A59C0F',
        [Validators.required, Validators.pattern(/^[A-Za-z0-9\-]+$/)], ],
        name: ['', Validators.required],
        street: ['', Validators.required,Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/)],
        city: ['', Validators.required ,Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/)],
        state: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/)],
        region: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/)],
        country: ['', Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+(?:\s+[a-zA-Z0-9_-]+)*$/)],
        postalcode: ['', Validators.required, Validators.pattern(/^[0-9]+$/)],
        currency: ['', Validators.required],
    });

  }



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
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.apiService.post(endpoint, this.myForm.value).subscribe((res) => {
        console.log('form submitted ', res);
        if (res.success) {
          this.router.navigate(['/dashboard'], {
            queryParams: {
              routertitle: JSON.stringify('Plant Master'),
            },
          });
        }
        this.showSnackbar(res.message);
      });
    }
  }

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Plant Master') },
    });
  }

  setFormData() {
    if (this.formValues) {
      this.myForm
        .get('plant_code')
        ?.setValue(this.formValues?.plant_code);
        this.myForm.get('name')?.setValue(this.formValues?.name);
      this.myForm.get('companyCode')?.setValue(this.formValues?.companyCode);
      this.myForm.get('street')?.setValue(this.formValues?.street);
      this.myForm.get('city')?.setValue(this.formValues?.city);
      this.myForm.get('state')?.setValue(this.formValues?.state);
      this.myForm.get('region')?.setValue(this.formValues?.region);
      this.myForm.get('country')?.setValue(this.formValues?.country);
      this.myForm.get('postalcode')?.setValue(this.formValues?.postalcode);
      this.myForm.get('currency')?.setValue(this.formValues?.currency);

 
    }
  }
  numberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
