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
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-invoice',
  templateUrl: './update-invoice.component.html',
  styleUrls: ['./update-invoice.component.css'],
})
export class UpdateInvoiceComponent {
  updateInvoiceForm: FormGroup;
  srnId: string;
  message: string;

  constructor(
    private dialogRef: MatDialogRef<UpdateInvoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private dialog: MatDialog,
    private router: Router,
    private loaderService: LoaderService
  ) {
    this.srnId = this.data.srnId;
  }

  ngOnInit(): void {
    this.updateInvoiceForm = this.fb.group({
      invoiceNumber: ['', Validators.required],
    });
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  successMessage(message: string) {
    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '500px',
      height: 'auto',
      data: message,
    });
    return dialogRef;
  }

  onSubmit() {
    this.updateInvoiceForm.markAllAsTouched();
    if (!this.updateInvoiceForm.valid) return;

    this.loaderService.setShowLoading();
    let invoiceObj = {
      srnId: this.srnId,
      invoiceNumber: this.updateInvoiceForm.value.invoiceNumber,
    };

    this.sowjdService.updateInvoiceNumber(invoiceObj).subscribe(
      (response: any) => {
        this.loaderService.setDisableLoading();
        if (response.data[0].isSuccess) {
          this.onClose('yes');
          this.notifyservice.alert(response.data[0].message);
        } else {
          this.message = response.data[0].message;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  reloadPage() {
    window.location.reload();
  }
}
