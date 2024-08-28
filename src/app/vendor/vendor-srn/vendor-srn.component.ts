import { Component, HostListener, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ColDef,
  GridOptions,
  GridReadyEvent,
  RowGroupingDisplayType,
} from 'ag-grid-community';
import { HomeService } from 'src/app/services/home.service';
import { SrnService } from 'src/app/services/srn.service';
import { config } from 'src/app/config';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import { SrnHyperlinkComponent } from './srn-hyperlink/srn-hyperlink.component';
import { VendorService } from '../services/vendor.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vendor-srn',
  templateUrl: './vendor-srn.component.html',
  styleUrls: ['./vendor-srn.component.scss'],
  providers: [DatePipe],
})
export class VendorSrnComponent {
  private gridApi;
  loader: boolean;
  vendorSrnData = [];
  dropdownVisible = false;
  selectedMySubColumnNumber = 0;
  url: string;
  sowJdId: string = '';
  vendorId: string;
  selectedColumns: any;
  activeColumns: any;
  savedColumns: any;
  filterValue: string;
  paginationPageSize: number = 5;
  public groupDisplayType: RowGroupingDisplayType = 'groupRows';
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
  ExportDate: any;
  exportFileName: string = 'SRN';
  dateFormat = config.dateFormat;
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
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
  vendorSrnSuscription: Subscription;

  constructor(
    private router: Router,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private srnservice: SrnService,
    private columnSettingsService: ColumnSettingsService,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private notifyservice: NotifyService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar
  ) {
    this.vendorSrnSuscription = this.srnservice.vendorSrn.subscribe((item) => {
      console.log(item);
      this.getVenderMySrnList();
    });

    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate, this.dateFormat);

    this.router.events.subscribe((value) => {
      this.url = this.router.url.toString();
    });

    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
    this.vendorId = this.vendorService.vendorId;
  }

  public columnDefs = [
    {
      headerName: 'SRN Number',
      field: 'srnNumber',
      hide: false,
      dontShow: true,
      cellRenderer: SrnHyperlinkComponent,
      pinned: 'left',
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
    {
      headerName: 'Billing Month',
      field: 'billingMonth',
      hide: false,
    },
    {
      headerName: 'Billing Period ID',
      field: 'billingPeriodId',
      hide: false,
    },
    {
      headerName: 'Invoice Number',
      hide: false,
      field: 'invoiceId',
    },
    {
      headerName: 'PO Number',
      hide: false,
      field: 'ponumber',
    },
    {
      headerName: 'SoW JD ID',
      hide: false,
      field: 'sowJdNumber',
    },
    {
      headerName: 'Delivery Manager',
      hide: false,
      field: 'deliveyManangerName',
    },
    {
      headerName: 'Status',
      hide: false,
      field: 'statusName',
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
    this.getVenderMySrnList();

    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getColumnsVendorSrn();
  }

  onBtnExport() {
    var params = {
      fileName: `${
        this.exportFileName + '_Export' + '_' + this.ExportDate
      }.xlsx`,
    };
    for (const obj of this.vendorSrnData) {
      obj.createdOn = this.datePipe.transform(obj?.createdOn, 'dd-MMM-yyyy');
      obj.modifiedOn = this.datePipe.transform(obj?.modifiedOn, 'dd-MMM-yyyy');
    }
    this.gridApi.exportDataAsExcel(params);
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
  }

  CreateSRN() {
    this.router.navigate(['/vendor/vendor-srn/create']);
  }

  resetAllColumnsInConfig() {
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) this.columnDefs[x].hide = false;
    }
    this.gridApi.setColumnDefs(this.columnDefs);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  saveColumnsVendorSrn() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveColumnsVendorSrn(this.selectedColumns)
        .subscribe((item: any) => {
          if (item.status === 'success') {
            this.setActiveItem('');
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Filter applied Successful.');
          }
        });
      this.toggleDropdown();
      // this.adjustWidth();
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
  }

  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field && !element.dontShow) {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = ['srnNumber'];
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
    // this.adjustWidth();
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  getColumnsVendorSrn() {
    this.columnSettingsService.getColumnsVendorSrn().subscribe((item: any) => {
      this.savedColumns = item.data.defaultColumns;

      if (this.savedColumns[0]) {
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
  }

  onGridReadyForAction(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.vendorSrnData == null ||
      this.vendorSrnData == undefined ||
      this.vendorSrnData.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }
  sizeToFit() {
    this.gridApi.sizeColumnsToFit({
      defaultMinWidth: 100,
    });
  }

  onFirstDataRendered(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
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
  onPageSizeChange(event: any) {
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
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  getVenderMySrnList() {
    this.loaderService.setShowLoading();
    this.srnservice.getSrnListByVendor(this.vendorId).subscribe((res: any) => {
      this.vendorSrnData = res.data;
      this.loaderService.setDisableLoading();
    });
  }
  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel(); //same
    this.filterToString = JSON.stringify(this.filterModel);

    this.filterToParse = JSON.parse(this.filterToString);
    this.filterChipsSets = Object.keys(this.filterToParse);
    this.adjustWidth();
  }
  getCapitalize(item: any) {
    const getcapVal = this.columnDefs.find(
      (a) => a.field.toLowerCase() == item.toLowerCase()
    );
    return getcapVal.headerName;
  }
  saveChipsFilters() {
    this.loaderService.setShowLoading();
    // API
    var payload: any = {
      menuid: 48,
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
        menuid: 48,
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
      menuid: 48,
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
      menuid: 48,
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

  ngOnDestroy() {
    this.vendorSrnSuscription.unsubscribe();
  }
}
