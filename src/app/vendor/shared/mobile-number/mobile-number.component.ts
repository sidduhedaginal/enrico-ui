import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-mobile-number',
  template: `<div>{{params.data.countryCode}}{{params.data.mobile}}</div>`,
  styles: []
})
export class MobileNumberComponent {

  params:any;
  constructor() { }

  agInit(params: ICellRendererParams<any, any>): void {
    this.params=params;
    }
    refresh(params: ICellRendererParams<any, any>): boolean {
      return false;
    }

}
