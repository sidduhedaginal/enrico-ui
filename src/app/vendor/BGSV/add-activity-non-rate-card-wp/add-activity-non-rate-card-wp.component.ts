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
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-add-activity-non-rate-card-wp',
  templateUrl: './add-activity-non-rate-card-wp.component.html',
  styleUrls: ['./add-activity-non-rate-card-wp.component.css'],
})
export class AddActivityNonRateCardWpComponent {
  skillsets: any = [];
  grades: any[] = [];
  value: any;
  workPackageForm: any;
  tpId: any;
  resourceInput: any;
  isCreate: boolean = false;
  title: string = '';
  loader: boolean;
  vendorId: string;
  unitOfMeasurement = 'PC';
  unitRate = '';
  errorMessage: string;

  constructor(
    public dialogRef: MatDialogRef<AddActivityNonRateCardWpComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private vendorDetailsService: VendorDetailsService,
    private sowjdDetailsService: SowjdDetailsService,
    private homeService: HomeService,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private dialog: MatDialog
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
    this.vendorId = this.vendorService.vendorId;
  }

  ngOnInit(): void {
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

    this.workPackageForm = this.fb.group({
      projectName: ['', Validators.required],
      skillset: ['', Validators.required],
      grade: ['', Validators.required],
      activityType: ['', Validators.required],
      NoOfActivity: ['', Validators.required],
      estimation: ['', Validators.required],
      unitPrice: ['', Validators.required],
    });
  }

  isNumberKey(evt, inputValue: string) {
    let reg: any;
    if (inputValue === 'two') {
      reg = /^-?\d*(\.\d{0,2})?$/;
    } else {
      reg = /^-?\d*(\.\d{0,3})?$/;
    }

    let input = evt.target.value + String.fromCharCode(evt.charCode);

    if (!reg.test(input)) {
      evt.preventDefault();
    }
  }

  changedEventValue(skillsetId: MatAutocompleteSelectedEvent) {
    this.workPackageForm.get('skillset')?.setValue(skillsetId);
  }

  onSubmit() {
    this.workPackageForm.markAllAsTouched();
    if (this.workPackageForm.invalid) return;

    this.loaderService.setShowLoading();

    if (this.data.flag === 1) {
      let input = {
        technicalProposalId: this.data.id,
        activityType: this.workPackageForm.get('activityType').value,
        noofActivityPlanned: this.workPackageForm.get('NoOfActivity').value,
        estimationPerActivity: this.workPackageForm.get('estimation').value,
        unitPrice: this.workPackageForm.get('unitPrice').value,
        unitOfMeasurement: '',
        projectName: this.workPackageForm.get('projectName').value,
        skillSetId: this.workPackageForm.get('skillset').value,
        gradeId: this.workPackageForm.get('grade').value,
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.vendorService.createWorkPackage(input).subscribe((response: any) => {
        if (response.status == 'success') {
          this.loaderService.setDisableLoading();
          if (response.data.vendorWPTPSkillSetValidations.returnCode === 0) {
            this.dialogRef.close({ data: true });
          } else if (
            response.data.vendorWPTPSkillSetValidations.returnCode === 1
          ) {
            this.errorMessage =
              response.data.vendorWPTPSkillSetValidations.message;
          } else if (
            response.data.vendorWPTPSkillSetValidations.returnCode === 2
          ) {
            this.errorMessage =
              response.data.vendorWPTPSkillSetValidations.message;
          } else if (
            response.data.vendorWPTPSkillSetValidations.returnCode === 3
          ) {
            this.errorMessage =
              response.data.vendorWPTPSkillSetValidations.message;
          } else if (
            response.data.vendorWPTPSkillSetValidations.returnCode === 4
          ) {
            this.errorMessage =
              response.data.vendorWPTPSkillSetValidations.message;
          } else if (
            response.data.vendorWPTPSkillSetValidations.returnCode === 5
          ) {
            this.errorMessage =
              response.data.vendorWPTPSkillSetValidations.message;
          }
        }
      });
    } else {
      let input = {
        //RFQ
        rfqId: this.data.id,
        activityType: this.workPackageForm.get('activityType').value,
        noofActivityPlanned: this.workPackageForm.get('NoOfActivity').value,
        estimationActivity: this.workPackageForm.get('estimation').value,
        unitPrice: this.workPackageForm.get('unitPrice').value,
        unitOfMeasurement: '',
        projectName: this.workPackageForm.get('projectName').value,
        skillSetId: this.workPackageForm.get('skillset').value,
        gradeId: this.workPackageForm.get('grade').value,
        createdBy: '',
        modifiedBy: '',
        isDeleted: false,
      };
      this.sowjdDetailsService
        .createWorkPackage(input)
        .subscribe((response: any) => {
          if (response.status == 'success') {
            this.loaderService.setDisableLoading();
            if (response.data.vendorWPSkillSetValidations.returnCode === 0) {
              this.dialogRef.close({ data: true });
            } else if (
              response.data.vendorWPSkillSetValidations.returnCode === 1
            ) {
              this.errorMessage =
                response.data.vendorWPSkillSetValidations.message;
            } else if (
              response.data.vendorWPSkillSetValidations.returnCode === 2
            ) {
              this.errorMessage =
                response.data.vendorWPSkillSetValidations.message;
            } else if (
              response.data.vendorWPSkillSetValidations.returnCode === 3
            ) {
              this.errorMessage =
                response.data.vendorWPSkillSetValidations.message;
            } else if (
              response.data.vendorWPSkillSetValidations.returnCode === 4
            ) {
              this.errorMessage =
                response.data.vendorWPSkillSetValidations.message;
            } else if (
              response.data.vendorWPSkillSetValidations.returnCode === 5
            ) {
              this.errorMessage =
                response.data.vendorWPSkillSetValidations.message;
            }
          }
        });
    }
  }

  cancel() {
    this.dialogRef.close({ data: null });
  }
}
