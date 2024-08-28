import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmationpopup',
  templateUrl: './confirmationpopup.component.html',
  styleUrls: ['./confirmationpopup.component.css']
})
export class ConfirmationpopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmationpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {   
  }

  ngOnInit(): void {
  }

}
