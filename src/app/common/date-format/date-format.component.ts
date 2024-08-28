import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { config } from '../../config';

@Component({
  selector: 'app-my-action',
  template: `<div>{{ params.value | date : dateFormat }}</div>`,
  styles: [],
})
export class DateFormatComponent {
  dateFormat = config.dateFormat;
  constructor() {}

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }
}
