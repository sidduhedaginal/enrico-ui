import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/material/material.module';
import { SowjdDetailRoutingModule } from './sowjd-detail-routing.module';
import { SowjdDetailsComponent } from './sowjd-details.component';
import { SowjdInfoComponent } from '../sowjd-info/sowjd-info.component';
import { SowjdRfqListComponent } from './sowjd-rfq-list/sowjd-rfq-list.component';
import { SowjdApprovalProcessInfoModule } from 'src/app/common/sowjd-approval-process-info/sowjd-approval-process-info.module';
import { SowjdCommonInfoModule } from 'src/app/common/sowjd-common-info/sowjd-common-info.module';

@NgModule({
  declarations: [
    SowjdDetailsComponent,
    SowjdInfoComponent,
    SowjdRfqListComponent,
  ],
  imports: [
    SowjdDetailRoutingModule,
    CommonModule,
    FormsModule,
    AgGridModule,
    HttpClientModule,
    MaterialModule,
    SowjdApprovalProcessInfoModule,
    SowjdCommonInfoModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SowjdDetailModule {}
