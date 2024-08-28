import { Component, HostListener, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridReadyEvent,
  IAggFunc,
  IAggFuncParams,
  ValueSetterParams,
} from 'ag-grid-community';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { SrnService } from 'src/app/services/srn.service';
import { config } from 'src/app/config';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { InputComponent } from './input/input.component';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { RfqRemarksComponent } from '../../vendor-rfq/rfq-remarks/rfq-remarks.component';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { VendorService } from '../../services/vendor.service';
import { AddOdcComponent } from './add-odc/add-odc.component';
import { DeleteComponent } from '../../delete/delete.component';
import { DeleteOdcComponent } from './delete-odc/delete-odc.component';
import { LoaderService } from 'src/app/services/loader.service';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

interface SRNType {
  id: number;
  name: string;
}
@Component({
  selector: 'app-create-srn',
  templateUrl: './create-srn.component.html',
  styleUrls: ['./create-srn.component.scss'],
})
export class CreateSrnComponent {
  dateFormat = config.dateFormat;
  bgswNonRateCardWP: boolean = false;
  isValid: boolean = false;
  isValidWPQty: boolean = false;
  isWPValid: boolean = false;
  errorMessage: string;
  errorMessageWPQty: string;
  errorMessageWP: string;
  myForm!: FormGroup;
  base64Output!: string;
  odcBilling: string;
  vendorId: string;
  isTAMCostExistsValid: boolean = false;
  isAbsentDaysExistValid: boolean = false;
  isWorkingHoursExistValid: boolean = false;
  isResourceNotSRNValid: boolean = false;
  isActivityDeliveredExistValid: boolean = false;
  isValidAbsentDays: boolean = true;
  isValidRegExAbsentDays: boolean = true;
  isValidWorkingHours: boolean = true;
  tamAbsentDaysMessage: string;
  tamWorkingHourssMessage: string;
  resourceNotEligibleMessage: string;
  tamCostExistsMessage: string;
  wpActivityDeliveredMessage: string;
  BillingMonthMasterDetails: any = [];
  SowjdMasterDetails: any = [];
  PurchaseOrderList: any;
  srnSowJdDetails: any = '';
  billingPeriodId: any = '';
  fromDate: any = '';
  toDate: any = '';
  vendorInfo: any;
  poNumber: any = '';
  poStartDate: any = '';
  poEndDate: any = '';
  orderCurrency: any = '';
  srnValue: number = 0;
  poBalance: number = 0;
  totalEffortHours: number = 0;
  totalEffortPmo: number = 0;
  totalWorkingDays: number = 0;
  rateCardValue: number = 0;
  poTotalSRNValue: number = 0;
  workpackageCost: number = 0;
  odcCost: number = 0;
  odcTotalCost: number = 0;
  File: any = [];
  vendorDetails: any = [];
  srnLineItemsList: any = [];
  odcList: any = [];
  srnGetResourceList: any = [];
  srnWorkPackageList: any = [];
  resourceList: any = [];
  myFiles: any = [];
  purchageOrderId: any;
  showWorkPackegeDetails: boolean = false;
  showOdcDetails: boolean = false;
  showResourceEffort: boolean = false;
  showTotalEffortHours: boolean = false;
  showTotalEffortPMO: boolean = false;
  showTotalWorkingDays: boolean = false;
  showWorkpackageCost: boolean = false;
  showODCCost: boolean = false;
  showRateCardValue: boolean = false;
  technicalProposalId: string;
  SRNTypeSelected: string = '';
  isDisabled: boolean = true;
  showSRNType: boolean = false;
  showPOBalance: boolean = true;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  wk: any;
  zeroval: any;
  EventFile: any;
  SRNTypes: SRNType[] = [
    { id: 1, name: 'MON' },
    { id: 2, name: 'DAY' },
    { id: 3, name: 'HOUR' },
  ];
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
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
  columnApiRD: any;
  columnApiLineItem: any;
  columnApiWP: any;
  columnApiODC: any;
  gridApiWP!: GridApi;
  private gridApiRD!: GridApi;
  private gridApiLineItem!: GridApi;
  private gridApiODC!: GridApi;
  isSoWJDReset: boolean = false;

  public purchageOrdercolumnDefs = [
    {
      headerName: 'Line Item',
      hide: false,
      minWidth: 20,
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
      field: 'billingQuantity',
      resizable: false,
    },
    {
      headerName: 'Balance Quantity',
      hide: false,
      editable: false,
      field: 'openOrderQuantity',
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
      aggFunc: 'aggSRNValue',
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
      valueGetter: this.totalWPOpenOrderValue.bind(this),
      aggFunc: 'aggOpenValue',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.openOrderValue,
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
      aggFunc: undefined,
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
      aggFunc: undefined,
    },
  ];

  public resourceDetailscolumnDefs = [
    {
      headerName: 'Employee Number',
      hide: false,
      field: 'employeeNumber',
    },
    {
      headerName: 'Name',
      hide: false,
      field: 'fullname',
    },
    {
      headerName: 'NT ID',
      hide: false,
      field: 'ntid',
    },
    {
      headerName: 'Skillset',
      hide: false,
      field: 'skillsetName',
      minWidth: 250,
    },
    {
      headerName: 'Grade',
      hide: false,
      field: 'gradeName',
    },
    {
      headerName: 'Absent Days',
      hide: false,
      minWidth: 50,
      editable: true,
      field: 'absentDays',
      cellRenderer: InputComponent,
      onCellValueChanged: this.onCellValueChangedAbsentDays.bind(this),
    },
    {
      headerName: 'Over Time (in days)',
      hide: false,
      editable: true,
      minWidth: 50,
      field: 'overTime',
      cellRenderer: InputComponent,
      onCellValueChanged: this.onCellValueChangedOTDays.bind(this),
    },
    {
      headerName: 'Working Hours',
      hide: false,
      editable: true,
      field: 'workingHours',
      cellRenderer: InputComponent,
      valueGetter: this.workingHoursNRC.bind(this),
      onCellValueChanged: this.onCellValueChangedWorkingHours.bind(this),
    },
    {
      headerName: 'Working Days',
      hide: false,
      field: 'workingDays',
      valueGetter: this.workingDaysRCGetter.bind(this),
    },
    {
      headerName: 'Effort PMO',
      hide: false,
      field: 'effortPMO',
      // aggFunc: 'totalEffortPMO',
      valueGetter: this.PMOGetter.bind(this),
    },
    {
      headerName: 'Cost',
      hide: false,
      field: 'cost',
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
      // aggFunc: 'totalPrice',
      valueGetter: this.TMRCPrice.bind(this),
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'PO Line Item',
      hide: false,
      field: 'poLineItem',
    },
    {
      headerName: 'SOW JD Assigned Date',
      hide: false,
      field: 'dateOfJoining',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'SOW JD End Date',
      hide: false,
      field: 'contractEndDate',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Access Card Returned',
      hide: false,
      field: 'isAccessCardReturned',
      cellRenderer: (params) =>
        params.data.isAccessCardReturned ? 'Yes' : 'No',
    },
    {
      headerName: 'Asset Returned',
      hide: false,
      field: 'isAssetReturned',
      cellRenderer: (params) => (params.data.isAssetReturned ? 'Yes' : 'No'),
    },
    {
      headerName: 'Employment Status',
      hide: false,
      field: 'resourceHeaderStatus',
      cellRenderer: (params) =>
        params.data.resourceHeaderStatus ? 'Active' : 'Inactive',
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
      editable: true,
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
      valueGetter: this.WPPrice.bind(this),
      aggFunc: 'aggWPPrice',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.price,
          this.companyCurrencyName,
          this.companyLocale
        ),
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

  gridOptions = {
    suppressScrollOnNewData: true,
  };

  gridOptions1 = {
    suppressScrollOnNewData: true,
  };

  CostGetter(params) {
    params.data.cost = params.data.cost === null ? 0 : params.data.cost;
    params.data.standardHours =
      params.data.standardHours === null ? 0 : params.data.standardHours;
    const tepwd = params.data.cost * params.data.standardHours;
    params.data.cost = tepwd;
    return tepwd;
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
    if (params.data.standardHours !== 0 || params.data.standardHours !== null) {
      tepmo =
        (params.data.noofActivityDelivered *
          params.data.estimationPerActivity) /
        params.data.standardHours;
    } else {
      tepmo = 0;
    }

    params.data.pmo = Number(tepmo.toFixed(3));
    return params.data.pmo;
  }

  TMRCEffortPMO(params) {
    var tepmo;
    if (params.data.standardDays === 0 || params.data.standardDays === null) {
      tepmo = 0;
    } else {
      tepmo = +params.data.maximumworkingdays / params.data.standardDays;
    }

    params.data.effortPMO = Number(tepmo.toFixed(3));
    this.computePOLIRC();
    this.totalEffortPmoFunc();
    return params.data.effortPMO;
  }

  TMRCPrice(params) {
    const priceCal = params.data.cost * params.data.effortPMO;
    params.data.price = Number(priceCal.toFixed(2));
    this.totalEffortPmoFunc();
    this.totalPriceFunc();
    this.computePOLIRC();
    this.getPOTotalSRNValue();
    this.checkOpenOrderValue();
    return Number(priceCal.toFixed(2));
  }

  public computePOLIRC() {
    if (this.srnLineItemsList[0]) {
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

  PMOGetter(params) {
    var tepmo;
    if (params.data.standardDays === 0 || params.data.standardDays === null) {
      tepmo = 0;
    } else {
      tepmo = +params.data.maximumworkingdays / params.data.standardDays;
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

  OpenWorkPackage(params) {
    const openWorkpackage =
      params.data.noofActivityPlanned -
      (+params.data.noofActivityDelivered + params.data.srnBlockedActivity);

    params.data.openWorkPackageActivity = Number(openWorkpackage.toFixed(2));
    this.checkOpenWPQuanity();
    return Number(openWorkpackage.toFixed(2));
  }

  workingHoursNRC(params) {
    this.totalWorkingHoursFunc();
    return params.data.workingHours;
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
        this.gridApiRD.setRowData(this.srnGetResourceList);
        return;
      } else {
        this.isValidRegExAbsentDays = true;
        if (this.srnSowJdDetails.outSourcingCode === 'TAM') {
          if (this.srnSowJdDetails.sowjdTypeCode == 'NRC') {
            this.workingDaysNRCGetter(params);
            this.PMOGetter(params);
          } else if (this.srnSowJdDetails.sowjdTypeCode == 'RC') {
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
      this.gridApiRD.setRowData(this.srnGetResourceList);
      return;
    }
  }

  onCellValueChangedOTDays(params: any) {
    const { newValue } = params;
    const validInputRegex = /^\d{0,1}(\.\d{1,2})?$/;
    if (!validInputRegex.test(newValue)) {
      this.notifyservice.alert(`Invalid overtime days ${newValue}`);
      params.data.overTime = 0;
      this.gridApiRD.setRowData(this.srnGetResourceList);
      return;
    } else {
      if (this.srnSowJdDetails.outSourcingCode === 'TAM') {
        if (this.srnSowJdDetails.sowjdTypeCode == 'NRC') {
          this.workingDaysNRCGetter(params);
          this.PMOGetter(params);
        } else if (this.srnSowJdDetails.sowjdTypeCode == 'RC') {
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
      this.gridApiRD.setRowData(this.srnGetResourceList);
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

  totalOrderValue(params) {
    this.checkOpenOrderValue();
    // this.totalEffortPmoPOFunc();
    const calOpenOrder = params.data.orderValue - params.data.srnValue;
    params.data.poLineItemBalance = Number(calOpenOrder.toFixed(2));
    return Number(calOpenOrder.toFixed(2));
  }
  totalOpenOrderValue(params) {
    this.checkOpenOrderValue();
    // this.totalEffortPmoPOFunc();
    const calOpenOrder = params.data.orderValue - params.data.netPrice;
    params.data.poLineItemBalance = Number(calOpenOrder.toFixed(2));
    return Number(calOpenOrder.toFixed(2));
  }
  totalWPOpenOrderValue(params: any) {
    this.checkOpenOrderValue();
    // this.totalEffortPmoPOFunc();
    const calOpenOrder = params.data.orderValue - params.data.srnValue;
    params.data.poLineItemBalance = Number(calOpenOrder.toFixed(2));
    return Number(calOpenOrder.toFixed(2));
  }

  public totalEffortPmoPOFuncNRC() {
    this.srnLineItemsList.forEach((element) => {
      element.srnQuantity = 0;
      element.effortPMO = 0;
      this.srnGetResourceList.forEach((value: any) => {
        if (element.lineitem === value.poLineItem) {
          if (this.SRNTypeSelected === 'MON') {
            element.srnQuantity += value.effortPMO;
            element.srnQuantity = Number(element.srnQuantity.toFixed(2));

            element.effortPMO = element.srnQuantity;
          } else if (this.SRNTypeSelected === 'DAY') {
            element.srnQuantity += value.maximumworkingdays;

            element.effortPMO += value.effortPMO;
            element.effortPMO = Number(element.effortPMO.toFixed(2));
          } else if (this.SRNTypeSelected === 'HOUR') {
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

  public getPOTotalSRNQuantity() {
    this.poTotalSRNValue = 0;
    this.srnLineItemsList.forEach((value: any) => {
      this.poTotalSRNValue += value.srnQuantity;
    });
    this.poTotalSRNValue = Number(this.poTotalSRNValue.toFixed(2));
  }

  public totalEffortPmoPOFunc() {
    this.srnLineItemsList.forEach((element) => {
      element.billingQuantity = 0;
      element.effortPMO = 0;
      this.srnGetResourceList.forEach((value: any) => {
        if (element.lineitem === value.poLineItem) {
          if (this.SRNTypeSelected === 'MON') {
            element.srnValue = value.price;
            element.srnValue = Number(element.srnValue.toFixed(2));

            element.billingQuantity += value.effortPMO;
            element.billingQuantity = Number(
              element.billingQuantity.toFixed(2)
            );
            element.effortPMO = element.billingQuantity;
          } else if (this.SRNTypeSelected === 'DAY') {
            element.billingQuantity += value.workingDays;
            // element.effortPMO = value.effortPMO;

            element.effortPMO += value.effortPMO;
            element.effortPMO = Number(element.effortPMO.toFixed(2));
          } else if (this.SRNTypeSelected === 'HOUR') {
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

  totalNetPrice(params) {
    const calNetPrice = params.data.effortPMO * params.data.unitPrice;
    params.data.netPrice = Number(calNetPrice.toFixed(2));
    return Number(calNetPrice.toFixed(2));
  }

  public getPOTotalSRNValue() {
    this.poTotalSRNValue = 0;
    this.srnLineItemsList.forEach((value: any) => {
      this.poTotalSRNValue += Number(value.srnValue);
    });
    this.poTotalSRNValue = Number(this.poTotalSRNValue.toFixed(2));
  }

  public totalEffortPmoFunc() {
    this.totalEffortPmo = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.totalEffortPmo += value.effortPMO;
    });
    this.totalEffortPmo = Number(this.totalEffortPmo.toFixed(2));
  }

  public totalNRCWorkingDays() {
    this.totalWorkingDays = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.totalWorkingDays += value.maximumworkingdays;
    });
    this.totalWorkingDays = Number(this.totalWorkingDays.toFixed(2));
  }

  public totalWorkingHoursFunc() {
    this.totalEffortHours = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.totalEffortHours += +value.workingHours;
    });
    this.totalEffortHours = Number(this.totalEffortHours.toFixed(2));
  }
  public totalPriceFunc() {
    this.rateCardValue = 0;
    this.srnGetResourceList.forEach((value: any) => {
      this.rateCardValue += value.price;
    });
    this.rateCardValue = Number(this.rateCardValue.toFixed(2));
  }

  totalWpNetPrice(params) {
    const calNetPrice = params.data.billingQuantity * params.data.unitPrice;
    params.data.netPrice = Number(calNetPrice.toFixed(2));
    return Number(calNetPrice.toFixed(2));
  }

  public aggFuncs: {
    [key: string]: IAggFunc;
  } = {
    totalEffortPMO: (params: IAggFuncParams) => {
      this.totalEffortPmo = 0;
      params.values.forEach((value: number) => (this.totalEffortPmo += value));
      this.totalEffortPmo = Number(this.totalEffortPmo.toFixed(2));
      return this.totalEffortPmo;
    },

    totalPrice: (params: IAggFuncParams) => {
      this.rateCardValue = 0;
      params.values.forEach((value: number) => (this.rateCardValue += value));
      this.rateCardValue = Number(this.rateCardValue.toFixed(2));
      return this.rateCardValue;
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

  constructor(
    private _formBuilder: FormBuilder,
    private srnservice: SrnService,
    private notifyservice: NotifyService,
    private dialog: MatDialog,
    private router: Router,
    private vendorService: VendorService,
    private loaderService: LoaderService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {
    this.vendorId = this.vendorService.vendorId;
  }

  get createSrn(): FormGroup {
    return this.myForm.get('createsrn') as FormGroup;
  }

  ngOnInit(): void {
    this.getBillingMonthMasterData();
    this.getSowjdMasterData();
    this.getVendorDetailsData();
    //this.setFormData();
    this.myForm = this.makeForm();
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
  onFirstDataRendered(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
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
    }, 1000);
  }

  onSortChanged(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }

  onPageSizeChangeRS(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }
  onFilterChanged(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }

  onHorizontalScrollRS(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  onSortChangedRS(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }

  myResourceDetails(params: GridReadyEvent) {
    this.gridApiRD = params.api;
    this.gridApiRD.setDomLayout('autoHeight');
    this.columnApiRD = params.columnApi;
    this.gridApiRD.refreshCells({ force: true });

    this.gridApiRD.hideOverlay();
    if (
      this.srnGetResourceList == null ||
      this.srnGetResourceList == undefined ||
      this.srnGetResourceList.length <= 0
    )
      this.gridApiRD.showNoRowsOverlay();
    this.gridApiRD.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiRD.hideOverlay();
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
  adjustWidth() {
    //
    const allColumnIds: any = [];
    this.columnApiRD?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiRD?.autoSizeColumns(allColumnIds, false);
    //
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
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }

  onFileChange(event: any) {
    const selectedFile = event.target.files[0];
    this.convertFile(selectedFile).subscribe((base64: any) => {
      this.base64Output = base64;
      this.myFiles.push({
        FileContent: this.base64Output,
        Filename: selectedFile.name,
      });
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
  keyPress: string = '';

  onCellKeyPress(e) {
    // const { newValue } = params;
    const validInputRegex = /^\d{0,2}(\.\d{1,2})?$/;
    if (!validInputRegex.test(e.event.key)) {
      this.notifyservice.alert(`Invalid absent days ${e.event.key}`);
      e.data.absentDays = 0;
      this.gridApiRD.setRowData(this.srnGetResourceList);
      return;
    }
    // console.log(e.event.key);
    // if (this.keyPress.length === 0) {
    //   this.keyPress = e.event.key;
    // } else {
    //   this.keyPress = `${this.keyPress} , ${e.event.key}`;
    // }
  }

  submitSRN() {
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) return;

    if (this.myFiles.length < 1) {
      this.notifyservice.alert('Please attach minimum one Document.');
      return;
    }

    let checkIsValid: boolean = true;

    let isResourceNotEligibleforSRN = false;
    this.srnGetResourceList.forEach((element) => {
      if (!element.resourceHeaderStatus) {
        if (!element.isAccessCardReturned || !element.isAssetReturned) {
          if (!isResourceNotEligibleforSRN) {
            isResourceNotEligibleforSRN = true;
          }
        }
      }
    });

    if (isResourceNotEligibleforSRN) {
      this.isResourceNotSRNValid = true;
      this.resourceNotEligibleMessage =
        'All resource must return access card and asset';
      return;
    } else {
      this.isResourceNotSRNValid = false;
    }

    if (this.srnSowJdDetails.outSourcingCode === 'TAM') {
      if (this.srnGetResourceList.length === 0) {
        checkIsValid = false;
        this.notifyservice.alert('SRN cannot be submitted without Resource');
        return;
      }

      if (this.srnSowJdDetails.sowjdTypeCode === 'NRC') {
        if (this.SRNTypeSelected === 'HOUR') {
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

        if (this.SRNTypeSelected === 'MON' || this.SRNTypeSelected === 'DAY') {
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
      if (this.srnSowJdDetails.sowjdTypeCode === 'RC') {
        if (this.srnSowJdDetails.managedCapacity === 'No') {
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
        } else if (this.srnSowJdDetails.managedCapacity === 'Yes') {
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
      this.srnSowJdDetails.outSourcingCode === 'WP' ||
      this.srnSowJdDetails.outSourcingCode === 'MS'
    ) {
      if (this.srnWorkPackageList.length === 0) {
        checkIsValid = false;
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

    if (checkIsValid) {
      let dialogRef = this.dialog.open(RfqRemarksComponent, {
        width: '30vw',
        data: 'Submit SRN',
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res.remarks) {
          this.loaderService.setShowLoading();
          let srnLineItemsListObj = this.srnLineItemsList.map((item) => {
            return {
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
              odC_ID: item.odC_ID,
              odcName: item.odcName,
              odcCode: item.odcCode,
              odC_HeadCount: item.odC_HeadCount,
              odC_Cost: item.odC_Cost,
              total_Cost: item.total_Cost,
            };
          });

          let srnTypeId: number;
          switch (this.SRNTypeSelected) {
            case 'MON': {
              srnTypeId = 1;
              break;
            }
            case 'DAY': {
              srnTypeId = 2;
              break;
            }
            case 'HOUR': {
              srnTypeId = 3;
              break;
            }
            case 'PC': {
              srnTypeId = 4;
              break;
            }
          }

          const srnSummary = {
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
            billingPeriodId: this.createSrn.controls['billingmonthId'].value,
            vendorId: this.vendorId,
            createdBy: '',
            purchaseOrderId: this.PurchaseOrderList.id,
            sowJdId: this.createSrn.get('sowJdId').value,
            srnTypeID: srnTypeId,
            technicalProposalId: this.technicalProposalId,
            comments: res.remarks,
            resources: [...this.srnGetResourceList],
            documents: [...this.myFiles],
            workPackages: [...this.srnWorkPackageList],
            poLineItems: srnLineItemsListObj,
            odcNames: odcListObj,
            srnSummary,
          };

          this.srnservice.createSRN(srnData).subscribe({
            next: (res: any) => {
              this.loaderService.setDisableLoading();
              if (res.status === 'success') {
                const dialogRef = this.dialog.open(SuccessComponent, {
                  width: '500px',
                  height: 'auto',
                  data: 'SRN Created Successful',
                });
                dialogRef.afterClosed().subscribe((result: any) => {
                  this.router.navigate(['/vendor/vendor-srn']).then(() => {
                    this.srnservice.vendorSrn.next('vendor-srn');
                  });
                });
              } else {
                this.loaderService.setDisableLoading();
                this.notifyservice.alert(
                  'This combination of SRN already exist'
                );
              }
            },
            error: (error) => {
              this.loaderService.setDisableLoading();
            },
            complete: () => {},
          });
        }
      });
    }
  }

  makeForm() {
    return this._formBuilder.group({
      createsrn: this._formBuilder.group({
        billingmonthId: ['', Validators.required],
        sowJdId: ['', Validators.required],
        SRNTypeId: [this.SRNTypeSelected],
      }),
    });
  }

  onCancel() {
    this.router.navigate(['/vendor/vendor-srn']).then(() => {
      this.srnservice.vendorSrn.next('vendor-srn');
    });
  }

  getBillingMonthMasterData() {
    this.loaderService.setShowLoading();
    this.srnservice.getBillingMonthData().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.loaderService.setDisableLoading();
          this.BillingMonthMasterDetails = res.data;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  getSowjdMasterData() {
    this.loaderService.setShowLoading();
    this.srnservice.getSowjdMasterData(this.vendorId).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.loaderService.setDisableLoading();
          this.SowjdMasterDetails = res.data;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  getVendorDetailsData() {
    this.loaderService.setShowLoading();
    this.srnservice.getVendorDetailsData(this.vendorId).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.loaderService.setDisableLoading();
          this.vendorInfo = res.data;
        }
      },
      (error) => {
        this.loaderService.setDisableLoading();
      }
    );
  }

  addODC() {
    const dialogRef = this.dialog.open(AddOdcComponent, {
      width: '40vw',
      data: {
        vendorId: this.vendorId,
        monthId: this.createSrn.controls['billingmonthId'].value,
        companyId: this.srnSowJdDetails?.companyId,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data) {
        this.odcList.push(res.data);
        this.gridApiODC.setRowData(this.odcList);
        this.adjustWidth();
      }
    });
  }

  successMessage(message: string) {
    const dialogRef = this.dialog.open(SuccessComponent, {
      width: '500px',
      height: 'auto',
      data: message,
    });
    return dialogRef;
  }

  onBillingMonthChange(event: any) {
    this.loaderService.setShowLoading();
    this.srnservice.getOnBillingMonthChange(event.value).subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.billingPeriodId = res.data.periodId;
        this.fromDate = res.data.periodStart;
        this.toDate = res.data.periodEnd;
        this.odcBilling = res.data.odcBilling;
      },
      error: (e) => {
        this.loaderService.setDisableLoading();
        this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {},
    });
  }

  getPurchaseOrderDetails(event: any) {
    this.odcList = [];
    this.isAbsentDaysExistValid = false;
    this.isWorkingHoursExistValid = false;
    this.isActivityDeliveredExistValid = false;
    this.createSrn.get('sowJdId').setValue(event.sowJdId);

    if (this.createSrn.controls['billingmonthId'].value) {
      this.loaderService.setShowLoading();
      this.technicalProposalId = event.technicalProposalId;

      this.srnservice
        .getPurchaseOrderDetails(
          this.vendorId,
          event.sowJdId,
          this.createSrn.controls['billingmonthId'].value,
          event.technicalProposalId
        )
        .subscribe({
          next: (res: any) => {
            this.loaderService.setDisableLoading();
            this.srnSowJdDetails = res.data.srnSowJdDetailss[0];

            this.companyCurrencyName = this.srnSowJdDetails?.currencyName;
            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            this.createSrn.controls['billingmonthId'].disable();
            if (
              // 3 - Competency Unit at Parter - CUP
              this.srnSowJdDetails.locationModeId === 3 &&
              this.odcBilling === 'Yes'
            ) {
              this.showOdcDetails = true;
            }
            if (res.data.poLineItems.length > 0) {
              if (
                res.data.poLineItems[0].uom === 'H' ||
                res.data.poLineItems[0].uom === 'HR'
              ) {
                this.SRNTypeSelected = 'HOUR';
              } else {
                this.SRNTypeSelected = res.data.poLineItems[0].uom;
              }
            } else {
              this.SRNTypeSelected = '';
            }

            // Show PO Line items mapped with Resource PO Line item

            if (
              res.data.poLineItems.length > 0 &&
              res.data.srnGetResourceDetails.length > 0
            ) {
              let newPOLineItems = [];
              res.data.poLineItems.forEach((polineItem: any) => {
                res.data.srnGetResourceDetails.forEach((resource: any) => {
                  if (polineItem.lineitem === resource.poLineItem) {
                    newPOLineItems.push(polineItem);
                  }
                });
              });
              const result = Object.values(
                newPOLineItems.reduce(
                  (acc, obj) => ({ ...acc, [obj.lineitem]: obj }),
                  {}
                )
              );

              this.srnLineItemsList = result;
            }

            this.gridApiLineItem?.setRowData(this.srnLineItemsList);
            this.adjustWidth();

            if (res.data.srnGetPurchaseOrderDetailss.length > 0) {
              this.PurchaseOrderList = res.data.srnGetPurchaseOrderDetailss[0];
              this.poNumber = this.PurchaseOrderList.ponumber;
              this.poStartDate = this.PurchaseOrderList.validityStart;
              this.poEndDate = this.PurchaseOrderList.validityEnd;
              this.orderCurrency = this.PurchaseOrderList.orderCurrency;
            } else {
              this.poNumber = '';
              this.poStartDate = '';
              this.poEndDate = '';
              this.orderCurrency = '';
            }
            this.srnGetResourceList = res.data.srnGetResourceDetails.filter(
              (empNum) => empNum.employeeNumber !== null
            );
            this.srnWorkPackageList = res.data.srnTpWorkPackages;
            if (this.srnSowJdDetails.outSourcingCode === 'TAM') {
              this.showWorkPackegeDetails = false;

              this.showSRNType = true;

              if (this.srnSowJdDetails.sowjdTypeCode === 'NRC') {
                this.showPOBalance = false;
                this.showResourceEffort = true;
                this.showTotalEffortPMO = true;
                this.srnWorkPackageList = [];
                this.purchageOrdercolumnDefs = [
                  {
                    headerName: 'Line Item',
                    hide: false,
                    minWidth: 20,
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
                    // valueGetter: this.totalOpenOrderValue.bind(this),
                    aggFunc: 'aggOpenValue',
                  },
                ];

                if (
                  this.SRNTypeSelected === 'MON' ||
                  this.SRNTypeSelected === 'DAY'
                ) {
                  this.showTotalWorkingDays = true;
                  if (this.srnSowJdDetails.companyCode == 6520) {
                    this.resourceDetailscolumnDefs = [
                      {
                        headerName: 'Employee Number',
                        hide: false,
                        field: 'employeeNumber',
                      },
                      {
                        headerName: 'Name',
                        hide: false,
                        field: 'fullname',
                      },
                      {
                        headerName: 'NT ID',
                        hide: false,
                        field: 'ntid',
                      },
                      {
                        headerName: 'Skillset',
                        hide: false,
                        field: 'skillsetName',
                        minWidth: 250,
                      },
                      {
                        headerName: 'Grade',
                        hide: false,
                        field: 'gradeName',
                      },
                      {
                        headerName: 'PO Line Item',
                        hide: false,
                        field: 'poLineItem',
                      },
                      {
                        headerName: 'Absent Days',
                        hide: false,
                        minWidth: 50,
                        editable: true,
                        field: 'absentDays',
                        cellRenderer: InputComponent,
                        onCellValueChanged:
                          this.onCellValueChangedAbsentDays.bind(this),
                      },
                      {
                        headerName: 'Working Days',
                        hide: false,
                        field: 'maximumworkingdays',
                        valueGetter: this.workingDaysNRCGetter.bind(this),
                      },
                      {
                        headerName: 'Effort PMO',
                        hide: false,
                        field: 'effortPMO',
                        valueGetter: this.PMOGetter.bind(this),
                      },

                      {
                        headerName: 'SOW JD Assigned Date',
                        hide: false,
                        field: 'dateOfJoining',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'SOW JD End Date',
                        hide: false,
                        field: 'contractEndDate',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'Access Card Returned',
                        hide: false,
                        field: 'isAccessCardReturned',
                        cellRenderer: (params) =>
                          params.data.isAccessCardReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Asset Returned',
                        hide: false,
                        field: 'isAssetReturned',
                        cellRenderer: (params) =>
                          params.data.isAssetReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Employment Status',
                        hide: false,
                        field: 'resourceHeaderStatus',
                        cellRenderer: (params) =>
                          params.data.resourceHeaderStatus
                            ? 'Active'
                            : 'Inactive',
                      },
                    ];
                  } else {
                    this.resourceDetailscolumnDefs = [
                      {
                        headerName: 'Employee Number',
                        hide: false,
                        field: 'employeeNumber',
                      },
                      {
                        headerName: 'Name',
                        hide: false,
                        field: 'fullname',
                      },
                      {
                        headerName: 'NT ID',
                        hide: false,
                        field: 'ntid',
                      },
                      {
                        headerName: 'Skillset',
                        hide: false,
                        field: 'skillsetName',
                        minWidth: 250,
                      },
                      {
                        headerName: 'Grade',
                        hide: false,
                        field: 'gradeName',
                      },
                      {
                        headerName: 'PO Line Item',
                        hide: false,
                        field: 'poLineItem',
                      },
                      {
                        headerName: 'Absent Days',
                        hide: false,
                        minWidth: 50,
                        editable: true,
                        field: 'absentDays',
                        cellRenderer: InputComponent,
                        onCellValueChanged:
                          this.onCellValueChangedAbsentDays.bind(this),
                      },
                      {
                        headerName: 'Over Time (in days)',
                        hide: false,
                        minWidth: 50,
                        editable: true,
                        field: 'overTime',
                        cellRenderer: InputComponent,
                        onCellValueChanged:
                          this.onCellValueChangedOTDays.bind(this),
                      },
                      {
                        headerName: 'Working Days',
                        hide: false,
                        field: 'maximumworkingdays',
                        valueGetter: this.workingDaysNRCGetter.bind(this),
                      },
                      {
                        headerName: 'Effort PMO',
                        hide: false,
                        field: 'effortPMO',
                        valueGetter: this.PMOGetter.bind(this),
                      },

                      {
                        headerName: 'SOW JD Assigned Date',
                        hide: false,
                        field: 'dateOfJoining',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'SOW JD End Date',
                        hide: false,
                        field: 'contractEndDate',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'Access Card Returned',
                        hide: false,
                        field: 'isAccessCardReturned',
                        cellRenderer: (params) =>
                          params.data.isAccessCardReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Asset Returned',
                        hide: false,
                        field: 'isAssetReturned',
                        cellRenderer: (params) =>
                          params.data.isAssetReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Employment Status',
                        hide: false,
                        field: 'resourceHeaderStatus',
                        cellRenderer: (params) =>
                          params.data.resourceHeaderStatus
                            ? 'Active'
                            : 'Inactive',
                      },
                    ];
                  }
                }
                if (this.SRNTypeSelected === 'HOUR') {
                  this.showTotalEffortHours = true;
                  this.resourceDetailscolumnDefs = [
                    {
                      headerName: 'Employee Number',
                      hide: false,
                      field: 'employeeNumber',
                    },
                    {
                      headerName: 'Name',
                      hide: false,
                      field: 'fullname',
                    },
                    {
                      headerName: 'NT ID',
                      hide: false,
                      field: 'ntid',
                    },
                    {
                      headerName: 'Skillset',
                      hide: false,
                      field: 'skillsetName',
                      minWidth: 250,
                    },
                    {
                      headerName: 'Grade',
                      hide: false,
                      field: 'gradeName',
                    },
                    {
                      headerName: 'PO Line Item',
                      hide: false,
                      field: 'poLineItem',
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
                      field: 'effortPMO',
                      valueGetter: this.totalEffortPMONRC.bind(this),
                    },

                    {
                      headerName: 'SOW JD Assigned Date',
                      hide: false,
                      field: 'dateOfJoining',
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'SOW JD End Date',
                      hide: false,
                      field: 'contractEndDate',
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Access Card Returned',
                      hide: false,
                      field: 'isAccessCardReturned',
                      cellRenderer: (params) =>
                        params.data.isAccessCardReturned ? 'Yes' : 'No',
                    },
                    {
                      headerName: 'Asset Returned',
                      hide: false,
                      field: 'isAssetReturned',
                      cellRenderer: (params) =>
                        params.data.isAssetReturned ? 'Yes' : 'No',
                    },
                    {
                      headerName: 'Employment Status',
                      hide: false,
                      field: 'resourceHeaderStatus',
                      cellRenderer: (params) =>
                        params.data.resourceHeaderStatus
                          ? 'Active'
                          : 'Inactive',
                    },
                  ];
                }

                this.showWorkpackageCost = false;
                this.showODCCost = false;
                this.showRateCardValue = false;
              } else if (this.srnSowJdDetails.sowjdTypeCode == 'RC') {
                this.showResourceEffort = true;
                this.showTotalEffortPMO = true;
                this.showTotalEffortHours = false;
                this.showRateCardValue = true;
                this.srnWorkPackageList = [];
                this.purchageOrdercolumnDefs = [
                  {
                    headerName: 'Line Item',
                    hide: false,
                    minWidth: 20,
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
                    // valueGetter: this.totalOrderValue.bind(this),
                    aggFunc: 'aggOpenValue',
                    cellRenderer: (params: any) =>
                      this.currencyPipe.transform(
                        params.data.openOrderValue,
                        this.companyCurrencyName,
                        this.companyLocale
                      ),
                  },
                ];

                if (this.srnSowJdDetails.companyCode == 6520) {
                  if (this.srnSowJdDetails.managedCapacity === 'No') {
                    this.resourceDetailscolumnDefs = [
                      {
                        headerName: 'Employee Number',
                        hide: false,
                        field: 'employeeNumber',
                      },
                      {
                        headerName: 'Name',
                        hide: false,
                        field: 'fullname',
                      },
                      {
                        headerName: 'NT ID',
                        hide: false,
                        field: 'ntid',
                      },
                      {
                        headerName: 'Skillset',
                        hide: false,
                        field: 'skillsetName',
                        minWidth: 250,
                      },
                      {
                        headerName: 'Grade',
                        hide: false,
                        field: 'gradeName',
                      },
                      {
                        headerName: 'PO Line Item',
                        hide: false,
                        field: 'poLineItem',
                      },
                      {
                        headerName: 'Absent Days',
                        hide: false,
                        minWidth: 50,
                        editable: true,
                        field: 'absentDays',
                        cellRenderer: InputComponent,
                        onCellValueChanged:
                          this.onCellValueChangedAbsentDays.bind(this),
                      },
                      {
                        headerName: 'Working Days',
                        hide: false,
                        field: 'maximumworkingdays',
                        valueGetter: this.workingDaysRCGetter.bind(this),
                      },
                      {
                        headerName: 'Effort PMO',
                        hide: false,
                        field: 'effortPMO',
                        valueGetter: this.TMRCEffortPMO.bind(this),
                        // aggFunc: 'totalEffortPMO',
                      },
                      {
                        headerName: 'Cost',
                        hide: false,
                        field: 'cost',
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
                        cellRenderer: (params: any) =>
                          this.currencyPipe.transform(
                            params.data.price,
                            this.companyCurrencyName,
                            this.companyLocale
                          ),
                        valueGetter: this.TMRCPrice.bind(this),
                        // aggFunc: 'totalPrice',
                      },

                      {
                        headerName: 'SOW JD Assigned Date',
                        hide: false,
                        field: 'dateOfJoining',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'SOW JD End Date',
                        hide: false,
                        field: 'contractEndDate',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'Access Card Returned',
                        hide: false,
                        field: 'isAccessCardReturned',
                        cellRenderer: (params) =>
                          params.data.isAccessCardReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Asset Returned',
                        hide: false,
                        field: 'isAssetReturned',
                        cellRenderer: (params) =>
                          params.data.isAssetReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Employment Status',
                        hide: false,
                        field: 'resourceHeaderStatus',
                        cellRenderer: (params) =>
                          params.data.resourceHeaderStatus
                            ? 'Active'
                            : 'Inactive',
                      },
                    ];
                  }
                  if (this.srnSowJdDetails.managedCapacity === 'Yes') {
                    this.showTotalEffortHours = true;
                    this.resourceDetailscolumnDefs = [
                      {
                        headerName: 'Employee Number',
                        hide: false,
                        field: 'employeeNumber',
                      },
                      {
                        headerName: 'Name',
                        hide: false,
                        field: 'fullname',
                      },
                      {
                        headerName: 'NT ID',
                        hide: false,
                        field: 'ntid',
                      },
                      {
                        headerName: 'Skillset',
                        hide: false,
                        field: 'skillsetName',
                        minWidth: 250,
                      },
                      {
                        headerName: 'Grade',
                        hide: false,
                        field: 'gradeName',
                      },
                      {
                        headerName: 'PO Line Item',
                        hide: false,
                        field: 'poLineItem',
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
                        field: 'effortPMO',
                        valueGetter: this.totalEffortPMONRC.bind(this),
                      },
                      {
                        headerName: 'Cost',
                        hide: false,
                        field: 'cost',
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
                        cellRenderer: (params: any) =>
                          this.currencyPipe.transform(
                            params.data.price,
                            this.companyCurrencyName,
                            this.companyLocale
                          ),
                        valueGetter: this.TMRCPrice.bind(this),
                        // aggFunc: 'totalPrice',
                      },
                      {
                        headerName: 'SOW JD Assigned Date',
                        hide: false,
                        field: 'dateOfJoining',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'SOW JD End Date',
                        hide: false,
                        field: 'contractEndDate',
                        cellRenderer: DateFormatComponent,
                      },
                      {
                        headerName: 'Access Card Returned',
                        hide: false,
                        field: 'isAccessCardReturned',
                        cellRenderer: (params) =>
                          params.data.isAccessCardReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Asset Returned',
                        hide: false,
                        field: 'isAssetReturned',
                        cellRenderer: (params) =>
                          params.data.isAssetReturned ? 'Yes' : 'No',
                      },
                      {
                        headerName: 'Employment Status',
                        hide: false,
                        field: 'resourceHeaderStatus',
                        cellRenderer: (params) =>
                          params.data.resourceHeaderStatus
                            ? 'Active'
                            : 'Inactive',
                      },
                    ];
                  }
                } else {
                  this.resourceDetailscolumnDefs = [
                    {
                      headerName: 'Employee Number',
                      hide: false,
                      field: 'employeeNumber',
                    },
                    {
                      headerName: 'Name',
                      hide: false,
                      field: 'fullname',
                    },
                    {
                      headerName: 'NT ID',
                      hide: false,
                      field: 'ntid',
                    },
                    {
                      headerName: 'Skillset',
                      hide: false,
                      field: 'skillsetName',
                      minWidth: 250,
                    },
                    {
                      headerName: 'Grade',
                      hide: false,
                      field: 'gradeName',
                    },
                    {
                      headerName: 'PO Line Item',
                      hide: false,
                      field: 'poLineItem',
                    },
                    {
                      headerName: 'Absent Days',
                      hide: false,
                      minWidth: 50,
                      editable: true,
                      field: 'absentDays',
                      cellRenderer: InputComponent,
                      onCellValueChanged:
                        this.onCellValueChangedAbsentDays.bind(this),
                    },
                    {
                      headerName: 'Over Time (in days)',
                      hide: false,
                      editable: true,
                      minWidth: 50,
                      field: 'overTime',
                      cellRenderer: InputComponent,
                      onCellValueChanged:
                        this.onCellValueChangedOTDays.bind(this),
                    },
                    {
                      headerName: 'Working Days',
                      hide: false,
                      field: 'maximumworkingdays',
                      valueGetter: this.workingDaysRCGetter.bind(this),
                    },
                    {
                      headerName: 'Effort PMO',
                      hide: false,
                      field: 'effortPMO',
                      valueGetter: this.TMRCEffortPMO.bind(this),
                      // aggFunc: 'totalEffortPMO',
                    },
                    {
                      headerName: 'Cost',
                      hide: false,
                      field: 'cost',
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
                      field: 'dateOfJoining',
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'SOW JD End Date',
                      hide: false,
                      field: 'contractEndDate',
                      cellRenderer: DateFormatComponent,
                    },
                    {
                      headerName: 'Access Card Returned',
                      hide: false,
                      field: 'isAccessCardReturned',
                      cellRenderer: (params) =>
                        params.data.isAccessCardReturned ? 'Yes' : 'No',
                    },
                    {
                      headerName: 'Asset Returned',
                      hide: false,
                      field: 'isAssetReturned',
                      cellRenderer: (params) =>
                        params.data.isAssetReturned ? 'Yes' : 'No',
                    },
                    {
                      headerName: 'Employment Status',
                      hide: false,
                      field: 'resourceHeaderStatus',
                      cellRenderer: (params) =>
                        params.data.resourceHeaderStatus
                          ? 'Active'
                          : 'Inactive',
                    },
                  ];
                }

                this.showWorkpackageCost = false;
                this.showODCCost = false;
              }
            } else if (
              this.srnSowJdDetails.outSourcingCode === 'WP' ||
              this.srnSowJdDetails.outSourcingCode === 'MS'
            ) {
              this.showSRNType = false;
              if (
                this.srnSowJdDetails.sowjdTypeCode == 'RC' ||
                this.srnSowJdDetails.sowjdTypeCode == 'NRC'
              ) {
                this.showResourceEffort = true;
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
                    minWidth: 20,
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

                this.resourceDetailscolumnDefs = [
                  {
                    headerName: 'Employee Number',
                    hide: false,
                    field: 'employeeNumber',
                  },
                  {
                    headerName: 'Name',
                    hide: false,
                    field: 'fullname',
                  },
                  {
                    headerName: 'NT ID',
                    hide: false,
                    field: 'ntid',
                  },
                  {
                    headerName: 'Skillset',
                    hide: false,
                    field: 'skillsetName',
                    minWidth: 250,
                  },
                  {
                    headerName: 'Grade',
                    hide: false,
                    field: 'gradeName',
                  },
                  {
                    headerName: 'PO Line Item',
                    hide: false,
                    field: 'poLineItem',
                  },
                  {
                    headerName: 'SOW JD Assigned Date',
                    hide: false,
                    field: 'dateOfJoining',
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'SOW JD End Date',
                    hide: false,
                    field: 'contractEndDate',
                    cellRenderer: DateFormatComponent,
                  },
                  {
                    headerName: 'Access Card Returned',
                    hide: false,
                    field: 'isAccessCardReturned',
                    cellRenderer: (params) =>
                      params.data.isAccessCardReturned ? 'Yes' : 'No',
                  },
                  {
                    headerName: 'Asset Returned',
                    hide: false,
                    field: 'isAssetReturned',
                    cellRenderer: (params) =>
                      params.data.isAssetReturned ? 'Yes' : 'No',
                  },
                  {
                    headerName: 'Employment Status',
                    hide: false,
                    field: 'resourceHeaderStatus',
                    cellRenderer: (params) =>
                      params.data.resourceHeaderStatus ? 'Active' : 'Inactive',
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
                  {
                    headerName: 'Action',
                    hide: false,
                    editable: false,
                    field: '',
                    cellRenderer: DeleteOdcComponent,
                    cellRendererParams: {
                      delete: (params: any) => {
                        let dialogRef = this.dialog.open(DeleteComponent, {
                          width: '30vw',
                          data: { type: 'delete' },
                        });
                        dialogRef.afterClosed().subscribe((res) => {
                          if (res?.data != null && res?.data == 'yes') {
                            const newOdcList = this.odcList.filter((item) => {
                              return item.odC_ID !== params.data.odC_ID;
                            });
                            this.odcList = newOdcList;
                            this.gridApiODC.setRowData(this.odcList);
                            this.adjustWidth();
                          }
                        });
                      },
                    },
                    suppressMenu: true,
                  },
                ];
              }
            }
            this.adjustWidth();
          },
          error: (e) => {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
          },
          complete: () => {},
        });
    } else {
      this.notifyservice.alert('Please choose billing month.');
      this.isSoWJDReset = true;
      // this.createSrn.get('sowJdId').reset();
    }
  }

  popMessage(title: string, message: string) {
    this.dialog.open(popupMessageComponent, {
      width: '30vw',
      data: {
        title,
        message,
      },
    });
  }

  popMessageForOpenOrdervalue(title: string, message: string) {
    const dialogRef = this.dialog.open(popupMessageComponent, {
      width: '30vw',
      data: {
        title,
        message,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  setFormData() {}
}
