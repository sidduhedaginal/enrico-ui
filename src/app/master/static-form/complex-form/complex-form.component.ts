import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ColDef } from 'ag-grid-community';
import { ApiCallService } from '../../services/api-call.service';
import { MatDialog } from '@angular/material/dialog';
import { DynamicModalComponent } from '../../dynamic-modal/dynamic-modal.component';
import { GridApi } from 'ag-grid-community';
import { ConfirmationpopupComponent } from '../confirmationpopup/confirmationpopup.component';
import { LoaderService } from '../../../../app/services/loader.service';
import { keyList } from '../../constants/app-constant';

@Component({
  selector: 'lib-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.css'],
})
export class ComplexFormComponent implements OnInit {
  public windowsHeight = window.innerHeight;
  public style: any = {
    width: '100%',
    height: this.windowsHeight - 200 + 'px',
    'min-height': this.windowsHeight - 200 + 'px',
    flex: '1 1 auto',
    'margin-top': '5px',
  };

  isAddClicked: boolean = false;
  vendorId!: string;
  columnNames!: string[];
  columnDefs: ColDef[] = [];
  contactDetails!: any[];
  rowData: any[] = [];
  showLoading: boolean = false;
  gridApi!: GridApi;
  gridOptions!: any;
  routerState: any;
  rowValues = [];
  showErroMessage = false;
  errorMessage = '';
  Contactindex: number;

  EscaltionIds: { [key: string]: string } = {
    '770f3da2-4aa9-409b-b0c9-44b8ab2e99eb': 'Level 1',
    '481d98b8-f59b-4aad-bbab-dc19a47a4a7c': 'Level 2',
    'deade643-00da-4c85-87ed-63c7ae002c7d': 'Level 3',
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private apiService: ApiCallService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) {
    this.gridOptions = {
      columnDefs: [],
      rowData: [],
      rowSelection: 'multiple',
      pagination: true,
      paginationPageSize: 20,
      domLayout: 'autoHeight',
    };

    this.routerState = this.router.getCurrentNavigation()?.extras.state;
    this.rowValues = this.routerState?.['payload']?.VendorContactDetails;
    this.rowValues = this.capitalizeKeys(this.rowValues);
  }

  capitalizeKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(this.capitalizeKeys);
    }

    const result: Record<string, any> = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
        (result as any)[capitalizedKey] = obj[key];
      }
    }

    return result;
  }

  ngOnInit(): void {}

  onAddContact() {
    if (true) {
      this.openFormModal(
        'Vendor Contact Details',
        32,
        null,
        'static',
        {
          VendorId: this.vendorId,
        },
        this.rowData
      );

      return;
    }

    this.showSnackbar('Please add vendor detail first.');
    this.isAddClicked = false;
  }

  onVendorSubmitted(vendorId: any) {
    this.vendorId = vendorId;
  }

  onContactSubmitted(isContactFormSubmitted: any) {
    this.isAddClicked = false;
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    const columnApi = params.columnApi;
    columnApi.autoSizeAllColumns();
    this.fetchContactDetails();
    if (this.rowData.length == 0) this.rowData = this.rowValues;

    if (this.rowData == undefined) {
      this.rowData = [];
    }
    this.gridApi.setRowData(this.rowData);
  }

  generateGUID(): string {
    const s4 = () =>
      Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);

    return `${s4()}${s4()}`;
  }

  openFormModal(
    selectedMaster: string,
    menuId: number,
    uiJson: any,
    component = 'dynamic',
    payload: any = {},
    existingContacts: any,
    operation = 'create',
    viewMode = false
  ) {
    const dialogRef = this.dialog.open(DynamicModalComponent, {
      width: '70%',
      disableClose: true,
      data: {
        selectedMaster,
        menuId,
        uiJson,
        component,
        payload,
        operation,
        viewMode,
        existingContacts,
      },
    });

    dialogRef.afterClosed().subscribe((returnedData: any) => {
      if (returnedData) {
        if (returnedData.ContactTypeId == '2') {
          returnedData.ContactType = 'contact';
        } else {
          returnedData.ContactType = 'escalation';
        }
        delete returnedData.vendorContactDetails;
        if (operation == 'update') {
          this.EditListObject(this.rowData, returnedData);
        } else {
          delete returnedData.Id;
          if (returnedData.EscalateLevel) {
            if (
              returnedData.EscalateLevel.toLowerCase() ==
              'deade643-00da-4c85-87ed-63c7ae002c7d'
            ) {
              returnedData.Escalate = 'Level 3';
            } else if (
              returnedData.EscalateLevel.toLowerCase() ==
              '481d98b8-f59b-4aad-bbab-dc19a47a4a7c'
            ) {
              returnedData.Escalate = 'Level 2';
            } else if (
              returnedData.EscalateLevel.toLowerCase() ==
              '770f3da2-4aa9-409b-b0c9-44b8ab2e99eb'
            ) {
              returnedData.Escalate = 'Level 1';
            } else {
              returnedData.Escalate = '';
            }
          } else {
            returnedData.Escalate = '';
          }
          returnedData.SrNo = Number(this.generateGUID());
          this.rowData.push(returnedData);
        }
        this.gridApi.setRowData(this.rowData);
      }
    });
  }
  EditListObject(list: any[], obj: any) {
    for (const eachobj of list) {
      const INDEX = list.indexOf(eachobj);
      if (INDEX == this.Contactindex) {
        // Update the keys in the object with values from obj1
        for (const key in obj) {
          eachobj[key] = obj[key];
        }
        // We break out of the loop assuming there's only one match
        break;
      }
    }
  }

  updateListObjects(list: any[], obj: any): void {
    const keyToMatch: string = 'SrNo';
    // Iterate through each object in the list
    for (const eachobj of list) {
      // Check if the key exists and matches in both objects
      if (
        keyToMatch in eachobj &&
        keyToMatch in obj &&
        eachobj[keyToMatch] == obj[keyToMatch]
      ) {
        // Update the keys in the object with values from obj1
        for (const key in obj) {
          eachobj[key] = obj[key];
        }
        // We break out of the loop assuming there's only one match
        break;
      }
    }
  }

  fetchContactDetails() {
    this.loaderService.setShowLoading();
    this.rowData = [];
    this.apiService.get(`api/master-data?menuId=32`).subscribe(
      (response: any) => {
        this.columnDefs = [];
        if (response.data.columnNames.length > 0) {
          this.columnNames = response.data.columnNames;
        }
        this.columnNames = keyList;

        for (let i = 0; i < this.columnNames.length; i++) {
          if (this.columnNames[i] == 'EscalateLevel')
            this.columnDefs.push({
              field: this.columnNames[i],
              resizable: true,
              cellRenderer: this.updateEscalateLevelRenderer,
            });
          else
            this.columnDefs.push({
              field: this.columnNames[i],
              resizable: true,
            });
        }
        this.columnDefs.push({
          headerName: 'Action',
          cellRenderer: 'actionCellRenderer',
          cellRendererParams: {
            onEditClick: this.onEditClick.bind(this),
            onDeleteClick: this.onDeleteClick.bind(this),
          },
          pinned: 'right',
        });

        this.columnDefs = this.columnDefs.flat();
        for (let i = 0; i < this.contactDetails.length; i++) {
          let rowObject: any = {};
          for (let index = 0; index < this.columnNames.length; index++) {
            if (
              this.contactDetails[i].hasOwnProperty(this.columnNames[index])
            ) {
              rowObject[this.columnNames[index]] =
                this.contactDetails[i][this.columnNames[index]];
            }
          }
        }
        this.loaderService.setDisableLoading();
      },
      (error: any) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  onEditClick(data: any) {
    if (data.ContactTypeId != null) {
      data.ContactTypeId = data.ContactTypeId.toString();
    } else {
      data.ContactTypeId = '1';
    }
    this.Contactindex = this.rowData.indexOf(data);
    data['VendorId'] = this.vendorId;
    this.openFormModal(
      'Vendor Contact Details',
      32,
      null,
      'static',
      data,
      this.rowData,
      'update'
    );
  }

  updateEscalateLevelRenderer(params: any) {
    // Custom rendering logic here using the 'params.value' (cell value)
    return `<span>${params.data?.Escalate}</span>`;
  }
  openConfirmationPopup(payload: any, status: any) {}

  onDeleteClick(data: any) {
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      width: '50%',
      data: {},
      panelClass: 'scrollable-dialog',
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == true) {
        if (data.id) {
          let selectedRowIds = [];
          selectedRowIds.push(data.Id);
          this.loaderService.setShowLoading();
          this.apiService
            .delete(`api/master-data?menuId=32`, {
              ids: selectedRowIds,
            })
            .subscribe(
              (response) => {
                this.loaderService.setDisableLoading();
                if (response.status === 'Record(s) deleted successfully.') {
                  const index = this.rowData.indexOf(data);
                  if (index > -1) {
                    this.rowData.splice(index, 1);
                  }
                  this.gridApi.setRowData(this.rowData);
                  return this.showSnackbar(response.status);
                }
              },
              (error) => {
                this.loaderService.setDisableLoading();
              }
            );
        } else {
          const index = this.rowData.indexOf(data);
          if (index > -1) {
            this.rowData.splice(index, 1);
          }
          this.gridApi.setRowData(this.rowData);
        }
      }
    });
  }

  frameworkComponents = {
    actionCellRenderer: ActionCellRendererComponent,
  };
}

@Component({
  selector: 'lib-action-cell-renderer',
  template: `
    <span class="action-icons">
      <span class="edit icon action" (click)="onEditClick()"></span>
      <span class="delete icon action" (click)="onDeleteClick()"></span>
    </span>
  `,
  styles: [
    `
      .action-icons {
        display: flex;
      }
      .action {
        cursor: pointer;
        margin-right: 5px;
      }
      .edit-icon {
        color: green;
      }
      .delete-icon {
        color: red;
      }
    `,
  ],
})
export class ActionCellRendererComponent {
  params: any;
  agInit(params: any) {
    this.params = params;
  }

  onEditClick() {
    this.params.onEditClick(this.params.data);
  }
  onDeleteClick() {
    this.params.onDeleteClick(this.params.data);
  }
}
