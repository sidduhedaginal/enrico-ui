import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-my-submission-actions',
  template: `<div class="icon-class" style="cursor: pointer;"(click)=withdraw() *ngIf="params.data.sowJdRfqStatus=='Submitted'">
            <span class="withdraw icon"></span>
            <u class="action-name">Withdraw</u>
            </div>`,
  styles: [".icon{margin-right:5px;} .action-name{color: #307bc4;}"]
})
export class MySubmissionActionsComponent{
  constructor() { }
  params:any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
    }
  
    refresh(params: ICellRendererParams<any, any>): boolean {
      return false;
    }

    withdraw(){
      this.params.withdraw(this.params);
    }

}
