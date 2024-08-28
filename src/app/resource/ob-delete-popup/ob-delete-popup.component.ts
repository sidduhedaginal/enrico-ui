import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ob-delete-popup',
  templateUrl: './ob-delete-popup.component.html',
  styleUrls: ['./ob-delete-popup.component.scss'],
})
export class ObDeletePopupComponent implements OnInit {
  success!: boolean;
  successmsg!: string;
  errormsg!: string;
  error!: string;
  requestToken!: string;

  constructor(
    public dialogRef: MatDialogRef<ObDeletePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
  deletebtn() {
      this.dialogRef.close('true');
    
  }

  onClose() {
    this.dialogRef.close('false');
  }
}
