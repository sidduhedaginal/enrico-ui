import { NgModule } from '@angular/core';
import { VendorSowjdComponent } from './vendor-sowjd.component';
import { VendorSOWJDRoutingModule } from './vendor-sowjdrouting.module';
import { MaterialModule } from '../material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { VendorformComponent } from './vendorform/vendorform.component';
import { AddResourceNoNRateCardTMComponent } from './BGSW/add-resource-rate-card-tm/add-resource-non-rate-card-tm/add-resource-non-rate-card-tm.component';
import { VendorDetailsComponent } from './vendor-details/vendor-details.component';
import { DatefilterComponent } from './shared/datefilter/datefilter.component';
import { AddNewRatecardComponent } from './add-new-ratecard/add-new-ratecard.component';
import { RateCardMasterActionsComponent } from './shared/rate-card-master-actions/rate-card-master-actions.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { StatusComponent } from './shared/status/status.component';
import { EditDeleteActionsComponent } from './shared/edit-delete-actions/edit-delete-actions.component';
import { MobileNumberComponent } from './shared/mobile-number/mobile-number.component';
import { DeleteCellRenderComponent } from './shared/delete/delete.component';
import { EditVendorDetailsComponent } from './edit-vendor-details/edit-vendor-details.component';
import { PrimaryContactComponent } from './shared/primary-contact/primary-contact.component';
import { MyRateCardListComponent } from './my-rate-card-list/my-rate-card-list.component';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { HighlightComponent } from './shared/highlight/highlight.component';
import { MySubmissionActionsComponent } from './shared/my-submission-actions/my-submission-actions.component';
import { DocURLComponent } from './shared/doc-url/doc-url.component';
import { CommonModule } from '@angular/common';
import { WithdrawSOWJDComponent } from './vendor-srn/withdraw-sowjd/withdraw-sowjd.component';
import { LoaderModule } from '../loader/loader.module';
import { SowJDDocListComponent } from './sow-jddoc-list/sow-jddoc-list.component';
import { TpAddResourceComponent } from './tp-add-resource/tp-add-resource.component';
import { CreateSrnComponent } from './vendor-srn/create-srn/create-srn.component';
import { VendorSrnComponent } from './vendor-srn/vendor-srn.component';
import { VendorSrnDetailComponent } from './vendor-srn/vendor-srn-detail/vendor-srn-detail.component';
import { VendorRfqComponent } from './vendor-rfq/vendor-rfq.component';
import { VendorSignoffComponent } from './vendor-signoff/vendor-signoff.component';
import { VendorRfqHyperlinkComponent } from './vendor-details/vendor-rfq-hyperlink/vendor-rfq-hyperlink.component';
import { VendorRfqDetailComponent } from './vendor-rfq/vendor-rfq-detail/vendor-rfq-detail.component';
import { AddResourceRateCardTmComponent } from './BGSW/add-resource-rate-card-tm/add-resource-rate-card-tm.component';
import { AddActivityRateCardWpComponent } from './BGSV/add-activity-rate-card-wp/add-activity-rate-card-wp.component';
import { AddActivityNonRateCardWpComponent } from './BGSV/add-activity-non-rate-card-wp/add-activity-non-rate-card-wp.component';
import { AddResourceRateCardWpComponent } from './BGSW/add-resource-rate-card-wp/add-resource-rate-card-wp.component';
import { RfqRemarksComponent } from './vendor-rfq/rfq-remarks/rfq-remarks.component';
import { UpdateInvoiceComponent } from './vendor-srn/vendor-srn-detail/update-invoice/update-invoice.component';
import { SrnHyperlinkComponent } from './vendor-srn/srn-hyperlink/srn-hyperlink.component';
import { AddOdcComponent } from './vendor-srn/create-srn/add-odc/add-odc.component';
import { VendorSearchBarSkillsetModule } from './common/vendor-search-bar-skillset/vendor-search-bar-skillset.module';
import { SearchBarSoWJDModule } from './vendor-srn/create-srn/search-bar-sowjd/search-bar-sowjd.module';
import { VendorSRNViewDetailComponent } from './vendor-srn/vendor-srn-view-detail/vendor-srn-view-detail.component';
import { SRNApprovalProcessInfoModule } from '../common/srn-approval-process-info/srn-approval-process-info.module';
import { ErrorMessageComponent } from '../popup/error-message/error-message.component';
import { CurrencyModule } from '../common/currency-pipe/currency.module';
import { NumericFormatModule } from '../common/numeric-format-pipe/numeric-format.module';
import { VendorSignoffDetailsComponent } from './vendor-signoff/vendor-signoff-details/vendor-signoff-details.component';

@NgModule({
  declarations: [
    VendorSowjdComponent,
    VendorformComponent,
    VendorDetailsComponent,
    DatefilterComponent,
    AddNewRatecardComponent,
    RateCardMasterActionsComponent,
    ContactDetailsComponent,
    PrimaryContactComponent,
    StatusComponent,
    EditDeleteActionsComponent,
    MobileNumberComponent,
    DeleteCellRenderComponent,
    EditVendorDetailsComponent,
    MyRateCardListComponent,
    HighlightComponent,
    MySubmissionActionsComponent,
    SowJDDocListComponent,
    DocURLComponent,
    WithdrawSOWJDComponent,
    TpAddResourceComponent,
    CreateSrnComponent,
    VendorSrnComponent,
    VendorSrnDetailComponent,
    VendorRfqComponent,
    VendorSignoffComponent,
    VendorRfqHyperlinkComponent,
    VendorRfqDetailComponent,
    AddResourceRateCardTmComponent,
    AddActivityRateCardWpComponent,
    AddActivityNonRateCardWpComponent,
    AddResourceNoNRateCardTMComponent,
    AddResourceRateCardWpComponent,
    RfqRemarksComponent,
    UpdateInvoiceComponent,
    SrnHyperlinkComponent,
    AddOdcComponent,
    VendorSignoffDetailsComponent,
    VendorSRNViewDetailComponent,
    ErrorMessageComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AgGridModule,
    VendorSOWJDRoutingModule,
    NgxPopperjsModule,
    LoaderModule,
    VendorSearchBarSkillsetModule,
    SearchBarSoWJDModule,
    SRNApprovalProcessInfoModule,
    CurrencyModule,
    NumericFormatModule,
  ],
})
export class VendorSowjdModule {}
