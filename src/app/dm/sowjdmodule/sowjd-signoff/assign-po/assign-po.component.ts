import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { LoaderService } from 'src/app/services/loader.service';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';

@Component({
  selector: 'app-assign-po',
  templateUrl: './assign-po.component.html',
  styleUrls: ['./assign-po.component.css'],
})
export class AssignPOComponent {
  poForm: FormGroup;
  poList: any;
  company: string = '';
  location: string = '';
  vendorId: string = '';
  vendorName: string = '';

  constructor(
    private dialogRef: MatDialogRef<AssignPOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sowjdDhService: SowjdDhService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private notifyservice: NotifyService,
    public sowjdService: sowjdService
  ) {}

  changedEventValue(searchPlaceholderId: MatAutocompleteSelectedEvent) {
    this.poForm.get('poNumber')?.setValue(searchPlaceholderId);
  }

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.sowjdDhService.purchaseOrderList(this.data.tpId).subscribe({
      next: (response: any) => {
        if (response.data != null) {
          this.loaderService.setDisableLoading();
          this.poList = response.data;
        }
      },
      error: (error) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });

    this.poForm = this.fb.group({
      poNumber: ['', Validators.required],
      remarks: ['', Validators.required],
    });

    this.company = this.data.rfqDetail.companyCode;
    this.location = this.data.rfqDetail.plantName;
    this.vendorId = this.data.vendorDetail.vendorSAPId;
    this.vendorName = this.data.vendorDetail.vendorName;
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.poForm.markAllAsTouched();
    if (this.poForm.invalid) return;

    this.loaderService.setShowLoading();
    const poObject = {
      technicalProposalId: this.data.tpId,
      purchaseHeadersId: this.poForm.value.poNumber,
      poRemarks: this.poForm.value.remarks,
      StatusChange: this.data.status,
    };

    this.sowjdDhService.purchaseOrderByTpId(poObject).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.loaderService.setDisableLoading();
          this.onClose('yes');
          this.notifyservice.alert('Purchase Order Assigned Successful.');
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  successMessage(message: string) {
    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '500px',
      height: 'auto',
      data: message,
    });
    return dialogRef;
  }
}
