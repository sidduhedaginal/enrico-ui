import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-import-error',
  templateUrl: './import-error.component.html',
  styleUrls: ['./import-error.component.css']
})
export class ImportErrorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ImportErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
  
}
