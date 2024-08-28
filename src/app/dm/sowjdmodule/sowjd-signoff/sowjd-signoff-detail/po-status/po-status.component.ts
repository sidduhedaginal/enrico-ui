import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-po-status',
  template: `<div *ngIf="!params.data.isDeleted">Active</div>
    <div *ngIf="params.data.isDeleted">In-Active</div>`,
  styles: [],
})
export class PoStatusComponent {
  constructor() {}

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }
}
