import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { HomeService } from 'src/app/services/home.service';
import { config } from 'src/app/config';
import { VendorDetailsService } from '../../services/vendor-details.service';
import { SowjdDetailsService } from '../../services/sowjd-details.service';
import { VendorService } from '../../services/vendor.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';

@Component({
  selector: 'app-add-resource-rate-card-wp',
  templateUrl: './add-resource-rate-card-wp.component.html',
  styleUrls: ['./add-resource-rate-card-wp.component.css'],
})
export class AddResourceRateCardWpComponent {
  skillsets: any = [];
  grades: any[] = [];
  value: any;
  resorceForm: any;
  tpId: any;
  resourceInput: any;
  isCreate: boolean = false;
  title: string = '';
  vendorId: string;
  unitOfMeasurement = 'MON';
  unitRate = '';
  minDate: Date;
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<AddResourceRateCardWpComponent>,
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

  changedEventValue(skillsetId: MatAutocompleteSelectedEvent) {
    this.resorceForm.get('skillset')?.setValue(skillsetId);
  }

  ngOnInit(): void {
    this.minDate = this.sowjdService.addNumberOfdays(new Date(), 1);

    this.vendorDetailsService
      .getGradeDetails(this.vendorId)
      .subscribe((response: any) => {
        this.grades = response.data;
      });
    this.sowjdDetailsService
      .getRFQSkillsets(this.data.id)
      .subscribe((response: any) => {
        this.skillsets = response.data;
      });

    this.resorceForm = this.fb.group({
      skillset: ['', Validators.required],
      grade: ['', Validators.required],
      quantity: ['', Validators.required],
      resourceOnboardingDate: [this.minDate, Validators.required],
    });
  }

  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  };

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

    // Condition - allow only Skillset and Grade were added in work packages
    const workPackage = this.data.workPackageList.find((workpackage: any) => {
      return (
        workpackage.skillSetId === this.resorceForm.get('skillset').value &&
        workpackage.gradeId === this.resorceForm.get('grade').value
      );
    });

    if (workPackage !== undefined) {
      const startdate = new Date(
        this.resorceForm.get('resourceOnboardingDate').value
      );
      const resourceOnboardingDate = this.formatDates(
        this.resorceForm.get('resourceOnboardingDate').value
      );

      if (startdate >= new Date(this.data.endDate)) {
        this.errorMessage =
          'Resource Onboarding date should be less than the Project End date';
        return false;
      }

      this.loaderService.setShowLoading();

      if (this.data.flag === 1) {
        let input = {
          technicalProposalId: this.data.id,
          skillSetID: this.resorceForm.get('skillset').value,
          gradeID: this.resorceForm.get('grade').value,
          quantity: this.resorceForm.get('quantity').value,
          duration: 1,
          unitPrice: 1,
          unitOfMeasurement: '',
          createdBy: '',
          modifiedBy: '',
          isDeleted: false,
          pmo: '0',
          resourceOnboardingDate: resourceOnboardingDate,
        };

        this.vendorService
          .createWorkPackageResource(input)
          .subscribe((response: any) => {
            if (response.status == 'success') {
              this.loaderService.setDisableLoading();
              if (
                response.data.vendorTPWPSkillSetValidations.returnCode === 0
              ) {
                this.dialogRef.close({ data: true });
              } else if (
                response.data.vendorTPWPSkillSetValidations.returnCode === 1
              ) {
                this.errorMessage =
                  response.data.vendorTPWPSkillSetValidations.message;
              } else if (
                response.data.vendorTPWPSkillSetValidations.returnCode === 2
              ) {
                this.errorMessage =
                  response.data.vendorTPWPSkillSetValidations.message;
              }
            }
          });
      } else {
        // RFQ
        let input = {
          rfqId: this.data.id,
          skillSetID: this.resorceForm.get('skillset').value,
          gradeID: this.resorceForm.get('grade').value,
          quantity: this.resorceForm.get('quantity').value,
          duration: 1,
          unitPrice: 1,
          unitOfMeasurement: '',
          createdBy: '',
          modifiedBy: '',
          isDeleted: false,
          resourceOnboardingDate: resourceOnboardingDate,
        };
        this.sowjdDetailsService
          .createWorkPackageResource(input)
          .subscribe((response: any) => {
            if (response.status == 'success') {
              this.loaderService.setDisableLoading();
              if (response.data.vendorSkillSetWPValidations.returnCode === 0) {
                this.dialogRef.close({ data: true });
              } else if (
                response.data.vendorSkillSetWPValidations.returnCode === 1
              ) {
                this.errorMessage =
                  response.data.vendorSkillSetWPValidations.message;
              } else if (
                response.data.vendorSkillSetWPValidations.returnCode === 2
              ) {
                this.errorMessage =
                  response.data.vendorSkillSetWPValidations.message;
              }
            }
          });
      }
    } else {
      this.loaderService.setDisableLoading();
      this.errorMessage =
        'Please choose Skillset and Grade matching in work packages';
    }
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

  cancel() {
    this.dialogRef.close({ data: null });
  }
}
