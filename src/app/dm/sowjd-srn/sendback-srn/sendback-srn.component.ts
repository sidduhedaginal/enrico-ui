import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-sendback-srn',
  templateUrl: './sendback-srn.component.html',
  styleUrls: ['./sendback-srn.component.scss'],
})
export class SendbackSrnComponent {
  srnId: any;
  sendBackSrn: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SendbackSrnComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private router: Router,
    private sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService
  ) {
    this.srnId = this.data.srnId;
  }

  ngOnInit(): void {
    this.sendBackSrn = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.sendBackSrn.markAllAsTouched();
    if (this.sendBackSrn.invalid) return;

    this.loaderService.setShowLoading();

    const inputValue = (this.data.input === 1)?4:9;

    let approvesrnObj = {
      srnId: this.srnId,
      comments: this.sendBackSrn.value.remarks,
      status: inputValue,
    };
    this.sowjdService.updateSrnStatus(approvesrnObj).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert('SRN Send Back Successful.');
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
}
