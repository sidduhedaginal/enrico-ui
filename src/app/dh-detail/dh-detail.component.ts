import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SowjdDhService } from 'src/app/services/sowjd-dh.service';
import { MatDialog } from '@angular/material/dialog';
import { DateFormatComponent } from 'src/app/common/date-format/date-format.component';
import { AgGridAngular } from 'ag-grid-angular';
import { GridApi, ColDef, GridReadyEvent } from 'ag-grid-community';
import { Observable } from 'rxjs';
import 'ag-grid-enterprise';
import { WidthdrawComponent } from 'src/app/dm/popup/widthdraw/widthdraw.component';
import { DelegationComponent } from 'src/app/popup/delegation/delegation.component';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { CommonApprovalComponent } from 'src/app/dm/popup/common-approval/common-approval.component';
import { LoaderService } from 'src/app/services/loader.service';
import { Subscription } from 'rxjs';
import { NotifyService } from 'src/app/dm/services/notify.service';
import { SowjdApprovalProcessInfoComponent } from 'src/app/common/sowjd-approval-process-info/sowjd-approval-process-info.component';
import { SowjdCommonInfoComponent } from 'src/app/common/sowjd-common-info/sowjd-common-info.component';
import { config } from '../config';
import { CurrencyPipe } from '../common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-dh-detail',
  templateUrl: './dh-detail.component.html',
  styleUrls: ['./dh-detail.component.scss'],
})
export class DhDetailComponent implements OnInit {
  dateFormat = config.dateFormat;
  private sub: any;
  sowJdId: string = '';
  sowJdDetail: any;
  actionType: string = '';
  recommendedVendorsList: any[] = [];
  vendorSuggestionData: any;
  approvedStatusData: any;
  sowjdDHActions: any;

  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;

  dhRole: boolean;
  permissionDetails: PermissionDetails;
  subscription: Subscription;

  @ViewChild(SowjdApprovalProcessInfoComponent)
  sowjdApprovalProcessInfoComponent: SowjdApprovalProcessInfoComponent;

  @ViewChild(SowjdCommonInfoComponent)
  sowjdCommonInfoComponent: SowjdCommonInfoComponent;

  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private sowjdDhService: SowjdDhService,
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
  }

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
      resizable: false,
    },
  ];
  public vendorColumnDefs = [
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
      resizable: false,
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

  public rowData$!: Observable<any[]>;
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  private gridApiVendor!: GridApi;

  onGridReadyVendorSuggestion(params: GridReadyEvent) {
    this.gridApiVendor = params.api;
    this.gridApiVendor.setDomLayout('autoHeight');
  }

  getSoWJDDetails() {
    this.loaderService.setShowLoading();
    if (this.sowJdId) {
      this.sowjdDhService
        .getSowJdRequestById(this.sowJdId)
        .subscribe((sowJdData: any) => {
          if (sowJdData) {
            this.loaderService.setDisableLoading();
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

  onSubmit(approvalStatus: string) {
    let statusValue;
    let message: string;
    if (approvalStatus === 'approve') {
      statusValue = 3; // Approve
      message = 'SoW JD is successfully approved';
    } else {
      statusValue = 5; // Send back
      message = 'SoW JD successfully send back to Requester';
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
        const sowJdDH = {
          sowJdId: this.sowJdId,
          status: statusValue,
          remarks: res.remarks,
        };
        this.sowjdDhService.sowJdActionByDH(sowJdDH).subscribe(
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
        type: 'dh',
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }
}
