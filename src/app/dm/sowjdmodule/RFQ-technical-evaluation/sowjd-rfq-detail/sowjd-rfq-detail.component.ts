import { Component, ViewChild, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EvaluaterfqComponent } from '../evaluaterfq/evaluaterfq.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SendbackrfqComponent } from '../sendbackrfq/sendbackrfq.component';
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
  IAggFunc,
  IAggFuncParams,
} from 'ag-grid-community';
import { ExtendlastdateComponent } from '../extendlastdate/extendlastdate.component';
import { WithdrawrfqComponent } from '../withdrawrfq/withdrawrfq.component';
import { InitiatesignoffComponent } from 'src/app/dm/popup/initiatesignoff/initiatesignoff.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { LoaderService } from 'src/app/services/loader.service';
import { Subscription } from 'rxjs';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { OwnershipComponent } from 'src/app/planning/popups/ownership/ownership.component';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-sowjd-rfq-detail',
  templateUrl: './sowjd-rfq-detail.component.html',
  styleUrls: ['./sowjd-rfq-detail.component.scss'],
})
export class SowjdRfqDetailComponent {
  private sub: any;
  rfqQuestionRating: any;
  dateFormat = config.dateFormat;
  sowJdId: string = '';
  rfqId: string;
  rfqDetail: any;
  actionType: string = '';
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
  resourceList: any[] = [];
  workPackageList: any[] = [];
  rfqRemarks = [];
  error_msg: string = '';
  internalCostList = [];
  totalBoschIntrnalCost: any;
  resourceSummary: any;
  workPackageSummary: any;
  permissionDetails: PermissionDetails;
  permissionDetailsSignOff: PermissionDetails;
  isExpanded: boolean = false;
  subscription: Subscription;
  isOCIIndexExist: boolean = true;
  errorMessage: string;
  osmRoleAdmin: boolean = false;
  employeeNumber: any;
  rowDataSkillset = [];
  private gridApiSkillset!: GridApi;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.allTogetherAdjust();
  }
  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private sowjdDhService: SowjdDhService,
    private homeService: HomeService,
    private sowjdService: sowjdService,
    private loaderService: LoaderService,
    private notifyservice: NotifyService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });

    this.subscription = this.sowjdService
      .getUserProfileRoleDetailRFQ()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
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
  public columnDefsSkillsets = [
    {
      headerName: 'SkillSet',
      field: 'skillsetName',
    },
    {
      headerName: 'Grade',
      field: 'gradeName',
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
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
      resizable: false,
    },
  ];

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

  public columnDefsResource = [
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
      field: 'pmo',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
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
  ];
  public columnDefsResourceBGSWRateCardTM = [
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
      field: 'pmo',
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.pmo,
          this.companyLocale,
          this.companyNumericFormat
        ),
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
      field: 'estimationActivity',
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
  autoGroupColumnDef: ColDef = { minWidth: 180 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
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
  columnApiSkillset: any;
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
  private gridApiWP!: GridApi;

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.rfqId = params['rfqId'];
      if (this.rfqId) {
        this.getRFQDetail();
        this.getRFQQuestionsRating();
        this.getRFQComments();
      }
    });
  }

  onGridReadySkillset(params: GridReadyEvent) {
    this.gridApiSkillset = params.api;
    this.gridApiSkillset.setDomLayout('autoHeight');

    this.columnApiSkillset = params.columnApi;

    this.gridApiSkillset.refreshCells({ force: true });
    this.gridApiSkillset.hideOverlay();
    if (
      this.rowDataSkillset == null ||
      this.rowDataSkillset == undefined ||
      this.rowDataSkillset.length <= 0
    )
      this.gridApiSkillset.showNoRowsOverlay();
    this.gridApiSkillset.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiSkillset.hideOverlay();

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
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    if (type === 1) {
      this.columnApiVSPOne = params.columnApi;
    } else if (type == 2) {
      this.columnApiVSPTwo = params.columnApi;
    } else if (type == 3) {
      this.columnApiVSPThree = params.columnApi;
    } else if (type == 4) {
      this.columnApiVSPFour = params.columnApi;
    }

    this.gridApi.refreshCells({ force: true });
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
    if (type === 1) {
      this.adjustWidthVSPOne();
    } else if (type == 2) {
      this.adjustWidthVSPTwo();
    } else if (type == 3) {
      this.adjustWidthVSPThree();
    } else if (type == 4) {
      this.adjustWidthVSPFour();
    }
    //Auto-Width Fix -end
  }
  adjustWidthVSPOne() {
    const allColumnIds: any = [];
    this.columnApiVSPOne?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSPOne?.autoSizeColumns(allColumnIds, false);
  }
  adjustWidthVSPTwo() {
    const allColumnIds: any = [];
    this.columnApiVSPTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSPTwo?.autoSizeColumns(allColumnIds, false);
  }
  adjustWidthVSPThree() {
    const allColumnIds: any = [];
    this.columnApiVSPThree?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSPThree?.autoSizeColumns(allColumnIds, false);
  }
  adjustWidthVSPFour() {
    const allColumnIds: any = [];
    this.columnApiVSPFour?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSPFour?.autoSizeColumns(allColumnIds, false);
  }
  getInternalCost(params: GridReadyEvent, type: number) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    if (type === 1) {
      this.columnApiBICOne = params.columnApi;
    } else if (type == 2) {
      this.columnApiBICTwo = params.columnApi;
    }
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
    if (type === 1) {
      this.adjustWidthBICOne();
    } else if (type == 2) {
      this.adjustWidthBICTwo();
    }
    //Auto-Width Fix -end
  }

  adjustWidthBICOne() {
    const allColumnIds: any = [];
    this.columnApiBICOne?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiBICOne?.autoSizeColumns(allColumnIds, false);
  }
  adjustWidthBICTwo() {
    const allColumnIds: any = [];
    this.columnApiBICTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiBICTwo?.autoSizeColumns(allColumnIds, false);
  }

  workPackageGridReady(params: GridReadyEvent, type: number) {
    this.gridApiWP = params.api;
    this.gridApiWP.setDomLayout('autoHeight');
    //Auto-Width Fix -start - this function need to be added in every OngridReady function
    this.gridApi = params.api;
    if (type === 1) {
      this.columnApiWPOne = params.columnApi;
    } else if (type == 2) {
      this.columnApiWPTwo = params.columnApi;
    }
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
    if (type === 1) {
      this.adjustWidthWPOne();
    } else if (type == 2) {
      this.adjustWidthWPTwo();
    }
    //Auto-Width Fix -end
  }
  adjustWidthWPOne() {
    const allColumnIds: any = [];
    this.columnApiWPOne?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiWPOne?.autoSizeColumns(allColumnIds, false);
  }
  adjustWidthWPTwo() {
    const allColumnIds: any = [];
    this.columnApiWPTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiWPTwo?.autoSizeColumns(allColumnIds, false);
  }
  getRFQDetail() {
    this.loaderService.setShowLoading();
    if (this.rfqId) {
      this.sowjdDhService
        .getRFQDetailByRfqId(this.rfqId)
        .subscribe((rfqDetail: any) => {
          if (rfqDetail) {
            this.loaderService.setDisableLoading();
            this.rfqDetail = rfqDetail.data.getRFQPODetailsByRfqId[0];
            this.vendorDetail = rfqDetail.data.vendorDetailsByRfqId[0];

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
          }
        });
    }
  }

  getSkillSet() {
    this.loaderService.setShowLoading();
    this.sowjdService.getSkillSet(this.rfqDetail.sowJdId).subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.rowDataSkillset = res.data;
        this.gridApiSkillset.setRowData(this.rowDataSkillset);
        this.adjustWidthSkill();
      },
      error: (e) => {
        console.error(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {},
    });
  }

  getSowjdDocuments() {
    this.loaderService.setShowLoading();
    this.sowjdDhService
      .getAllDocumentsBySowJdId(this.rfqDetail.sowJdId)
      .subscribe((docList: any) => {
        this.loaderService.setDisableLoading();
        this.documentsList = docList;
      });
  }

  getProposalDocuments() {
    this.loaderService.setShowLoading();
    this.sowjdDhService
      .getProposalDocuments(this.rfqId)
      .subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        this.proposalDocuments = response;
      });
  }

  getResurces() {
    this.loaderService.setShowLoading();
    this.sowjdDhService.getResource(this.rfqId).subscribe((response: any) => {
      if (response?.data != null) {
        this.loaderService.setDisableLoading();
        this.resourceList = response.data.resourceResponses;
        this.resourceSummary = response.data.equivalentResponses;
      }
    });
  }

  getWorkPackage() {
    this.loaderService.setShowLoading();
    this.sowjdDhService
      .getWorkPackage(this.rfqId)
      .subscribe((response: any) => {
        if (response.data != null) {
          this.loaderService.setDisableLoading();
          this.workPackageList = response.data.workPackage;
          this.workPackageSummary = response.data.getWorkPackage;
        }
      });
  }

  getRFQQuestionsRating() {
    this.loaderService.setShowLoading();
    this.sowjdService.getRFQQuestionsRatingDetails(this.rfqId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.rfqQuestionRating = response.data;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getRFQComments() {
    this.loaderService.setShowLoading();
    this.sowjdService.getRFQRemarks(this.rfqId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.loaderService.setDisableLoading();
          this.rfqRemarks = response.data;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getBoschInternalCostDetails() {
    this.loaderService.setShowLoading();
    if (
      (this.rfqDetail?.sowjdTypeCode === 'RC' ||
        this.rfqDetail?.sowjdTypeCode === 'NRC') &&
      (this.rfqDetail?.outSourcingCode === 'WP' ||
        this.rfqDetail?.outSourcingCode === 'MS')
    ) {
      this.sowjdService.getWPInternalCostDetails(this.rfqId).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();

            const filteredArr = response.data.wpBoschInternalCost.reduce(
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
            // this.internalCostList = response.data.wpBoschInternalCost;
            this.totalBoschIntrnalCost = response.data.wpBoschTotalCosting;
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
      this.sowjdService.getInternalCostDetails(this.rfqId).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            this.loaderService.setDisableLoading();

            const filteredArr = response.data.boschInternalCost.reduce(
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
                    obj['quantity'] = +x['quantity'] + +current['quantity'];
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
            // this.internalCostList = response.data.boschInternalCost
            this.totalBoschIntrnalCost = response.data.boschTotalCosting;
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
      if (element.personalCost === 0 || element.personalCost === '0.000') {
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
  sendBackRfq() {
    let dialogRef = this.dialog.open(SendbackrfqComponent, {
      width: '40vw',
      data: {
        rfqId: this.rfqId,
        endDate: this.rfqDetail.rfqEndDate,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  evaluateRfq() {
    let dialogRef = this.dialog.open(EvaluaterfqComponent, {
      width: '65vw',
      data: {
        message: 'Do you really want to Submit ?',
        rfqId: this.rfqId,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  withdrawRFQ() {
    let dialogRef = this.dialog.open(WithdrawrfqComponent, {
      width: '40vw',
      data: {
        rfqId: this.rfqId,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  extendLastDate() {
    let dialogRef = this.dialog.open(ExtendlastdateComponent, {
      width: '40vw',
      data: {
        rfqId: this.rfqId,
        endDate: this.rfqDetail.rfqEndDate,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  initiateSignOff() {
    this.sowJdId = localStorage.getItem('sowjdId');
    const dialogRef = this.dialog.open(InitiatesignoffComponent, {
      width: '80vw',
      height: 'auto',
      data: {
        sowJdId: this.sowJdId,
        rfqId: this.rfqId,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {});
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  //Auto-Width Fix -start
  onFirstDataRendered(event: any) {
    this.allTogetherAdjust();
  }
  // adjustWidth() {
  //   const allColumnIds: any = [];
  //   this.columnApi?.getColumns()?.forEach((column: any) => {
  //     allColumnIds.push(column.getId());
  //   });

  //   this.columnApi?.autoSizeColumns(allColumnIds, false);
  // }
  // OwnerSHip
  OpenOwnershipDialog(featureCode: string) {
    const dialogRef = this.dialog.open(OwnershipComponent, {
      width: '50%',
      data: { objectId: this.rfqDetail?.rfqId, featureCode: featureCode },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getRFQDetail();
        }
      }
    );
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.allTogetherAdjust();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.allTogetherAdjust();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.allTogetherAdjust();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.allTogetherAdjust();
    }, 500);
  }

  onSortChanged(event: any) {
    this.allTogetherAdjust();
  }
  //Auto-Width Fix -End
  allTogetherAdjust() {
    this.adjustWidthVSPOne();
    this.adjustWidthVSPTwo();
    this.adjustWidthVSPThree();
    this.adjustWidthVSPFour();
    this.adjustWidthBICOne();
    this.adjustWidthBICTwo();
    this.adjustWidthWPOne();
    this.adjustWidthWPTwo();
  }
}
