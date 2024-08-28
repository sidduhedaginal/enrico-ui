import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-import-summary',
  templateUrl: './import-summary.component.html',
  styleUrls: ['./import-summary.component.scss']
})
export class ImportSummaryComponent {
  constructor(
    public dialogRef: MatDialogRef<ImportSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}
}
