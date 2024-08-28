import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-vendor-contact-confirmation',
  templateUrl: './delete-vendor-contact-confirmation.component.html',
  styleUrls: ['./delete-vendor-contact-confirmation.component.scss']
})
export class DeleteVendorContactConfirmationComponent{
  constructor(
    public dialogRef: MatDialogRef<DeleteVendorContactConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {   
  }

  ngOnInit(): void {
  }

}
