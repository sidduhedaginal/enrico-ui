import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { config } from 'src/app/config';

@Component({
  selector: 'lib-datefilter',
  template: `<div>{{date | date: dateFormat}}
  </div>`,
  styles: []
})
export class DatefilterComponent {
  dateFormat:any=config.dateFormat;
  constructor() { }

  date: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.date = params.value;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

}
