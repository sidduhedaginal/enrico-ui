import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-vendor-rfq-hyperlink',
  templateUrl: './vendor-rfq-hyperlink.component.html',
  styleUrls: ['./vendor-rfq-hyperlink.component.scss'],
})
export class VendorRfqHyperlinkComponent {
  constructor(private router: Router) {}
  data: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.data = params.data;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  navigateToVendordRfqDetail(rfqId: string) {
    this.router.navigate(['/vendor/vendor-rfq/', rfqId]);
  }
}
