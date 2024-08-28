import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SowjdDhService } from '../../services/sowjd-dh.service';

@Component({
  selector: 'lib-sowjd-documents',
  templateUrl: './sowjd-documents.component.html',
  styleUrls: ['./sowjd-documents.component.scss'],
})
export class SowjdDocumentsComponent implements OnInit {
  documentsList: any;
  constructor(
    public dialogRef: MatDialogRef<SowjdDocumentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sowjdDhService: SowjdDhService
  ) {}
  ngOnInit(): void {
    if (this.data.sowJdId) {
      this.sowjdDhService
        .getAllDocumentsBySowJdId(this.data.sowJdId)
        .subscribe((docList: any) => {
          this.documentsList = docList;
          console.log(docList);
        });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
