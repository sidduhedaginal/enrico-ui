import { Component, Inject, OnInit } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { sowjdService } from '../../services/sowjdService.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { LoaderService } from 'src/app/services/loader.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'lib-widthdraw',
  templateUrl: './widthdraw.component.html',
  styleUrls: ['./widthdraw.component.scss'],
})
export class WidthdrawComponent implements OnInit {
  ratecardtype!: boolean;
  nonratecardtype!: boolean;
  Bosch!: boolean;
  Global!: boolean;
  status: any;
  remarks: any;
  customerName: any;
  success!: boolean;
  errormsg!: string;
  showerror:boolean = false;
  error!: string;
  withDrawForm: FormGroup;

  constructor(
    private router: Router,
    public sowjdService: sowjdService,
    public dialogRef: MatDialogRef<WidthdrawComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private notifyservice: NotifyService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.withDrawForm = this.fb.group({
      remarks: ['', Validators.required],
    });
  }

  onstatus(event: any) {
    this.status = event.target.value;
  }

  onClose(data: string) {
    this.dialogRef.close({ data });
  }

  SaveForm() {
    if(this.data?.status == 'Withdraw'){
      this.withDrawForm.markAllAsTouched();
      if (!this.withDrawForm.valid) return;
  
      const Withdraw: any = {
        sowJdId: this.data.sowjdId,
        remarks: this.withDrawForm.value.remarks,
      };
      this.loaderService.setShowLoading();
      this.sowjdService
        .withdrawSowjdDetail(Withdraw)
        .subscribe((res: any) => {
          if (res.data[0].isSuccess) {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert(res.data[0].message);
            this.onClose('yes');
           
          } else {
            this.loaderService.setDisableLoading();
            this.error = res.error;
            this.showerror = true;
            this.errormsg = res.data[0].message;
          }
        });
    }else{
      this.withDrawForm.markAllAsTouched();
      if (!this.withDrawForm.valid) return;
  
      const Withdraw: any = {
        sowJdId: this.data.sowjdId,
        status: 6,
        remarks: this.withDrawForm.value.remarks,
      };
      
      this.loaderService.setShowLoading();
      this.sowjdService
        .postWithdrawSowjdRequest(Withdraw)
        .subscribe((res: any) => {
          if (res.status) {
            this.loaderService.setDisableLoading();
            this.onClose('yes');
            this.notifyservice.alert(res.data.message);
          } else {
            this.loaderService.setDisableLoading();
            this.error = res.error;
            
            this.errormsg = res.data.errorMessage;
          }
        });
    }

  }
}
