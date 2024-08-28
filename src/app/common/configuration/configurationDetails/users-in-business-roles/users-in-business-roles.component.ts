import { Component, OnInit, HostListener } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CommonApiServiceService } from '../../../common-api-service.service';
import { GridApi } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddUpdateRolesUsersComponent } from '../popups/add-update-roles-users/add-update-roles-users.component';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { GridOptions } from 'ag-grid-community';
import { LoaderService } from '../../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-users-in-business-roles',
  templateUrl: './users-in-business-roles.component.html',
  styleUrls: ['./users-in-business-roles.component.css'],
})
export class UsersInBusinessRolesComponent implements OnInit {
  ngOnInit(): void {
    this.getUsersInBusinessRoles(
      this.sortDirection,
      this.pageIndex,
      this.pageSize
    );
  }

  usersInBusinessRolesData: any;
  entityId: string;
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
  sortDirection: number = 1;
  pageIndex: number = 0;
  pageSize: number = 5000;
  totalCount: number;

  initialPageIndex: number = 1;
  initialPageSize: number = 5000;

  private gridApi!: GridApi;
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
  columnDefs: ColDef[] = [
    { headerName: 'Business Role', field: 'roleName' },
    { headerName: 'User', field: 'ntid' },
    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: this.statusRenderer,
    },
    {
      headerName: 'Action',
      field: 'action',
      cellRenderer: this.actionRenderer,
    },
  ];

  rowData = [];
  statusRenderer(params: any) {
    if (params.value == true)
      return `<div class="icon-class">   <span class="approve"></span>  <div>`;
    return '';
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon" title="edit"></span> <span class="delete icon" title="delete"></span></div>`;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getUsersInBusinessRoles(
      this.sortDirection,
      this.pageIndex,
      this.pageSize
    );
  }

  getUsersInBusinessRoles(
    sortDirection: number,
    pageIndex: number,
    pageSize: number
  ) {
    if (pageIndex == 0) this.loaderService.setShowLoading();
    this.userProfileDetails = StorageQuery.getUserProfile();

    if (
      typeof this.userProfileDetails === 'object' &&
      this.userProfileDetails !== null
    ) {
      // this.entityId = this.userProfileDetails.roleDetail[0].entityId;
      this.entityId = this.userProfileDetails?.entityId;
    }

    this.commonApiService
      .getUsersInBusinessRoles(
        this.entityId,
        sortDirection,
        pageIndex,
        pageSize
      )
      .subscribe({
        next: (response: any) => {
          this.totalCount = response.totalItems;
          if (pageIndex == 0) this.rowData = response.records;
          else this.rowData = this.rowData.concat(response.records);
          // this.rowData = response.records;
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
  }

  openAddRoles() {
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateRolesUsersComponent> =
      this.dialog.open(AddUpdateRolesUsersComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.initialPageIndex = 0;
          this.pageIndex = 0;
          this.getUsersInBusinessRoles(
            this.sortDirection,
            this.initialPageIndex,
            this.initialPageSize
          );
        }
      }
    );
  }

  updateRoles(data: any) {
    const dataToBePassed = {
      operation: 'update',
      payload: data,
    };

    const dialogRef: MatDialogRef<AddUpdateRolesUsersComponent> =
      this.dialog.open(AddUpdateRolesUsersComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.initialPageIndex = 0;
          this.pageIndex = 0;
          this.getUsersInBusinessRoles(
            this.sortDirection,
            this.initialPageIndex,
            this.initialPageSize
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

    const dialogRef: MatDialogRef<AddUpdateRolesUsersComponent> =
      this.dialog.open(AddUpdateRolesUsersComponent, {
        data: dataToBePassed,
        width: '50%',
        // height: '30%'
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.initialPageIndex = 0;
          this.pageIndex = 0;
          this.getUsersInBusinessRoles(
            this.sortDirection,
            this.initialPageIndex,
            this.initialPageSize
          );
        }
      }
    );
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.updateRoles(params.data);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.delete(params.data);
    }
  }

  onPaginationChanged(event: any) {
    if (
      this.totalCount != undefined &&
      this.totalCount < (this.pageIndex - 1) * this.pageSize
    ) {
    } else {
      this.pageIndex++;
      this.getUsersInBusinessRoles(
        this.sortDirection,
        this.pageIndex,
        this.pageSize
      );
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
