import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'lib-approve-dialog',
  templateUrl: './approve-dialog.component.html',
  styleUrls: ['./approve-dialog.component.css']
})
export class ApproveDialogComponent implements OnInit {
  title: string = '';
  remark : string = '';
  constructor(public dialogRef: MatDialogRef<ApproveDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { 
    this.title = data?.title;
  }
  space(event:any){
    if(event.target.selectionStart === 0 && event.code === 'Space'){
      event.preventDefault();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close({yes:true,remark:this.remark});
  }

  ngOnInit(): void {
  }

}
