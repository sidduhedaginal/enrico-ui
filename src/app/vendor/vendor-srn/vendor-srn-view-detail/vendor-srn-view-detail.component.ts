import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { SrnService } from 'src/app/services/srn.service';

import { config } from '../../../config';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IAggFunc,
  IAggFuncParams,
} from 'ag-grid-community';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { Grid } from '@ag-grid-community/all-modules';

@Component({
  selector: 'app-vendor-srn-view-detail',
  templateUrl: './vendor-srn-view-detail.component.html',
  styleUrls: ['./vendor-srn-view-detail.component.scss'],
})
export class VendorSRNViewDetailComponent {
  dateFormat = config.dateFormat;
  skillsetData: any;

  documentsList: any;
  url: string;
  loader: boolean;
  srnId: any;
  private sub: any;
  srnData;
  totalEffortPmo: any = '0';
  rateCardValue: any = '0';
  srnRemarks: any = [];
  SRNTypeSelected: number;
  srnValue: any = '';
  poBalance: any = '';
  resourceTotalEffortPMO: boolean = false;
  workPackageTotalEffortPMO: boolean = false;
  showTotalEffortHours: boolean = false;
  showTotalEffortPMO: boolean = false;
  showWorkpackageCost: boolean = false;
  showODCCost: boolean = false;
  showRateCardValue: boolean = false;
  showResourceEffort: boolean = true;
  srnWorkPackageList: any = [];
  odcList: any = [];
  srnGetResourceList: any = [];
  permissionDetails: PermissionDetails;
  showWorkPackegeDetails: boolean = false;
  showOdcDetails: boolean = false;
  subscription: Subscription;
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
  columnApiODC: any;
  columnApiPO: any;
  columnApiRD: any;
  columnApiWP: any;
  private gridApiODC!: GridApi;
  private gridApiPO!: GridApi;
  private gridApiRD!: GridApi;
  private gridApiWP!: GridApi;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private srnservice: SrnService,
    private loaderService: LoaderService
  ) {
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }

  public purchageOrdercolumnDefs = [
    {
      headerName: 'Line Item',
      hide: false,
      editable: false,
      field: 'lineitem',
      resizable: false,
    },
    {
      headerName: 'Description',
      hide: false,
      editable: false,
      field: 'materialDescription',
      resizable: true,
    },
    {
      headerName: 'Unit of Measurement',
      hide: false,
      editable: false,
      field: 'uom',
      resizable: false,
    },
    {
      headerName: 'Billing Quantity',
      hide: false,
      editable: false,
      field: 'billingQuantity',
      resizable: false,
    },
    {
      headerName: 'Unit Price',
      hide: false,
      editable: false,
      field: 'unitPrice',
      resizable: false,
    },
    {
      headerName: 'Net Price',
      hide: false,
      editable: false,
      field: 'netPrice',
      resizable: false,
    },
    {
      headerName: 'Open Order Quantity',
      hide: false,
      editable: false,
      field: 'openOrderQuantity',
      resizable: false,
    },
    {
      headerName: 'SRN Value',
      hide: false,
      editable: false,
      field: 'srnValue',
      resizable: false,
    },
    {
      headerName: 'Open Order Value',
      hide: false,
      editable: false,
      field: 'poLineItemBalance',
      resizable: false,
    },
  ];

  public resourceDetailscolumnDefs = [
    {
      headerName: 'Employee Number',
      hide: false,
      editable: false,
      field: 'employeeNumber',
      resizable: true,
    },
    {
      headerName: 'Name',
      hide: false,
      editable: false,
      field: 'fullname',
      resizable: true,
    },
    {
      headerName: 'NT ID',
      hide: false,
      editable: false,
      field: 'ntid',
      resizable: true,
    },
    {
      headerName: 'Skillset',
      hide: false,
      editable: false,
      field: 'skillsetName',
      resizable: true,
    },
    {
      headerName: 'Grade',
      hide: false,
      editable: false,
      field: 'gradeName',
      resizable: true,
    },
    {
      headerName: 'PO Line Item',
      hide: false,
      editable: false,
      field: 'poLineItem',
      resizable: true,
    },
    {
      headerName: 'Date of Joining',
      hide: false,
      editable: false,
      field: 'dateOfJoining',
      resizable: true,
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Contract End Date',
      hide: false,
      editable: false,
      field: 'contractEndDate',
      resizable: true,
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Absent Days',
      hide: false,
      editable: false,
      field: 'absentDays',
    },
    {
      headerName: 'Over Time (in days)',
      hide: false,
      editable: false,
      field: 'overTime',
    },
    {
      headerName: 'Working Hours',
      hide: false,
      editable: false,
      field: 'workingHours',
    },
    {
      headerName: 'Working Days',
      hide: false,
      editable: false,
      field: 'workingDays',
      resizable: true,
    },
    {
      headerName: 'Effort PMO',
      hide: false,
      editable: false,
      field: 'effortPMO',
      resizable: true,
    },
    {
      headerName: 'Cost',
      hide: false,
      editable: false,
      field: 'cost',
      resizable: true,
    },
    {
      headerName: 'Price',
      hide: false,
      editable: false,
      field: 'price',
      resizable: true,
    },
  ];

  public workingPackegecolumnDefs = [
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
      headerName: 'No. of Activity Delivered',
      hide: false,
      field: 'noofActivityDelivered',
    },
    {
      headerName: 'Delivered Effort (hrs)',
      hide: false,
      field: 'deliveredEfforthrs',
    },
    {
      headerName: 'PMO',
      hide: false,
      field: 'prm',
    },
    {
      headerName: 'Cost',
      hide: false,
      field: 'cost',
    },
    {
      headerName: 'Price',
      hide: false,
      field: 'price',
    },
  ];

  public odcDetailscolumnDefs = [
    {
      headerName: 'ODC',
      hide: false,
      field: 'odcCode',
    },
    {
      headerName: 'ODC Name',
      hide: false,
      field: 'odcName',
    },
    {
      headerName: 'ODC Head Count',
      hide: false,
      field: 'odC_HeadCount',
    },
    {
      headerName: 'ODC Cost / Head Count',
      hide: false,
      field: 'odC_Cost',
    },
    {
      headerName: 'Total Cost',
      hide: false,
      field: 'total_Cost',
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      field: '',
      suppressMenu: true,
    },
  ];
  public aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    totalPrice: (params: IAggFuncParams) => {
      this.rateCardValue = 0;
      params.values.forEach((value: number) => (this.rateCardValue += value));
      return this.rateCardValue;
    },
  };

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.srnId = params['srnId'];
      if (this.srnId) {
        this.getSRNDetailThroughSrnId(this.srnId);
        this.getSRNComments(this.srnId);
      }
    });
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }

  myPurchageOrder(params: GridReadyEvent) {
    this.gridApiPO = params.api;
    this.gridApiPO.setDomLayout('autoHeight');

    this.columnApiPO = params.columnApi;
    this.gridApiPO.refreshCells({ force: true });
    this.gridApiPO.hideOverlay();
    this.gridApiPO.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiPO.hideOverlay();
    this.adjustWidth();
  }

  odcDetails(params: GridReadyEvent) {
    this.gridApiODC = params.api;
    this.gridApiODC.setDomLayout('autoHeight');

    this.columnApiODC = params.columnApi;
    this.gridApiODC.refreshCells({ force: true });
    this.gridApiODC.hideOverlay();
    this.gridApiODC.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiODC.hideOverlay();
    this.adjustWidth();
  }

  myResourceDetails(params: GridReadyEvent) {
    this.gridApiRD = params.api;
    this.gridApiRD.setDomLayout('autoHeight');

    this.columnApiRD = params.columnApi;
    this.gridApiRD.refreshCells({ force: true });
    this.gridApiRD.hideOverlay();
    this.gridApiRD.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiRD.hideOverlay();
    this.adjustWidth();
  }

  workPackageDetails(params: GridReadyEvent) {
    this.gridApiWP = params.api;
    this.gridApiWP.setDomLayout('autoHeight');

    this.columnApiWP = params.columnApi;
    this.gridApiWP.refreshCells({ force: true });
    this.gridApiWP.hideOverlay();
    this.gridApiWP.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiWP.hideOverlay();
    this.adjustWidth();
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
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
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApiODC?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiODC?.autoSizeColumns(allColumnIds, false);
    //
    const allColumnIds1: any = [];
    this.columnApiPO?.getColumns()?.forEach((column: any) => {
      allColumnIds1.push(column.getId());
    });
    this.columnApiPO?.autoSizeColumns(allColumnIds1, false);
    //
    const allColumnIds2: any = [];
    this.columnApiRD?.getColumns()?.forEach((column: any) => {
      allColumnIds2.push(column.getId());
    });
    this.columnApiRD?.autoSizeColumns(allColumnIds2, false);
    //
    const allColumnIds3: any = [];
    this.columnApiWP?.getColumns()?.forEach((column: any) => {
      allColumnIds3.push(column.getId());
    });
    this.columnApiWP?.autoSizeColumns(allColumnIds3, false);
  }

  getSRNDetailThroughSrnId(srnId: any) {
    this.loaderService.setShowLoading();
    this.srnservice.getSRNDetailBySrnId(srnId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.srnData = response.data;
          this.loaderService.setDisableLoading();
          this.SRNTypeSelected = this.srnData.srnDetails.srnTypeID;
          this.srnWorkPackageList = this.srnData.srnWorkPackages;
          this.odcList = response.data.odcNames;
          this.documentsList = this.srnData.srnDocuments;

          this.srnGetResourceList =
            response.data.srnResourceDetailsBySrnIds.filter(
              (empNum) => empNum.employeeNumber !== null
            );

          if (this.srnData.srnSowjdDetails.outSourcingCode == 'TAM') {
            this.resourceTotalEffortPMO = true;
            if (this.srnData.srnSowjdDetails.sowjdTypeCode === 'NRC') {
              this.purchageOrdercolumnDefs = [
                {
                  headerName: 'Line Item',
                  hide: false,
                  editable: false,
                  field: 'lineitem',
                  resizable: false,
                },
                {
                  headerName: 'Description',
                  hide: false,
                  editable: false,
                  field: 'materialDescription',
                  resizable: true,
                },
                {
                  headerName: 'Unit of Measurement',
                  hide: false,
                  editable: false,
                  field: 'uom',
                  resizable: false,
                },
                {
                  headerName: 'Billing Quantity',
                  hide: false,
                  editable: false,
                  field: 'billingQuantity',
                  resizable: false,
                },
                {
                  headerName: 'Unit Price',
                  hide: false,
                  editable: false,
                  field: 'unitPrice',
                  resizable: false,
                },
                {
                  headerName: 'Net Price',
                  hide: false,
                  editable: false,
                  field: 'netPrice',
                  resizable: false,
                },
                {
                  headerName: 'Open Order Quantity',
                  hide: false,
                  editable: false,
                  field: 'openOrderQuantity',
                  resizable: false,
                },
                {
                  headerName: 'Open Order Value',
                  hide: false,
                  editable: false,
                  field: 'poLineItemBalance',
                  resizable: false,
                },
              ];
              this.showWorkPackegeDetails = false;
              this.showOdcDetails = false;

              if (this.SRNTypeSelected === 1 || this.SRNTypeSelected === 2) {
                if (
                  this.srnData.srnBillingPeriod.statusId === 1 ||
                  this.srnData.srnBillingPeriod.statusId === 5 ||
                  this.srnData.srnBillingPeriod.statusId === 2
                ) {
                  this.purchageOrdercolumnDefs = [
                    {
                      headerName: 'Line Item',
                      hide: false,
                      editable: false,
                      field: 'lineitem',
                      resizable: false,
                    },
                    {
                      headerName: 'Description',
                      hide: false,
                      editable: false,
                      field: 'materialDescription',
                      resizable: true,
                    },
                    {
                      headerName: 'Unit of Measurement',
                      hide: false,
                      editable: false,
                      field: 'uom',
                      resizable: false,
                    },
                    {
                      headerName: 'Billing Quantity',
                      hide: false,
                      editable: false,
                      field: 'billingQuantity',
                      resizable: false,
                    },
                    {
                      headerName: 'Unit Price',
                      hide: false,
                      editable: false,
                      field: 'unitPrice',
                      resizable: false,
                    },
                    {
                      headerName: 'Net Price',
                      hide: false,
                      editable: false,
                      field: 'netPrice',
                      resizable: false,
                    },
                    {
                      headerName: 'Open Order Quantity',
                      hide: false,
                      editable: false,
                      field: 'openOrderQuantity',
                      resizable: false,
                    },
                    {
                      headerName: 'Order Order Value',
                      hide: false,
                      editable: false,
                      field: 'poLineItemBalance',
                      resizable: false,
                    },
                  ];
                  this.resourceDetailscolumnDefs = [
                    {
                      headerName: 'Employee Number',
                      hide: false,
                      editable: false,
                      field: 'employeeNumber',
                      resizable: true,
                    },
                    {
                      headerName: 'Name',
                      hide: false,
                      editable: false,
                      field: 'fullname',
                      resizable: true,
                    },
                    {
                      headerName: 'NT ID',
                      hide: false,
                      editable: false,
                      field: 'ntid',
                      resizable: true,
                    },
                    {
                      headerName: 'Skillset',
                      hide: false,
                      editable: false,
                      field: 'skillsetName',
                      resizable: true,
                    },
                    {
                      headerName: 'Grade',
                      hide: false,
                      editable: false,
                      field: 'gradeName',
                      resizable: true,
                    },
                    {
                      headerName: 'PO Line Item',
                      hide: false,
                      editable: false,
                      field: 'poLineItem',
                      resizable: true,
                    },
                    {
                      headerName: 'Date of Joining',
                      hide: false,
                      editable: false,
                      field: 'dateOfJoining',
                      resizable: true,
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Contract End Date',
                      hide: false,
                      editable: false,
                      field: 'contractEndDate',
                      resizable: true,
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Absent Days',
                      hide: false,
                      editable: false,
                      field: 'absentDays',
                    },
                    {
                      headerName: 'Over Time (in days)',
                      hide: false,
                      editable: false,
                      field: 'overTime',
                    },
                    {
                      headerName: 'Working Days',
                      hide: false,
                      editable: false,
                      field: 'workingDays',
                      resizable: true,
                    },
                    {
                      headerName: 'Effort PMO',
                      hide: false,
                      editable: false,
                      field: 'effortPMO',
                      resizable: true,
                    },
                  ];
                }
              }
              if (this.SRNTypeSelected === 3) {
                if (
                  this.srnData.srnBillingPeriod.statusId === 1 ||
                  this.srnData.srnBillingPeriod.statusId === 5
                ) {
                  this.resourceDetailscolumnDefs = [
                    {
                      headerName: 'Employee Number',
                      hide: false,
                      editable: false,
                      field: 'employeeNumber',
                      resizable: true,
                    },
                    {
                      headerName: 'Name',
                      hide: false,
                      editable: false,
                      field: 'fullname',
                      resizable: true,
                    },
                    {
                      headerName: 'NT ID',
                      hide: false,
                      editable: false,
                      field: 'ntid',
                      resizable: true,
                    },
                    {
                      headerName: 'Skillset',
                      hide: false,
                      editable: false,
                      field: 'skillsetName',
                      resizable: true,
                    },
                    {
                      headerName: 'Grade',
                      hide: false,
                      editable: false,
                      field: 'gradeName',
                      resizable: true,
                    },
                    {
                      headerName: 'PO Line Item',
                      hide: false,
                      editable: false,
                      field: 'poLineItem',
                      resizable: true,
                    },
                    {
                      headerName: 'Date of Joining',
                      hide: false,
                      editable: false,
                      field: 'dateOfJoining',
                      resizable: true,
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Contract End Date',
                      hide: false,
                      editable: false,
                      field: 'contractEndDate',
                      resizable: true,
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Working Hours',
                      hide: false,
                      editable: false,
                      field: 'workingHours',
                    },
                    {
                      headerName: 'Effort PMO',
                      hide: false,
                      editable: false,
                      field: 'effortPMO',
                      resizable: true,
                    },
                  ];
                }
              }
              this.showTotalEffortHours = false;
              this.showTotalEffortPMO = true;
              this.showWorkpackageCost = false;
              this.showODCCost = false;
              this.showRateCardValue = false;
            } else if (this.srnData.srnSowjdDetails.sowjdTypeCode == 'RC') {
              if (this.SRNTypeSelected === 1) {
                if (
                  this.srnData.srnBillingPeriod.statusId === 1 ||
                  this.srnData.srnBillingPeriod.statusId === 5 ||
                  this.srnData.srnBillingPeriod.statusId === 2
                ) {
                  this.purchageOrdercolumnDefs = [
                    {
                      headerName: 'Line Item',
                      hide: false,
                      editable: false,
                      field: 'lineitem',
                      resizable: false,
                    },
                    {
                      headerName: 'Description',
                      hide: false,
                      editable: false,
                      field: 'materialDescription',
                      resizable: true,
                    },
                    {
                      headerName: 'Unit of Measurement',
                      hide: false,
                      editable: false,
                      field: 'uom',
                      resizable: false,
                    },
                    {
                      headerName: 'Order Value',
                      hide: false,
                      editable: false,
                      field: 'unitPrice',
                      resizable: false,
                    },
                    {
                      headerName: 'SRN Value',
                      hide: false,
                      editable: false,
                      field: 'srnValue',
                      resizable: false,
                    },
                    {
                      headerName: 'Open Order Value',
                      hide: false,
                      editable: false,
                      field: 'poLineItemBalance',
                      resizable: false,
                    },
                  ];
                  this.showWorkPackegeDetails = false;
                  this.showOdcDetails = false;
                  this.resourceDetailscolumnDefs = [
                    {
                      headerName: 'Employee Number',
                      hide: false,
                      editable: false,
                      field: 'employeeNumber',
                      resizable: true,
                    },
                    {
                      headerName: 'Name',
                      hide: false,
                      editable: false,
                      field: 'fullname',
                      resizable: true,
                    },
                    {
                      headerName: 'NT ID',
                      hide: false,
                      editable: false,
                      field: 'ntid',
                      resizable: true,
                    },
                    {
                      headerName: 'Skillset',
                      hide: false,
                      editable: false,
                      field: 'skillsetName',
                      resizable: true,
                    },
                    {
                      headerName: 'Grade',
                      hide: false,
                      editable: false,
                      field: 'gradeName',
                      resizable: true,
                    },
                    {
                      headerName: 'PO Line Item',
                      hide: false,
                      editable: false,
                      field: 'poLineItem',
                      resizable: true,
                    },
                    {
                      headerName: 'Date of Joining',
                      hide: false,
                      editable: false,
                      field: 'dateOfJoining',
                      resizable: true,
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Contract End Date',
                      hide: false,
                      editable: false,
                      field: 'contractEndDate',
                      resizable: true,
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Absent Days',
                      hide: false,
                      editable: false,
                      field: 'absentDays',
                    },
                    {
                      headerName: 'Working Hours',
                      hide: true,
                      editable: false,
                      field: 'workingHours',
                    },
                    {
                      headerName: 'Working Days',
                      hide: false,
                      editable: false,
                      field: 'workingDays',
                      resizable: true,
                    },
                    {
                      headerName: 'Effort PMO',
                      hide: false,
                      editable: false,
                      field: 'effortPMO',
                      resizable: true,
                    },
                    {
                      headerName: 'Cost',
                      hide: false,
                      editable: false,
                      field: 'cost',
                      resizable: true,
                    },
                    {
                      headerName: 'Price',
                      hide: false,
                      editable: false,
                      field: 'price',
                      resizable: true,
                    },
                  ];
                }
              }
              this.showTotalEffortHours = false;
              this.showTotalEffortPMO = true;
              this.showWorkpackageCost = false;
              this.showODCCost = false;
              this.showRateCardValue = true;
            }
          } else if (
            this.srnData.srnSowjdDetails.outSourcingCode === 'WP' ||
            this.srnData.srnSowjdDetails.outSourcingCode === 'MS'
          ) {
            this.workPackageTotalEffortPMO = true;

            if (
              this.srnData.srnSowjdDetails.sowjdTypeCode === 'RC' ||
              this.srnData.srnSowjdDetails.sowjdTypeCode === 'NRC'
            ) {
              this.showTotalEffortHours = true;
              this.showWorkPackegeDetails = true;
              this.showOdcDetails = true;

              this.showTotalEffortPMO = true;
              this.showTotalEffortHours = true;
              this.showWorkpackageCost = true;
              this.showODCCost = true;
              this.showRateCardValue = true;
              this.purchageOrdercolumnDefs = [
                {
                  headerName: 'Line Item',
                  hide: false,
                  editable: false,
                  field: 'lineitem',
                  resizable: false,
                },
                {
                  headerName: 'Description',
                  hide: false,
                  editable: false,
                  field: 'materialDescription',
                  resizable: true,
                },
                {
                  headerName: 'Unit of Measurement',
                  hide: false,
                  editable: false,
                  field: 'uom',
                  resizable: false,
                },
                {
                  headerName: 'Order Value',
                  hide: false,
                  editable: false,
                  field: 'unitPrice',
                  resizable: false,
                },
                {
                  headerName: 'SRN Value',
                  hide: false,
                  editable: false,
                  field: 'netPrice',
                  resizable: false,
                },
                {
                  headerName: 'Open Order Value',
                  hide: false,
                  editable: false,
                  field: 'poLineItemBalance',
                  resizable: false,
                },
              ];

              this.resourceDetailscolumnDefs = [
                {
                  headerName: 'Employee Number',
                  hide: false,
                  editable: false,
                  field: 'employeeNumber',
                  resizable: true,
                },
                {
                  headerName: 'Name',
                  hide: false,
                  editable: false,
                  field: 'fullname',
                  resizable: true,
                },
                {
                  headerName: 'NT ID',
                  hide: false,
                  editable: false,
                  field: 'ntid',
                  resizable: true,
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  editable: false,
                  field: 'skillsetName',
                  resizable: true,
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  editable: false,
                  field: 'gradeName',
                  resizable: true,
                },
                {
                  headerName: 'PO Line Item',
                  hide: false,
                  editable: false,
                  field: 'poLineItem',
                  resizable: true,
                },
                {
                  headerName: 'Date of Joining',
                  hide: false,
                  editable: false,
                  field: 'dateOfJoining',
                  resizable: true,
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'Contract End Date',
                  hide: false,
                  editable: false,
                  field: 'contractEndDate',
                  resizable: true,
                  cellRenderer: DateFormatComponent,
                },
              ];

              if (this.SRNTypeSelected === 1) {
                if (
                  this.srnData.srnBillingPeriod.statusId === 1 ||
                  this.srnData.srnBillingPeriod.statusId === 5 ||
                  this.srnData.srnBillingPeriod.statusId === 2
                ) {
                  this.workingPackegecolumnDefs = [
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
                      headerName: 'No. of Activity Delivered',
                      hide: false,
                      field: 'noofActivityDelivered',
                    },
                    {
                      headerName: 'Delivered Effort (hrs)',
                      hide: false,
                      field: 'deliveredEfforthrs',
                    },
                    {
                      headerName: 'PMO',
                      hide: false,
                      field: 'pmo',
                    },
                    {
                      headerName: 'Cost',
                      hide: false,
                      field: 'cost',
                    },
                    {
                      headerName: 'Price',
                      hide: false,
                      field: 'price',
                    },
                  ];

                  this.odcDetailscolumnDefs = [
                    {
                      headerName: 'ODC',
                      hide: false,
                      field: 'odcCode',
                    },
                    {
                      headerName: 'ODC Name',
                      hide: false,
                      field: 'odcName',
                    },
                    {
                      headerName: 'ODC Head Count',
                      hide: false,
                      field: 'odC_HeadCount',
                    },
                    {
                      headerName: 'ODC Cost / Head Count',
                      hide: false,
                      field: 'odC_Cost',
                    },
                    {
                      headerName: 'Total Cost',
                      hide: false,
                      field: 'total_Cost',
                    },
                  ];
                }
              }
            }
          }
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  getSRNComments(srnId: any) {
    this.srnservice.getSRNCommentsData(srnId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.srnRemarks = response.data;
        }
      },
      (error) => {}
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
