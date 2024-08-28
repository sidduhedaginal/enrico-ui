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
import { WidthdrawComponent } from '../../popup/widthdraw/widthdraw.component';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import { HyperlinkComponent } from '../hyperlink/hyperlink.component';
import { ActionComponent } from '../action/action.component';
import { ConfirmDeletePopupComponent } from '../../popup/confirm-delete-popup/confirm-delete-popup.component';
import { NotifyService } from '../../services/notify.service';
import { ConfirmationAlertComponent } from '../../popup/confirmation-alert/confirmation-alert.component';
import { FloatRfqComponent } from '../../popup/float-rfq/float-rfq.component';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { SowjdSecSpocService } from 'src/app/services/sowjd-sec-spoc.service';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { LoaderService } from 'src/app/services/loader.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { config } from 'src/app/config';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'lib-sowjd-request-list',
  templateUrl: './sowjd-request-list.component.html',
  styleUrls: ['./sowjd-request-list.component.scss'],
  providers: [DatePipe],
})
export class SowjdRequestListComponent implements OnInit {
  dropdownVisible = false;
  id: any;
  selectedMySubColumnNumber = 0;
  selectedColumns: any;
  activeColumns: any;
  savedColumns: any;
  filterValue: string;
  public sowJdData: any;
  url: string;
  vendorSuggestionData = [];
  paginationPageSize: number = 5;
  ExportDate: any;
  exportFileName: string = 'SoWJD';
  dateFormat = config.dateFormat;
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
    wrapText: true,
    autoHeight: true,
    cellStyle: { 'text-align': 'left' },
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any; //Auto-Width Fix

  dmRole: boolean;
  dhRole: boolean;
  permissionDetails: PermissionDetails;
  subscription: Subscription;
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
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    public sowjdservice: sowjdService,
    private notifyservice: NotifyService,
    private columnSettingsService: ColumnSettingsService,
    private sowjdDhService: SowjdDhService,
    private sowjdSecSpocService: SowjdSecSpocService,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
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
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
      });
  }

  public columnDefs = [
    {
      headerName: 'SoW JD Number',
      hide: false,
      dontShow: true,
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
      field: 'sowjdType',
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
      headerName: 'Location/Plant',
      hide: false,
      field: 'plantName',
    },
    {
      headerName: 'WBS',
      hide: false,
      field: 'wbsElement',
    },
    {
      headerName: 'Name of the Customer',
      hide: false,
      field: 'customerName',
    },
    {
      headerName: 'Internal Resource check done?',
      hide: false,
      field: 'internalResourceCheckdone',
    },
    {
      headerName: 'Customer Approval Available for using outsourcing?',
      hide: false,
      field: 'isCustomerApprovalAvailable',
    },
    {
      headerName: 'Customer',
      hide: false,
      field: 'customerTypeName',
    },

    {
      headerName: 'Is the project GDPR relevant?',
      hide: false,
      field: 'isprojectGDPRRelevant',
    },
    {
      headerName: 'Is it clarified if the standard GPA is sufficient?',
      hide: false,
      field: 'isStandardGPAIsSufficient',
    },
    {
      headerName: 'C2P agreement?',
      hide: false,
      field: 'c2PAgreement',
    },
    {
      headerName: 'Does "Resource Augmentation" need extension of C2P?',
      hide: false,
      field: 'isResourceAugmentationNeedExtensionOfC2P',
    },
    {
      headerName: 'C2P document prepared?',
      hide: false,
      field: 'c2PDocumentPrepared',
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
      headerName: 'Repeat Outsourcing',
      hide: false,
      field: 'isRepeatOutsourcing',
    },
    {
      headerName: 'SoW JD Reference',
      hide: false,
      field: 'sowJdReferenceNumber',
    },
    {
      headerName: 'Group',
      hide: false,
      field: 'group',
    },
    {
      headerName: 'Department',
      hide: false,
      field: 'department',
    },
    {
      headerName: 'Section',
      hide: false,
      field: 'section',
    },
    {
      headerName: 'BU',
      hide: false,
      field: 'bu',
    },
    {
      headerName: 'Project Start',
      hide: false,
      field: 'startDate',
      cellRenderer: DateFormatComponent,
      cellClass: 'projectStartDateFormat',
    },
    {
      headerName: 'Project End',
      hide: false,
      field: 'endDate',
      cellRenderer: DateFormatComponent,
      cellClass: 'projectEndDateFormat',
    },
    {
      headerName: 'Budget Code',
      hide: false,
      field: 'budgetCode',
    },
    {
      headerName: 'Cost Center',
      hide: false,
      field: 'costCenter',
    },
    {
      headerName: 'Material Group',
      hide: false,
      field: 'materialGroup',
    },
    {
      headerName: 'Fund',
      hide: false,
      field: 'fundCode',
    },
    {
      headerName: 'Fund Center Name',
      hide: false,
      field: 'fundCentername',
    },
    {
      headerName: 'Internal Equivalent Capacity',
      hide: false,
      field: 'internalEquivalentCapacity',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.internalEquivalentCapacity,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Internal Equivalent PMO',
      hide: false,
      field: 'internalEquivalentPMO',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.internalEquivalentPMO,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Personal Cost',
      hide: false,
      field: 'personalcost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.personalcost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'OH Cost',
      hide: false,
      field: 'ohCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.ohCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Cost',
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
      headerName: 'Target Savings (%)',
      hide: false,
      field: 'targetSavings',
    },
    {
      headerName: 'Guidance Cost',
      hide: false,
      field: 'guidanceCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.guidanceCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Delivery Manager',
      hide: false,
      field: 'deliveryManagerName',
    },
    {
      headerName: 'First level Approver',
      hide: false,
      field: 'departmentHeadName',
    },
    {
      headerName: 'Second Level Approver',
      hide: false,
      field: 'sectionSpocName',
    },
    {
      headerName: 'Record Owner',
      hide: false,
      field: 'recordOwner',
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
      cellClass: 'createdOnDateFormat',
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
      cellClass: 'modifiedOnDateFormat',
    },
    {
      headerName: 'Actions',
      hide: false,
      suppressMenu: true,
      resizable: false,
      pinned: 'right',
      cellRenderer: ActionComponent,
      cellRendererParams: {
        openWidthdrawDialog: (params: any) => {
          const dialogRef = this.dialog.open(WidthdrawComponent, {
            width: '50vw',
            data: params.data,
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            this.getSOWJDRequestList();
          });
        },
        doClone: (params: any) => {
          const dialogRef = this.dialog.open(ConfirmationAlertComponent, {
            width: '30vw',
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result.confirm) {
              this.sowjdservice
                .getCloneSowjJd(params.data.sowjdId)
                .subscribe((res: any) => {
                  // Old SOWJD Id
                  let _resID = '';
                  if (res && res.data && res.data.sowJdId) {
                    _resID = res.data.sowJdId;
                  } else if (res && res.data && res.data.id) {
                    _resID = res.data.id;
                  }

                  this.router.navigate(
                    [`./my-sowjd/create-sowjd/`, _resID], // res.data.sowjdId
                    {
                      queryParams: {
                        // clone: 'clone',
                        // newSowjdId:params.data.sowjdId,
                        Submit: params.data.status,
                      },
                    }
                  );
                });
            }
          });
        },
        doSubmit: (params: any) => {
          this.router.navigate(
            ['./my-sowjd/create-sowjd/', params.data.sowjdId],
            {
              queryParams: { submit: 'submit' },
            }
          );
        },
        doDelete: (params: any) => {
          let item = params.data;
          const dialogRef = this.dialog.open(ConfirmDeletePopupComponent, {
            width: '30vw',
            data: { item, skillset: null },
          });
          dialogRef.afterClosed().subscribe((result: any) => {
            if (result.RemoveSowjd) {
              this.loaderService.setShowLoading();
              this.sowjdservice
                .deleteSowjdRequestbyId(result.RemoveSowjd.sowJdId)
                .subscribe(
                  (res) => {
                    this.loaderService.setDisableLoading();
                    const dialogRef = this.dialog.open(SuccessComponent, {
                      width: '500px',
                      height: 'auto',
                      data: `SOWJD records deleted Successfully`,
                    });
                    dialogRef.afterClosed().subscribe((result: any) => {
                      this.getSOWJDRequestList();
                    });
                  },
                  (error) => {
                    this.loaderService.setDisableLoading();
                    console.error(error.data.errorDetails[0].errorCode);
                    this.notifyservice.alert(
                      error.data.errorDetails[0].errorCode
                    );
                  }
                );
            }
          });
        },
        doDHApproveReject: (params: any) => {
          this.router.navigate(['./my-sowjd/dh-approval', params.data.sowjdId]);
        },
        doSPOCApproveReject: (params: any) => {
          this.router.navigate([
            './my-sowjd/spoc-approval',
            params.data.sowjdId,
          ]);
        },
        doFloatRFQ: (params: any) => {
          const dialogRef = this.dialog.open(FloatRfqComponent, {
            width: '50vw',
            data: {
              sowJdId: params.data.sowjdId,
            },
          });
          dialogRef.afterClosed().subscribe((res: any) => {
            if (res.data) {
              this.loaderService.setShowLoading();
              res.data['action'] = 0; //create
              res.data['isSecSpocApproved'] = true;
              res.data['IsManualFloat'] = true;
              this.vendorSuggestionData.push(res.data);

              const vendorObject = {
                sowjdId: params.data.sowjdId,
                recommendedVendors: [...this.vendorSuggestionData],
              };

              const RFQFloatObj = {
                sowJdId: params.data.sowjdId,
                remarks: res.data.remarks,
                recommendedVendors: [...this.vendorSuggestionData],
              };

              this.sowjdDhService.updateVendors(vendorObject).subscribe(
                (res: any) => {
                  if (res.status === 'success') {
                    this.sowjdSecSpocService
                      .sowJdActionSecSpocRFQFloat(RFQFloatObj)
                      .subscribe(
                        (response: any) => {
                          if (response.status === 'success') {
                            this.loaderService.setDisableLoading();
                            this.vendorSuggestionData = [];
                            this.notifyservice.alert('RFQ Floated successful.');
                          }
                        },
                        (error) => {
                          this.loaderService.setDisableLoading();
                        }
                      );
                  }
                },
                (error) => {
                  this.loaderService.setDisableLoading();
                }
              );
            }
          });
        },
      },
    },
  ];

  ngOnInit(): void {
    this.getSOWJDRequestList();
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getSoWJDColumns();
  }

  onBtnExport() {
    var params = {
      fileName: `${
        this.exportFileName + '_Export' + '_' + this.ExportDate
      }.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  }

  getSoWJDColumns() {
    this.columnSettingsService.getSoWJDColumns().subscribe((item: any) => {
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
    this.removeChips(col); // filter chips
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

  getSOWJDRequestList() {
    this.loaderService.setShowLoading();
    this.sowjdservice.getSOWJDRequestList().subscribe({
      next: (res: any) => {
        this.sowJdData = res.data;
        this.sowJdData.forEach((sowjdDetail: any) => {
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
  MysowjdRequest(params: GridReadyEvent) {
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.sowJdData == null ||
      this.sowJdData == undefined ||
      this.sowJdData.length <= 0
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

  CreateSowjdId() {
    this.sowjdservice.getSowjdId().subscribe((res: any) => {
      this.id = res.data.id;
      this.router.navigate([`./my-sowjd/create-sowjd/${this.id}`]);
    });
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
  }

  onModelUpdated() {
    if (this.gridApi && this.gridApi.rowModel?.rowsToDisplay.length == 0) {
      this.gridApi.showNoRowsOverlay();
    }
    if (this.gridApi && this.gridApi.rowModel?.rowsToDisplay.length > 0) {
      this.gridApi.hideOverlay();
    }
    this.adjustWidth();
  }

  // public localeText: { [key: string]: string } = {
  //   noRowsToShow: 'No data to display',
  // };

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

  saveSoWJDColumns() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveSoWJDColumns(this.selectedColumns)
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

  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(41).subscribe({
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
  // filter chips end
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

  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field && !element.dontShow) {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = ['sowjdNumber'];
    this.adjustWidth();
  }

  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter((x: any) => {
      x.field && x.hide == true;
    }).length;
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  // filter chips start
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
      menuid: 41,
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
        menuid: 41,
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
      menuid: 41,
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
      menuid: 41,
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
  // filter chips end
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
