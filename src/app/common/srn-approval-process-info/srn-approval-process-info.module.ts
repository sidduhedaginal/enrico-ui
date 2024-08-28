import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SRNApprovalProcessInfoComponent } from './srn-approval-process-info.component';

@NgModule({
  declarations: [SRNApprovalProcessInfoComponent],
  imports: [CommonModule],
  exports: [SRNApprovalProcessInfoComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SRNApprovalProcessInfoModule {}
