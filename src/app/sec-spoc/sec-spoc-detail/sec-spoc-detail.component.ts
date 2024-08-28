import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import 'ag-grid-enterprise';
import { SowjdSecSpocService } from 'src/app/services/sowjd-sec-spoc.service';
import { WidthdrawComponent } from 'src/app/dm/popup/widthdraw/widthdraw.component';
import { DelegationComponent } from 'src/app/popup/delegation/delegation.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { CommonApprovalComponent } from 'src/app/dm/popup/common-approval/common-approval.component';
import { VendorSuggestionComponent } from 'src/app/dm/popup/vendor-suggestion/vendor-suggestion.component';
import { LoaderService } from 'src/app/services/loader.service';
import { Subscription } from 'rxjs';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { SowjdApprovalProcessInfoComponent } from 'src/app/common/sowjd-approval-process-info/sowjd-approval-process-info.component';
import { SowjdCommonInfoComponent } from 'src/app/common/sowjd-common-info/sowjd-common-info.component';
import { config } from 'src/app/config';
import { VendorCheckboxComponent } from '../vendor-checkbox/vendor-checkbox.component';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';
@Component({
  selector: 'app-sec-spoc-detail',
  templateUrl: './sec-spoc-detail.component.html',
  styleUrls: ['./sec-spoc-detail.component.scss'],
})
export class SecSpocDetailComponent implements OnInit {
  dateFormat = config.dateFormat;
  private sub: any;
  sowJdId: string = '';

  sowJdDetail: any;
  actionType: string = '';
  recommendedVendorsList: any[] = [];
  vendorSuggestionData: any;
  approvedStatusData: any;
  sowjdDHActions: any;
  bgswSpocRole: boolean;
  permissionDetails: PermissionDetails;
  subscription: Subscription;

  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  @ViewChild(SowjdApprovalProcessInfoComponent)
  sowjdApprovalProcessInfoComponent: SowjdApprovalProcessInfoComponent;

  @ViewChild(SowjdCommonInfoComponent)
  sowjdCommonInfoComponent: SowjdCommonInfoComponent;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private sowjdDhService: SowjdDhService,
    private sowjdSecSpocService: SowjdSecSpocService,
    public sowjdService: sowjdService,
    private loaderService: LoaderService,
    private notifyservice: NotifyService,
    private currencyPipe: CurrencyPipe
  ) {
    // Using for Roles and Permissions
    this.subscription = this.sowjdService
      .getUserProfileRoleDetailSoWJD()
      .subscribe((roles: PermissionDetails) => {
        this.permissionDetails = roles;
      });
    this.bgswSpocRole = this.sowjdService.bgswSpocRole;
  }
  public vendorColumnDefsNRC = [
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
      headerName: 'Approve by SPOC',
      field: 'isSecSpocApproved',
      filter: false,
      suppressMenu: true,
      resizable: false,
      cellRenderer: VendorCheckboxComponent,
      cellRendererParams: {
        doApproveReject: (params: any, event: any) => {
          this.approveRejectVendors(params.data.vendorId, event);
        },
      },
    },
  ];
  public vendorColumnDefsRC = [
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
      headerName: 'Approve by SPOC',
      field: 'isSecSpocApproved',
      filter: false,
      suppressMenu: true,
      resizable: false,
      cellRenderer: VendorCheckboxComponent,
      cellRendererParams: {
        doApproveReject: (params: any, event: any) => {
          this.approveRejectVendors(params.data.vendorId, event);
        },
      },
    },
  ];
  public approvalColumnDefs = [
    {
      headerName: 'Name',
      field: 'name',
      minWidth: 300,
    },
    {
      headerName: 'Date',
      field: 'actionOn',
      cellRenderer: DateFormatComponent,
    },
    {
      headerName: 'Approve Status',
      field: 'status',
    },
    {
      headerName: 'Remark',
      field: 'remarks',
    },
  ];

  reloadApprovalProcessInfo() {
    this.sowjdApprovalProcessInfoComponent?.getSoWJDDetails();
  }

  reloadSoWJDCommonInfo() {
    this.sowjdCommonInfoComponent?.getAllSowjdDetails();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.sowJdId = params['sowjdId'];
      if (this.sowJdId) {
        this.getSoWJDDetails();
        this.reloadApprovalProcessInfo();
        this.reloadSoWJDCommonInfo();
      }
    });
  }
  autoGroupColumnDef: ColDef = { minWidth: 200 }; //Auto-Width Fix
  overlayNoRowsTemplate = '<span></span>'; //Auto-Width Fix
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 1,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
    wrapText: true, // <-- HERE
    autoHeight: true, // <-- & HERE
    cellStyle: { 'text-align': 'left' },
  };

  public rowData$!: Observable<any[]>;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApi!: GridApi;
  private gridApi2!: GridApi;
  private gridApiVendor!: GridApi;
  columnApiVendor: any;

  onGridReadyVendorSuggestion(params: GridReadyEvent) {
    this.gridApiVendor = params.api;
    this.columnApiVendor = params.columnApi;

    this.gridApiVendor.refreshCells({ force: true });
    this.gridApiVendor.setDomLayout('autoHeight');
    this.gridApiVendor.hideOverlay();
    if (
      this.vendorSuggestionData == null ||
      this.vendorSuggestionData == undefined ||
      this.vendorSuggestionData.length <= 0
    )
      this.gridApiVendor.showNoRowsOverlay();
    this.gridApiVendor.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApiVendor.hideOverlay();

    this.adjustAll();
  }

  onFirstDataRendered(event: any) {
    this.adjustAll();
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
    const allColumnVendor: any = [];
    this.columnApiVendor?.getColumns()?.forEach((column: any) => {
      allColumnVendor.push(column.getId());
    });
    this.columnApiVendor?.autoSizeColumns(allColumnVendor, false);
  }

  getSoWJDDetails() {
    if (this.sowJdId) {
      this.sowjdDhService
        .getSowJdRequestById(this.sowJdId)
        .subscribe((sowJdData: any) => {
          if (sowJdData) {
            this.sowJdDetail = sowJdData.data.sowJdEntityResponse;

            this.companyCurrencyName = this.sowJdDetail?.currencyName;
            let currencyObj = this.loaderService.getCountryDetailByCurrency(
              this.companyCurrencyName
            );

            this.companyLocale = currencyObj.locale;
            this.companyNumericFormat = currencyObj.numericFormat;

            this.getVendorsSuggestions();
            this.getApprovedStatus();
          }
        });
    }
  }

  getVendorsSuggestions() {
    this.sowjdDhService
      .getVendorsSuggestions(this.sowJdId)
      .subscribe((vendors: any) => {
        this.vendorSuggestionData = vendors.data;
      });
  }

  getApprovedStatus() {
    this.sowjdDhService
      .getApprovedStatus(this.sowJdId)
      .subscribe((approvals: any) => {
        this.approvedStatusData = approvals.data;
      });
  }

  addVendor() {
    let dialogRef = this.dialog.open(VendorSuggestionComponent, {
      width: '40vw',
      height: 'auto',
      data: {
        sowJdId: this.sowJdId,
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.VendorDetail) {
        this.loaderService.setShowLoading();
        this.sowjdService
          .postVendorSuggestion(result.VendorDetail)
          .subscribe((response: any) => {
            if (response.status === 'success') {
              this.loaderService.setDisableLoading();
              this.notifyservice.alert('Vendor added successful.');
            }
            this.getVendorsSuggestions();
          });
      }
    });
  }

  approveRejectVendors(vendorId: string, event: boolean) {
    let findIndexVendor = this.vendorSuggestionData.findIndex(
      (vendor: any) => vendor.vendorId === vendorId
    );
    let tempVendor = this.vendorSuggestionData[findIndexVendor];
    tempVendor['isSecSpocApproved'] = event;
    this.vendorSuggestionData[findIndexVendor] = tempVendor;
  }

  onSubmit(approvalStatus: string) {
    this.vendorSuggestionData.forEach((vendor: any, index: number) => {
      this.vendorSuggestionData[index]['IsManualFloat'] = false;
      if (vendor.id) {
        this.vendorSuggestionData[index]['action'] = 1; //1-Update
      } else {
        this.vendorSuggestionData[index]['action'] = 0; // 0-Create // 2-Delete
      }
    });

    let isVendorCheck: boolean = false;
    this.vendorSuggestionData.forEach((vendor: any, index: number) => {
      if (vendor.isSecSpocApproved) {
        isVendorCheck = true;
      }
    });

    let statusValue;
    let message: string;
    if (approvalStatus === 'approve') {
      statusValue = 4; // sec spoc Approve
      message = 'SoW JD is successfully approved';

      if (this.vendorSuggestionData.length === 0) {
        this.notifyservice.alert('Please add minimun one vendor');
        return;
      }

      if (!isVendorCheck) {
        this.notifyservice.alert('Please approve minimum one vendor.');
        return;
      }
    } else {
      statusValue = 17; // Send back
      message = 'SoW JD successfully send back to requester';
    }
    let dialogRef = this.dialog.open(CommonApprovalComponent, {
      width: '40vw',
      data: {
        type: approvalStatus,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.remarks) {
        this.loaderService.setShowLoading();
        const sowJdSecSpoc = {
          sowJdId: this.sowJdId,
          status: statusValue,
          remarks: res.remarks,
        };

        if (approvalStatus === 'approve') {
          const vendorObject = {
            sowjdId: this.sowJdId,
            recommendedVendors: [...this.vendorSuggestionData],
          };

          this.sowjdDhService.updateVendors(vendorObject).subscribe(
            (res: any) => {
              if (res.status === 'success') {
                this.sowjdSecSpocService
                  .sowJdActionBySecSpoc(sowJdSecSpoc)
                  .subscribe(
                    (response: any) => {
                      if (response.status === 'success') {
                        this.loaderService.setDisableLoading();
                        this.notifyservice.alert(message);
                        this.ngOnInit();
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
        } else {
          this.sowjdSecSpocService.sowJdActionBySecSpoc(sowJdSecSpoc).subscribe(
            (response: any) => {
              if (response.status === 'success') {
                this.loaderService.setDisableLoading();
                this.notifyservice.alert(message);
                this.ngOnInit();
              }
            },
            (error) => {
              this.loaderService.setDisableLoading();
            }
          );
        }
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.subscription.unsubscribe();
  }

  doReject() {
    const dialogRef = this.dialog.open(WidthdrawComponent, {
      width: '40vw',
      data: {
        sowjdId: this.sowJdId,
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }
  doDelegate() {
    const dialogRef = this.dialog.open(DelegationComponent, {
      width: '40vw',
      data: {
        sowJdId: this.sowJdId,
        type: 'spoc',
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }
}
