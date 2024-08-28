import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanningRoutingModule } from './planning-routing.module';
import { PlanningtabsComponent } from './planningtabs/planningtabs.component';
import { CfcycleComponent } from './cfcycle/cfcycle.component';
import { AnnualplanningComponent } from './annualplanning/annualplanning.component';
import { FirstlevelplanningComponent } from './firstlevelplanning/firstlevelplanning.component';
import { SecondlevelplanningComponent } from './secondlevelplanning/secondlevelplanning.component';
import { NoplanningpopupComponent } from './popups/noplanningpopup/noplanningpopup.component';
import { MaterialModule } from '../material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { CreateAOPpopupComponent } from './popups/create-aoppopup/create-aoppopup.component';
import { CreateFLPComponent } from './popups/create-flp/create-flp.component';
import { CreateSLPComponent } from './popups/create-slp/create-slp.component';
import { WithdrawAOPComponent } from './popups/withdraw-aop/withdraw-aop.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { CancelSLPComponent } from './popups/cancel-slp/cancel-slp.component';
import { SecondleveldetailsComponent } from './secondleveldetails/secondleveldetails.component';
import { AopdetailsComponent } from './aopdetails/aopdetails.component';
import { FirstleveldetailsComponent } from './firstleveldetails/firstleveldetails.component';
import { EditSEcondLevelPlanningComponent } from './popups/edit-second-level-planning/edit-second-level-planning.component';
import { AddresourceComponent } from './popups/addresource/addresource.component';
import { EditpopupComponent } from './popups/editpopup/editpopup.component';
import { ConfirmationpopupComponent } from './popups/confirmationpopup/confirmationpopup.component';
import { CancelFlpComponent } from './popups/cancel-flp/cancel-flp.component';
import { PoplanComponent } from './poplan/poplan.component';
import { DelegateSecondlevelComponent } from './popups/delegate-secondlevel/delegate-secondlevel.component';
import { ApproveaopComponent } from './popups/approveaop/approveaop.component';
import { PoplandetailsComponent } from './poplandetails/poplandetails.component';
import { ApproveSLPComponent } from './popups/approve-slp/approve-slp.component';
import { ApprovemyactionAOPComponent } from './popups/approvemyaction-aop/approvemyaction-aop.component';
import { PoplanningComponent } from './popups/poplanning/poplanning.component';
import { PoshowsubmitComponent } from './popups/poshowsubmit/poshowsubmit.component';
import { PoplanningeditComponent } from './popups/poplanningedit/poplanningedit.component';
import { PoViewOnlyComponent } from './popups/po-view-only/po-view-only.component';
import { AccessdeniedComponent } from './accessdenied/accessdenied.component';
import { MyActionComponent } from '../my-action/my-action.component';
import { DeletePoConfirmComponent } from './popups/delete-po-confirm/delete-po-confirm.component';
import { OwnershipComponent } from './popups/ownership/ownership.component';
import { ImportresourceComponent } from './secondleveldetails/importresource/importresource.component';
import { ImportedfileComponent } from './secondleveldetails/importedfile/importedfile.component';
import { PlanningApprovalProcessLineModule } from './planning-approval-process-line/planning-approval-process-line.module';
import { CurrencyModule } from '../common/currency-pipe/currency.module';
import { NumericFormatModule } from '../common/numeric-format-pipe/numeric-format.module';

@NgModule({
  declarations: [
    PlanningtabsComponent,
    CfcycleComponent,
    AnnualplanningComponent,
    FirstlevelplanningComponent,
    SecondlevelplanningComponent,
    CreateAOPpopupComponent,
    NoplanningpopupComponent,
    CreateFLPComponent,
    CreateSLPComponent,
    WithdrawAOPComponent,
    SpinnerComponent,
    CancelSLPComponent,
    SecondleveldetailsComponent,
    AopdetailsComponent,
    FirstleveldetailsComponent,
    EditSEcondLevelPlanningComponent,
    AddresourceComponent,
    EditpopupComponent,
    ConfirmationpopupComponent,
    CancelFlpComponent,
    PoplanComponent,
    DelegateSecondlevelComponent,
    ApproveaopComponent,
    PoplandetailsComponent,
    PoplanningComponent,
    PoshowsubmitComponent,
    ApproveSLPComponent,
    ApprovemyactionAOPComponent,
    PoplanningComponent,
    PoshowsubmitComponent,
    PoplanningeditComponent,
    PoViewOnlyComponent,
    AccessdeniedComponent,
    MyActionComponent,
    DeletePoConfirmComponent,
    OwnershipComponent,
    ImportresourceComponent,
    ImportedfileComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    PlanningRoutingModule,
    PlanningApprovalProcessLineModule,CurrencyModule, NumericFormatModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlanningModule { }
