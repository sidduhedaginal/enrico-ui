import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HomeService } from 'src/app/services/home.service';
import { LoaderService } from 'src/app/services/loader.service';
import { VendorService } from 'src/app/vendor/services/vendor.service';

@Component({
  selector: 'app-add-odc',
  templateUrl: './add-odc.component.html',
  styleUrls: ['./add-odc.component.scss'],
})
export class AddOdcComponent {
  odcList: any = [];
  loader: boolean;
  odcForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddOdcComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private homeService: HomeService,
    private vendorService: VendorService,
    private loaderService: LoaderService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.vendorService.getODCList(this.data).subscribe((response: any) => {
      this.odcList = response.data.odcMasters;
      this.loaderService.setDisableLoading();
    });

    this.odcForm = this.fb.group({
      odcMaster: ['', Validators.required],
      odcHeadCount: ['', Validators.required],
    });
  }

  isNumberKey(evt) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = evt.target.value + String.fromCharCode(evt.charCode);

    if (!reg.test(input)) {
      evt.preventDefault();
    }
  }

  onSubmit() {
    this.odcForm.markAllAsTouched();
    if (!this.odcForm.valid) return;

    const odcObj = {
      odC_ID: this.odcForm.value.odcMaster.id,
      odcName: this.odcForm.value.odcMaster.odcName,
      odcCode: this.odcForm.value.odcMaster.odcCode,
      odC_HeadCount: +this.odcForm.value.odcHeadCount,
      odC_Cost:
        this.odcForm.value.odcMaster.odcCostPerHeadCount === null
          ? 0
          : +this.odcForm.value.odcMaster.odcCostPerHeadCount,
      total_Cost:
        this.odcForm.value.odcMaster.odcCostPerHeadCount === null
          ? 0
          : +this.odcForm.value.odcMaster.odcCostPerHeadCount *
            this.odcForm.value.odcHeadCount,
    };

    this.dialogRef.close({ data: odcObj });
  }
  cancel() {
    this.dialogRef.close({ data: null });
  }
}
