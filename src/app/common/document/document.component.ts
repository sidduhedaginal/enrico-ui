import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-document',
  template: `<div class="icon-class" (click)="docClick()">
    <div class="document icon" title="Document"></div>
    {{ params.value }}
  </div>`,
  styles: [],
})
export class DocumentComponent {
  constructor() {}

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }
  docClick() {
    this.params.docClick(this.params);
  }
}
