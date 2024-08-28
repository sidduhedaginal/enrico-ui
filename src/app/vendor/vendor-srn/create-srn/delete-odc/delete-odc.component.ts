import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-edit-delete-actions',
  template: `<div
    class="icon-class"
    style="padding-top: 5px; cursor: pointer;gap:10px"
  >
    <div class="blue-delete icon" (click)="delete()"></div>
  </div>`,
  styles: [],
})
export class DeleteOdcComponent {
  constructor() {}
  params: any;
  status: boolean = false;

  agInit(params: ICellRendererParams<any, any>): void {
    this.status = params.data.status;
    this.params = params;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  delete() {
    this.params.delete(this.params);
  }
}
