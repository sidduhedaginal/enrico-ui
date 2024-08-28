import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from 'src/app/services/loader.service';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';

@Component({
  selector: 'app-float-rfq',
  templateUrl: './float-rfq.component.html',
  styleUrls: ['./float-rfq.component.scss'],
})
export class FloatRfqComponent {
  addVendorForm: FormGroup;
  vendorList: any;
  vendorId: string = '';
  sowJdDetail: any;

  constructor(
    private dialogRef: MatDialogRef<FloatRfqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private sowjdDhService: SowjdDhService
  ) {}

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.sowjdDhService
      .vendorSuggestions(this.data.sowJdId)
      .subscribe((response: any) => {
        if (response.data) {
          this.loaderService.setDisableLoading();
          this.vendorList = response.data;
        }
      });

    this.addVendorForm = this.fb.group({
      vendorId: ['', Validators.required],
      remarks: ['', Validators.required],
    });
    this.getSowjdDetails();
  }

  getSowjdDetails() {
    this.sowjdDhService
      .getSowJdRequestById(this.data.sowJdId)
      .subscribe((sowJdData: any) => {
        if (sowJdData.data) {
          this.sowJdDetail = sowJdData.data.sowJdEntityResponse;
        }
      });
  }
  pacthVendorDetail(event: any) {
    const addVendor = this.vendorList.find(
      (vendor: any) => event.value === vendor.vendorId
    );

    this.vendorId = addVendor.sapId;
  }

  changedEventValue(vendor: MatAutocompleteSelectedEvent) {
    this.addVendorForm.get('vendorId')?.setValue(vendor['vendorId']);
    this.vendorId = vendor['sapId'];
  }

  onSubmit() {
    this.addVendorForm.markAllAsTouched();
    if (!this.addVendorForm.valid) return;

    const VendorDetail: any = {
      ...this.addVendorForm.value,
    };
    // VendorDetail['sowJdId'] = this.sowJdId;
    this.dialogRef.close({
      data: VendorDetail,
    });
  }

  // onSubmit() {
  //   this.addVendorForm.markAllAsTouched();
  //   if (!this.addVendorForm.valid) return;

  //   // const addVendor = this.vendorList.find(
  //   //   (vendor: any) => this.addVendorForm.value.newVendor === vendor.vendorId
  //   // );

  //   const remarks = this.addVendorForm;

  //   this.dialogRef.close({ data: this.addVendorForm });
  // }

  cancel() {
    this.dialogRef.close({ data: null });
  }
}
