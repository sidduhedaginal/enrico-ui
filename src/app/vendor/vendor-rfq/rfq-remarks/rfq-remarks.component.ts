import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';

@Component({
  selector: 'app-rfq-remarks',
  templateUrl: './rfq-remarks.component.html',
  styleUrls: ['./rfq-remarks.component.css'],
})
export class RfqRemarksComponent {
  submitRFQForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<RfqRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService
  ) {}

  ngOnInit(): void {
    this.submitRFQForm = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close({ data: null });
  }

  onSubmit() {
    this.submitRFQForm.markAllAsTouched();
    if (this.submitRFQForm.invalid) return;
    this.dialogRef.close({ remarks: this.submitRFQForm.value.remarks });
  }
}
