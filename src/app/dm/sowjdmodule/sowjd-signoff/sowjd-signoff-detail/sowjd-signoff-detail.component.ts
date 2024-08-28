import { Component, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { config } from 'src/app/config';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { VendorService } from 'src/app/vendor/services/vendor.service';
import { HomeService } from 'src/app/services/home.service';
import { SowjdDetailsService } from 'src/app/vendor/services/sowjd-details.service';
import { Observable } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { SendbackSignoffComponent } from './sendback-signoff/sendback-signoff.component';
import { CommonSignoffComponent } from './common-signoff/common-signoff.component';
import { AssignPOComponent } from '../assign-po/assign-po.component';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { PoStatusComponent } from './po-status/po-status.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { OwnershipComponent } from 'src/app/planning/popups/ownership/ownership.component';
import { DeleteComponent } from 'src/app/vendor/delete/delete.component';
import { EditSignoffDemandComponent } from 'src/app/dm/popup/edit-signoff-demand/edit-signoff-demand.component';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-sowjd-signoff-detail',
  templateUrl: './sowjd-signoff-detail.component.html',
  styleUrls: ['./sowjd-signoff-detail.component.scss'],
})
export class SowjdSignoffDetailComponent {
  private sub: any;
  dateFormat = config.dateFormat;
  sowJdId: string = '';
  tpId: string;
  rfqDetail: any;
  actionType: string = '';
  getTpWorkPackage: any;
  documentsList: any;
  recommendedVendorsList: any[] = [];
  vendorSuggestionData: any;
  approvedStatusData: any;
  sowjdDHActions: any;
  skillsetData: any;
  loader: boolean;
  public dialogConfig: any;
  vendorDetail: any;
  proposalDocuments: any;
  resourceList: any;
  workPackageList: any[] = [];
  tpRemarks = [];
  error_msg: string = '';
  internalCostList = [];
  POList: any[] = [];
  permissionDetailsSignOff: PermissionDetails;
  subscription: Subscription;
  tpEquivalentResponse: any;
  internalTotalCost: any;
  isOCIIndexExist: boolean = true;
  errorMessage: string;
  osmRoleAdmin: boolean = false;
  employeeNumber: any;
  rowDataSkillset = [];
  rowDataSkillsetSource = [];
  columnApiSkillset: any;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  public noRowsTemplate: string;
  public loadingTemplate: string;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private sowjdDhService: SowjdDhService,
    private vendorService: VendorService,
    private homeService: HomeService,
    private sowjdDetailsService: SowjdDetailsService,
    private sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private loaderService: LoaderService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {
    this.loadingTemplate = `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate = `<span>no rows to show</span>`;

    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });

    this.subscription = this.sowjdService
      .getUserProfileRoleDetailSignOff()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetailsSignOff = roles;
      });
    // Using for Roles and Permissions
    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        this.employeeNumber = response.data.employeeNumber;
        for (let role of response.data.roleDetail[0].roleDetails) {
          if (role.roleName.toLowerCase().startsWith('osm admin')) {
            this.osmRoleAdmin = true;
          }
        }
      },
    });
  }
  public internalCostcolumnDefs = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillsetName',
      wrapText: true,
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No. of Resource',
      hide: false,
      field: 'noOfResources', // Quanity
    },
    {
      headerName: 'PMO',
      hide: false,
      field: 'pmo',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Total Personal Cost',
      hide: false,
      field: 'personalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.personalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total OH Cost',
      hide: false,
      field: 'overheadCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.overheadCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Cost',
      hide: false,
      field: 'totalprice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalprice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
  ];
  public internalCostcolumnDefsWP = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillsetName',
      wrapText: true,
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'PMO',
      hide: false,
      field: 'pmo',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Total Personal Cost',
      hide: false,
      field: 'personalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.personalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total OH Cost',
      hide: false,
      field: 'overheadCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.overheadCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Cost',
      hide: false,
      field: 'totalprice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalprice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
  ];

  public columnDefsResourceRateCardWP = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No.of Resource',
      hide: false,
      field: 'quantity',
    },
    {
      headerName: 'Resource Onboarding Date',
      hide: false,
      field: 'resourceOnboardingDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Onboarded Resource',
      hide: false,
      field: 'resourceOnboardCompleted',
    },
    {
      headerName: 'Onboarding Completed',
      colId: 'action',
      cellRenderer: this.renderActionResource.bind(this),
      resizable: false,
    },
    {
      headerName: 'Remark',
      hide: false,
      field: 'remark',
    },
  ];

  public columnDefsResourceTAM = [
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillSetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No.of Resource',
      hide: false,
      field: 'quantity',
    },
    {
      headerName: 'Quantity',
      hide: false,
      field: 'duration',
    },
    {
      headerName: 'Unit of Measurement',
      hide: false,
      field: 'unitOfMeasurement',
    },
    {
      headerName: 'Total Quantity',
      hide: false,
      field: 'totalQuantity',
    },
    {
      headerName: 'Unit Price',
      hide: false,
      field: 'unitPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.unitPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Price',
      hide: false,
      field: 'price',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Resource Onboarding Date',
      hide: false,
      field: 'resourceOnboardingDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Onboarded Resource',
      hide: false,
      field: 'resourceOnboardCompleted',
    },
    {
      headerName: 'Onboarding Completed',
      colId: 'action',
      cellRenderer: this.renderActionResource.bind(this),
      resizable: false,
    },
    {
      headerName: 'Remark',
      hide: false,
      field: 'remark',
    },
  ];

  public columnDefsPO = [
    {
      headerName: 'Purchase Order',
      hide: false,
      field: 'poNumber',
    },
    {
      headerName: 'Company',
      hide: false,
      field: 'companyCode',
    },
    {
      headerName: 'Location',
      hide: false,
      field: 'location',
    },
    {
      headerName: 'Vendor ID',
      hide: false,
      field: 'vendorSAPID',
    },
    {
      headerName: 'Vendor Name',
      hide: false,
      field: 'vendorName',
    },
    {
      headerName: 'Start Date',
      hide: false,
      field: 'validityStart',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'End Date',
      hide: false,
      field: 'validityEnd',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Status',
      hide: false,
      field: 'isDeleted',
      cellRenderer: PoStatusComponent,
    },
    {
      field: 'Action',
      colId: 'action',
      pinned: 'right',
      cellRenderer: this.actionCellRendererPONumber,
      resizable: false,
    },
  ];

  public columnDefsWorkPackageBGSVRateCardWP = [
    {
      headerName: 'Project Name',
      hide: false,
      field: 'projectName',
    },
    {
      headerName: 'Activity Type',
      hide: false,
      field: 'activityType',
    },
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillsetName',
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'No. of Activity Planned',
      hide: false,
      field: 'noofActivityPlanned',
    },
    {
      headerName: 'Estimation(hrs)/Activity',
      hide: false,
      field: 'estimationPerActivity',
    },
    {
      headerName: 'Total Hours',
      hide: false,
      field: 'totalHours',
    },
    {
      headerName: 'Price/Hr',
      hide: false,
      field: 'unitPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.unitPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Price/Activity',
      hide: false,
      field: 'pricePerActivity',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.pricePerActivity,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Price',
      hide: false,
      field: 'totalPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Delivery Completed',
      colId: 'action',
      cellRenderer: this.renderActionWorkPackage.bind(this),
      resizable: false,
    },
    {
      headerName: 'Remark',
      hide: false,
      field: 'remark',
    },
  ];

  renderActionWorkPackage(params: any) {
    if (
      !params.data.isDeliveryCompleted &&
      this.permissionDetailsSignOff?.editPermission &&
      this.rfqDetail?.isDMSignOffRecordOwner
    ) {
      return ' <div><a class="icon-class"><span class="add-resource"></span><span class="wp_delivery_completed">Delivery Complete</span></a></div>';
    } else {
      return 'Yes';
    }
  }
  renderActionResource(params: any) {
    if (
      !params.data.isOnboardingCompleted &&
      this.permissionDetailsSignOff?.editPermission &&
      (this.rfqDetail?.isDMSignOffRecordOwner ||
        this.rfqDetail?.isSignOffRecordOwner)
    ) {
      return ' <div><a class="icon-class"><span class="add-resource"></span><span class="onboarding_completed">Onboarding Complete</span></a></div>';
    } else {
      return 'Yes';
    }
  }

  onCellClicked(params: any): void {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'wp_delivery_completed'
    ) {
      this.WPDeliveryCompleted(params.data.id);
    }
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'onboarding_completed'
    ) {
      this.OnboardingCompleted(params.data.id);
    }
  }

  WPDeliveryCompleted(wpId: string) {
    let dialogRef = this.dialog.open(CommonSignoffComponent, {
      width: '40vw',
      data: {
        wpId,
        type: 'workPackage',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  OnboardingCompleted(Id: string) {
    let dialogRef = this.dialog.open(CommonSignoffComponent, {
      width: '40vw',
      data: {
        Id,
        type: 'resourcePlan',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  public columnDefsSkillsets = [
    {
      headerName: 'SkillSet',
      field: 'skillset',
    },
    {
      headerName: 'Grade',
      field: 'grade',
    },
    {
      headerName: 'SOW JD Demand (No. of resources)',
      field: 'quantity',
    },
    {
      headerName: 'Quantity',
      field: 'duration',
    },
    {
      headerName: 'Unit Of Measurement',
      field: 'uom',
    },
    {
      headerName: 'PMO',
      field: 'pmo',
    },
    {
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
      resizable: false,
    },
  ];

  autoGroupColumnDef: ColDef = { minWidth: 180 }; //Auto-Width Fix

  public defaultColDef: ColDef = {
    //Auto-Width Fix
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 220,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any; //Auto-Width Fix
  columnApiVSPOne: any;
  columnApiVSPTwo: any;
  columnApiVSPThree: any;
  columnApiVSPFour: any;

  columnApiBICOne: any;
  columnApiBICTwo: any;

  columnApiWPOne: any;
  columnApiWPTwo: any;
  // public defaultColDef: ColDef = {
  //   flex: 1,
  //   sortable: true,
  //   resizable: false,
  //   filter: true,
  //   wrapText: true,
  //   autoHeight: true,
  //   menuTabs: ['filterMenuTab'],
  // };

  // public autoGroupColumnDef: ColDef = {
  //   flex: 1,
  //   minWidth: 180,
  // };

  public rowData$!: Observable<any[]>;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi!: GridApi;
  private gridApiPO!: GridApi;
  private gridApiWP!: GridApi;

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.tpId = params['tpId'];
      if (this.tpId) {
        this.getSignOffDetail();
        this.getPODetails();
        this.getSignOffComments();
      }
    });
  }

  actionCellRendererPONumber(params: any) {
    return '<div class="icon-class_requestlist" ><span class="deleteblue" title="Delete"></span></div>';
  }

  onCellClickedPO(params: any): void {
    let deletePO = params.event.target.className;
    if (params.column.colId === 'action' && deletePO === 'deleteblue') {
      this.deletePO(params);
    }
  }

  deletePO(params: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data !== null && res?.data === 'yes') {
        this.loaderService.setShowLoading();
        this.sowjdDhService
          .deletePO(params.data.poNumber, this.tpId)
          .subscribe({
            next: (res: any) => {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert(res.status);
              this.getPODetails();
            },
            error: (e: any) => {
              this.loaderService.setDisableLoading();
            },
          });
      }
    });
  }
  commonSignOff(type: string) {
    let dialogRef = this.dialog.open(CommonSignoffComponent, {
      width: '40vw',
      data: {
        tpId: this.tpId,
        type,
        outSourcingCode: this.rfqDetail.outSourcingCode,
        sowjdTypeCode: this.rfqDetail.sowjdTypeCode,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  sendBackSignOff(type: string) {
    let dialogRef = this.dialog.open(SendbackSignoffComponent, {
      width: '40vw',
      data: {
        tpId: this.tpId,
        endDate: this.rfqDetail.tpEndDate,
        type,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  assignPO(status: number) {
    let dialogRef = this.dialog.open(AssignPOComponent, {
      width: '50vw',
      data: {
        tpId: this.tpId,
        rfqDetail: this.rfqDetail,
        vendorDetail: this.vendorDetail,
        status,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  onGridReadySkillset(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');

    this.columnApiSkillset = params.columnApi;

    this.gridApi.refreshCells({ force: true });
    this.gridApi.hideOverlay();
    if (
      this.rowDataSkillset == null ||
      this.rowDataSkillset == undefined ||
      this.rowDataSkillset.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();

    this.adjustWidthSkill();
  }

  adjustWidthSkill() {
    const allColumnIds: any = [];
    this.columnApiSkillset?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiSkillset?.autoSizeColumns(allColumnIds, false);
  }

  vendorResourceGridReady(params: GridReadyEvent, type: number) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi = params.api;
    this.columnApiVSPTwo = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.resourceList == null ||
      this.resourceList == undefined ||
      this.resourceList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.allAdjust();
  }

  // adjustWidthVSPOne() {
  //   const allColumnIds: any = [];
  //   this.columnApiVSPOne?.getColumns()?.forEach((column: any) => {
  //     allColumnIds.push(column.getId());
  //   });
  //   this.columnApiVSPOne?.autoSizeColumns(allColumnIds, false);
  // }
  // adjustWidthVSPTwo() {

  // }
  // adjustWidthVSPThree() {
  //   const allColumnIds: any = [];
  //   this.columnApiVSPThree?.getColumns()?.forEach((column: any) => {
  //     allColumnIds.push(column.getId());
  //   });
  //   this.columnApiVSPThree?.autoSizeColumns(allColumnIds, false);
  // }
  // adjustWidthVSPFour() {
  //   const allColumnIds: any = [];
  //   this.columnApiVSPFour?.getColumns()?.forEach((column: any) => {
  //     allColumnIds.push(column.getId());
  //   });
  //   this.columnApiVSPFour?.autoSizeColumns(allColumnIds, false);
  // }

  getInternalCost(params: GridReadyEvent, type: number) {
    this.gridApi = params.api;
    // if (type === 1) {
    //   this.columnApiBICOne = params.columnApi;
    // } else if (type == 2) {
    this.columnApiBICTwo = params.columnApi;
    // }
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.internalCostList == null ||
      this.internalCostList == undefined ||
      this.internalCostList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();

    // if (type === 1) {
    //   this.adjustWidthBICOne();
    // } else if (type == 2) {
    this.allAdjust();
    // }
  }
  // adjustWidthBICOne() {
  //   const allColumnIds: any = [];
  //   this.columnApiBICOne?.getColumns()?.forEach((column: any) => {
  //     allColumnIds.push(column.getId());
  //   });
  //   this.columnApiBICOne?.autoSizeColumns(allColumnIds, false);
  // }
  // adjustWidthBICTwo() {

  // }
  getPurchaseOrder(params: GridReadyEvent) {
    this.gridApiPO = params.api;
    this.columnApi = params.columnApi;
    this.gridApiPO.refreshCells({ force: true });
    this.gridApiPO.setDomLayout('autoHeight');
    this.gridApiPO.hideOverlay();
    if (
      this.POList == null ||
      this.POList == undefined ||
      this.POList.length <= 0
    )
      this.gridApiPO.showNoRowsOverlay();
    this.gridApiPO.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiPO.hideOverlay();
    this.allAdjust();
  }

  workPackageGridReady(params: GridReadyEvent, type: number) {
    this.gridApiWP = params.api;
    this.gridApiWP.setDomLayout('autoHeight');
    this.gridApi = params.api;
    this.columnApiWPTwo = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.workPackageList == null ||
      this.workPackageList == undefined ||
      this.workPackageList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.allAdjust();
  }
  // adjustWidthWPOne() {
  //   const allColumnIds: any = [];
  //   this.columnApiWPOne?.getColumns()?.forEach((column: any) => {
  //     allColumnIds.push(column.getId());
  //   });
  //   this.columnApiWPOne?.autoSizeColumns(allColumnIds, false);
  // }
  // adjustWidthWPTwo() {

  // }
  getSignOffDetail() {
    if (this.tpId) {
      this.sowjdDhService
        .getSignOffDetailByTPId(this.tpId)
        .subscribe((rfqDetail: any) => {
          if (rfqDetail) {
            this.rfqDetail = rfqDetail.data.technicalProposalDetails[0];
            this.vendorDetail = rfqDetail.data.vendorInfo[0];

            this.companyCurrencyName = this.rfqDetail?.currencyName;
            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            if (this.rfqDetail.sowJdId) {
              this.getSowjdDocuments();
              this.getSkillSet();
            }

            this.getProposalDocuments();
            this.getResurces();

            this.getWorkPackage();
            this.getBoschInternalCostDetails();

            if (
              this.rfqDetail.isDMSignOffRecordOwner &&
              this.rfqDetail.tpStatusID === 8
            ) {
              this.columnDefsWorkPackageBGSVRateCardWP = [
                {
                  headerName: 'Project Name',
                  hide: false,
                  field: 'projectName',
                },
                {
                  headerName: 'Activity Type',
                  hide: false,
                  field: 'activityType',
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillsetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No. of Activity Planned',
                  hide: false,
                  field: 'noofActivityPlanned',
                },
                {
                  headerName: 'Estimation(hrs)/Activity',
                  hide: false,
                  field: 'estimationPerActivity',
                },
                {
                  headerName: 'Total Hours',
                  hide: false,
                  field: 'totalHours',
                },
                {
                  headerName: 'Price/Hr',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Price/Activity',
                  hide: false,
                  field: 'pricePerActivity',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.pricePerActivity,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'totalPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.totalPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Delivery Completed',
                  colId: 'action',
                  cellRenderer: this.renderActionWorkPackage.bind(this),
                  resizable: false,
                },
                {
                  headerName: 'Remark',
                  hide: false,
                  field: 'remark',
                },
              ];
            } else {
              this.columnDefsWorkPackageBGSVRateCardWP = [
                {
                  headerName: 'Project Name',
                  hide: false,
                  field: 'projectName',
                },
                {
                  headerName: 'Activity Type',
                  hide: false,
                  field: 'activityType',
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillsetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No. of Activity Planned',
                  hide: false,
                  field: 'noofActivityPlanned',
                },
                {
                  headerName: 'Estimation(hrs)/Activity',
                  hide: false,
                  field: 'estimationPerActivity',
                },
                {
                  headerName: 'Total Hours',
                  hide: false,
                  field: 'totalHours',
                },
                {
                  headerName: 'Price/Hr',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Price/Activity',
                  hide: false,
                  field: 'pricePerActivity',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.pricePerActivity,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'totalPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.totalPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
              ];
            }

            if (
              (this.rfqDetail.isDMSignOffRecordOwner ||
                this.rfqDetail.isSignOffRecordOwner) &&
              this.rfqDetail.tpStatusID === 8
            ) {
              this.columnDefsResourceRateCardWP = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Resource Onboarding Date',
                  hide: false,
                  field: 'resourceOnboardingDate',
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'Onboarded Resource',
                  hide: false,
                  field: 'resourceOnboardCompleted',
                },
                {
                  headerName: 'Onboarding Completed',
                  colId: 'action',
                  cellRenderer: this.renderActionResource.bind(this),
                  resizable: false,
                },
                {
                  headerName: 'Remark',
                  hide: false,
                  field: 'remark',
                },
              ];
              this.columnDefsResourceTAM = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Quantity',
                  hide: false,
                  field: 'duration',
                },
                {
                  headerName: 'Unit of Measurement',
                  hide: false,
                  field: 'unitOfMeasurement',
                },
                {
                  headerName: 'Total Quantity',
                  hide: false,
                  field: 'totalQuantity',
                },
                {
                  headerName: 'Unit Price',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'price',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.price,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Resource Onboarding Date',
                  hide: false,
                  field: 'resourceOnboardingDate',
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'Onboarded Resource',
                  hide: false,
                  field: 'resourceOnboardCompleted',
                },
                {
                  headerName: 'Onboarding Completed',
                  colId: 'action',
                  cellRenderer: this.renderActionResource.bind(this),
                  resizable: false,
                },
                {
                  headerName: 'Remark',
                  hide: false,
                  field: 'remark',
                },
              ];
            } else {
              this.columnDefsResourceRateCardWP = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Resource Onboarding Date',
                  hide: false,
                  field: 'resourceOnboardingDate',
                  cellRenderer: DateFormatComponent,
                },
              ];
              this.columnDefsResourceTAM = [
                {
                  headerName: 'Skillset',
                  hide: false,
                  field: 'skillSetName',
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  field: 'gradeName',
                },
                {
                  headerName: 'No.of Resource',
                  hide: false,
                  field: 'quantity',
                },
                {
                  headerName: 'Quantity',
                  hide: false,
                  field: 'duration',
                },
                {
                  headerName: 'Unit of Measurement',
                  hide: false,
                  field: 'unitOfMeasurement',
                },
                {
                  headerName: 'Total Quantity',
                  hide: false,
                  field: 'totalQuantity',
                },
                {
                  headerName: 'Unit Price',
                  hide: false,
                  field: 'unitPrice',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.unitPrice,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Total Price',
                  hide: false,
                  field: 'price',
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.price,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Resource Onboarding Date',
                  hide: false,
                  field: 'resourceOnboardingDate',
                  cellRenderer: DateFormatComponent,
                },
              ];
            }
          }
        });
    }
  }

  getSkillSet() {
    this.loaderService.setShowLoading();
    this.sowjdService
      .getSignOffSkillSet(this.rfqDetail.technicalProposalId)
      .subscribe({
        next: (res: any) => {
          this.loaderService.setDisableLoading();
          this.rowDataSkillsetSource = [...res.data];
          const result = res.data.filter((item) => item.quantity > 0);
          this.rowDataSkillset = result;
          this.gridApi.setRowData(this.rowDataSkillset);
          this.adjustWidthSkill();
        },
        error: (e) => {
          console.error(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
  }

  editSignOffDemand() {
    const dialogRef = this.dialog.open(EditSignoffDemandComponent, {
      width: '80vw',
      height: '40vw',
      data: {
        tpId: this.tpId,
        signOffDetail: this.rfqDetail,
        vendorDetail: this.vendorDetail,
        rowDataSkillset: this.rowDataSkillsetSource,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  getSowjdDocuments() {
    this.sowjdDhService
      .getAllDocumentsBySowJdId(this.rfqDetail.sowJdId)
      .subscribe((docList: any) => {
        this.documentsList = docList;
      });
  }

  getProposalDocuments() {
    this.vendorService
      .getProposalDocuments(this.tpId)
      .subscribe((response: any) => {
        this.proposalDocuments = response;
      });
  }

  getResurces() {
    this.sowjdDhService
      .getResourceByTPId(this.tpId)
      .subscribe((response: any) => {
        if (response?.data != null) {
          this.resourceList = response.data.getTPResources;
          this.tpEquivalentResponse = response.data.tpEquivalentResponse;
        }
      });
  }

  getWorkPackage() {
    this.sowjdDhService
      .getWorkPackageByTPId(this.tpId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.workPackageList = response.data.tpWorkPackage;
          this.getTpWorkPackage = response.data.getTpWorkPackage;
        }
      });
  }

  getSignOffComments() {
    this.sowjdService.getSignOffComments(this.tpId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.tpRemarks = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getPODetails() {
    this.sowjdService.getPODetails(this.tpId).subscribe(
      (response: any) => {
        if (response.data != null) {
          this.POList = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
  getBoschInternalCostDetails() {
    this.loaderService.setShowLoading();
    if (
      (this.rfqDetail.sowjdTypeCode === 'RC' ||
        this.rfqDetail.sowjdTypeCode === 'NRC') &&
      (this.rfqDetail.outSourcingCode === 'WP' ||
        this.rfqDetail.outSourcingCode === 'MS')
    ) {
      this.sowjdService.getSignOffWPInternalCostDetails(this.tpId).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();

            const filteredArr = response.data.wptpBoschInternalCost.reduce(
              (acc, current) => {
                const x = acc.find(
                  (item) =>
                    item.skillSetID === current.skillSetID &&
                    item.gradeID === current.gradeID
                );
                if (!x) {
                  const newCurr = {
                    id: current.id,
                    skillSetID: current.skillSetID,
                    gradeID: current.gradeID,
                    skillsetName: current.skillsetName,
                    gradeName: current.gradeName,
                    noofActivityPlanned: current.noofActivityPlanned,
                    estimationActivity: current.estimationActivity,
                    pmo: current.pmo,
                    personalCost: current.personalCost,
                    overheadCost: current.overheadCost,
                    totalprice: current.totalprice,
                  };
                  return acc.concat([newCurr]);
                } else {
                  var obj = {};
                  Object.keys(x).forEach(function (a) {
                    // obj[a] = x[a] + current[a]; // for all object properties
                    obj['id'] = x['id'];
                    obj['skillSetID'] = x['skillSetID'];
                    obj['gradeID'] = x['gradeID'];
                    obj['skillsetName'] = x['skillsetName'];
                    obj['gradeName'] = x['gradeName'];
                    obj['noofActivityPlanned'] =
                      +x['noofActivityPlanned'] +
                      +current['noofActivityPlanned'];
                    obj['estimationActivity'] =
                      +x['estimationActivity'] + +current['estimationActivity'];
                    obj['pmo'] = +x['pmo'] + +current['pmo'];
                    obj['personalCost'] =
                      +x['personalCost'] + +current['personalCost'];
                    obj['overheadCost'] =
                      +x['overheadCost'] + +current['overheadCost'];
                    obj['totalprice'] =
                      +x['totalprice'] + +current['totalprice'];
                  });
                  obj['pmo'] = this.checkDecimal(obj['pmo'], 'two');
                  obj['personalCost'] = this.checkDecimal(
                    obj['personalCost'],
                    'three'
                  );
                  obj['overheadCost'] = this.checkDecimal(
                    obj['overheadCost'],
                    'three'
                  );
                  obj['totalprice'] = this.checkDecimal(
                    obj['totalprice'],
                    'three'
                  );
                  acc.splice(acc.indexOf(x), 1, obj);
                  return acc;
                }
              },
              []
            );
            this.internalCostList = filteredArr;
            // this.internalCostList = response.data.wptpBoschInternalCost;
            this.internalTotalCost = response.data.wptpBoschTotalCosting;
            this.checkOCIIndex();
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    } else {
      // TM - RC/NRC
      this.sowjdService.getSignOffInternalCostDetails(this.tpId).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();

            const filteredArr = response.data.boschInternalTPCost.reduce(
              (acc, current) => {
                const x = acc.find(
                  (item) =>
                    item.skillSetID === current.skillSetID &&
                    item.gradeID === current.gradeID &&
                    item.quantity === current.quantity
                );
                if (!x) {
                  const newCurr = {
                    id: current.id,
                    skillSetID: current.skillSetID,
                    gradeID: current.gradeID,
                    skillsetName: current.skillsetName,
                    gradeName: current.gradeName,
                    noOfResources: current.noOfResources,
                    quantity: current.quantity,
                    pmo: current.pmo,
                    personalCost: current.personalCost,
                    overheadCost: current.overheadCost,
                    totalprice: current.totalprice,
                  };
                  return acc.concat([newCurr]);
                } else {
                  var obj = {};
                  Object.keys(x).forEach(function (a) {
                    // obj[a] = x[a] + current[a]; // for all object properties
                    obj['id'] = x['id'];
                    obj['skillSetID'] = x['skillSetID'];
                    obj['gradeID'] = x['gradeID'];
                    obj['skillsetName'] = x['skillsetName'];
                    obj['gradeName'] = x['gradeName'];
                    obj['noOfResources'] =
                      +x['noOfResources'] + +current['noOfResources'];
                    obj['quantity'] = x['quantity'];
                    obj['pmo'] = +x['pmo'] + +current['pmo'];
                    obj['personalCost'] =
                      +x['personalCost'] + +current['personalCost'];
                    obj['overheadCost'] =
                      +x['overheadCost'] + +current['overheadCost'];
                    obj['totalprice'] =
                      +x['totalprice'] + +current['totalprice'];
                  });
                  obj['pmo'] = this.checkDecimal(obj['pmo'], 'two');
                  obj['personalCost'] = this.checkDecimal(
                    obj['personalCost'],
                    'three'
                  );
                  obj['overheadCost'] = this.checkDecimal(
                    obj['overheadCost'],
                    'three'
                  );
                  obj['totalprice'] = this.checkDecimal(
                    obj['totalprice'],
                    'three'
                  );
                  acc.splice(acc.indexOf(x), 1, obj);
                  return acc;
                }
              },
              []
            );
            this.internalCostList = filteredArr;
            // this.internalCostList = response.data.boschInternalTPCost;
            this.internalTotalCost = response.data.boschTotalCostingTp;
            this.checkOCIIndex();
          }
        },
        (error) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
        }
      );
    }
  }

  checkDecimal(input: number, type: string) {
    if (type === 'two') {
      return input % 1 ? input.toFixed(2) : input;
    } else {
      return input % 1 ? input.toFixed(3) : input;
    }
  }

  checkOCIIndex() {
    let isPersonalCostZero = false;
    this.internalCostList.forEach((element) => {
      if (element.personalCost === 0) {
        if (!isPersonalCostZero) {
          isPersonalCostZero = true;
        }
      }
    });

    if (isPersonalCostZero) {
      this.isOCIIndexExist = false;
      this.errorMessage =
        'Internal cost not available for one or more Skillset.';
    }
  }
  // OwnerSHip
  OpenOwnershipDialog(featureCode: string) {
    const dialogRef = this.dialog.open(OwnershipComponent, {
      width: '50%',
      data: {
        objectId: this.rfqDetail?.technicalProposalId,
        featureCode: featureCode,
      },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getSignOffDetail();
        }
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //Auto-Width Fix -start
  onFirstDataRendered(event: any) {
    this.allAdjust();
  }
  adjustWidth() {}
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.allAdjust();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.allAdjust();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.allAdjust();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.allAdjust();
    }, 500);
  }

  onSortChanged(event: any) {
    this.allAdjust();
  }

  allAdjust() {
    const allColumnIds: any = [];
    this.columnApiVSPTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSPTwo?.autoSizeColumns(allColumnIds, false);

    const allColumnIds1: any = [];
    this.columnApiWPTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds1.push(column.getId());
    });
    this.columnApiWPTwo?.autoSizeColumns(allColumnIds1, false);

    const allColumnIds2: any = [];
    if (this.columnApi) {
      this.columnApi.getColumns().forEach((column: any) => {
        allColumnIds2.push(column.getId());
      });
      this.columnApi.autoSizeColumns(allColumnIds2, false);
    }
    const allColumnIds3: any = [];
    this.columnApiBICTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds3.push(column.getId());
    });
    this.columnApiBICTwo?.autoSizeColumns(allColumnIds3, false);

    // this.adjustWidth();
    // this.adjustWidthBICOne();
    // this.adjustWidthBICTwo();
  }
}
