import { Component, ViewChild, OnInit, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AgGridAngular } from 'ag-grid-angular';
import {
  GridApi,
  ColDef,
  GridReadyEvent,
  GridOptions,
} from 'ag-grid-community';
import { sowjdService } from '../../services/sowjdService.service';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import { HyperlinkComponent } from '../hyperlink/hyperlink.component';
import { NotifyService } from '../../services/notify.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { SignoffHyperlinkComponent } from './signoff-hyperlink/signoff-hyperlink.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { LoaderService } from 'src/app/services/loader.service';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { error } from 'console';
import { config } from 'src/app/config';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-sowjd-signoff',
  templateUrl: './sowjd-signoff.component.html',
  styleUrls: ['./sowjd-signoff.component.scss'],
  providers: [DatePipe],
})
export class SowjdSignoffComponent {
  dropdownVisible = false;
  id: any;
  selectedMySubColumnNumber = 0;
  selectedColumns: any;
  activeColumns: any;
  savedColumns: any;
  filterValue: string;
  public sowJdRFQData: any;
  url: string;
  permissionDetails: PermissionDetails;
  subscription: Subscription;
  paginationPageSize: number = 5;
  ExportDate: any;
  exportFileName: string = 'Sign Off';
  dateFormat = config.dateFormat;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  autoGroupColumnDef: ColDef = { minWidth: 0 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    //Auto-Width Fix
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
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  finalKeyArray: any = [];
  columnFilters: any;
  removedColumnFilters: any;
  PlanningChipsKey: any;
  filterModel: any;
  filterToString: any;
  filterToParse: any;
  filterChipsSets: any = [];
  columnApi: any; //Auto-Width Fix

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sowjdservice: sowjdService,
    private notifyservice: NotifyService,
    private columnSettingsService: ColumnSettingsService,
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
    });

    // Using for Roles and Permissions
    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailSignOff()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
      });
  }

  public columnDefs = [
    {
      headerName: 'Sign Off ID',
      hide: false,
      dontShow: true,
      field: 'technicalProposalNumber',
      cellRenderer: SignoffHyperlinkComponent,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
      pinned: 'left',
    },
    {
      headerName: 'SoW JD ID',
      hide: false,
      field: 'sowjdNumber',
      cellRenderer: HyperlinkComponent,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
      pinned: 'left',
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
      field: 'outSourcingMode',
    },
    {
      headerName: 'Location',
      hide: false,
      field: 'plantName',
    },
    {
      headerName: 'Record Owner',
      hide: false,
      field: 'recordOwner',
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
    },
    {
      headerName: 'Delivery Manager',
      hide: false,
      field: 'deliveryManagerName',
    },
    {
      headerName: 'Section SPOC',
      hide: false,
      field: 'sectionSpocName',
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
      headerName: 'Total Hours',
      hide: false,
      field: 'totalHours_WP',
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
      headerName: 'Total Personal Cost',
      hide: false,
      field: 'total_Personal_Cost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.total_Personal_Cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total OH Cost',
      hide: false,
      field: 'total_OH_Cost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.total_OH_Cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Cost',
      hide: false,
      field: 'total_Cost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.total_Cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'OCI Index',
      hide: false,
      field: 'ocI_Index',
      cellRenderer: (params) => {
        return params.value === '0.000' || params.value === 0
          ? 'NA'
          : params.value;
      },
    },
    {
      headerName: 'Sign off Status',
      hide: false,
      field: 'status',
      resizable: false,
    },
    {
      headerName: 'Created By',
      hide: false,
      field: 'createdBy',
    },
    {
      headerName: 'Created On',
      hide: false,
      field: 'createdOn',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Modified By',
      hide: false,
      field: 'modifiedBy',
    },
    {
      headerName: 'Modified On',
      hide: false,
      field: 'modifiedOn',
      cellRenderer: DateFormatComponent,
    },
  ];

  ngOnInit(): void {
    this.getsowjdRFQSignOff();
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getSignOffColumns();
  }

  onBtnExport() {
    var params = {
      fileName: `${
        this.exportFileName + '_Export' + '_' + this.ExportDate
      }.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
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

  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  getsowjdRFQSignOff() {
    this.loaderService.setShowLoading();
    this.sowjdservice.getsowjdRFQSignOff().subscribe({
      next: (res: any) => {
        this.sowJdRFQData = res.data;
        this.sowJdRFQData.forEach((sowjdDetail: any) => {
          this.companyCurrencyName = sowjdDetail?.currencyName;
          let currencyObj = this.loaderService.getCountryDetailByCurrency(
            this.companyCurrencyName
          );

          this.companyLocale = currencyObj.locale;
          this.companyNumericFormat = currencyObj.numericFormat;
        });
        this.loaderService.setDisableLoading();
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
  }
  sowjdRFQSignOff(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.sowJdRFQData == null ||
      this.sowJdRFQData == undefined ||
      this.sowJdRFQData.length <= 0
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

  getSignOffColumns() {
    this.columnSettingsService.getSignOffColumns().subscribe((item: any) => {
      this.savedColumns = item.data.defaultColumns;
      if (this.savedColumns.length > 0 && this.savedColumns[0]) {
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
    this.adjustWidth();
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

  saveSignOffColumns() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveSignOffColumns(this.selectedColumns)
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
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(62).subscribe({
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

  //Auto-Width Fix -End

  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter((x: any) => {
      x.field && x.hide == true;
    }).length;
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
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
      menuid: 62,
      filters: JSON.stringify(this.filterModel),
    };
    this.planningService.saveColFilters(payload).subscribe({
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
        menuid: 62,
        filters: JSON.stringify(onlyKeysarr),
      };
      this.planningService.saveColFilters(removepayload).subscribe({
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
      menuid: 62,
      filters: '',
    };
    this.planningService.saveColFilters(payload).subscribe({
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
      menuid: 62,
      filters: '',
    };
    this.planningService.saveColFilters(payload).subscribe({
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
}
