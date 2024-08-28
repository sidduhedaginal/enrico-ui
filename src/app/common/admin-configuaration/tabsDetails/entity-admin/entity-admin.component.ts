import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AdminconfigService } from '../../../adminconfig.service';
import { GridApi } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import { AddUpdateEntityAdminComponent } from '../popup/add-update-entity-admin/add-update-entity-admin.component';

@Component({
  selector: 'app-entity-admin',
  templateUrl: './entity-admin.component.html',
  styleUrls: ['./entity-admin.component.css'],
})
export class EntityAdminComponent implements OnInit {
  ngOnInit(): void {}

  private gridApi!: GridApi;

  constructor(
    private adminConfigService: AdminconfigService,
    private dialog: MatDialog,
    public loaderService: LoaderService
  ) {}

  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
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

  rowData = [];
  columnDefs: ColDef[] = [
    { headerName: 'User NTID', field: 'entityAdminUser' },
    {
      headerName: 'Entity Admin Status',
      field: 'entityAdminStatus',
      cellRenderer: this.statusRenderer,
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: this.actionRenderer,
    },
  ];

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getEntityAdmin();
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon"></span>   <span class="delete icon" title="delete"></span> <div>`;
  }

  statusRenderer(params: any) {
    if (params.value == true) {
      return `<div class="icon-class">   <span class="approve"></span>  <div>`;
    }
    return '';
  }

  getEntityAdmin() {
    this.loaderService.setShowLoading();
    this.adminConfigService.getEntityAdmin().subscribe({
      next: (response: any) => {
        this.rowData = response.data;
        this.gridApi.setRowData(this.rowData);
        this.resetFilters();
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

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.updateEntityAdmin(params.data);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.deleteEntityAdmin(params.data.id);
    }
  }

  addEntityAdmin() {
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateEntityAdminComponent> =
      this.dialog.open(AddUpdateEntityAdminComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getEntityAdmin();
        }
      }
    );
  }

  updateEntityAdmin(_data: any) {
    const dataToBePassed = {
      operation: 'update',
      data: _data,
    };

    const dialogRef: MatDialogRef<AddUpdateEntityAdminComponent> =
      this.dialog.open(AddUpdateEntityAdminComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getEntityAdmin();
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

  deleteEntityAdmin(_id: string) {
    const dataToBePassed = {
      operation: 'delete',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateEntityAdminComponent> =
      this.dialog.open(AddUpdateEntityAdminComponent, {
        data: dataToBePassed,
        width: '30%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getEntityAdmin();
        }
      }
    );
  }
}
