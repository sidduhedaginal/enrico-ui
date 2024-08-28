import {Component,EventEmitter,HostListener,Inject, Input, OnInit,Optional,Output,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { ApiCallService } from '../../services/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ODCUiJson } from '../../constants/app-constant';
import { LoaderService } from '../../../../app/services/loader.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-odc-addchildform',
  templateUrl: './odc-addchildform.component.html',
  styleUrls: ['./odc-addchildform.component.css'],
  providers:[DatePipe]
})
export class OdcAddchildformComponent implements OnInit {
  dynamicForm: FormGroup = new FormGroup({});
  dynamicMatForm!: FormGroup;
  formFields!: any[]; // This will hold the API response with form field details
  radioCheckboxformFields!: any[]; // This will hold the API response with form field details
  payload: any;
  uiJson: any;
  menuId!: number;
  minStartValidityEndDate: any;
  minStartValidityStartDate: any;
  operation!: string;
  selectedMaster!: string;
  showLoading: boolean = false;
  isSubmitted: boolean = false;
  activeIndex: number = -1;
  formType!: string;
  routerState: any;
  VendorId!: string;
  readOnly = false;
  showErroMessage = false;
  errorMessage = '';
  AddContactList: any = [];
  ContactDetailsUiJson: any = [];
  showContactType: boolean = true;
  searchEmploye: string = '';
  companyID : any;
  Employlist: any = [];
  EmploylistEdit: any = [];
  ODCChildData : any;
  maxStartValidityEndDate: any;
  childdata : any;
  component : string;
  state:string;
  // @Input() routerState!: any;

  @Input() oDcChildState!: any;
  @Input() rowData: any[] = [];
  @Input() existingodcchild: any = [];

  @Output() isODCFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() odcchildSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() odcSubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() oDCDetails: EventEmitter<any> = new EventEmitter<any>();
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiCallService,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
     private loaderService: LoaderService,
    private router: Router,
    private datePipe: DatePipe,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    
    this.fetchContactDetails();
    this.ODCChildData = data;
    if(data){
    this.component = data.component;
    this.state = data.state;
    }
    this.VendorId = data?.payload?.VendorId;
    this.routerState = this.router.getCurrentNavigation()?.extras.state;
    this.selectedMaster = this.routerState?.['selectedMaster'];
    this.menuId = this.routerState?.['menuId'];
    this.formType = this.routerState?.['formType'];
    this.operation = this.routerState?.['operation'];
    this.readOnly = this.routerState?.['read'];
    if(this.readOnly == true){
      this.operation = 'update'
    }
    if(this.routerState){
      this.component = this.routerState.component;
    }
   
    
    
    if (data?.menuId === 54 && Object.keys(data?.payload).length > 1) {
      this.payload = data.payload;
      this.menuId = data.menuId;
      this.operation = data.operation;
    } else {
      this.payload = this.routerState?.['payload'];
    }
    if(this.routerState){
      if (this.menuId === 54) {
        this.uiJson = this.routerState?.['uiJson'];
        this.uiJson.forEach((field) => { 
          if(field.name == "ODCName"){
            field.name = "OdcName"
          }
          if(field.name == "ODCID"){
            field.name = 'Odcid'
          }
        })
        this.updateUiJson();
      } 
    }
    else {
      this.menuId = 54;
      this.uiJson = ODCUiJson;
    }

    

    this.formFields = this.uiJson.filter(
      (field: any) =>
        field.validationType !== 'radioButton' &&
        field.validationType !== 'checkbox' &&
        field.validationType !== 'classification'
    );
    this.radioCheckboxformFields = this.uiJson.filter(
      (field: any) =>
        field.validationType === 'radioButton' ||
        field.validationType === 'checkbox' ||
        field.validationType === 'classification'
    );

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
    } else {
      this.formFields = this.uiJson.filter(
        (field: any) =>
          field.validationType !== 'radioButton' &&
          field.validationType !== 'checkbox'
      );
    }
  }
  routerdata: any;
  dropdownParsingList = [];
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.router.navigate(['/dashboard'], {
      queryParams: { routertitle: JSON.stringify('ODC Master') },
    });
  }
  ngOnInit() {
    this.dynamicMatForm = this.formBuilder.group({});
    console.log(this.operation);
    
    this.initializeFormFields();
    this.dynamicForm = this.formBuilder.group({
      dynamicMatForm: this.dynamicMatForm,
    });
    if(this.ODCChildData){
      if(this.ODCChildData.component == "ODCchild"){
        if(this.operation == "update"){
          this.dynamicMatForm.get('validityStart')?.disable();
          this.dynamicMatForm.get('odcCostPerHeadCount')?.disable();
          
        }
        
      }
    }             

    if(this.payload){
    if (Object.keys(this.payload).length > 0) {
      this.formFields.forEach((field) => {        
      if (this.payload.hasOwnProperty(field.name)) {
          field.value = this.payload[field.name];
        }
      });
      this.setFormData();
    }
  }
  if(this.existingodcchild.length > 0&& this.state =='editenddate'){
    const validityEndValue = this.existingodcchild[0].validityStart
    const minEndDate = new Date(validityEndValue);
    this.minStartValidityEndDate = minEndDate.setDate(minEndDate.getDate() + 1);
    this.minStartValidityEndDate = new Date(this.minStartValidityEndDate);
    this.setMinValidityEndDate();
  }

  if (this.dynamicMatForm.controls['validityStart']) {
    this.dynamicMatForm.controls['validityStart'].valueChanges.subscribe(
      (value) => {
        // Reset the validityEnd control's value and clear the error message
        const validityStartValue =
          this.dynamicMatForm.controls['validityStart'].value;
          this.dynamicMatForm.controls['validityStart'].value;

        this.dynamicMatForm.controls['validityStart'].value;

        const minDate = new Date(validityStartValue);
        this.minStartValidityEndDate = minDate.setDate(minDate.getDate() + 1);
        this.minStartValidityEndDate = new Date(this.minStartValidityEndDate);
        this.setMinValidityEndDate();
        if (
          this.dynamicMatForm.controls?.['validityStart'].value >
            this.dynamicMatForm.controls?.['validityEnd'].value ||
          new Date(
            this.dynamicMatForm.controls?.['validityStart'].value
          ).toISOString() ===
            new Date(
              this.dynamicMatForm.controls?.['validityEnd'].value
            ).toISOString()
        ) {
          this.dynamicMatForm.controls['validityEnd'].setValue(null);
          this.dynamicMatForm.controls['validityEnd'].setErrors(null);
          this.dynamicMatForm.controls['validityEnd'].markAllAsTouched();
        }
        this.dynamicMatForm.controls['validityEnd'].updateValueAndValidity();

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
      }
    );
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
  if(this.existingodcchild.length > 0){
    const validityStartValue = this.existingodcchild[0].validityEnd
    const minDate = new Date(validityStartValue);
    this.minStartValidityStartDate = minDate.setDate(minDate.getDate() + 1);
    this.minStartValidityStartDate = new Date(this.minStartValidityStartDate);
     this.minStartValidityStartDate();
    } 
  }


  handleInput(event: KeyboardEvent): void {
    event.stopPropagation();
  }
  OnEmploySearch(event: any, fieldName: any) {
    this.searchEmploye = event.target.value;
    if(fieldName == 'PlantId'){
      this.getDropdownList('businessareaid',this.companyID)
    }else{
      this.getDropdownList(fieldName,this.companyID)
    }
   
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
      //DropDownList Change API call
  getDropdownList(fieldName: any,companyid: any){
        this.loaderService.setShowLoading();
        this.apiService
          .get(
            `api/master-data-filter?searchFor=${fieldName}&filter=${this.searchEmploye}&companycode=${companyid}`
          )
          .subscribe({
            next: (res: any) => {
              if(fieldName == 'businessareaid'){
                this.formFields.filter((a) => a.name == 'PlantId')[0][
                  'dropdownList'
                ] = [];
                if(res.length>0){
                  this.formFields.filter((a) => a.name == 'PlantId')[0][
                    'dropdownList'
                  ] = res;
                  this.loaderService.setDisableLoading();
                }
                else{
                  this.loaderService.setDisableLoading();
                }

              }else{
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
                  this.loaderService.setDisableLoading();
                }
              }
  
        
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
            this.formFields.filter((a) => a.name == 'Currency')[0][
              'dropdownList'
            ] = res;
            for (let a of this.formFields) {
              if (a.name == 'Currency') {
                a.value = res[0].id;
              }
            }
            console.log(this.formFields);
            
            this.loaderService.setDisableLoading();
          },
          error: (error: any) => {
            this.loaderService.setDisableLoading();
          },
        });
  }

  OnContactTypeChange(event: any, field: any) {
    if(event.value == undefined){
      //Nothing Doing
    }else{
      this.companyID = event.value;
      if (field.name == 'CompanyId'){
        if(this.menuId == 54) {        
          this.getPlantCurrency(event.value);
          this.searchEmploye = '';      
            this.getDropdownList('businessareaid',event.value)
            this.getDropdownList('VendorId',event.value)
        }
      }
    }
  }

  updateUiJson() {
    if(this.operation == 'create'){
    this.uiJson.forEach((field: any) => {
      if (field.name === 'ODCID' || field.name === 'Odcid') field.isVisible = false;
    });
  }
  }
  selectedClassification(index: any, id: any, name: string) {
    this.activeIndex = index;
  }
  convertKeysToLowercaseFirstLetter(
    obj: Record<string, any>
  ): Record<string, any> {
    const convertedObj: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const convertedKey = key.charAt(0).toLowerCase() + key.slice(1);
        convertedObj[convertedKey] = obj[key];
      }
    }
    return convertedObj;
  }
  addNewKeyToObjects(
    objects: { name: string; property: string }[],
    newKey: string,
    newValue: any
  ) {
    return objects.map((obj) => ({ ...obj, [newKey]: newValue }));
  }

  removeIDFromObjects(objects: any[]): any[] {
    return objects.map(({ Id, ...rest }) => rest);
  }
  fetchContactDetails() {
    this.loaderService.setShowLoading();
    this.apiService
      .get(`api/master-data?menuId=54`)
      .subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        this.AddContactList = response.data.object;
      }, (error) => {
        this.loaderService.setDisableLoading();
      });
  }

  checkEmailValid(
    emailId: string,
    existingodcchild: any,
    operation: string,
    payload: any
  ): boolean {
    const errormessageEmail: string = 'Email Already Exist';
    if (operation == 'update') {
      if (emailId == payload.Email) {
        this.errorMessage = '';
        return true;
      }
      for (const contact of existingodcchild) {
        if (contact.Email == emailId) {
          this.showErroMessage = true;
          this.errorMessage = errormessageEmail;
          return false;
        }
      }
      this.errorMessage = '';
      return true;
    }
    for (const contact of existingodcchild) {
      if (contact.Email == emailId) {
        this.showErroMessage = true;
        this.errorMessage = errormessageEmail;
        return false;
      }
    }
    this.errorMessage = '';
    return true;
  }

  checkPrimaryContact(
    operation: string,
    payload: any,
    existingodcchild: any,
    formData: any
  ) {
    const statusMsg1 = 'Active Primary Contact already Exist';

    if (operation == 'update') {
      if (payload.Status === true && payload.PrimaryContact === true) {
        //since it is the primary contact should not allow to edit or make it inactive
        if (formData.Status === true && formData.PrimaryContact === true) {
          this.errorMessage = this.errorMessage.replace(', ' + statusMsg1, '');
          this.errorMessage = this.errorMessage.replace(statusMsg1, '');
          return true;
        }
        
        else {
          this.errorMessage = this.errorMessage.replace(', ' + statusMsg1, '');
          this.errorMessage = this.errorMessage.replace(statusMsg1, '');
          return true;
        }
      }
      // making a contact as primary contact
      if (formData.Status === true && formData.PrimaryContact === true) {
        // check if it already exist
        for (const contact of existingodcchild) {
          if (contact.Status === true && contact.PrimaryContact === true) {
            this.showErroMessage = true;
            if (this.errorMessage.length != 0)
              this.errorMessage += ', ' + statusMsg1;
            else this.errorMessage = statusMsg1;
            return false;
          }
        }
        // allow to create a primary contact
        this.errorMessage = this.errorMessage.replace(', ' + statusMsg1, '');
        this.errorMessage = this.errorMessage.replace(statusMsg1, '');
        return true;
      }
      // not a primary contact
      else {
        this.errorMessage = this.errorMessage.replace(', ' + statusMsg1, '');
        this.errorMessage = this.errorMessage.replace(statusMsg1, '');
        return true;
      }
    }
    // for Add
    // if (formData.Status === true && formData.PrimaryContact === true) {
      // for (const contact of existingodcchild) {
      //   if (contact.Status === true && contact.PrimaryContact === true) {
      //     this.showErroMessage = true;
      //     if (this.errorMessage.length != 0)
      //       this.errorMessage += 'Active Primary Contact already Exist';
      //     else this.errorMessage = 'Active Primary Contact already Exist';
      //     return false;
      //   }
      // }
      return true;
    // } 
    // else return true;
  }

  onSubmit() {
    if(this.ODCChildData){
    if(this.ODCChildData.component == 'ODCchild'){
    // if (this.menuId == 54) {  
      // this is for contact details
      if (this.dynamicForm.valid) {
        let formPayloadTest1 = {
          ...this.dynamicMatForm.value,
        };
        if(this.ODCChildData.operation == 'create'){
          formPayloadTest1.id = null 
        }
        if(this.ODCChildData.operation == "update"){
          formPayloadTest1.validityStart =  this.ODCChildData.payload.validityStart
        }
       
        const isContactStatusValid = this.checkPrimaryContact(
          this.operation,
          this.payload,
          this.existingodcchild,
          formPayloadTest1
        );
        // if (isEmailValid == true && isContactStatusValid == true) {
          this.oDCDetails.emit(formPayloadTest1);
          this.odcSubmitted.emit(true);
        // }
      }
    } 
  }
    else {
      if (this.dynamicForm.valid) {
        this.loaderService.setShowLoading();
  
        this.isSubmitted = true;
        this.formatValues();
        const formPayload = {
          ...this.dynamicMatForm.value,
        };        
        if (this.operation === 'create') {
          delete formPayload.Id;
        }
        let formPayloadTest = {
          ...this.dynamicMatForm.getRawValue(),
        };
        formPayloadTest.OdcHeadCountModel = this.rowData;
        if (this.operation === 'create') {
          delete formPayloadTest.id;
        }
        var checkContectDetails = formPayloadTest['OdcHeadCountModel'];
        if (
          checkContectDetails == undefined ||
          checkContectDetails.length <= 0
        ) {
          this.showSnackbar(
            'Error!! Please add at least one active ODC details.'
          );
          this.loaderService.setDisableLoading();
          return false;
        }
        this.odcchildSubmitted.emit(true);
        this.apiService
          .post(`api/master-data?menuId=${this.menuId}`, formPayloadTest)
          .subscribe(
            (response) => {
              // this.loaderService.setDisableLoading();
              if (
                response.status != 'Record added successfully' &&
                response.status != 'Record updated successfully' &&
                response.status != 'Record added successfully'
              ) {
                this.odcSubmitted.emit(response.data?.Id);
                if (this.menuId === 54) {
                  this.oDCDetails.emit(response.data);
                }
                this.showSnackbar(response.status);
                this.isODCFromSubmitted.emit(true);
              } else {
               
                this.showSnackbar(response.status);
                this.router.navigate(['/dashboard'], {
                  queryParams: { routertitle: JSON.stringify('ODC Master') },
                });
              }
              this.loaderService.setDisableLoading();
            },
            
            (error) => {
              this.loaderService.setDisableLoading();
            }
          );
        return;
      } else {
        this.dynamicForm.markAllAsTouched();
      }
    }
  }

  onSubmit1() {
    const contactData = { name: 'John Doe', email: 'johndoe@example.com' };
    const formPayload = {
      ...this.dynamicMatForm.value,
    };
    this.oDCDetails.emit(formPayload);
    this.odcSubmitted.emit(true);
  }

  setFormData() {
    if (this.formFields.length > 0) {
      for (const field of this.formFields) { 
        if(field.name == "CompanyId"){
          var companyGuid = field.value;
          this.getPlantCurrency(companyGuid)
        } 
        if(field.validationType == 'dropdownWithSearch' &&  field.name == "PlantId"){
          
          this.loaderService.setShowLoading();
          field.employename = '';
          if (field.value != null) field.value = field.value.toString();
          else field.value ;
          this.searchEmploye = ''
          this.apiService
          .get(
            `api/master-data-filter?searchFor=${'businessareaid'}&filter=${field.value}&companycode=${companyGuid}`
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
        if(field.validationType == 'dropdownWithSearch' &&  field.name == "VendorId"){
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
        if(field.validationType == 'date'){
          field.value = this.datePipe.transform(field.value , 'YYYY-MM-ddT00:00:00');
          
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
          validators.push(
            Validators.pattern('^[a-zA-Z]+$'),
            Validators.required,
            Validators.minLength(field?.minLength | 1)
          );
        } else if (field.validationType === 'number') {
          validators.push(
            Validators.pattern('^[0-9]+$'),
            Validators.required,
            Validators.minLength(field?.minLength | 1)
          );
        } else if (field.validationType === 'decimal') {
          validators.push(
            Validators.pattern('^[0-9]+(.[0-9]{1,3})?$'),
            Validators.required,
            Validators.minLength(field?.minLength | 1)
          );
        } else if (field.validationType === 'textArea') {
          validators.push(
            Validators.required,
            Validators.minLength(field?.minLength | 200)
          );
        } else if (field.validationType === 'alphanumeric') {
          validators.push(
            Validators.pattern('^[a-zA-Z0-9-]+$'),
            Validators.required,
            Validators.minLength(field?.minLength | 1)
          );
        } else if (field.validationType === 'email') {
          validators.push(Validators.pattern(emailRegex), Validators.required);
        } else if (field.validationType === 'alphanumericWithSpecialChar') {
          validators.push(
            Validators.required,
            Validators.minLength(field?.minLength | 1)
          );
        } else if (
          field.validationType === 'dropdown' &&
          field.name != 'ParentVendorId'
        ) {
          validators.push(Validators.required);
        } else if (field.validationType === 'date') {
          validators.push(Validators.required);
        } else if (field.validationType === 'none') {
          validators.push(Validators.minLength(field?.minLength | 1));
        }
      }

      //Disable email id for vendor contact details
      if(field.name == "CompanyId" ){
        if(this.operation == "update")
        {
          field.readOnly  =  true
        } 
        else{
          field.readOnly  =  false;
        } 
      }

      if (field.name === 'validityStart') {
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
  }

  onChangeCheckbox(name: string, id: string, isChecked: boolean) {

  }

  setMinValidityEndDate() {
    return this.minStartValidityEndDate;
  }

  setMinPeriodEndDate() {
    return this.minStartValidityStartDate;
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

  formatValues() {
    const formValues = this.dynamicMatForm.value;
    for (const field of this.formFields) {
      if (field.isVisible) {
        if (
          ['validityStart', 'validityEnd'].includes(
            field.name
          )
        ) {
          const selectedDate = new Date(formValues[field.name]);
          const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
          const adjustedDate = new Date(
            selectedDate.getTime() - timezoneOffset
          );
          const formattedDate = adjustedDate.toISOString();
          this.dynamicMatForm.value[field.name] = formattedDate || null;
        }
      }
    }
  }

  onClose(event: any) {
    event.preventDefault();
    this.isODCFromSubmitted.emit(false);
    this.odcchildSubmitted.emit(false);
    if (this.menuId === 54 && this.component != "ODCchild") {
      this.router.navigate(['/dashboard'], {
        queryParams: { routertitle: JSON.stringify('ODC Master') },
      });
    }
  }

  editModeOn() {
    this.readOnly = false;
    this.setFormData();
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  getValue(field: any): string {
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
  }
}
