import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss'],
})
export class ConfirmationAlertComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationAlertComponent>) {}
  clone() {
    this.dialogRef.close({ confirm: true });
  }

  onClose() {
    this.dialogRef.close();
  }
}
