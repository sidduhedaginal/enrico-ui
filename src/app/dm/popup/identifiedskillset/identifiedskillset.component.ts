import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from '../../services/sowjdService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LoaderService } from 'src/app/services/loader.service';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';

class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}

@Component({
  selector: 'lib-identifiedskillset',
  templateUrl: './identifiedskillset.component.html',
  styleUrls: ['./identifiedskillset.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class IdentifiedskillsetComponent implements OnInit {
  myForm!: FormGroup;
  SkillSetData: any = [];
  gradeDetails: any = [];
  sowJdId: any;
  skillsetId: any;
  GradeId: any;
  formValues: any;
  minDate: Date;
  errorMessage: string;
  unitOfMeasurement = ['MON', 'DAY', 'HOUR'];
  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  };

  constructor(
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<IdentifiedskillsetComponent>,
    private sowjdService: sowjdService,
    @Inject(MAT_DIALOG_DATA) public data: any = null,
    private loaderService: LoaderService,
    private http: HttpClient
  ) {
    this.formValues = this.data.data;
    this.gradeDetails = this.data.gradeDetails;
    this.sowJdId = this.data.sowJdId;
    this.minDate = this.data.startDate;
  }

  ngOnInit(): void {
    this.myForm = this.makeForm();
    if (this.formValues) {
      this.setFormData();
    }
  }

  changedEventValue(skillsetId: MatAutocompleteSelectedEvent) {
    this.myForm.get('skillsetId')?.setValue(skillsetId);
  }

  formatDates(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    const dateVal = yyyy + '-' + mm + '-' + dd;
    return dateVal;
  }

  addNewSkillSet() {
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) return;

    const startdate = new Date(this.myForm.value.resourceOnboardingDate);
    const resourceOnboardingDate = this.formatDates(startdate);

    if (startdate >= new Date(this.data.endDate)) {
      this.errorMessage =
        'Resource Onboarding date should be less than the Project End date';
      return false;
    }

    this.myForm.value.resourceOnboardingDate = resourceOnboardingDate;

    this.loaderService.setShowLoading();

    if (
      this.data.sowJdTypeCode === 'NRC' &&
      this.data.outsourcingTypeCode === 'TAM'
    ) {
      if (this.data.skillSets.length > 0) {
        if (
          this.data.skillSets[0].uom !==
          this.myForm.get('unitOfMeasurement').value
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = `Please choose same Unit Of Measurement '${this.data.skillSets[0].uom}'`;
          return false;
        }
      }
    }

    const skillSet: any = {
      ...this.myForm.value,
    };
    skillSet['sowJdId'] = this.sowJdId;
    skillSet['companyId'] = this.data.companyId;

    this.sowjdService.postSkillSet(skillSet).subscribe((response: any) => {
      if (response.status == 'success') {
        this.loaderService.setDisableLoading();
        if (response.data.returncode === 0) {
          this.dialogRef.close({ data: true });
        }
        if (response.data.returncode === 1) {
          this.errorMessage = response.data.message;
        }
        if (response.data.returncode === 2) {
          this.errorMessage = response.data.message;
        }
        if (response.data.returncode === 3) {
          this.errorMessage = response.data.message;
        }
        if (response.data.returncode === 4) {
          // PMO Conversion 'DAY' not maintained
          this.errorMessage = response.data.message;
        }
        if (response.data.returncode === 5) {
          // PMO Conversion 'HOUR' not maintained
          this.errorMessage = response.data.message;
        }
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  makeForm() {
    return this._formBuilder.group({
      skillsetId: ['', Validators.required],
      GradeId: ['', Validators.required],
      quantity: ['', Validators.required],
      duration: ['', Validators.required],
      unitOfMeasurement: ['MON', Validators.required],
      resourceOnboardingDate: [this.minDate, Validators.required],
    });
  }

  setFormData() {
    if (this.formValues) {
      this.myForm.get('skillsetId')?.setValue(this.formValues?.skillsetId);
      this.myForm.get('description')?.setValue(this.formValues?.GradeId);
      this.myForm.get('wbsId')?.setValue(this.formValues?.quantity);
      this.myForm.get('companyId')?.setValue(this.formValues?.duration);
    }
  }
}
