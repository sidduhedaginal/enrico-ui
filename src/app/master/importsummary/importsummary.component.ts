import { Component ,Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-importsummary',
  templateUrl: './importsummary.component.html',
  styleUrls: ['./importsummary.component.css']
})
export class ImportsummaryComponent {
  constructor(
    public dialogRef: MatDialogRef<ImportsummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }
  onBtnExport() {}
}
