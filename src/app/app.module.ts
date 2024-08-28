import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { AuthModule, AuthService } from '@micro-app/auth';
import { environment } from 'src/environments/environment';
import { AgGridModule } from 'ag-grid-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './home/home.module';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { HeaderComponent } from './header/header.component';
import { ClickOutsideDirective } from './clickOutside.directive';
import { NotificationComponent } from './notification/notification.component';
import { HomeService } from './services/home.service';
import { SowjdDhService } from './services/sowjd-dh.service';
import { PlanningModule } from './planning/planning.module';
import { SowjdDmModule } from './dm/sowjd-dm.module';
import { MastercardModule } from './master/mastercard.module';
import { VendorSowjdModule } from './vendor/vendor-sowjd.module';
import { SuccessComponent } from './popup/success/success.component';
import { HttpErrorInterceptor } from './httperrorinterceptor.service';
import { MatsnakbarComponent } from './matsnakbar/matsnakbar.component';
import { SowjdDocumentsComponent } from './popup/sowjd-documents/sowjd-documents.component';
import { DelegationComponent } from './popup/delegation/delegation.component';
import { MaterialModule } from './material/material.module';
import { SearchBarModule } from './common/search-bar-group/search-bar.module';
import { LoaderModule } from './loader/loader.module';
import { ErrorComponent } from './popup/error/error.component';
import { AddVendorModule } from './popup/add-vendor/add-vendor.module';
import { DateFormatComponent } from './common/date-format/date-format.component';
import { MyActionComponent } from './common/my-action/my-action.component';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { popupMessageComponent } from './popup/popup-message/popup-message.component';
import { CoreModule } from '@micro-app/core';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { MatButtonModule } from '@angular/material/button';
import { InputComponent } from './vendor/vendor-srn/create-srn/input/input.component';
import { Common } from './common/common.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SowjdDetailModule } from './dm/sowjdmodule/sowjd-details/sowjd-detail.module';
import { ResourceModule } from './resource/resource.module';
import { GlobalLoaderComponent } from './shared/global-loader/global-loader.component';
import { TpSubmitRemarksComponent } from './vendor/vendor-signoff/tp-submit-remarks/tp-submit-remarks.component';
import { ApproveSrnComponent } from './dm/sowjd-srn/approve-srn/approve-srn.component';
import { SendbackSrnComponent } from './dm/sowjd-srn/sendback-srn/sendback-srn.component';
import { WithdrawSrnComponent } from './dm/sowjd-srn/withdraw-srn/withdraw-srn.component';
import { DelegateSrnComponent } from './dm/sowjd-srn/delegate-srn/delegate-srn.component';
import { DelegateSearchBarModule } from './common/delegate-search-bar/search-bar-delegate.module';
import { CostcenterSearchBarModule } from './common/search-bar-costcenter/search-bar.module';
import { SowjdSignoffListComponent } from './dm/sowjdmodule/sowjd-details/sowjd-signoff-list/sowjd-signoff-list.component';
import { SowjdSrnListComponent } from './dm/sowjdmodule/sowjd-details/sowjd-srn-list/sowjd-srn-list.component';
import { SearchBarWBSModule } from './common/search-bar-wbs/search-bar-wbs.module';
import { DeleteComponent } from './vendor/delete/delete.component';
import localeIn from '@angular/common/locales/en-IN';
import { registerLocaleData } from '@angular/common';
import { CurrencyModule } from './common/currency-pipe/currency.module';

export function authFactory(authService: AuthService) {
  return () =>
    new Promise<any>((resolve, reject) => {
      authService.initKeyloak({
        clientId: 'enrico-digital-web-local',
        clientScope:
          'openid profile email employeeNo group companycode ntid roles',
        tokenTime: 30,
        baseUrl: document.getElementsByTagName('base')[0].href,
        authorityUrl:
          'https://p3.authz.bosch.com/auth/realms/bgsw-enrico-digital-project',
        loadUserInfo: false,
      });
      authService.authorize(resolve, reject);
    });
}

registerLocaleData(localeIn);

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    ClickOutsideDirective,
    NotificationComponent,
    SuccessComponent,
    ErrorComponent,
    SowjdDocumentsComponent,
    DelegationComponent,
    DateFormatComponent,
    MyActionComponent,
    popupMessageComponent,
    InputComponent,
    GlobalLoaderComponent,
    TpSubmitRemarksComponent,
    ApproveSrnComponent,
    SendbackSrnComponent,
    WithdrawSrnComponent,
    DelegateSrnComponent,
    SowjdSignoffListComponent,
    SowjdSrnListComponent,
    DeleteComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    SearchBarModule,
    SearchBarWBSModule,
    AddVendorModule,
    MaterialModule,
    AuthModule,
    AgGridModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HomeModule,
    BreadcrumbModule,
    MatCardModule,
    MatInputModule,
    PlanningModule,
    SowjdDmModule,
    MastercardModule,
    VendorSowjdModule,
    LoaderModule,
    CoreModule,
    MatCardModule,
    MatButtonModule,
    Common,
    MatTabsModule,
    SowjdDetailModule,
    ResourceModule,
    DelegateSearchBarModule,
    CostcenterSearchBarModule,
    CurrencyModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authFactory,
      deps: [AuthService],
      multi: true,
    },
    { provide: 'MASTER_API_URL', useValue: environment.apiConfig },
    { provide: 'Vendor_URL', useValue: environment.vendor_API },
    BreadcrumbService,
    HomeService,
    SowjdDhService,
    MatsnakbarComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
