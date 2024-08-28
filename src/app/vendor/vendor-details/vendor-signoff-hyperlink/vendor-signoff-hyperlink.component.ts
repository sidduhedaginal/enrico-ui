import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-vendor-signoff-hyperlink',
  templateUrl: './vendor-signoff-hyperlink.component.html',
  styleUrls: ['./vendor-signoff-hyperlink.component.scss']
})
export class VendorSignoffHyperlinkComponent {
  constructor(private router: Router) {}
  data: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.data = params.data;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  navigateToVendordSignoffDetail(technicalproposalID: string) {
    this.router.navigate(['/vendor/vendor-signoff/', technicalproposalID]);
  }
}
