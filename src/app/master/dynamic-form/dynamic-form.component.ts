import {Component,EventEmitter,Inject,OnInit,Output,ViewChild,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCallService } from '../services/api-call.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelect } from '@angular/material/select';
import {uiJsonForCheckBox ,dropdownParsingList} from "../constants/app-constant";
import { HomeService } from 'src/app/services/home.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { LoaderService } from  '../../../app/services/loader.service';
import { DatePipe } from '@angular/common';
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
  selector: 'lib-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss'],
 // providers:[DatePipe],

  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    DatePipe,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE,MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE]},

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class DynamicFormComponent implements OnInit {
  // this is the main form contains all the items. both(textbox, dropdown) and (checkbox and radio button)
  dynamicForm: FormGroup = new FormGroup({});
  // this contains text box and dropdown mainly
  dynamicMatForm!: FormGroup;
  // this contains radio button and checkbox mainly
  dynamicRadioCheckboxForm!: FormGroup;
  // This will hold the API response with form field details for (textbox and dropdown)
  formFields!: any[];
  // This will hold the API response with form field details for(radio button and checkbox)
  radioCheckboxformFields!: any[];
  // data to prefill the form comming from the grid
  payload: any;
  //  all items in forms comming from the api  (formFields + radioCheckboxformFields)
  uiJson: any;
  //  there is unique number for each of the master and named as menuId
  menuId!: number;
  // all the Ending dates
  minStartValidityEndDate: any;
  minStartPeriodEndDate: any;
  minStartCFCyclePlanningDate: any;
  minStartValidToDate: any;
  // maxDateofLeavingDate : any;
  minDateOfJoiningStartValue: any;
  // for DocumentDate
  maxStartValidityEndDate: any;
  showErroMessage: boolean = false;
  errorMessage: string = '';
  operation!: string;
  showLoading: boolean = false;
  viewMode: boolean = false;
  editMode: boolean = false;
  isStatusApproved: boolean = false;
  searchEmploye: string = '';
  Employlist: any = [];
  EmploylistEdit: any = [];
  companyID : any;
  BussinessArealist : any= [];
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }
  @ViewChild('mySelect') mySelect: any;
  @ViewChild('dropdownAnchor', { static: false }) dropdownAnchor: MatSelect;
  startDates = ['ValidityStart'];
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  @Output() vendorContacts = new EventEmitter<any>();
  userProfileDetails: userProfileDetails | any;
  featureDetails: any;
  permissionDetails: any;
  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiCallService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DynamicFormComponent>,
    private homeService: HomeService,
    private loaderService : LoaderService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.checkUserProfileValueValid();
    if(data.operation == "create"){
      const SearchFilterList =  data.uiJson.filter((a:any)=> a.validationType == "dropdownWithSearch");
      for(let filter of SearchFilterList ){
        this.getEmployList(filter.name)
      }
      // if(data.menuId == 35){
      //   for(let b of data.uiJson){
      //     if(b.name == "BillingCompleted" || b.name == "BillingYetToStart"){
      //       b.isVisible = false;
      //     }
      //   }
      // }
    }
    if(data.operation == "update"){
      if(data.menuId == 36 || data.menuId == 37 || data.menuId == 38 || data.menuId == 40 || data.menuId == 34 || data.menuId == 33
        || data.menuId == 35 || data.menuId == 8 || data.menuId == 7 || data.menuId == 60){
        if(data.payload.ApproveStatus.toLowerCase() == "rejected"){
          for(let a of data.uiJson){
            if(a.name == "SpocName" || a.name == "HotName" || a.name == "Grade0" || a.name == "Grade1" || a.name == "Grade2" || a.name == "Grade3" || a.name == "Grade4"){
              a.readOnly = false;
            }
            if(a.name == "GbCode" || a.name == "ValidityStart" || a.name == "BusinessUnit" || a.name == "PeriodId"){
              a.readOnly = true;
            }
          }
        }else if(data.payload.ApproveStatus.toLowerCase() == "approved"){
          for(let a of data.uiJson){

            if(a.name == "SpocName" || a.name == "HotName" || a.name == "GbCode" || a.name == "TargetSaving"
              || a.name == "ValidityStart" || a.name == "BusinessUnit" || a.name == "CostDifference" || a.name == "PeriodId"
              || a.name == "Grade0" || a.name == "Grade1" || a.name == "Grade2" || a.name == "Grade3" || a.name == "Grade4"
            ){
                a.readOnly = true;
            }
          }
        }
      }
    }
    this.uiJson = data.uiJson;
    this.modifyUiJson();
    this.payload = data.payload;
    this.menuId = data.menuId;
    this.operation = data.operation;
    this.viewMode = data.viewMode;
    this.showErroMessage = false;
    this.errorMessage = '';
    if (this.payload?.ApproveStatus === 'Submitted')
      this.isStatusApproved = true;
    if (this.viewMode) {
      this.formFields = this.uiJson
        .filter(
          (field: any) =>
            field.validationType !== 'radioButton' &&
            field.validationType !== 'checkbox'
        )
        .map((field: any) => ({
          ...field,
          readOnly: true,
        }));
      this.radioCheckboxformFields = this.uiJson
        .filter(
          (field: any) =>
            field.validationType === 'radioButton' &&
            field.validationType === 'checkbox'
        )
        .map((field: any) => ({
          ...field,
          readOnly: true,
        }));
    }
    if (this.operation === 'create') {
      this.formFields = this.uiJson
        .filter(
          (field: any) =>
            field.validationType !== 'radioButton' &&
            field.validationType !== 'checkbox'
        )
        .map((field: any) => ({
          ...field,
          readOnly: false,
        }));

      this.radioCheckboxformFields = this.uiJson
        .filter(
          (field: any) =>
            field.validationType === 'radioButton' ||
            field.validationType === 'checkbox'
        )
        .map((field: any) => ({
          ...field,
          value: false,
        }));
    } else {
      this.formFields = this.uiJson.filter(
        (field: any) =>
          field.validationType !== 'radioButton' &&
          field.validationType !== 'checkbox'
      );
      this.radioCheckboxformFields = this.uiJson.filter(
        (field: any) =>
          field.validationType === 'radioButton' ||
          field.validationType === 'checkbox'
      );
    }
  }
  modifyUiJson() {
    this.uiJson.forEach((field: any) => {
      if (field.name === 'CfCyclePlanningEndate')
        field.name = 'CFCyclePlanningEndate';
      if (field.name === 'CfCyclePlanningStartDate')
        field.name = 'CFCyclePlanningStartDate';
      if (field.name === 'ConversionHour') field.validationType = 'decimal';
      if (dropdownParsingList.includes(field.name)) {
        if (field.dropdownList != null) {
          for (let index = 0; index < field.dropdownList.length; index++) {
            field.dropdownList[index].id = Number(field.dropdownList[index].id);
          }
        }
      }
    });
  }
  ngOnInit() {
     this.dynamicMatForm = this.formBuilder.group({});
    this.initializeFormFields();
    if (this.radioCheckboxformFields.length > 0) {
      this.dynamicRadioCheckboxForm = this.formBuilder.group({});
      this.initializeCheckboxFormFields();
      this.dynamicForm = this.formBuilder.group({
        dynamicMatForm: this.dynamicMatForm,
        dynamicRadioCheckboxForm: this.dynamicRadioCheckboxForm,
      });
    } else {
      this.dynamicForm = this.formBuilder.group({
        dynamicMatForm: this.dynamicMatForm,
      });
    }
    this.uiJson.forEach((field: any) => {
      if (
        field.validationType === 'dropdown' &&
        field.readOnly == true &&
        this.operation == 'update'
      ) {
        this.dynamicMatForm.get(field.name)?.disable();
      }
      if (
        field.validationType === 'date' &&
        field.readOnly == true &&
        this.operation == 'update'
      ) {
        this.dynamicMatForm.get(field.name)?.disable();
      }
    });
    if (this.dynamicMatForm.controls['CFCyclePlanningStartDate']) {
      this.dynamicMatForm.controls[
        'CFCyclePlanningStartDate'
      ].valueChanges.subscribe((value) => {
        const cfCyclePlanningStartValue =
          this.dynamicMatForm.controls['CFCyclePlanningStartDate'].value;
          this.dynamicMatForm.controls['CFCyclePlanningStartDate'].value;

        this.dynamicMatForm.controls['CFCyclePlanningStartDate'].value;

        const minDate = new Date(cfCyclePlanningStartValue);
        this.minStartCFCyclePlanningDate = minDate.setDate(
          minDate.getDate() + 1
        );
        this.minStartCFCyclePlanningDate = new Date(
          this.minStartCFCyclePlanningDate
        );
        this.setMinStartCFCyclePlanningDate();
        if (
          this.dynamicMatForm.controls?.['CFCyclePlanningStartDate'].value >
            this.dynamicMatForm.controls?.['CFCyclePlanningEndate'].value ||
          new Date(
            this.dynamicMatForm.controls?.['CFCyclePlanningStartDate'].value
          ).toISOString() ===
            new Date(
              this.dynamicMatForm.controls?.['CFCyclePlanningEndate'].value
            ).toISOString()
        ) {
          this.dynamicMatForm.controls['CFCyclePlanningEndate'].setValue(null);
          this.dynamicMatForm.controls['CFCyclePlanningEndate'].setErrors(null);
          this.dynamicMatForm.controls[
            'CFCyclePlanningEndate'
          ].markAllAsTouched();
        }
        this.dynamicMatForm.controls[
          'CFCyclePlanningEndate'
        ].updateValueAndValidity();
      });
    }
    if (this.dynamicMatForm.controls?.['ValidFrom']) {
      this.dynamicMatForm.controls['ValidFrom'].valueChanges.subscribe(
        (value) => {
          const cfCyclePlanningStartValue =
            this.dynamicMatForm.controls['ValidFrom'].value;
          const minDate = new Date(cfCyclePlanningStartValue);
          this.minStartValidToDate = minDate.setDate(minDate.getDate() + 1);
          this.minStartValidToDate = new Date(this.minStartValidToDate);
          this.setMinStartCFCyclePlanningDate();
          if (
            this.dynamicMatForm.controls?.['ValidFrom'].value >
              this.dynamicMatForm.controls?.['ValidTo'].value ||
            new Date(
              this.dynamicMatForm.controls?.['ValidFrom'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['ValidTo'].value
              ).toISOString()
          ) {
            this.dynamicMatForm.controls['ValidTo'].setValue(null);
            this.dynamicMatForm.controls['ValidTo'].setErrors(null);
            this.dynamicMatForm.controls['ValidTo'].markAllAsTouched();
          }
          this.dynamicMatForm.controls['ValidTo'].updateValueAndValidity();
        }
      );
    }
    if (this.dynamicMatForm.controls['PeriodStart']) {
      this.dynamicMatForm.controls['PeriodStart'].valueChanges.subscribe(
        (value) => {
          // Reset the validityEnd control's value and clear the error message
          const validityStartValue =
            this.dynamicMatForm.controls['PeriodStart'].value;
          const minDate = new Date(validityStartValue);
          this.minStartPeriodEndDate = minDate.setDate(minDate.getDate() + 1);
          this.minStartPeriodEndDate = new Date(this.minStartPeriodEndDate);
          this.setMinPeriodEndDate();
          if (
            this.dynamicMatForm.controls?.['PeriodStart'].value >
              this.dynamicMatForm.controls?.['PeriodEnd'].value ||
            new Date(
              this.dynamicMatForm.controls?.['PeriodStart'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['PeriodEnd'].value
              ).toISOString()
          ) {
            this.dynamicMatForm.controls['PeriodEnd'].setValue(null);
            this.dynamicMatForm.controls['PeriodEnd'].setErrors(null);
            this.dynamicMatForm.controls['PeriodEnd'].markAllAsTouched();
          }
          this.dynamicMatForm.controls['PeriodEnd'].updateValueAndValidity();
        }
      );
    }
    if (this.dynamicMatForm.controls['ValidityStart']) {
      this.dynamicMatForm.controls['ValidityStart'].valueChanges.subscribe(
        (value) => {
          // Reset the validityEnd control's value and clear the error message
          const validityStartValue =
            this.dynamicMatForm.controls['ValidityStart'].value;
            this.dynamicMatForm.controls['ValidityStart'].value;

          this.dynamicMatForm.controls['ValidityStart'].value;

          const minDate = new Date(validityStartValue);
          this.minStartValidityEndDate = minDate.setDate(minDate.getDate() + 1);
          this.minStartValidityEndDate = new Date(this.minStartValidityEndDate);
          this.setMinValidityEndDate();
          if (
            this.dynamicMatForm.controls?.['ValidityStart'].value >
              this.dynamicMatForm.controls?.['ValidityEnd'].value ||
            new Date(
              this.dynamicMatForm.controls?.['ValidityStart'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['ValidityEnd'].value
              ).toISOString()
          ) {
            this.dynamicMatForm.controls['ValidityEnd'].setValue(null);
            this.dynamicMatForm.controls['ValidityEnd'].setErrors(null);
            this.dynamicMatForm.controls['ValidityEnd'].markAllAsTouched();
          }
          this.dynamicMatForm.controls['ValidityEnd'].updateValueAndValidity();
          if (
            this.dynamicMatForm.controls?.['ValidityStart'].value >
              this.dynamicMatForm.controls?.['DocumentDate'].value ||
            new Date(
              this.dynamicMatForm.controls?.['ValidityStart'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['DocumentDate'].value
              ).toISOString() ||
            true
          ) {
          }
          // add for delivery date in purchase line header
          if (
            this.dynamicMatForm.controls?.['ValidityStart'].value >
              this.dynamicMatForm.controls?.['DeliveryDate'].value ||
            new Date(
              this.dynamicMatForm.controls?.['ValidityStart'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['DeliveryDate'].value
              ).toISOString()
          ) {
            this.dynamicMatForm.controls?.['DeliveryDate'].setValue(null);
            this.dynamicMatForm.controls?.['DeliveryDate'].setErrors(null);
            this.dynamicMatForm.controls?.['DeliveryDate'].markAllAsTouched();
            this.dynamicMatForm.controls?.[
              'DeliveryDate'
            ].updateValueAndValidity();
          }
        }
      );
    }
    if (this.dynamicMatForm.controls['ValidityEnd']) {
      this.dynamicMatForm.controls['ValidityEnd'].valueChanges.subscribe(
        (value) => {
          // Reset the validityEnd control's value and clear the error message
          const validityEndValue =
            this.dynamicMatForm.controls['ValidityEnd'].value;

          const maxDate = new Date(validityEndValue);
          this.maxStartValidityEndDate = maxDate.setDate(maxDate.getDate());
          this.maxStartValidityEndDate = new Date(this.maxStartValidityEndDate);
          //  if (
          //   this.dynamicMatForm.controls?.['DocumentDate'].value >
          //     this.dynamicMatForm.controls?.['ValidityEnd'].value ||
          //   new Date(
          //     this.dynamicMatForm.controls?.['DocumentDate'].value
          //   ).toISOString() ===
          //     new Date(
          //       this.dynamicMatForm.controls?.['ValidityEnd'].value
          //     ).toISOString()
          // ) {
          //   this.dynamicMatForm.controls?.['DocumentDate'].setValue(null);
          //   this.dynamicMatForm.controls?.['DocumentDate'].setErrors(null);
          //   this.dynamicMatForm.controls?.['DocumentDate'].markAllAsTouched();
          // }

          // this.dynamicMatForm.controls?.[
          //   'DocumentDate'
          // ].updateValueAndValidity();

          // if (
          //   this.dynamicMatForm.controls?.['DeliveryDate'].value >
          //     this.dynamicMatForm.controls?.['ValidityEnd'].value ||
          //   new Date(
          //     this.dynamicMatForm.controls?.['DeliveryDate'].value
          //   ).toISOString() ===
          //     new Date(
          //       this.dynamicMatForm.controls?.['ValidityEnd'].value
          //     ).toISOString()
          // ) {
          //   this.dynamicMatForm.controls?.['DeliveryDate'].setValue(null);
          //   this.dynamicMatForm.controls?.['DeliveryDate'].setErrors(null);
          //   this.dynamicMatForm.controls?.['DeliveryDate'].markAllAsTouched();
          // }

          // this.dynamicMatForm.controls?.[
          //   'DeliveryDate'
          // ].updateValueAndValidity();
        }
      );
    }
    if (this.dynamicMatForm.controls['DateOfJoining']) {
      this.dynamicMatForm.controls['DateOfJoining'].valueChanges.subscribe(
        (value) => {
          const dateOfJoiningStartValue =
            this.dynamicMatForm.controls['DateOfJoining'].value;
          const minDate = new Date(dateOfJoiningStartValue);
          this.minDateOfJoiningStartValue = minDate.setDate(
            minDate.getDate() + 1
          );
          this.minDateOfJoiningStartValue = new Date(
            this.minDateOfJoiningStartValue
          );
          if (
            this.dynamicMatForm.controls?.['DateOfJoining'].value >
              this.dynamicMatForm.controls?.['DateofLeaving'].value ||
            new Date(
              this.dynamicMatForm.controls?.['DateOfJoining'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['DateofLeaving'].value
              ).toISOString()
          ) {
            this.dynamicMatForm.controls['DateofLeaving'].setValue(null);
            this.dynamicMatForm.controls['DateofLeaving'].setErrors(null);
            this.dynamicMatForm.controls['DateofLeaving'].markAllAsTouched();
          }
          this.dynamicMatForm.controls[
            'DateofLeaving'
          ].updateValueAndValidity();
        }
      );
    }
    if (Object.keys(this.payload).length > 0) {
      this.formFields.forEach((field) => {
        if (this.payload.hasOwnProperty(field.name)) {
          field.value = this.payload[field.name];
        }
      });
      this.radioCheckboxformFields.forEach((field) => {
        if (this.payload.hasOwnProperty(field.name)) {
          if (field.validationType === 'checkbox') {
            field.value = this.payload[field.name];
            this.dynamicRadioCheckboxForm
              .get(field.name)
              ?.setValue(this.payload[field.name]);
          }
        }
      });
      this.setFormData();
    }
  }
  onSubmit() {
    if (this.dynamicForm.valid) {
      this.loaderService.setShowLoading();
       let formPayload = this.dynamicMatForm.getRawValue();
      formPayload = this.formatValues(formPayload);
      if (this.radioCheckboxformFields.length > 0) {
        formPayload = {
          ...formPayload,
          ...this.dynamicRadioCheckboxForm.value,
        };
      }
      if (this.operation === 'create') {
        delete formPayload.Id;
      }
      if (this.menuId == 4) {
        this.vendorContacts.emit(formPayload);
        this.isFromSubmitted.emit(true);
        return;
      } else {
      }
      this.apiService.post(`api/master-data?menuId=${this.menuId}`, formPayload)
        .subscribe(
          (response) => {
            if (
              response?.status?.startsWith('Error') ||
              response?.status?.startsWith(' Error')
            ) {
              this.loaderService.setDisableLoading();
              this.errorMessage = response.status;
              this.showErroMessage = true;
               return;
            }
            if (
              response.status === 'Record added successfully.' ||
              response.status === 'Record updated successfully.' ||
              response.status === 'Record added successfully'
            ) {
              this.loaderService.setDisableLoading();
              this.isFromSubmitted.emit(true);
              this.showSnackbar(response.status);
              this.onClose(event);
            } else {
              this.loaderService.setDisableLoading();
              this.isFromSubmitted.emit(true);
              this.showSnackbar(response.status);
            }
          },
          (error) => {
            this.loaderService.setDisableLoading();
          }
        );
     } else {
      // Handle form validation errors
      this.dynamicForm.markAllAsTouched();
    }
  }
  setFormData() {
    if (this.formFields.length > 0) {
      for (const field of this.formFields) {
        if(field.validationType == 'date'){
          field.value = this.datePipe.transform(field.value , 'YYYY-MM-ddT00:00:00');

        }
        // if(field.validationType == 'dropdown' && field.name == 'BillingYetToStart'){
        //   if(this.menuId == 35){
        //     field.isVisible = true;
        //     if(field.value == 'Yes'){
        //       const billingperiod_form = this.formFields.filter((a:any)=> a.name == "BillingCompleted");
        //       billingperiod_form[0].isVisible = true;
        //     }else{
        //       const billingperiod_form = this.formFields.filter((a:any)=> a.name == "BillingCompleted");
        //       billingperiod_form[0].isVisible = false;

        //     }
        //   }
        // }
        if(field.name == "CompanyId"){
          var companyGuid = field.value;
        }
        if (field.validationType == 'dropdownWithSearch' && field.name == "BuId" || field.name == "BusinessUnit" || field.name == "BusinessAreaId" || field.name == "JoiningLocationId" || field.name == "PlantId" || field.name == "VendorId"){
          this.loaderService.setShowLoading();
          field.employename = '';
          if (field.value != null) field.value = field.value.toString();
          else field.value ;
          this.searchEmploye = ''
          this.apiService
          .get(
            `api/master-data-filter?searchFor=${field.name}&filter=${field.value}&companycode=${companyGuid}`
          )
            .subscribe({
              next: (res: any) => {
                this.loaderService.setDisableLoading();
                this.formFields.filter((a) => a.name == field.name)[0][
                  'dropdownList'
                ] = [];
                if(res.length>0){
                  this.formFields.filter((a) => a.name == field.name)[0][
                    'dropdownList'
                  ] = res;
                }
                else{
                  // this.getDropdownList(field.name,companyGuid);
                  // var dummay=[];
                  // var check="{id='',name=''}";
                  // dummay.push(check);
                  // this.formFields.filter((a) => a.name == field.name)[0][
                  //   'dropdownList'
                  // ] = dummay;
                }
                this.EmploylistEdit = res;
                this.Employlist = res;
                if(field.value != null && this.Employlist.length>0){
                  field.employename = this.Employlist[0].name;
                }

              },
              error: (error: any) => {
                this.loaderService.setDisableLoading();

              },
            }
          );
        }

        if (field.validationType == 'dropdownWithSearch' && field.name != "BuId" && field.name != "BusinessAreaId" && field.name != "PlantId" && field.name != "BusinessUnit" && field.name != "VendorId" && field.name != "JoiningLocationId" )
        {
            field.employename = '';
            if (field.value != null) field.value = field.value.toString();
            else field.value ;
            this.loaderService.setShowLoading();
            this.apiService.get(`api/master-data-filter?searchFor=${field.name}&filter=${field.value}`)
              .subscribe({
                next: (res: any) => {
                  this.loaderService.setDisableLoading();
                  this.formFields.filter((a) => a.name == field.name)[0][
                    'dropdownList'
                  ] = [];
                  if(res.length>0){
                    this.formFields.filter((a) => a.name == field.name)[0][
                      'dropdownList'
                    ] = res;
                  }
                  else{
                    // this.getEmployList(field.name);
                    // var dummay=[];
                    // var check="{id='',name=''}";
                    // dummay.push(check);
                    // this.formFields.filter((a) => a.name == field.name)[0][
                    //   'dropdownList'
                    // ] = dummay;
                  }
                  this.EmploylistEdit = res;
                  this.Employlist = res;
                  if(field.value != null && this.Employlist.length>0){
                    field.employename = this.Employlist[0].name;
                  }

                },
                error: (error: any) => {
                  this.loaderService.setDisableLoading();

                },
              }
            );
         }
        this.dynamicMatForm.get(field.name)?.setValue(field?.value);
        this.dynamicMatForm.controls?.[field.name].updateValueAndValidity();
      }
    }
  }
  initializeFormFields() {
    const emailRegex: RegExp =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    for (let field of this.formFields) {
      let validators = [];
      if (field.isVisible) {
        if (field.validationType === 'alphatext') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern('^[a-zA-Z]+$'),
              Validators.required,
              Validators.minLength(field?.minLength | 1)
            );
          } else {
            validators.push(
              Validators.pattern('^[a-zA-Z]+$'),
              Validators.minLength(field?.minLength | 1)
            );
          }
        } else if (field.validationType === 'number') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern('^[0-9]+$'),
              Validators.required
            );
          } else {
            validators.push(Validators.pattern('^[0-9]+$'));
          }
        } else if (field.validationType === 'numberWithoutZero') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern('^[1-9][0-9]*$'),
              Validators.required
            );
          } else {
            validators.push(Validators.pattern('^[1-9][0-9]*$'));
          }
        } else if (field.validationType === 'email') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern(emailRegex),
              Validators.required
            );
          } else {
            validators.push(Validators.pattern(emailRegex));
          }
        } else if (field.validationType === 'decimal') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern('^[0-9]+(.[0-9]{1,3})?$'),
              Validators.required,
              Validators.minLength(field?.minLength | 1)
             );
          } else {
            validators.push(
              Validators.pattern('^[0-9]+(.[0-9]{1,3})?$'),
              Validators.minLength(field?.minLength | 1)
             );
          }
        } else if (field.validationType === 'percentage') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
              Validators.required,
              Validators.minLength(field?.minLength | 1),
              Validators.min(0),
              Validators.max(100)
            );
          } else {
            validators.push(
              Validators.pattern('^[0-9]+(.[0-9]{1,2})?$'),
              Validators.minLength(field?.minLength | 1),
              Validators.min(0),
              Validators.max(100)
            );
          }
        } else if (field.validationType === 'alphanumeric') {
          if (field.isRequired) {
            validators.push(
              Validators.pattern('^[a-zA-Z0-9-]+$'),
              Validators.required,
              Validators.minLength(field?.minLength | 1)
            );
          } else {
            validators.push(
              Validators.pattern('^[a-zA-Z0-9-]+$'),
              Validators.minLength(field?.minLength | 1)
            );
          }
        } else if (field.validationType === 'alphanumericWithSpecialChar') {
          if (field.isRequired) {
            validators.push(
              Validators.required,
              Validators.minLength(field?.minLength | 1)
            );
          } else {
            validators.push(Validators.minLength(field?.minLength | 1));
          }
        } else if (field.validationType === 'dropdown') {
          if (field.isRequired) {
            validators.push(Validators.required);
          }
        } else if (field.validationType === 'dropdownWithSearch') {
          if (field.isRequired) {
            validators.push(Validators.required);
          }
        } else if (field.validationType === 'date') {
          if (field.isRequired) {
            validators.push(Validators.required);
          }
        } else if (field.validationType === 'none') {
          validators.push(Validators.minLength(field?.minLength | 1));
        }
      }
      if (
        field.name === 'validityStart' ||
        field.name === 'periodStart' ||
        field.name === 'PeriodStart'
      ) {
        this.dynamicMatForm.addControl(
          field.name,
          this.formBuilder.control('', validators)
        );
      } else {
        this.dynamicMatForm.addControl(
          field.name,
          this.formBuilder.control('', validators)
        );
      }
    }
  }
  initializeCheckboxFormFields() {
    for (const field of this.radioCheckboxformFields) {
      if (field.validationType === 'checkbox') {
        this.dynamicRadioCheckboxForm.addControl(
          field.name,
          this.formBuilder.control(
            { value: false, disabled: field.readOnly },
           )
        );
      } else {
        this.dynamicRadioCheckboxForm.addControl(
          field.name,
          this.formBuilder.control(
            { value: '', disabled: field.readOnly },
            Validators.required
          )
        );
      }
    }
  }
  onChangeCheckbox(name: string, isChecked: boolean) {
    let getSelectedCheckboxObject = this.radioCheckboxformFields.find(
      (item: any) => item.name === name
    );

    getSelectedCheckboxObject.value = isChecked;
    this.dynamicRadioCheckboxForm.get(name)?.setValue(isChecked);
  }
  setMinValidityEndDate() {
     return this.minStartValidityEndDate;
  }
  setMinPeriodEndDate() {
    return this.minStartPeriodEndDate;
  }
  setMinStartCFCyclePlanningDate() {
    return this.minStartCFCyclePlanningDate;
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
  formatValues(formValues: any) {
    // const formValues = this.dynamicMatForm.value;
    // const formValues = formData;
    for (const field of this.formFields) {
      if (field.isVisible) {
        if (
          [
            'ValidityStart',
            'ValidityEnd',
            'periodStart',
            'periodEnd',
            'PeriodStart',
            'PeriodEnd',
            'CFCyclePlanningEndate',
            'CFCyclePlanningStartDate',
            'ValidFrom',
            'ValidTo',
            'SAPCreatedOn',
            'DocumentDate',
            'HolidayDate'
          ].includes(field.name)
        ) {
          if(formValues[field.name]==null ||formValues[field.name]==undefined
            || formValues[field.name]=='')
            {
              return formValues;
          }
          const selectedDate = new Date(formValues[field.name]);
          const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
          const adjustedDate = new Date(
            selectedDate.getTime() - timezoneOffset
          );
          const formattedDate = adjustedDate.toISOString();
          // this.dynamicMatForm.value[field.name] = formattedDate || null;
          formValues[field.name] = formattedDate || null;
        }
      }
    }
    return formValues;
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  editModeOn(e: any) {
    e.preventDefault();
    this.editMode = true;
    this.formFields
      .filter(
        (field: any) =>
          field.validationType !== 'radioButton' &&
          field.validationType !== 'checkbox'
      )
      .map((field: any) => ({
        ...field,
       }));
  }
  getValue(field: any): string {
    try {
      if (field.dropdownList != null) {
        if (field.validationType == 'dropdownWithSearch') {
          return field.employename;
        }
        const matchingItem = field.dropdownList.find(
          (item: any) => item.id === field.value
        );
        if (matchingItem) {
          return matchingItem.name;
        }
      } else if (field.validationType == 'date') {
        const date = field.value.substring(0, 10);
        const dateComponents = date.split('-');
        const rearrangedDate = `${dateComponents[2]}-${dateComponents[1]}-${dateComponents[0]}`;
        return rearrangedDate;
      }
      return field.value;
    } catch (err: any) {
      return '';
    }
  }
  OnEmploySearch(event: any, fieldName: any) {
    this.searchEmploye = event.target.value;
    if(fieldName == 'BusinessAreaId'){
      this.getDropdownList('BusinessAreaId',this.companyID)
    }
    else if(fieldName == 'JoiningLocationId'){
      this.getDropdownList('JoiningLocationId',this.companyID)
    }
    else if(fieldName == "BuId" || fieldName == "BusinessUnit"){
      this.getDropdownList(fieldName,this.companyID)
    }
    else if(fieldName == "VendorId"){
      this.getDropdownList(fieldName,this.companyID)
    }
    else{
      this.getEmployList(fieldName);
    }
  }
  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
  getEmployList(fieldName: any) {
    this.loaderService.setShowLoading();
    this.apiService
      .get(
        `api/master-data-filter?searchFor=${fieldName}&filter=${this.searchEmploye}`
      )
      .subscribe({
        next: (res: any) => {
          this.formFields.filter((a) => a.name == fieldName)[0][
            'dropdownList'
          ] = res;
          this.loaderService.setDisableLoading();
        },
        error: (error: any) => {
          this.loaderService.setDisableLoading();
        },
      });
  }
  OnDropdownWithSearchChange(event:any,field:any){
    if(event.value == undefined){
      //Nothing Doing
      event.value = ''
    }else{
      if (field.name == 'ClusterId' && this.menuId == 1) {
        this.getClusterCode(event.value)
      }
    }
  }
  OnCompanyCodeChange(event: any, field: any) {
    if(event.value == undefined){
      //Nothing Doing
    }else{
      this.companyID = event.value;
      if(field.name == 'BillingYetToStart'){
        if(this.menuId == 35){
          if(event.value == 'Yes'){
            const billingperiod_form = this.formFields.filter((a:any)=> a.name == "BillingCompleted");
            billingperiod_form[0].isVisible = true;
          }else{
            const billingperiod_form = this.formFields.filter((a:any)=> a.name == "BillingCompleted");
            billingperiod_form[0].isVisible = false;

          }
        }
      }
      if (field.name == 'CompanyId'){
        if(this.menuId == 3 || this.menuId == 7|| this.menuId == 34|| this.menuId == 8|| this.menuId == 21|| this.menuId == 33 || this.menuId == 60 ) {
          this.getPlantCurrency(event.value);
          if(this.menuId == 3){
            this.searchEmploye = '';
            this.getDropdownList('BusinessAreaId',event.value)
            this.getDropdownList('JoiningLocationId',event.value)
          }
        }
      }
      if(field.name == 'CompanyId' ){
        if(this.menuId == 26
          || this.menuId==69
          || this.menuId==70
          || this.menuId==71
          || this.menuId==72
          || this.menuId==73
          || this.menuId==74
          || this.menuId==55
          || this.menuId==54|| this.menuId==53
          || this.menuId==56|| this.menuId==57
          || this.menuId==58|| this.menuId==59){
          this.getDropdownList('PlantId',event.value)
        }
        if(this.menuId == 33){
          this.getDropdownList('BusinessUnit',event.value);
        }
        if(this.menuId == 21){
          this.getDropdownList('BuId',event.value);
        }
        if(this.menuId == 7 || this.menuId == 60){
          this.getDropdownList('VendorId',event.value);
        }
      }
    }
  }
  //DropDownList Change API call
  getDropdownList(fieldName: any,companyid: any){
    this.loaderService.setShowLoading();
    this.apiService
      .get(
        `api/master-data-filter?searchFor=${fieldName}&filter=${this.searchEmploye}&companycode=${companyid}`
      )
      .subscribe({
        next: (res: any) => {
          this.formFields.filter((a) => a.name == fieldName)[0][
            'dropdownList'
          ] = [];
          if(res.length>0){
            this.formFields.filter((a) => a.name == fieldName)[0][
              'dropdownList'
            ] = res;

            this.loaderService.setDisableLoading();

          }
          else{
            // var dummay=[];
            // var check="{id='',name=''}";
            // dummay.push(check);
            // this.formFields.filter((a) => a.name == 'BuId')[0][
            //   'dropdownList'
            // ] = dummay;

            this.loaderService.setDisableLoading();


          }

        },
        error: (error: any) => {
          this.loaderService.setDisableLoading();
        },
      });
  }
  //Cluster API call
  getClusterCode(ClusterId:any){
      this.loaderService.setShowLoading();
     this.apiService
       .get(
         `api/master-data-filter/get/cluster-code?clusterId=${ClusterId}`
       )
       .subscribe({
         next: (res: any) => {
           for (let a of this.formFields) {
             if (a.name == "ClusterCode") {
               a.value = res;

             }
           }
              this.loaderService.setDisableLoading();
         },
         error: (error: any) => {
           this.loaderService.setDisableLoading();
         },
       });
   }
  //Currency API call
  getPlantCurrency(companyid: any) {
      this.loaderService.setShowLoading();
      this.apiService
        .get(`api/master-data-filter/get-company-currency?CompanyId=${companyid}`)
        .subscribe({
          next: (res: any) => {
            this.loaderService.setDisableLoading();
            this.formFields.filter((a) => a.name == 'PlantCurrency')[0][
              'dropdownList'
            ] = res;
            for (let a of this.formFields) {
              if (a.name == 'PlantCurrency') {
                a.value = res[0].id;
              }
            }
            this.loaderService.setDisableLoading();
          },
          error: (error: any) => {
            this.loaderService.setDisableLoading();
          },
        });
  }
  // Role Auth check
  getProfileRoles() {
    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        this.userProfileDetails = response.data;
        this.apiService.profileDetails = response.data;
        StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));

        if (
          this.apiService.profileDetails != null &&
          this.apiService.profileDetails != undefined
        ) {
          this.userProfileDetails = this.apiService.profileDetails;
          if (this.userProfileDetails.roleDetail != null) {
            const masterDataModules =
              this.userProfileDetails.roleDetail[0].roleDetails.filter(
                (item: any) =>
                  item.moduleDetails.some(
                    (module: any) => module.moduleName === 'MasterData'
                  )
              );
            const masterDataFeatureDetails = masterDataModules.map(
              (item: any) => {
                const masterDataModule = item.moduleDetails.find(
                  (module: any) => module.moduleName === 'MasterData'
                );
                return masterDataModule.featureDetails;
              }
            );
            this.featureDetails = masterDataFeatureDetails;
            this.permissionDetails = {
              "createPermission": false,
              "readPermission": false,
              "editPermission": false,
              "deletePermission": false,
              "approvePermission": false,
              "rejectPermission": false,
              "delegatePermission": false,
              "withdrawPermission": false,
              "importPermission": false,
              "exportPermission": false
            }
            for (let plan of this.featureDetails) {
              for (let item of plan) {
                if(item.featureName == this.data.selectedMaster){
                  for (const permission in this.permissionDetails) {
                    if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                      this.permissionDetails[permission] = true;
                    }
                  }

                }
              }
            }

          }
        }
      },
      error: (e: any) => {
      },
      complete: () => {},
    });
  }
  checkUserProfileValueValid() {
    this.apiService.profileDetails = StorageQuery.getUserProfile();
    if (
      this.apiService.profileDetails == '' ||
      this.apiService.profileDetails == undefined
    ) {
      this.getProfileRoles();
    } else {
      this.userProfileDetails = this.apiService.profileDetails;
      const masterDataModules =
        this.userProfileDetails.roleDetail[0].roleDetails.filter((item: any) =>
          item.moduleDetails.some(
            (module: any) => module.moduleName === 'MasterData'
          )
        );
      const masterDataFeatureDetails = masterDataModules.map((item: any) => {
        const masterDataModule = item.moduleDetails.find(
          (module: any) => module.moduleName === 'MasterData'
        );
        return masterDataModule.featureDetails;
      });
      this.featureDetails = masterDataFeatureDetails;
      this.permissionDetails = {
        "createPermission": false,
        "readPermission": false,
        "editPermission": false,
        "deletePermission": false,
        "approvePermission": false,
        "rejectPermission": false,
        "delegatePermission": false,
        "withdrawPermission": false,
        "importPermission": false,
        "exportPermission": false
      }
      for (let plan of this.featureDetails) {
        for (let item of plan) {
          if(item.featureName == this.data.selectedMaster){
            for (const permission in this.permissionDetails) {
              if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                this.permissionDetails[permission] = true;
              }
            }
          }
        }
      }
    }
  }
}
