import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AdminconfigService } from '../../../adminconfig.service';
import { GridApi } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import { AddUpdateModuleComponent } from '../popup/add-update-module/add-update-module.component';

@Component({
  selector: 'app-modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.css'],
})
export class ModulesComponent implements OnInit {
  ngOnInit(): void {}

  rowData = [];
  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'moduleName' },
    { headerName: 'Url', field: 'urlPath', cellRenderer: this.urlRenderer },
    // { headerName: 'Icon', field: 'moduleIcon' },
    { headerName: 'Description', field: 'moduleDescription' },
    { headerName: 'Belongs To Vendor', field: 'isBelongToVendor' },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: this.actionRenderer,
    },
  ];
  private gridApi!: GridApi;

  constructor(
    private adminConfigService: AdminconfigService,
    private dialog: MatDialog,
    public loaderService: LoaderService
  ) {}

  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    // suppressHorizontalScroll: false,
    // suppressVerticalScroll: false
  };

  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getModules();
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon"></span>   <span class="delete icon" title="delete"></span> <div>`;
  }

  urlRenderer(params: any) {
    if (params.value != null) {
      const currentURL = window.location.href;
      const lastIndex = currentURL.lastIndexOf('/');
      const resultantUrl =
        currentURL.substring(0, lastIndex + 1) + params.value;
      return `<a style="text-decoration: none;" href=${resultantUrl}>${params.value}</a>`;
    } else return '';
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.updateModule(params.data.id);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.deleteModule(params.data.id);
    }
  }

  getModules() {
    this.loaderService.setShowLoading();
    this.adminConfigService.getModules().subscribe({
      next: (response: any) => {
        this.rowData = response.data;
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  addModule() {
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateModuleComponent> = this.dialog.open(
      AddUpdateModuleComponent,
      {
        data: dataToBePassed,
        width: '70%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getModules();
        }
      }
    );
  }

  resetFilters() {
    if (this.gridApi) {
      // Clear filter model to reset filters
      this.gridApi.setFilterModel(null);
    }
  }

  updateModule(_id: string) {
    const dataToBePassed = {
      operation: 'update',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateModuleComponent> = this.dialog.open(
      AddUpdateModuleComponent,
      {
        data: dataToBePassed,
        width: '70%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getModules();
        }
      }
    );
  }
  deleteModule(_id: string) {
    const dataToBePassed = {
      operation: 'delete',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateModuleComponent> = this.dialog.open(
      AddUpdateModuleComponent,
      {
        data: dataToBePassed,
        width: '30%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getModules();
        }
      }
    );
  }
}
