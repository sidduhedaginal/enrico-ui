import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-sendback-signoff',
  templateUrl: './sendback-signoff.component.html',
  styleUrls: ['./sendback-signoff.component.css'],
})
export class SendbackSignoffComponent {
  sendbackSignOffForm: FormGroup;
  tpId: any;
  endDate: Date;
  lastEndDate: Date;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<SendbackSignoffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) {
    this.tpId = this.data.tpId;

    if (this.data.type === 'extend') {
      this.title = 'Extend Last Date';
    }
    if (this.data.type === 'sendback') {
      this.title = 'Send Back';
    }
    if (this.data.type === 'extend') {
      this.title = 'Extend Last Date';
    }
    if (this.data.type === 'edit') {
      this.title = 'Edit';
    }
  }

  ngOnInit(): void {
    this.lastEndDate = new Date(this.data.endDate);

    this.endDate = this.sowjdService.addNumberOfdays(this.lastEndDate, 1);

    this.sendbackSignOffForm = this.fb.group({
      signOffEndDate: [this.endDate, Validators.required],
      remarks: ['', Validators.required],
    });
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  setDate(date: Date) {
    let d = date;
    d.setHours(d.getHours() + 5);
    d.setMinutes(d.getMinutes() + 30);
    return new Date(d);
  }

  formatDates(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    const dateVal = yyyy + '-' + mm + '-' + dd;
    return dateVal;
  }

  onSubmit() {
    this.sendbackSignOffForm.markAllAsTouched();
    if (this.sendbackSignOffForm.invalid) return;

    this.loaderService.setShowLoading();

    const selectedDate = new Date(
      this.sendbackSignOffForm.value.signOffEndDate
    );
    const tpEndDate = this.formatDates(selectedDate);

    if (this.data.type === 'sendback' || this.data.type === 'edit') {
      let signOffSendBackObj = {
        technicalproposalId: this.tpId,
        technicalproposalEndDate: tpEndDate,
        technicalproposalComments: this.sendbackSignOffForm.value.remarks,
      };

      this.sowjdService.postSignOffSendBackForm(signOffSendBackObj).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            if (this.data.type === 'sendback') {
              this.notifyservice.alert('Send back Successful.');
            }
            if (this.data.type === 'edit') {
              this.notifyservice.alert('Edited Successful.');
            }
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    }

    if (this.data.type === 'extend') {
      let signOffRemarksObj = {
        spocSignOff: false,
        dmSignOff: false,
        vendorSignOff: false,
        extendSignOff: true,
        withdrawSignOff: false,
        remarks: this.sendbackSignOffForm.value.remarks,
        endDate: tpEndDate,
        technicalProposalID: this.tpId,
      };

      this.sowjdService.postSignOffRemarksForm(signOffRemarksObj).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert(`Last Date Extended Successful.`);
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
