import {
  Component,
  ViewChild,
  OnInit,
  HostListener,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColDef, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import { NotifyService } from '../services/notify.service';
import { sowjdService } from '../services/sowjdService.service';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import { SrnHyperlinkComponent } from './srn-hyperlink/srn-hyperlink.component';
import { LoaderService } from 'src/app/services/loader.service';
import { DatePipe } from '@angular/common';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { config } from 'src/app/config';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SrnService } from 'src/app/services/srn.service';
import { Subscription } from 'rxjs';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';

@Component({
  selector: 'app-sowjd-srn',
  templateUrl: './sowjd-srn.component.html',
  styleUrls: ['./sowjd-srn.component.scss'],
  providers: [DatePipe],
})
export class SowjdSrnComponent {
  dropdownVisible = false;
  id: any;
  selectedMySubColumnNumber = 0;
  selectedColumns: any;
  activeColumns: any;
  savedColumns: any;
  filterValue: string;
  sowJdSRNData: any = [];
  url: string;
  paginationPageSize: number = 5;
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
  ColumnMoveddefs = [];
  columnSequence: any;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi: any;
  public Gridtitle!: string;
  public routerdata: any = [];
  dateFormat = config.dateFormat;
  ExportDate: any;
  exportFileName: string = 'SRN';
  sowjdSrnSubscription: Subscription;
  subscription: Subscription;
  permissionDetailsSRN: PermissionDetails;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private sowjdservice: sowjdService,
    private notifyservice: NotifyService,
    private columnSettingsService: ColumnSettingsService,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
    private planningService: PlaningService,
    private snackBar: MatSnackBar,
    private srnservice: SrnService,
    private sowjdService: sowjdService
  ) {
    // Using for Roles and Permissions
    this.subscription = this.sowjdService
      .getUserProfileRoleDetailSRN()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSRN = roles;
      });

    this.sowjdSrnSubscription = this.srnservice.vendorSrn.subscribe((item) => {
      console.log(item);
      this.getsowjdSRNList();
    });

    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate, this.dateFormat);

    this.router.events.subscribe((value) => {
      this.url = this.router.url.toString();
    });
  }

  public srnListcolumnDefs = [
    {
      headerName: 'SRN Number',
      hide: false,
      dontShow: true,
      field: 'srnNumber',
      pinned: 'left',
      cellRenderer: SrnHyperlinkComponent,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
    {
      headerName: 'Billing Month',
      hide: false,
      field: 'billingMonth',
    },
    {
      headerName: 'Billing Period ID',
      hide: false,
      field: 'billingPeriodId',
    },
    {
      headerName: 'Invoice Number',
      hide: false,
      field: 'invoiceNumber',
    },
    {
      headerName: 'PO Number',
      hide: false,
      field: 'poNumber',
    },
    {
      headerName: 'SOW JD ID',
      hide: false,
      field: 'sowjdNumber',
    },
    {
      headerName: 'Delivery Manager',
      hide: false,
      field: 'deliveryManager',
    },
    {
      headerName: 'Status',
      hide: false,
      field: 'status',
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

  onModelUpdated() {
    if (this.gridApi && this.gridApi.rowModel?.rowsToDisplay?.length == 0) {
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi && this.gridApi.rowModel?.rowsToDisplay?.length > 0) {
      this.gridApi.hideOverlay();
    }
  }

  ngOnInit() {
    this.getsowjdSRNList();
    this.selectedMySubColumnNumber = this.srnListcolumnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getSowjdSRNColumns();
  }

  getSowjdSRNColumns() {
    this.columnSettingsService.getSowjdSRNColumns().subscribe((item: any) => {
      this.savedColumns = item.data.defaultColumns;
      if (this.savedColumns[0]) {
        let savedColumnsArray = this.savedColumns[0].split(',');

        this.srnListcolumnDefs.forEach((element, index) => {
          if (element.field) {
            let selectedColumnName = savedColumnsArray?.find(
              (item: any) => item === element.field
            );
            if (selectedColumnName) {
              this.srnListcolumnDefs[index].hide = false;
            } else {
              this.srnListcolumnDefs[index].hide = true;
            }
          }
        });
        this.gridApi?.setColumnDefs(this.srnListcolumnDefs);
      }
    });
    this.adjustWidth();
  }

  onBtnExport() {
    var params = {
      fileName: `${
        this.exportFileName + '_Export' + '_' + this.ExportDate
      }.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  }

  sowjdSRNList(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.sowJdSRNData == null ||
      this.sowJdSRNData == undefined ||
      this.sowJdSRNData.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }

  getsowjdSRNList() {
    this.loaderService.setShowLoading();
    this.sowjdservice.getSowjdSRNDetails().subscribe({
      next: (res: any) => {
        this.sowJdSRNData = res.data;
        this.loaderService.setDisableLoading();
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
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

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  saveSowjdSRNColumns() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveSowjdSRNColumns(this.selectedColumns)
        .subscribe((item: any) => {
          if (item.status === 'success') {
            this.setActiveItem('');
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Filter applied Successfully.');
          }
        });
      this.toggleDropdown();
    }
  }
  selectAllColumns() {
    this.srnListcolumnDefs.forEach((element, i) => {
      if (element.headerName && element.field) {
        this.srnListcolumnDefs[i].hide = false;
      }
    });
    this.gridApi.setColumnDefs(this.srnListcolumnDefs);

    this.selectedColumns = this.srnListcolumnDefs
      .filter((element: any) => !element.hide)
      .map((item) => item.field);
  }

  unSelectAllColumns() {
    this.srnListcolumnDefs.forEach((element, i) => {
      if (element.headerName && element.field && !element.dontShow) {
        this.srnListcolumnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.srnListcolumnDefs);

    this.selectedColumns = ['srnNumber'];
  }

  toggleMySubmissions(col: any) {
    for (var x = 0; x < this.srnListcolumnDefs.length; x++) {
      if (this.srnListcolumnDefs[x].field === col) {
        if (this.srnListcolumnDefs[x].hide === false) {
          this.srnListcolumnDefs[x].hide = true;
        } else {
          this.srnListcolumnDefs[x].hide = false;
        }
      }
    }

    this.gridApi.setColumnDefs(this.srnListcolumnDefs);

    let allColumns = this.srnListcolumnDefs.filter((x: any) => x.field);
    this.selectedMySubColumnNumber = allColumns.length;

    this.activeColumns = this.srnListcolumnDefs.filter(
      (x: any) => x.field && x.hide == false
    );
    this.selectedColumns = this.activeColumns.map(
      (element: any) => element.field
    );
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(51).subscribe({
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
      menuid: 51,
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
    const getcapVal = this.srnListcolumnDefs.find(
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
        menuid: 51,
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
      menuid: 51,
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
      menuid: 51,
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

  ngOnDestroy() {
    this.sowjdSrnSubscription.unsubscribe();
  }
}
