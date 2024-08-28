import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceRoutingModule } from './resource-routing.module';
import { MaterialModule } from '../material/material.module';

import { ResourcetabsComponent } from './resourcetabs/resourcetabs.component';
import { InitiateDeBoardingDialogComponent } from './initiate-de-boarding-dialog/initiate-de-boarding-dialog.component';
import { DebordingTableComponent } from './debording-table/debording-table.component';
import { DebordingMoreActionDialogComponent } from './debording-more-action-dialog/debording-more-action-dialog.component';
import { DeBoardingRequestDetailsComponent } from './de-boarding-request-details/de-boarding-request-details.component';
import { StylePaginatorDirective } from './style-paginator.directive';
import { DeBoardingEclDialogComponent } from './de-boarding-ecl-dialog/de-boarding-ecl-dialog.component';
import { DndDirective } from './dnd.directive';
import { ProgressComponent } from './progress/progress.component';
import { ChangeRequestDetailsComponent } from './change-request-details/change-request-details.component';
import { ChangeRequestTableComponent } from './change-request-table/change-request-table.component';
import { ApiResourceService } from './api-resource.service';
import { ResourceMasterTableComponent } from './resource-master-table/resource-master-table.component';
import { ChangeRequestDetailsViewActionComponent } from './change-request-details-view-action/change-request-details-view-action.component';
import { ChangeDetailsActionDialogComponent } from './change-details-action-dialog/change-details-action-dialog.component';
import { ResourcePlanComponent } from './resource-plan/resource-plan/resource-plan.component';
import { OnboardingPageComponent } from './onboarding-page/onboarding-page/onboarding-page.component';
import { InformPartnerDialogComponent } from './inform-partner-dialog/inform-partner-dialog.component';
import { AccessoriesCollectedDialogComponent } from './accessories-collected-dialog/accessories-collected-dialog.component';
import { DeviceCollectedDialogComponent } from './device-collected-dialog/device-collected-dialog.component';
import { EmployeeCardCollectedDialogComponent } from './employee-card-collected-dialog/employee-card-collected-dialog.component';
import { NtidDeactivatedDialogComponent } from './ntid-deactivated-dialog/ntid-deactivated-dialog.component';
import { ExtendLastWorkingDayDialogComponent } from './extend-last-working-day-dialog/extend-last-working-day-dialog.component';
import { RetainResourceDialogComponent } from './retain-resource-dialog/retain-resource-dialog.component';
import { ResourceLoaderUiComponent } from './resource-loader-ui/resource-loader-ui.component';
import { AgGridModule } from 'ag-grid-angular';
import { ResourceMasterViewTableAgComponent } from './resource-master-view-table-ag/resource-master-view-table-ag.component';
import { DebordingViewTableAgComponent } from './debording-view-table-ag/debording-view-table-ag.component';
import { ChangeRequestViewTableAgComponent } from './change-request-view-table-ag/change-request-view-table-ag.component';
import {OnboardingRequestCreationDetailsComponent} from './onboarding-request-creation-details/onboarding-request-creation-details.component';
import { SubmitOnboardingRequestDialogComponent } from './submit-onboarding-request-dialog/submit-onboarding-request-dialog.component';
import { OnboardingRequestInformationDetailsComponent } from './onboarding-request-information-details/onboarding-request-information-details.component';
import { OnboardApproveDialogComponent } from './onboard-approve-dialog/onboard-approve-dialog.component';
import { OnboardRejectDialogComponent } from './onboard-reject-dialog/onboard-reject-dialog.component';
import { OnboardSentBackDialogComponent } from './onboard-sent-back-dialog/onboard-sent-back-dialog.component';
import { OnboardDelegateDialogComponent } from './onboard-delegate-dialog/onboard-delegate-dialog.component';
import { OnboardUpdateNtidDialogComponent } from './onboard-update-ntid-dialog/onboard-update-ntid-dialog.component';
import { OnboardCheckinDialogComponent } from './onboard-checkin-dialog/onboard-checkin-dialog.component';
import { OnboardShareNtidDialogComponent } from './onboard-share-ntid-dialog/onboard-share-ntid-dialog.component';
import { OnboardIssueidCardDialogComponent } from './onboard-issueid-card-dialog/onboard-issueid-card-dialog.component';
import { OnboardingInitiateBackgroundVerificationDialogComponent } from './onboarding-initiate-background-verification-dialog/onboarding-initiate-background-verification-dialog.component';
import { OnboardingAcknowledgeBvrDialogComponent } from './onboarding-acknowledge-bvr-dialog/onboarding-acknowledge-bvr-dialog.component';
import { OnboardingExtendDateOfJoiningDialogComponent } from './onboarding-extend-date-of-joining-dialog/onboarding-extend-date-of-joining-dialog.component';
import { OnboardingUpdateBgvReportDialogComponent } from './onboarding-update-bgv-report-dialog/onboarding-update-bgv-report-dialog.component';
import { OnboardingNtidDeactivateDialogComponent } from './onboarding-ntid-deactivate-dialog/onboarding-ntid-deactivate-dialog.component';
import { ObDeletePopupComponent } from './ob-delete-popup/ob-delete-popup.component';
import { ImportNTIDComponent } from './import-ntid/import-ntid.component';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ImportedNTIDComponent } from './imported-ntid/imported-ntid.component';
import { SortCMPagePipe } from './sortCMPage.pipe';
import { OnboardingRequestCreationBgsvComponent } from './onboarding-request-creation-bgsv/onboarding-request-creation-bgsv.component';
import {OnboardingDetailsBgsComponent} from './onboarding-details-bgs/onboarding-details-bgs.component';
@NgModule({
  declarations: [
    ResourcetabsComponent,
    InitiateDeBoardingDialogComponent,
    DebordingTableComponent,
    DebordingMoreActionDialogComponent,
    DeBoardingRequestDetailsComponent,
    StylePaginatorDirective,
    DeBoardingEclDialogComponent,
    DndDirective,
    ProgressComponent,
    ChangeRequestDetailsComponent,
    ChangeRequestTableComponent,
    ResourceMasterTableComponent,
    ChangeDetailsActionDialogComponent,
    ChangeRequestDetailsViewActionComponent,
    ResourcePlanComponent,
    OnboardingPageComponent,
    InformPartnerDialogComponent,
    AccessoriesCollectedDialogComponent,
    DeviceCollectedDialogComponent,
    EmployeeCardCollectedDialogComponent,
    NtidDeactivatedDialogComponent,
    ExtendLastWorkingDayDialogComponent,
    RetainResourceDialogComponent,
    ResourceLoaderUiComponent,
    ResourceMasterViewTableAgComponent,
    DebordingViewTableAgComponent,
    ChangeRequestViewTableAgComponent,
    OnboardingRequestCreationDetailsComponent,
    SubmitOnboardingRequestDialogComponent,
    OnboardingRequestInformationDetailsComponent,
    OnboardApproveDialogComponent,
    OnboardRejectDialogComponent,
    OnboardSentBackDialogComponent,
    OnboardDelegateDialogComponent,
    OnboardUpdateNtidDialogComponent,
    OnboardCheckinDialogComponent,
    OnboardShareNtidDialogComponent,
    OnboardIssueidCardDialogComponent,
    OnboardingInitiateBackgroundVerificationDialogComponent,
    OnboardingAcknowledgeBvrDialogComponent,
    OnboardingExtendDateOfJoiningDialogComponent,
    OnboardingUpdateBgvReportDialogComponent,
    OnboardingNtidDeactivateDialogComponent,
    ObDeletePopupComponent,
    ImportNTIDComponent,
    ImportedNTIDComponent,
    SortCMPagePipe,
    OnboardingRequestCreationBgsvComponent,
    OnboardingDetailsBgsComponent

  ],
  imports: [
    CommonModule,
    MaterialModule,
    ResourceRoutingModule,
    AgGridModule,
    MatSelectFilterModule 
  ],
  providers:[ApiResourceService]
})
export class ResourceModule { }
