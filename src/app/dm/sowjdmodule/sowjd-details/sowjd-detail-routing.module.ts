import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SowjdDetailsComponent } from './sowjd-details.component';
import { SowjdInfoComponent } from '../sowjd-info/sowjd-info.component';
import { SowjdRfqListComponent } from './sowjd-rfq-list/sowjd-rfq-list.component';
import { SowjdSignoffListComponent } from './sowjd-signoff-list/sowjd-signoff-list.component';
import { SowjdSrnListComponent } from './sowjd-srn-list/sowjd-srn-list.component';

const routes: Routes = [
  {
    path: '',
    component: SowjdDetailsComponent,
    children: [
      {
        path: 'sowjd-info/:id',
        component: SowjdInfoComponent,
        data: { breadcrumb: 'SoW JD DETAILS' },
      },
      {
        path: 'sowjd-rfq-list/:id',
        component: SowjdRfqListComponent,
        data: { breadcrumb: 'RFQ LIST' },
      },
      {
        path: 'sowjd-signoff-list/:id',
        component: SowjdSignoffListComponent,
        data: { breadcrumb: 'PROPOSAL SIGNOFF LIST' },
      },
      {
        path: 'sowjd-srn-list/:id',
        component: SowjdSrnListComponent,
        data: { breadcrumb: 'SRN LIST' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SowjdDetailRoutingModule {}
