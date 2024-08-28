import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningApprovalProcessLineComponent } from './planning-approval-process-line.component';



@NgModule({
  declarations: [PlanningApprovalProcessLineComponent],
  imports: [ CommonModule],
  exports: [PlanningApprovalProcessLineComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlanningApprovalProcessLineModule { }
