import { Component, HostListener, OnInit } from '@angular/core';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { sowjdService } from '../../services/sowjdService.service';
import { config } from '../../../config';
import { ActivatedRoute, Params } from '@angular/router';
import { LoaderService } from 'src/app/services/loader.service';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { OwnershipComponent } from 'src/app/planning/popups/ownership/ownership.component';
import { HomeService } from 'src/app/services/home.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { Subscription } from 'rxjs';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-sowjd-info',
  templateUrl: './sowjd-info.component.html',
  styleUrls: ['./sowjd-info.component.scss'],
})
export class SowjdInfoComponent implements OnInit {
  dateFormat = config.dateFormat;
  currentDate: any = new Date();
  formValues: any;
  public showLoading = true;
  base64Output!: string;
  sowjdmasterdata: any = [];
  sowJdTypeDetails: any;
  sowJdTypeDetails_Type: any;
  sowJdStatusDetails: any = [];
  outSourcingTypeDetails: any = [];
  materialGroupDetails: any = [];
  locationModeDetails: any = [];
  customerTypeDetails: any = [];
  budgetCodeDetails: any = [];
  fundCodeDetails: any = [];
  masterIsTheStandardGPAClarified: any = [];
  masterResourceAugmentationOfC2P: any = [];
  masterIsTheProjectGDPRRelevant: any = [];
  masterIsThisIsARepeatOutsourcing: any = [];
  masterCustomerApprovalAvailable: any = [];
  masterC2PDocumentPrepared: any = [];
  masterC2PAgreement: any = [];
  masterInternalResourceCheckDone: any = [];
  gradeDetails: any = [];
  File: any = [];
  departmentusrdetails: any = [];
  isSubmitted: boolean = true;
  public sowJdType!: number;
  public status!: number;
  formdescription: any;
  FileRowdata: any = [];
  osmRoleAdmin: boolean = false;

  sowjd: string;
  private gridApi!: GridApi;
  public sowjdFiles: any[] = [];
  ratecardtype: boolean = false;
  nonratecardtype: boolean = false;
  public customerName = '';
  public currentprocess = '';
  public sowjdid = '';
  public customer = 'Bosch';
  public internal_resource_check_done: any = [];
  public currency: any = [];
  public description = '';
  public internalResourceCheckDone!: number;
  public isCustomerApprovalAvailable!: number;
  public isprojectGDPRRelevent!: number;
  public isStandardGPAIsSufficient!: number;
  public c2PDocumentPrepared!: number;
  public outsourcingType!: number;
  public isResourceAugmentationNeedExtensionOfC2P!: number;
  public locationMode!: number;
  public c2PAgreement!: number;
  public companyId: any;
  public groupId: any;
  public plantId: any;
  public materialGroup!: number;
  public fund!: number;
  public budgetCode!: number;
  public wbsId: any;
  public customerType!: number;
  public fundCenterId: any;
  public startDate: any;
  public endDate: any;
  public sowjddetaildata!: any;
  sowjdDocumentdata: any;
  wbsMasterDetails: any = [];
  statuschange: any;
  groupData: any;
  isDisabled: boolean = true;
  approvedStatusData: any;
  autoSizeStrategy: any;
  companyCurrencyName: string;
  companyLocale: string;
  permissionDetails: PermissionDetails;
  subscription: Subscription;
  autoGroupColumnDef: ColDef = { minWidth: 210 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
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
  columnApi: any;
  public rowData = [];
  vendorRowData = [];

  public columnDefs = [];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    this.allTogetherAdjust();
  }
  columnApiVSOne: any;
  columnApiVSTwo: any;
  public columnDefsVendorRC = [
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
    },
    {
      headerName: 'Section SPOC Approval',
      field: 'isSecSpocApproved',
      cellRenderer: (params) => {
        return params.value ? 'Yes' : 'No';
      },
      resizable: false,
    },
  ];
  public columnDefsVendorNRC = [
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
    },
    {
      headerName: 'Section SPOC Approval',
      field: 'isSecSpocApproved',
      cellRenderer: (params) => {
        return params.value ? 'Yes' : 'No';
      },
      resizable: false,
    },
  ];
  constructor(
    private dialog: MatDialog,
    private sowjdService: sowjdService,
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private homeService: HomeService,
    private currencyPipe: CurrencyPipe,
    public sowjdservice: sowjdService
  ) {
    // Using for Roles and Permissions
    this.subscription = this.sowjdservice
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
      });

    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        for (let role of response.data.roleDetail[0].roleDetails) {
          if (role.roleName.toLowerCase().startsWith('osm admin')) {
            this.osmRoleAdmin = true;
          }
        }
      },
    });
  }

  ngOnInit(): void {
    this.loaderService.setShowLoading();
    this.route.params.subscribe((params: Params) => {
      this.sowjd = params['id'];
      if (this.sowjd === 'undefined') {
        this.sowjd = localStorage.getItem('sowjdId');
      }
      if (this.sowjd && this.sowjd !== 'undefined') {
        this.sowjdService
          .getSowjdRequestById(this.sowjd)
          .subscribe((res: any) => {
            this.sowjddetaildata = res.data.sowJdEntityResponse;
            this.companyCurrencyName = this.sowjddetaildata?.currencyName;
            this.companyLocale = 'en-IN';
            this.loaderService.setDisableLoading();
          });

        this.getVendorSuggestion();
        this.getApprovedStatus();
      }
    });
  }

  getVendorSuggestion() {
    this.sowjdService.getVendorSuggestion(this.sowjd).subscribe({
      next: (res: any) => {
        this.vendorRowData = res?.data;
      },
      error: (e) => {
        console.error(e?.error?.data?.errorDetails[0]?.errorCode);
      },
      complete: () => {},
    });
  }

  getApprovedStatus() {
    this.sowjdService.getApprovedStatus(this.sowjd).subscribe({
      next: (res: any) => {
        this.approvedStatusData = res.data;
      },
      error: (e) => {
        console.error(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {},
    });
  }

  getsowjdRequestbyId() {
    this.sowjdService.getSowjdRequestById(this.sowjd).subscribe((res: any) => {
      if (res.data) {
        this.loaderService.setDisableLoading();
        this.sowjddetaildata = res.data.sowJdEntityResponse;
      }
    });
  }

  onGridReadyVendors(params: GridReadyEvent, type: number) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');

    // this.gridApi.refreshCells({ force: true });

    // this.gridApi.hideOverlay();
    // if (
    //   this.rowData__Po__vendor == null ||
    //   this.rowData__Po__vendor == undefined ||
    //   this.rowData__Po__vendor.length <= 0
    // )
    //   this.gridApi.showNoRowsOverlay();
    // this.gridApi.addEventListener(
    //   'bodyScroll',
    //   this.onHorizontalScroll.bind(this)
    // );

    // this.gridApi.hideOverlay();

    // if (type === 1) {
    //   this.columnApiVSOne = params.columnApi;
    //   this.gridApi.setColumnDefs(this.columnDefsVendorNRC);
    //   this.adjustWidthVSOne();
    // } else if (type === 2) {
    //   this.columnApiVSTwo = params.columnApi;
    //   this.gridApi.setColumnDefs(this.columnDefsVendorRC);
    //   this.adjustWidthVSTwo();
    // }
  }

  adjustWidthVSOne() {
    const allColumnIds: any = [];
    this.columnApiVSOne?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSOne?.autoSizeColumns(allColumnIds, false);
  }
  adjustWidthVSTwo() {
    const allColumnIds: any = [];
    this.columnApiVSTwo?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });
    this.columnApiVSTwo?.autoSizeColumns(allColumnIds, false);
  }

  // OwnerSHip
  OpenOwnershipDialog(featureCode: string) {
    const dialogRef = this.dialog.open(OwnershipComponent, {
      width: '50%',
      data: { objectId: this.sowjddetaildata?.id, featureCode: featureCode },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getsowjdRequestbyId();
        }
      }
    );
  }
  //Auto-Width Fix -start
  onFirstDataRendered(event: any) {
    this.adjustWidthVSOne();
    this.adjustWidthVSTwo();
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
    }, 1000);
  }

  onSortChanged(event: any) {
    this.allTogetherAdjust();
  }
  //Auto-Width Fix -End
  allTogetherAdjust() {
    this.adjustWidthVSOne();
    this.adjustWidthVSTwo();
  }
}
