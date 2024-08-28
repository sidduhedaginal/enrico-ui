import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-delegate-srn',
  templateUrl: './delegate-srn.component.html',
  styleUrls: ['./delegate-srn.component.scss'],
})
export class DelegateSrnComponent {
  srnId: any;
  delegateSrn: FormGroup;
  DelegatorList: any = [];
  delegationMessage: string;

  constructor(
    private dialogRef: MatDialogRef<DelegateSrnComponent>,
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
    this.delegateSrn = this.fb.group({
      ntId: ['', Validators.required],
      remarks: ['', Validators.required],
    });
  }

  changedEventValue(ntId: MatAutocompleteSelectedEvent) {
    this.delegateSrn.get('ntId')?.setValue(ntId);
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.delegateSrn.markAllAsTouched();
    if (this.delegateSrn.invalid) return;

    this.loaderService.setShowLoading();

    const inputValue = this.data.input === 1 ? 3 : 4;
    // 3 - First level delegation
    // Other than 3 is Second level delagation ex:taken 4

    let approvesrnObj = {
      srnId: this.srnId,
      delegateTo: this.delegateSrn.value.ntId,
      ntid: this.delegateSrn.value.ntId,
      comments: this.delegateSrn.value.remarks,
      delegateType: inputValue,
    };
    this.sowjdService.delegateSRN(approvesrnObj).subscribe(
      (response: any) => {
        if (response.data.isSuccess) {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert('SRN delegated successful.');
        } else {
          this.loaderService.setDisableLoading();
          this.delegationMessage = response.data.message;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
}
