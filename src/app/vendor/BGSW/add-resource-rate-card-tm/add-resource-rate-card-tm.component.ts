import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HomeService } from 'src/app/services/home.service';
import { VendorDetailsService } from '../../services/vendor-details.service';
import { SowjdDetailsService } from '../../services/sowjd-details.service';
import { VendorService } from '../../services/vendor.service';
import { LoaderService } from 'src/app/services/loader.service';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';

@Component({
  selector: 'app-add-resource-rate-card-tm',
  templateUrl: './add-resource-rate-card-tm.component.html',
  styleUrls: ['./add-resource-rate-card-tm.component.scss'],
})
export class AddResourceRateCardTmComponent {
  skillsets: any = [];
  grades: any[] = [];
  value: any;
  resorceForm: any;
  tpId: any;
  resourceInput: any;
  isCreate: boolean = false;
  title: string = '';
  vendorId: string;
  unitRate = '';
  minDate: Date;
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<AddResourceRateCardTmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private vendorDetailsService: VendorDetailsService,
    private sowjdDetailsService: SowjdDetailsService,
    private homeService: HomeService,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private dialog: MatDialog,
    public sowjdService: sowjdService
  ) {
    this.vendorId = this.vendorService.vendorId;
  }

  ngOnInit(): void {
    this.minDate = this.sowjdService.addNumberOfdays(new Date(), 1);
    this.vendorDetailsService
      .getGradeDetails(this.vendorId)
      .subscribe((response: any) => {
        this.grades = response.data;
      });

    this.resorceForm = this.fb.group({
      skillset: [this.data.sowjdSkillSets.skillsetName, Validators.required],
      grade: [this.data.sowjdSkillSets.gradeName, Validators.required],
      quantity: ['', Validators.required],
      duration: [this.data.sowjdSkillSets.duration, Validators.required],
      unitOfMeasurement: ['MON'],
      resourceOnboardingDate: [this.minDate, Validators.required],
    });
  }

  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  };

  changedEventValue(skillsetId: MatAutocompleteSelectedEvent) {
    this.resorceForm.get('skillset')?.setValue(skillsetId);
  }

  formatDates(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    const dateVal = yyyy + '-' + mm + '-' + dd;
    return dateVal;
  }

  onSubmit() {
    this.resorceForm.markAllAsTouched();
    if (this.resorceForm.invalid) return;

    let totalQuantity = 0;
    this.data.resourceList.forEach((item) => {
      if (item.sowjdSkillsetId === this.data.sowjdSkillSets.id) {
        totalQuantity += item.quantity;
      }
    });

    const remainingQuantity =
      this.data.sowjdSkillSets.quantity >= totalQuantity
        ? this.data.sowjdSkillSets.quantity - totalQuantity
        : 0;

    if (remainingQuantity === 0) {
      this.errorMessage = `No. of Resource are already fulfilled, you can't enter anymore`;
      return;
    } else if (this.resorceForm.get('quantity').value > remainingQuantity) {
      this.errorMessage = `Please enter No. of Resource less than or equal to ${remainingQuantity}`;
      return;
    }

    const startdate = new Date(this.resorceForm.value.resourceOnboardingDate);
    const resourceOnboardingDate = this.formatDates(
      this.resorceForm.value.resourceOnboardingDate
    );

    if (startdate >= new Date(this.data.endDate)) {
      this.errorMessage =
        'Resource Onboarding date should be less than the Project End date';
      return false;
    }

    this.loaderService.setShowLoading();

    if (this.data.flag == 1) {
      // Flag = 1, Sign Off
      let input = {
        technicalProposalId: this.data.id,
        skillSetID: this.data.sowjdSkillSets.skillsetId,
        gradeID: this.data.sowjdSkillSets.gradeId,
        quantity: this.resorceForm.get('quantity').value,
        duration: this.data.sowjdSkillSets.duration,
        unitPrice: 1,
        unitOfMeasurement: this.resorceForm.get('unitOfMeasurement').value,
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
        resourceOnboardingDate: resourceOnboardingDate,
        sowjdSkillsetId: this.data.sowjdSkillSets.id,
      };

      this.vendorService.createResource(input).subscribe((response: any) => {
        if (response.status == 'success') {
          this.loaderService.setDisableLoading();
          if (response.data.vendorTPSkillSetValidations.returnCode === 0) {
            this.dialogRef.close({ data: true });
          }
          if (response.data.vendorTPSkillSetValidations.returnCode === 1) {
            this.errorMessage =
              response.data.vendorTPSkillSetValidations.message;
          }
          if (response.data.vendorTPSkillSetValidations.returnCode === 2) {
            this.errorMessage =
              response.data.vendorTPSkillSetValidations.message;
          }
        }
      });
    } else {
      // RFQ
      let input = {
        rfqId: this.data.id,
        skillSetID: this.data.sowjdSkillSets.skillsetId,
        gradeID: this.data.sowjdSkillSets.gradeID,
        quantity: this.resorceForm.get('quantity').value,
        duration: this.data.sowjdSkillSets.duration,
        unitPrice: 1,
        unitOfMeasurement: this.resorceForm.get('unitOfMeasurement').value,
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
        resourceOnboardingDate: resourceOnboardingDate,
        sowjdSkillsetId: this.data.sowjdSkillSets.id,
      };

      this.sowjdDetailsService
        .createResource(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.loaderService.setDisableLoading();
            if (response.data.vendorSkillSetValidations.returnCode === 0) {
              this.dialogRef.close({ data: true });
            }
            if (response.data.vendorSkillSetValidations.returnCode === 1) {
              this.errorMessage =
                response.data.vendorSkillSetValidations.message;
            }
            if (response.data.vendorSkillSetValidations.returnCode === 2) {
              this.errorMessage =
                response.data.vendorSkillSetValidations.message;
            }
          }
        });
    }
  }
  cancel() {
    this.dialogRef.close({ data: null });
  }
  popMessageWithAction(title: string, message: string) {
    const dialogRef = this.dialog.open(popupMessageComponent, {
      width: '30vw',
      data: {
        title,
        message,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }
}
