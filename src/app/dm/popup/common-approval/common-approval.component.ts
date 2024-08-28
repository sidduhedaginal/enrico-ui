import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { sowjdService } from '../../services/sowjdService.service';

@Component({
  selector: 'app-common-approval',
  templateUrl: './common-approval.component.html',
  styleUrls: ['./common-approval.component.css'],
})
export class CommonApprovalComponent {
  commonApprovalForm: FormGroup;
  type: string;

  constructor(
    private dialogRef: MatDialogRef<CommonApprovalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.data.type === 'approve') {
      this.type = 'Approve';
    } else {
      this.type = 'Send Back';
    }
    this.commonApprovalForm = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close({ data: null });
  }

  onSubmit() {
    this.commonApprovalForm.markAllAsTouched();
    if (!this.commonApprovalForm.valid) return;
    this.dialogRef.close({ remarks: this.commonApprovalForm.value.remarks });
  }
}
