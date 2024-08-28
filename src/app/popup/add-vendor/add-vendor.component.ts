import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';

@Component({
  selector: 'app-add-vendor',
  templateUrl: './add-vendor.component.html',
  styleUrls: ['./add-vendor.component.scss'],
})
export class AddVendorComponent {
  addVendorForm: FormGroup;
  vendorList: any;

  constructor(
    private dialogRef: MatDialogRef<AddVendorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sowjdDhService: SowjdDhService
  ) {}

  ngOnInit(): void {
    this.sowjdDhService
      .vendorSuggestions(this.data.sowJdId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.vendorList = response.data;
        }
      });

    this.addVendorForm = this.fb.group({
      newVendor: ['', Validators.required],
      suggestion: ['', Validators.required],
    });
  }

  onSave() {
    this.addVendorForm.markAllAsTouched();
    if (!this.addVendorForm.valid) return;

    const addVendor = this.vendorList.find(
      (vendor: any) => this.addVendorForm.value.newVendor === vendor.vendorId
    );

    addVendor['suggestion'] = this.addVendorForm.value.suggestion;

    this.dialogRef.close({ data: addVendor });
  }

  cancel() {
    this.dialogRef.close({ data: null });
  }
}
