import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-my-action',
  template: `<div class="icon-class">
    <div
      class="information icon m-right"
      title="View detail"
      (click)="doApproveReject()"
    ></div>
    <div class="delegate icon" title="Delegate" (click)="doDelegate()"></div>
  </div>`,
  styles: ['.m-right{margin-right:8px}'],
})
export class MyActionComponent {
  constructor() {}

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }
  doApproveReject() {
    this.params.doApproveReject(this.params);
  }
  doDelegate() {
    this.params.doDelegate(this.params);
  }
}
