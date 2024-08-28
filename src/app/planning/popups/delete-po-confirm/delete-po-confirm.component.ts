import { Component, EventEmitter, Output,Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-delete-po-confirm',
  templateUrl: './delete-po-confirm.component.html',
  styleUrls: ['./delete-po-confirm.component.css']
})
export class DeletePoConfirmComponent {
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(    public dialogRef: MatDialogRef<DeletePoConfirmComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,){}

  OnConfirm(event: any){
    event.preventDefault();
    this.isFromSubmitted.emit(true);
    this.dialogRef.close();
  } 

  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }

}
