import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CommonApiServiceService } from '../../../common-api-service.service';
import { GridApi } from 'ag-grid-community';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { AddUpdatePermissionsOnBusinessRolesComponent } from '../popups/add-update-permissions-on-business-roles/add-update-permissions-on-business-roles.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-permissions-on-business-roles',
  templateUrl: './permissions-on-business-roles.component.html',
  styleUrls: ['./permissions-on-business-roles.component.css'],
})
export class PermissionsOnBusinessRolesComponent implements OnInit {
  ngOnInit(): void {
    this.pageIndex = 0;
    this.getPermissionsOnBusinessRoles(this.pageIndex, this.pageSize);
  }

  permissionOnbusinessRolesData: any;
  entityId: string;
  pageSize: number = 10;
  pageIndex: 0;
  totalCount: 0;
  rolesMapping: Record<string, number> = {
    CreatePermission: 0,
    ReadPermission: 1,
    EditPermission: 2,
    DeletePermission: 3,
    ApprovePermission: 4,
    RejectPermission: 5,
    DelegatePermission: 6,
    WithdrawPermission: 7,
    ImportPermission: 8,
    ExportPermission: 9,
    SendBackPermission: 10,
    OwnershipChangePermission: 11,
  };

  userProfileDetails: userProfileDetails | string = {
    firstName: null,
    lastName: null,
    displayName: '',
    department: '',
    group: '',
    company: {
      companyCode: '',
      companyFullName: '',
      companyShortName: '',
      companyAddressStreet: '',
      companyAddressPostalCode: '',
      companyAddressCity: '',
      companyRegionName: '',
      companyCountryName: '',
    },
    employeeNumber: 0,
    roles: [],
    roleDetail: [],
    entityId: '',
  };

  private gridApi!: GridApi;
  private columnApi: any;
  constructor(
    private commonApiService: CommonApiServiceService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private snackBar: MatSnackBar
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

  columnDefs: any = [
    {
      headerName: 'Business Role',
      field: 'roleName',
      minWidth: 220,
      resizable: true,
    },
    { headerName: 'Feature Name', field: 'featureName', resizable: true },
    {
      headerName: 'Create',
      field: 'CreatePermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Read',
      field: 'ReadPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Edit',
      field: 'EditPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Delete',
      field: 'DeletePermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Approve',
      field: 'ApprovePermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Reject',
      field: 'RejectPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Delegate',
      field: 'DelegatePermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Withdraw',
      field: 'WithdrawPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Import',
      field: 'ImportPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'Export',
      field: 'ExportPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'SendBack',
      field: 'SendBackPermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      headerName: 'OwnershipChange',
      field: 'OwnershipChangePermission',
      cellRenderer: this.permissionRenderer,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      editable: false,
      colId: 'action',
      pinned: 'right',
      minWidth: 150,
      suppressMenu: true,
      cellRenderer: this.renderActionIcons.bind(this),
    },
  ];

  rowData = [];

  permissionRenderer(params: any) {
    const permissionName = params.colDef.field;
    const premissionList = params.data.permissions;
    for (const permission of premissionList) {
      if (permission['permissionName'] === permissionName) {
        return `<div class="icon-class">   <span class="approve"></span>  <div>`;
      }
    }
    return '';
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon"></span>  <div>`;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  getPermissionsOnBusinessRoles(pageIndex: number, pageSize: number) {
    if (pageIndex == 0) this.loaderService.setShowLoading();
    this.userProfileDetails = StorageQuery.getUserProfile();

    if (
      typeof this.userProfileDetails === 'object' &&
      this.userProfileDetails !== null
    ) {
      this.entityId = this.userProfileDetails?.entityId;
      this.commonApiService
        .getPermissionsOnBusinessRoles(this.entityId, pageIndex, pageSize)
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
            this.showSnackbar(e);
          },
          complete: () => {
            if (pageIndex == 0) this.loaderService.setDisableLoading();
          },
        });
    } else {
      // Handle the case where userProfile is a empty string
    }
  }

  renderActionIcons() {
    return `<div class="icon-class">   <span class="edit icon" title="edit"></span> <span class="delete icon" title="delete"></span></div>`;
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.openUpdatePermissionsOnBusinessRoles(params.data);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.delete(params.data);
    }
  }

  openUpdatePermissionsOnBusinessRoles(data: any) {
    const dataToBePassed = {
      operation: 'update',
      payload: data,
      entityId: this.entityId,
    };

    const dialogRef: MatDialogRef<AddUpdatePermissionsOnBusinessRolesComponent> =
      this.dialog.open(AddUpdatePermissionsOnBusinessRolesComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.pageIndex = 0;
          this.getPermissionsOnBusinessRoles(this.pageIndex, this.pageSize);
        }
      }
    );
  }

  openAddPermissionsOnBusinessRoles() {
    const dataToBePassed = {
      operation: 'create',
      entityId: this.entityId,
    };

    const dialogRef: MatDialogRef<AddUpdatePermissionsOnBusinessRolesComponent> =
      this.dialog.open(AddUpdatePermissionsOnBusinessRolesComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.pageIndex = 0;
          this.getPermissionsOnBusinessRoles(this.pageIndex, this.pageSize);
        }
      }
    );
  }

  delete(data: any) {
    const dataToBePassed = {
      operation: 'delete',
      payload: data,
      entityId: this.entityId,
    };

    const dialogRef: MatDialogRef<AddUpdatePermissionsOnBusinessRolesComponent> =
      this.dialog.open(AddUpdatePermissionsOnBusinessRolesComponent, {
        data: dataToBePassed,
        width: '30%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.pageIndex = 0;
          this.getPermissionsOnBusinessRoles(this.pageIndex, this.pageSize);
        }
      }
    );
  }

  onPaginationChanged(event: any) {
    if (
      this.totalCount != undefined &&
      this.totalCount < (this.pageIndex - 1) * this.pageSize
    ) {
    } else {
      this.pageIndex++;
      this.getPermissionsOnBusinessRoles(this.pageIndex, this.pageSize);
    }
  }

  export() {
    if (this.gridApi) {
      const params = {
        fileName: 'PermissionsOnBusinessRole.xlsx', // Customize the file name
        sheetName: 'Sheet1', // Customize the sheet name
      };

      this.gridApi.forEachNode((node) => {
        const eachRow = node.data;
        for (const permission in this.rolesMapping) {
          eachRow[permission] = 'No';
        }
        for (const permissionObject of eachRow.permissions) {
          eachRow[permissionObject.permissionName] = 'Yes';
        }
        this.gridApi.applyTransaction({ update: [eachRow] });
      });

      this.columnApi.setColumnVisible('action', false);
      this.gridApi.exportDataAsExcel(params);
      this.columnApi.setColumnVisible('action', true);
    }
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  resetFilters() {
    if (this.gridApi) {
      // Clear filter model to reset filters
      this.gridApi.setFilterModel(null);
    }
  }
}
