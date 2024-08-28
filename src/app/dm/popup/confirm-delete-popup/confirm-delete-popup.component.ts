import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-confirm-delete-popup',
  templateUrl: './confirm-delete-popup.component.html',
  styleUrls: ['./confirm-delete-popup.component.scss'],
})
export class ConfirmDeletePopupComponent implements OnInit {
  success!: boolean;
  successmsg!: string;
  errormsg!: string;
  error!: string;
  requestToken!: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  deleteSkillSet() {
    if (this.data.skillset == true) {
      const Removeskillset: any = {
        sowJdId: this.data.params.data.sowJdId,
        skillsetId: this.data.params.data.skillsetId,
        sowjdSkillSetId: this.data.params.data.id,
      };
      this.dialogRef.close({
        Removeskillset: Removeskillset,
      });
    } else if (this.data.skillset == false) {
      const RemoveVender: any = {
        sowJdId: this.data.params.data.sowjdId,
        vendorId: this.data.params.data.vendorId,
        sowjdVendorId: this.data.params.data.id,
      };
      this.dialogRef.close({
        RemoveVender: RemoveVender,
      });
    } else {
      const RemoveSowjd: any = {
        sowJdId: this.data.item.sowjdId,
      };
      this.dialogRef.close({
        RemoveSowjd: RemoveSowjd,
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
