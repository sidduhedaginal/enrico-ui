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
import { ODCChildList } from '../../constants/app-constant';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-odc-master',
  templateUrl: './odc-master.component.html',
  styleUrls: ['./odc-master.component.css'],
  providers:[DatePipe]
})
export class OdcMasterComponent implements OnInit {
  public windowsHeight = window.innerHeight;
  public style: any = {
    width: '100%',
    height: this.windowsHeight - 200 + 'px',
    'min-height': this.windowsHeight - 200 + 'px',
    flex: '1 1 auto',
    'margin-top': '5px',
  };
  isAddClicked: boolean = false;
  oDcId!: string;
  columnNames!: string[];
  columnDefs: ColDef[] = [];
  oDCDetails!: any[];
  rowData: any[] = [];
  showLoading: boolean = false;
  gridApi!: GridApi;
  gridOptions!: any;
  routerState: any;
  rowValues = [];
  showErroMessage = false;
  errorMessage = '';
  Contactindex: number;
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 195,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private apiService: ApiCallService,
    private dialog: MatDialog,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
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
    this.rowValues = this.routerState?.['payload']?.OdcHeadCountModel;            
    if(this.routerState?.['payload']?.OdcHeadCountModel){
      for(let item of this.rowValues){
        item.validityStart = this.datePipe.transform(item.validityStart , 'dd-MMM-yyyy');
        item.validityEnd = this.datePipe.transform(item.validityEnd , 'dd-MMM-yyyy');
      }  
    }
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
    var state = '';
    if (true) {
      this.openFormModal(
        'ODC Details',
        54,
        null,
        'ODCchild',
        {
          oDcId: this.oDcId,
        },
        this.rowData,
        'create',
        null,
        state
        
      );

      return;
    }
  }

  onVendorSubmitted(oDcId: any) {
    this.oDcId = oDcId;
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
    existingodcchild: any,
    operation = 'create',
    viewMode = false,
    state:string
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
        existingodcchild,
        state
      },
    });

    dialogRef.afterClosed().subscribe((returnedData: any) => {
      console.log(returnedData);
      returnedData.validityEnd = this.datePipe.transform(returnedData.validityEnd , 'dd-MMM-yyyy');
      
      returnedData.validityStart = this.datePipe.transform(returnedData.validityStart , 'dd-MMM-yyyy');

      if (returnedData) {
        delete returnedData.vendorContactDetails;
        if (operation == 'update') {
          this.EditListObject(this.rowData, returnedData);
        } else {
          delete returnedData.Id;
          if(this.rowData.length != 0){
            this.rowData.unshift(returnedData);
          }else{
            this.rowData.push(returnedData);
          }
          
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
    this.apiService.get(`api/master-data?menuId=54`).subscribe(
      (response: any) => {
        
        this.columnDefs = [];
        if (response.data.columnNames.length > 0) {
          this.columnNames = response.data.columnNames;
        }
        this.columnNames = ODCChildList;        
        for (let i = 0; i < this.columnNames.length; i++) {
            this.columnDefs.push({
              field: this.columnNames[i],
              resizable: true,
            });
        }
          this.columnDefs.push({
              headerName: 'Action',
              colId: 'action',
              cellRenderer: this.renderActionIconsForMaster.bind(this),
              pinned: 'right',
          });
        this.loaderService.setDisableLoading();
      },
      (error: any) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  renderActionIconsForMaster(params: any){    
      const index = this.rowData.indexOf(params.data);
      if(index == 0){
      return '<div class="icon-class">  <span class="blue-edit_planning" title="Edit" (click)="onEditClick()">&nbsp;</span>&nbsp;&nbsp; <span class="deleteblueskillset" title="Delete" (click)="onDeleteClick()">&nbsp;</span>&nbsp;&nbsp; </div>';
      }      
      else{
        return '<div class="icon-class"> <span class="deleteblueskillset" title="Delete" (click)="onDeleteClick()">&nbsp;</span>&nbsp;&nbsp; </div>';
      }
  }
  onCellClicked_OdcChild( params:any): void {
  if(params.column.colId === "action" && params.event.target.className == "blue-edit_planning"){
      this.onEditClick(params.data,"editenddate");
  }
 else if(params.column.colId === "action" && params.event.target.className == "deleteblueskillset"){
    this.onDeleteClick(params.data);
}

  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  onEditClick(data: any,state:string) {
    this.Contactindex = this.rowData.indexOf(data);
    this.oDcId =  data['id']
    this.openFormModal(
      'ODC Details',
      54,
      null,
      'ODCchild',
      data,
      this.rowData,
      'update',
      null,
      state
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
          selectedRowIds.push(data.id);
          this.loaderService.setShowLoading();
          this.apiService
            .delete(`api/master-data?menuId=541`, {
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
