import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { SrnService } from 'src/app/services/srn.service';

@Component({
  selector: 'app-withdraw-srn',
  templateUrl: './withdraw-srn.component.html',
  styleUrls: ['./withdraw-srn.component.scss'],
})
export class WithdrawSrnComponent {
  srnId: any;
  withdrawSrn: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<WithdrawSrnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService,
    private srnService: SrnService
  ) {
    this.srnId = this.data.srnId;
  }

  ngOnInit(): void {
    this.withdrawSrn = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.withdrawSrn.markAllAsTouched();
    if (this.withdrawSrn.invalid) return;

    this.loaderService.setShowLoading();

    if (this.data.type === 'Withdraw') {
      let approvesrnObj = {
        srnId: this.srnId,
        comments: this.withdrawSrn.value.remarks,
      };
      this.srnService.withdrawVendorSRN(approvesrnObj).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert('SRN withdrawn successful.');
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    } else if (this.data.type === 'Reject') {
      const inputValue = this.data.input === 1 ? 3 : 8;

      let approvesrnObj = {
        srnId: this.srnId,
        comments: this.withdrawSrn.value.remarks,
        status: inputValue,
      };
      this.sowjdService.updateSrnStatus(approvesrnObj).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert('SRN Rejected successful.');
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    }
  }
}
