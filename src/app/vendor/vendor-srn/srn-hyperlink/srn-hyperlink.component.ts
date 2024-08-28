import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-srn-hyperlink',
  templateUrl: './srn-hyperlink.component.html',
  styleUrls: ['./srn-hyperlink.component.css'],
})
export class SrnHyperlinkComponent {
  constructor(private router: Router) {}

  data: any;
  agInit(params: ICellRendererParams<any, any>): void {
    this.data = params.data;
  }
  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  navigateToVendorDetail(srnId: string) {
    this.router.navigate(['/vendor/vendor-srn', srnId]);

    // if (this.data.srnStatusID === 4) {
    //   this.router.navigate(['/vendor/vendor-srn/edit', srnid]);
    // } else {
    //   this.router.navigate(['/vendor/vendor-srn/view', srnid]);
    // }
  }
}
