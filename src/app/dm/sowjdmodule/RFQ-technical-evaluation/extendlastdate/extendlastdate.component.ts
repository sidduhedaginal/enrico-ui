import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-extendlastdate',
  templateUrl: './extendlastdate.component.html',
  styleUrls: ['./extendlastdate.component.scss'],
})
export class ExtendlastdateComponent {
  rfqId: any;
  extendLastDateForm: FormGroup;
  lastEndDate: Date;
  endDate: Date;

  constructor(
    private dialogRef: MatDialogRef<ExtendlastdateComponent>,
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

    this.endDate = this.sowjdService.addNumberOfdays(this.lastEndDate, 1);

    this.extendLastDateForm = this.fb.group({
      rfqEndDate: [this.endDate, Validators.required],
      remarks: ['', Validators.required],
    });
  }

  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
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
    this.extendLastDateForm.markAllAsTouched();
    if (this.extendLastDateForm.invalid) return;

    this.loaderService.setShowLoading();

    const selectedDate = new Date(this.extendLastDateForm.value.rfqEndDate);
    const extendLastDate = this.formatDates(selectedDate);

    let rfqExtenddateObj = {
      rfqId: this.rfqId,
      rfqEndDate: extendLastDate,
      remarks: this.extendLastDateForm.value.remarks,
    };

    this.sowjdService.postRfqExtendDateForm(rfqExtenddateObj).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert('RFQ Extend Last Date Successfully.');
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
}
