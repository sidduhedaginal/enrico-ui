import {
  Component,
  ViewChild,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
import { VendorService } from '../services/vendor.service';
import { DatePipe } from '@angular/common';
import { VendorSignoffHyperlinkComponent } from '../vendor-details/vendor-signoff-hyperlink/vendor-signoff-hyperlink.component';
import { LoaderService } from 'src/app/services/loader.service';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-vendor-signoff',
  templateUrl: './vendor-signoff.component.html',
  styleUrls: ['./vendor-signoff.component.scss'],
  providers: [DatePipe],
})
export class VendorSignoffComponent implements OnInit, OnDestroy {
  dropdownVisible = false;
  url: string;
  selectedMySubColumnNumber = 0;
  selectedColumns: any;
  activeColumns: any;
  savedColumns: any;
  filterValue: string;
  vendorSignOffList: any = [];
  vendorId: string;
  paginationPageSize: number = 5;
  ExportDate: any;
  exportFileName: string = 'Sign Off';
  private gridApi;
  public Gridtitle!: string;
  public routerdata: any = [];
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
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  overlayNoRowsTemplate = '<span></span>';
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 2,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any;
  public columnDefs = [
    {
      headerName: 'Sign Off ID',
      hide: false,
      dontShow: true,
      field: 'technicalProposalNumber',
      cellRenderer: VendorSignoffHyperlinkComponent,
    },
    {
      headerName: 'SoW JD ID',
      hide: false,
      field: 'sowjdNumber',
    },
    {
      headerName: 'SoW JD Description',
      hide: false,
      field: 'sowjdDescription',
    },
    {
      headerName: 'SoW JD Type',
      hide: false,
      field: 'sowJdType',
    },
    {
      headerName: 'Company Code',
      hide: false,
      field: 'companyCode',
    },
    {
      headerName: 'Company Name',
      hide: false,
      field: 'companyFullName',
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
      headerName: 'Record Owner',
      hide: false,
      field: 'technicalSignOffOwner',
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
      headerName: 'Last Date to Submit Proposal',
      hide: false,
      field: 'lastDateToSubmitProposal',
      cellRenderer: DateFormatComponent,
      cellClass: 'lastDateToSubmitProposalDateFormat',
    },
    {
      headerName: 'Delivery Manager',
      hide: false,
      field: 'deliveryManagerName',
    },
    {
      headerName: 'Delivery Head',
      hide: false,
      field: 'deliveryHeadName',
    },
    {
      headerName: 'Section SPOC',
      hide: false,
      field: 'sectionSpocName',
    },
    {
      headerName: 'Equivalent Capacity',
      hide: false,
      field: 'equivalentCapacity',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.equivalentCapacity,
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
      headerName: 'Total Hours',
      hide: false,
      field: 'total_Hours_WP',
    },
    {
      headerName: 'Total Cost Vendor',
      hide: false,
      field: 'totalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Sign off Status',
      hide: false,
      field: 'status',
    },
  ];
  excelStyles = [
    {
      id: 'lastDateToSubmitProposalDateFormat',
      dataType: 'dateTime',
      numberFormat: { format: 'dd-MMM-yyyy' },
    },
  ];
  constructor(
    private router: Router,
    private columnSettingsService: ColumnSettingsService,
    private dashboardService: DashboardService,
    private sowjdservice: sowjdService,
    private vendorService: VendorService,
    private datePipe: DatePipe,
    private notifyservice: NotifyService,
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
    });
    this.vendorId = this.vendorService.vendorId;
    this.vendorService.getColFiltersVendor(49, this.vendorId).subscribe({
      next: (res: any) => {},
    });
  }

  ngOnInit(): void {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getVendorSignOffColumn();
    this.getRFQVendorSignoffList();
  }

  onBtnExport() {
    var params = {
      fileName: `${
        this.exportFileName + '_Export' + '_' + this.ExportDate
      }.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  }

  vendorRFQSignOff(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.hideOverlay();
    if (
      this.vendorSignOffList == null ||
      this.vendorSignOffList == undefined ||
      this.vendorSignOffList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }

  onModelUpdated() {
    if (this.gridApi && this.gridApi?.rowModel?.rowsToDisplay?.length == 0) {
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi && this.gridApi?.rowModel?.rowsToDisplay?.length > 0) {
      this.gridApi.hideOverlay();
    }
  }

  getRFQVendorSignoffList() {
    this.loaderService.setShowLoading();
    this.sowjdservice
      .getVendorSignoffByIdvendorId(this.vendorId)
      .subscribe((res: any) => {
        if (res.data.length > 0 || res.data !== null) {
          this.vendorSignOffList = res.data;
          this.vendorSignOffList.forEach((sowjdDetail: any) => {
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

  getVendorSignOffColumn() {
    this.columnSettingsService
      .getVendorSignOffColumn()
      .subscribe((item: any) => {
        this.savedColumns = item.data.defaultColumns;

        if (this.savedColumns) {
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

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
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

  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  saveVendorSignOffColumn() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveVendorSignOffColumn(this.selectedColumns)
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

    this.selectedColumns = ['technicalProposalNumber'];
    this.adjustWidth();
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  onFirstDataRendered(event: any) {
    this.vendorService.getColFiltersVendor(49, this.vendorId).subscribe({
      next: (res: any) => {
        let onlyKeysarr = [];
        if (res.data.columnFilters == '') {
          this.filterChipsSets = null;
          this.ClearAllChipsFiltersOnIntialLoad();
          this.adjustWidth();
        }
        if (res.data.columnFilters != '') {
          onlyKeysarr = JSON.parse(res.data.columnFilters);
          if (onlyKeysarr) {
            this.finalKeyArray = Object.keys(onlyKeysarr);
            this.filterChipsSets = Object.keys(onlyKeysarr);
          }
          this.gridOptions.api.setFilterModel(onlyKeysarr);
          this.adjustWidth();
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
    this.adjustWidth();
  }

  onPageSizeChange(event: any) {
    this.adjustWidth();
  }
  onHorizontalScroll(event: any) {
    this.adjustWidth();
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
      menuid: 49,
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
        menuid: 49,
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
  ClearAllChipsFiltersOnIntialLoad() {
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 49,
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
  ClearAllChipsFilters() {
    this.loaderService.setShowLoading();
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 49,
      filters: '',
      vendorid: this.vendorId,
    };
    this.vendorService.saveColFiltersVendor(payload).subscribe({
      next: (res: any) => {
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
  }
  ngOnDestroy(): void {
    console.log('OnDestroy');
  }
}
