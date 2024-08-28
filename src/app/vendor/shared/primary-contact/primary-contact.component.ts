import { Component, OnInit } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lib-primary-contact',
  template: `<span>{{contactName}}</span>
             <div style="font-size:10px;margin-top:-25px" *ngIf="isPrimaryContact">Priymary Contact</div>`,
  styles: []
})
export class PrimaryContactComponent {
 isPrimaryContact:boolean=false;
 contactName:string='';
  constructor() { }

  agInit(params: ICellRendererParams<any, any>): void {
    this.contactName=params.value;
    console.log(params.data.primaryContact)
    this.isPrimaryContact=params.data.primaryContact;
    }
    refresh(params: ICellRendererParams<any, any>): boolean {
      return false;
    }
}
