import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-highlight',
  template: `<div class="highlight-class" (click)="onValueClick()" >{{params.value}}</div>`,
  styles: ['.highlight-class{cursor:pointer;color:#307bc4;}']
})
export class HighlightComponent {

  constructor() { }

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }
  onValueClick(){
    this.params.onValueClick(this.params);
  }

}
