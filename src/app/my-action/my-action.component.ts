import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { ApprovemyactionAOPComponent } from '../planning/popups/approvemyaction-aop/approvemyaction-aop.component';
import { ApproveSLPComponent } from '../planning/popups/approve-slp/approve-slp.component';
import { DelegateSecondlevelComponent } from '../planning/popups/delegate-secondlevel/delegate-secondlevel.component';
import { CreateAOPpopupComponent } from '../planning/popups/create-aoppopup/create-aoppopup.component';
import { NoplanningpopupComponent } from '../planning/popups/noplanningpopup/noplanningpopup.component';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
} from 'ag-grid-community';
import { NavigationExtras, Router } from '@angular/router';
import { PlanningListService } from '../planning/services/planning-list.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaningService } from '../planning/services/planing.service';
import { MatDialog } from '@angular/material/dialog';
import { DebordingMoreActionDialogComponent } from '../resource/debording-more-action-dialog/debording-more-action-dialog.component';
import { ApproveSrnComponent } from '../dm/sowjd-srn/approve-srn/approve-srn.component';
import { SendbackSrnComponent } from '../dm/sowjd-srn/sendback-srn/sendback-srn.component';
import { WithdrawSrnComponent } from '../dm/sowjd-srn/withdraw-srn/withdraw-srn.component';
import { DelegateSrnComponent } from '../dm/sowjd-srn/delegate-srn/delegate-srn.component';
import { DateFormatComponent } from '../common/date-format/date-format.component';
import { ChangeDetailsActionDialogComponent } from '../resource/change-details-action-dialog/change-details-action-dialog.component';
import { userProfileDetails } from '../common/user-profile/user-profile';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import { NotifyService } from '../dm/services/notify.service';
import { UserProfile } from '../model/user-profile';
import { HomeService } from '../services/home.service';
import { StorageQuery } from '../common/storage-service/storage-service';
import { LoaderService } from '../services/loader.service';
import { CommonApprovalComponent } from '../dm/popup/common-approval/common-approval.component';
import { SowjdDhService } from '../services/sowjd-dh.service';
import { SuccessComponent } from '../popup/success/success.component';
import { DelegationComponent } from '../popup/delegation/delegation.component';
import { SowjdSecSpocService } from '../services/sowjd-sec-spoc.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OnboardApproveDialogComponent } from '../resource/onboard-approve-dialog/onboard-approve-dialog.component';
import { OnboardDelegateDialogComponent } from '../resource/onboard-delegate-dialog/onboard-delegate-dialog.component';
import * as moment from 'moment';
import { ApiResourceService } from '../resource/api-resource.service';
import { OnboardRejectDialogComponent } from '../resource/onboard-reject-dialog/onboard-reject-dialog.component';
import { OnboardSentBackDialogComponent } from '../resource/onboard-sent-back-dialog/onboard-sent-back-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-my-action',
  templateUrl: './my-action.component.html',
  styleUrls: ['./my-action.component.scss'],
  providers: [DatePipe],
})
export class MyActionComponent {
  @Input() selectedTab: number;
  CURRENT_TAB_INDEX = 5;
  CurrentDate = new Date();
  public showLoading = false;
  selectedPlannedYear: any = 'All';
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;
  private gridApi;
  public gridOptions: GridOptions = {};
  paginationPageSize: number = 5;
  savedColumns: any;
  selectedMySubColumnNumber = 0;
  activeColumns: any;
  filterValue: string;

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
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  columnApi: any;
  overlayNoRowsTemplate = '<span></span>';
  searchText = '';
  filteredData = [];
  stayScrolledToEnd = true;
  isGridAPIReady: boolean = true;
  receivedGridResponse = [];
  public colDefs: any = [];
  public showApproveButton = false;
  public rowData: any = [];
  public selectedColumns: any = [];
  public columns: any = [];
  public gridColumns: any = [];
  public userConfigColumns: any;
  public data: any = [];
  public settings = {};
  public selectedItems = [];
  PlanningYearList: any = [
    { value: 'aop', name: 'Annual Outsourceing Planning' },
    { value: 'aopsl', name: 'Second Level Planning' },
  ];
  dropdownVisible = false;
  selectedColumnNumber = 0;
  Roles: any;
  Employnumber: number;
  activitySpocID: number;

  public columnDefs = [
    {
      headerName: 'Request ID',
      hide: false,
      field: 'requestId',
      dontShow: true,
      colId: 'code',
      cellRenderer: this.FirstLevelLink,
      resizable: true,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
    {
      headerName: 'Module',
      hide: false,
      field: 'module',
      resizable: true,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },

    {
      headerName: 'Created On',
      hide: false,
      field: 'createdOn',
      cellRenderer: DateFormatComponent,
      resizable: true,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
    {
      headerName: 'Initiated',
      hide: false,
      field: 'initiated',
      resizable: true,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
    {
      headerName: 'Initiated By',
      hide: false,
      field: 'createdBy',
      resizable: true,
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
    {
      headerName: 'Actions',
      field: 'Actions',
      dontShow: true,
      hide: false,
      editable: false,
      colId: 'action',
      pinned: 'right',
      resizable: true,
      suppressMenu: true,
      cellRenderer: this.actionCellRenderer.bind(this),
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
    },
  ];
  // AUTH
  PlanningRolesDetails: any;
  PlanningFeatureDetails: any;
  userProfile: UserProfile | any;
  featureDetails: any;
  userProfileDetails: userProfileDetails | any;
  public currenttabindex: any;
  permissionDetails: any;
  ExportDate: any;
  gbBusinnesOptionList: any = [];
  constructor(
    private dialog: MatDialog,
    private planningService: PlaningService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private planningListService: PlanningListService,
    private router: Router,
    private columnSettingsService: ColumnSettingsService,
    private notifyservice: NotifyService,
    private homeService: HomeService,
    private loaderService: LoaderService,
    private sowjdDhService: SowjdDhService,
    private sowjdSecSpocService: SowjdSecSpocService,
    private breadcrumbService: BreadcrumbService,
    private APIResource: ApiResourceService
  ) {
    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate, 'dd-MMM-yyyy');
    this.loaderService.setShowLoading();
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
  }

  // My Actions AUTH functions
  getProfileRoles(modulename: any, featurecode: any) {
    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        this.userProfileDetails = response.data;
        this.planningService.profileDetails = response.data;
        StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
        const masterDataModules =
          this.userProfileDetails.roleDetail[0].roleDetails.filter(
            (item: any) =>
              item.moduleDetails.some(
                (module: any) => module.moduleName === modulename
              )
          );
        const masterDataFeatureDetails = masterDataModules.map((item: any) => {
          const masterDataModule = item.moduleDetails.find(
            (module: any) => module.moduleName === modulename
          );
          return masterDataModule.featureDetails;
        });

        this.featureDetails = masterDataFeatureDetails;
        this.permissionDetails = {
          createPermission: false,
          readPermission: false,
          editPermission: false,
          deletePermission: false,
          approvePermission: false,
          rejectPermission: false,
          delegatePermission: false,
          withdrawPermission: false,
          importPermission: false,
          exportPermission: false,
        };
        for (let plan of this.featureDetails) {
          for (let item of plan) {
            if (item.featureCode.toLowerCase() == featurecode) {
              for (const permission in this.permissionDetails) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.permissionDetails[permission] = true;
                }
              }
            }
          }
        }
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
    });
  }
  checkUserProfileValueValid(modulename: any, featurecode: any) {
    this.planningService.profileDetails = StorageQuery.getUserProfile();
    if (
      this.planningService.profileDetails == '' ||
      this.planningService.profileDetails == undefined
    ) {
      this.getProfileRoles(modulename, featurecode);
    } else {
      this.userProfileDetails = this.planningService.profileDetails;
      const masterDataModules =
        this.userProfileDetails.roleDetail[0].roleDetails.filter((item: any) =>
          item.moduleDetails.some(
            (module: any) => module.moduleName === modulename
          )
        );
      const masterDataFeatureDetails = masterDataModules.map((item: any) => {
        const masterDataModule = item.moduleDetails.find(
          (module: any) => module.moduleName === modulename
        );
        return masterDataModule.featureDetails;
      });
      this.featureDetails = masterDataFeatureDetails;
      this.permissionDetails = {
        createPermission: false,
        readPermission: false,
        editPermission: false,
        deletePermission: false,
        approvePermission: false,
        rejectPermission: false,
        delegatePermission: false,
        withdrawPermission: false,
        importPermission: false,
        exportPermission: false,
      };
      for (let plan of this.featureDetails) {
        for (let item of plan) {
          if (item.featureCode.toLowerCase() == featurecode) {
            for (const permission in this.permissionDetails) {
              if (
                item.permissionDetails[0].hasOwnProperty(permission) &&
                item.permissionDetails[0][permission] == true
              ) {
                this.permissionDetails[permission] = true;
              }
            }
          }
        }
      }
    }
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
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
      this.adjustWidth();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.adjustWidth();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustWidth();
  }

  ngOnInit(): void {
    this.getMyactions();
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
    this.getMyActionColumns();
    this.onboardGBbusinessArea();
  }
  getMyActionColumns() {
    this.columnSettingsService.getMyActionColumns().subscribe((item: any) => {
      this.savedColumns = item.data.defaultColumns;
      if (this.savedColumns) {
        if (this.savedColumns[0] !== null) {
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
      }
    });
  }
  getMyactions() {
    this.loaderService.setShowLoading();
    this.planningService.getMyactions().subscribe({
      next: (res: any) => {
        this.loaderService.setDisableLoading();
        this.getUserRoleInfo();
        if (res.data) {
          let _data1 = [];
          _data1 = res.data;
          let _data2 = [];
      if (_data1 && _data1[0].module == 'Change Request'){
        this.getCMDataByCrNumber(_data1[0]?.requestId);
                }

          if (this.checkOnlyOsmDeliveryManager == true) {
            _data2 = _data1.filter((v) => {
              return (
                (this.checkOnlyOsmSectionSpoc == false &&
                  this.checkOnlyOsmDeliveryManager == true &&
                  v.module == 'De-boarding Request' &&
                  v.status.toLowerCase() == 'submitted') ||
                (v.module == 'Change Request' &&
                  v.status.toLowerCase() == 'submit')
              );
            });
          } else if (this.checkOnlyOsmSectionSpoc == true) {
            _data2 = _data1.filter((v) => {
              return (
                (this.checkOnlyOsmSectionSpoc == true &&
                  this.checkOnlyOsmDeliveryManager == false &&
                  v.module == 'De-boarding Request' &&
                  v.status.toLowerCase() != 'submitted') ||
                (v.module == 'Change Request' &&
                  v.status.toLowerCase() != 'submit')
              );
            });
          } else if (this.onlyViewRole == true) {
            _data2 = [];
          } else {
            _data2 = res.data;
          }
          this.rowData = res.data;
          // this.showLoading = false;
          this.loaderService.setDisableLoading();
        } else {
          // this.showLoading = false;
          this.loaderService.setDisableLoading();
        }
      },
      error: (e: any) => {
        // this.showLoading = false;
        this.loaderService.setDisableLoading();
        //////console.error(e.error.data.errorDetails[0].errorCode);
      },
      complete: () => {
        //////console.info('complete')
      },
    });
  }

  moduleLevelChnage(params: any) {
    return (
      "<span class='planning_code'>" +
      params.data.module.replace('Resource', 'De-boarding Request') +
      '</span>'
    );
  }

  onGridReady1(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.gridApi.setDomLayout('autoHeight');
  }

  onSearch() {
    this.filteredData = this.rowData.filter((row: any) =>
      Object.values(row).some((value: any) => {
        if (
          value !== null &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          const lowerCaseValue = String(value).toLowerCase();
          const lowerCaseSearchText = this.searchText.toLowerCase();
          return lowerCaseValue.includes(lowerCaseSearchText);
        }
        return false;
      })
    );

    this.gridApi.setRowData(this.filteredData);
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }

  toggleMySubmissions(col: any) {
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
  }

  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field && !element.dontShow) {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = ['requestId'];
    this.adjustWidth();
  }

  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  saveMyActionColumns() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.columnSettingsService
        .saveMyActionColumns(this.selectedColumns)
        .subscribe((item: any) => {
          if (item.status === 'success') {
            this.setActiveItem('');
            this.loaderService.setDisableLoading();
            this.notifyservice.alert('Filter applied Successful.');
          }
        });
      this.toggleDropdown();
    }
  }

  toggle(col: any) {
    let count = 0;
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) count += 1;
      if (this.columnDefs[x].headerName == col) {
        if (this.columnDefs[x].hide === false) {
          this.columnDefs[x].hide = true;
        } else {
          this.columnDefs[x].hide = false;
        }
      }
    }
    this.gridApi.setColumnDefs(this.columnDefs);
    this.selectedColumnNumber = count;
  }
  closeDropdown() {
    this.dropdownVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(
        event.target instanceof HTMLElement &&
        event.target.closest('.multiSelectDropDownSearch')
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

  openNoPlanningPopup(payload: any) {
    const dialogRef = this.dialog.open(NoplanningpopupComponent, {
      width: '85%',
      data: { message: payload },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success == 'success') {
        this.showLoading = true;
        this.getMyactions();
      } else {
        this.showLoading = false;
        this.getMyactions();
      }
    });
  }
  openCreateAopDialog(payload: any) {
    const dialogRef = this.dialog.open(CreateAOPpopupComponent, {
      width: '82%',
      data: { message: payload },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result.success == 'success') {
        this.showLoading = true;
        this.getMyactions();
      } else {
        this.showLoading = false;
        this.getMyactions();
      }
    });
  }
  checkDateValidation() {}

  FirstLevelLink(params: any) {
    return "<span class='planning_code'>" + params.data.requestId + '</span>';
  }

  actionCellRenderer(params: any) {
    let iconsHTML = '<div class="cfcycleicons">';
    const actionIconsWithSubmit: { [key: string]: string } = {
      approvePermission:
        '<span class="submit" title="Approve">&nbsp;</span>&nbsp;&nbsp;',
      rejectPermission:
        '<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;&nbsp;',
      delegatePermission:
        '<span class="planning_delegate" title="Delegate">&nbsp;&nbsp;&nbsp;</span>&nbsp;&nbsp;',
    };
    if (params.data.module.toLowerCase() == 'second level planning') {
      this.checkUserProfileValueValid('Planning', 'secondlevelplanning');

      for (const permission in actionIconsWithSubmit) {
        if (
          this.permissionDetails.hasOwnProperty(permission) &&
          this.permissionDetails[permission] == true
        ) {
          iconsHTML += actionIconsWithSubmit[permission];
        }
      }
      iconsHTML += '</div>';
      return iconsHTML;
    }
    if (params.data.module.toLowerCase() == 'annual outsourcing planning') {
      this.checkUserProfileValueValid('Planning', 'aopplanning');
      for (const permission in actionIconsWithSubmit) {
        if (
          this.permissionDetails.hasOwnProperty(permission) &&
          this.permissionDetails[permission] == true
        ) {
          iconsHTML += actionIconsWithSubmit[permission];
        }
      }
      iconsHTML += '</div>';
      return iconsHTML;
    }
    if (params.data.module.toLowerCase() == 'sowjd') {
      this.checkUserProfileValueValid('SOW JD', 'sowjd');
      for (const permission in actionIconsWithSubmit) {
        if (
          this.permissionDetails.hasOwnProperty(permission) &&
          this.permissionDetails[permission] == true
        ) {
          iconsHTML += actionIconsWithSubmit[permission];
        }
      }
      iconsHTML += '</div>';
      return iconsHTML;
    }

    if (params.data.module.toLowerCase() === 'srn') {
      return '<div class="cfcycleicons">&nbsp;<span class="submit" title="Approve">&nbsp;</span>&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
    }

    if (params.data.module == 'Change Request') {
      if (
        params.data.status?.toLowerCase() == 'submit' || params.data.status?.toLowerCase()=='resubmit'
      ) {
        return '<div class="cfcycleicons">&nbsp;<span class="submit" title="Approve">&nbsp;</span>&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
      }
      if (
        params.data.status.toLowerCase() == 'firstapprove'
      ) {
        return '<div class="cfcycleicons">&nbsp;<span class="submit" title="Approve">&nbsp;</span>&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
      }
      return '<div class="cfcycleicons">&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
    } else if (params.data.module == 'De-boarding Request') {
      if (
        params.data.status.toLowerCase() == 'submitted'
      ) {
        // this.checkOnlyOsmDeliveryManager &&
        return '<div class="cfcycleicons">&nbsp;<span class="submit" title="Approve">&nbsp;</span>&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
      }
      if (
        params.data.status.toLowerCase() == 'submitted2'
      ) {
        //  this.checkOnlyOsmSectionSpoc &&
        return '<div class="cfcycleicons">&nbsp;<span class="submit" title="Approve">&nbsp;</span>&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
      }
      return '<div class="cfcycleicons">&nbsp;<span class="sendback_planning" title="Send back">&nbsp;</span>&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
    } else if (params.data.module == 'On-boarding Request') {
      this.OnboardingTabDaetailsBasedID(params.data);
      if (
        params.data.status.toLowerCase() == 'submitted' ||
        params.data.status.toLowerCase() == 'first level approved'
      ) {
        return '<div class="cfcycleicons">&nbsp;<span class="planning_delegate" title="Delegate">&nbsp;</span></div>';
        //<span class="submit" title="Approve">&nbsp;</span>&nbsp; <span class="sendback_planning" title="Send back1">&nbsp;</span>&nbsp;&nbsp;<span class="sendReject_planning" title="Reject">&nbsp;</span>
      }
    } else {
      return '';
    }
  }
  onCellClicked(params: any): void {
    if (
      params.column.colId === 'code' &&
      params.event.target.className == 'planning_code'
    ) {
      if (params.data.module.toLowerCase() === 'sowjd') {
        if (params.data.statusID === 2) {
          // DH Approval
          this.router.navigate(['./my-actions/dh-approval', params.data.id]);
        }
        if (params.data.statusID === 3) {
          // SPOC Approval
          this.router.navigate(['./my-actions/spoc-approval', params.data.id]);
        }
      }

      if (params.data.module.toLowerCase() === 'srn') {
        this.router.navigate(['./sowjd-srn', params.data.id]);
      }

      if (params.data.module.toLowerCase() == 'second level planning') {
        this.router.navigate(['my-actions/second-level-details'], {
          queryParams: { id: params.data.id },
        });
      } else if (
        params.data.module.toLowerCase() == 'annual outsourcing planning'
      ) {
        this.router.navigate(['my-actions/aop-details'], {
          queryParams: { id: params.data.id },
        });
      }
    }
    if (
      params.column.colId === 'action' &&
      params.event.target.className === 'sendback_planning'
    ) {
      if (params.data.module.toLowerCase() === 'srn') {
        if (params.data.statusID === 1 || params.data.statusID === 5) {
          this.SRNSendBack(params.data.id, 1);
        }
        if (params.data.statusID === 2) {
          this.SRNSendBack(params.data.id, 2);
        }
      }
      if (params.data.module.toLowerCase() === 'sowjd') {
        if (params.data.statusID === 2) {
          this.onDHSubmit('sendback', params.data.id);
        }
        if (params.data.statusID === 3) {
          this.onSPOCSubmit('sendback', params.data.id);
        }
      }
      if (params.data.module.toLowerCase() == 'second level planning') {
        this.openWithdrawPlanningsecond(params.data, 'Rejected');
      }
      if (params.data.module.toLowerCase() == 'annual outsourcing planning') {
        this.openWithdrawPlanning(params.data, 'Rejected');
      }
      if (
        params.data.module == 'De-boarding Request' &&
        (params.data.status.toLowerCase() == 'submitted' ||
          (params.data.module == 'De-boarding Request' &&
            params.data.status.toLowerCase() == 'submitted2'))
      ) {
        this.openResouceActionDialog(params.data, 'Rejected');
      }

      if (
        params.data.module == 'Change Request' &&
        (params.data.status?.toLowerCase() == 'submit' ||
          params.data.status?.toLowerCase() == 'firstapprove' || params.data.status?.toLowerCase() == 'resubmit')
      ) {
        //alert('cm Sendback');
        this.openChangeManagementActionDialog(params.data, 'Rejected');
      }
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className === 'submit'
    ) {
      if (params.data.module.toLowerCase() === 'srn') {
        if (params.data.statusID === 1 || params.data.statusID === 5) {
          this.SRNApprove(params.data.id, 1, params.data.type);
        }
        if (params.data.statusID === 2) {
          this.SRNApprove(params.data.id, 2, params.data.type);
        }
      }
      if (params.data.module.toLowerCase() === 'sowjd') {
        if (params.data.statusID === 3) {
          // SPOC Approval
          this.router.navigate(['./my-sowjd/spoc-approval', params.data.id]);
        }

        if (params.data.statusID === 2) {
          // sowjd Approve
          this.onDHSubmit('approve', params.data.id);
        }
      }
      if (params.data.module.toLowerCase() == 'second level planning') {
        this.openWithdrawPlanningsecond(params.data, 'Approved');
      }
      if (params.data.module.toLowerCase() == 'annual outsourcing planning') {
        this.openWithdrawPlanning(params.data, 'Approved');
      }
      if (
        params.data.module == 'De-boarding Request' &&
        (params.data.status.toLowerCase() == 'submitted' ||
          (params.data.module == 'De-boarding Request' &&
            params.data.status.toLowerCase() == 'submitted2'))
      ) {
        this.getExitChecklistInfoApi(params.data);
        setTimeout(()=>{
          this.openResouceActionDialog(params.data, 'Approve');
        },3000)
       
      }
      if (
        params.data.module == 'Change Request' &&
        (params.data.status?.toLowerCase() == 'submit' ||
          params.data.status?.toLowerCase() == 'firstapprove'  || params.data.status?.toLowerCase() == 'resubmit')
      ) {
        //alert('cm Approve');
        this.openChangeManagementActionDialog(params.data, 'Approve');
      }
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className === 'planning_delegate'
    ) {
      if (params.data.module.toLowerCase() === 'sowjd') {
        if (params.data.statusID === 2) {
          // DH Delegate
          this.doDHDelegate(params.data.id);
        }
        if (params.data.statusID === 3) {
          // Sec Spoc Delegate
          this.doSPOCDelegate(params.data.id);
        }
      }
      if (params.data.module.toLowerCase() === 'srn') {
        if (params.data.statusID === 1 || params.data.statusID === 5) {
          this.SRNDelegate(params.data.id, 1);
        }
        if (params.data.statusID === 2) {
          this.SRNDelegate(params.data.id, 2);
        }
      }
      if (params.data.module.toLowerCase() == 'second level planning') {
        this.openDelegate_secondLevel(params.data, 'aopsl');
      }
      if (params.data.module.toLowerCase() == 'annual outsourcing planning') {
        this.openDelegate_secondLevel(params.data, 'aop');
      }
      if (
        (params.data.module == 'De-boarding Request' &&
          params.data.status.toLowerCase() == 'submitted') ||
        (params.data.module == 'De-boarding Request' &&
          params.data.status.toLowerCase() == 'submitted2')
      ) {
        this.openResouceActionDialog(params.data, 'Delegate');
      }

      if (
        params.data.module == 'Change Request' &&
        (params.data.status?.toLowerCase() == 'submit' ||
          params.data.status?.toLowerCase() == 'firstapprove'  || params.data.status?.toLowerCase() == 'resubmit')
      ) {
        //alert('cm Delegate')
        this.openChangeManagementActionDialog(params.data, 'Delegate');
      }
    }
    //Start Deboard
    if (
      params.column.colId == 'code' && params.data.module == 'De-boarding Request' && (params.data.status?.toLowerCase() == 'submitted' ||
        (params.data.status?.toLowerCase() == 'submitted2'))
    ) {      
      localStorage.removeItem('deBoardIDForStatus');
      localStorage.setItem('deBoardIDForStatus', params.data.status);
      this.APIResource.getDeboardAprroverDetails(params?.data?.id).subscribe((response:any)=>{
        if(response && response.data){
          let responseApproverData=response.data;
          params.data["firstApprover"]=responseApproverData.firstApprover ;
           params.data["firstApproverMailId"]=responseApproverData.firstApproverMailId ;
           params.data["firstApproverName"]=responseApproverData.firstApproverName ;
           params.data["isFirstLevelApproved"]=responseApproverData.isFirstLevelApproved ;
           params.data["secondApprover"]=responseApproverData.secondApprover ;
           params.data["secondApproverMailId"]=responseApproverData.secondApproverMailId ;
           params.data["secondApproverName"]=responseApproverData.secondApproverName ;
        }
      
        let _rowobjAllDetails = {
          element: JSON.stringify(params.data),
        };
        this.router.navigate(
          ['my-actions/De-boarding Request Details'],
          {
            queryParams: _rowobjAllDetails,
            skipLocationChange: true,
          }
        );
      })
   
    }
    if (
      params.column.colId == 'code' &&
      this.checkOnlyOsmDeliveryManager == true &&
      params.data.module == 'De-boarding Request' &&
      params.data.status.toLowerCase() == 'submitted2'
    ) {
      return;
    }
    //end
    //start CR
    if (
      params.column.colId == 'code' &&
      params.data.module == 'Change Request' &&
      (params.data.status?.toLowerCase() == 'submit' ||
        params.data.status?.toLowerCase() == 'firstapprove' || params.data.status?.toLowerCase() ==  "resubmit")
    ) {
      localStorage.removeItem('crIDForStatus');
      localStorage.setItem('crIDForStatus', 'forMyactionCR');
      let _rowobjAllDetails = {
        element: JSON.stringify(params.data),
      };
      this.router.navigate(['my-actions/Change Request Details'], {
        queryParams: _rowobjAllDetails,
        skipLocationChange: true,
      });
    }
    //end

    //Onboarding Start
    if (
      params.column.colId == 'action' &&
      params.data.module == 'On-boarding Request' &&
      (params.data.status.toLowerCase() == 'submitted' ||
        params.data.status.toLowerCase() == 'first level approved')
    ) {
      if (params.event.target.className === 'submit') {
        this.onboardApproveButton(params.data);
      }
      if (params.event.target.className === 'sendback_planning') {
        this.onboardSentBackButton(params.data);
      }
      if (params.event.target.className === 'sendReject_planning') {
        this.onboardRejectButton(params.data);
      }
      if (params.event.target.className === 'planning_delegate') {
        this.onboardDelegateButton(params.data);
      }
    }
    if (
      params.column.colId == 'code' &&
      params.data.module == 'On-boarding Request'
    ) {
      localStorage.removeItem('obIDForStatus');
      localStorage.setItem('obIDForStatus', 'forMyactionOB');
      let _rowobjAllDetails = {
        element: JSON.stringify(params.data),
        gbBusinnesOptionList: this.gbBusinnesOptionList,
      };
     
        if( params.data?.type=="6520"){
      this.router.navigate(['my-actions/Onboarding Request Details'], {queryParams: _rowobjAllDetails,skipLocationChange: true, });
    }
     else if(params.data?.type=="38F0"){
    this.router.navigate(['/my-actions/Onboarding Request Details BGS'], { queryParams: _rowobjAllDetails, skipLocationChange: true });
   }
    }
    //Onboparding End
  }

  // sowjd approve
  onDHSubmit(approvalStatus: string, sowJdId: string) {
    let statusValue;
    let message: string;
    if (approvalStatus === 'approve') {
      statusValue = 3; // Approve
      message = 'SoW JD is successfully approved';
    } else {
      statusValue = 5; // Send back
      message = 'SoW JD successfully send back to requester';
    }

    let dialogRef = this.dialog.open(CommonApprovalComponent, {
      width: '30vw',
      data: {
        type: approvalStatus,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.remarks) {
        this.loaderService.setShowLoading();
        const sowJdDH = {
          sowJdId: sowJdId,
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

  onSPOCSubmit(approvalStatus: string, sowJdId: string) {
    let statusValue: number;
    let message: string;
    statusValue = 17; // Send back
    message = 'SoW JD successfully send back to requester';

    let dialogRef = this.dialog.open(CommonApprovalComponent, {
      width: '30vw',
      data: {
        type: approvalStatus,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.remarks) {
        this.loaderService.setShowLoading();
        const sowJdSecSpoc = {
          sowJdId: sowJdId,
          status: statusValue,
          remarks: res.remarks,
        };
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
    });
  }

  doDHDelegate(sowJdId: string) {
    const dialogRef = this.dialog.open(DelegationComponent, {
      width: '50vw',
      data: {
        sowJdId: sowJdId,
        type: 'dh',
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  doSPOCDelegate(sowJdId: string) {
    const dialogRef = this.dialog.open(DelegationComponent, {
      width: '50vw',
      data: {
        sowJdId: sowJdId,
        type: 'spoc',
      },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }

  SRNDelegate(srnId: string, input: number) {
    const dialogRef = this.dialog.open(DelegateSrnComponent, {
      width: '40vw',
      data: { srnId, input },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }
  SRNSendBack(srnId: string, input: number) {
    const dialogRef = this.dialog.open(SendbackSrnComponent, {
      width: '40vw',
      data: { srnId, input },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }
  SRNApprove(srnId: string, input: number, sectionSpocApproval: string) {
    const dialogRef = this.dialog.open(ApproveSrnComponent, {
      width: '40vw',
      data: { srnId, input, sectionSpocApproval },
    });
    dialogRef.afterClosed().subscribe((res: any) => {
      if (res.data === 'yes') {
        this.ngOnInit();
      }
    });
  }
  openDelegate_secondLevel(payload: any, status: string) {
    if (status == 'aopsl') {
      payload.aopSlId = payload.id;
    }
    if (status == 'aop') {
      payload.aopId = payload.id;
    }
    const dialogRef = this.dialog.open(DelegateSecondlevelComponent, {
      width: '50%',
      data: { message: payload, status: status },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          // this.showLoading = true;
          this.getMyactions();
        }
      }
    );
  }
  openWithdrawPlanningsecond(payload: any, status: any) {
    console.log('payload', payload);
    payload.aopSlId = payload.id;
    const dialogRef = this.dialog.open(ApproveSLPComponent, {
      width: '50%',
      data: { message: payload, status: status },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          // this.showLoading = true;
          this.getMyactions();
        }
      }
    );
  }
  openWithdrawPlanning(payload: any, status: any) {
    payload.aopId = payload.id;
    const dialogRef = this.dialog.open(ApprovemyactionAOPComponent, {
      width: '50%',
      data: { message: payload, status: status },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          // this.showLoading = true;
          this.getMyactions();
        }
      }
    );
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  openResouceActionDialog(element: any, type: any) {
    let _obj = {
      rowData: element,
      type: type,
      reponseAllData:this.allResponseDeboardDetails,
    };
    const dialogRef = this.dialog.open(DebordingMoreActionDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getMyactions();
      if(result=="true"){
      window.location.reload();
      }
    });
  }
  gbBusinessAreaList:any=[];
  ddlChangeModel: any;
  getCMDataByCrNumber(_crNum){
    this.loaderService.setShowLoading();
    this.APIResource.getCmDateByCRnumberApi(_crNum).subscribe((res: any) => {
      this.loaderService.setDisableLoading();
      let _changeDDl:any =res?.data?.cmcrMaster[0]?.crInitiateTypeId;
      if (_changeDDl == "1" || _changeDDl == 1) {
        this.ddlChangeModel = 'SOW JD';      
      }
      else  if (_changeDDl == "2" || _changeDDl == 2)  {
        this.ddlChangeModel = 'Billable/Non-Billable';
      }
      else  if (_changeDDl == "3" || _changeDDl == 3)  {
        this.ddlChangeModel = 'Personal Sub-Area';
      }
      else  if (_changeDDl == "4" || _changeDDl == 4)  {
        this.ddlChangeModel = 'Purchase Order';   
      }
      else  if (_changeDDl == "5" || _changeDDl == 5)  {
        this.ddlChangeModel = 'Grade';   
      }
      this.gbBusinessAreaList=[];
      if(res && res.data && res.data.gbBusinessAreaList  && res.data.gbBusinessAreaList.length>0){
        this.gbBusinessAreaList = res.data.gbBusinessAreaList;
        }
      });
  }

  openChangeManagementActionDialog(element: any, type: any) {
    let _obj = {
      element: element,
      type: type,
    };
    if(type=='Approve')  {      
      _obj['gbBusinessAreaList']=this.gbBusinessAreaList,
      _obj['checkSowJDDDl']= this.ddlChangeModel;
      }
    const dialogRef = this.dialog.open(ChangeDetailsActionDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getMyactions();
      if(result=="true"){
      window.location.reload();
      }
    });
  }
  userDetails: userProfileDetails;
  roleList = [];
  checkOnlyOsmSectionSpoc: boolean = false;
  checkOnlyOsmDeliveryManager: boolean = false;
  onlyViewRole: boolean = false;

  getUserRoleInfo() {
    this.userDetails = JSON.parse(
      sessionStorage.getItem('user_profile_details')
    );
    if (
      this.userDetails &&
      this.userDetails.roleDetail &&
      this.userDetails.roleDetail.length > 0
    ) {
      this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
        (item: any) => item.roleName
      );

      this.checkOnlyOsmSectionSpoc = this.findCommonElement(this.roleList, [
        'Section SPOC BGSW',
        'Section SPOC BGSV',
        'Section_SPOC_BGSW',
        'Section_SPOC_BGSV',
      ]);
      this.checkOnlyOsmDeliveryManager = this.findCommonElement(this.roleList, [
        'Delivery Manager',
        'Delivery_Manager',
      ]);
      this.onlyViewRole = this.findCommonElement(this.roleList, ['View']);
    }
  }
  findCommonElement(array1, array2) {
    // Loop for array1
    for (let i = 0; i < array1.length; i++) {
      // Loop for array2
      for (let j = 0; j < array2.length; j++) {
        if (array1[i] === array2[j]) {
          // Return if common element found
          return true;
        }
      }
    }
    // Return if no common element exist
    return false;
  }
  onBtnExport(filename: string) {
    var params = {
      fileName: `${filename + '_Export' + '_' + this.ExportDate}.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  }
  onboardApproveButton(element: any) {
    let _obj = {
      rowData: element,
      gbBusinnesOptionListData: this.gbBusinnesOptionList,
    };
    const dialogRef = this.dialog.open(OnboardApproveDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      let approveData = result.data;
      let remarkValue="";
      remarkValue=approveData.remark;
      if (result && result.data && result.data.dialogtext == 'true') {
        let obj = {
          id: approveData.id,
          gbCode: approveData.gbBusinessArea,
          remark: approveData.remark,
          createdBy: approveData.createdBy || 'Bosch User',
          //"createdOn":  this.getCurrentDateTime() ,
        };
        this.APIResource.onboardingApproveApi(obj).subscribe(
          (response: any) => {
            if (response && response.status == 'success') { 
              let _sendMailTo = "";
              let _sendMailCC = "";
              let _mainText = 'Onboarding Request Approved Successfully';
              let buttonTextType = 'Request Approval';
              let teamName = 'All';
              let successMsg = "Onboarding Request Approved Successfully..!";
              if (element.module=='On-boarding Request' && element?.status?.toLowerCase() == 'submitted'){
                _sendMailTo = this.onboardingFirstApproveList?.secondApproverEmail;
                _sendMailCC = this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsDataOB?.vendorEmail;
                _mainText = 'Below request awaiting your approval';
               teamName =this.onboardingFirstApproveList?.secondApproverName || 'All';
             }           
             else if(element.module=='On-boarding Request' && element.status.toLowerCase() == 'first level approved'){
                _sendMailTo = this.onboardingFirstApproveList?.secondApproverEmail;
                _sendMailCC = this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsDataOB?.vendorEmail;
               _mainText = 'Below request is approved';
               teamName = this.onboardingFirstApproveList?.secondApproverName || 'All';
             }
              this.sendMailApiCallMethod('Approve',_sendMailTo,_sendMailCC,_mainText,buttonTextType,teamName,successMsg,element,remarkValue);
            }
          }
        );
      } else {
      }
    });
  }
  onboardSentBackButton(element: any) {
    let _obj = {
      rowData: element,
    };
    const dialogRef = this.dialog.open(OnboardSentBackDialogComponent, {
      width: '620px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == 'true') {
        let recordData = result.data;
        let remarkValue="";
        remarkValue=recordData.remark;
        let obj = {
          resourceOBRequestID: recordData.resourceOBRequestID,
          remark: recordData.remark,
          createdBy: recordData.createdBy,
          status: recordData.status,
        };
        this.APIResource.onboardingSendbackRejectPostApi(obj).subscribe(
          (response: any) => {
            if (response && response.status == 'success') {   
              let _sendMailTo = "";
              let _sendMailCC = "";
              let _mainText = 'Onboarding Sent Back Saved Successfully';
              let buttonTextType = 'Onboarding Sent Back';
              let teamName = 'All';
              let successMsg = "Onboarding Sent Back Saved Successfully..!"
              if (element.module=='On-boarding Request' && element?.status?.toLowerCase() == 'submitted'){
                _sendMailTo = this.vendorDetailsDataOB?.vendorEmail; 
                _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail;
             
             }
             else if(element.module=='On-boarding Request' && element.status.toLowerCase() == 'first level approved'){
              _sendMailTo = this.vendorDetailsDataOB?.vendorEmail; 
                _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ',' +this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsDataOB?.vendorEmail;
              
             }
              this.sendMailApiCallMethod('SentBack',_sendMailTo,_sendMailCC,_mainText,buttonTextType,teamName,successMsg,element,remarkValue);
            }
          }
        );
      } else {
      }
    });
  }
  onboardRejectButton(element: any) {
    let _obj = {
      rowData: element,
    };
    const dialogRef = this.dialog.open(OnboardRejectDialogComponent, {
      width: '620px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.data && result.data.dialogtext == 'true') {
        let recordData = result.data;
        let remarkValue="";
        remarkValue=recordData.remark;
        let obj = {
          resourceOBRequestID: recordData.resourceOBRequestID,
          remark: recordData.remark,
          createdBy: recordData.createdBy,
          status: recordData.status,
        };
        this.APIResource.onboardingSendbackRejectPostApi(obj).subscribe(
          (response: any) => {
            if (response && response.status == 'success') {
              let _sendMailTo = "";
            let _sendMailCC = "";
            let _mainText = 'Onboarding Rejected Saved Successfully';
            let buttonTextType = 'Onboarding Rejected';
            let teamName = 'All';
            let successMsg = "Onboarding Rejected Saved Successfully..!";
            if(element.module=='On-boarding Request' && element?.status?.toLowerCase() == 'submitted'){
              _sendMailTo = this.vendorDetailsDataOB?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail;
            
           }
           else if(element.module=='On-boarding Request' && element.status.toLowerCase() == 'first level approved'){
            _sendMailTo = this.vendorDetailsDataOB?.vendorEmail; 
              _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ',' +this.onboardingFirstApproveList?.firstApproverEmail+','+this.vendorDetailsDataOB?.vendorEmail;
          
           }
              this.sendMailApiCallMethod(
                'Rejected',
                _sendMailTo,
                _sendMailCC,
                _mainText,
                buttonTextType,
                teamName,
                successMsg,
                element,
                remarkValue
              );
            }
          }
        );
      } else {
      }
    });
  }
  onboardDelegateButton(element: any) {
    let _obj = {
      rowData: element,
    };
    const dialogRef = this.dialog.open(OnboardDelegateDialogComponent, {
      width: '600px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loaderService.setShowLoading();
      if (result && result.data && result.data.dialogtext == 'true') {
        let delData = result.data;
        let remarkValue="";
        remarkValue=delData.remarks;
        let obj = {
          delegateObjectId: delData.delegateObjectId,
          delegateObjectType: delData.delegateObjectType,
          delegatedTo: delData.delegatedTo,
          remarks: delData.remarks,
          createdOn: delData.createdOn,
          delegatedBy: delData.delegatedBy,
        };
        this.APIResource.onboardingDelegateApi(obj).subscribe(
          (response: any) => {
            this.showLoading = false;
            if (response && response.status == 'success') {
              let _sendMailTo = delData.delegateSelectedMailID;
              let _sendMailCC = '';
              let _mainText =
                'Onboarding Request Delegated to you Successfully';
              let buttonTextType = 'Record assigned for Approval';
              let teamName = delData.delegateSelectedMailID?.split('@')[0].replace('external.', '').replace('.', ' ');
              let successMsg = 'Onboarding Request Delegated Successfully..!';

  
              if(element.module=='On-boarding Request' && element?.status?.toLowerCase() == 'submitted'){
                _sendMailCC =this.onboardingFirstApproveList?.firstApproverEmail + ','+this.vendorDetailsDataOB?.vendorEmail;
                _mainText = this._checkuser.displayName + ' has delegated the below request for your approval.';
             }
             else if(element.module=='On-boarding Request' && element.status.toLowerCase() == 'first level approved'){
              _sendMailCC =this.onboardingFirstApproveList?.secondApproverEmail + ','+this.vendorDetailsDataOB?.vendorEmail;
              _mainText = this._checkuser.displayName + ' has delegated the below request for your approval.';
             }
              this.sendMailApiCallMethod('Delegate',_sendMailTo,_sendMailCC,_mainText,buttonTextType,teamName,successMsg,element,remarkValue);
            }
          }
        );
      } else {
      }
    });
  }
  sendMailApiCallMethod(btnType: any,_sendMailTo: any,_sendMailCC: any,_mainText: any,buttonTextType: any,teamName: any,successMsg: any,element: any,remarkValue:any) {
    let _createdOn = moment(new Date()).format('DD-MMM-yyyy');
    let _sendMailObject = {
      featureCode: 'MasterData-Approval-Process',
      to: _sendMailTo,
      cc: _sendMailCC,
      subject:
        'ENRICO | Onboarding | ' + element.requestId + ' | ' + buttonTextType,
      paraInTemplate: {
        teamName: teamName || 'All',
        mainText:
          _mainText +
         "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>" + element.requestId  +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Onboarding </td></tr><tr><td><b>Created On</b></td> <td>" + _createdOn + "</td></tr><tr class='trbg'><td><b>Submitted On</b></td> <td>" + _createdOn + "</td></tr><tr><td><b>Owner Name</b></td> <td> "+this.vendorDetailsDataOB?.vendorName+" </td></tr><tr class='trbg'><td><b>Record URL</b></td> <td> <a href=" + this._getPathUrl + "/Onboarding?data=onboarding target='_blank'><u>Click here</u></a> </td></tr><tr><td><b>My Action</b></td> <td> <a href=" + this._getPathUrl + "/my-actions target='_blank'><u>Click here</u></a> </td></tr><tr class='trbg'><td><b>Remarks</b></td> <td>" + this.getRemarkTextparagrapg(remarkValue) + "</td></tr></table>",
      },
    };
    this.snackBar.open(successMsg, 'Close', {
      duration: 4000,
    });
    this.APIResource.sendMailinitiateDeboardPost(_sendMailObject).subscribe(
      (response: any) => {}
    );
    setTimeout(() => {
      this.getMyactions();
      this.loaderService.setDisableLoading();
      window.location.reload();
    }, 1000);
  }
  onboardGBbusinessArea() {
    this.APIResource.getOnboardingOBList().subscribe((response: any) => {
      if (response && response.status == 'success') {
        if (response && response.data && response.data.gbDescription) {
          this.gbBusinnesOptionList = response.data.gbDescription;
        }
      }
    });
  }
  userDetailsRoles: any;
  onboardingFirstApproveList:any=[];
  vendorDetailsDataOB:any=[];
  _checkuser: any = [];
  _getPathUrl = environment.mailDeboardUrl;
  OnboardingTabDaetailsBasedID(element:any){
    this._checkuser = StorageQuery.getUserProfile();
    let _getLoginDetails = this.APIResource.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
    this.APIResource.getDetailsInformationOBbyID(element.id, this.userDetailsRoles).subscribe((response: any) => {
      if (response && response.data && response.data.firstApprovalInfo) {
        this.onboardingFirstApproveList = response.data.firstApprovalInfo[0];
      }
        if (response && response.data && response.data.resourceObVendorDetail) {
          this.vendorDetailsDataOB = response.data.resourceObVendorDetail[0];
        }
      
    });
  }
  getRemarkTextparagrapg(remarksValue:any){
    return remarksValue?.replace('FirstRejectedButtonOB:',' ').replace('SecondRejectedButtonOB:',' ').replace('SubmitRemarksFirstOBs:',' ').replace('ReSubmitRemarksSecondOBs:',' ')
  }
  allResponseDeboardDetails:any=[];
  getExitChecklistInfoApi(element: any) {
    this.loaderService.setShowLoading();
    let obj = {
      id: element.id
    }
    this.APIResource.getExitCheckListInfo(obj).subscribe((res: any) => {
      this.loaderService.setDisableLoading();
      if (res && res.data) {
        let _res = res.data;
        this.allResponseDeboardDetails=_res;
      }
    })
  }
}
