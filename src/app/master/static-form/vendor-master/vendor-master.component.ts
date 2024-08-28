import {Component,EventEmitter,HostListener,Inject,Input,OnInit,Optional, Output,} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DynamicFormComponent } from '../../dynamic-form/dynamic-form.component';
import { ApiCallService } from '../../services/api-call.service';
import { ActivatedRoute, Router } from '@angular/router';
import { vendorContactUiJson } from '../../constants/app-constant';
import { LoaderService } from '../../../../app/services/loader.service';
import { validateHeaderName } from 'http';

@Component({
  selector: 'lib-vendor-master',
  templateUrl: './vendor-master.component.html',
  styleUrls: ['./vendor-master.component.css'],
})
export class VendorMasterComponent implements OnInit {
  dynamicForm: FormGroup = new FormGroup({});
  dynamicMatForm!: FormGroup;
  dynamicRadioCheckboxForm!: FormGroup;
  formFields!: any[]; // This will hold the API response with form field details
  radioCheckboxformFields!: any[]; // This will hold the API response with form field details
  payload: any;
  uiJson: any;
  menuId!: number;
  minStartValidityEndDate: any;
  minStartPeriodEndDate: any;
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

  // @Input() routerState!: any;

  @Input() contactState!: any;
  @Input() rowData: any[] = [];
  @Input() existingContacts: any = [];

  @Output() isVendorFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() contactSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() vendorSubmitted: EventEmitter<any> = new EventEmitter<any>();
  @Output() contactDetails: EventEmitter<any> = new EventEmitter<any>();
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
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data",data);
    
    this.fetchContactDetails();
    this.VendorId = data?.payload?.VendorId;
    this.routerState = this.router.getCurrentNavigation()?.extras.state;
 
    this.selectedMaster = this.routerState?.['selectedMaster'];
    this.menuId = this.routerState?.['menuId'];
    this.formType = this.routerState?.['formType'];
    this.operation = this.routerState?.['operation'];
    this.readOnly = this.routerState?.['read'];
    console.log("data",data);
    if (data?.menuId === 32 && Object.keys(data?.payload).length > 1) {
      this.payload = data.payload;
      this.menuId = data.menuId;
      this.operation = data.operation;
    } else {
      this.payload = this.routerState?.['payload'];
    }
    if (this.menuId === 4) {
      console.log(this.routerState);
      
      this.uiJson = this.routerState?.['uiJson'];
      if (this.payload) {
        if(this.payload.businessSupport?.toLowerCase() == 'bgv'){
          for (let a of this.uiJson) {
            if(a.name == "SubcontractAllowed" && a.name == "DomainID"){
              a.isRequired = true;
            }
          }
        }
        for (let a of this.uiJson) {
         
          if (a.name == 'ParentVendorId') {
            if (this.payload.Type == 'Subsidiary') {
           
            } else {
              a.isVisible = false;
            }
          }
        }
      }
      this.updateUiJson();
    } else {
      this.menuId = 32;
      this.uiJson = vendorContactUiJson;
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
      queryParams: { routertitle: JSON.stringify('Vendor Master') },
    });
  }
  ngOnInit() {
    this.dynamicMatForm = this.formBuilder.group({});
    if (this.radioCheckboxformFields.length > 0) {
      this.dynamicRadioCheckboxForm = this.formBuilder.group({});
      this.initializeCheckboxFormFields();
      this.dynamicForm = this.formBuilder.group({
        dynamicMatForm: this.dynamicMatForm,
        dynamicRadioCheckboxForm: this.dynamicRadioCheckboxForm,
      });
    }

    this.initializeFormFields();
    this.dynamicForm = this.formBuilder.group({
      dynamicMatForm: this.dynamicMatForm,
    });

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
            const value = field.value;
            field.checkBoxOptions.forEach((option: any) => {
              if (value.includes(option.id)) {
                option.value = true;
              }
            });
            this.dynamicRadioCheckboxForm
              .get(field.name)
              ?.setValue(field.value);
          } else {
            field.value = this.payload[field.name];
            this.dynamicRadioCheckboxForm
              .get(field.name)
              ?.setValue(field.value);
          }
        }
      });
      this.setFormData();
    }
    this.uiJson.forEach((field: any) => {
      if (
        field.validationType === 'dropdown' &&
        field.readOnly == true &&
        this.operation != 'create'
      ) {
        this.dynamicMatForm.get(field.name)?.disable();
      }
    });
    if (this.dynamicMatForm.controls['validityStart']) {
      this.dynamicMatForm.controls['validityStart'].valueChanges.subscribe(
        (value) => {
          const validityStartValue =
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

    if (this.dynamicMatForm.controls['periodStart']) {
      this.dynamicMatForm.controls['periodStart'].valueChanges.subscribe(
        (value) => {
          const validityStartValue =
            this.dynamicMatForm.controls['periodStart'].value;
          const minDate = new Date(validityStartValue);
          this.minStartPeriodEndDate = minDate.setDate(minDate.getDate() + 1);
          this.minStartPeriodEndDate = new Date(this.minStartPeriodEndDate);
          this.setMinPeriodEndDate();
          if (
            this.dynamicMatForm.controls?.['periodStart'].value >
              this.dynamicMatForm.controls?.['periodEnd'].value ||
            new Date(
              this.dynamicMatForm.controls?.['periodStart'].value
            ).toISOString() ===
              new Date(
                this.dynamicMatForm.controls?.['periodEnd'].value
              ).toISOString()
          ) {
            this.dynamicMatForm.controls['periodEnd'].setValue(null);
            this.dynamicMatForm.controls['periodEnd'].setErrors(null);
            this.dynamicMatForm.controls['periodEnd'].markAllAsTouched();
          }

          this.dynamicMatForm.controls['validityEnd'].updateValueAndValidity();
        }
      );
    }

    if (this.payload?.Id) {
      this.vendorSubmitted.emit(this.payload.Id);
    }
  }

  OnContactNumberChange(event: any, field: any){    
  }

  OnContactTypeChange(event: any, field: any) {
    if (field.name == 'ContactTypeId') {
      if (event.value == '2') {
        this.showContactType = true;
        for (let item of this.formFields) {
          if (
            item.name == 'DomainResponsibility' ||
            item.name == 'EscalateLevel'
          ) {
            this.dynamicMatForm.removeControl('DomainResponsibility');
            this.dynamicMatForm.removeControl('EscalateLevel');
            this.dynamicRadioCheckboxForm?.get('PrimaryContact').setValue(false);
            this.dynamicRadioCheckboxForm?.get('Status').setValue(false);
            
            item.isVisible = false;
          }if(item.name == "Note"){
            item.isVisible = true;
            if (!this.dynamicMatForm.contains(item.name)) {
              this.dynamicMatForm.addControl(
                item.name,
                this.formBuilder.control('', Validators.required)
              );
            }
          
          }
        }
        for(let item of this.radioCheckboxformFields){
          if(item.name == 'PrimaryContact'){
            item.isVisible = true;
          }
        }
      } else if (event.value == '1') {
        this.showContactType = false;
        for (let item of this.formFields) {
          if (
            item.name == 'DomainResponsibility' ||
            item.name == 'EscalateLevel'
          ) {
            item.isVisible = true;
            if (!this.dynamicMatForm.contains(item.name)) {
              this.dynamicMatForm.addControl(
                item.name,
                this.formBuilder.control('', Validators.required)
              );
            }
          }
          if(item.name == 'Note' || item.name == 'PrimaryContact'){
            this.dynamicMatForm.removeControl('Note');
            item.isVisible = false;
          }
        
        }
        for(let item of this.radioCheckboxformFields){
          if(item.name == 'PrimaryContact'){
            item.isVisible = false;
          }
        }
      }
    }
    else if(field.name == "VendorTypeId"){
      if(event.source.triggerValue != "Subsidiary"){      
        for (let item of this.formFields) {
          if (item.name == 'ParentVendorId'
          ) {
            this.dynamicMatForm.removeControl('ParentVendorId');
            item.isVisible = false;
          }
        }
      }else{
        for (let item of this.formFields) {
          if (
            item.name == 'ParentVendorId'
          ) {
            item.isVisible = true;
            if (!this.dynamicMatForm.contains(item.name)) {
              this.dynamicMatForm.addControl(
                item.name,
                this.formBuilder.control('', Validators.required)
              );
            }
          }
        }
      }
    }
    else if(field.name == "BusinessSupportID"){
      if(event.source.triggerValue.toLowerCase() == "bgv"){
        for (let item of this.formFields) {
          if (item.name == 'SubcontractAllowed' || item.name == 'DomainID'
          ) {
            item.isRequired = true;
            this.dynamicMatForm.get(item.name).setValidators(Validators.required)
            this.dynamicMatForm.get(item.name).updateValueAndValidity()
          }
        }
      }else{
        for (let item of this.formFields) {
          if (item.name == 'SubcontractAllowed' || item.name == 'DomainID'
          ) {
            item.isRequired = true;
            this.dynamicMatForm.get(item.name).removeValidators(Validators.required)
            this.dynamicMatForm.get(item.name).updateValueAndValidity()
          }
        }
      }
      
    }
  }

  updateUiJson() {
    this.uiJson.forEach((field: any) => {
      if (field.name === 'VendorTypeID') field.name = 'VendorTypeId';
    });
  }
  selectedClassification(index: any, id: any, name: string) {
    this.activeIndex = index;
    this.dynamicRadioCheckboxForm.get(name)?.setValue(index);
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
      .get(`api/master-data?menuId=32`)
      .subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        this.AddContactList = response.data.object;
      }, (error) => {
        this.loaderService.setDisableLoading();
      });
  }

  checkEmailValid(
    emailId: string,
    existingContacts: any,
    operation: string,
    payload: any
  ): boolean {
    const errormessageEmail: string = 'Email Already Exist';
    if (operation == 'update') {
      if (emailId == payload.Email) {
        this.errorMessage = '';
        return true;
      }
      for (const contact of existingContacts) {
        if (contact.Email == emailId) {
          this.showErroMessage = true;
          this.errorMessage = errormessageEmail;
          return false;
        }
      }
      this.errorMessage = '';
      return true;
    }
    for (const contact of existingContacts) {
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
    existingContacts: any,
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
        for (const contact of existingContacts) {
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
    if (formData.Status === true && formData.PrimaryContact === true) {
      for (const contact of existingContacts) {
        if (contact.Status === true && contact.PrimaryContact === true) {
          this.showErroMessage = true;
          if (this.errorMessage.length != 0)
            this.errorMessage += 'Active Primary Contact already Exist';
          else this.errorMessage = 'Active Primary Contact already Exist';
          return false;
        }
      }
      return true;
    } else return true;
  }

  onSubmit() {
    if (this.menuId == 32) {
      // this is for contact details
      if (this.dynamicForm.valid) {
        let formPayloadTest = {
          ...this.dynamicMatForm.value,
          ...this.dynamicRadioCheckboxForm.value,
        };
        if(formPayloadTest.ContactTypeId == '1') {
          formPayloadTest.PrimaryContact = false;
          formPayloadTest.Status = false;
        }
        const isEmailValid = this.checkEmailValid(
          formPayloadTest.Email,
          this.existingContacts,
          this.operation,
          this.payload
        );
        const isContactStatusValid = this.checkPrimaryContact(
          this.operation,
          this.payload,
          this.existingContacts,
          formPayloadTest
        );
        if (isEmailValid == true && isContactStatusValid == true) {
          this.contactDetails.emit(formPayloadTest);
          this.vendorSubmitted.emit(true);
        }
      }
    } else {
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
        formPayloadTest.vendorContactDetails = this.rowData;
        delete formPayloadTest.parentVendorId;
        if (this.operation === 'create') {
          delete formPayloadTest.id;
        }
        var checkContectDetails = formPayloadTest['vendorContactDetails'];
        if (
          checkContectDetails == undefined ||
          checkContectDetails.length <= 0
        ) {
          this.showSnackbar(
            'Error!! Please add at least one active contact details.'
          );
          this.loaderService.setDisableLoading();
          return false;
        }
        if(checkContectDetails.filter(a=>a.PrimaryContact==true).length<=0){
          this.showSnackbar("Error!! Please add at least one primary contact");
          this.loaderService.setDisableLoading();
          return false;
        }
        if(checkContectDetails.filter(a=>a.Status==true).length<=0)
        {
          this.showSnackbar("Error!! Please add at least one active contact details.");
          this.loaderService.setDisableLoading();
          return false;
        }
        this.contactSubmitted.emit(true);
        this.loaderService.setShowLoading();
        this.apiService
          .post(`api/master-data?menuId=${this.menuId}`, formPayloadTest)
          .subscribe(
            (response) => {
              this.loaderService.setDisableLoading();
              if (
                response.status != 'Record added successfully' &&
                response.status != 'Record updated successfully' &&
                response.status != 'Record added successfully'
              ) {
                this.vendorSubmitted.emit(response.data?.Id);
                if (this.menuId === 32) {
                  this.contactDetails.emit(response.data);
                }
                this.showSnackbar(response.status);
                this.isVendorFromSubmitted.emit(true);
              } else {
               
                this.showSnackbar(response.status);
                this.router.navigate(['/dashboard'], {
                  queryParams: { routertitle: JSON.stringify('Vendor Master') },
                });
              }
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
      ...this.dynamicRadioCheckboxForm.value,
    };
    this.contactDetails.emit(formPayload);
    this.vendorSubmitted.emit(true);
  }

  setFormData() {
    if (this.formFields.length > 0) {
      for (const field of this.formFields) {              
        this.dynamicMatForm.get(field.name)?.setValue(field?.value);
        if(this.menuId == 4){
          debugger
          if(this.payload.BusinessSupport?.toLowerCase() == 'bgv'){
            if(field.name == "SubcontractAllowed" || field.name == "DomainID"){
            
              field.isRequired = true;
              this.dynamicMatForm.get(field.name).setValidators(Validators.required)
              this.dynamicMatForm.get(field.name).updateValueAndValidity()
            }
          }
         
        }
        if(this.menuId == 32){
          if(field.name == "ContactTypeId"){
          if (field.value == '2') {
            this.showContactType = true;
            for (let item of this.formFields) {
              if (
                item.name == 'DomainResponsibility' ||
                item.name == 'EscalateLevel'
              ) {
                this.dynamicMatForm.removeControl('DomainResponsibility');
                this.dynamicMatForm.removeControl('EscalateLevel');
                item.isVisible = false;
              }if(item.name == "Note"){
                item.isVisible = true;
                if (!this.dynamicMatForm.contains(item.name)) {
                  this.dynamicMatForm.addControl(
                    item.name,
                    this.formBuilder.control('', Validators.required)
                  );
                }
              }
            }
            for(let item of this.radioCheckboxformFields){
              if(item.name == 'PrimaryContact'){
                item.isVisible = true;
              }
            }
          } else if (field.value == '1') {
            this.showContactType = false;
            for (let item of this.formFields) {
              if (
                item.name == 'DomainResponsibility' ||
                item.name == 'EscalateLevel'
              ) {
                item.isVisible = true;
                if (!this.dynamicMatForm.contains(item.name)) {
                  this.dynamicMatForm.addControl(
                    item.name,
                    this.formBuilder.control('', Validators.required)
                  );
                }
              }
              if(item.name == 'Note' || item.name == 'PrimaryContact'){
                this.dynamicMatForm.removeControl('Note');
                item.isVisible = false;
               
              }
            }
            for(let item of this.radioCheckboxformFields){
              if(item.name == 'PrimaryContact'){
                item.isVisible = false;
              }
            }
          }
        }
        }        
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
          if( field.name != 'DomainID' && field.isRequired){
            validators.push(
              Validators.required,
              Validators.minLength(field?.minLength | 1)
            );          
          } 
        } 
        else if (field.validationType === 'dropdown'){
          if(field.name != 'ParentVendorId' &&
          field.name != 'SubcontractAllowed'){
            validators.push(Validators.required);
          }
        } 
        else if (field.validationType === 'date') {
          validators.push(Validators.required);
        } else if (field.validationType === 'none') {
          validators.push(Validators.minLength(field?.minLength | 1));
        }
      }

      //Disable email id for vendor contact details
      if(field.name == "Email" ){
        if(this.operation == "update")
        {
          field.readOnly  =  true
        } 
        else{
          field.readOnly  =  false;
        } 
      }

      if (field.name === 'validityStart' || field.name === 'periodStart') {
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
            { value: [], disabled: field.readOnly },
            Validators.required
          )
        );
      } else if (field.validationType === 'radioButton') {
        this.dynamicRadioCheckboxForm.addControl(
          field.name,
          this.formBuilder.control(
            { value: false, disabled: field.readOnly },
            Validators.required
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

  onChangeCheckbox(name: string, id: string, isChecked: boolean) {
    let getSelectedCheckboxObject = this.radioCheckboxformFields.find(
      (item: any) => item.name === name
    );
    let getSelectedCheckbox = this.dynamicRadioCheckboxForm.get(name)?.value;
    if (isChecked) {
      getSelectedCheckbox.push(id);
      getSelectedCheckboxObject.checkBoxOptions.forEach((option: any) => {
        if (getSelectedCheckbox.includes(option.id)) {
          option.value = true;
        }
      });
    } else {
      const idIndexes = getSelectedCheckbox.findIndex(
        (ids: string) => ids === id
      );

      if (idIndexes > -1) {
        getSelectedCheckbox.splice(idIndexes, 1);
      }
      getSelectedCheckbox = idIndexes;
      getSelectedCheckboxObject.checkBoxOptions.forEach((option: any) => {
        if (getSelectedCheckbox.includes(option.id)) {
          option.value = false;
        }
      });
    }
    this.dynamicRadioCheckboxForm.get(name)?.setValue(getSelectedCheckbox);
  }

  setMinValidityEndDate() {
    return this.minStartValidityEndDate;
  }

  setMinPeriodEndDate() {
    return this.minStartPeriodEndDate;
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
          ['validityStart', 'validityEnd', 'periodStart', 'periodEnd'].includes(
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
    this.isVendorFromSubmitted.emit(false);
    this.contactSubmitted.emit(false);
    if (this.menuId === 4) {
      this.router.navigate(['/dashboard'], {
        queryParams: { routertitle: JSON.stringify('Vendor Master') },
      });
    }
  }

  editModeOn() {
    this.readOnly = false;
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  getValue(field: any): string {
    if (field.dropdownList != null) {
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