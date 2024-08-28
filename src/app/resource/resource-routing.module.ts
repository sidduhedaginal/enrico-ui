import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangeRequestDetailsViewActionComponent } from './change-request-details-view-action/change-request-details-view-action.component';
import { ResourcePlanComponent } from './resource-plan/resource-plan/resource-plan.component';
import { OnboardingPageComponent } from './onboarding-page/onboarding-page/onboarding-page.component';
import { ChangeRequestDetailsComponent } from './change-request-details/change-request-details.component';
import { DeBoardingRequestDetailsComponent } from './de-boarding-request-details/de-boarding-request-details.component';
import { ResourcetabsComponent } from './resourcetabs/resourcetabs.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { OnboardingRequestCreationDetailsComponent } from './onboarding-request-creation-details/onboarding-request-creation-details.component';
import { OnboardingRequestInformationDetailsComponent } from './onboarding-request-information-details/onboarding-request-information-details.component';
import { ImportedNTIDComponent } from './imported-ntid/imported-ntid.component';
import { OnboardingRequestCreationBgsvComponent } from './onboarding-request-creation-bgsv/onboarding-request-creation-bgsv.component';
import {OnboardingDetailsBgsComponent} from './onboarding-details-bgs/onboarding-details-bgs.component';
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
const routes: Routes = [
  {path:'',component:ResourcetabsComponent},
  {
    path:'Resource-Management',
    data: { breadcrumb: 'Resource Management' },
    children:
    [
      
      {
        path: 'De-boarding Request Details',
        component: DeBoardingRequestDetailsComponent,
      },
      {
        path: 'Initiate Change Request',
        component: ChangeRequestDetailsComponent,
      },
      {
            path: 'Change Request Details',
            component: ChangeRequestDetailsViewActionComponent,
      },
      {
            path: 'Resource Plan',
            component: ResourcePlanComponent,
      },
      {
            path: 'Onboarding Details',
            component: OnboardingPageComponent,
      }, 
      {
        path: 'Onboarding Details',
        children:[
          {
            path:'importedNTIDfile',
            component:ImportedNTIDComponent,
            data:{breadcrumb:"Imported File"},
            
          },
        ]
      },      
      {
            path: 'Onboarding Form',
            component: OnboardingRequestCreationDetailsComponent,
      },
      {
            path: 'Onboarding Request Details',
            component: OnboardingRequestInformationDetailsComponent,
      },
      {
        path:'importedNTIDfile',
        component:ImportedNTIDComponent,
        
      },
    ]
  },
  {
    path:'Onboarding',
    data: { breadcrumb: 'Onboarding' },
    children:
    [
      {
        path: 'Onboarding Form',
        component: OnboardingRequestCreationDetailsComponent,
      },
      {
        path: 'Onboarding Request Details',
        component: OnboardingRequestInformationDetailsComponent,
      },
      {
        path:'Onboarding Form BGSV',
        data: { breadcrumb: 'Onboarding Form' },
        component:OnboardingRequestCreationBgsvComponent
      },
      {
        path: 'Onboarding Request Details BGS',
        data: { breadcrumb: 'Onboarding Request Details' },
        component: OnboardingDetailsBgsComponent,
       
        
      }
    ]
  },
  {
    path:'my-actions',
    data:{breadcrumb:'My Actions'},
    children:[
      {
        path: 'Onboarding Request Details',
        component: OnboardingRequestInformationDetailsComponent,
      },
      {
        path: 'De-boarding Request Details',
        component: DeBoardingRequestDetailsComponent,
      },
      {
        path: 'Change Request Details',
        component: ChangeRequestDetailsViewActionComponent,
  },
  {
    path: 'Onboarding Request Details BGS',
    data: { breadcrumb: 'Onboarding Request Details' },
    component: OnboardingDetailsBgsComponent,
   
    
  }
    ]
  },
]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers:[{ provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }]
})
export class ResourceRoutingModule { }
