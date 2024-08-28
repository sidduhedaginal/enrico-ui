import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-vendor-checkbox',
  template: `<div class="icon-class">
    <mat-checkbox
      #checkbox
      (change)="doApproveReject(checkbox.checked)"
      [disabled]="
        params.data.soWJdStatus === 4 ||
        params.data.soWJdStatus === 6 ||
        params.data.soWJdStatus === 17
      "
      [checked]="params.value"
    ></mat-checkbox>
  </div>`,
  styles: [
    '.icon{margin-top: 5px;margin-left: 15px;} .m-right{margin-right:12px}',
  ],
})
export class VendorCheckboxComponent {
  constructor() {}

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }
  doApproveReject(event: any) {
    this.params.doApproveReject(this.params, event);
  }
}
