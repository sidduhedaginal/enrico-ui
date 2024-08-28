import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  skillSet: [];
  resource: [];
  displayedColumns: string[] = [
    'skillsetName',
    'gradeName',
    'quantity',
    'duration',
  ];

  displayedColumnsResource: string[] = [
    'skillSetName',
    'gradeName',
    'quantity',
    'duration',
  ];

  constructor(
    public dialogRef: MatDialogRef<ErrorMessageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.skillSet = this.data.skillSet;
    this.resource = this.data.resource;
  }

  onClose() {
    this.dialogRef.close();
  }
}
