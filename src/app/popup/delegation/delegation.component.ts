import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { SowjdDhService } from '../../services/sowjd-dh.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { SuccessComponent } from '../success/success.component';
import { HomeService } from 'src/app/services/home.service';
import { Router } from '@angular/router';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { LoaderService } from 'src/app/services/loader.service';
import { popupMessageComponent } from '../popup-message/popup-message.component';
import { NotifyService } from 'src/app/dm/services/notify.service';

@Component({
  selector: 'lib-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.scss'],
})
export class DelegationComponent implements OnInit {
  delegateForm!: FormGroup;
  submitted = false;
  sowJdId: string = '';
  sowJdDetail: any;
  type: string;
  sowjdmasterdata: any;
  delegationMessage: string;

  constructor(
    public dialogRef: MatDialogRef<DelegationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sowjdDhService: SowjdDhService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private loaderService: LoaderService,
    private notifyservice: NotifyService,
    public sowjdService: sowjdService
  ) {}

  ngOnInit(): void {
    this.delegateForm = this.fb.group({
      delegatedTo: ['', Validators.required],
      remark: ['', Validators.required],
    });
    this.getSowjdTypeList();
  }

  getSowjdTypeList() {
    this.sowJdId = this.data.sowJdId;
    this.type = this.data.type;
    if (this.sowJdId) {
      this.getSowjdDetailsById();
    }
  }

  getSowjdDetailsById() {
    this.loaderService.setShowLoading();
    this.sowjdDhService.getSowJdRequestById(this.sowJdId).subscribe(
      (sowJdData: any) => {
        if (sowJdData) {
          this.loaderService.setDisableLoading();
          this.sowJdDetail = sowJdData.data.sowJdEntityResponse;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  changedEventValue(value: any) {
    this.delegateForm.get('delegatedTo')?.setValue(value);
  }

  get delegateFormControl() {
    return this.delegateForm.controls;
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.delegateForm.markAllAsTouched();
    if (!this.delegateForm.valid) return;

    this.loaderService.setShowLoading();

    if (this.type === 'dh') {
      var delegationObj = {
        sowJdId: this.sowJdId,
        delegateType: 1,
        delegateTo: this.delegateForm.value.delegatedTo,
        remarks: this.delegateForm.value.remark,
        ntId: '',
      };
      this.sowjdDhService.delegationDHRequest(delegationObj).subscribe(
        (response: any) => {
          this.loaderService.setDisableLoading();
          if (response.data[0].isSuccess) {
            this.onClose('yes');
            this.notifyservice.alert(response.data[0].message);
          } else {
            this.delegationMessage = response.data[0].message;
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
        }
      );
    } else if (this.type === 'spoc') {
      var delegationObj = {
        sowJdId: this.sowJdId,
        delegateType: 2,
        delegateTo: this.delegateForm.value.delegatedTo,
        remarks: this.delegateForm.value.remark,
        ntId: '',
      };
      this.sowjdDhService.delegationDHRequest(delegationObj).subscribe(
        (response: any) => {
          this.loaderService.setDisableLoading();
          if (response.data[0].isSuccess) {
            this.onClose('yes');
            this.notifyservice.alert(response.data[0].message);
          } else {
            this.delegationMessage = response.data[0].message;
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
        }
      );
    }
  }
}
