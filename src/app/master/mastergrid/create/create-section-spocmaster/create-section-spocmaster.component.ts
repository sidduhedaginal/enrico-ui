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
  selector: 'lib-create-section-spocmaster',
  templateUrl: './create-section-spocmaster.component.html',
  styleUrls: ['./create-section-spocmaster.component.css'],
  providers: [DatePipe],
})


export class CreateSectionSPOCMasterComponent implements OnInit {
  constructor(
    @Inject('MASTER_API_URL') private url: string,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private apiService: ApiCallService
  ) {}


  public routerdata: any;
  title = 'Create  Section SPOC Master Data';

  public showloader = false;
  public errorMessage = '';
  public isCreate = true;

  formValues: any;
  myForm!: FormGroup;
  buNameList: string[] = [];


  saveFormEndpoint =  `/api/SectionSpocMaster/CreateSectionSpocMaster`;
  updateFormEndpoint = `/api/SectionSpocMaster/UpdateSectionSpocMaster`;


  currentDate = new Date();
  nextDay = new Date(this.currentDate.getTime() + 24 * 60 * 60 * 1000);
  currencyList: string[] = ['USD', 'INR', 'VND', 'EUR'];



  // public sectionSpocId = "";
  // public sectionName = '';
  // public spocName = '';


  // public validity_startDate = new Date();
  // public validity_endDate = new Date();
  // public approveStatus = "";

 
  
  // public spocMail = '';
  // public id = 0;
  

  
  public sectionSpocMaster: any = [];

  ngOnInit(): void {
    
    (
      async () => {
      await this.getFilters();

    })();
  
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


    this.myForm = this.formBuilder.group({

      sectionSpocId: ['Section SPOC ID', Validators.required],
      // companyCode: [
      //   '1234',
      //   [Validators.required, Validators.pattern(/^[A-Za-z0-9]+$/)],
      // ],
      sectionName: ['', Validators.required],
      spocName: ['', Validators.required],
      // costDifference: [
      //   '',
      //   [Validators.required, Validators.pattern(/^\d+(\.\d{1,3})?$/)],
      // ],
      // currency: ['', Validators.required],
      validityStart: [this.currentDate, Validators.required],
      validityEnd: ['', Validators.required],


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

    




   

  //   if(this.routerdata.hasOwnProperty("data"))
  //   {
  //     fetch(
  //       `${this.url}/api/SectionSpocMaster/GetSectionSpocMasterById?sectionSpocId=${this.routerdata.data}`
  //     )
  //       .then(function (response) {
  //         return response.json();
  //       })
  //       .then((data) => {
  //         this.isCreate = false;
  //         if (data.success == false) {
  //           this.errorMessage = data.message;
  //         } else if (data.result != null) {

  //           this.title = 'Update Section SPOC Master Data';
  //           console.log("path data ");
  //           console.log(data);

  //           this.sectionSpocId = data.result.sectionSpocId;
  //           this.sectionName = data.result.sectionName;
  //           this.spocName = data.result.spocName;
  //           // this.spocMail = data.result.spocemail;
  //           this.validity_startDate = new Date(data.result.validityStart);
  //           this.validity_endDate = new Date(data.result.validityEnd);
  //           this.approveStatus = data.result.approveStatus;
  //         }
  //       });
  //   }
  // }


  getFilters() {
    this.showloader = true;

    fetch(`${this.url}/api/SectionSpocMaster/GetSectionSpocFilters`)
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        if (data.success == false) {
          this.errorMessage = data.message;
        } else if (data.result != null) {
          if (data.result.listSections != null) {
            this.sectionSpocMaster = data.result.listSections;
          }
          this.showloader = false;
        }
      });
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

  cancel() {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('Section SPOC Master') },
    });
  }



  setFormData() {

    if (this.formValues) {

      this.myForm.get('sectionSpocId')?.setValue(this.formValues?.sectionSpocId);
      this.myForm.get('sectionName')?.setValue(this.formValues?.sectionName);
      this.myForm.get('spocName')?.setValue(this.formValues?.spocName);

      this.myForm
        .get('validityStart')
        ?.setValue(this.formValues?.validityStart);
      this.myForm.get('validityEnd')?.setValue(this.formValues?.validityEnd);
    
    }
  }



  // saveSectionSpocMaster() {
  //   this.showloader = true;
  //   this.errorMessage = '';

  //   // console.log(this.sectionName  + "," + this.spocName + "," + this.approveStatus);

  //   if (this.sectionName === '' || this.spocName === '') {
    
  //   // if(false)
  //   // {
  //     this.errorMessage = 'Please fill all mandatory (*) fields.';
  //     return false;
    
  //   }

  //   else if (this.validity_startDate >= this.validity_endDate) {
  //     this.errorMessage =
  //       'Valid end date should be greater than valid start date';
  //     this.showloader = false;
  //     return false;
  //   }

  //   else {
  //     var formdata = new FormData();

  //     formdata.append('input', this.getString());

  //     var requestOptions: RequestInit = {
  //       method: 'POST',
  //       body: formdata,
  //       redirect: 'follow',
  //     };

  //     var url = this.url + '/api/SectionSpocMaster/CreateSectionSpocMaster';

  //     if (!this.isCreate) {
  //       console.log('updated called');
  //       url = this.url + '/api/SectionSpocMaster/UpdateSectionSpocMaster';
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
  //           // alert(data.message);

  //           this.router.navigate(['/dashboard'], {
  //             queryParams: {
  //               routertitle: JSON.stringify('Section SPOC Master'),
  //             },
  //           });
  //         }
  //       });

  //     return true;
  //   }
  // }

  // getString(): string {

  //   const today = new Date();
  //   const formattedDate = today.toISOString().substring(0, 10);
  //   console.log('before');

    
  //   // var ids = 'bea8e72e-085a-4444-9f39-d2133c3ff8ce';
  //   var ids = this.generateGUID();
    
    
  //   if (!this.isCreate) {
  //     ids = this.sectionSpocId;
  //   }


  // // public sectionSpocId = "";
  // // public sectionName = '';
  // // public spocName = '';


  // // public validity_startDate = new Date();
  // // public validity_endDate = new Date();

  //   const inputObject = {

  //     sectionSpocId: ids,
  //     sectionName: this.sectionName,
  //     spocName: this.spocName,
  //     // spocemail: this.spocMail,
  //     validityStart: this.datePipe.transform(
  //       this.validity_startDate,
  //       'yyyy-MM-dd'
  //     ),
  //     validityEnd: this.datePipe.transform(this.validity_endDate, 'yyyy-MM-dd'),
  //   };

  //   console.log('created objects');

  //   const serializedString = JSON.stringify(inputObject);
  //   console.log(serializedString);
  //   return serializedString;
  // }









  generateGUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

}
