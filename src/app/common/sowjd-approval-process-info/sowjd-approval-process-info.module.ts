import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SowjdApprovalProcessInfoComponent } from './sowjd-approval-process-info.component';

@NgModule({
  declarations: [SowjdApprovalProcessInfoComponent],
  imports: [CommonModule],
  exports: [SowjdApprovalProcessInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SowjdApprovalProcessInfoModule {}
