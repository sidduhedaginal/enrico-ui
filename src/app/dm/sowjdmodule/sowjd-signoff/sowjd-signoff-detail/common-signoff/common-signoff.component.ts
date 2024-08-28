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
import { VendorService } from 'src/app/vendor/services/vendor.service';

@Component({
  selector: 'app-common-signoff',
  templateUrl: './common-signoff.component.html',
  styleUrls: ['./common-signoff.component.css'],
})
export class CommonSignoffComponent {
  commonSignOffForm: FormGroup;
  tpId: any;
  showerror: boolean = false;
  errormsg: string;

  constructor(
    private dialogRef: MatDialogRef<CommonSignoffComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private vendorService: VendorService
  ) {
    this.tpId = this.data.tpId;
  }

  ngOnInit(): void {
    this.commonSignOffForm = this.fb.group({
      remarks: ['', Validators.required],
      managedCapacity: [
        '',
        this.data.type === 'Initiate' &&
        this.data.sowjdTypeCode === 'RC' &&
        this.data.outSourcingCode === 'TAM'
          ? Validators.required
          : Validators.nullValidator,
      ],
    });
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  onSubmit() {
    this.commonSignOffForm.markAllAsTouched();
    if (!this.commonSignOffForm.valid) return;

    let signOffRemarksObj;
    if (this.data.type === 'Partner') {
      signOffRemarksObj = {
        vendorSignOff: true,
        remarks: this.commonSignOffForm.value.remarks,
        technicalProposalID: this.tpId,
      };
    }

    if (this.data.type === 'Initiate') {
      signOffRemarksObj = {
        spocSignOff: false,
        dmSignOff: false,
        vendorSignOff: false,
        extendSignOff: false,
        withdrawSignOff: false,
        remarks: this.commonSignOffForm.value.remarks,
        initiateSignOff: true,
        technicalProposalID: this.tpId,
        managedCapacity: this.commonSignOffForm.value.managedCapacity,
      };
    }

    if (this.data.type === 'SPOC') {
      signOffRemarksObj = {
        spocSignOff: true,
        dmSignOff: false,
        vendorSignOff: false,
        extendSignOff: false,
        withdrawSignOff: false,
        initiateSignOff: false,
        remarks: this.commonSignOffForm.value.remarks,
        technicalProposalID: this.tpId,
      };
    }

    if (this.data.type === 'DM') {
      signOffRemarksObj = {
        spocSignOff: false,
        dmSignOff: true,
        vendorSignOff: false,
        extendSignOff: false,
        withdrawSignOff: false,
        initiateSignOff: false,
        remarks: this.commonSignOffForm.value.remarks,
        technicalProposalID: this.tpId,
      };
    }

    this.loaderService.setShowLoading();

    if (this.data.type === 'Partner') {
      this.vendorService.postSignOffRemarksForm(signOffRemarksObj).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert(`${this.data.type} Sign Off Successful.`);
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    } else if (
      this.data.type === 'createSoWJD' ||
      this.data.type === 'updateSoWJD'
    ) {
      const data = {
        remarks: this.commonSignOffForm.value.remarks,
      };
      this.dialogRef.close({ data });
    } else if (this.data.type === 'Withdraw') {
      signOffRemarksObj = {
        comments: this.commonSignOffForm.value.remarks,
        technicalProposalId: this.tpId,
      };
      this.sowjdService.withdrawSignoffdetail(signOffRemarksObj).subscribe(
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
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    } else if (this.data.type === 'workPackage') {
      let workPackageObj = {
        id: this.data.wpId,
        comment: this.commonSignOffForm.value.remarks,
      };
      this.sowjdService.postSignOfffWPShortClosure(workPackageObj).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();

            if (response.data.errorCode === 0) {
              this.onClose('yes');
              this.notifyservice.alert(
                `Work Package Delivery Completed Successful.`
              );
            } else {
              this.showerror = true;
              this.errormsg = response.data.errorMessage;
            }
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    } else if (this.data.type === 'resourcePlan') {
      let ResourcePlanObj = {
        id: this.data.Id,
        comment: this.commonSignOffForm.value.remarks,
      };
      this.sowjdService
        .postSignOfffResourceShortClosure(ResourcePlanObj)
        .subscribe(
          (response: any) => {
            console.log(response);
            if (response.status === 'success') {
              this.loaderService.setDisableLoading();

              if (response.data.errorCode === 0) {
                this.onClose('yes');
                this.notifyservice.alert(
                  `Vendor Resource Plan Onboarding Completed Successful.`
                );
              } else {
                this.showerror = true;
                this.errormsg = response.data.errorMessage;
              }
            }
          },
          (error) => {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert(
              error.error.data.errorDetails[0].errorCode
            );
          }
        );
    } else {
      this.sowjdService.postSignOffRemarksForm(signOffRemarksObj).subscribe(
        (response: any) => {
          console.log(response);
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert(`${this.data.type} Sign Off Successful.`);
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    }
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
