import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CommonApiServiceService } from '../../../common-api-service.service';
import { GridApi } from 'ag-grid-community';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddUpdateEmailComponent } from '../popups/add-update-email/add-update-email.component';

@Component({
  selector: 'app-email-settings',
  templateUrl: './email-settings.component.html',
  styleUrls: ['./email-settings.component.css'],
})
export class EmailSettingsComponent implements OnInit {
  pageSize: number = 10;
  pageIndex: number = 0;
  totalCount: number = 0;
  sortDirection: number = 1;

  ngOnInit(): void {
    this.pageIndex = 0;
    this.getEmailSettings(this.sortDirection, this.pageIndex, this.pageSize);
  }

  private gridApi!: GridApi;
  private columnApi: any;
  constructor(
    private commonApiService: CommonApiServiceService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private snackBar: MatSnackBar
  ) {}
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    // suppressHorizontalScroll: false,
    // suppressVerticalScroll: false
  };

  // public defaultColDef: ColDef = {
  //   sortable: true,
  //   filter: 'agSetColumnFilter',
  //   resizable: true,
  //   flex: 1,
  //   minWidth: 175,
  //   enableValue: false,
  //   enableRowGroup: false,
  //   enablePivot: false,
  //   menuTabs: ['filterMenuTab'],
  // };

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
    wrapText: true, // <-- HERE
    autoHeight: true, // <-- & HERE
    cellStyle: { 'text-align': 'left' },
  };

  columnDefs: any = [
    { headerName: 'Subject', field: 'subject', minWidth: 220, resizable: true },
    { headerName: 'To', field: 'to', resizable: true },
    { headerName: 'CC', field: 'cc', resizable: true },
    { headerName: 'Content', field: 'content', resizable: true },
    { headerName: 'Created By', field: 'createdBy', resizable: true },
    {
      headerName: 'Created On',
      field: 'createdOn',
      resizable: true,
      hide: true,
    },
    { headerName: 'Modified By', field: 'modifiedBy', resizable: true },
    {
      headerName: 'Modified On',
      field: 'modifiedOn',
      resizable: true,
      hide: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      editable: false,
      colId: 'action',
      pinned: 'right',
      width: 50,
      suppressMenu: true,
      cellRenderer: this.renderActionIcons.bind(this),
    },
  ];

  rowData = [];

  renderActionIcons() {
    // return `<div class="icon-class">   <span class="edit icon" title="edit"></span> <span class="delete icon" title="delete"></span></div>`;
    return `<div class="icon-class">   <span class="edit icon" title="edit"></span> </div>`;
  }

  resetFilters() {
    if (this.gridApi) {
      // Clear filter model to reset filters
      this.gridApi.setFilterModel(null);
    }
  }

  getEmailSettings(sortDirection, pageIndex, pageSize) {
    if (pageIndex == 0) this.loaderService.setShowLoading();
    this.commonApiService
      .getEmailSettings(sortDirection, pageIndex, pageSize)
      .subscribe({
        next: (response: any) => {
          if (response.records != undefined) {
            if (pageIndex == 0) this.rowData = response.records;
            else this.rowData = this.rowData.concat(response.records);
          }
          this.totalCount = response?.totalItems;
          this.gridApi.setRowData(this.rowData);
          this.resetFilters();
        },
        error: (e: any) => {
          if (pageIndex == 0) this.loaderService.setDisableLoading();
          console.log(e);
          // this.showSnackbar(e);
        },
        complete: () => {
          if (pageIndex == 0) this.loaderService.setDisableLoading();
        },
      });
  }

  onPaginationChanged(event: any) {
    if (
      this.totalCount != undefined &&
      this.totalCount < (this.pageIndex - 1) * this.pageSize
    ) {
    } else {
      this.pageIndex++;
      this.getEmailSettings(this.sortDirection, this.pageIndex, this.pageSize);
    }
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.openUpdateEmailSettings(params.data);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.delete(params.data);
    }
  }

  openUpdateEmailSettings(data: any) {
    const dataToBePassed = {
      operation: 'update',
      payload: data,
    };

    const dialogRef: MatDialogRef<AddUpdateEmailComponent> = this.dialog.open(
      AddUpdateEmailComponent,
      {
        data: dataToBePassed,
        width: '70%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.pageIndex = 0;
          this.getEmailSettings(
            this.sortDirection,
            this.pageIndex,
            this.pageSize
          );
        }
      }
    );
  }

  addEmail() {
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateEmailComponent> = this.dialog.open(
      AddUpdateEmailComponent,
      {
        data: dataToBePassed,
        width: '70%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.pageIndex = 0;
          this.getEmailSettings(
            this.sortDirection,
            this.pageIndex,
            this.pageSize
          );
        }
      }
    );
  }
  delete(data: any) {
    const dataToBePassed = {
      operation: 'delete',
      payload: data,
    };

    const dialogRef: MatDialogRef<AddUpdateEmailComponent> = this.dialog.open(
      AddUpdateEmailComponent,
      {
        data: dataToBePassed,
        width: '30%',
      }
    );

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.pageIndex = 0;
          this.getEmailSettings(
            this.sortDirection,
            this.pageIndex,
            this.pageSize
          );
        }
      }
    );
  }
}
