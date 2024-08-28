import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SowjdDetailsService } from '../services/sowjd-details.service';
import { VendorDetailsService } from '../services/vendor-details.service';
import { HomeService } from 'src/app/services/home.service';
import { config } from 'src/app/config';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'app-tp-add-resource',
  templateUrl: './tp-add-resource.component.html',
  styleUrls: ['./tp-add-resource.component.css'],
})
export class TpAddResourceComponent {
  skillsets: any[] = [];
  grades: any[] = [];
  value: any;
  resorceForm: any;
  rfqid: any;
  tpId: any;
  resourceInput: any;
  isCreate: boolean = false;
  title: string = '';
  loader: boolean;
  public minDate = new Date();
  vendorId: string;
  constructor(
    private dialogRef: MatDialogRef<TpAddResourceComponent>,
    private fb: FormBuilder,
    private vendorDetailsService: VendorDetailsService,
    private sowjdDetailsService: SowjdDetailsService,
    private homeService: HomeService,
    private vendorService: VendorService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
    this.vendorId = this.vendorService.vendorId;
  }

  ngOnInit(): void {
    this.isCreate = this.resourceInput.isCreate;
    this.vendorDetailsService
      .getGradeDetails(this.vendorId)
      .subscribe((response: any) => {
        this.grades = response.data;
      });
    this.sowjdDetailsService
      .getTpSkillsets(this.tpId)
      .subscribe((response: any) => {
        this.skillsets = response.data;
      });
    if (!this.isCreate) {
      this.title = 'Update Resource';
      this.resorceForm = this.fb.group({
        skillset: [this.resourceInput.resource.skillSetID, Validators.required],
        grade: [this.resourceInput.resource.gradeID, Validators.required],
        pmo: [this.resourceInput.resource.pmo, Validators.required],
        resourceOnboardingDate: [
          this.resourceInput.resource.resourceOnboardingDate,
          Validators.required,
        ],
      });
    } else {
      this.title = 'Add Resource';
      this.resorceForm = this.fb.group({
        skillset: ['', Validators.required],
        grade: ['', Validators.required],
        pmo: ['', Validators.required],
        resourceOnboardingDate: ['', Validators.required],
      });
    }
  }

  save() {
    if (this.tpId != null && this.tpId != '' && this.tpId != undefined) {
      if (this.isCreate) {
        let input = {
          technicalProposalId: this.tpId,
          skillSetID: this.resorceForm.get('skillset').value,
          gradeID: this.resorceForm.get('grade').value,
          pmo: this.resorceForm.get('pmo').value,
          resourceOnboardingDate: this.resorceForm.get('resourceOnboardingDate')
            .value,
          createdBy: '',
          modifiedBy: '',
          isDeleted: false,
        };
        this.sowjdDetailsService
          .createTpResource(input)
          .subscribe((response: any) => {
            if (response.status == 'success') {
              this.dialogRef.close({ data: 'resource Added' });
            }
          });
      } else {
        let input = {
          id: this.resourceInput.resource.id,
          skillSetID: this.resorceForm.get('skillset').value,
          gradeID: this.resorceForm.get('grade').value,
          pmo: this.resorceForm.get('pmo').value,
          resourceOnboardingDate: this.resorceForm.get('resourceOnboardingDate')
            .value,
        };
        this.sowjdDetailsService
          .updateTPResource(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              this.dialogRef.close({ data: response.data[0].message });
            }
          });
      }
    }
  }
  cancel() {
    this.dialogRef.close({ data: null });
  }
}
