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
@Component({
  selector: 'lib-create-bu-spocmaster',
  templateUrl: './create-bu-spocmaster.component.html',
  styleUrls: ['./create-bu-spocmaster.component.css'],
  providers: [DatePipe],
})
export class CreateBuSPOCMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private apiService: ApiCallService,
    private formBuilder: FormBuilder,
  ) {}

  title = 'Create Bu SPOC  Master Data';
  public routerdata: any;
  formValues: any;
  myForm!: FormGroup;

  // buspocId = "";
  // buName = "";
  // spocName = '';
  currentDate = new Date();
  nextDay = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);

  validityStart = new Date();
  validityEnd  = new Date();
  public approveStatus = [{
    value: "0",
    name: "Approve pending"
   },
   {
    value: "1",
    name: "Approved"
   },
   {
    value: "2",
    name: "Reject"} 
 ]
 
  saveFormEndpoint = `api/BuSpoc/CreateBuSpocMaster`;
  updateFormEndpoint = `api/BuSpoc/UpdateBuSpocMaster`;


  public id = 0;  
  public spocMail = '';
  public buList: any = [];

  
  public showloader = false;
  isCreate = true;
  errorMessage = '';

  ngOnInit(): void {
    this.getFilters();

    console.log('hello');
    this.activatedRoute.queryParams.subscribe((params) => {
      this.routerdata = params;
      if (this.routerdata.data) {
        this.apiService
          .get(
            `api/SectionSpocMaster/GetSectionSpocMasterById?sectionSpocId=${this.routerdata.data}`
          )
          .subscribe((res) => {
            console.log('res', res);
            this.formValues = res.result;
            this.setFormData();
          });
      }
    });

    console.log('ng Init data');
    console.log(this.routerdata);

    if (this.routerdata.hasOwnProperty('data')) {
      this.isCreate = false;
    }




    
    this.myForm = this.formBuilder.group({
      // rateId: ['Rate ID', Validators.required],
      buName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)],
      ],
      spocName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)],
      ],
      // businessUnit: ['', Validators.required],
      // locationMode: ['', Validators.required],
      // costDifference: [
      //   '',
      //   [Validators.required, Validators.pattern(/^\d+(\.\d{1,3})?$/)],
      // ],
      // currency: ['', Validators.required],
      validityStart: [this.currentDate, Validators.required],
      validityEnd: ['', Validators.required],
      approveStatus:['', Validators.required]

    });
    this.myForm.controls['validityStart'].valueChanges.subscribe((value) => {
      // Reset the validityEnd control's value and clear the error message
      console.log('value ', value);
      this.myForm.controls['validityEnd'].setValue(null);
      this.myForm.controls['validityEnd'].setErrors(null);

      // Update the minimum date for validityEnd control
      this.myForm.controls['validityEnd'].setValidators([
        Validators.required,
        Validators.min(value),
      ]);
      this.myForm.controls['validityEnd'].updateValueAndValidity();
    });
    // if(this.routerdata.hasOwnProperty("data"))
    // {
    //   this.isCreate = false;
    // }
    
    // if(this.routerdata.hasOwnProperty("data"))
    // {
    //   fetch(
    //     `${this.url}/api/BuHotMaster/GetBuHotMasterById?buhotId=${this.routerdata.data}`
    //   )
    //     .then(function (response) {
    //       return response.json();
    //     })
    //     .then((data) => {
    //       this.isCreate = false;
    //       if (data.success == false) {
    //         this.errorMessage = data.message;
    //       } else if (data.result != null) {
    //         this.title = 'Update BU Hot Master Data';

    //         console.log("path  data");
    //         console.log(data.result);

    //         this.buhotId = data.result.buhotId;
    //         this.buname = data.result.buname;
    //         this.hotName = data.result.hotName;
    //         // this.hotMail = data.result.hotEmail;
    //         this.validity_startDate = new Date(data.result.validityStart);
    //         this.validity_endDate = new Date(data.result.validityEnd);
    //         this.approveStatus =  data.result.approveStatus;
    //       }
    //     });
    // }
  }
  setFormData() {
    if (this.formValues) {
      this.myForm.get('buspocId')?.setValue(this.formValues?.buspocId);
      this.myForm.get('buName')?.setValue(this.formValues?.buName);
      this.myForm.get('spocName')?.setValue(this.formValues?.spocName);
      // this.myForm.get('rateId')?.setValue(this.formValues?.rateId);
      // this.myForm.get('companyCode')?.setValue(this.formValues?.companyCode);
      // this.myForm.get('businessUnit')?.setValue(this.formValues?.businessUnit);
      // this.myForm.get('locationMode')?.setValue(this.formValues?.locationMode);
      // this.myForm
      //   .get('costDifference')
      //   ?.setValue(this.formValues?.costDifference);
      // this.myForm.get('currency')?.setValue(this.formValues?.currency);
      this.myForm
        .get('validityStart')
        ?.setValue(this.formValues?.validityStart);
      this.myForm.get('validityEnd')?.setValue(this.formValues?.validityEnd);
      this.myForm.get('approveStatus')?.setValue(this.formValues?.approveStatus);
    }
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
  getValidityEndMinDate(): Date | null {
    const validityStartValue = this.myForm.controls['validityStart'].value;

    if (validityStartValue) {
      const minDate = new Date(validityStartValue);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    }

    return null;
  }
    // this.getFilters();
    // this.activatedRoute.queryParams.subscribe((params) => {
    //   this.routerdata = params;
    // });

    // // if (this.routerdata.data > 0) {
    // //   this.isCreate = false;
    // // }
    // if(this.routerdata.hasOwnProperty("data"))
    // {
    //   this.isCreate = false;
    // }
    

    // // this.getFilters();

    // if(this.routerdata.hasOwnProperty("data"))
    // {
    //   fetch(
    //     `${this.url}/api/BuSpoc/GetBuSpocMasterById?buspocId=${this.routerdata.data}`
    //   )
    //     .then(function (response) {
    //       return response.json();
    //     })
    //     .then((data) => {
    //       console.log('data received');
    //       console.log(data);

    //       this.isCreate = false;
    //       if (data.success == false) {
    //         this.errorMessage = data.message;
    //       } else if (data.result != null) {
    //         this.title = 'Update Bu SPOC  Master Data';
    //         console.log(data);

    //         // buspocId

    //         this.buspocId = data.result.buspocId;
    //         this.buName = data.result.buname;
    //         this.spocName = data.result.spocName;

    //         // this.spocMail = data.result.spocemail;
    //         this.validityStart = new Date(data.result.validityStart);
    //         this.validityEnd = new Date(data.result.validityEnd);
    //         this.approveStatus = data.result.approveStatus;

    //       }
    //     });
    // }
  

  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/BoschOHMaster/GetFilters`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          if (data.result.listBu != null) {
            this.buList = data.result.listBu;
          }
          this.showloader = false;
        }
      });
  }

  // saveBuSpoc() {
  //   this.showloader = true;
  //   this.errorMessage = '';

  //   if (this.buName == '' || this.spocName == '' ) {
  //     this.errorMessage = 'Please fill all mandatory (*) fields.';
  //     return false;
  //   }else if (this.validityStart >= this.validityEnd) {
  //     this.errorMessage =
  //       'Valid end date should be greater than valid start date';
  //     this.showloader = false;
  //     return false;
  //   } 
    
  //   else {
  //     var formdata = new FormData();

  //     const validityStart = this.datePipe.transform(
  //       this.validityStart,
  //       'dd-MM-yyyy'
  //     );
  //     const ValidityEnd = this.datePipe.transform(
  //       this.validityEnd,
  //       'dd-MM-yyyy'
  //     );

      // 'input',
      // "{BuName:'" +
      //   this.buName +
      //   "',Spocname:'" +
      //   this.spocName +
      //   "',Spocemail:'" +
      //   this.spocMail +
      //   "',ValidityStart:'" +
      //   validityStart +
      //   "',ValidityEnd:'" +
      //   ValidityEnd +
      //   "'}"

  //     console.log(this.getString());
  //     formdata.append('input', this.getString());

  //     var requestOptions: RequestInit = {
  //       method: 'POST',
  //       body: formdata,
  //       redirect: 'follow',
  //     };

  //     var url = this.url + '/api/BuSpoc/CreateBuSpocMaster';

  //     if (!this.isCreate) {
  //       url = this.url + '/api/BuSpoc/UpdateBuSpocMaster';
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
  //         } else {
  //           // alert(data.message);
  //           this.router.navigate(['/dashboard'], {
  //             queryParams: { routertitle: JSON.stringify('BU SPOC Master') },
  //           });
  //         }
  //       });

  //     return true;
  //   }
  // }
  submitFormData(endpoint: string) {
    if (this.myForm.valid) {
      console.log(this.myForm.value);
      this.myForm.value.buspocId = this.generateGUID();
      this.apiService.post(endpoint, this.myForm.value).subscribe((res) => {
        console.log(res);
      });
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('BU SPOC Master') },
    });
  }
  // getString(): string {
  //   const today = new Date();
  //   const formattedDate = today.toISOString().substring(0, 10);

  //   var ids = this.generateGUID();
  //   if (!this.isCreate) {
  //     ids = this.buspocId;
  //   }

  //   // buspocId

  //   // this.buspocId = data.result.buspocId;
  //   // this.buName = data.result.buname;
  //   // this.spocName = data.result.spocName;

  //   // // this.spocMail = data.result.spocemail;
  //   // this.validityStart = new Date(data.result.validityStart);
  //   // this.validityEnd = new Date(data.result.validityEnd);
  //   // this.approveStatus = data.result.approveStatus;



  //   const inputObject = {
  //     // ID: this.guidanceCostID,
      
  //     buspocId: ids,
  //     // buid: this.buName,
  //     spocName: this.spocName,
  //     buName : this.buName,

  //     // spocemail: this.spocMail,

  //     validityStart: this.datePipe.transform(this.validityStart, 'yyyy-MM-dd'),
  //     validityEnd: this.datePipe.transform(this.validityEnd, 'yyyy-MM-dd'),
  //     approveStatus: this.approveStatus,
      
  //     // IsActive: true,
  //   };

  //   console.log('dates');

  //   const serializedString = JSON.stringify(inputObject);
  //   console.log(serializedString);
  //   return serializedString;
  // }
  onSubmit() {
    if (this.routerdata.data) {
      this.submitFormData(this.updateFormEndpoint);
    } else {
      this.submitFormData(this.saveFormEndpoint);
    }
  }
  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

