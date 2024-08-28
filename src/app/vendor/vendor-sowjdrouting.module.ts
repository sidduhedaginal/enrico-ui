import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendorformComponent } from './vendorform/vendorform.component';
import { VendorSowjdComponent } from './vendor-sowjd.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { MyRateCardListComponent } from './my-rate-card-list/my-rate-card-list.component';
import { VendorSrnComponent } from './vendor-srn/vendor-srn.component';
import { CreateSrnComponent } from './vendor-srn/create-srn/create-srn.component';
import { VendorSrnDetailComponent } from './vendor-srn/vendor-srn-detail/vendor-srn-detail.component';
import { VendorRfqComponent } from './vendor-rfq/vendor-rfq.component';
import { VendorSignoffComponent } from './vendor-signoff/vendor-signoff.component';
import { VendorRfqDetailComponent } from './vendor-rfq/vendor-rfq-detail/vendor-rfq-detail.component';
import { VendorSignoffDetailsComponent } from './vendor-signoff/vendor-signoff-details/vendor-signoff-details.component';

const routes: Routes = [
  {
    path: '',
    component: VendorSowjdComponent,
    children: [
      {
        path: 'vendor-rfq',
        component: VendorRfqComponent,
        data: { breadcrumb: 'RFQ-TECHNICAL EVALUATION' },
        children: [
          {
            path: ':rfqId',
            component: VendorRfqDetailComponent,
            data: { breadcrumb: 'RFQ' },
          },
        ],
      },
      {
        path: 'vendor-signoff',
        component: VendorSignoffComponent,
        data: { breadcrumb: 'SIGN OFF' },
        children: [
          {
            path: ':tpId',
            component: VendorSignoffDetailsComponent,
            data: { breadcrumb: 'SIGN OFF' },
          },
        ],
      },
      {
        path: 'vendor-detail',
        component: VendorDetailsComponent,
        data: { breadcrumb: 'VENDOR DETAILS' },
      },
      {
        path: 'MasterData',
        component: MyRateCardListComponent,
        data: { breadcrumb: 'VENDOR RATE CARD MASTER' },
      },
      {
        path: 'sowjd-details/:sowjdId',
        component: VendorformComponent,
        data: { breadcrumb: 'SOW JD DETAILS' },
      },
      {
        path: 'vendor-srn',
        component: VendorSrnComponent,
        data: { breadcrumb: 'SERVICE RECEIPT NOTE' },
        children: [
          {
            path: 'create',
            component: CreateSrnComponent,
            data: { breadcrumb: 'CREATE SRN' },
          },
          {
            path: ':srnId',
            component: VendorSrnDetailComponent,
            data: { breadcrumb: 'SRN DETAIL' },
          },
          {
            path: 'edit/:editsrnId',
            component: VendorSrnDetailComponent,
            data: { breadcrumb: 'SRN EDIT' },
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'vendor-rfq',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorSOWJDRoutingModule {}
