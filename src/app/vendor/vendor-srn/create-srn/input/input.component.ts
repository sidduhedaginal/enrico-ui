import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-input',
  template: `<div>
    <input
      type="text"
      [(ngModel)]="value"
      (keydown)="keyPressNumbers($event)"
    />
  </div>`,
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  constructor() {}

  value: any;

  agInit(params: ICellRendererParams<any, any>): void {
    this.value = params.value;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  isNumberKey(evt) {
    let reg: any;

    reg = /^-?\d*(\.\d{0,2})?$/;

    let input = evt.target.value + String.fromCharCode(evt.charCode);

    if (!reg.test(input)) {
      evt.preventDefault();
    }
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}
