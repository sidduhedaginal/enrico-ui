import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { VendorDetailsService } from '../services/vendor-details.service';
import { ThemePalette } from '@angular/material/core';
import { HomeService } from 'src/app/services/home.service';
import { config } from 'src/app/config';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'lib-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css'],
})
export class ContactDetailsComponent implements OnInit {
  ContactDeatilsForm: any;
  contactInput: any;
  status: string = 'Active';
  countryCodes: any = ['+91', '+84'];
  isCreate: boolean = false;
  status_list: any = [
    { value: true, status: 'Active' },
    { value: false, status: 'Inactive' },
  ];
  escalation_Levels: any = [];
  title = 'Add Contact Details';
  primary: ThemePalette = 'primary';

  constructor(
    private dialogRef: MatDialogRef<ContactDetailsComponent>,
    private fb: FormBuilder,
    private vendorDetailsService: VendorDetailsService,
    private homeService: HomeService,
    private vendorService: VendorService
  ) {}

  ngOnInit(): void {
    this.vendorDetailsService
      .getVendorDropdownValues()
      .subscribe((response: any) => {
        if (response.data != null) {
          this.escalation_Levels = response.data.escalationLevel;
        }
      });
    this.isCreate = this.contactInput.IsCreate;
    if (!this.isCreate) {
      this.title = 'Update Contact Details';
      this.ContactDeatilsForm = this.fb.group({
        contactName: [
          this.contactInput.contact.contactName,
          Validators.required,
        ],
        email: [this.contactInput.contact.email, Validators.required],
        countryCode: [
          this.contactInput.contact.countryCode,
          Validators.required,
        ],
        mobile: [this.contactInput.contact.mobile, Validators.required],
        designation: [
          this.contactInput.contact.designation,
          Validators.required,
        ],
        domainResponsibility: [
          this.contactInput.contact.domainResponsibility,
          Validators.required,
        ],
        escalationLevel: [
          this.contactInput.contact.escalateLevel,
          Validators.required,
        ],
        status: [this.contactInput.contact.status, Validators.required],
        isPrimaryContact: [
          this.contactInput.contact.primaryContact,
          Validators.required,
        ],
        notes: [this.contactInput.contact.note],
      });
    } else {
      this.ContactDeatilsForm = this.fb.group({
        contactName: ['', Validators.required],
        email: ['', Validators.required],
        countryCode: ['', Validators.required],
        mobile: ['', Validators.required],
        designation: ['', Validators.required],
        domainResponsibility: ['', Validators.required],
        escalationLevel: ['', Validators.required],
        status: ['', Validators.required],
        isPrimaryContact: [true, Validators.required],
        notes: [''],
      });
    }
  }
  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  save() {
    if (this.isCreate) {
      let contact = {
        //id:this.contactInput.contact?.id?this.contactInput.contact.id:0,
        vendorId: this.vendorService.vendorId,
        contactName: this.ContactDeatilsForm.get('contactName').value,
        email: this.ContactDeatilsForm.get('email').value,
        countryCode: this.ContactDeatilsForm.get('countryCode').value,
        mobile: this.ContactDeatilsForm.get('mobile').value,
        designation: this.ContactDeatilsForm.get('designation').value,
        domainResponsibility: this.ContactDeatilsForm.get(
          'domainResponsibility'
        ).value,
        escalateLevel: this.ContactDeatilsForm.get('escalationLevel').value,
        status: this.ContactDeatilsForm.get('status').value,
        primaryContact: this.ContactDeatilsForm.get('isPrimaryContact').value,
        note: this.ContactDeatilsForm.get('notes').value,
        isDeleted: false,
      };

      this.vendorDetailsService
        .addContactDetails(contact)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.dialogRef.close({ data: 'success' });
          }
        });
    } else {
      let contact = {
        id: this.contactInput.contact.id,
        contactName: this.ContactDeatilsForm.get('contactName').value,
        email: this.ContactDeatilsForm.get('email').value,
        countryCode: this.ContactDeatilsForm.get('countryCode').value,
        mobile: this.ContactDeatilsForm.get('mobile').value,
        designation: this.ContactDeatilsForm.get('designation').value,
        domainResponsibility: this.ContactDeatilsForm.get(
          'domainResponsibility'
        ).value,
        escalateLevel: this.ContactDeatilsForm.get('escalationLevel').value,
        status: this.ContactDeatilsForm.get('status').value,
        primaryContact: this.ContactDeatilsForm.get('isPrimaryContact').value,
        note: this.ContactDeatilsForm.get('notes').value,
        isDeleted: false,
      };

      this.vendorDetailsService
        .updateContactDetails(contact)
        .subscribe((response: any) => {
          if (response.data[0].isSuccess) {
            this.dialogRef.close({ data: response.data[0].message });
          }
        });
    }
  }
  cancel() {
    this.dialogRef.close({ data: null });
  }
}
