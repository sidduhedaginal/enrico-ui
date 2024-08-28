import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RateCardMasterService } from '../../services/rate-card-master.service';

@Component({
  selector: 'lib-rate-card-master-actions',
  template: `<div class="icon-class" style="padding-top: 5px; cursor: pointer;">
            <span class="blue-delete icon" (click)="deleteVendorRateCard()"></span>
            <span class="blue-edit icon" (click)="editVendorRateCard()"></span></div>`,
  styles: []
})
export class RateCardMasterActionsComponent  {
  constructor(private router: Router,private rateCardMasterService:RateCardMasterService){}
  vendorId:any;
  agInit(params: ICellRendererParams<any, any>): void {
  this.vendorId = params.data.no;
  }

  refresh(params: ICellRendererParams<any, any>): boolean {
    return false;
  }

  deleteVendorRateCard(){
    // this.rateCardMasterService.deleteRateCard([1]).subscribe((response:any)=>{
    //   if(response.success){
    //     alert('Record deleted successfully');
    //   }
    // })
  }
  editVendorRateCard(){
    this.router.navigate(['/add-new-ratecard'], {
      queryParams: {
        VendorRateCardId: this.vendorId,
      },
    });
  }
}
