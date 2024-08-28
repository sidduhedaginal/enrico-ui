import { Component, HostListener, OnInit } from '@angular/core';
import {
  ColDef,
  DomLayoutType,
  GridApi,
  GridReadyEvent,
  ValueGetterParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddNewRatecardComponent } from '../add-new-ratecard/add-new-ratecard.component';
import { VendorDetailsService } from '../services/vendor-details.service';
import { RateCardMasterService } from '../services/rate-card-master.service';
import { EditDeleteActionsComponent } from '../shared/edit-delete-actions/edit-delete-actions.component';
import { SuccessComponent } from '../success/success.component';
import { DeleteComponent } from '../delete/delete.component';
import { DatefilterComponent } from '../shared/datefilter/datefilter.component';
import { ExcelService } from '../services/excel.service';
import { HomeService } from 'src/app/services/home.service';
import { config } from 'src/app/config';
import { VendorService } from '../services/vendor.service';

@Component({
  selector: 'lib-my-rate-card-list',
  templateUrl: './my-rate-card-list.component.html',
  styleUrls: ['./my-rate-card-list.component.scss'],
})
export class MyRateCardListComponent implements OnInit {
  public domLayout: DomLayoutType = 'autoHeight';
  public dialogConfig: any;
  location_list: any[] = [];
  locationvalue = '';
  companyCode = '';
  currencyCode = '';
  isfilterPopup: boolean = false;
  isColumnSettingPopup: boolean = false;
  filteredRowData: any = [];
  selectedColumnNumber: number = 0;
  selectedFilterNumber: number = 0;
  disabled: boolean = true;
  vendorId: string;
  rateCard_list: any[] = [];
  dropdownVisible: boolean = false;
  loader: boolean;

  constructor(
    private dialog: MatDialog,
    private vendorDetailsService: VendorDetailsService,
    private rateCardMasterService: RateCardMasterService,
    private excelService: ExcelService,
    private homeService: HomeService,
    private vendorService: VendorService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
    this.vendorId = this.vendorService.vendorId;
  }

  ngOnInit(): void {
    this.vendorDetailsService
      .getVendorDropdownValues()
      .subscribe((response: any) => {
        if (response.data != null) {
          this.location_list = response.data.masterLocationMode;
        }
        this.selectedColumnNumber = this.columnDefs.filter(
          (x: any) => x.hide == false
        ).length;
      });
    this.rateCardMasterService
      .getCompanyVendorID(this.vendorId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.companyCode = response.data[0].companyCode;
          this.currencyCode = response.data[0].currencyName;
        }
      });
    this.getRateCardlist();
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.autoFocus = true;
    this.dialogConfig.disableClose = true;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.backdropClass = 'bdrop';
  }
  getRateCardlist() {
    this.rateCardMasterService
      .getRateCardListByVendorID(this.vendorId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.rateCard_list = response.data;
          this.gridApi_rateCardMaster.setRowData(this.rateCard_list);
        }
      });
  }

  hashValueGetter(params: ValueGetterParams) {
    return params.node ? params.node.rowIndex : null;
  }
  public rowSelection: 'single' | 'multiple' = 'multiple';
  public columnDefs = [
    {
      headerName: 'Select',
      maxWidth: 100,
      suppressMenu: true,
      editable: false,
      checkboxSelection: true,
    },
    {
      headerName: 'Company Code',
      field: 'companyCode',
      hide: false,
      minWidth: 200,
      editable: false,
    },
    {
      headerName: 'Currency',
      field: 'currencyName',
      hide: false,
      minWidth: 150,
    },
    {
      headerName: 'Location Mode',
      field: 'locationName',
      hide: false,
      minWidth: 200,
    },
    {
      headerName: 'Vendor Name',
      field: 'vendorName',
      hide: false,
      minWidth: 200,
      editable: true,
    },
    {
      headerName: 'Vendor SAP ID',
      field: 'vendorSAPID',
      hide: false,
      minWidth: 200,
      editable: false,
    },
    {
      headerName: 'Skillset Name',
      field: 'skillSetName',
      hide: false,
      sortable: true,
      minWidth: 200,
    },
    {
      headerName: 'Grade 0',
      field: 'grade0',
      hide: false,
      sortable: true,
      minWidth: 100,
    },
    {
      headerName: 'Grade 1',
      field: 'grade1',
      hide: false,
      sortable: true,
      minWidth: 100,
    },
    {
      headerName: 'Grade 2',
      field: 'grade2',
      hide: false,
      sortable: true,
      minWidth: 100,
    },
    {
      headerName: 'Grade 3',
      field: 'grade3',
      hide: false,
      sortable: true,
      minWidth: 100,
    },
    {
      headerName: 'Grade 4',
      field: 'grade4',
      hide: false,
      sortable: true,
      minWidth: 100,
    },
    {
      headerName: 'Status',
      field: 'approvalStatusName',
      hide: false,
      minWidth: 100,
      editable: false,
    },
    {
      headerName: 'Remarks',
      field: 'remark',
      hide: false,
      minWidth: 200,
      editable: false,
    },
    {
      headerName: 'Created Date',
      field: 'createdOn',
      hide: false,
      minWidth: 150,
      editable: false,
      cellRenderer: DatefilterComponent,
    },
    {
      headerName: 'Created By',
      field: 'createdBy',
      hide: false,
      minWidth: 150,
      editable: false,
    },
    {
      headerName: 'Modified Date',
      field: 'modifiedOn',
      hide: false,
      minWidth: 150,
      editable: false,
      cellRenderer: DatefilterComponent,
    },
    {
      headerName: 'Modified By',
      field: 'modifiedBy',
      hide: false,
      minWidth: 150,
      editable: false,
    },
    {
      headerName: 'Approved By',
      field: 'approvedBy',
      hide: true,
      minWidth: 150,
      editable: false,
    },
    {
      headerName: 'Approved Date',
      field: 'approvedDate',
      hide: true,
      minWidth: 150,
      editable: false,
      cellRenderer: DatefilterComponent,
    },
    {
      headerName: 'Action',
      field: '',
      hide: false,
      cellRenderer: EditDeleteActionsComponent,
      minWidth: 150,
      suppressMenu: true,
      cellRendererParams: {
        edit: (params: any) => {
          let dialogRef = this.dialog.open(
            AddNewRatecardComponent,
            this.dialogConfig
          );
          let data = { isCreate: false, rateCard: params.data };
          let instance = dialogRef.componentInstance;
          instance.rateCardDetails = data;
          dialogRef.afterClosed().subscribe((res) => {
            if (res.data != null) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = res.data;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.getRateCardlist();
            }
          });
        },
        delete: (params: any) => {
          let dialogRef = this.dialog.open(DeleteComponent, {
            width: '30vw',
            data: { type: 'delete' },
          });
          dialogRef.afterClosed().subscribe((res) => {
            if (res?.data != null && res?.data == 'yes') {
              let input = { id: params.data.id };
              this.rateCardMasterService
                .deleteRateCard(input)
                .subscribe((response: any) => {
                  if (response.data[0].isSuccess) {
                    let dialogRef = this.dialog.open(
                      SuccessComponent,
                      this.dialogConfig
                    );
                    let message = response.data[0].message;
                    let instance = dialogRef.componentInstance;
                    instance.message = message;
                    this.getRateCardlist();
                  }
                });
            }
          });
        },
      },
    },
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    sortable: true,
    resizable: false,
    filter: true,
    menuTabs: ['filterMenuTab'],
  };

  private gridApi_rateCardMaster!: GridApi;

  onGridReadyRateCardMaster(params: GridReadyEvent) {
    this.gridApi_rateCardMaster = params.api;
    this.gridApi_rateCardMaster.setDomLayout('autoHeight');
  }

  AddRateCard() {
    let dialogRef = this.dialog.open(
      AddNewRatecardComponent,
      this.dialogConfig
    );
    let data = { isCreate: true };
    let instance = dialogRef.componentInstance;
    instance.rateCardDetails = data;
    dialogRef.afterClosed().subscribe((res) => {
      if (res != null) {
        this.getRateCardlist();
      }
    });
  }

  toggle(col: any) {
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].headerName == col) {
        if (this.columnDefs[x].hide === false) {
          this.columnDefs[x].hide = true;
        } else {
          this.columnDefs[x].hide = false;
        }
      }
    }
    this.gridApi_rateCardMaster.setColumnDefs(this.columnDefs);
    this.selectedColumnNumber = this.columnDefs.filter(
      (x: any) => x.hide == false
    ).length;
  }

  resetAllColumnsInConfig() {
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) this.columnDefs[x].hide = false;
    }
    this.gridApi_rateCardMaster.setColumnDefs(this.columnDefs);
  }

  location_mode_search() {
    this.filteredRowData = this.rateCard_list.filter(
      (row: { locationId: string }) => row.locationId == this.locationvalue
    );
    console.log(this.filteredRowData);
    this.gridApi_rateCardMaster.setRowData(this.filteredRowData);
  }
  export() {
    let export_Data: any[] = [];
    this.rateCard_list.forEach((rateCard) => {
      export_Data.push({
        'Company Code': rateCard.companyCode,
        Currency: rateCard.currencyName,
        'Location Mode': rateCard.locationName,
        'Vendor Name': rateCard.vendorName,
        'Vendor SAP ID': rateCard.vendorSAPID,
        'Skillset Name': rateCard.skillSetName,
        'Grade 0': rateCard.grade0,
        'Grade 1': rateCard.grade1,
        'Grade 2': rateCard.grade2,
        'Grade 3': rateCard.grade3,
        'Grade 4': rateCard.grade4,
        Status: rateCard.approvalStatusName,
        Remarks: rateCard.remark,
        'Created Date': rateCard.createdOn,
        'Created By': rateCard.createdBy,
        'Modified Date': rateCard.modifiedOn,
        'Modified By': rateCard.modifiedBy,
        'Approved Date': rateCard.approvedDate,
        'Approved By': rateCard.approvedBy,
      });
    });
    this.excelService.exportToExcel(export_Data, 'RateCardMasterList');
  }
  deleteMultipleRrecords() {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        var values = this.gridApi_rateCardMaster.getSelectedRows();
        var ids = [];
        for (var i = 0; i < values.length; i++) {
          ids.push(values[i].id);
        }
        var input = { id: ids.toString() };
        this.rateCardMasterService
          .deleteMultipleRateCard(input)
          .subscribe((response: any) => {
            if (response.data[0].isSuccess) {
              let dialogRef = this.dialog.open(
                SuccessComponent,
                this.dialogConfig
              );
              let message = response.data[0].message;
              let instance = dialogRef.componentInstance;
              instance.message = message;
              this.getRateCardlist();
            }
          });
      }
    });
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
    console.log(this.dropdownVisible);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(
        event.target instanceof HTMLElement &&
        event.target.closest('.menu-items')
      )
    ) {
      this.dropdownVisible = false;
    }
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
