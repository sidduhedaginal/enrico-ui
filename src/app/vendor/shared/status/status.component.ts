import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-status',
  template: `<div>{{status}}</div>`,
  styles: []
})
export class StatusComponent {

  status:string='';
  constructor() { }

  agInit(params: ICellRendererParams<any, any>): void {
    this.status=params.data.status?'Active':'Inactive';
    //console.log(params.data);
    }
    refresh(params: ICellRendererParams<any, any>): boolean {
      return false;
    }
}
