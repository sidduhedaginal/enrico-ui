import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SowjdCreationFormComponent } from './sowjdmodule/sowjd-creation-form/sowjd-creation-form.component';
import { RfqformComponent } from './sowjdmodule/RFQ-technical-evaluation/rfqform.component';
import { SowjdlinkformComponent } from './sowjdmodule/sowjd-tree-structure/sowjdlinkform.component';
import { SowjdDmComponent } from './sowjd-dm.component';
import { SowjdRequestListComponent } from './sowjdmodule/sowjd-request-list/sowjd-request-list.component';
import { SowjdSrnComponent } from './sowjd-srn/sowjd-srn.component';
import { DmSrnDetailComponent } from './sowjd-srn/dm-srn-detail/dm-srn-detail.component';
import { RfqTechEvaluationComponent } from './sowjdmodule/rfq-tech-evaluation/rfq-tech-evaluation.component';
import { SowjdRfqDetailComponent } from './sowjdmodule/RFQ-technical-evaluation/sowjd-rfq-detail/sowjd-rfq-detail.component';
import { SowjdSignoffComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff.component';
import { SowjdSignoffDetailComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff-detail/sowjd-signoff-detail.component';
import { DhDetailComponent } from '../dh-detail/dh-detail.component';
import { SecSpocDetailComponent } from '../sec-spoc/sec-spoc-detail/sec-spoc-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SowjdDmComponent,
    children: [
      {
        path: 'my-sowjd',
        component: SowjdRequestListComponent,
        data: { breadcrumb: 'SoW JD' },
        children: [
          {
            path: 'create-sowjd/:id',
            component: SowjdCreationFormComponent,
            data: { breadcrumb: 'CREATE' },
          },
          {
            path: 'sowjd-detail',
            loadChildren: () =>
              import('./sowjdmodule/sowjd-details/sowjd-detail.module').then(
                (m) => m.SowjdDetailModule
              ),
            data: { breadcrumb: { skip: true } },
          },

          {
            path: 'dh-approval/:sowjdId',
            component: DhDetailComponent,
            data: { breadcrumb: 'APPROVAL' },
          },
          {
            path: 'spoc-approval/:sowjdId',
            component: SecSpocDetailComponent,
            data: { breadcrumb: 'APPROVAL' },
          },
        ],
      },
      {
        path: 'rfq-tech-eval',
        component: RfqTechEvaluationComponent,
        data: { breadcrumb: 'RFQ TECHNICAL EVALUATION' },
        children: [
          {
            path: ':rfqId',
            component: SowjdRfqDetailComponent,
            data: { breadcrumb: 'RFQ' },
          },
        ],
      },
      {
        path: 'sowjd-signoff',
        component: SowjdSignoffComponent,
        data: { breadcrumb: 'SoW JD SIGN OFF' },
        children: [
          {
            path: ':tpId',
            component: SowjdSignoffDetailComponent,
            data: { breadcrumb: 'SIGN OFF' },
          },
        ],
      },
      {
        path: 'sowjd-srn',
        component: SowjdSrnComponent,
        data: { breadcrumb: 'SoW JD SRN' },
        children: [
          {
            path: ':srnId',
            component: DmSrnDetailComponent,
            data: { breadcrumb: 'SRN DETAIL' },
          },
        ],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my-sowjd',
      },
    ],
  },
  {
    path: 'my-actions',
    data: { breadcrumb: 'My Actions' },
    children: [
      {
        path: 'dh-approval/:sowjdId',
        component: DhDetailComponent,
        data: { breadcrumb: 'APPROVAL' },
      },
      {
        path: 'spoc-approval/:sowjdId',
        component: SecSpocDetailComponent,
        data: { breadcrumb: 'APPROVAL' },
      },
    ],
  },
  {
    path: 'rfqform',
    component: RfqformComponent,
  },
  {
    path: 'sowjdform/:id',
    component: SowjdlinkformComponent,
    data: { breadcrumb: 'SoW JD DETAILS' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SowjdmoduleRoutingModule {}
