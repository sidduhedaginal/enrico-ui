import { Component, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from 'src/app/services/home.service';
import { SrnService } from 'src/app/services/srn.service';
import { config } from '../../../config';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  IAggFunc,
  IAggFuncParams,
} from 'ag-grid-community';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { UpdateInvoiceComponent } from './update-invoice/update-invoice.component';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { InputComponent } from '../create-srn/input/input.component';
import { RfqRemarksComponent } from '../../vendor-rfq/rfq-remarks/rfq-remarks.component';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { DeleteOdcComponent } from '../create-srn/delete-odc/delete-odc.component';
import { DeleteComponent } from '../../delete/delete.component';
import { AddOdcComponent } from '../create-srn/add-odc/add-odc.component';
import { LoaderService } from 'src/app/services/loader.service';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { SRNApprovalProcessInfoComponent } from 'src/app/common/srn-approval-process-info/srn-approval-process-info.component';
import { WithdrawSrnComponent } from 'src/app/dm/sowjd-srn/withdraw-srn/withdraw-srn.component';
import { Observable, ReplaySubject } from 'rxjs';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';
@Component({
  selector: 'app-vendor-srn-detail',
  templateUrl: './vendor-srn-detail.component.html',
  styleUrls: ['./vendor-srn-detail.component.scss'],
})
export class VendorSrnDetailComponent {
  dateFormat = config.dateFormat;
  bgswNonRateCardWP: boolean = false;
  skillsetData: any;
  private gridApi!: GridApi;
  public gridApiLineItem!: GridApi;
  private gridApiODC!: GridApi;
  documentsList: any;
  url: string;
  loader: boolean;
  srnId: any;
  private sub: any;
  srnData;
  base64Output!: string;
  myFiles: any = [];
  totalEffortPmo: number = 0;
  rateCardValue: number = 0;
  srnValue: number = 0;
  poBalance: number = 0;
  totalWorkingDays: number = 0;
  srnRemarks: any = [];
  srnGetResourceList: any = [];
  srnWorkPackageList: any = [];
  srnLineItemsList: any = [];
  odcList = [];
  File: any = [];
  EventFile: any;

  isTAMCostExistsValid: boolean = false;
  isAbsentDaysExistValid: boolean = false;
  isWorkingHoursExistValid: boolean = false;
  isActivityDeliveredExistValid: boolean = false;
  isValidAbsentDays: boolean = true;
  isValidRegExAbsentDays: boolean = true;
  isValidWorkingHours: boolean = true;
  tamAbsentDaysMessage: string;
  tamWorkingHourssMessage: string;
  tamCostExistsMessage: string;
  wpActivityDeliveredMessage: string;

  showWorkPackegeDetails: boolean = false;
  showOdcDetails: boolean = false;
  showTotalEffortHours: boolean = false;
  showTotalEffortPMO: boolean = false;
  showTotalWorkingDays: boolean = false;
  showWorkpackageCost: boolean = false;
  showODCCost: boolean = false;
  showRateCardValue: boolean = false;
  showResourceEffort: boolean = true;
  showEffortPMOFromAPI: boolean = false;
  isEditSRN: boolean = false;
  showPOBalance: boolean = true;
  SRNTypeSelected: number;
  poTotalSRNValue: number = 0;
  wk: any;
  isValid: boolean = false;
  isValidWPQty: boolean = false;
  isWPValid: boolean = false;
  errorMessageWP: string;
  errorMessageWPQty: string;
  odcCost: number = 0;
  odcTotalCost: number = 0;
  workpackageCost: number = 0;
  totalEffortHours: number = 0;
  errorMessage: string;
  @ViewChild('fileInput') inputfile;
  autoGroupColumnDef: ColDef = { minWidth: 0 };
  overlayNoRowsTemplate = '<span></span>';
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: false,
    flex: 1,
    minWidth: 0,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any;
  columnApiLineItem: any;
  columnApiWP: any;
  columnApiODC: any;
  gridApiWP!: GridApi;

  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  @ViewChild(SRNApprovalProcessInfoComponent)
  sRNApprovalProcessInfoComponent: SRNApprovalProcessInfoComponent;

  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  constructor(
    private dialog: MatDialog,
    private notifyservice: NotifyService,
    private homeService: HomeService,
    private route: ActivatedRoute,
    private srnservice: SrnService,
    private router: Router,
    private loaderService: LoaderService,
    private sowjdService: sowjdService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
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
      resizable: false,
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
      cellRenderer: InputComponent,
    },
    {
      headerName: 'Vendor Rate / Quantity',
      hide: false,
      editable: false,
      field: 'unitPrice',
      resizable: false,
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.unitPrice,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Current SRN Value',
      hide: false,
      editable: false,
      field: 'netPrice',
      resizable: false,
      valueGetter: this.totalNetPrice.bind(this),
      aggFunc: 'aggNetPrice',
    },
    {
      headerName: 'Balance Quantity',
      hide: false,
      editable: false,
      field: 'openOrderQuantity',
      resizable: false,
    },
    {
      headerName: 'Current SRN Amount',
      hide: false,
      editable: false,
      field: 'srnValue',
      resizable: false,
      aggFunc: 'aggNetPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.srnValue,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Balance PO Amount',
      hide: false,
      editable: false,
      field: 'orderValue',
      resizable: false,
      valueGetter: this.totalOrderValue.bind(this),
      aggFunc: 'aggOpenValue',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.orderValue,
          this.companyCurrencyName,
          this.companyLocale
        ),
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
      headerName: 'No. of Activity Delivered',
      hide: false,
      editable: false,
      field: 'noofActivityDelivered',
      cellRenderer: InputComponent,
    },
    {
      headerName: 'Delivered Effort (hrs)',
      hide: false,
      field: 'deliveredEfforthrs',
      aggFunc: 'aggWPDeliveredEffort',
    },
    {
      headerName: 'PMO',
      hide: false,
      field: 'prm',
      valueGetter: this.PMOWPGetter.bind(this),
      aggFunc: 'aggWPPMO',
    },
    {
      headerName: 'Price/hour',
      hide: false,
      field: 'cost',
      valueGetter: this.CostGetter.bind(this),
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Price',
      hide: false,
      field: 'price',
      valueGetter: this.PMOWPPrice.bind(this),
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
      aggFunc: 'aggWPPrice',
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
      headerName: 'Open Workpackage Quantity',
      hide: false,
      field: 'openWorkPackageActivity',
      valueGetter: undefined,
    },
  ];

  public resourceDetailscolumnDefs = [
    {
      headerName: 'Employee Number',
      hide: false,
      editable: false,
      field: 'employeeNumber',
      resizable: false,
    },
    {
      headerName: 'Name',
      hide: false,
      editable: false,
      field: 'fullname',
      resizable: false,
    },
    {
      headerName: 'NT ID',
      hide: false,
      editable: false,
      field: 'ntid',
      resizable: false,
    },
    {
      headerName: 'Skillset',
      hide: false,
      editable: false,
      field: 'skillsetName',
      resizable: false,
    },
    {
      headerName: 'Grade',
      hide: false,
      editable: false,
      field: 'gradeName',
      resizable: false,
    },
    {
      headerName: 'PO Line Item',
      hide: false,
      editable: false,
      field: 'poLineItem',
      resizable: false,
    },
    {
      headerName: 'Absent Days',
      hide: false,
      editable: true,
      field: 'absentDays',
      cellRenderer: InputComponent,
      valueGetter: undefined,
      onCellValueChanged: this.onCellValueChangedAbsentDays.bind(this),
    },
    {
      headerName: 'Over Time (in days)',
      hide: false,
      editable: true,
      field: 'overTime',
      valueGetter: undefined,
      onCellValueChanged: this.onCellValueChangedOTDays.bind(this),
    },
    {
      headerName: 'Working Hours',
      hide: false,
      editable: true,
      field: 'workingHours',
      cellRenderer: InputComponent,
      valueGetter: undefined,
      onCellValueChanged: this.onCellValueChangedWorkingHours.bind(this),
    },
    {
      headerName: 'Working Days',
      hide: false,
      editable: false,
      field: 'maximumworkingdays',
      resizable: false,
      valueGetter: this.workingDaysNRCGetter.bind(this),
    },
    {
      headerName: 'Effort PMO',
      hide: false,
      editable: false,
      field: 'effortPMO',
      resizable: false,
      aggFunc: 'totalEffortPmo',
      valueGetter: this.PMOGetter.bind(this),
    },
    {
      headerName: 'Cost',
      hide: false,
      editable: false,
      field: 'cost',
      resizable: false,
      valueGetter: undefined,
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Price',
      hide: false,
      editable: false,
      field: 'price',
      resizable: false,
      valueGetter: undefined,
      aggFunc: 'totalPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },

    {
      headerName: 'SOW JD Assigned Date',
      hide: false,
      editable: false,
      field: 'dateOfJoining',
      resizable: false,
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'SOW JD End Date',
      hide: false,
      editable: false,
      field: 'contractEndDate',
      resizable: false,
      cellRenderer: DateFormatComponent,
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
      aggFunc: 'aggODCCostHeadCount',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.odC_Cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Total Cost',
      hide: false,
      field: 'total_Cost',
      aggFunc: 'aggODCTotalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.total_Cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Action',
      hide: false,
      editable: false,
      field: '',
      cellRenderer: DeleteOdcComponent,
      cellRendererParams: {},
      suppressMenu: true,
    },
  ];

  TMRCEffortPMO(params) {
    var tepmo;
    if (
      params.data.standardWorkingDays === 0 ||
      params.data.standardWorkingDays === null
    ) {
      tepmo = 0;
    } else {
      tepmo = +params.data.maximumworkingdays / params.data.standardWorkingDays;
    }

    params.data.effortPMO = Number(tepmo.toFixed(3));
    this.computePOLIRC();
    this.totalEffortPmoFunc();
    return params.data.effortPMO;
  }

  workingDaysRCGetter(params) {
    const wdays =
      params.data.maximumworkingdaysRef +
      Number(params.data.overTime) * params.data.otRatio -
      params.data.absentDays;
    params.data.maximumworkingdays = Number(wdays.toFixed(3));
    return params.data.maximumworkingdays;
  }

  workingDaysNRCGetter(params) {
    const wdays =
      params.data.maximumworkingdaysRef +
      Number(params.data.overTime) * params.data.otRatio -
      params.data.absentDays;
    params.data.maximumworkingdays = Number(wdays.toFixed(3));
    this.totalEffortPmoPOFuncNRC();
    this.totalNRCWorkingDays();
    return params.data.maximumworkingdays;
  }

  public totalNRCWorkingDays() {
    this.totalWorkingDays = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.totalWorkingDays += value.maximumworkingdays;
    });
    this.totalWorkingDays = Number(this.totalWorkingDays.toFixed(2));
  }

  TMRCPrice(params) {
    const priceCal = params.data.cost * params.data.effortPMO;
    params.data.price = Number(priceCal.toFixed(3));
    this.totalEffortPmoFunc();
    this.totalPriceFunc();
    this.computePOLIRC();
    this.getPOTotalSRNValue();
    this.checkOpenOrderValue();
    return params.data.price;
  }

  public computePOLIRC() {
    this.srnLineItemsList[0].srnValue = this.rateCardValue;
    this.srnLineItemsList[0].openOrderValue =
      this.srnLineItemsList[0].orderValue -
      (this.srnLineItemsList[0].srnValue +
        this.srnLineItemsList[0].srnBlockedValue);

    this.srnLineItemsList[0].openOrderValue = Number(
      this.srnLineItemsList[0].openOrderValue.toFixed(2)
    );
    this.poBalance = this.srnLineItemsList[0].openOrderValue;
    setTimeout(() => {
      this.gridApiLineItem.setRowData(this.srnLineItemsList);
      this.adjustWidth();
    }, 1000);
  }

  // PMOGetter(params) {
  //   var tepmo = params.data.workingDays / params.data.standardDays;
  //   params.data.effortPMO = Number(tepmo.toFixed(2));
  //   this.totalEffortPmoPOFunc();
  //   this.totalEffortPmoFunc();
  //   return Number(tepmo.toFixed(2));
  // }
  PMOGetter(params) {
    var tepmo;
    if (
      params.data.standardWorkingDays === 0 ||
      params.data.standardWorkingDays === null
    ) {
      tepmo = 0;
    } else {
      tepmo = +params.data.maximumworkingdays / params.data.standardWorkingDays;
    }

    params.data.effortPMO = Number(tepmo.toFixed(2));
    this.totalEffortPmoPOFuncNRC();
    this.totalEffortPmoFunc();
    // this.getPOTotalSRNQuantity();
    this.checkOpenOrderQty();
    return Number(tepmo.toFixed(2));
  }

  public checkOpenOrderQty() {
    let isCheckOrderQty = false;
    this.srnLineItemsList.forEach((element) => {
      if (element.openOrderQuantity < 0) {
        if (!isCheckOrderQty) {
          isCheckOrderQty = true;
        }
      }
    });
    if (isCheckOrderQty) {
      this.isValid = true;
      this.errorMessage = 'Balance Quantity should not be negative';
    } else {
      this.isValid = false;
    }
  }

  workingHoursNRC(params) {
    this.totalEffortPmoPOFuncNRC();
    this.totalWorkingHoursFunc();
    return params.data.workingHours;
  }

  public totalWorkingHoursFunc() {
    this.totalEffortHours = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.totalEffortHours += +value.workingHours;
    });
    this.totalEffortHours = Number(this.totalEffortHours.toFixed(2));
  }

  onCellValueChangedAbsentDays(params: any) {
    const { newValue } = params;
    if (newValue <= params.data.maximumworkingdaysRef) {
      this.isValidAbsentDays = true;
      const validInputRegex = /^\d*(?:\.5)?$/;
      if (!validInputRegex.test(newValue)) {
        this.isValidRegExAbsentDays = false;
        this.notifyservice.alert(`Invalid absent days ${newValue}`);
        params.data.absentDays = null;
        this.gridApi.setRowData(this.srnGetResourceList);
        return;
      } else {
        this.isValidRegExAbsentDays = true;
        if (this.srnData.srnSowjdDetails.outSourcingCode === 'TAM') {
          if (this.srnData.srnSowjdDetails.sowjdTypeCode == 'NRC') {
            this.workingDaysNRCGetter(params);
            this.PMOGetter(params);
          } else if (this.srnData.srnSowjdDetails.sowjdTypeCode == 'RC') {
            this.workingDaysRCGetter(params);
            this.TMRCEffortPMO(params);
            this.TMRCPrice(params);
          }
        }
      }
    } else {
      this.isValidAbsentDays = false;
      this.notifyservice.alert(
        `Absent days should be <= ${params.data.maximumworkingdaysRef}`
      );
      params.data.absentDays = null;
      this.gridApi.setRowData(this.srnGetResourceList);
      return;
    }
  }

  onCellValueChangedOTDays(params: any) {
    const { newValue } = params;
    const validInputRegex = /^\d{0,1}(\.\d{1,2})?$/;
    if (!validInputRegex.test(newValue)) {
      this.notifyservice.alert(`Invalid overtime days ${newValue}`);
      params.data.overTime = 0;
      this.gridApi.setRowData(this.srnGetResourceList);
      return;
    } else {
      if (this.srnData.srnSowjdDetails.outSourcingCode === 'TAM') {
        if (this.srnData.srnSowjdDetails.sowjdTypeCode == 'NRC') {
          this.workingDaysNRCGetter(params);
          this.PMOGetter(params);
        } else if (this.srnData.srnSowjdDetails.sowjdTypeCode == 'RC') {
          this.workingDaysRCGetter(params);
          this.TMRCEffortPMO(params);
          this.TMRCPrice(params);
        }
      }
    }
  }

  onCellValueChangedWorkingHours(params: any) {
    const { newValue } = params;
    if (newValue <= params.data.standardHours) {
      this.isValidWorkingHours = true;
      this.totalEffortPMONRC(params);
    } else {
      this.isValidWorkingHours = false;
      this.notifyservice.alert(
        `Working hours should be <= ${params.data.standardHours}`
      );
      params.data.workingHours = null;
      this.gridApi.setRowData(this.srnGetResourceList);
      return;
    }
  }

  onInput(event: any) {
    const inputValue: string = event.target.value;
    const integerRegex: RegExp = /^[1-9]\d*(\.\d+)?$/;
    if (!integerRegex.test(inputValue)) {
      const sanitizedInput: string = inputValue.replace(/[^.0-9]/g, '');
      event.target.value = sanitizedInput;
    }
  }

  onInputNumber(event: any) {
    const inputValue: string = event.target.value;
    const integerRegex: RegExp = /^[0-9]*$/;
    if (!integerRegex.test(inputValue)) {
      const sanitizedInput: string = inputValue.replace(/[^0-9]/g, '');
      event.target.value = sanitizedInput;
    }
  }

  totalEffortPMONRC(params) {
    var tepmo;
    if (params.data.standardHours === 0 || params.data.standardHours === null) {
      tepmo = 0;
    } else {
      tepmo = +params.data.workingHours / params.data.standardHours;
    }
    params.data.effortPMO = Number(tepmo.toFixed(2));
    this.totalEffortPmoPOFuncNRC();
    this.totalEffortPmoFunc();
    // this.totalWorkingHoursFunc();
    this.checkOpenOrderQty();
    return Number(tepmo.toFixed(2));
  }

  public totalRateCardValueWP() {
    this.srnLineItemsList[0].srnValue = this.rateCardValue;
    this.srnLineItemsList[0].poLineItemBalance =
      this.srnLineItemsList[0].orderValue - this.srnLineItemsList[0].srnValue;
    setTimeout(() => {
      this.gridApiLineItem.setRowData(this.srnLineItemsList);
      this.adjustWidth();
    }, 1000);
  }

  public totalEffortPmoPOFuncNRC() {
    this.srnLineItemsList.forEach((element) => {
      element.srnQuantity = 0;
      element.effortPMO = 0;
      this.srnGetResourceList.forEach((value: any) => {
        if (element.lineitem === value.poLineItem) {
          if (this.SRNTypeSelected === 1) {
            element.srnQuantity += value.effortPMO;
            element.srnQuantity = Number(element.srnQuantity.toFixed(2));

            element.effortPMO = element.srnQuantity;
          } else if (this.SRNTypeSelected === 2) {
            element.srnQuantity += value.maximumworkingdays;

            element.effortPMO += value.effortPMO;
            element.effortPMO = Number(element.effortPMO.toFixed(2));
          } else if (this.SRNTypeSelected === 3) {
            element.srnQuantity += +value.workingHours;

            element.effortPMO += value.effortPMO;
            element.effortPMO = Number(element.effortPMO.toFixed(2));
          }
        }
      });
      element.netPrice = element.srnQuantity * element.unitPrice;
      if (element.netPrice === 0 || element.netPrice === null) {
        element.netPrice = 0;
      } else {
        element.netPrice = Number(element.netPrice.toFixed(2));
      }

      element.openOrderQuantity =
        element.orderQuantity -
        (element.srnQuantity + element.srnBlockedQuantity);

      element.openOrderQuantity = Number(element.openOrderQuantity.toFixed(2));
    });
    setTimeout(() => {
      this.gridApiLineItem.setRowData(this.srnLineItemsList);
      this.adjustWidth();
    }, 1000);
  }

  public totalEffortPmoPOFunc() {
    this.srnLineItemsList.forEach((element) => {
      element.billingQuantity = 0;
      element.effortPMO = 0;
      this.srnGetResourceList.forEach((value: any) => {
        if (element.lineitem === value.poLineItem) {
          if (this.SRNTypeSelected === 1) {
            element.srnValue = value.price;
            element.srnValue = Number(element.srnValue.toFixed(2));

            element.billingQuantity += value.effortPMO;
            element.billingQuantity = Number(
              element.billingQuantity.toFixed(2)
            );
            element.effortPMO = element.billingQuantity;
          } else if (this.SRNTypeSelected === 2) {
            element.billingQuantity += value.workingDays;
            // element.effortPMO = value.effortPMO;

            element.effortPMO += value.effortPMO;
            element.effortPMO = Number(element.effortPMO.toFixed(2));
          } else if (this.SRNTypeSelected === 3) {
            element.billingQuantity += +value.workingHours;
            // element.effortPMO = value.effortPMO;
            element.effortPMO += value.effortPMO;
            element.effortPMO = Number(element.effortPMO.toFixed(2));
          }
        }
      });
      element.poLineItemBalance = element.orderValue - element.srnValue;
    });
    setTimeout(() => {
      this.gridApiLineItem.setRowData(this.srnLineItemsList);
      this.adjustWidth();
    }, 1000);
  }

  public getPOTotalSRNValue() {
    this.poTotalSRNValue = 0;
    this.srnLineItemsList.forEach((value: any) => {
      this.poTotalSRNValue += Number(value.srnValue);
    });
    this.poTotalSRNValue = Number(this.poTotalSRNValue.toFixed(2));
  }

  WPPrice(params) {
    params.data.cost === null ? 0 : params.data.cost;
    params.data.deliveredEfforthrs === null
      ? 0
      : params.data.deliveredEfforthrs;
    const priceCal = params.data.deliveredEfforthrs * params.data.cost;
    params.data.price = Number(priceCal.toFixed(2));
    this.computePOLIRC();
    this.getPOTotalSRNValue();
    this.checkWPOpenOrderValue();
    return Number(priceCal.toFixed(2));
  }

  public checkWPOpenOrderValue() {
    let isCheckWPOrderValue = false;
    this.srnLineItemsList.forEach((element) => {
      if (element.openOrderValue < 0) {
        if (!isCheckWPOrderValue) {
          isCheckWPOrderValue = true;
        }
      }
    });
    if (isCheckWPOrderValue) {
      this.isWPValid = true;
      this.errorMessageWP = 'Balance PO Amount should not be negative';
    } else {
      this.isWPValid = false;
    }
  }

  DeliveredEffortGetter(params) {
    const tepwd =
      params.data.estimationPerActivity *
      Number(params.data.noofActivityDelivered);
    params.data.deliveredEfforthrs = tepwd;
    return tepwd;
  }

  PMOWPGetter(params) {
    var tepmo;
    if (
      params.data.conversionHour !== 0 ||
      params.data.conversionHour !== null
    ) {
      tepmo =
        (params.data.noofActivityDelivered *
          params.data.estimationPerActivity) /
        params.data.conversionHour;
    } else {
      tepmo = 0;
    }

    params.data.pmo = Number(tepmo.toFixed(2));
    return Number(tepmo.toFixed(2));
  }

  public totalEffortPmoFunc() {
    this.totalEffortPmo = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.totalEffortPmo += value.effortPMO;
    });
    this.totalEffortPmo = Number(this.totalEffortPmo.toFixed(2));
  }

  public totalPriceFunc() {
    this.rateCardValue = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.rateCardValue += value.price;
    });
    this.rateCardValue = Number(this.rateCardValue.toFixed(2));
  }

  CostGetter(params) {
    return (params.data.cost =
      params.data.cost === null ? 0 : params.data.cost);
  }

  totalOpenOrderValue(params) {
    this.checkOpenOrderValue();
    // this.totalEffortPmoPOFunc();
    const calOpenOrder = params.data.orderValue - params.data.netPrice;
    params.data.poLineItemBalance = Number(calOpenOrder.toFixed(2));
    return Number(calOpenOrder.toFixed(2));
  }

  public checkOpenOrderValue() {
    let isCheckOrderValue = false;
    this.srnLineItemsList.forEach((element) => {
      if (element.openOrderValue < 0) {
        if (!isCheckOrderValue) {
          isCheckOrderValue = true;
        }
      }
    });
    if (isCheckOrderValue) {
      this.isValid = true;
      this.errorMessage = 'Balance PO Amount should not be negative';
    } else {
      this.isValid = false;
    }
  }

  PMOWPPrice(params) {
    params.data.cost === null ? 0 : params.data.cost;
    const priceCal = params.data.pmo * params.data.cost;
    params.data.price = Number(priceCal.toFixed(2));
    this.totalRateCardValueWP();
    return Number(priceCal.toFixed(2));
  }

  OpenWorkPackage(params) {
    const openWorkpackage =
      params.data.noofActivityPlanned -
      (+params.data.noofActivityDelivered + params.data.srnBlockedActivity);

    params.data.openWorkPackageActivity = Number(openWorkpackage.toFixed(2));
    this.checkOpenWPQuanity();
    return Number(openWorkpackage.toFixed(2));
  }

  public checkOpenWPQuanity() {
    let isCheckOpenWPQty = false;
    this.srnWorkPackageList.forEach((element) => {
      if (element.openWorkPackageActivity < 0) {
        if (!isCheckOpenWPQty) {
          isCheckOpenWPQty = true;
        }
      }
    });
    if (isCheckOpenWPQty) {
      this.isValidWPQty = true;
      this.errorMessageWPQty = 'Exceeded the agreed number of activities';
    } else {
      this.isValidWPQty = false;
    }
  }

  totalNetPrice(params) {
    const calNetPrice = params.data.effortPMO * params.data.unitPrice;
    params.data.srnValue = Number(calNetPrice.toFixed(2));
    return Number(calNetPrice.toFixed(2));
  }

  totalWpNetPrice(params) {
    const calNetPrice = params.data.billingQuantity * params.data.unitPrice;
    params.data.netPrice = Number(calNetPrice.toFixed(2));
    return Number(calNetPrice.toFixed(2));
  }

  totalOrderValue(params) {
    const calOpenOrder = params.data.orderValue - params.data.netPrice;
    params.data.poLineItemBalance = Number(calOpenOrder.toFixed(2));
    return Number(calOpenOrder.toFixed(2));
  }

  public aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    totalEffortPmo: (params: IAggFuncParams) => {
      this.totalEffortPmo = 0;
      params.values.forEach((value: number) => (this.totalEffortPmo += value));
      this.totalEffortPmo = Number(this.totalEffortPmo.toFixed(2));
    },
    totalPrice: (params: IAggFuncParams) => {
      this.rateCardValue = 0;
      params.values.forEach((value: number) => (this.rateCardValue += value));
      this.rateCardValue = Number(this.rateCardValue.toFixed(2));
      return this.rateCardValue;
    },
    aggNetPrice: (params: IAggFuncParams) => {
      this.srnValue = 0;
      params.values.forEach((value: number) => (this.srnValue += value));
      this.srnValue = Number(this.srnValue.toFixed(2));
      return this.srnValue;
    },

    aggSRNValue: (params: IAggFuncParams) => {
      this.poTotalSRNValue = 0;
      params.values.forEach((value: number) => (this.poTotalSRNValue += value));
      this.poTotalSRNValue = Number(this.poTotalSRNValue.toFixed(2));
      return this.poTotalSRNValue;
    },

    aggOpenValue: (params: IAggFuncParams) => {
      this.poBalance = 0;
      params.values.forEach((value: number) => (this.poBalance += value));
      this.poBalance = Number(this.poBalance.toFixed(2));
      return this.poBalance;
    },

    aggWPPMO: (params: IAggFuncParams) => {
      this.totalEffortPmo = 0;
      params.values.forEach((value: number) => (this.totalEffortPmo += value));
      this.totalEffortPmo = Number(this.totalEffortPmo.toFixed(2));
      return this.totalEffortPmo;
    },

    aggODCCostHeadCount: (params: IAggFuncParams) => {
      this.odcCost = 0;
      params.values.forEach((value: number) => (this.odcCost += value));
      this.odcCost = Number(this.odcCost.toFixed(2));
      return this.odcCost;
    },

    aggODCTotalCost: (params: IAggFuncParams) => {
      this.odcTotalCost = 0;
      params.values.forEach((value: number) => (this.odcTotalCost += value));
      this.odcTotalCost = Number(this.odcTotalCost.toFixed(2));
      this.rateCardValue = this.odcTotalCost + this.workpackageCost;
      this.rateCardValue = Number(this.rateCardValue.toFixed(2));
      return this.odcTotalCost;
    },

    aggWPPrice: (params: IAggFuncParams) => {
      this.workpackageCost = 0;
      params.values.forEach((value: number) => (this.workpackageCost += value));
      this.workpackageCost = Number(this.workpackageCost.toFixed(2));
      this.rateCardValue = this.odcTotalCost + this.workpackageCost;
      this.rateCardValue = Number(this.rateCardValue.toFixed(2));
      return this.workpackageCost;
    },

    aggWPDeliveredEffort: (params: IAggFuncParams) => {
      this.totalEffortHours = 0;
      params.values.forEach(
        (value: number) => (this.totalEffortHours += value)
      );
      this.totalEffortHours = Number(this.totalEffortHours.toFixed(2));
      return this.totalEffortHours;
    },
  };

  updateInvoice() {
    let dialogRef = this.dialog.open(UpdateInvoiceComponent, {
      width: '40vw',
      data: {
        srnId: this.srnId,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  uploadFile(event: any) {
    this.File = [];
    this.EventFile = event.target.files[0];
    var fileExt = this.EventFile.name;
    var validExts = new Array('.doc', '.docx', '.pdf', '.xlsx', '.xls');
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0 && fileExt != '') {
      this.notifyservice.alert(
        'Supported Formats: ' + validExts.toString() + ' upto 10 MB.'
      );
      this.inputfile.nativeElement.value = ' ';
      return false;
    }
    var totalBytes = this.EventFile.size;
    let sizeOfFile;
    if (totalBytes < 1000000) {
      sizeOfFile = Math.floor(totalBytes / 1000) + 'KB';
    } else {
      sizeOfFile = Math.floor(totalBytes / 1000000); //+ 'MB';
      if (sizeOfFile > 10) {
        this.notifyservice.alert(
          'Your File Size is ' + sizeOfFile + ' MB, File Size must be max 10MB'
        );
        this.inputfile.nativeElement.value = ' ';
        return false;
      }
    }

    this.convertFile(this.EventFile).subscribe((base64) => {
      this.base64Output = base64;
      this.myFiles.push({
        FileContent: this.base64Output,
        Filename: this.EventFile.name,
      });
    });
  }

  Print() {
    this.notifyservice.alert('Print in progress...');
  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  deleteFile(index: number) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        this.myFiles.splice(index, 1);
      }
    });
  }

  deleteDocument(docId: any) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        this.loaderService.setShowLoading();

        this.srnservice.deleteSRNDocId(docId).subscribe((res: any) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert('Document deleted Successful');
          this.getSRNDocuments();
        });
      }
    });
  }

  getSRNDocuments() {
    this.loaderService.setShowLoading();
    this.srnservice.getSRNDocuments(this.srnId).subscribe(
      (response: any) => {
        this.loaderService.setDisableLoading();
        this.documentsList = response;
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getSRNApprovalProcess() {
    this.sRNApprovalProcessInfoComponent?.getSRNDetails();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      if (params['srnId']) {
        this.srnId = params['srnId'];
        this.isEditSRN = false;
        if (this.srnId) {
          this.getSRNDetailBySrnId();
          this.getSRNApprovalProcess();
          this.getSRNComments(this.srnId);
        }
      } else if (params['editsrnId']) {
        this.isEditSRN = true;
        this.srnId = params['editsrnId'];
        if (this.srnId) {
          this.getEditSRNDetailBySrnId();
        }
      }
    });
    this.homeService.loader.subscribe((res) => {
      this.loader = res;
    });
  }

  goToSRNView() {
    this.router.navigate(['vendor/vendor-srn', this.srnId]);
    this.srnservice.vendorSrn.next('vendor-srn');
  }
  // getSRNDocuments() {
  //   this.srnservice.getSRNDocuments(this.srnId).subscribe(
  //     (response: any) => {
  //       if (response.status === 'success') {
  //         this.documentsList = response;
  //       }
  //     },
  //     (error) => {
  //       this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
  //     }
  //   );
  // }

  addODC() {
    const dialogRef = this.dialog.open(AddOdcComponent, {
      width: '50vw',
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.odcList.push(res.data);
        this.gridApiODC.setRowData(this.odcList);
        // const dialogRef = this.successMessage('ODC added successfully.');
        // dialogRef.afterClosed().subscribe((result: any) => {});
      }
    });
  }

  odcDetails(params: GridReadyEvent) {
    this.gridApiODC = params.api;
    this.gridApiODC.setDomLayout('autoHeight');
    this.columnApiODC = params.columnApi;
    this.gridApiODC.refreshCells({ force: true });
    this.gridApiODC.hideOverlay();
    if (
      this.odcList == null ||
      this.odcList == undefined ||
      this.odcList.length <= 0
    )
      this.gridApiODC.showNoRowsOverlay();
    this.gridApiODC.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiODC.hideOverlay();
    this.adjustWidth();
  }

  myPurchageOrder(params: GridReadyEvent) {
    this.gridApiLineItem = params.api;
    this.gridApiLineItem.setDomLayout('autoHeight');

    this.columnApiLineItem = params.columnApi;
    this.gridApiLineItem.refreshCells({ force: true });
    this.gridApiLineItem.hideOverlay();
    if (
      this.srnLineItemsList == null ||
      this.srnLineItemsList == undefined ||
      this.srnLineItemsList.length <= 0
    )
      this.gridApiLineItem.showNoRowsOverlay();
    this.gridApiLineItem.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiLineItem.hideOverlay();
    this.adjustWidth();
  }

  myResourceDetails(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');

    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });

    this.gridApi.hideOverlay();
    if (
      this.srnGetResourceList == null ||
      this.srnGetResourceList == undefined ||
      this.srnGetResourceList.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }

  workPackageDetails(params: GridReadyEvent) {
    this.gridApiWP = params.api;
    this.columnApiWP = params.columnApi;
    this.gridApiWP.refreshCells({ force: true });
    this.gridApiWP.setDomLayout('autoHeight');
    this.gridApiWP.hideOverlay();
    if (
      this.srnWorkPackageList == null ||
      this.srnWorkPackageList == undefined ||
      this.srnWorkPackageList.length <= 0
    )
      this.gridApiWP.showNoRowsOverlay();
    this.gridApiWP.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiWP.hideOverlay();
    this.adjustWidth();
  }

  ReSubmitSRN() {
    if (this.myFiles.length < 1 && this.documentsList?.data?.length < 1) {
      this.notifyservice.alert('Please attach minimum one Document.');
      return;
    }

    if (this.srnData.srnSowjdDetails.outSourcingCode === 'TAM') {
      if (this.srnData.srnSowjdDetails.sowjdTypeCode === 'NRC') {
        if (this.SRNTypeSelected === 3) {
          //3-HOUR
          let isWorkingHoursExist = false;
          this.srnGetResourceList.forEach((element) => {
            if (element.workingHours == null || element.workingHours == '') {
              if (!isWorkingHoursExist) {
                isWorkingHoursExist = true;
              }
            }
          });

          if (isWorkingHoursExist) {
            this.isWorkingHoursExistValid = true;
            this.tamWorkingHourssMessage =
              'Please enter Working Hours for all resources';
            return;
          } else {
            this.isWorkingHoursExistValid = false;
          }
        }

        if (this.SRNTypeSelected === 1 || this.SRNTypeSelected === 2) {
          // 1- DAY, 2-MON
          let isAbsentDaysExist = false;
          this.srnGetResourceList.forEach((element) => {
            if (element.absentDays == null || element.absentDays == '') {
              if (!isAbsentDaysExist) {
                isAbsentDaysExist = true;
              }
            }
          });

          if (isAbsentDaysExist) {
            this.isAbsentDaysExistValid = true;
            this.tamAbsentDaysMessage =
              'Please enter Absent Days for all resources';
            return;
          } else {
            this.isAbsentDaysExistValid = false;
          }
        }
      }
      if (this.srnData.srnSowjdDetails.sowjdTypeCode === 'RC') {
        if (this.srnData.srnDetails.managedCapacity === 'No') {
          let isAbsentDaysExist = false;
          this.srnGetResourceList.forEach((element) => {
            if (element.absentDays == null || element.absentDays == '') {
              if (!isAbsentDaysExist) {
                isAbsentDaysExist = true;
              }
            }
          });

          if (isAbsentDaysExist) {
            this.isAbsentDaysExistValid = true;
            this.tamAbsentDaysMessage =
              'Please enter Absent Days for all resources';
            return;
          } else {
            this.isAbsentDaysExistValid = false;
          }
        } else if (this.srnData.srnDetails.managedCapacity === 'Yes') {
          let isWorkingHoursExist = false;
          this.srnGetResourceList.forEach((element) => {
            if (element.workingHours == null || element.workingHours == '') {
              if (!isWorkingHoursExist) {
                isWorkingHoursExist = true;
              }
            }
          });

          if (isWorkingHoursExist) {
            this.isWorkingHoursExistValid = true;
            this.tamWorkingHourssMessage =
              'Please enter Working Hours for all resources';
            return;
          } else {
            this.isWorkingHoursExistValid = false;
          }
        }
      }
      let isTAMCostExists = false;
      this.srnGetResourceList.forEach((element) => {
        if (element.cost === 0 || element.cost === null) {
          if (!isTAMCostExists) {
            isTAMCostExists = true;
          }
        }
      });

      if (isTAMCostExists) {
        this.isTAMCostExistsValid = true;
        this.tamCostExistsMessage =
          'Price not available for one or more Skillset-Grade';
        return;
      } else {
        this.isTAMCostExistsValid = false;
      }
    } else if (
      this.srnData.srnSowjdDetails.outSourcingCode === 'WP' ||
      this.srnData.srnSowjdDetails.outSourcingCode === 'MS'
    ) {
      if (this.srnWorkPackageList.length === 0) {
        this.notifyservice.alert(
          'SRN cannot be submitted without Work Package'
        );
        return;
      } else {
        let isTAMCostExists = false;
        let isCheckActivityDelivered = false;
        this.srnWorkPackageList.forEach((element) => {
          // WP - Cost negative check
          if (element.cost === 0 || element.cost === null) {
            if (!isTAMCostExists) {
              isTAMCostExists = true;
            }
          }

          if (isTAMCostExists) {
            this.isTAMCostExistsValid = true;
            this.tamCostExistsMessage =
              'Price not available for one or more Skillset-Grade';
            return;
          } else {
            this.isTAMCostExistsValid = false;
          }

          // WP - Activity delivered check - if all activity delivered is zero
          if (
            element.noofActivityDelivered == null ||
            element.noofActivityDelivered == ''
          ) {
            if (!isCheckActivityDelivered) {
              isCheckActivityDelivered = true;
            }
          }
        });

        if (isCheckActivityDelivered) {
          this.isActivityDeliveredExistValid = true;
          this.wpActivityDeliveredMessage =
            'Please enter Activity Delivered for all work packages';
          return;
        } else {
          this.isActivityDeliveredExistValid = false;
        }
      }
    }

    let dialogRef = this.dialog.open(RfqRemarksComponent, {
      width: '30vw',
      data: 'Re-Submit SRN',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.remarks) {
        let srnLineItemsListObj = this.srnLineItemsList.map((item) => {
          return {
            id: item.id,
            purchaseHeadersId: item.purchaseHeadersId,
            poLineItemId: item.poLineItemId,

            effortPMO: item.effortPMO,
            ponumber: item.ponumber,
            lineItem: item.lineitem,

            validityStart: item.validityStart,
            validaityEnd: item.validityEnd,
            orderCurrency: item.orderCurrency,
            materialDescription: item.materialDescription,
            uom: item.uom,

            orderValue: item.orderValue,
            srnValue: item.srnValue,
            srnBlockedValue: item.srnBlockedValue,
            openOrderValue: item.openOrderValue,

            orderQuantity: item.orderQuantity,
            srnQuantity: item.srnQuantity,

            unitPrice: item.unitPrice,
            netPrice: item.netPrice,

            srnBlockedQuantity: item.srnBlockedQuantity,
            openOrderQuantity: item.openOrderQuantity,
          };
        });

        let odcListObj = this.odcList.map((item) => {
          return {
            srN_ID: this.srnId,
            odC_ID: item.odC_ID,
            odcName: item.odcName,
            odcCode: item.odcCode,
            odC_HeadCount: item.odC_HeadCount,
            odC_Cost: item.odC_Cost,
            total_Cost: item.total_Cost,
          };
        });

        const srnSummary = {
          id: this.srnData.srnSummary.id,
          srnId: this.srnId,
          poTotalSRNValue: this.poTotalSRNValue,
          poBalance: this.poBalance,
          totalEffortPMO: this.totalEffortPmo,
          totalEffortHours: this.totalEffortHours,
          totalWorkPackageCost: this.workpackageCost,
          totalODCCost: this.odcTotalCost,
          totalRateCardValue: this.rateCardValue,
          totalWorkingDays: this.totalWorkingDays,
        };

        const srnData = {
          srnId: this.srnId,
          comments: res.remarks,
          resources: [...this.srnGetResourceList],
          poLineItems: [...srnLineItemsListObj],
          workPackages: [...this.srnWorkPackageList],
          odcResubmitt: odcListObj,
          documents: [...this.myFiles],
          srnSummary,
        };
        this.loaderService.setShowLoading();
        this.srnservice.ResubmitSRN(srnData).subscribe({
          next: (data: any) => {
            if (data.status === 'success') {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert('SRN Re-submitted successful');
              this.goToSRNView();
              // const dialogRef = this.dialog.open(SuccessComponent, {
              //   width: '500px',
              //   height: 'auto',
              //   data: 'SRN Re-submitted successful',
              // });
              // dialogRef.afterClosed().subscribe((result: any) => {
              //   this.router.navigate(['vendor/vendor-srn']);
              // });
            }
          },
          error: (e) => {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
          },
          complete: () => {},
        });
      }
    });
  }

  doEditSRN() {
    this.router.navigate(['/vendor/vendor-srn/edit', this.srnId]);
  }

  doWithdraw() {
    const dialogRef = this.dialog.open(WithdrawSrnComponent, {
      width: '40vw',
      data: {
        srnId: this.srnId,
        type: 'Withdraw',
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
        this.srnservice.vendorSrn.next('vendor-srn');
      }
    });
  }
  getSRNDetailBySrnId() {
    this.loaderService.setShowLoading();
    this.srnservice.getSRNDetailBySrnId(this.srnId).subscribe(
      (response: any) => {
        this.getSRNDetails(response);
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getEditSRNDetailBySrnId() {
    this.loaderService.setShowLoading();
    this.srnservice.getEditSRNDetailBySrnId(this.srnId).subscribe(
      (response: any) => {
        this.getSRNDetails(response);
      },
      (error) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }

  getSRNDetails(response: any) {
    if (response.status === 'success') {
      this.srnData = response.data;

      this.companyCurrencyName = this.srnData?.srnSowjdDetails?.currencyName;
      let currencyObj = this.loaderService.getCountryDetailByCurrency(
        this.companyCurrencyName
      );
      this.companyLocale = currencyObj.locale;
      this.companyNumericFormat = currencyObj.numericFormat;

      this.loaderService.setDisableLoading();
      this.srnGetResourceList = response.data.srnResourceDetailsBySrnIds.filter(
        (empNum) => empNum.employeeNumber !== null
      );

      this.srnLineItemsList = response.data.poLineItems;
      this.odcList = response.data.odcNames;
      this.SRNTypeSelected = this.srnData.srnDetails.srnTypeID;
      this.srnWorkPackageList = this.srnData.srnWorkPackages;

      this.documentsList = this.srnData.srnDocuments;

      if (
        // 3 - Competency Unit at Parter - CUP
        this.srnData.srnSowjdDetails.locationModeId === 3 &&
        this.srnData.srnBillingPeriod.odcBilling === 'Yes'
      ) {
        this.showOdcDetails = true;
      }

      if (this.srnData.srnSowjdDetails.outSourcingCode == 'TAM') {
        if (this.srnData.srnSowjdDetails.sowjdTypeCode === 'NRC') {
          this.showPOBalance = false;
          this.srnWorkPackageList = [];
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
              resizable: false,
            },
            {
              headerName: 'Unit of Measurement',
              hide: false,
              editable: false,
              field: 'uom',
              resizable: false,
            },
            {
              headerName: 'PO Quantity',
              hide: false,
              editable: false,
              field: 'orderQuantity',
              resizable: false,
            },
            {
              headerName: 'Current SRN Quantity',
              hide: false,
              editable: false,
              field: 'srnQuantity',
              resizable: false,
            },
            {
              headerName: 'Vendor Rate / Quantity',
              hide: false,
              editable: false,
              field: 'unitPrice',
              resizable: false,
              cellRenderer: (params: any) =>
                this.currencyPipe.transform(
                  params.data.unitPrice,
                  this.companyCurrencyName,
                  this.companyLocale
                ),
            },
            {
              headerName: 'Current SRN Value',
              hide: false,
              editable: false,
              field: 'netPrice',
              resizable: false,
              aggFunc: 'aggSRNValue',
              cellRenderer: (params: any) =>
                this.currencyPipe.transform(
                  params.data.netPrice,
                  this.companyCurrencyName,
                  this.companyLocale
                ),
            },
            {
              headerName: 'SRN Blocked Quantity',
              hide: false,
              editable: false,
              field: 'srnBlockedQuantity',
              resizable: false,
            },
            {
              headerName: 'Balance Quantity',
              hide: false,
              editable: false,
              field: 'openOrderQuantity',
              resizable: false,
              aggFunc: 'aggOpenValue',
              cellRenderer: (params: any) =>
                this.numericFormatPipe.transform(
                  params.data.openOrderQuantity,
                  this.companyLocale,
                  this.companyNumericFormat
                ),
            },
          ];
          this.showWorkPackegeDetails = false;

          if (this.SRNTypeSelected === 1 || this.SRNTypeSelected === 2) {
            if (!this.isEditSRN) {
              this.showEffortPMOFromAPI = true;
              this.showTotalEffortPMO = true;
              this.showTotalWorkingDays = true;

              if (this.srnData.srnBillingPeriod.companyCode == 6520) {
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Absent Days',
                    hide: false,
                    editable: false,
                    field: 'absentDays',
                    valueGetter: undefined,
                    onCellValueChanged: undefined,
                  },
                  {
                    headerName: 'Working Days',
                    hide: false,
                    editable: false,
                    field: 'maximumworkingdays',
                    resizable: false,
                    // valueGetter: this.workingDaysGetter.bind(this),
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    aggFunc: 'totalEffortPmo',
                    valueGetter: undefined,
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              } else {
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Absent Days',
                    hide: false,
                    editable: false,
                    field: 'absentDays',
                    valueGetter: undefined,
                    onCellValueChanged: undefined,
                  },
                  {
                    headerName: 'Over Time (in days)',
                    hide: false,
                    editable: false,
                    field: 'overTime',
                    valueGetter: undefined,
                    onCellValueChanged: undefined,
                  },
                  {
                    headerName: 'Working Days',
                    hide: false,
                    editable: false,
                    field: 'maximumworkingdays',
                    resizable: false,
                    // valueGetter: this.workingDaysGetter.bind(this),
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    aggFunc: 'totalEffortPmo',
                    valueGetter: undefined,
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              }
            }

            if (
              this.srnData.srnBillingPeriod.statusId === 4 &&
              this.isEditSRN
            ) {
              this.showTotalEffortPMO = true;
              this.showTotalWorkingDays = true;
              if (this.srnData.srnBillingPeriod.companyCode == 6520) {
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Absent Days',
                    hide: false,
                    editable: true,
                    field: 'absentDays',
                    cellRenderer: InputComponent,
                    valueGetter: undefined,
                    onCellValueChanged:
                      this.onCellValueChangedAbsentDays.bind(this),
                  },
                  {
                    headerName: 'Working Days',
                    hide: false,
                    editable: false,
                    field: 'maximumworkingdays',
                    resizable: false,
                    valueGetter: this.workingDaysNRCGetter.bind(this),
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    valueGetter: this.PMOGetter.bind(this),
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              } else {
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Absent Days',
                    hide: false,
                    editable: true,
                    field: 'absentDays',
                    cellRenderer: InputComponent,
                    valueGetter: undefined,
                    onCellValueChanged:
                      this.onCellValueChangedAbsentDays.bind(this),
                  },
                  {
                    headerName: 'Over Time (in days)',
                    hide: false,
                    editable: true,
                    field: 'overTime',
                    cellRenderer: InputComponent,
                    valueGetter: undefined,
                    onCellValueChanged:
                      this.onCellValueChangedOTDays.bind(this),
                  },
                  {
                    headerName: 'Working Days',
                    hide: false,
                    editable: false,
                    field: 'maximumworkingdays',
                    resizable: false,
                    valueGetter: this.workingDaysNRCGetter.bind(this),
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    valueGetter: this.PMOGetter.bind(this),
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              }
            }
          }
          if (this.SRNTypeSelected === 3) {
            if (!this.isEditSRN) {
              this.showEffortPMOFromAPI = true;
              this.showTotalEffortPMO = true;
              this.showTotalEffortHours = true;
              this.resourceDetailscolumnDefs = [
                {
                  headerName: 'Employee Number',
                  hide: false,
                  editable: false,
                  field: 'employeeNumber',
                  resizable: false,
                },
                {
                  headerName: 'Name',
                  hide: false,
                  editable: false,
                  field: 'fullname',
                  resizable: false,
                },
                {
                  headerName: 'NT ID',
                  hide: false,
                  editable: false,
                  field: 'ntid',
                  resizable: false,
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  editable: false,
                  field: 'skillsetName',
                  resizable: false,
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  editable: false,
                  field: 'gradeName',
                  resizable: false,
                },
                {
                  headerName: 'PO Line Item',
                  hide: false,
                  editable: false,
                  field: 'poLineItem',
                  resizable: false,
                },
                {
                  headerName: 'Working Hours',
                  hide: false,
                  editable: false,
                  field: 'workingHours',
                  valueGetter: undefined,
                  onCellValueChanged: undefined,
                },
                {
                  headerName: 'Effort PMO',
                  hide: false,
                  editable: false,
                  field: 'effortPMO',
                  resizable: false,
                  aggFunc: 'totalEffortPmo',
                  valueGetter: undefined,
                },

                {
                  headerName: 'SOW JD Assigned Date',
                  hide: false,
                  editable: false,
                  field: 'dateOfJoining',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'SOW JD End Date',
                  hide: false,
                  editable: false,
                  field: 'contractEndDate',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
              ];
            }
            if (
              this.srnData.srnBillingPeriod.statusId === 4 &&
              this.isEditSRN
            ) {
              this.showTotalEffortPMO = true;
              this.showTotalEffortHours = true;
              this.resourceDetailscolumnDefs = [
                {
                  headerName: 'Employee Number',
                  hide: false,
                  editable: false,
                  field: 'employeeNumber',
                  resizable: false,
                },
                {
                  headerName: 'Name',
                  hide: false,
                  editable: false,
                  field: 'fullname',
                  resizable: false,
                },
                {
                  headerName: 'NT ID',
                  hide: false,
                  editable: false,
                  field: 'ntid',
                  resizable: false,
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  editable: false,
                  field: 'skillsetName',
                  resizable: false,
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  editable: false,
                  field: 'gradeName',
                  resizable: false,
                },
                {
                  headerName: 'PO Line Item',
                  hide: false,
                  editable: false,
                  field: 'poLineItem',
                  resizable: false,
                },
                {
                  headerName: 'Working Hours',
                  hide: false,
                  editable: true,
                  field: 'workingHours',
                  cellRenderer: InputComponent,
                  valueGetter: this.workingHoursNRC.bind(this),
                  onCellValueChanged:
                    this.onCellValueChangedWorkingHours.bind(this),
                },
                {
                  headerName: 'Effort PMO',
                  hide: false,
                  editable: false,
                  field: 'effortPMO',
                  resizable: false,
                  valueGetter: this.totalEffortPMONRC.bind(this),
                },

                {
                  headerName: 'SOW JD Assigned Date',
                  hide: false,
                  editable: false,
                  field: 'dateOfJoining',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'SOW JD End Date',
                  hide: false,
                  editable: false,
                  field: 'contractEndDate',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
              ];
            }
          }

          this.showWorkpackageCost = false;
          this.showODCCost = false;
          this.showRateCardValue = false;
        } else if (this.srnData.srnSowjdDetails.sowjdTypeCode === 'RC') {
          this.srnWorkPackageList = [];
          this.showTotalEffortHours = false;
          this.showWorkPackegeDetails = false;
          this.showRateCardValue = true;
          if (!this.isEditSRN) {
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
                resizable: false,
              },
              {
                headerName: 'Unit of Measurement',
                hide: false,
                editable: false,
                field: 'uom',
                resizable: false,
              },
              {
                headerName: 'Total PO Value',
                hide: false,
                editable: false,
                field: 'orderValue',
                resizable: false,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.orderValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Current SRN Amount',
                hide: false,
                editable: false,
                field: 'srnValue',
                resizable: false,
                aggFunc: 'aggNetPrice',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.srnValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Blocked PO Amount (excl. Current SRN)',
                hide: false,
                editable: false,
                field: 'srnBlockedValue',
                resizable: false,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.srnBlockedValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Balance PO Amount',
                hide: false,
                editable: false,
                field: 'openOrderValue',
                resizable: false,
                aggFunc: 'aggOpenValue',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.openOrderValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
            ];
            if (this.srnData.srnBillingPeriod.companyCode == 6520) {
              if (this.srnData.srnDetails.managedCapacity === 'No') {
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Absent Days',
                    hide: false,
                    editable: false,
                    field: 'absentDays',
                    valueGetter: undefined,
                    onCellValueChanged: undefined,
                  },
                  {
                    headerName: 'Working Days',
                    hide: false,
                    editable: false,
                    field: 'maximumworkingdays',
                    resizable: false,
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    aggFunc: 'totalEffortPmo',
                    valueGetter: undefined,
                  },
                  {
                    headerName: 'Cost',
                    hide: false,
                    editable: false,
                    field: 'cost',
                    resizable: false,
                    valueGetter: undefined,
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.cost,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },
                  {
                    headerName: 'Price',
                    hide: false,
                    editable: false,
                    field: 'price',
                    resizable: false,
                    aggFunc: 'totalPrice',
                    valueGetter: undefined,
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.price,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              }
              if (this.srnData.srnDetails.managedCapacity === 'Yes') {
                this.showTotalEffortHours = true;
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Working Hours',
                    hide: false,
                    editable: false,
                    field: 'workingHours',
                    valueGetter: undefined,
                    onCellValueChanged: undefined,
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    aggFunc: 'totalEffortPmo',
                    valueGetter: undefined,
                  },
                  {
                    headerName: 'Cost',
                    hide: false,
                    editable: false,
                    field: 'cost',
                    resizable: false,
                    valueGetter: undefined,
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.cost,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },
                  {
                    headerName: 'Price',
                    hide: false,
                    editable: false,
                    field: 'price',
                    resizable: false,
                    aggFunc: 'totalPrice',
                    valueGetter: undefined,
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.price,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              }
            } else {
              this.resourceDetailscolumnDefs = [
                {
                  headerName: 'Employee Number',
                  hide: false,
                  editable: false,
                  field: 'employeeNumber',
                  resizable: false,
                },
                {
                  headerName: 'Name',
                  hide: false,
                  editable: false,
                  field: 'fullname',
                  resizable: false,
                },
                {
                  headerName: 'NT ID',
                  hide: false,
                  editable: false,
                  field: 'ntid',
                  resizable: false,
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  editable: false,
                  field: 'skillsetName',
                  resizable: false,
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  editable: false,
                  field: 'gradeName',
                  resizable: false,
                },
                {
                  headerName: 'PO Line Item',
                  hide: false,
                  editable: false,
                  field: 'poLineItem',
                  resizable: false,
                },
                {
                  headerName: 'Absent Days',
                  hide: false,
                  editable: false,
                  field: 'absentDays',
                  valueGetter: undefined,
                  onCellValueChanged: undefined,
                },
                {
                  headerName: 'Over Time (in days)',
                  hide: false,
                  editable: false,
                  field: 'overTime',
                  valueGetter: undefined,
                  onCellValueChanged: undefined,
                },
                {
                  headerName: 'Working Days',
                  hide: false,
                  editable: false,
                  field: 'maximumworkingdays',
                  resizable: false,
                },
                {
                  headerName: 'Effort PMO',
                  hide: false,
                  editable: false,
                  field: 'effortPMO',
                  resizable: false,
                  aggFunc: 'totalEffortPmo',
                  valueGetter: undefined,
                },
                {
                  headerName: 'Cost',
                  hide: false,
                  editable: false,
                  field: 'cost',
                  resizable: false,
                  valueGetter: undefined,
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.cost,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Price',
                  hide: false,
                  editable: false,
                  field: 'price',
                  resizable: false,
                  aggFunc: 'totalPrice',
                  valueGetter: undefined,
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.price,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },

                {
                  headerName: 'SOW JD Assigned Date',
                  hide: false,
                  editable: false,
                  field: 'dateOfJoining',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'SOW JD End Date',
                  hide: false,
                  editable: false,
                  field: 'contractEndDate',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
              ];
            }
          }
          if (this.srnData.srnBillingPeriod.statusId === 4 && this.isEditSRN) {
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
                resizable: false,
              },
              {
                headerName: 'Unit of Measurement',
                hide: false,
                editable: false,
                field: 'uom',
                resizable: false,
              },
              {
                headerName: 'Total PO Value',
                hide: false,
                editable: false,
                field: 'orderValue',
                resizable: false,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.orderValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Current SRN Amount',
                hide: false,
                editable: false,
                field: 'srnValue',
                resizable: false,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.srnValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Blocked PO Amount (excl. Current SRN)',
                hide: false,
                editable: false,
                field: 'srnBlockedValue',
                resizable: false,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.srnBlockedValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Balance PO Amount',
                hide: false,
                editable: false,
                field: 'openOrderValue',
                resizable: false,
                aggFunc: 'aggOpenValue',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.openOrderValue,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
            ];
            if (this.srnData.srnBillingPeriod.companyCode == 6520) {
              if (this.srnData.srnDetails.managedCapacity === 'No') {
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Absent Days',
                    hide: false,
                    editable: true,
                    field: 'absentDays',
                    cellRenderer: InputComponent,
                    valueGetter: undefined,
                    onCellValueChanged:
                      this.onCellValueChangedAbsentDays.bind(this),
                  },
                  {
                    headerName: 'Working Days',
                    hide: false,
                    editable: false,
                    field: 'maximumworkingdays',
                    resizable: false,
                    valueGetter: this.workingDaysRCGetter.bind(this),
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    valueGetter: this.TMRCEffortPMO.bind(this),
                    // aggFunc: 'totalEffortPMO',
                  },
                  {
                    headerName: 'Cost',
                    hide: false,
                    editable: false,
                    field: 'cost',
                    resizable: false,
                    valueGetter: undefined,
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.cost,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },
                  {
                    headerName: 'Price',
                    hide: false,
                    editable: false,
                    field: 'price',
                    resizable: false,
                    valueGetter: this.TMRCPrice.bind(this),
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.price,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              }
              if (this.srnData.srnDetails.managedCapacity === 'Yes') {
                this.showTotalEffortHours = true;
                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    editable: false,
                    field: 'employeeNumber',
                    resizable: false,
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    editable: false,
                    field: 'fullname',
                    resizable: false,
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    editable: false,
                    field: 'ntid',
                    resizable: false,
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    editable: false,
                    field: 'skillsetName',
                    resizable: false,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    editable: false,
                    field: 'gradeName',
                    resizable: false,
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    editable: false,
                    field: 'poLineItem',
                    resizable: false,
                  },
                  {
                    headerName: 'Working Hours',
                    hide: false,
                    editable: true,
                    field: 'workingHours',
                    cellRenderer: InputComponent,
                    valueGetter: this.workingHoursNRC.bind(this),
                    onCellValueChanged:
                      this.onCellValueChangedWorkingHours.bind(this),
                  },
                  {
                    headerName: 'Effort PMO',
                    hide: false,
                    editable: false,
                    field: 'effortPMO',
                    resizable: false,
                    valueGetter: this.totalEffortPMONRC.bind(this),
                  },

                  {
                    headerName: 'Cost',
                    hide: false,
                    editable: false,
                    field: 'cost',
                    resizable: false,
                    valueGetter: undefined,
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.cost,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },
                  {
                    headerName: 'Price',
                    hide: false,
                    editable: false,
                    field: 'price',
                    resizable: false,
                    valueGetter: this.TMRCPrice.bind(this),
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.price,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },

                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    editable: false,
                    field: 'dateOfJoining',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    editable: false,
                    field: 'contractEndDate',
                    resizable: false,
                    cellRenderer: DateFormatComponent,
                  },
                ];
              }
            } else {
              this.resourceDetailscolumnDefs = [
                {
                  headerName: 'Employee Number',
                  hide: false,
                  editable: false,
                  field: 'employeeNumber',
                  resizable: false,
                },
                {
                  headerName: 'Name',
                  hide: false,
                  editable: false,
                  field: 'fullname',
                  resizable: false,
                },
                {
                  headerName: 'NT ID',
                  hide: false,
                  editable: false,
                  field: 'ntid',
                  resizable: false,
                },
                {
                  headerName: 'Skillset',
                  hide: false,
                  editable: false,
                  field: 'skillsetName',
                  resizable: false,
                },
                {
                  headerName: 'Grade',
                  hide: false,
                  editable: false,
                  field: 'gradeName',
                  resizable: false,
                },
                {
                  headerName: 'PO Line Item',
                  hide: false,
                  editable: false,
                  field: 'poLineItem',
                  resizable: false,
                },
                {
                  headerName: 'Absent Days',
                  hide: false,
                  editable: true,
                  field: 'absentDays',
                  cellRenderer: InputComponent,
                  valueGetter: undefined,
                  onCellValueChanged:
                    this.onCellValueChangedAbsentDays.bind(this),
                },
                {
                  headerName: 'Over Time (in days)',
                  hide: false,
                  editable: true,
                  field: 'overTime',
                  cellRenderer: InputComponent,
                  valueGetter: undefined,
                  onCellValueChanged: this.onCellValueChangedOTDays.bind(this),
                },
                {
                  headerName: 'Working Days',
                  hide: false,
                  editable: false,
                  field: 'maximumworkingdays',
                  resizable: false,
                  valueGetter: this.workingDaysRCGetter.bind(this),
                },
                {
                  headerName: 'Effort PMO',
                  hide: false,
                  editable: false,
                  field: 'effortPMO',
                  resizable: false,
                  valueGetter: this.TMRCEffortPMO.bind(this),
                  // aggFunc: 'totalEffortPMO',
                },
                {
                  headerName: 'Cost',
                  hide: false,
                  editable: false,
                  field: 'cost',
                  resizable: false,
                  valueGetter: undefined,
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.cost,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },
                {
                  headerName: 'Price',
                  hide: false,
                  editable: false,
                  field: 'price',
                  resizable: false,
                  valueGetter: this.TMRCPrice.bind(this),
                  cellRenderer: (params: any) =>
                    this.currencyPipe.transform(
                      params.data.price,
                      this.companyCurrencyName,
                      this.companyLocale
                    ),
                },

                {
                  headerName: 'SOW JD Assigned Date',
                  hide: false,
                  editable: false,
                  field: 'dateOfJoining',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
                {
                  headerName: 'SOW JD End Date',
                  hide: false,
                  editable: false,
                  field: 'contractEndDate',
                  resizable: false,
                  cellRenderer: DateFormatComponent,
                },
              ];
            }
          }

          this.showTotalEffortPMO = true;
          this.showWorkpackageCost = false;
          this.showODCCost = false;
        }
      } else if (
        this.srnData.srnSowjdDetails.outSourcingCode == 'WP' ||
        this.srnData.srnSowjdDetails.outSourcingCode == 'MS'
      ) {
        if (
          this.srnData.srnSowjdDetails.sowjdTypeCode === 'RC' ||
          this.srnData.srnSowjdDetails.sowjdTypeCode === 'NRC'
        ) {
          this.showTotalEffortPMO = true;
          this.showTotalEffortHours = true;
          this.showWorkPackegeDetails = true;

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
              resizable: false,
            },
            {
              headerName: 'Unit of Measurement',
              hide: false,
              editable: false,
              field: 'uom',
              resizable: false,
            },
            {
              headerName: 'Total PO Value',
              hide: false,
              editable: false,
              field: 'orderValue',
              resizable: false,
              cellRenderer: (params: any) =>
                this.currencyPipe.transform(
                  params.data.orderValue,
                  this.companyCurrencyName,
                  this.companyLocale
                ),
            },
            {
              headerName: 'Current SRN Amount',
              hide: false,
              editable: false,
              field: 'srnValue',
              resizable: false,
              cellRenderer: (params: any) =>
                this.currencyPipe.transform(
                  params.data.srnValue,
                  this.companyCurrencyName,
                  this.companyLocale
                ),
            },
            {
              headerName: 'Blocked PO Amount (excl. Current SRN)',
              hide: false,
              editable: false,
              field: 'srnBlockedValue',
              resizable: false,
              cellRenderer: (params: any) =>
                this.currencyPipe.transform(
                  params.data.srnBlockedValue,
                  this.companyCurrencyName,
                  this.companyLocale
                ),
            },
            {
              headerName: 'Balance PO Amount',
              hide: false,
              editable: false,
              field: 'openOrderValue',
              resizable: false,
              aggFunc: 'aggOpenValue',
              cellRenderer: (params: any) =>
                this.currencyPipe.transform(
                  params.data.openOrderValue,
                  this.companyCurrencyName,
                  this.companyLocale
                ),
            },
          ];

          this.resourceDetailscolumnDefs = [
            {
              headerName: 'Employee Number',
              hide: false,
              editable: false,
              field: 'employeeNumber',
              resizable: false,
            },
            {
              headerName: 'Name',
              hide: false,
              editable: false,
              field: 'fullname',
              resizable: false,
            },
            {
              headerName: 'NT ID',
              hide: false,
              editable: false,
              field: 'ntid',
              resizable: false,
            },
            {
              headerName: 'Skillset',
              hide: false,
              editable: false,
              field: 'skillsetName',
              resizable: false,
            },
            {
              headerName: 'Grade',
              hide: false,
              editable: false,
              field: 'gradeName',
              resizable: false,
            },
            {
              headerName: 'PO Line Item',
              hide: false,
              editable: false,
              field: 'poLineItem',
              resizable: false,
            },
            {
              headerName: 'SOW JD Assigned Date',
              hide: false,
              editable: false,
              field: 'dateOfJoining',
              resizable: false,
              cellRenderer: DateFormatComponent,
            },
            {
              headerName: 'SOW JD End Date',
              hide: false,
              editable: false,
              field: 'contractEndDate',
              resizable: false,
              cellRenderer: DateFormatComponent,
            },
          ];

          if (!this.isEditSRN) {
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
                aggFunc: 'aggWPDeliveredEffort',
              },
              {
                headerName: 'PMO',
                hide: false,
                field: 'pmo',
                aggFunc: 'aggWPPMO',
              },
              {
                headerName: 'Price/hour',
                hide: false,
                field: 'cost',
                valueGetter: undefined,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.cost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Price',
                hide: false,
                field: 'price',
                valueGetter: undefined,
                aggFunc: 'aggWPPrice',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.price,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'SRN Blocked Quantity',
                hide: false,
                field: 'srnBlockedActivity',
              },
              {
                headerName: 'Open Workpackage Quantity',
                hide: false,
                field: 'openWorkPackageActivity',
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
            ];

            this.odcDetailscolumnDefs = [
              {
                headerName: 'ODC',
                hide: false,
                field: 'odcName',
              },
              {
                headerName: 'ODC Name',
                hide: false,
                field: 'odcCode',
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
                aggFunc: 'aggODCCostHeadCount',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.odC_Cost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Total Cost',
                hide: false,
                field: 'total_Cost',
                aggFunc: 'aggODCTotalCost',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.total_Cost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
            ];
          }

          if (this.srnData.srnBillingPeriod.statusId === 4 && this.isEditSRN) {
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
                editable: true,
                field: 'noofActivityDelivered',
                cellRenderer: InputComponent,
              },
              {
                headerName: 'Delivered Effort (hrs)',
                hide: false,
                field: 'deliveredEfforthrs',
                valueGetter: this.DeliveredEffortGetter.bind(this),
                aggFunc: 'aggWPDeliveredEffort',
              },
              {
                headerName: 'PMO',
                hide: false,
                field: 'pmo',
                valueGetter: this.PMOWPGetter.bind(this),
                aggFunc: 'aggWPPMO',
              },
              {
                headerName: 'Price/hour',
                hide: false,
                field: 'cost',
                valueGetter: undefined,
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.cost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Price',
                hide: false,
                field: 'price',
                valueGetter: this.WPPrice.bind(this),
                aggFunc: 'aggWPPrice',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.personalCost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'SRN Blocked Quantity',
                hide: false,
                field: 'srnBlockedActivity',
              },
              {
                headerName: 'Open Workpackage Quantity',
                hide: false,
                field: 'openWorkPackageActivity',
                valueGetter: this.OpenWorkPackage.bind(this),
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
                aggFunc: 'aggODCCostHeadCount',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.odC_Cost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Total Cost',
                hide: false,
                field: 'total_Cost',
                aggFunc: 'aggODCTotalCost',
                cellRenderer: (params: any) =>
                  this.currencyPipe.transform(
                    params.data.total_Cost,
                    this.companyCurrencyName,
                    this.companyLocale
                  ),
              },
              {
                headerName: 'Action',
                hide: false,
                editable: false,
                field: '',
                cellRenderer: DeleteOdcComponent,
                cellRendererParams: {
                  delete: (params: any) => {
                    let dialogRef = this.dialog.open(DeleteComponent, {
                      width: '40vw',
                      data: { type: 'delete' },
                    });
                    dialogRef.afterClosed().subscribe((res) => {
                      if (res?.data != null && res?.data == 'yes') {
                        const newOdcList = this.odcList.filter((item) => {
                          return item.odC_ID !== params.data.odC_ID;
                        });
                        this.odcList = [...newOdcList];
                        this.gridApiODC.setRowData(newOdcList);
                      }
                    });
                  },
                },
                suppressMenu: true,
              },
            ];
          }
        }
      }
    }
  }
  getSRNComments(srnId: any) {
    this.srnservice.getSRNCommentsData(srnId).subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.srnRemarks = response.data;
        }
      },
      (error) => {
        this.notifyservice.alert(error.error.data.errorDetails[0].errorCode);
      }
    );
  }
  onFirstDataRendered(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
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
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }
  adjustWidth() {
    //
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApi?.autoSizeColumns(allColumnIds, false);

    const allColumnIds1: any = [];
    this.columnApiLineItem?.getColumns()?.forEach((column: any) => {
      allColumnIds1.push(column.getId());
    });
    this.columnApiLineItem?.autoSizeColumns(allColumnIds1, false);
    //
    const allColumnIds2: any = [];
    this.columnApiWP?.getColumns()?.forEach((column: any) => {
      allColumnIds2.push(column.getId());
    });
    this.columnApiWP?.autoSizeColumns(allColumnIds2, false);
    //
    const allColumnIds3: any = [];
    this.columnApiODC?.getColumns()?.forEach((column: any) => {
      allColumnIds3.push(column.getId());
    });
    this.columnApiODC?.autoSizeColumns(allColumnIds3, false);
  }
}
