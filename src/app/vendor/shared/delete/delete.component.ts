import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-delete',
  template: `<div class="icon-class" style="padding-top: 5px; cursor: pointer;" (click)="deleteClicked()">
  <div class="blue-delete icon"></div></div>`,
  styles: []
})
export class DeleteCellRenderComponent {

  constructor() { }
  params:any;

  agInit(params: ICellRendererParams<any, any>): void {
    this.params=params;
    }
    refresh(params: ICellRendererParams<any, any>): boolean {
      return false;
    }

    deleteClicked(){
      this.params.deleteClicked(this.params.data);
    }
}
