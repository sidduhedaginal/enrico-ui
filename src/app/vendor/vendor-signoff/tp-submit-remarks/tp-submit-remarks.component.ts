import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';

@Component({
  selector: 'app-tp-submit-remarks',
  templateUrl: './tp-submit-remarks.component.html',
  styleUrls: ['./tp-submit-remarks.component.scss'],
})
export class TpSubmitRemarksComponent {
  submitTPForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<TpSubmitRemarksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public sowjdService: sowjdService
  ) {}

  ngOnInit(): void {
    this.submitTPForm = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onClose() {
    this.dialogRef.close({ data: null });
  }

  onSubmit() {
    this.submitTPForm.markAllAsTouched();
    if (this.submitTPForm.invalid) return;
    this.dialogRef.close({ remarks: this.submitTPForm.value.remarks });
  }
}
