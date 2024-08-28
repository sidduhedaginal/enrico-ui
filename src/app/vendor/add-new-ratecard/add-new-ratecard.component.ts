import { Component, OnInit } from '@angular/core';
import { RateCardMasterService } from '../services/rate-card-master.service';
import { FormBuilder, Validators } from '@angular/forms';
import { VendorDetailsService } from '../services/vendor-details.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HomeService } from 'src/app/services/home.service';
import { config } from 'src/app/config';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'lib-add-new-ratecard',
  templateUrl: './add-new-ratecard.component.html',
  styleUrls: ['./add-new-ratecard.component.css'],
})
export class AddNewRatecardComponent implements OnInit {
  skillset_list: any[] = [];
  vendor_list: any[] = [];
  grade_list: any[] = [];
  cluster_list: any[] = [];
  location_list: any[] = [];
  currency_list: any[] = [];
  rateCardForm: any;
  rateCardDetails: any;
  isCreate: boolean = false;
  title: string = '';
  button_name: string = '';
  company_detail: any = [];
  vendorid: string;
  disabled: boolean = true;
  loader: boolean;
  minDate: any;
  today = new Date();
  isDisabled: boolean = true;
  constructor(
    private dialogRef: MatDialogRef<AddNewRatecardComponent>,
    private rateCardMasterService: RateCardMasterService,
    private fb: FormBuilder,
    private vendorDetailsService: VendorDetailsService,
    private homeService: HomeService,
    private vendorService: VendorService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
    this.vendorid = this.vendorService.vendorId;
  }

  ngOnInit(): void {
    this.vendorDetailsService
      .getVendorDropdownValues()
      .subscribe((response: any) => {
        if (response.data != null) {
          this.skillset_list = response.data.masterSkillsets;
          this.vendor_list = response.data.masterVendors;
          this.grade_list = response.data.masterGrade;
          this.cluster_list = response.data.clusters;
          this.location_list = response.data.masterLocationMode;
          this.currency_list = response.data.currency;
          this.getVendor(this.vendorid);
        }
      });

    this.rateCardMasterService
      .getCompanyVendorID(this.vendorid)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.company_detail = response.data[0];
          this.rateCardForm
            .get('companyCode')
            ?.setValue(this.company_detail.companyCode);
          this.rateCardForm
            .get('currency')
            ?.setValue(this.company_detail.vendorCurrencyId);
        }
      });
    this.isCreate = this.rateCardDetails.isCreate;
    if (this.isCreate) {
      this.minDate = new Date();
      this.button_name = 'Save';
      this.title = 'Add New Rate Card';
      this.rateCardForm = this.fb.group({
        companyCode: [{ value: '', disabled: true }, Validators.required],
        skillset: ['', Validators.required],
        vendor: [{ value: '', disabled: true }, Validators.required],
        vendorSAPID: [{ value: '', disabled: true }, Validators.required],
        locationMode: ['', Validators.required],
        currency: ['', Validators.required],
        validityStart: ['', Validators.required],
        validityEnd: ['', Validators.required],
        grade0: ['', Validators.required],
        grade1: ['', Validators.required],
        grade2: ['', Validators.required],
        grade3: ['', Validators.required],
        grade4: ['', Validators.required],
      });
    } else {
      let isStartDateDisable =
        new Date(this.rateCardDetails.rateCard.validityStart).getTime() >=
        this.today.getTime()
          ? false
          : true;
      let isEndDateDisable =
        new Date(this.rateCardDetails.rateCard.validityEnd).getTime() >=
        this.today.getTime()
          ? false
          : true;

      this.button_name = 'Update';
      this.title = 'Edit New Rate Card';
      this.minDate = new Date();
      this.rateCardForm = this.fb.group({
        companyCode: [
          { value: this.rateCardDetails.rateCard.companyCode, disabled: true },
          Validators.required,
        ],
        skillset: [
          this.rateCardDetails.rateCard.skillsetId,
          Validators.required,
        ],
        vendor: [
          { value: this.rateCardDetails.rateCard.vendorId, disabled: true },
          Validators.required,
        ],
        vendorSAPID: [
          { value: this.rateCardDetails.rateCard.vendorSAPID, disabled: true },
          Validators.required,
        ],
        locationMode: [
          this.rateCardDetails.rateCard.locationId,
          Validators.required,
        ],
        currency: [
          this.rateCardDetails.rateCard.currencyId,
          Validators.required,
        ],
        validityStart: [
          {
            value: this.rateCardDetails.rateCard.validityStart,
            disabled: isStartDateDisable,
          },
          Validators.required,
        ],
        validityEnd: [
          {
            value: this.rateCardDetails.rateCard.validityEnd,
            disabled: isEndDateDisable,
          },
          Validators.required,
        ],
        grade0: [this.rateCardDetails.rateCard.grade0, Validators.required],
        grade1: [this.rateCardDetails.rateCard.grade1, Validators.required],
        grade2: [this.rateCardDetails.rateCard.grade2, Validators.required],
        grade3: [this.rateCardDetails.rateCard.grade3, Validators.required],
        grade4: [this.rateCardDetails.rateCard.grade4, Validators.required],
      });
    }
  }
  public validStartDate = new Date();
  public validEndtDate = new Date();

  getVendor(vendorid: any) {
    let vendor = this.vendor_list.find(
      (s: any) => s.id.toLowerCase() == vendorid.toLowerCase()
    );
    this.rateCardForm.get('vendor')?.setValue(vendor.vendorName);
    this.rateCardForm.get('vendorSAPID')?.setValue(vendor.vendorSAPID);
  }
  skillsetChange(event: any) {
    let skillset = this.skillset_list.find((s: any) => s.id == event.value);
    let cluster = this.cluster_list.find(
      (c: any) => c.id == skillset.clusterId
    );
    this.rateCardForm.get('cluster')?.setValue(cluster.clusterName);
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  save() {
    let sDate = new Date(this.rateCardForm.get('validityStart').value);
    sDate.setDate(sDate.getDate() + 1);

    let eDate = new Date(this.rateCardForm.get('validityEnd').value);
    eDate.setDate(eDate.getDate() + 1);

    if (this.isCreate) {
      let input = {
        vendorId: this.vendorid,
        companyId: this.company_detail.companyId,
        skillsetId: this.rateCardForm.get('skillset').value,
        currencyId: this.rateCardForm.get('currency').value,
        validityStart: sDate,
        validityEnd: eDate,
        grade0: this.rateCardForm.get('grade0').value,
        grade1: this.rateCardForm.get('grade1').value,
        grade2: this.rateCardForm.get('grade2').value,
        grade3: this.rateCardForm.get('grade3').value,
        grade4: this.rateCardForm.get('grade4').value,
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
        locationId: this.rateCardForm.get('locationMode').value,
        isActive: true,
      };
      this.rateCardMasterService
        .createRateCard(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.dialogRef.close({ data: 'success' });
          }
        });
    } else {
      let input = {
        id: this.rateCardDetails.rateCard.id,
        vendorId: this.vendorid,
        companyId: this.company_detail.companyId,
        skillsetId: this.rateCardForm.get('skillset').value,
        currencyId: this.rateCardForm.get('currency').value,
        validityStart: sDate,
        validityEnd: eDate,
        grade0: this.rateCardForm.get('grade0').value,
        grade1: this.rateCardForm.get('grade1').value,
        grade2: this.rateCardForm.get('grade2').value,
        grade3: this.rateCardForm.get('grade3').value,
        grade4: this.rateCardForm.get('grade4').value,
        locationId: this.rateCardForm.get('locationMode').value,
        isActive: true,
      };
      this.rateCardMasterService
        .updateRateCard(input)
        .subscribe((response: any) => {
          if (response?.data[0].isSuccess) {
            this.dialogRef.close({ data: response.data[0].message });
          }
        });
    }
  }
  cancel() {
    this.dialogRef.close({ data: null });
  }
}
