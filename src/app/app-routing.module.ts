import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SowjdDmComponent } from './dm/sowjd-dm.component';
import { MastercardComponent } from './master/mastercard.component';
import { SkillmasterComponent } from './master/skillmaster/skillmaster.component';
import { PlanningtabsComponent } from './planning/planningtabs/planningtabs.component';
import { AuthGuard, UnauthorizedComponent } from '@micro-app/auth';
import { MyActionComponent } from './my-action/my-action.component';
import { ResourcetabsComponent } from './resource/resourcetabs/resourcetabs.component';
import { ConfigurationComponent } from './common/configuration/configuration.component';
import { GuardConfigGuard } from './guard-config.guard';
import { AdminConfiguarationComponent } from './common/admin-configuaration/admin-configuaration.component';
import { AdministratorGuard } from './administrator.guard';
import { VendorAccessGuard } from './vendor-access.guard';
import { EnricoBoschUsersGuard } from './enrico-bosch-users.guard';
import { DifferentUserGuard } from './different-user.guard';
import { VendorLandingPageComponent } from './home/vendor/vendor-landing-page/vendor-landing-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/bgsw',
    pathMatch: 'full',
  },
  {
    path: 'bgsw',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    data: { breadcrumb: { skip: true } },
    // canActivate: [AuthGuard],
    canActivate: [DifferentUserGuard],
  },
  {
    path: 'bgsw-vendor',
    component: VendorLandingPageComponent,
    data: { breadcrumb: { skip: true } },
    canActivate: [VendorAccessGuard],
  },
  {
    path: 'sowjd',
    loadChildren: () =>
      import('./dm/sowjd-dm.module').then((m) => m.SowjdDmModule),
    data: { breadcrumb: { skip: true } },
    canActivate: [EnricoBoschUsersGuard],
  },
  {
    path: 'vendor',
    loadChildren: () =>
      import('./vendor/vendor-sowjd.module').then((m) => m.VendorSowjdModule),
    data: { breadcrumb: 'VENDOR' },
    canActivate: [VendorAccessGuard],
  },
  {
    path: 'dashboard',
    component: MastercardComponent,
    data: { breadcrumb: 'Master Data' },
    canActivate: [EnricoBoschUsersGuard],
  },
  {
    path: 'masterdata',
    component: MastercardComponent,
    data: { breadcrumb: 'Master Data' },
    canActivate: [EnricoBoschUsersGuard],
  },
  {
    path: 'Import',
    component: SkillmasterComponent,
    canActivate: [EnricoBoschUsersGuard],
  },
  {
    path: 'unauth',
    component: UnauthorizedComponent,
  },
  {
    path: 'planning',
    component: PlanningtabsComponent,
    // loadChildren: () =>
    //   import('./planning/planning.module').then((m) => m.PlanningModule),
    // data: { breadcrumb: { skip: true } },
    canActivate: [EnricoBoschUsersGuard],
    data: { breadcrumb: 'Planning' },
  },
  {
    path: 'my-actions',
    component: MyActionComponent,
    canActivate: [EnricoBoschUsersGuard],
    data: { breadcrumb: 'My Actions' },
  },
  {
    path: 'dm',
    component: SowjdDmComponent,
    canActivate: [EnricoBoschUsersGuard],
  },
  {
    path: 'Resource-Management',
    data: { breadcrumb: 'Resource Management' },
    component: ResourcetabsComponent,
  },
  {
    path: 'Onboarding',
    data: { breadcrumb: 'Resource Management' },
    component: ResourcetabsComponent,
  },
  {
    path: 'Configurations',
    component: ConfigurationComponent,
    canActivate: [GuardConfigGuard],
  },
  {
    path: 'adminConfigurations',
    component: AdminConfiguarationComponent,
    canActivate: [AdministratorGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
