import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CommonApiServiceService } from '../../../common-api-service.service';
import { GridApi } from 'ag-grid-community';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddUpdateBusinessRolesComponent } from '../popups/add-update-business-roles/add-update-business-roles.component';
import { GridOptions } from 'ag-grid-community';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from '../../../../services/loader.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-business-roles',
  templateUrl: './business-roles.component.html',
  styleUrls: ['./business-roles.component.css'],
})
export class BusinessRolesComponent implements OnInit {
  businessRolesData: any;
  entityIdToObjectMap: Map<string, any> = new Map<string, any>();
  entitiesValues: any;

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

  entityId: string = '';

  private gridApi!: GridApi;
  constructor(
    private commonApiService: CommonApiServiceService,
    private dialog: MatDialog,
    public loaderService: LoaderService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    // suppressHorizontalScroll: false,
    // suppressVerticalScroll: false
  };

  getBusinessRoles() {
    // this.showLoading = true;
    this.loaderService.setShowLoading();
    this.userProfileDetails = StorageQuery.getUserProfile();

    if (
      typeof this.userProfileDetails === 'object' &&
      this.userProfileDetails !== null
    ) {
      this.entityId = this.userProfileDetails?.entityId;
    }
    this.commonApiService.getBusinessRole().subscribe({
      next: (response: any) => {
        this.businessRolesData = response.data;
        this.getEntity();
      },
      error: (e: any) => {
        // this.showLoading = false;
        this.loaderService.setDisableLoading();
        console.log(e);
      },
      complete: () => {
        // this.showLoading = false;
        this.loaderService.setDisableLoading();
      },
    });
  }

  updateTheGridValues() {
    this.entitiesValues.forEach((item: any) => {
      this.entityIdToObjectMap.set(item.id, item);
    });

    this.businessRolesData.forEach((item: any) => {
      item.entityName =
        this.entityIdToObjectMap.get(item?.entityId)?.entityName || 'Unknown';
    });

    this.gridApi.setRowData(this.businessRolesData);
    this.resetFilters();
  }

  getEntity() {
    this.loaderService.setShowLoading();
    this.commonApiService.getEntities().subscribe({
      next: (response: any) => {
        console.log(response);
        this.entitiesValues = response.data;
        this.updateTheGridValues();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
        this.showSnackbar(e);
        console.log(e);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }
  resetFilters() {
    if (this.gridApi) {
      // Clear filter model to reset filters
      this.gridApi.setFilterModel(null);
    }
  }

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
    { headerName: 'Entity Name', field: 'entityName' },
    { headerName: 'RoleName', field: 'entityBusinessRoleName' },
    {
      headerName: 'Status',
      field: 'entityBusinessRoleStatus',
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
    if (params.value == true) {
      return `<div class="icon-class">   <span class="approve"></span>  <div>`;
    }
    return '';
  }

  actionRenderer(params: any) {
    return `<div class="icon-class">   <span class="edit icon"></span>   <span class="delete icon" title="delete"></span> <div>`;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.getBusinessRoles();
  }

  openAddBusinessRoles() {
    const dataToBePassed = {
      operation: 'create',
    };

    const dialogRef: MatDialogRef<AddUpdateBusinessRolesComponent> =
      this.dialog.open(AddUpdateBusinessRolesComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getBusinessRoles();
        }
      }
    );
  }
  openUpdateBusinessRoles(_id: string) {
    const dataToBePassed = {
      operation: 'update',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateBusinessRolesComponent> =
      this.dialog.open(AddUpdateBusinessRolesComponent, {
        data: dataToBePassed,
        width: '70%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getBusinessRoles();
        }
      }
    );
  }

  deleteBusinessRole(_id: string) {
    const dataToBePassed = {
      operation: 'delete',
      id: _id,
    };

    const dialogRef: MatDialogRef<AddUpdateBusinessRolesComponent> =
      this.dialog.open(AddUpdateBusinessRolesComponent, {
        data: dataToBePassed,
        width: '30%',
      });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.getBusinessRoles();
        }
      }
    );
  }

  onCellClicked(params: any) {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'edit icon'
    ) {
      this.openUpdateBusinessRoles(params.data.id);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'delete icon'
    ) {
      this.deleteBusinessRole(params.data.id);
    }
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
}
