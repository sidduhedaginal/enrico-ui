import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUpdateBusinessRolesComponent } from './configuration/configurationDetails/popups/add-update-business-roles/add-update-business-roles.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatRadioModule } from '@angular/material/radio';
import { MaterialModule } from '../material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { AddUpdateRolesUsersComponent } from './configuration/configurationDetails/popups/add-update-roles-users/add-update-roles-users.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatTabsModule } from '@angular/material/tabs';
import { AddUpdatePermissionsOnBusinessRolesComponent } from './configuration/configurationDetails/popups/add-update-permissions-on-business-roles/add-update-permissions-on-business-roles.component';
import { AdminConfiguarationComponent } from './admin-configuaration/admin-configuaration.component';
import { ModulesComponent } from './admin-configuaration/tabsDetails/modules/modules.component';
import { AddUpdateModuleComponent } from './admin-configuaration/tabsDetails/popup/add-update-module/add-update-module.component';
import { FeatureComponent } from './admin-configuaration/tabsDetails/feature/feature.component';
import { AddUpdateFeatureComponent } from './admin-configuaration/tabsDetails/popup/add-update-feature/add-update-feature.component';
import { EntityComponent } from './admin-configuaration/tabsDetails/entity/entity.component';
import { AddUpdateEntityComponent } from './admin-configuaration/tabsDetails/popup/add-update-entity/add-update-entity.component';
import { EntityAdminComponent } from './admin-configuaration/tabsDetails/entity-admin/entity-admin.component';
import { AddUpdateEntityAdminComponent } from './admin-configuaration/tabsDetails/popup/add-update-entity-admin/add-update-entity-admin.component';
import { EmailSettingsComponent } from './configuration/configurationDetails/email-settings/email-settings.component';
import { ConfigurationComponent } from './configuration/configuration.component';
import { BusinessRolesComponent } from './configuration/configurationDetails/business-roles/business-roles.component';
import { UsersInBusinessRolesComponent } from './configuration/configurationDetails/users-in-business-roles/users-in-business-roles.component';
import { PermissionsOnBusinessRolesComponent } from './configuration/configurationDetails/permissions-on-business-roles/permissions-on-business-roles.component';
import { VendorsComponent } from './configuration/configurationDetails/vendors/vendors.component';
import { AddUpdateEmailComponent } from './configuration/configurationDetails/popups/add-update-email/add-update-email.component';
import { NumbersOnlyDirective } from './allow-numbers';

@NgModule({
  declarations: [
    AddUpdateBusinessRolesComponent,
    AddUpdateRolesUsersComponent,
    SpinnerComponent,
    AddUpdatePermissionsOnBusinessRolesComponent,
    AdminConfiguarationComponent,
    ModulesComponent,
    AddUpdateModuleComponent,
    FeatureComponent,
    AddUpdateFeatureComponent,
    EntityComponent,
    AddUpdateEntityComponent,
    EntityAdminComponent,
    AddUpdateEntityAdminComponent,
    EmailSettingsComponent,
    ConfigurationComponent,
    BusinessRolesComponent,
    UsersInBusinessRolesComponent,
    PermissionsOnBusinessRolesComponent,
    VendorsComponent,
    AddUpdateEmailComponent,
    NumbersOnlyDirective,
  ],
  imports: [CommonModule, MaterialModule, AgGridModule, MatTabsModule],
})
export class Common {}
