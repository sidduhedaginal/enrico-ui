import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { Observable, map, ReplaySubject } from 'rxjs';
import { IdentifiedskillsetComponent } from '../../popup/identifiedskillset/identifiedskillset.component';
import { VendorSuggestionComponent } from '../../popup/vendor-suggestion/vendor-suggestion.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfirmDeletePopupComponent } from '../../popup/confirm-delete-popup/confirm-delete-popup.component';
import { sowjdService } from '../../services/sowjdService.service';
import { DatePipe } from '@angular/common';
import { MatStepper, MatStepperNext } from '@angular/material/stepper';
import { NotifyService } from '../../services/notify.service';
import { popupMessageComponent } from 'src/app/popup/popup-message/popup-message.component';
import { SuccessComponent } from 'src/app/popup/success/success.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LoaderService } from 'src/app/services/loader.service';
import { DeleteComponent } from 'src/app/vendor/delete/delete.component';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { CommonSignoffComponent } from '../sowjd-signoff/sowjd-signoff-detail/common-signoff/common-signoff.component';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}

@Component({
  selector: 'lib-sowjdform',
  templateUrl: './sowjd-creation-form.component.html',
  styleUrls: ['./sowjd-creation-form.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class SowjdCreationFormComponent implements OnInit {
  public showLoading = true;
  myForm!: FormGroup;
  @ViewChild('stepper')
  private matStepper!: MatStepper;
  private gridApi!: GridApi;
  private gridApiSkillset!: GridApi;
  private gridApiVendor!: GridApi;
  private gridApiPOVendor!: GridApi;
  public sowjddetaildata: any = [];
  public sowjd = '';
  public newSowjdId: string;
  sowJdTypeCode: string;
  outsourcingTypeCode: string;
  public customerTypeId: any;
  sowJdTypeId: any;
  description: any;
  sowjdmasterdata: any = [];
  sowJdStatusDetails: any = [];
  outSourcingTypeDetails: any = [];
  materialGroupDetails: any = [];
  locationModeDetails: any = [];
  customerTypeDetails: any = [];
  budgetCodeDetails: any = [];
  fundCodeDetails: any = [];
  SkillSetName: any = [];
  costcenterdetails: any = [];
  masterIsTheStandardGPAClarified: any = [];
  masterResourceAugmentationOfC2P: any = [];
  masterIsTheProjectGDPRRelevant: any = [];
  repeatOutsourcing: any = ['Yes', 'No'];
  masterIsThisIsARepeatOutsourcing: any = [];
  masterCustomerApprovalAvailable: any = [];
  masterC2PDocumentPrepared: any = [];
  masterC2PAgreement: any = [];
  masterInternalResourceCheckDone: any = [];
  currencyList: any = [];
  gradeDetails: any = [];
  fundCenterMasterDetails: any = [];
  VendorMAsterDetail: any = [];
  wbsMasterDetails: any = [];
  public sowjdDocumentdata: any = [];
  base64Output!: string;
  startDate: any;
  endDate: any;
  docRowdata: any = [];
  inputstatus: any = 'Draft';
  inputstatusId: number;
  statuschange: any;
  formValues: any;
  EventFile: any;
  identifiedSkillsetId: any;
  identifiedSkillsets: any = [];
  recommendedVendors: any = [];
  SowJdNumber: any;
  groupdepartment: any;
  groupsection: any;
  groupbu: any;
  departmentusrdetails: any = [];
  checkReferrence: boolean = false;
  theCheckbox: boolean = false;
  group: any;
  vendorId: any;
  File: any = [];
  id: any;
  internalEquivalentCapacity: any;
  internalEquivalentPMO: any;
  personalCost: any;
  ohCost: any;
  totalCost: any;
  targetSavings: any;
  guidanceCost: any;
  CalculateValues: boolean = true;
  isGridAPIReady: boolean = true;
  routerstring: any;
  routerStringSubmit: any;
  createSowJd: any;
  templateInfo: any;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  public SOWJDID: any;
  CompanyDetail: any = [];
  PlantMasterDetail: any = [];
  wbsIdselectval: any;
  // groupIdselectval: any;
  date = new Date();
  projectStartDate: Date;
  companyId: string;
  companyIdForType: string;
  isBoschCustomer: boolean = false;
  isGlobalCustomer: boolean = false;
  isWBSDropDownReset: boolean = false;
  isGroupDropDownReset: boolean = false;
  isCostCenterDropDownReset: boolean = false;
  isLocationPlantDropDownReset: boolean = false;
  isFundCenterDropDownReset: boolean = false;
  isReferenceDropDownReset: boolean = false;
  isDHorSpocExist: boolean = true;
  deptMessage: string;
  isDisabled: boolean = false;

  public columnDefsSkillSet = [
    {
      headerName: 'SkillSet',
      field: 'skillsetName',
    },
    {
      headerName: 'Classification',
      field: 'classification',
    },
    {
      headerName: 'Grade',
      field: 'gradeName',
    },
    {
      headerName: 'No of Resource',
      field: 'quantity',
    },
    {
      headerName: 'Quantity',
      field: 'duration',
    },
    {
      headerName: 'Unit of Measurement',
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
      headerName: 'Personal Cost',
      field: 'personalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.personalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'OH Cost',
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
      field: 'totalCost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalCost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'Resource Onboarding Date',
      cellRenderer: DateFormatComponent,
      field: 'resourceOnboardingDate',
      resizable: true,
    },
    {
      headerName: 'Action',
      colId: 'action',
      pinned: 'right',
      cellRenderer: this.actionCellRenderer,
      suppressMenu: true,
      resizable: false,
    },
  ];
  public userdetailscolumnDefs = [
    {
      headerName: 'Role',
      hide: false,
      field: 'role',
      resizable: true,
    },
    {
      headerName: 'Name',
      hide: false,
      field: 'name',
      resizable: true,
    },
    {
      headerName: 'Email',
      hide: false,
      field: 'email',
      resizable: false,
    },
  ];
  autoGroupColumnDef: ColDef = { minWidth: 200 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    //Auto-Width Fix
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 2,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    autoHeight: true,
    wrapText: true,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any; //Auto-Width Fix
  columnApiSkillset: any;
  columnApiVendor: any;

  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  public gridOptions: GridOptions = {};
  stepperOrientation: Observable<StepperOrientation>;
  FileRowdata: any = [];

  public rowData = [];
  rowDataPOVendor = [];

  columnDefsPOVendor = [
    {
      headerName: 'Vendor',
      field: 'vendorName',
    },
    {
      headerName: 'Vendor ID',
      field: 'vendorSapId',
    },
    {
      headerName: 'Cost',
      field: 'cost',
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.cost,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    {
      headerName: 'OCI',
      field: 'oci',
    },
    {
      headerName: 'Suggestion',
      field: 'suggestion',
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      resizable: true,
    },

    {
      field: 'Action',
      colId: 'action',
      pinned: 'right',
      cellRenderer: this.actionCellRenderervendor,
      suppressMenu: true,
      resizable: false,
    },
  ];
  columnDefsPOVendorNRC = [
    {
      headerName: 'Vendor',
      field: 'vendorName',
    },
    {
      headerName: 'Vendor ID',
      field: 'vendorSapId',
    },
    {
      headerName: 'Remarks',
      field: 'remarks',
      resizable: true,
    },

    {
      field: 'Action',
      colId: 'action',
      pinned: 'right',
      cellRenderer: this.actionCellRenderervendor,
      suppressMenu: true,
      resizable: false,
    },
  ];

  @ViewChild('fileInput') inputfile;

  constructor(
    private _formBuilder: FormBuilder,
    breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    public sowjdService: sowjdService,
    private notifyservice: NotifyService,
    private router: Router,
    private avtiveroutes: ActivatedRoute,
    private loaderService: LoaderService,
    private ref: ChangeDetectorRef,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe
  ) {
    // setInterval(() => {
    //   this.departmentDetails.get('group');
    //   console.log(this.departmentDetails.get('group'));
    //   this.ref.markForCheck();
    // }, 3000);

    // this.projectStartDate = new Date(
    //   this.date.setDate(this.date.getDate() + 1)
    // );

    this.projectStartDate = this.sowjdService.addNumberOfdays(this.date, 10);

    this.avtiveroutes.queryParams.subscribe((query: any) => {
      this.routerstring = query.clone;
      this.newSowjdId = query.newSowjdId;
      this.routerStringSubmit = query.submit;
    });
    this.route.params.subscribe((params: Params) => {
      this.SOWJDID = params['id'];
      this.identifiedSkillsetId = this.SOWJDID;
      this.vendorId = this.SOWJDID;
    });
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  getValidityEndMinDate(): Date | any {
    return this.sowjdService.addNumberOfCalendardays(
      new Date(this.purchaseOrder.controls['startDate'].value),
      30
    );
  }

  getValidityEndMaxDate(): Date | any {
    return this.sowjdService.addNumberOfCalendardays(
      new Date(this.purchaseOrder.controls['startDate'].value),
      730
    );
  }

  changedEventWBSValue(wbsCode: MatAutocompleteSelectedEvent) {
    this.projectInfo.get('wbsId')?.setValue(wbsCode);
  }

  changedEventReferenceValue(reference: MatAutocompleteSelectedEvent) {
    this.projectInfo.get('sowjdReference')?.setValue(reference);
  }

  changedEventCostcenterValue(costCenter: MatAutocompleteSelectedEvent) {
    this.purchaseOrder.get('costCenter')?.setValue(costCenter);
  }

  changedFundCenterEvent(fundCenterId: MatAutocompleteSelectedEvent) {
    this.purchaseOrder.get('fundCenterId')?.setValue(fundCenterId);
  }

  changedLocationPlantEvent(plantId: MatAutocompleteSelectedEvent) {
    this.projectInfo.get('plantId')?.setValue(plantId);
  }

  changedEventValue(groupCode: MatAutocompleteSelectedEvent) {
    this.loaderService.setShowLoading();
    this.departmentDetails.get('group')?.setValue(groupCode);

    const groudpCodeObj = {
      groupCode: groupCode,
    };

    this.sowjdService.getSectionDepartmentByGroup(groudpCodeObj).subscribe({
      next: (res: any) => {
        if (
          res.data.sectionName != null &&
          res.data.departmentName != null &&
          res.data.buName != null
        ) {
          this.groupsection = res.data.sectionName;
          this.groupdepartment = res.data.departmentName;
          this.groupbu = res.data.buName;
          this.departmentDetails
            .get('section')
            ?.setValue(res.data?.sectionName);
          this.departmentDetails
            .get('department')
            ?.setValue(res.data?.departmentName);
          this.getDepartmentUserDetails(groudpCodeObj);
        } else {
          this.notifyservice.alert('Please Enter Correct Group Code.');
        }
      },
      error: (e) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {},
    });
  }

  getDepartmentUserDetails(groudpCodeObj: any) {
    if (groudpCodeObj.groupCode) {
      this.sowjdService.getDepartmentUserDetails(groudpCodeObj).subscribe({
        next: (res: any) => {
          this.loaderService.setDisableLoading();
          if (res.data.message === '') {
            this.isDHorSpocExist = true;
            this.departmentusrdetails = res.data.usersInGroups;
            // this.gridApi.setDomLayout('autoHeight');
          } else {
            // If DH/Section Spoc desn't exist in user department
            this.isDHorSpocExist = false;
            this.departmentusrdetails = res.data.usersInGroups;
            // this.gridApi.setDomLayout('autoHeight');
            this.deptMessage = res.data.message;
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {},
      });
    }
  }

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.GetFilters();
    this.getVendorMasterDetail();
    this.getDocuments();

    if (this.SOWJDID && this.routerstring == 'clone') {
      this.identifiedSkillsetId = this.SOWJDID;
      this.vendorId = this.SOWJDID;

      this.sowjdService.getSowjdRequestById(this.newSowjdId).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.loaderService.setDisableLoading();
            this.onCompanyChangeValueExist(
              res.data.sowJdEntityResponse.companyId
            );
            this.sowjddetaildata = res.data.sowJdEntityResponse;
            this.sowJdTypeCode = res.data.sowJdEntityResponse.sowJdTypeCode;
            this.outsourcingTypeCode =
              res.data.sowJdEntityResponse.outsourcingTypeCode;

            this.formValues = res.data.sowJdEntityResponse;

            if (this.formValues) {
              this.checkDisabledFields();
            }

            this.SowJdNumber = this.formValues.sowJdNumber;
            this.companyIdForType = this.formValues.companyId;
            this.sowJdTypeId = this.formValues.sowJdTypeId;
            this.inputstatus = this.formValues.statusName;
            this.inputstatusId = this.formValues.status;

            if (this.inputstatusId !== 1) {
              this.isDisabled = true;
            } else {
              this.isDisabled = false;
            }

            this.description = this.formValues.description;
            this.customerTypeId = this.formValues.customerTypeId;
            if (this.formValues.sowjdReference) {
              this.checkReferrence = true;
              this.theCheckbox = true;
            }
            if (this.formValues.group) {
              this.group = this.formValues.group;
              this.onGroupSearch();
            } else {
              this.groupsection = '';
              this.groupdepartment = '';
              this.groupbu = '';
              this.departmentusrdetails = [];
            }

            this.internalEquivalentCapacity =
              res.data.sowJdEntityResponse.internalEquivalentCapacity;
            this.internalEquivalentPMO =
              res.data.sowJdEntityResponse.internalEquivalentPMO;
            this.personalCost = res.data.sowJdEntityResponse.personalCost;
            this.ohCost = res.data.sowJdEntityResponse.ohCost;
            this.totalCost = res.data.sowJdEntityResponse.totalCost;
            this.targetSavings = res.data.sowJdEntityResponse.targetSavings;
            this.guidanceCost = res.data.sowJdEntityResponse.guidanceCost;

            this.getIdentifiedSkillset();
            this.getVendorSuggestions();
            this.setFormData();
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {},
      });
    } else if (this.SOWJDID && this.routerStringSubmit == 'update') {
      this.sowjdService.getSowjdRequestById(this.SOWJDID).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.loaderService.setDisableLoading();
            this.onCompanyChangeValueExist(
              res.data.sowJdEntityResponse.companyId
            );
            this.sowjddetaildata = res.data.sowJdEntityResponse;
            this.sowJdTypeCode = res.data.sowJdEntityResponse.sowJdTypeCode;
            this.outsourcingTypeCode =
              res.data.sowJdEntityResponse.outsourcingTypeCode;
            this.formValues = res.data.sowJdEntityResponse;

            this.companyCurrencyName = this.formValues?.currencyName;

            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            if (this.formValues) {
              this.checkDisabledFields();
            }

            this.SowJdNumber = this.formValues.sowJdNumber;
            this.companyIdForType = this.formValues.companyId;
            this.sowJdTypeId = this.formValues.sowJdTypeId;
            this.inputstatus = this.formValues.statusName;
            this.inputstatusId = this.formValues.status;

            if (this.inputstatusId !== 1) {
              this.isDisabled = true;
            }
            this.description = this.formValues.description;

            this.customerTypeId = this.formValues.customerTypeId;

            if (this.formValues.sowjdReference) {
              this.checkReferrence = true;
              this.theCheckbox = true;
            }
            if (this.formValues.group) {
              this.group = this.formValues.group;
              this.onGroupSearch();
            } else {
              this.groupsection = '';
              this.groupdepartment = '';
              this.groupbu = '';
              this.departmentusrdetails = [];
            }

            this.internalEquivalentCapacity =
              res.data.sowJdEntityResponse.internalEquivalentCapacity;
            this.internalEquivalentPMO =
              res.data.sowJdEntityResponse.internalEquivalentPMO;
            this.personalCost = res.data.sowJdEntityResponse.personalCost;
            this.ohCost = res.data.sowJdEntityResponse.ohCost;
            this.totalCost = res.data.sowJdEntityResponse.totalCost;
            this.targetSavings = res.data.sowJdEntityResponse.targetSavings;
            this.guidanceCost = res.data.sowJdEntityResponse.guidanceCost;

            this.getIdentifiedSkillset();
            this.getVendorSuggestions();
            this.setFormData();
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {},
      });
    } else if (this.SOWJDID && this.routerStringSubmit == 'submit') {
      this.sowjdService.getSowjdRequestById(this.SOWJDID).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.loaderService.setDisableLoading();
            this.onCompanyChangeValueExist(
              res.data.sowJdEntityResponse.companyId
            );
            this.sowjddetaildata = res.data.sowJdEntityResponse;
            this.sowJdTypeCode = res.data.sowJdEntityResponse.sowJdTypeCode;
            this.outsourcingTypeCode =
              res.data.sowJdEntityResponse.outsourcingTypeCode;
            this.formValues = res.data.sowJdEntityResponse;

            this.companyCurrencyName = this.formValues?.currencyName;

            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            if (this.formValues) {
              this.checkDisabledFields();
            }
            this.inputstatus = this.formValues.statusName;
            this.inputstatusId = this.formValues.status;
            this.companyIdForType = this.formValues.companyId;
            this.sowJdTypeId = this.formValues.sowJdTypeId;

            if (this.inputstatusId !== 1) {
              this.isDisabled = true;
            }

            this.customerTypeId = this.formValues.customerTypeId;

            if (this.formValues.sowjdReference) {
              this.checkReferrence = true;
              this.theCheckbox = true;
            }
            if (this.formValues.group) {
              this.group = this.formValues.group;
              this.onGroupSearch();
            } else {
              this.groupsection = '';
              this.groupdepartment = '';
              this.groupbu = '';
              this.departmentusrdetails = [];
            }

            this.internalEquivalentCapacity =
              res.data.sowJdEntityResponse.internalEquivalentCapacity;
            this.internalEquivalentPMO =
              res.data.sowJdEntityResponse.internalEquivalentPMO;
            this.personalCost = res.data.sowJdEntityResponse.personalCost;
            this.ohCost = res.data.sowJdEntityResponse.ohCost;
            this.totalCost = res.data.sowJdEntityResponse.totalCost;
            this.targetSavings = res.data.sowJdEntityResponse.targetSavings;
            this.guidanceCost = res.data.sowJdEntityResponse.guidanceCost;

            this.SOWJDID = res.data.sowJdEntityResponse.id;
            this.SowJdNumber = res.data.sowJdEntityResponse.sowJdNumber;
            this.identifiedSkillsetId = this.SOWJDID;
            this.vendorId = this.SOWJDID;

            this.getIdentifiedSkillset();
            this.getVendorSuggestions();
            this.setFormData();
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {},
      });
    } else {
      this.sowjdService.getSowjdRequestById(this.SOWJDID).subscribe({
        next: (res: any) => {
          if (res.data) {
            this.loaderService.setDisableLoading();
            this.onCompanyChangeValueExist(
              res.data.sowJdEntityResponse.companyId
            );
            this.formValues = res.data.sowJdEntityResponse;

            this.SowJdNumber = this.formValues.sowJdNumber;
            this.inputstatus = this.formValues.statusName;
            this.inputstatusId = this.formValues.status;
            this.companyIdForType = this.formValues.companyId;
            this.sowJdTypeId = this.formValues.sowJdTypeId;

            this.companyCurrencyName = this.formValues?.currencyName;

            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            if (this.inputstatusId !== 1) {
              this.isDisabled = true;
            }
            this.sowjddetaildata = res.data.sowJdEntityResponse;
            this.sowJdTypeCode = res.data.sowJdEntityResponse.sowJdTypeCode;
            this.outsourcingTypeCode =
              res.data.sowJdEntityResponse.outsourcingTypeCode;

            if (this.formValues) {
              this.checkDisabledFields();
            }
            if (this.formValues.sowjdReference) {
              this.checkReferrence = true;
              this.theCheckbox = true;
            }
            if (this.formValues.group) {
              this.group = this.formValues.group;
              this.onGroupSearch();
            } else {
              this.groupsection = '';
              this.groupdepartment = '';
              this.groupbu = '';
              this.departmentusrdetails = [];
            }

            this.internalEquivalentCapacity =
              res.data.sowJdEntityResponse.internalEquivalentCapacity;
            this.internalEquivalentPMO =
              res.data.sowJdEntityResponse.internalEquivalentPMO;
            this.personalCost = res.data.sowJdEntityResponse.personalCost;
            this.ohCost = res.data.sowJdEntityResponse.ohCost;
            this.totalCost = res.data.sowJdEntityResponse.totalCost;
            this.targetSavings = res.data.sowJdEntityResponse.targetSavings;
            this.guidanceCost = res.data.sowJdEntityResponse.guidanceCost;
            this.setFormData();
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {},
      });
    }
    this.myForm = this.makeForm();

    this.getIdentifiedSkillset();
    this.getVendorSuggestions();
  }

  checkDisabledFields() {
    if (this.formValues.sowJdTypeId) {
      this.projectInfo.controls['sowJdTypeId'].disable();
      this.projectInfo.controls['companyId'].disable();
      this.projectInfo.controls['resourceLocationId'].disable();
      this.projectInfo.controls['outsourcingTypeId'].disable();
      this.projectInfo.controls['customerTypeId'].disable();
    }

    if (this.formValues.group && this.isDHorSpocExist) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }
  getSowjdRequestById() {
    this.loaderService.setShowLoading();
    this.sowjdService.getSowjdRequestById(this.SOWJDID).subscribe({
      next: (res: any) => {
        if (res.data) {
          this.loaderService.setDisableLoading();

          this.internalEquivalentCapacity =
            res.data.sowJdEntityResponse.internalEquivalentCapacity;
          this.internalEquivalentPMO =
            res.data.sowJdEntityResponse.internalEquivalentPMO;
          this.personalCost = res.data.sowJdEntityResponse.personalCost;
          this.ohCost = res.data.sowJdEntityResponse.ohCost;
          this.totalCost = res.data.sowJdEntityResponse.totalCost;
          this.targetSavings = res.data.sowJdEntityResponse.targetSavings;
          this.guidanceCost = res.data.sowJdEntityResponse.guidanceCost;
        }
      },
    });
  }

  isNumberKey(evt) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = evt.target.value + String.fromCharCode(evt.charCode);

    if (!reg.test(input)) {
      evt.preventDefault();
    }
  }

  getDocuments() {
    if (this.SOWJDID != -1) {
      if (this.routerstring == 'clone') {
        this.sowjdService
          .getDocuments(this.newSowjdId)
          .subscribe((res: any) => {
            this.sowjdDocumentdata = res;
            this.docRowdata = res.data;
          });
      } else {
        this.sowjdService.getDocuments(this.SOWJDID).subscribe((res: any) => {
          this.sowjdDocumentdata = res;
          this.docRowdata = res.data;
        });
      }
    }
  }
  deleteDocument(doc: any, i: number) {
    let dialogRef = this.dialog.open(DeleteComponent, {
      width: '30vw',
      data: { type: 'delete' },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.data != null && res?.data == 'yes') {
        this.loaderService.setShowLoading();
        const deldoc: any = {
          sowjdId: doc.sowJdId,
          documents: [
            {
              id: doc.id,
              documentName: doc.documentName,
              documentContent: 'string',
              action: 2,
            },
          ],
        };
        this.sowjdService.deleteDocuments(deldoc).subscribe((res: any) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert('Document deleted Successful');
          this.getDocuments();
          this.deleteLocalDocument(i);
        });
      }
    });
  }

  deleteLocalDocument(i: any) {
    this.File = this.File.filter((item: any, index: any) => {
      return index !== i;
    });
  }

  OnDocumentsReady(params: GridReadyEvent) {
    if (this.SOWJDID != -1) {
      this.getDocuments();
    } else {
      this.docRowdata = this.File;
    }
    this.gridApi = params.api;
  }

  actionCellRenderervendor(params: any) {
    return '<div class="icon-class_requestlist" ><span class="deleteblue" title="Delete"></span></div>';
  }

  getVendorMasterDetail() {
    this.loaderService.setDisableLoading();
    this.sowjdService.getVendorMasterDetail().subscribe((res: any) => {
      this.loaderService.setDisableLoading();
      this.VendorMAsterDetail = res.data.object;
    });
  }

  GetFilters() {
    this.loaderService.setDisableLoading();
    this.sowjdService.getSowjdMasterData().subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.sowjdmasterdata = res.data;
        this.wbsMasterDetails = res.data.wbsMasterDetails;
        this.CompanyDetail = res.data.companyMasterDetails;
        this.customerTypeDetails = res.data.customerTypeDetails;
        this.masterInternalResourceCheckDone =
          res.data.masterInternalResourceCheckDone;
        this.masterCustomerApprovalAvailable =
          res.data.masterCustomerApprovalAvailable;
        this.masterIsTheProjectGDPRRelevant =
          res.data.masterIsTheProjectGDPRRelevant;
        this.masterIsTheStandardGPAClarified =
          res.data.masterIsTheStandardGPAClarified;
        this.masterC2PAgreement = res.data.masterC2PAgreement;
        this.masterResourceAugmentationOfC2P =
          res.data.masterResourceAugmentationOfC2P;
        this.masterC2PDocumentPrepared = res.data.masterC2PDocumentPrepared;
        this.locationModeDetails = res.data.masterResourceLocation;
        this.outSourcingTypeDetails = res.data.outSourcingTypeDetails;
        this.costcenterdetails = res.data.costCenterDetails;
        this.budgetCodeDetails = res.data.budgetCodeDetails;
        this.PlantMasterDetail = res.data.plantMasterDetails;
        this.materialGroupDetails = res.data.materialGroupDetails;
        this.fundCodeDetails = res.data.fundCodeDetails;
        this.fundCenterMasterDetails = res.data.fundCenterMasterDetails;

        this.sowJdStatusDetails = res.data.sowJdStatusDetails;
        this.masterIsThisIsARepeatOutsourcing =
          res.data.masterIsThisIsARepeatOutsourcing;
        this.gradeDetails = res.data.gradeDetails;
      },
      error: (e) => {},
      complete: () => {
        console.info('complete');
      },
    });
  }

  downloadTemplate() {
    this.sowjdService.downloadTemplate().subscribe(
      (res: any) => {
        this.templateInfo = res;

        const link = document.createElement('a');
        link.setAttribute('target', '_blank');
        link.setAttribute(
          'href',
          `${this.templateInfo?.data[0].templateUrl}${this.templateInfo?.sasToken}`
        );
        link.setAttribute(
          'download',
          `${this.templateInfo?.data[0].templateName}`
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
      (error) => {
        this.notifyservice.alert(error.data.errorDetails[0].errorCode);
      }
    );
  }

  resetDropdown(value: boolean) {
    this.isWBSDropDownReset = value;
  }

  resetReferenceDropdown(value: boolean) {
    this.isReferenceDropDownReset = value;
  }
  resetGroupDropdown(value: boolean) {
    this.isGroupDropDownReset = value;
  }

  resetCostCenterDropdown(value: boolean) {
    this.isCostCenterDropDownReset = value;
  }

  resetLocationPlantDropdown(value: boolean) {
    this.isLocationPlantDropDownReset = value;
  }

  resetFundCenterDropdown(value: boolean) {
    this.isFundCenterDropDownReset = value;
  }

  onCompanyChangeValueExist(value: string) {
    this.loaderService.setShowLoading();
    this.companyId = value;
    if (this.companyId) {
      this.sowjdService.getOnCompanyChange(value).subscribe({
        next: (res: any) => {
          this.loaderService.setDisableLoading();
          this.budgetCodeDetails = res.data.budgetCodeDetails;

          this.currencyList = res.data.currencyDetails;

          if (this.currencyList.length > 0) {
            this.projectInfo
              .get('currencyTypeId')
              ?.setValue(this.currencyList[0].id);
          }

          if (value === '7d20e3e4-d336-4c27-b04c-0cf494ab7535') {
            // For 6520
            this.budgetCodeDetails.find((item) => {
              if (item.id === '8a312ff4-49d1-41ac-8fc6-3c531d22196f') {
                this.purchaseOrder.get('budgetCodeId')?.setValue(item.id);
              }
            });
          } else if (value === '8d20e3e4-d336-4c27-b04c-0cf494ab7535') {
            // For 38F0
            this.budgetCodeDetails.find((item) => {
              if (item.id === '95841a24-7fa0-4db6-b361-caf05c22aa34') {
                this.purchaseOrder.get('budgetCodeId')?.setValue(item.id);
              }
            });
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
    }
  }

  onCompanyChange(value: string) {
    this.companyId = value;
    this.isWBSDropDownReset = true;
    this.isGroupDropDownReset = true;
    this.isCostCenterDropDownReset = true;
    this.isLocationPlantDropDownReset = true;
    this.isFundCenterDropDownReset = true;

    this.departmentDetails.reset();
    this.departmentDetails.get('group')?.setValue(null);

    // this.SaveForm('projectinfo');
    // this.SaveForm('userdetail');

    // this.groupsection = '';
    // this.groupdepartment = '';
    // this.groupbu = '';
    // this.departmentusrdetails = [];

    // this.changedEventValue(null);
    this.onCompanyChangeValueExist(value);
  }

  setRequired() {
    return [Validators.required];
  }

  /*
    Checking customer and GDPR type 
  */

  onGdprChange() {
    // Customer - Boach
    if (
      this.projectInfo.value.customerTypeId ==
        '8b8d28d4-d636-4fb3-b6c0-47f4cb251360' &&
      this.projectInfo.value.isprojectGDPRRelevant === 1
    ) {
      // C2PAgreement, ResourceAugmentationNeedExtensionOfC2P and C2PDocumentPrepared - Set null and Clear Validation
      this.projectInfo.controls['c2PAgreement'].setValue(null);
      this.projectInfo.controls[
        'isResourceAugmentationNeedExtensionOfC2P'
      ].setValue(null);
      this.projectInfo.controls['c2PDocumentPrepared'].setValue(null);

      this.projectInfo.get('c2PAgreement')?.clearValidators();
      this.projectInfo.get('c2PAgreement')?.updateValueAndValidity();

      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.clearValidators();
      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.updateValueAndValidity();

      this.projectInfo.get('c2PDocumentPrepared')?.clearValidators();
      this.projectInfo.get('c2PDocumentPrepared')?.updateValueAndValidity();

      // GPA - add validation
      this.projectInfo
        .get('isStandardGPAIsSufficient')
        .setValidators([Validators.required]);
      this.projectInfo
        .get('isStandardGPAIsSufficient')
        ?.updateValueAndValidity();

      this.isBoschCustomer = true;
      this.isGlobalCustomer = false;
    } else if (
      // Customer - Global
      this.projectInfo.value.customerTypeId ==
        '72f96316-01ed-4453-8385-d973c1ad594f' &&
      this.projectInfo.value.isprojectGDPRRelevant === 1
    ) {
      // GPA - Set null and Clear Validation
      this.projectInfo.controls['isStandardGPAIsSufficient'].setValue(null);
      this.projectInfo.get('isStandardGPAIsSufficient').clearValidators();
      this.projectInfo
        .get('isStandardGPAIsSufficient')
        ?.updateValueAndValidity();

      // C2PAgreement, ResourceAugmentationNeedExtensionOfC2P and C2PDocumentPrepared - add validation
      this.projectInfo
        .get('c2PAgreement')
        ?.setValidators([Validators.required]);
      this.projectInfo.get('c2PAgreement')?.updateValueAndValidity();

      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.setValidators([Validators.required]);
      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.updateValueAndValidity();

      this.projectInfo
        .get('c2PDocumentPrepared')
        ?.setValidators([Validators.required]);
      this.projectInfo.get('c2PDocumentPrepared')?.updateValueAndValidity();

      this.isGlobalCustomer = true;
      this.isBoschCustomer = false;
    } else {
      this.projectInfo.get('c2PAgreement')?.clearValidators();
      this.projectInfo.get('c2PAgreement')?.updateValueAndValidity();

      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.clearValidators();
      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.updateValueAndValidity();

      this.projectInfo.get('c2PDocumentPrepared')?.clearValidators();
      this.projectInfo.get('c2PDocumentPrepared')?.updateValueAndValidity();

      this.projectInfo.get('isStandardGPAIsSufficient').clearValidators();
      this.projectInfo
        .get('isStandardGPAIsSufficient')
        ?.updateValueAndValidity();

      this.projectInfo.controls['isStandardGPAIsSufficient'].setValue(null);
      this.projectInfo.controls['c2PAgreement'].setValue(null);
      this.projectInfo.controls[
        'isResourceAugmentationNeedExtensionOfC2P'
      ].setValue(null);
      this.projectInfo.controls['c2PDocumentPrepared'].setValue(null);

      this.isGlobalCustomer = false;
      this.isBoschCustomer = false;
    }
  }

  onCellClicked(params: any): void {
    let deleteblueskillset = params.event.target.className;
    let veiwlskill = params.event.target.className;
    if (
      params.column.colId === 'action' &&
      deleteblueskillset === 'deleteblueskillset'
    ) {
      if (this.rowDataPOVendor.length > 0) {
        this.notifyservice.alert(
          'You cannot delete skillset when vendor is available'
        );
      } else {
        this.removeSkillset(params);
      }
    } else if (
      params.column.colId === 'action' &&
      veiwlskill === 'veiwlskill'
    ) {
      this.addNewSkillSetPopup(params);
    }
  }
  onCellClickedPOVendor(params: any): void {
    let deleteblue = params.event.target.className;
    if (params.column.colId === 'action' && deleteblue === 'deleteblue') {
      this.removeVendor(params);
    }
  }
  removeVendor(params: any): void {
    const dialogRef_ = this.dialog.open(ConfirmDeletePopupComponent, {
      width: '30vw',
      data: { params: params, skillset: false },
    });
    dialogRef_.afterClosed().subscribe((result: any) => {
      if (result.RemoveVender) {
        //
        this.loaderService.setShowLoading();
        this.sowjdService
          .removeVenderSuggestions(result.RemoveVender)
          .subscribe({
            next: (v) => {
              this.notifyservice.alert('Vendor deleted successful.');
              this.loaderService.setDisableLoading();
              this.getVendorSuggestions();
            },
            error: (e) => {
              this.loaderService.setDisableLoading();
              console.error(e.error.data.errorDetails[0].errorCode);
              this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
            },
            complete: () => {
              console.info('complete');
            },
          });
      }
    });
  }
  removeSkillset(params: any): void {
    const dialogRef_ = this.dialog.open(ConfirmDeletePopupComponent, {
      width: '30vw',
      data: { params, skillset: true },
    });
    dialogRef_.afterClosed().subscribe((result: any) => {
      if (result.Removeskillset) {
        this.loaderService.setShowLoading();
        this.sowjdService.removeSkillSet(result.Removeskillset).subscribe({
          next: (v) => {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Skillset deleted successful.');
            this.getSowjdRequestById();
            this.getIdentifiedSkillset();
          },
          error: (e) => {
            this.loaderService.setDisableLoading();
            console.error(e.error.data.errorDetails[0].errorCode);
            this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
          },
          complete: () => {
            console.info('complete');
          },
        });
      }
    });
  }

  actionCellRenderer(params: any) {
    return '<div class="icon-class_requestlist" ><span class="deleteblueskillset" title="Delete"></span></div>';
  }

  weekendsDatesFilter: any = (date: Date) => {
    date = new Date(date);
    let day = date.getDay();
    return day !== 0 && day !== 6;
  };

  addNewSkillSetPopup(params: any) {
    if (this.rowDataPOVendor.length > 0) {
      this.notifyservice.alert(
        'Please delete vendor suggestion before adding new skillset'
      );
    } else {
      let dialogRef = this.dialog.open(IdentifiedskillsetComponent, {
        width: '50vw',
        data: {
          data: params.data,
          gradeDetails: this.gradeDetails,
          sowJdId: this.SOWJDID,
          startDate: this.purchaseOrder.value.startDate,
          endDate: this.purchaseOrder.value.endDate,
          sowJdTypeCode: this.sowJdTypeCode,
          outsourcingTypeCode: this.outsourcingTypeCode,
          companyId: this.companyIdForType,
          skillSets: this.rowData,
        },
      });
      dialogRef.afterClosed().subscribe((res: any) => {
        if (res?.data) {
          this.getSowjdRequestById();
          this.getIdentifiedSkillset();
          this.notifyservice.alert('Skillset added successful.');
        }
      });
    }
  }

  // popMessageWithAction(title: string, message: string) {
  //   const dialogRef = this.dialog.open(popupMessageComponent, {
  //     width: '30vw',
  //     data: {
  //       title,
  //       message,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result: any) => {});
  // }

  getIdentifiedSkillset() {
    this.loaderService.setShowLoading();
    this.sowjdService.getSkillSet(this.SOWJDID).subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.rowData = res.data;
        this.gridApiSkillset?.setRowData(this.rowData);
        this.adjustAll();
      },
      error: (e) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {},
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isGridAPIReady && changes['rowData']) {
      this.gridOptions.api?.setRowData(this.rowData);
    } else if (this.isGridAPIReady && changes['rowDataPOVendor']) {
      this.gridOptions.api?.setRowData(this.rowDataPOVendor);
    } else if (this.isGridAPIReady && changes['FileRowdata']) {
      this.gridOptions.api?.setRowData(this.FileRowdata);
    }
  }
  goToNext(next: string) {
    this.myForm.get(next)?.markAllAsTouched();
    if (this.myForm.get(next)?.invalid) return;
    this.matStepper.next();
  }
  get projectInfo(): FormGroup {
    return this.myForm.get('projInfo') as FormGroup;
  }
  get departmentDetails(): FormGroup {
    return this.myForm?.get('deptDetails') as FormGroup;
  }
  get purchaseOrder(): FormGroup {
    return this.myForm.get('PO') as FormGroup;
  }
  get costSkillsetVendors(): FormGroup {
    return this.myForm.get('costskillset') as FormGroup;
  }
  get MyForm() {
    return this.myForm as FormGroup;
  }
  onGroupSearch() {
    const userdetailss: any = {
      ...this.departmentDetails.value,
    };
    var groupCodeObj;
    if (this.group) {
      groupCodeObj = {
        groupCode: this.group,
      };
    } else {
      groupCodeObj = {
        groupCode: userdetailss.group,
      };
    }

    if (groupCodeObj.groupCode) {
      this.changedEventValue(groupCodeObj.groupCode);
    }
  }
  MyUserDetails(params: GridReadyEvent) {
    this.gridApi = params.api;
    //  //Auto-Width Fix -start - this function need to be added in every OngridReady function
    //  this.gridApi = params.api;
    //  this.columnApi = params.columnApi;
    //  this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    //  this.gridApi.hideOverlay();
    //  if (
    //   this.departmentusrdetails == null ||
    //   this.departmentusrdetails == undefined ||
    //   this.departmentusrdetails.length <= 0
    // )
    //    this.gridApi.showNoRowsOverlay();
    //  this.gridApi.addEventListener(
    //    'bodyScroll',
    //    this.onHorizontalScroll.bind(this)
    //  );
    //  this.gridApi.hideOverlay();
    //  this.adjustWidth();
    //    //Auto-Width Fix -end
  }

  addNewRowVendorPop() {
    if (this.projectInfo.get('resourceLocationId').value) {
      if (this.rowData.length > 0) {
        const dialogRef = this.dialog.open(VendorSuggestionComponent, {
          width: '40vw',
          data: {
            sowJdId: this.SOWJDID,
          },
        });

        dialogRef.afterClosed().subscribe((result: any) => {
          if (result?.VendorDetail) {
            this.loaderService.setShowLoading();
            this.sowjdService
              .postVendorSuggestion(result.VendorDetail)
              .subscribe((response: any) => {
                if (response.status === 'success') {
                  this.notifyservice.alert('Vendor added successful.');
                  this.loaderService.setDisableLoading();
                  this.getVendorSuggestions();
                }
              });
          }
        });
      } else {
        this.notifyservice.alert(
          'Vendor suggestions is depend on skillset so please add skillset.'
        );
      }
    } else {
      this.notifyservice.alert('Please add Location Mode');
    }
  }
  getVendorSuggestions() {
    this.sowjdService.getVendorSuggestion(this.SOWJDID).subscribe({
      next: (res: any) => {
        this.rowDataPOVendor = res.data;
        this.CalculateValues = false;

        this.gridApiVendor?.setRowData(this.rowDataPOVendor);
        this.adjustAll();
      },
      error: (e) => {},
      complete: () => {},
    });
  }

  onRepeatOutsourcing() {
    this.isReferenceDropDownReset = true;
    this.projectInfo.get('sowjdReference')?.setValue(null);
    if (this.projectInfo.value.isRepeatOutsourcing === 'Yes') {
      // if (!this.companyId) {
      //   this.projectInfo.get('isRepeatOutsourcing')?.setValue('No');
      //   this.notifyservice.alert('Please choose Company');
      //   return false;
      // }
      this.checkReferrence = true;
      this.projectInfo
        .get('sowjdReference')
        ?.setValidators([Validators.required]);
      this.projectInfo.get('sowjdReference')?.updateValueAndValidity();
    } else {
      this.checkReferrence = false;
      this.projectInfo.get('sowjdReference')?.clearValidators();
      this.projectInfo.get('sowjdReference')?.updateValueAndValidity();
    }
  }

  checkCheckBoxvalue(event: any) {
    this.isReferenceDropDownReset = true;
    this.projectInfo.get('sowjdReference')?.setValue(null);
    if (event.checked) {
      this.checkReferrence = true;
      this.projectInfo
        .get('sowjdReference')
        ?.setValidators([Validators.required]);
      this.projectInfo.get('sowjdReference')?.updateValueAndValidity();
    } else {
      this.checkReferrence = false;
      this.projectInfo.get('sowjdReference')?.clearValidators();
      this.projectInfo.get('sowjdReference')?.updateValueAndValidity();
    }
  }
  onSkillsetGridReady(params: GridReadyEvent) {
    this.gridApiSkillset = params.api;
    this.columnApiSkillset = params.columnApi;
    this.gridApiSkillset.refreshCells({ force: true });
    this.gridApiSkillset.setDomLayout('autoHeight');
    this.gridApiSkillset.hideOverlay();
    if (
      this.rowData == null ||
      this.rowData == undefined ||
      this.rowData.length <= 0
    )
      this.gridApiSkillset.showNoRowsOverlay();
    this.gridApiSkillset.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiSkillset.hideOverlay();
    this.adjustAll();
    //Auto-Width Fix -end
  }

  onGridReadyPOVendor(params: GridReadyEvent) {
    this.gridApiVendor = params.api;
    this.columnApiVendor = params.columnApi;

    this.gridApiVendor.refreshCells({ force: true });
    this.gridApiVendor.setDomLayout('autoHeight');
    this.gridApiVendor.hideOverlay();
    if (
      this.rowDataPOVendor == null ||
      this.rowDataPOVendor == undefined ||
      this.rowDataPOVendor.length <= 0
    )
      this.gridApiVendor.showNoRowsOverlay();
    this.gridApiVendor.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiVendor.hideOverlay();

    this.adjustAll();
  }
  onstatusChange(event: any) {
    this.inputstatus = event.target.value;
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
      this.File.push({
        documentContent: this.base64Output,
        documentName: this.EventFile.name,
        id: this.SOWJDID,
        action: 0,
      });

      const projectInfo: any = {
        ...this.projectInfo.value,
      };
      projectInfo['sowJdId'] = this.SOWJDID;
      projectInfo['documents'] = this.File;
      // projectInfo['status'] = 1;

      this.loaderService.setShowLoading();
      this.sowjdService.postProjectData(projectInfo).subscribe({
        next: (v) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert('Document Added Successfully');
          this.getDocuments();
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
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
  // OnFileReady(params: GridReadyEvent) {
  //   this.convertFile(this.EventFile).subscribe((base64) => {
  //     this.base64Output = base64;
  //     this.EventFile['documentContent'] = this.base64Output;
  //     this.EventFile['documentName'] = this.EventFile.name;
  //     this.FileRowdata = this.File;
  //   });
  //   this.gridApi = params.api;
  // }
  Deletefile(index: any) {
    this.File.splice(index, 1);
  }

  resetCreateForm(form: string) {
    this.myForm.get(form)?.reset();
  }

  SaveForm(input: string) {
    if (input == 'projectinfo') {
      if (
        this.checkReferrence == true &&
        this.projectInfo.value.sowjdReference == undefined
      ) {
        this.notifyservice.alert('Please choose SoW JD Reference No.');
      } else {
        const projectInfo: any = {
          ...this.projectInfo.value,
        };

        projectInfo['sowJdTypeId'] = this.projectInfo.value.sowJdTypeId
          ? this.projectInfo.value.sowJdTypeId
          : this.formValues.sowJdTypeId;
        projectInfo['companyId'] = this.projectInfo.value.companyId
          ? this.projectInfo.value.companyId
          : this.formValues.companyId;
        projectInfo['customerTypeId'] = this.projectInfo.value.customerTypeId
          ? this.projectInfo.value.customerTypeId
          : this.formValues.customerTypeId;
        projectInfo['resourceLocationId'] = this.projectInfo.value
          .resourceLocationId
          ? this.projectInfo.value.resourceLocationId
          : this.formValues.resourceLocationId;
        projectInfo['outsourcingTypeId'] = this.projectInfo.value
          .outsourcingTypeId
          ? this.projectInfo.value.outsourcingTypeId
          : this.formValues.outsourcingTypeId;

        projectInfo['sowJdId'] = this.SOWJDID;
        projectInfo['status'] = this.inputstatusId;
        projectInfo['statusName'] = this.inputstatus;

        this.loaderService.setShowLoading();

        this.sowjdService.postProjectData(projectInfo).subscribe({
          next: (v: any) => {
            if (v.status === 'success') {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert('Project Information Saved Successful');
              this.ngOnInit();
            }
          },
          error: (e) => {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
          },
          complete: () => {},
        });
      }
    } else if (input == 'userdetail') {
      const userdetail: any = {
        ...this.departmentDetails.value,
      };
      userdetail['sowJdId'] = this.SOWJDID;
      this.sowjdService.postUserDepartment(userdetail).subscribe({
        next: (v: any) => {
          if (v.status === 'success') {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Project Organization Saved Successful');
            this.ngOnInit();
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
    } else if (input == 'podetail') {
      const todaydate = new Date();
      const startdate = new Date(this.purchaseOrder.value.startDate);
      const startlocateDate = this.formatDates(startdate);
      this.purchaseOrder.value.startDate = startlocateDate;
      const enddate = new Date(this.purchaseOrder.value.endDate);
      const endlocateDate = this.formatDates(enddate);
      this.purchaseOrder.value.endDate = endlocateDate;

      const podetail: any = {
        ...this.purchaseOrder.value,
      };
      podetail['sowJdId'] = this.SOWJDID;

      if (endlocateDate !== 'NaN-NaN-NaN') {
        this.sowjdService.postPOData(podetail).subscribe({
          next: (v: any) => {
            if (v.status === 'success') {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert('Fund Information Saved Successful');
              this.ngOnInit();
            }
          },
          error: (e) => {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
          },
          complete: () => {},
        });
      }
    } else if (input == 'costdetail') {
      const POValueInfo: any = {
        ...this.costSkillsetVendors.value,
      };

      POValueInfo['sowJdId'] = this.SOWJDID;

      this.sowjdService.postPOValueData(POValueInfo).subscribe({
        next: (v: any) => {
          if (v.status === 'success') {
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Skillset and Vendor Saved Successful');
            this.ngOnInit();
          }
        },
        error: (e) => {
          this.loaderService.setDisableLoading();
          this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
        },
        complete: () => {},
      });
    }
  }

  submitValidation() {
    this.projectInfo.get('wbsId')?.setValidators([Validators.required]);
    this.projectInfo.get('wbsId')?.updateValueAndValidity();
    this.projectInfo.get('companyId')?.setValidators([Validators.required]);
    this.projectInfo.get('companyId')?.updateValueAndValidity();
    this.projectInfo
      .get('currencyTypeId')
      ?.setValidators([Validators.required]);
    this.projectInfo.get('currencyTypeId')?.updateValueAndValidity();
    this.projectInfo
      .get('customerTypeId')
      ?.setValidators([Validators.required]);
    this.projectInfo.get('customerTypeId')?.updateValueAndValidity();
    this.projectInfo.get('customerName')?.setValidators([Validators.required]);
    this.projectInfo.get('customerName')?.updateValueAndValidity();
    this.projectInfo
      .get('internalResourceCheckdone')
      ?.setValidators([Validators.required]);
    this.projectInfo.get('internalResourceCheckdone')?.updateValueAndValidity();
    this.projectInfo
      .get('isCustomerApprovalAvailable')
      ?.setValidators([Validators.required]);
    this.projectInfo
      .get('isCustomerApprovalAvailable')
      ?.updateValueAndValidity();
    this.projectInfo
      .get('isprojectGDPRRelevant')
      ?.setValidators([Validators.required]);
    this.projectInfo.get('isprojectGDPRRelevant')?.updateValueAndValidity();
    // this.projectInfo
    //   .get('isStandardGPAIsSufficient')
    //   ?.setValidators([Validators.required]);
    // this.projectInfo.get('isStandardGPAIsSufficient')?.updateValueAndValidity();
    // this.projectInfo.get('c2PAgreement')?.setValidators([Validators.required]);
    // this.projectInfo.get('c2PAgreement')?.updateValueAndValidity();
    // this.projectInfo
    //   .get('isResourceAugmentationNeedExtensionOfC2P')
    //   ?.setValidators([Validators.required]);
    // this.projectInfo
    //   .get('isResourceAugmentationNeedExtensionOfC2P')
    //   ?.updateValueAndValidity();
    // this.projectInfo
    //   .get('c2PDocumentPrepared')
    //   ?.setValidators([Validators.required]);
    // this.projectInfo.get('c2PDocumentPrepared')?.updateValueAndValidity();
    this.projectInfo
      .get('resourceLocationId')
      ?.setValidators([Validators.required]);
    this.projectInfo.get('resourceLocationId')?.updateValueAndValidity();
    this.projectInfo
      .get('outsourcingTypeId')
      ?.setValidators([Validators.required]);
    this.projectInfo.get('outsourcingTypeId')?.updateValueAndValidity();
    if (this.checkReferrence == true) {
      this.projectInfo
        .get('sowjdReference')
        ?.setValidators([Validators.required]);
      this.projectInfo.get('sowjdReference')?.updateValueAndValidity();
    } else {
      this.projectInfo.get('sowjdReference')?.clearValidators();
      this.projectInfo.get('sowjdReference')?.updateValueAndValidity();
    }
    this.projectInfo.get('plantId')?.setValidators([Validators.required]);
    this.projectInfo.get('plantId')?.updateValueAndValidity();

    this.departmentDetails.get('group')?.setValidators([Validators.required]);
    this.departmentDetails.get('group')?.updateValueAndValidity();

    this.purchaseOrder.get('startDate')?.setValidators([Validators.required]);
    this.purchaseOrder.get('startDate')?.updateValueAndValidity();
    this.purchaseOrder.get('endDate')?.setValidators([Validators.required]);
    this.purchaseOrder.get('endDate')?.updateValueAndValidity();
    this.purchaseOrder
      .get('budgetCodeId')
      ?.setValidators([Validators.required]);
    this.purchaseOrder.get('budgetCodeId')?.updateValueAndValidity();
    this.purchaseOrder
      .get('materialGroupId')
      ?.setValidators([Validators.required]);
    this.purchaseOrder.get('costCenter')?.setValidators([Validators.required]);
    this.purchaseOrder.get('costCenter')?.updateValueAndValidity();
    this.purchaseOrder.get('materialGroupId')?.updateValueAndValidity();
    this.purchaseOrder.get('fundId')?.setValidators([Validators.required]);
    this.purchaseOrder.get('fundId')?.updateValueAndValidity();
    this.purchaseOrder
      .get('fundCenterId')
      ?.setValidators([Validators.required]);
    this.purchaseOrder.get('fundCenterId')?.updateValueAndValidity();
  }

  SubmitSowJdForm() {
    this.myForm.markAllAsTouched();
    if (!this.myForm.valid) return;

    if (this.docRowdata.length < 1) {
      this.notifyservice.alert('Please attach minimum one Document.');
      return;
    }
    if (this.rowData.length < 1) {
      this.notifyservice.alert('Please add minimum one SkillSet.');
      return;
    }
    if (this.rowDataPOVendor.length < 1) {
      this.notifyservice.alert('Please add minimum one Vendor.');
      return;
    }
    let type: string;
    if (this.routerStringSubmit == 'submit') {
      type = 'updateSoWJD';
    } else {
      type = 'createSoWJD';
    }

    let dialogRef = this.dialog.open(CommonSignoffComponent, {
      width: '30vw',
      data: { type },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data.remarks) {
        this.submitValidation();

        const todaydate = new Date();
        const startdate = new Date(this.purchaseOrder.value.startDate);
        const enddate = new Date(this.purchaseOrder.value.endDate);

        const startlocateDate = this.formatDates(startdate);
        this.purchaseOrder.value.startDate = startlocateDate;
        const endlocateDate = this.formatDates(enddate);
        this.purchaseOrder.value.endDate = endlocateDate;

        // if (!this.myForm.valid) {
        //   this.notifyservice.alert('Please Enter all the fields.');
        //   return;
        // } else
        if (startdate <= todaydate) {
          this.notifyservice.alert('Invalid Start Date');
          return;
        } else if (
          enddate < new Date(startdate.setDate(startdate.getDate() + 7))
        ) {
          this.notifyservice.alert('Invalid end Date');
          return;
        } else {
          if (this.routerstring == 'clone') {
            this.SowJdNumber = 'SOW_JD_DRAFT';
          }

          this.createSowJd = {
            ...this.projectInfo.value,
            ...this.departmentDetails.value,
            ...this.purchaseOrder.value,
            ...this.costSkillsetVendors.value,
          };

          this.createSowJd['sowJdTypeId'] = this.formValues.sowJdTypeId;
          this.createSowJd['companyId'] = this.formValues.companyId;
          this.createSowJd['customerTypeId'] = this.formValues.customerTypeId;
          this.createSowJd['resourceLocationId'] =
            this.formValues.resourceLocationId;
          this.createSowJd['outsourcingTypeId'] =
            this.formValues.outsourcingTypeId;

          this.createSowJd['currentYear'] = new Date().getFullYear();
          this.createSowJd['status'] = 2;
          this.createSowJd['id'] = this.SOWJDID;
          this.createSowJd['SowJdNumber'] = this.SowJdNumber;
          this.createSowJd['dmRemarks'] = res.data.remarks;

          this.loaderService.setShowLoading();
          this.sowjdService.patchSubmitSowjdForm(this.createSowJd).subscribe({
            next: (data: any) => {
              if (data.status == 'success') {
                this.loaderService.setDisableLoading();
                if (this.routerStringSubmit == 'submit') {
                  const dialogRef = this.dialog.open(SuccessComponent, {
                    width: '500px',
                    height: 'auto',
                    data: `${data.data.sowjdNumber} Updated Successful`,
                  });
                  dialogRef.afterClosed().subscribe((result: any) => {
                    this.router.navigate(['/sowjd/my-sowjd']);
                  });
                } else {
                  const dialogRef = this.dialog.open(SuccessComponent, {
                    width: '500px',
                    height: 'auto',
                    data: `${data.data.sowjdNumber} Created Successful`,
                  });
                  dialogRef.afterClosed().subscribe((result: any) => {
                    this.router.navigate(['/sowjd/my-sowjd']);
                  });
                }
              }
            },
            error: (e) => {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert(e.error.data.errorDetails[0].errorCode);
            },
            complete: () => {},
          });
        }
      }
    });
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

  getValidityStartMinDate(): Date | null {
    const validityStartValue = this.purchaseOrder.controls['startDate'].value;
    if (validityStartValue) {
      const minDate = new Date(validityStartValue);
      minDate.setDate(minDate.getDate() + 1);
      return minDate;
    }

    return null;
  }

  formatDate(value: any, time: string = 'startTime') {
    const selectedDate = new Date(value);
    const timezoneOffset = selectedDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
    const adjustedDate = new Date(selectedDate.getTime() - timezoneOffset);
    const formattedDate = adjustedDate.toISOString();
    if (time === 'startTime') {
      this.startDate = formattedDate;
    } else {
      this.endDate = formattedDate;
    }
  }
  makeForm() {
    return this._formBuilder.group({
      projInfo: this._formBuilder.group({
        sowJdTypeId: ['', Validators.required],
        description: ['', Validators.required],
        wbsId: [''],
        companyId: ['', Validators.required],
        currencyTypeId: [''],
        customerTypeId: ['', Validators.required],
        customerName: ['', Validators.required],
        internalResourceCheckdone: ['', Validators.required],
        isCustomerApprovalAvailable: ['', Validators.required],
        isprojectGDPRRelevant: ['', Validators.required],
        isStandardGPAIsSufficient: [''],
        c2PAgreement: [''],
        isResourceAugmentationNeedExtensionOfC2P: [''],
        c2PDocumentPrepared: [''],
        resourceLocationId: ['', Validators.required],
        outsourcingTypeId: ['', Validators.required],
        isRepeatOutsourcing: ['', Validators.required],
        sowjdReference: [''],
        plantId: [''],
      }),
      deptDetails: this._formBuilder.group({
        group: ['', Validators.required],
        section: [''],
        department: [''],
      }),
      PO: this._formBuilder.group({
        startDate: [this.projectStartDate, Validators.required],
        endDate: ['', Validators.required],
        budgetCodeId: ['', Validators.required],
        materialGroupId: ['', Validators.required],
        fundId: ['', Validators.required],
        fundCenterId: [''],
        costCenter: ['', Validators.required],
      }),
      costskillset: this._formBuilder.group({}),
    });
  }

  formatDates(date: Date) {
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    const dateVal = yyyy + '-' + mm + '-' + dd;
    return dateVal;
  }

  setFormData() {
    if (this.formValues) {
      this.projectInfo
        .get('sowJdTypeId')
        ?.setValue(this.formValues?.sowJdTypeId);
      this.projectInfo
        .get('description')
        ?.setValue(this.formValues?.description);
      this.wbsIdselectval = this.formValues?.wbsId;
      this.sowjdService.getWBSList(
        this.formValues?.companyId,
        this.formValues?.wbsId
      );
      this.projectInfo.get('wbsId')?.setValue(this.formValues?.wbsId);
      this.projectInfo.get('companyId')?.setValue(this.formValues?.companyId);
      this.changedEventWBSValue(this.formValues?.wbsId);
      this.projectInfo
        .get('currencyTypeId')
        ?.setValue(this.formValues?.currencyTypeId);
      this.projectInfo
        .get('customerTypeId')
        ?.setValue(this.formValues?.customerTypeId);
      this.projectInfo
        .get('customerName')
        ?.setValue(this.formValues?.customerName);
      this.projectInfo
        .get('internalResourceCheckdone')
        ?.setValue(this.formValues?.internalResourceCheckdoneId);
      this.projectInfo
        .get('isCustomerApprovalAvailable')
        ?.setValue(this.formValues?.isCustomerApprovalAvailableId);
      this.projectInfo
        .get('isprojectGDPRRelevant')
        ?.setValue(this.formValues?.isprojectGDPRRelevantId);

      this.projectInfo
        .get('isStandardGPAIsSufficient')
        ?.setValue(this.formValues?.isStandardGPAIsSufficientId);

      this.projectInfo
        .get('c2PAgreement')
        ?.setValue(this.formValues?.c2PAgreementId);

      this.projectInfo
        .get('isResourceAugmentationNeedExtensionOfC2P')
        ?.setValue(this.formValues?.isResourceAugmentationNeedExtensionOfC2PId);

      this.projectInfo
        .get('c2PDocumentPrepared')
        ?.setValue(this.formValues?.c2PDocumentPreparedId);

      this.projectInfo
        .get('resourceLocationId')
        ?.setValue(this.formValues?.resourceLocationId);
      this.projectInfo
        .get('outsourcingTypeId')
        ?.setValue(this.formValues?.outsourcingTypeId);
      this.projectInfo
        .get('isRepeatOutsourcing')
        ?.setValue(this.formValues?.isRepeatOutsourcing);
      this.projectInfo
        .get('sowjdReference')
        ?.setValue(this.formValues?.sowjdReference);

      this.projectInfo.get('plantId')?.setValue(this.formValues?.plantId);
      // this.groupIdselectval = this.formValues?.group;
      this.departmentDetails.get('group')?.setValue(this.formValues?.group);
      this.departmentDetails.get('section')?.setValue(this.formValues?.section);
      this.departmentDetails
        .get('department')
        ?.setValue(this.formValues?.department);
      this.purchaseOrder
        .get('costCenter')
        ?.setValue(this.formValues?.costCenter);
      this.sowjdService.getCostCenterList(this.SOWJDID);
      this.purchaseOrder.get('startDate')?.setValue(this.formValues?.startDate);
      this.purchaseOrder.get('endDate')?.setValue(this.formValues?.endDate);
      this.purchaseOrder
        .get('budgetCodeId')
        ?.setValue(this.formValues?.budgetCodeId);

      this.purchaseOrder
        .get('materialGroupId')
        ?.setValue(this.formValues?.materialGroupID);
      this.purchaseOrder.get('fundId')?.setValue(this.formValues?.fundId);
      this.purchaseOrder
        .get('fundCenterId')
        ?.setValue(this.formValues?.fundCenterId);

      this.onGdprChange();
    }
  }
  //Auto-Width Fix -start
  onFirstDataRendered(event: any) {
    this.adjustAll();
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
      this.adjustAll();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustAll();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.adjustAll();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustAll();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustAll();
  }

  adjustAll() {
    const allColumnIds: any = [];
    this.columnApiSkillset?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiSkillset?.autoSizeColumns(allColumnIds, false);

    const allColumnVendor: any = [];
    this.columnApiVendor?.getColumns()?.forEach((column: any) => {
      allColumnVendor.push(column.getId());
    });
    this.columnApiVendor?.autoSizeColumns(allColumnVendor, false);
  }
}
