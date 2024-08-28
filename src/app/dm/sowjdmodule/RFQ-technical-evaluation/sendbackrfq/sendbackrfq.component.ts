import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-sendbackrfq',
  templateUrl: './sendbackrfq.component.html',
  styleUrls: ['./sendbackrfq.component.scss'],
})
export class SendbackrfqComponent {
  sendbackrfqForm: FormGroup;
  rfqId: any;
  minDate: Date;
  lastEndDate: Date;

  constructor(
    private dialogRef: MatDialogRef<SendbackrfqComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService
  ) {
    this.rfqId = this.data.rfqId;
  }

  ngOnInit(): void {
    this.lastEndDate = new Date(this.data.endDate);

    this.minDate = this.sowjdService.addNumberOfdays(this.lastEndDate, 1);

    this.sendbackrfqForm = this.fb.group({
      rfqEndDate: [this.minDate, Validators.required],
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
    this.sendbackrfqForm.markAllAsTouched();
    if (this.sendbackrfqForm.invalid) return;

    this.loaderService.setShowLoading();

    const rfqEndDate = new Date(this.sendbackrfqForm.value.rfqEndDate);
    const extendLastDate = this.formatDates(rfqEndDate);

    let rfqSendBackObj = {
      rfqId: this.rfqId,
      rfqEndDate: extendLastDate,
      rfqComments: this.sendbackrfqForm.value.remarks,
    };

    this.sowjdService.postRfqSendBackForm(rfqSendBackObj).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert('RFQ Send back Successful.');
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
}
