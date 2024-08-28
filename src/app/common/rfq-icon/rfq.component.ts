import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-document',
  template: `<a class="icon-class" title="Float RFQ" (click)="doFloatRFQ()">
    <!-- <span class="add icon"></span> -->
    <span>Float RFQ</span>
  </a>`,
  styles: ['.icon{margin-right: 2px;}'],
})
export class RfqComponent {
  constructor() {}

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  doFloatRFQ() {
    this.params.doFloatRFQ(this.params);
  }
}
