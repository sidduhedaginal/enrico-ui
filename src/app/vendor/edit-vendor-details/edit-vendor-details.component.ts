import { Component, Input, OnInit } from '@angular/core';
import { ContactDetailsComponent } from '../contact-details/contact-details.component';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { VendorDetailsService } from '../services/vendor-details.service';
import { HomeService } from 'src/app/services/home.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'lib-edit-vendor-details',
  templateUrl: './edit-vendor-details.component.html',
  styleUrls: ['./edit-vendor-details.component.css'],
})
export class EditVendorDetailsComponent implements OnInit {
  title: string = '';
  VendorDeatilsForm: any;
  @Input() vendorDetails: any;
  vendor_types: any;
  classifications: any;
  businessSupports: any;
  currency_list: any;
  currencys = ['INR', 'VND'];
  status_list: any;
  parentVendor_list: any;
  disabled: boolean = true;
  loader: boolean;
  constructor(
    private dialogRef: MatDialogRef<ContactDetailsComponent>,
    private fb: FormBuilder,
    private vendorDetailsService: VendorDetailsService,
    private homeService: HomeService,
    private loaderService: LoaderService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }

  ngOnInit(): void {
    this.vendorDetailsService
      .getVendorDropdownValues()
      .subscribe((response: any) => {
        if (response.data != null) {
          this.vendor_types = response.data.vendorType;
          this.classifications = response.data.classification;
          this.businessSupports = response.data.businessSupport;
          this.status_list = response.data.vendorStatus;
          this.currency_list = response.data.currency;
          this.parentVendor_list = response.data.masterVendors;
        }
      });
    if (this.vendorDetails != null) {
      this.VendorDeatilsForm = this.fb.group({
        vendorName: [this.vendorDetails.vendorName, Validators.required],
        vendorSAPID: [
          { value: this.vendorDetails.vendorSAPID, disabled: true },
          Validators.required,
        ],
        vendorType: [this.vendorDetails.vendorTypeID, Validators.required],
        classification: [
          this.vendorDetails.classificationID,
          Validators.required,
        ],
        businessSupport: [
          this.vendorDetails.businessSupportID,
          Validators.required,
        ],
        parentVendor: [
          { value: this.vendorDetails.parentVendorId, disabled: true },
        ],
        currency: [this.vendorDetails.vendorCurrencyId, Validators.required],
        country: [this.vendorDetails.vendorCountryName, Validators.required],
        state: [this.vendorDetails.vendorRegionName, Validators.required],
        city: [this.vendorDetails.vendorAddressCity, Validators.required],
        status: [this.vendorDetails.statusID, Validators.required],
        address: [this.vendorDetails.vendorAddressStreet, Validators.required],
      });
    }
  }
  cancel() {
    this.dialogRef.close({ data: null });
  }
  save() {
    this.loaderService.setShowLoading();
    let newVendorDetails = {
      vendorSAPID: this.VendorDeatilsForm.get('vendorSAPID').value,
      vendorName: this.VendorDeatilsForm.get('vendorName').value,
      parentVendorId: this.VendorDeatilsForm.get('parentVendor').value,
      vendorTypeID: this.VendorDeatilsForm.get('vendorType').value,
      businessSupportID: this.VendorDeatilsForm.get('businessSupport').value,
      vendorCurrencyId: this.VendorDeatilsForm.get('currency').value,
      vendorCountryName: this.VendorDeatilsForm.get('country').value,
      vendorRegionName: this.VendorDeatilsForm.get('state').value,
      vendorAddressCity: this.VendorDeatilsForm.get('city').value,
      vendorAddressStreet: this.VendorDeatilsForm.get('address').value,
      classificationID: this.VendorDeatilsForm.get('classification').value,
      statusID: this.VendorDeatilsForm.get('status').value,
    };
    this.vendorDetailsService.updateVendorDetails(newVendorDetails).subscribe(
      (response: any) => {
        if (response.data[0].isSuccess) {
          this.loaderService.setDisableLoading();
          this.dialogRef.close({ data: response.data[0].message });
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }
}
