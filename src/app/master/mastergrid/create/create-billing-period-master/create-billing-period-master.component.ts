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



@Component({
  selector: 'lib-create-billing-period-master',
  templateUrl: './create-billing-period-master.component.html',
  styleUrls: ['./create-billing-period-master.component.css'],
  providers: [DatePipe],
})



export class CreateBillingPeriodMasterComponent implements OnInit {
  
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private apiService: ApiCallService
  ) {}




  public routerdata: any;
  title = 'Create Billing Period Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;
  formValues: any;
  myForm!: FormGroup;
  buNameList: string[] = [];
  

  saveFormEndpoint = `api/BillingPeriod/CreateBillingPeriod`;
  updateFormEndpoint = `api/BillingPeriod/UpdateBillingPeriod`;



  public billingPeriodId = '';
  public billingMonth = '';
  public companyCode = '1234';


  public validityStart = new Date();
  public validityEnd = new Date();
  public periodID = '';
  

  public periodStart = new Date();
  public periodEnd = new Date();
  public standardDays = '';
  
  public standardHours = '';
  public periodOwner = '';
  public approveStatus = "";

  public noOfStdWorkingDays: number = 0;
  public stdWorkingHour: GLfloat = 0.0;
  public billingPeriodOwner = '';  


  public id=0;
  
  // public showloader = false;
  // public errorMessage = '';
  // public isCreate = true;
  public isActive = true;
  public billingMonths: any = [];

  public currentYear = new Date().getFullYear();

  public months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];


  ngOnInit(): void {

    if (this.routerdata.data) {
      this.title = "Update Billing Period Master Data";
    }


    // (
    //   async () => {
    //   await this.getFilters();

    // })();


    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
      if (this.routerdata.data) {
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

    console.log('hello');
    this.generateBillingMonth();
    this.activatedRoute.queryParams.subscribe((params) => {
      // console.log(params); // { orderby: "price" }
      this.routerdata = params;
      //console.log(this.routerdata); // price
    });

    if(this.routerdata.hasOwnProperty("data"))
    {
      this.isCreate = false;
    }
    

    if(this.routerdata.hasOwnProperty("data"))
    {
      fetch(
        `${this.url}/api/BillingPeriod/GetBillingPeriodById?billingPeriodId=${this.routerdata.data}`
      )
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          this.isCreate = false;
          if (data.success == false) {
            this.errorMessage = data.message;
          } else if (data.result != null) {

            console.log(data.result);
            this.title = 'Update Billing Period Master Data';

            // this.id=data.result.id;
            this.billingPeriodId = data.result.billingPeriodId;
            this.billingMonth = this.months[Number(data.result.billingMonth)];
            this.validityEnd = new Date(data.result.validityEnd);
            this.validityStart = new Date(data.result.validityStart);

            // this.billingMonths.push(this.billingMonth);

            this.companyCode = data.result.companyCode;
            this.periodID = data.result.periodId;
            // this.noOfStdWorkingDays = data.result.noofStdWorkingDays;
            // this.stdWorkingHour = data.result.stdWorkingHour;
            // this.billingPeriodOwner = data.result.billingPeriodOwner;

            this.periodStart = new Date(data.result.periodStart);
            this.periodEnd = new Date(data.result.periodEnd);

            this.standardDays = data.result.standardDays;
            this.standardHours = data.result.standardHours;
            this.periodOwner = data.result.periodOwner;
            this.approveStatus = data.result.approveStatus;
            
          }
        });
    }
  }

  calculateStdHours() {
    this.stdWorkingHour = this.noOfStdWorkingDays * 8;
    console.log(this.stdWorkingHour);
  }
  
  generateBillingMonth() {
    var nextCalanderYear = this.currentYear + 1;
    var currentCalenderYear = this.currentYear;
    console.log(currentCalenderYear);
    console.log(nextCalanderYear);

    while (currentCalenderYear <= nextCalanderYear) {
      for (var i = 0; i < this.months.length; i++) {
        // this.billingMonths.push(this.months[i]+"-"+currentCalenderYear);
        var currentBillingPeriod = this.months[i] + '-' + currentCalenderYear;
        this.billingMonths.push(currentBillingPeriod);
       }
      currentCalenderYear++;
    }
  }

  setFormData() {
    if (this.formValues) {

      this.myForm.get('billingPeriodId')?.setValue(this.formValues?.billingPeriodId);
      this.myForm.get('billingMonth')?.setValue(this.formValues?.billingMonth);
      this.myForm.get('companyCode')?.setValue(this.formValues?.companyCode);
      
      this.myForm.get('periodStart')?.setValue(this.formValues?.periodStart);
      this.myForm.get('periodEnd')?.setValue(this.formValues?.periodEnd);
      this.myForm.get('periodID')?.setValue(this.formValues?.periodID);

      this.myForm.get('standardDays')?.setValue(this.formValues?.standardDays);
      this.myForm.get('standardHours')?.setValue(this.formValues?.standardDays);
      
      this.myForm.get('periodOwner')?.setValue(this.formValues?.standardDays);
      this.myForm.get('validityStart')?.setValue(this.formValues?.validityStart);
      this.myForm.get('validityEnd')?.setValue(this.formValues?.validityEnd);
      

      // this.myForm.get('locationMode')?.setValue(this.formValues?.locationMode);
      
      // this.myForm
      //   .get('costDifference')
      //   ?.setValue(this.formValues?.costDifference);
      // this.myForm.get('periodID')?.setValue(this.formValues?.periodID);

      
    }
  }


  onSubmit() {
    if (this.routerdata.data) {
      this.submitFormData(this.updateFormEndpoint);
    } else {
      this.submitFormData(this.saveFormEndpoint);
    }
  }

  submitFormData(endpoint: string) {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.myForm.value.rateId = this.generateGUID();
      this.apiService.post(endpoint, this.myForm.value).subscribe((res) => {
        console.log(res);
      });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
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


  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: {
        routertitle: JSON.stringify('Billing Period Master'),
      },
    });
  }

  // saveBillingPeriod() {
    
  //   this.showloader = true;
  //   this.errorMessage = '';

  //   if (this.companyCode == '' || this.billingMonth == '' || this.periodID  == '' || this.standardDays  == "" || this.standardHours == "" ||  this.periodOwner  == "" || this.approveStatus  == "" || this.billingPeriodOwner == "" ) {
  //     this.errorMessage = 'Please fill all mandatory (*) fields.';
  //     return false;
  //   } 
  //   else {

  //     var formdata = new FormData();
      
  //     //BillingPeriodId

  //     formdata.append(
  //       'input', this.getString()
  //     );
      

  //     var requestOptions: RequestInit = {
  //       method: 'POST',
  //       body: formdata,
  //       redirect: 'follow',
  //     };

  //     var url = this.url + '/api/BillingPeriod/CreateBillingPeriod';

  //     if (!this.isCreate) {
  //       url = this.url + '/api/BillingPeriod/UpdateBillingPeriod';
  //     }

  //     console.log(url);

  //     fetch(url, requestOptions)
  //       .then(function (response) {
  //         return response.json();
  //       })
  //       .then((data) => {
  //         console.log(data);
  //         this.showloader = false;

  //         if (data.success == false) {
  //           this.errorMessage = data.message;

  //           console.log(data.message);
  //         } else {
  //           this.router.navigate(['/dashboard'], {
  //             queryParams: {
  //               routertitle: JSON.stringify('Billing Period Master'),
  //             },
  //           });
  //         }
  //       });

  //     return true;
  //   }
  // }
  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // getFilters() {
  //   this.showloader = true;
  //   this.apiService.get('api/BoschOHMaster/GetFilters').subscribe((res) => {
  //     // this.buList = res.result.listBu;
  //     for (let list of res.result.listBu) {
  //       console.log('buname ', list);
  //       this.buList.push(list.buname);
  //     }
  //   });
  // }



  getString() {

    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);
    // console.log('before');

    // console.log(this.validityStart);
    // console.log(this.validityEnd);
    // var ids = 'bea8e72e-085a-4444-9f39-d2133c3ff8ce';

    var ids = this.generateGUID();
    
    if (!this.isCreate) {
      ids = this.billingPeriodId;
    }

    const inputObject = {


      billingPeriodId: ids,
      billingMonth: this.months.indexOf(this.billingMonth),
      companyCode: this.companyCode,

      validityStart: this.datePipe.transform(this.validityStart, 'yyyy-MM-dd'),
      validityEnd:  this.datePipe.transform(this.validityEnd, 'yyyy-MM-dd'),
      periodID: this.periodID,

      periodStart: this.datePipe.transform(this.periodStart, 'yyyy-MM-dd'),
      periodEnd:  this.datePipe.transform(this.periodEnd, 'yyyy-MM-dd'),

      standardDays: this.standardDays,
      standardHours: this.standardHours,
      periodOwner: this.periodOwner,
      approveStatus: this.approveStatus
      
    };
    const serializedString = JSON.stringify(inputObject);
    console.log(serializedString);
    return serializedString;
  }

}
