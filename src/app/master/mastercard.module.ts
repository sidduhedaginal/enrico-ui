import { NgModule } from '@angular/core';
import { MastercardComponent } from './mastercard.component';
import { MasterfeatureRoutingModule } from './masterfeature/masterfeature-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MasterfeatureModule } from './masterfeature/masterfeature.module';
import { MastergridComponent } from './mastergrid/mastergrid.component';
import { AgGridModule } from 'ag-grid-angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { ModuleRegistry } from '@ag-grid-community/core';
import { SideBarModule } from '@ag-grid-enterprise/side-bar';
import { MaterialModule } from './material/material.module';
import { MasterdetailsComponent } from './masterdetails/masterdetails.component';
import { SkillmasterComponent } from './skillmaster/skillmaster.component';
import { importfile } from './mastergrid/importfile';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { DeleteDialogComponent } from './popup/delete-dialog/delete-dialog.component';
import { CancelDialogComponent } from './popup/cancel-dialog/cancel-dialog.component';
import { ApproveDialogComponent } from './popup/approve-dialog/approve-dialog.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicModalComponent } from './dynamic-modal/dynamic-modal.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { VendorMasterComponent } from './static-form/vendor-master/vendor-master.component';
import { ComplexFormComponent } from './static-form/complex-form/complex-form.component';
import { ImportErrorComponent } from './popup/import-error/import-error.component';
import { ConfirmationpopupComponent } from './static-form/confirmationpopup/confirmationpopup.component';
import { ImportsummaryComponent } from './importsummary/importsummary.component';
import { MasterDataGridComponent } from './master-components/master-data-grid/master-data-grid.component';
import { MasterFormChooserComponent } from './master-components/master-form-chooser/master-form-chooser.component';
import { MasterDynamicFormComponent } from './master-components/master-dynamic-form/master-dynamic-form.component';
import { MasterStaticFormComponent } from './master-components/master-static-form/master-static-form.component';
import { VendorMasterFormComponent } from './master-components/vendor-master-form/vendor-master-form.component';
import { MasterDataImportComponent } from './master-components/master-data-import/master-data-import.component';
import { GridHeaderSelectComponent } from './grid-header-select/grid-header-select.component';
import { OdcMasterComponent } from './static-form/odc-master/odc-master.component';
import { OdcAddchildformComponent } from './static-form/odc-addchildform/odc-addchildform.component';

const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

// const MY_DATE_FORMATS = {
//   parse: {
//     dateInput: 'YYYY-MM-DD',
//   },
//   display: {
//     dateInput: 'YYYY',
//     monthYearLabel: 'YYYY',
//     dateA11yLabel: 'YYYY-MM-DD',
//     monthYearA11yLabel: 'YYYY',
//   },
// };

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  RowGroupingModule,
  MenuModule,
  SetFilterModule,
  ColumnsToolPanelModule,
  SideBarModule,
]);

@NgModule({
  declarations: [
    MastercardComponent,
    MastergridComponent,
    MasterdetailsComponent,
    SkillmasterComponent,
    importfile,
    DeleteDialogComponent,
    CancelDialogComponent,
    ApproveDialogComponent,
    DynamicFormComponent,
    DynamicModalComponent,
    VendorMasterComponent,
    ComplexFormComponent,
    ImportErrorComponent,
    ConfirmationpopupComponent,
    ImportsummaryComponent,
    MasterDataGridComponent,
    MasterFormChooserComponent,
    MasterDynamicFormComponent,
    MasterStaticFormComponent,
    VendorMasterFormComponent,
    MasterDataImportComponent,
    GridHeaderSelectComponent,
    OdcMasterComponent,
    OdcAddchildformComponent
  ],
  imports: [
    MasterfeatureRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    MasterfeatureModule,
    AgGridModule,
    MaterialModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatInputModule,
    MatDatepickerModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  exports: [MastercardComponent],
  providers: [

    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS,useValue: MY_DATE_FORMATS },
    // { provide: MAT_DATE_FORMATS, useValue: { display: { dateInput: 'DD-MM-YYYY' } } },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
  
  ],
})
export class MastercardModule {}