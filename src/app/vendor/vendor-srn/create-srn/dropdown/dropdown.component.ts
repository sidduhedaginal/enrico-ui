import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-dropdown',
  template: ``,
  styleUrls: ['./dropdown.component.scss']
})
export class DropdownComponent {

  constructor() {}

  value: any;

  agInit(params: ICellRendererParams<any, any>): void {
    this.value = params.value;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

}
