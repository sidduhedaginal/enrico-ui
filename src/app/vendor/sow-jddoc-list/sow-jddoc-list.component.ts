import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SowjdDocumentsComponent } from 'src/app/popup/sowjd-documents/sowjd-documents.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-sow-jddoc-list',
  templateUrl: './sow-jddoc-list.component.html',
  styleUrls: ['./sow-jddoc-list.component.scss'],
})
export class SowJDDocListComponent {
  documentsList: any;
  constructor(
    public dialogRef: MatDialogRef<SowjdDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dashboardService: DashboardService
  ) {}
  ngOnInit(): void {
    if (this.data.sowJdId) {
      this.dashboardService
        .getSOWJDDocuments(this.data.sowJdId)
        .subscribe((docList: any) => {
          this.documentsList = docList;
        });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
