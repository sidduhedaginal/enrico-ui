import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-withdrawrfq',
  templateUrl: './withdrawrfq.component.html',
  styleUrls: ['./withdrawrfq.component.scss'],
})
export class WithdrawrfqComponent {
  rfqId: any;
  withdrawRFQForm: FormGroup;
  errormsg!: string;
  showerror:boolean = false;

  constructor(
    private dialogRef: MatDialogRef<WithdrawrfqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService
  ) {
    this.rfqId = this.data.rfqId;
  }

  ngOnInit(): void {
    this.withdrawRFQForm = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.withdrawRFQForm.markAllAsTouched();
    if (this.withdrawRFQForm.invalid) return;

    let rfqSendBackObj = {
      rfqId: this.rfqId,
      comments: this.withdrawRFQForm.value.remarks,
    };

    this.loaderService.setShowLoading();
    this.sowjdService.rfqWithdraw(rfqSendBackObj).subscribe(
      (response: any) => {
        if (response.data[0].isSuccess) {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(response.data[0].message);
          this.onClose('yes');
         
        } else {
          this.loaderService.setDisableLoading();
          // this.error = response.error;
          this.showerror = true;
          this.errormsg = response.data[0].message;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.showerror = true;
        this.errormsg = error.error.data.errorDetails[0].errorCode
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
}
