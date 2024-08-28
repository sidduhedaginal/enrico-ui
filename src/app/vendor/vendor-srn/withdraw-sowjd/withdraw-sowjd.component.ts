import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard.service';
import { NotifyService } from 'src/app/dm/services/notify.service';

@Component({
  selector: 'app-withdraw-sowjd',
  templateUrl: './withdraw-sowjd.component.html',
  styleUrls: ['./withdraw-sowjd.component.css'],
})
export class WithdrawSOWJDComponent {
  sowJdId: any;
  ratecardtype!: boolean;
  nonratecardtype!: boolean;
  Bosch!: boolean;
  Global!: boolean;
  remarks: string = '';
  customerName: any;
  success!: boolean;
  description: any;
  sowJdNumber: any;
  statusName: any;
  data: any;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
    public dialogRef: MatDialogRef<WithdrawSOWJDComponent>,
    private notifyservice: NotifyService
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.sowJdId = this.data.sowJdId;
    this.sowJdNumber = this.data.sowJdNumber;
    this.statusName = this.data.sowJdStatus;
    this.description = this.data.description;
    this.customerName = this.data.customerName;
    if (this.data.sowJdType == 'Non_RateCard') {
      this.nonratecardtype = true;
      this.ratecardtype = false;
    } else if (this.data.sowJdType == 'Rate_Card') {
      this.nonratecardtype = false;
      this.ratecardtype = true;
    }
    if (this.data.customerType.toLowerCase() == 'bosch') {
      this.Bosch = true;
      this.Global = false;
    } else if (this.data.customerType.toLowerCase() == 'Global') {
      this.Global = true;
      this.Bosch = false;
    }
  }

  SaveForm() {
    let input = {
      sowJdId: this.sowJdId,
      withDrawRemarks: this.remarks,
    };
    this.dashboardService.withdraw(input).subscribe((response: any) => {
      console.log(response);
      if (response.data != null) {
        this.notifyservice.alert(response.data[0].message);
        // if(response.data[0].isSuccess){
        //   let dialogRef = this.dialog.open(SuccessComponent,this.dialogConfig);
        //     let message=response.data[0].message;
        //     let instance = dialogRef.componentInstance;
        //     instance.message = message;
        // }
      }
    });
  }
}
