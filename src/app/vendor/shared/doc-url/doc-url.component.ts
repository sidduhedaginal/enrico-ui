import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-doc-url',
  template: `<a class="highlight-class" href="{{params.data.fileUrl}}">{{params.value}}</a>`,
  styles: ['.highlight-class{cursor:pointer;color:#307bc4;}']
})
export class DocURLComponent {

  constructor() { }

  params: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

}
