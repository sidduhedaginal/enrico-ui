import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.scss'],
})
export class popupMessageComponent {
  message: string;
  title: string;

  constructor(
    public dialogRef: MatDialogRef<popupMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.title;
    this.message = this.data.message;
  }

  onClose() {
    this.dialogRef.close();
  }
}
