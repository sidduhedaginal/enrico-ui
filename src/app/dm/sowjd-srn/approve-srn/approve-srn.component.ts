import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-approve-srn',
  templateUrl: './approve-srn.component.html',
  styleUrls: ['./approve-srn.component.scss'],
})
export class ApproveSrnComponent {
  srnId: any;
  approveSrn: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<ApproveSrnComponent>,
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
    this.approveSrn = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.approveSrn.markAllAsTouched();
    if (!this.approveSrn.valid) return;

    this.loaderService.setShowLoading();

    let inputValue: number;
    if (this.data.sectionSpocApproval === 'No') {
      inputValue = 7;
    } else {
      inputValue = this.data.input === 1 ? 2 : 7;
    }

    let approvesrnObj = {
      srnId: this.srnId,
      comments: this.approveSrn.value.remarks,
      status: inputValue,
    };
    this.sowjdService.updateSrnStatus(approvesrnObj).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert('SRN Approved Successful.');
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
}
