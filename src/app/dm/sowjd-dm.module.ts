import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SowjdmoduleRoutingModule } from './sowjdmodule-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { SowjdlinkformComponent } from './sowjdmodule/sowjd-tree-structure/sowjdlinkform.component';
import { RfqformComponent } from './sowjdmodule/RFQ-technical-evaluation/rfqform.component';
import { WidthdrawComponent } from './popup/widthdraw/widthdraw.component';
import { TechnicalProposalComponent } from './sowjdmodule/technical-proposal/technical-proposal.component';
import { SrnformComponent } from './sowjdmodule/srn-form/srnform.component';
import { CancelformComponent } from './popup/cancelform/cancelform.component';
import { DelegationDialogComponent } from './popup/delegation-dialog/delegation-dialog.component';
import { SpinnerComponent } from './sowjdmodule/spinner/spinner.component';
import { IdentifiedskillgridComponent } from './popup/identifiedskillgrid/identifiedskillgrid.component';
import { MaterialModule } from '../material/material.module';
import { SowjdDmComponent } from './sowjd-dm.component';
import { IdentifiedskillsetComponent } from './popup/identifiedskillset/identifiedskillset.component';
import { ConfirmDeletePopupComponent } from './popup/confirm-delete-popup/confirm-delete-popup.component';
import { SowjdRequestListComponent } from './sowjdmodule/sowjd-request-list/sowjd-request-list.component';
import { VendorSuggestionComponent } from './popup/vendor-suggestion/vendor-suggestion.component';
import { SowjdTabComponent } from './sowjdmodule/sowjd-tab/sowjd-tab.component';
import { VendorgridComponent } from './popup/vendorgrid/vendorgrid.component';
import { LoaderModule } from '../loader/loader.module';
import { ConfirmationAlertComponent } from './popup/confirmation-alert/confirmation-alert.component';
import { SowjdSrnComponent } from './sowjd-srn/sowjd-srn.component';
import { DmSrnDetailComponent } from './sowjd-srn/dm-srn-detail/dm-srn-detail.component';
import { SowjdCreationFormComponent } from './sowjdmodule/sowjd-creation-form/sowjd-creation-form.component';
import { SearchBarModule } from '../common/search-bar-group/search-bar.module';
import { HyperlinkComponent } from './sowjdmodule/hyperlink/hyperlink.component';
import { ActionComponent } from './sowjdmodule/action/action.component';
import { RfqTechEvaluationComponent } from './sowjdmodule/rfq-tech-evaluation/rfq-tech-evaluation.component';
import { FloatRfqComponent } from './popup/float-rfq/float-rfq.component';
import { SowjdRfqDetailComponent } from './sowjdmodule/RFQ-technical-evaluation/sowjd-rfq-detail/sowjd-rfq-detail.component';
import { VendorRfqDetailComponent } from './sowjdmodule/RFQ-technical-evaluation/vendor-rfq-detail/vendor-rfq-detail.component';
import { SowjdRfqDetailsHyperlinkComponent } from './sowjdmodule/sowjd-rfq-details-hyperlink/sowjd-rfq-details-hyperlink.component';
import { EvaluaterfqComponent } from './sowjdmodule/RFQ-technical-evaluation/evaluaterfq/evaluaterfq.component';
import { SendbackrfqComponent } from './sowjdmodule/RFQ-technical-evaluation/sendbackrfq/sendbackrfq.component';
import { InitiatesignoffComponent } from './popup/initiatesignoff/initiatesignoff.component';
import { ExtendlastdateComponent } from './sowjdmodule/RFQ-technical-evaluation/extendlastdate/extendlastdate.component';
import { WithdrawrfqComponent } from './sowjdmodule/RFQ-technical-evaluation/withdrawrfq/withdrawrfq.component';
import { SowjdSignoffComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff.component';
import { SignoffHyperlinkComponent } from './sowjdmodule/sowjd-signoff/signoff-hyperlink/signoff-hyperlink.component';
import { SowjdSignoffDetailComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff-detail/sowjd-signoff-detail.component';
import { SendbackSignoffComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff-detail/sendback-signoff/sendback-signoff.component';
import { CommonSignoffComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff-detail/common-signoff/common-signoff.component';
import { AssignPOComponent } from './sowjdmodule/sowjd-signoff/assign-po/assign-po.component';
import { SrnHyperlinkComponent } from './sowjd-srn/srn-hyperlink/srn-hyperlink.component';
import { PoStatusComponent } from './sowjdmodule/sowjd-signoff/sowjd-signoff-detail/po-status/po-status.component';
import { CommonApprovalComponent } from './popup/common-approval/common-approval.component';
import { SearchBarWBSModule } from '../common/search-bar-wbs/search-bar-wbs.module';
import { CostcenterSearchBarModule } from '../common/search-bar-costcenter/search-bar.module';
import { SrnActionComponent } from './sowjd-srn/srn-action/srn-action.component';
import { SearchBarSkillsetModule } from '../common/search-bar-skillset/search-bar-skillset.module';
import { SearchBarVendorModule } from '../common/search-bar-vendor/search-bar-vendor.module';
import { SearchBarFundCenterModule } from '../common/search-bar-fund-center/search-bar-fund-center.module';
import { SearchBarLocationPlantModule } from '../common/search-bar-location-plant/search-bar-location-plant.module';
import { ReferenceSearchBarModule } from '../common/search-bar-reference/search-bar.module';
import { SearchBarAssignPOModule } from '../common/search-bar-assign-po/search-bar-assign-po.module';
import { SowjdApprovalProcessInfoComponent } from '../common/sowjd-approval-process-info/sowjd-approval-process-info.component';
import { VendorCheckboxComponent } from '../sec-spoc/vendor-checkbox/vendor-checkbox.component';
import { DhDetailComponent } from '../dh-detail/dh-detail.component';
import { SowjdCommonInfoModule } from '../common/sowjd-common-info/sowjd-common-info.module';
import { SecSpocDetailComponent } from '../sec-spoc/sec-spoc-detail/sec-spoc-detail.component';
import { SowjdApprovalProcessInfoModule } from '../common/sowjd-approval-process-info/sowjd-approval-process-info.module';
import { SRNApprovalProcessInfoModule } from '../common/srn-approval-process-info/srn-approval-process-info.module';
import { EditSignoffDemandComponent } from './popup/edit-signoff-demand/edit-signoff-demand.component';
import { CurrencyModule } from '../common/currency-pipe/currency.module';
import { NumericFormatModule } from '../common/numeric-format-pipe/numeric-format.module';

@NgModule({
  declarations: [
    SowjdDmComponent,
    SowjdCreationFormComponent,
    SowjdlinkformComponent,
    RfqformComponent,
    WidthdrawComponent,
    IdentifiedskillsetComponent,
    TechnicalProposalComponent,
    SrnformComponent,
    CancelformComponent,
    ConfirmDeletePopupComponent,
    DelegationDialogComponent,
    VendorSuggestionComponent,
    SowjdRequestListComponent,
    SowjdTabComponent,
    SpinnerComponent,
    VendorgridComponent,
    IdentifiedskillgridComponent,
    ConfirmationAlertComponent,
    SowjdSrnComponent,
    DmSrnDetailComponent,
    HyperlinkComponent,
    ActionComponent,
    RfqTechEvaluationComponent,
    FloatRfqComponent,
    InitiatesignoffComponent,
    SowjdRfqDetailComponent,
    VendorRfqDetailComponent,
    SowjdRfqDetailsHyperlinkComponent,
    EvaluaterfqComponent,
    SendbackrfqComponent,
    ExtendlastdateComponent,
    WithdrawrfqComponent,
    SowjdSignoffComponent,
    SignoffHyperlinkComponent,
    SowjdSignoffDetailComponent,
    SendbackSignoffComponent,
    CommonSignoffComponent,
    AssignPOComponent,
    SrnHyperlinkComponent,
    PoStatusComponent,
    CommonApprovalComponent,
    SrnActionComponent,
    VendorCheckboxComponent,
    DhDetailComponent,
    SecSpocDetailComponent,
    EditSignoffDemandComponent,
  ],
  imports: [
    SowjdmoduleRoutingModule,
    CommonModule,
    FormsModule,
    AgGridModule,
    HttpClientModule,
    MaterialModule,
    LoaderModule,
    SearchBarModule,
    SearchBarWBSModule,
    CostcenterSearchBarModule,
    SearchBarSkillsetModule,
    SearchBarVendorModule,
    SearchBarFundCenterModule,
    SearchBarLocationPlantModule,
    ReferenceSearchBarModule,
    SearchBarAssignPOModule,
    SowjdApprovalProcessInfoModule,
    SowjdCommonInfoModule,
    SRNApprovalProcessInfoModule,
    CurrencyModule,
    NumericFormatModule,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SowjdDmModule {}
