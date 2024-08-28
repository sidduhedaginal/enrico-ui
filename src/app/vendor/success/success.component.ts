import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'lib-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit {
  message: string = '';
  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RTCIceComponent>
  ) {}

  ngOnInit(): void {}
  close() {
    this.dialogRef.close();
  }
}
