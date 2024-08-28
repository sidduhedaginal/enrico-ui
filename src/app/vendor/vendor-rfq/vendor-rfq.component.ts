import { Component, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  GridApi,
  ColDef,
  GridReadyEvent,
  GridOptions,
} from 'ag-grid-community';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { DashboardService } from '../services/dashboard.service';
import { config } from 'src/app/config';
import { VendorRfqHyperlinkComponent } from '../vendor-details/vendor-rfq-hyperlink/vendor-rfq-hyperlink.component';
import { VendorService } from '../services/vendor.service';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { privateDecrypt } from 'crypto';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
@Component({
  selector: 'app-vendor-rfq',
  templateUrl: './vendor-rfq.component.html',
  styleUrls: ['./vendor-rfq.component.scss'],
  providers: [DatePipe],
})
export class VendorRfqComponent {
  dropdownVisible = false;
  id: any;
  selectedMySubColumnNumber = 0;
  selectedColumns: any;
  activeColumns: any;
  savedColumns: any;
  filterValue: string;
  url: string;
  vendorRFQList: any;
  vendorId: string;
  paginationPageSize: number = 5;
  ExportDate: any;
  exportFileName: string = 'RFQ';
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  autoGroupColumnDef: ColDef = { minWidth: 0 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 0,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any; //Auto-Width Fix

  excelStyles = [
    {
      id: 'rfqStartDateFormat',
      dataType: 'dateTime',
      numberFormat: { format: 'dd-MMM-yyyy' },
    },
    {
      id: 'rfqEndDateFormat',
      dataType: 'dateTime',
      numberFormat: { format: 'dd-MMM-yyyy' },
    },
  ];
  // fliter chips
  finalKeyArray: any = [];
  columnFilters: any;
  removedColumnFilters: any;
  PlanningChipsKey: any;
  filterModel: any;
  filterToString: any;
  filterToParse: any;
  filterChipsSets: any = [];
  ColumnMoveddefs = [];
  columnSequence: any;
  dateFormat = config.dateFormat;
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  constructor(
    private router: Router,
    private columnSettingsService: ColumnSettingsService,
    private dashboardService: DashboardService,
    private vendorService: VendorService,
    private notifyservice: NotifyService,
    private datePipe: DatePipe,
    private loaderService: LoaderService,
    private planningService: PlaningService,
    private snackBar: MatSnackBar,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {
    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate, this.dateFormat);

    this.router.events.subscribe((value) => {
      this.url = this.router.url.toString();

      this.vendorId = this.vendorService.vendorId;
    });
  }

  public columnDefs = [
    {
      headerName: 'RFQ ID',
      hide: false,
      dontShow: true,
      field: 'sowJdRfqNumber',
      cellRenderer: VendorRfqHyperlinkComponent,
    },
    {
      headerName: 'SoW JD ID',
      hide: false,
      field: 'sowJdNumber',
      minWidth: 300,
    },
    {
      headerName: 'SoW JD Description',
      hide: false,
      field: 'description',
    },
    {
      headerName: 'SoW JD Type',
      hide: false,
      field: 'sowJdType',
    },
    {
      headerName: 'Company',
      hide: false,
      field: 'companyCode',
    },
    {
      headerName: 'Currency',
      hide: false,
      field: 'currencyName',
    },
    {
      headerName: 'Location Mode',
      hide: false,
      field: 'locationMode',
    },
    {
      headerName: 'Outsourcing Type',
      hide: false,
      field: 'outSourcingType',
    },
    {
      headerName: 'Location',
      hide: false,
      field: 'plantName',
    },
    {
      headerName: 'RFQ Start Date',
      hide: false,
      field: 'startDate',
      cellRenderer: DateFormatComponent,
      cellClass: 'rfqStartDateFormat',
    },
    {
      headerName: 'RFQ End Date',
      hide: false,
      field: 'endDate',
      cellRenderer: DateFormatComponent,
      cellClass: 'rfqEndDateFormat',
    },
    {
      headerName: 'Delivery Manager',
      hide: false,
      field: 'deliveryManager',
    },
    {
      headerName: 'Section SPOC',
      hide: false,
      field: 'secSpoc',
    },
    {
      headerName: 'RFQ Status',
      hide: false,
      field: 'sowJdRfqStatus',
    },
    {
      headerName: 'Vendor Name',
      hide: false,
      field: 'vendorName',
    },
    {
      headerName: 'Vendor SAP ID',
      hide: false,
      field: 'vendorSAPID',
    },
    {
      headerName: 'Vendor Email',
      hide: false,
      field: 'email',
    },
    {
      headerName: 'Equivalent Capacity',
      hide: false,
      field: 'equivalent_Capacity',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.equivalent_Capacity,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Equivalent PMO',
      hide: false,
      field: 'equivalentPMO',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.equivalentPMO,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Total Cost Vendor',
      hide: false,
      field: 'totalCost_VRP',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalCost_VRP,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Hours',
      hide: false,
      field: 'total_Hours_WP',
    },
    {
      headerName: 'Total Cost',
      hide: false,
      field: 'totalCost_WP',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalCost_WP,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Overall Score',
      hide: false,
      field: 'score',
    },
  ];

  ngOnInit(): void {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getVendorRFQColumn();
  }

  onBtnExport() {
    var params = {
      fileName: `${
        this.exportFileName + '_Export' + '_' + this.ExportDate
      }.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  }

  getRFQVendorList() {
    this.loaderService.setShowLoading();
    this.dashboardService
      .getVendorRFQTechEvaluation(this.vendorId)
      .subscribe((res: any) => {
        if (res.data.length > 0 || res.data !== null) {
          this.vendorRFQList = res.data;
          this.vendorRFQList.forEach((sowjdDetail: any) => {
            this.companyCurrencyName = sowjdDetail?.currencyName;
            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;
          });
          this.loaderService.setDisableLoading();
          this.adjustWidth();
        }
      });
  }

  vendorRFQTechEvaluation(params: GridReadyEvent) {
    this.getRFQVendorList();
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.vendorRFQList == null ||
      this.vendorRFQList == undefined ||
      this.vendorRFQList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
    //Auto-Width Fix -end
  }
  getVendorRFQColumn() {
    this.columnSettingsService.getVendorRFQColumn().subscribe((item: any) => {
      this.savedColumns = item.data.defaultColumns;

      if (this.savedColumns && this.savedColumns[0]) {
        let savedColumnsArray = this.savedColumns[0].split(',');

        this.columnDefs.forEach((element, index) => {
          if (element.field) {
            let selectedColumnName = savedColumnsArray.find(
              (item: any) => item === element.field
            );
            if (selectedColumnName) {
              this.columnDefs[index].hide = false;
            } else {
              this.columnDefs[index].hide = true;
            }
          }
        });
        this.gridApi?.setColumnDefs(this.columnDefs);
        this.adjustWidth();
      }
    });
  }

  toggleMySubmissions(col: any) {
    this.removeChips(col);
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].field === col) {
        if (this.columnDefs[x].hide === false) {
          this.columnDefs[x].hide = true;
        } else {
          this.columnDefs[x].hide = false;
        }
      }
    }

    this.gridApi.setColumnDefs(this.columnDefs);

    let allColumns = this.columnDefs.filter((x: any) => x.field);
    this.selectedMySubColumnNumber = allColumns.length;

    this.activeColumns = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    );
    this.selectedColumns = this.activeColumns.map(
      (element: any) => element.field
    );
    this.adjustWidth();
  }

  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  saveVendorRFQColumn() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveVendorRFQColumn(this.selectedColumns)
        .subscribe((item: any) => {
          if (item.status === 'success') {
            this.setActiveItem('');
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Filter applied Successful.');
          }
        });
      this.toggleDropdown();
      this.adjustWidth();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(
        event.target instanceof HTMLElement &&
        event.target.closest('.column-setting-dialog')
      )
    ) {
      this.dropdownVisible = false;
      this.setActiveItem('');
    }
    this.adjustWidth();
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi;
  public Gridtitle!: string;
  public routerdata: any = [];

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
    this.adjustWidth();
  }

  onModelUpdated() {
    if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length == 0) {
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length > 0) {
      this.gridApi.hideOverlay();
    }
    this.adjustWidth();
  }

  resetAllColumnsInConfig() {
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) this.columnDefs[x].hide = false;
    }
    this.gridApi.setColumnDefs(this.columnDefs);
    this.adjustWidth();
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  selectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field) {
        this.columnDefs[i].hide = false;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = this.columnDefs
      .filter((element: any) => !element.hide)
      .map((item) => item.field);
    this.adjustWidth();
  }

  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field && !element.dontShow) {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = ['sowJdRfqNumber'];
    this.adjustWidth();
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.vendorService.getColFiltersVendor(50, this.vendorId).subscribe({
      next: (res: any) => {
        let onlyKeysarr = [];
        if (res.data.columnFilters == '') {
          this.filterChipsSets = null;
          this.ClearAllChipsFiltersOnIntialLoad();
        }
        if (res.data.columnFilters != '') {
          onlyKeysarr = JSON.parse(res.data.columnFilters);
          if (onlyKeysarr) {
            this.finalKeyArray = Object.keys(onlyKeysarr);
            this.filterChipsSets = Object.keys(onlyKeysarr);
          }
          this.gridOptions.api.setFilterModel(onlyKeysarr);
          this.loaderService.setDisableLoading();
        }
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
  }
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }
  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustWidth();
  }
  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel(); //same
    this.filterToString = JSON.stringify(this.filterModel);

    this.filterToParse = JSON.parse(this.filterToString);
    this.filterChipsSets = Object.keys(this.filterToParse);
    this.adjustWidth();
  }
  saveChipsFilters() {
    this.loaderService.setShowLoading();
    // API
    var payload: any = {
      menuid: 50,
      filters: JSON.stringify(this.filterModel),
      vendorid: this.vendorId,
    };
    this.vendorService.saveColFiltersVendor(payload).subscribe({
      next: (res: any) => {
        this.columnFilters = res.data.columnFilters;
        let onlyKeysarr = [];
        onlyKeysarr = JSON.parse(this.columnFilters);
        this.filterChipsSets = Object.keys(onlyKeysarr);
        this.finalKeyArray = Object.keys(onlyKeysarr);
        this.adjustWidth();
        this.loaderService.setDisableLoading();
        this.showSnackbar('Filter saved Successfully.');
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
    // api
  }
  getCapitalize(item: any) {
    const getcapVal = this.columnDefs.find(
      (a) => a.field.toLowerCase() == item.toLowerCase()
    );
    return getcapVal.headerName;
  }
  removeChips(f: any) {
    let onlyKeysarr = [];
    const index = this.filterChipsSets.indexOf(f);
    if (index >= 0) {
      this.filterChipsSets.splice(index, 1);
      onlyKeysarr = JSON.parse(this.filterToString);
      delete onlyKeysarr[f];
      this.filterToString = JSON.stringify(onlyKeysarr);
      let onlyKeysarr2 = [];
      onlyKeysarr2 = JSON.parse(this.filterToString);
      this.gridOptions.api.setFilterModel(onlyKeysarr2);
      this.adjustWidth();

      this.loaderService.setDisableLoading();
      var removepayload: any = {
        menuid: 50,
        filters: JSON.stringify(onlyKeysarr),
        vendorid: this.vendorId,
      };
      this.vendorService.saveColFiltersVendor(removepayload).subscribe({
        next: (res: any) => {
          this.removedColumnFilters = res.data.columnFilters; //chips name with value received from API
          let onlyKeysarr2 = [];
          onlyKeysarr2 = JSON.parse(this.removedColumnFilters);
          this.gridOptions.api.setFilterModel(onlyKeysarr2);
          this.filterChipsSets = Object.keys(onlyKeysarr2);
          this.adjustWidth();
          this.loaderService.setDisableLoading();
        },
        error: (error: any) => {},
      });
    }
  }
  ClearAllChipsFilters() {
    this.loaderService.setShowLoading();
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 50,
      filters: '',
      vendorid: this.vendorId,
    };
    this.vendorService.saveColFiltersVendor(payload).subscribe({
      next: (res: any) => {
        console.log('filter response', res);
        this.loaderService.setDisableLoading();
        this.adjustWidth();
        this.showSnackbar('Filter cleared Successfully.');
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
    this.gridOptions.api.setFilterModel(null);
  }
  ClearAllChipsFiltersOnIntialLoad() {
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 50,
      filters: '',
      vendorid: this.vendorId,
    };
    this.vendorService.saveColFiltersVendor(payload).subscribe({
      next: (res: any) => {
        this.adjustWidth();
      },
      error: (error: any) => {},
    });
    this.gridOptions.api.setFilterModel(null);
  }
}
