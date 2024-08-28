import { Component, SimpleChanges, Input, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ColDef,
  ColumnMovedEvent,
  DragStoppedEvent,
  GridApi,
  GridOptions,
} from 'ag-grid-community';
import { CreateFLPComponent } from '../popups/create-flp/create-flp.component';
import { PlaningService } from '../services/planing.service';
import { DatePipe } from '@angular/common';
import { WithdrawAOPComponent } from '../popups/withdraw-aop/withdraw-aop.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PlanningListService } from '../services/planning-list.service';
import { ApproveaopComponent } from '../popups/approveaop/approveaop.component';
import { EditpopupComponent } from '../popups/editpopup/editpopup.component';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { HomeService } from 'src/app/services/home.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-annualplanning',
  templateUrl: './annualplanning.component.html',
  styleUrls: ['./annualplanning.component.css'],
  providers: [DatePipe],
})
export class AnnualplanningComponent {
  @Input() selectedTab: number;
  CURRENT_TAB_INDEX: number;
  public showLoading = false;
  dropdownVisible = false;
  selectedColumnNumber = 0;
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
    // onDragStopped: (event: DragStoppedEvent) => this.onColumnMoved(event),
    // onColumnMoved: (event: ColumnMovedEvent) => this.onColumnMoved(event),
  };
  private gridApi!: GridApi;
  stayScrolledToEnd = true;
  selectedPlannedYear: any = 'All';
  selectedSection: any = 'All';
  aOPList: any = [];
  searchText = '';
  filteredData = [];
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
  columnApi: any;
  paginationPageSize: number = 5;
  isGridAPIReady: boolean = true;
  PlanningYearList: any = [
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2,
  ];
  public columnDefs_Aop_Planning: any = [];
  permissionDetails: any;
  employnumber: number;
  sectionList: any = [];
  rowData: any = [];
  public currenttabindex: any;

  // AUTH
  userProfile: UserProfile | any;
  featureDetails: any;
  userProfileDetails: userProfileDetails | any;
  osmRole: boolean = false;
  osmRoleAdmin: boolean = false;
  firstLevelAccessRoles: any;
  // selected Master Permission  details
  selectedMasterAccessRoles: any;
  ExportDate: any;
  selectedColumns: any;
  defaultColumns: any;
  activeColumns: any;
  savedColumns: any;
  finalKeyArray: any = [];
  columnFilters: any;
  removedColumnFilters: any;
  selectedMySubColumnNumber = 0;
  PlanningChipsKey: any;
  filterModel: any;
  filterToString: any;
  filterToParse: any;
  filterChipsSets: any = [];
  ColumnMoveddefs = [];
  columnSequence: any;
  constructor(
    private dialog: MatDialog,
    private planningService: PlaningService,
    private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private planningListService: PlanningListService,
    private router: Router,
    private homeService: HomeService,
    private loaderService: LoaderService
  ) {
    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate, 'dd-MMM-yyyy');
    this.currenttabindex = localStorage.getItem('transactionTabIndex');
    this.checkUserProfileValueValid();
  }

  // AOP Cycle AUTH functions
  getProfileRoles() {
    this.loaderService.setShowLoading();
    this.homeService.getProfileRoles().subscribe({
      next: (response: any) => {
        this.userProfileDetails = response.data;
        this.planningService.profileDetails = response.data;
        this.employnumber = this.userProfileDetails.employeeNumber;
        StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
        for (let role of this.userProfileDetails.roleDetail[0].roleDetails) {
          if (role.roleName.toLowerCase() == 'osm') {
            this.osmRole = true;
          }
          if (role.roleName.toLowerCase().startsWith('osm admin')) {
            this.osmRoleAdmin = true;
          }
        }
        const masterDataModules =
          this.userProfileDetails.roleDetail[0].roleDetails.filter(
            (item: any) =>
              item.moduleDetails.some(
                (module: any) => module.moduleName === 'Planning'
              )
          );
        const masterDataFeatureDetails = masterDataModules.map((item: any) => {
          const masterDataModule = item.moduleDetails.find(
            (module: any) => module.moduleName === 'Planning'
          );
          return masterDataModule.featureDetails;
        });

        this.featureDetails = masterDataFeatureDetails;
        this.selectedMasterAccessRoles = {
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
        this.firstLevelAccessRoles = {
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
            if (item.featureCode.startsWith('CFCyclePlanning')) {
              item.id = '0';
            } else if (item.featureCode.startsWith('AOPPlanning')) {
              item.id = '1';
            } else if (item.featureCode.startsWith('FirstLevelPlanning')) {
              item.id = '2';
            } else if (item.featureCode.startsWith('SecondLevelPlanning')) {
              item.id = '3';
            } else if (item.featureCode.startsWith('PODetails')) {
              item.id = '4';
            }
          }
          const sorttest2 = plan.sort((a, b) =>
            a.id < b.id ? -1 : Number(a.id > b.id)
          );
          plan = sorttest2;
          this.CURRENT_TAB_INDEX = plan.findIndex(
            (x: any) => x.featureCode.toLowerCase() === 'aopplanning'
          );
          if (parseInt(this.currenttabindex) == this.CURRENT_TAB_INDEX) {
            this.getAopList();
          }
          if (plan[0].featureCode.toLowerCase() == 'aopplanning') {
            this.getAopList();
          } else {
            this.loaderService.setDisableLoading();
          }
          for (let item of plan) {
            if (item.featureCode.toLowerCase() == 'aopplanning') {
              for (const permission in this.selectedMasterAccessRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.selectedMasterAccessRoles[permission] = true;
                }
              }
            }
          }
          for (let item of plan) {
            if (item.featureCode.toLowerCase() == 'firstlevelplanning') {
              for (const permission in this.firstLevelAccessRoles) {
                if (
                  item.permissionDetails[0].hasOwnProperty(permission) &&
                  item.permissionDetails[0][permission] == true
                ) {
                  this.firstLevelAccessRoles[permission] = true;
                }
              }
            }
          }
        }
        this.loaderService.setDisableLoading();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      },
    });
  }
  checkUserProfileValueValid() {
    this.planningService.profileDetails = StorageQuery.getUserProfile();
    if (
      this.planningService.profileDetails == '' ||
      this.planningService.profileDetails == undefined
    ) {
      this.getProfileRoles();
    } else {
      this.userProfileDetails = this.planningService.profileDetails;
      this.employnumber = this.userProfileDetails.employeeNumber;
      for (let role of this.userProfileDetails.roleDetail[0].roleDetails) {
        if (role.roleName.toLowerCase() == 'osm') {
          this.osmRole = true;
        }
        if (role.roleName.toLowerCase().startsWith('osm admin')) {
          this.osmRoleAdmin = true;
        }
      }
      const masterDataModules =
        this.userProfileDetails.roleDetail[0].roleDetails.filter((item: any) =>
          item.moduleDetails.some(
            (module: any) => module.moduleName === 'Planning'
          )
        );
      const masterDataFeatureDetails = masterDataModules.map((item: any) => {
        const masterDataModule = item.moduleDetails.find(
          (module: any) => module.moduleName === 'Planning'
        );
        return masterDataModule.featureDetails;
      });
      this.featureDetails = masterDataFeatureDetails;
      this.selectedMasterAccessRoles = {
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
      this.firstLevelAccessRoles = {
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
          if (item.featureCode.startsWith('CFCyclePlanning')) {
            item.id = '0';
          } else if (item.featureCode.startsWith('AOPPlanning')) {
            item.id = '1';
          } else if (item.featureCode.startsWith('FirstLevelPlanning')) {
            item.id = '2';
          } else if (item.featureCode.startsWith('SecondLevelPlanning')) {
            item.id = '3';
          } else if (item.featureCode.startsWith('PODetails')) {
            item.id = '4';
          }
        }
        const sorttest2 = plan.sort((a, b) =>
          a.id < b.id ? -1 : Number(a.id > b.id)
        );
        plan = sorttest2;
        this.CURRENT_TAB_INDEX = plan.findIndex(
          (x: any) => x.featureCode.toLowerCase() === 'aopplanning'
        );
        if (parseInt(this.currenttabindex) == this.CURRENT_TAB_INDEX) {
          this.getAopList();
        }
        if (plan[0].featureCode.toLowerCase() == 'aopplanning') {
          this.getAopList();
        } else {
          this.loaderService.setDisableLoading();
        }
        for (let item of plan) {
          if (item.featureCode.toLowerCase() == 'aopplanning') {
            for (const permission in this.selectedMasterAccessRoles) {
              if (
                item.permissionDetails[0].hasOwnProperty(permission) &&
                item.permissionDetails[0][permission] == true
              ) {
                this.selectedMasterAccessRoles[permission] = true;
              }
            }
          }
        }
        for (let item of plan) {
          if (item.featureCode.toLowerCase() == 'firstlevelplanning') {
            for (const permission in this.firstLevelAccessRoles) {
              if (
                item.permissionDetails[0].hasOwnProperty(permission) &&
                item.permissionDetails[0][permission] == true
              ) {
                this.firstLevelAccessRoles[permission] = true;
              }
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    // if(localStorage.getItem('FilterColumnSttingsPopupCheckedUncheckedPlanning')){
    //   this.columnDefs_Aop_Planning=JSON.parse(localStorage.getItem('FilterColumnSttingsPopupCheckedUncheckedPlanning'));
    //   }
    // this.getColSequence();
    this.initNext();
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
    this.adjustWidth();
  }
  onColumnMoved(params) {
    // this.ColumnMoveddefs = params.columnApi.getColumnState();
    // for(let col of this.ColumnMoveddefs){
    // col["field"] = col.colId ;
    // }
    // for(let item of this.ColumnMoveddefs){
    //   if(item.colId == "code"){
    //     item.field ='aopPlanningCode';
    //   }
    // }
    // for(let col of this.ColumnMoveddefs){
    //   for(let item of this.columnDefs_Aop_Planning){
    //     if(col.field == item.field){
    //       col.headerName = item.headerName;
    //     }
    //   }
    //   var movedColString = [];
    //   movedColString.push(col.field);
    //   this.selectedColumns = movedColString;
    // }
    // this.columnDefs_Aop_Planning = this.ColumnMoveddefs;
  }
  getColSequence() {
    // this.planningService.getColSequence(44).subscribe({
    //   next:(res:any)=>{
    //     console.log(JSON.parse(res.data.columnSequence));
    //     // this.columnDefs_Aop_Planning = JSON.parse(res.data.columnSequence)
    //     this.gridApi.setColumnDefs(this.columnDefs_Aop_Planning);
    //     // this.columnSequence = JSON.stringify(res.data.columnSequence);
    //     // this.columnSequence = JSON.parse(this.columnSequence);
    //     // var col  = [];
    //     // col = this.columnSequence;
    //   },error :(error:any)=>{
    //   }
    // })
  }
  getdeafultcolmuns() {
    this.planningService.getdeafultcolmuns(44).subscribe((item: any) => {
      this.savedColumns = item.data;
      if (this.savedColumns) {
        let savedColumnsArray = this.savedColumns.split(',');

        this.columnDefs_Aop_Planning.forEach((element, index) => {
          if (element.field) {
            let selectedColumnName = savedColumnsArray.find(
              (item: any) => item === element.field
            );
            if (selectedColumnName) {
              this.columnDefs_Aop_Planning[index].hide = false;
            } else {
              this.columnDefs_Aop_Planning[index].hide = true;
            }
          }
        });
        this.gridApi?.setColumnDefs(this.columnDefs_Aop_Planning);
      }
    });
  }

  getAopList() {
    this.loaderService.setShowLoading();
    this.getdeafultcolmuns();
    this.planningService.getAopList().subscribe({
      next: (res: any) => {
        if (res.data.length != 0 && res.status == 'success') {
          this.aOPList = res;
          for (let item of this.aOPList.data) {
            if (item.planningYearId != null) {
              item.planningYearId = item.planningYearId.toUpperCase();
            }
            if (item.aopPlanningCode != null) {
              item.aopPlanningCode = item.aopPlanningCode.toUpperCase();
            }
            if (item.cfCycleName != null) {
              item.cfCycleName = item.cfCycleName.toUpperCase();
            }
            item['duedays'] = this.calculateDiff(
              item.planningStartDate,
              item.planningEndate
            );
            if (this.selectedMasterAccessRoles.readPermission == true) {
              item.readPermission = true;
            } else {
              item.readPermission = false;
            }
            if (item.planningStartDate) {
              item.defaultStartDate = item.planningStartDate;
            }
            if (item.planningEndate) {
              item.defaultEndDate = item.planningEndate;
            }
            item.planningStartDate = this.datePipe.transform(
              item.planningStartDate,
              'dd-MMM-yyyy'
            );
            item.planningEndate = this.datePipe.transform(
              item.planningEndate,
              'dd-MMM-yyyy'
            );
            item.modifiedOn = this.datePipe.transform(
              item.modifiedOn,
              'dd-MMM-yyyy'
            );
            item.createdOn = this.datePipe.transform(
              item.createdOn,
              'dd-MMM-yyyy'
            );
          }
          this.rowData = this.aOPList.data;
          this.gridApi.setRowData(this.rowData);
          this.loaderService.setDisableLoading();
          setTimeout(() => {
            this.adjustWidth();
          }, 5);
        } else if (res.status == 'failed') {
          this.showSnackbar(res.data);
          this.loaderService.setDisableLoading();
        } else {
          this.loaderService.setDisableLoading();
        }
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {},
    });
  }
  calculateDiff(startdate: any, enddate: any) {
    let todayDate = new Date();
    let sentOnDate = new Date(enddate);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  }
  onGridReady_Aop_Planning(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.rowData == null ||
      this.rowData == undefined ||
      this.rowData.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
    this.columnDefs_Aop_Planning = [
      {
        headerName: 'AOP ID',
        field: 'aopPlanningCode',
        colId: 'code',
        cellRenderer: this.aopLink,
        minWidth: 280,
        resizable: true,
        pinned: 'left',
        disable: true,
        hide: false,
        enableFilter: false,
        suppressMenu: true,
        suppressDragLeaveHidesColumns: false,
        suppressMovable: true,
      },

      {
        headerName: 'Planning Year ID',
        field: 'planningYearId',
        resizable: true,
        hide: false,
      },
      {
        headerName: 'CF Cycles',
        field: 'cfCycleName',
        minWidth: 95,
        resizable: true,
        hide: false,
      },
      {
        headerName: 'Year',
        hide: false,
        editable: false,
        field: 'cfCycleYear',
        sortable: true,
        resizable: true,
        minWidth: 95,
      },
      {
        headerName: 'Starting Month',
        field: 'planningMonth',
        minWidth: 98,
        resizable: true,
        hide: false,
      },
      {
        headerName: 'Planning Start Date',
        field: 'planningStartDate',
        resizable: true,
        hide: false,
      },
      {
        headerName: 'Planning End Date',
        field: 'planningEndate',
        resizable: true,
        hide: false,
      },
      {
        headerName: 'Company Code',
        hide: false,
        editable: false,
        field: 'companyCode',
        resizable: true,
      },
      {
        headerName: 'Company Name',
        hide: false,
        editable: false,
        field: 'companyShortName',
        resizable: true,
      },
      {
        headerName: 'Owner',
        hide: false,
        editable: false,
        field: 'ownerName',
        resizable: true,
        minWidth: 250,
      },
      {
        headerName: 'Approver Name',
        field: 'fullname',
        hide: false,
        resizable: true,
        minWidth: 250,
      },
      {
        headerName: 'Approver NTID',
        field: 'ntid',
        hide: false,
        resizable: true,
      },
      {
        headerName: 'Created On',
        hide: false,
        editable: false,
        field: 'createdOn',
        resizable: true,
      },
      {
        headerName: 'Created By',
        hide: false,
        editable: false,
        field: 'createdBy',
        resizable: true,
      },
      {
        headerName: 'Modified On',
        hide: false,
        editable: false,
        field: 'modifiedOn',
        resizable: true,
      },
      {
        headerName: 'Modified By',
        hide: false,
        editable: false,
        field: 'modifiedBy',
        resizable: true,
      },
    ];
    this.columnDefs_Aop_Planning.push(
      {
        headerName: 'Status',
        field: 'status',
        hide: false,
        resizable: true,
        pinned: 'right',
      },
      {
        headerName: 'Actions',
        field: 'Actions',
        editable: false,
        colId: 'action',
        pinned: 'right',
        cellRenderer: this.renderActionIconsForMaster.bind(this),
      }
    );
    this.gridApi.setColumnDefs(this.columnDefs_Aop_Planning);
  }
  setColSequence() {
    // console.log("columns",this.columnDefs_Aop_Planning);
    // const payload:any = {
    //   menuid: 44,
    //   sequence: this.columnDefs_Aop_Planning
    // }
    // this.planningService.setColSequence(payload).subscribe({
    //   next:(res:any)=>{
    //     console.log(res);
    //   },error:(error:any)=>{
    //   }
    // })
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(44).subscribe({
      next: (res: any) => {
        let onlyKeysarr = [];
        if (res.data.columnFilters == '') {
          this.filterChipsSets = null;
          this.ClearAllChipsFiltersOnIntialLoad();
        }
        if (res.data.columnFilters != '') {
          onlyKeysarr = JSON.parse(res.data.columnFilters);
          if (onlyKeysarr) {
            this.finalKeyArray = Object.keys(onlyKeysarr);
            this.filterChipsSets = Object.keys(onlyKeysarr);
          }
          this.gridOptions.api.setFilterModel(onlyKeysarr);
          this.loaderService.setDisableLoading();
        }
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
  }

  toggleDropdown() {
    this.toggle('');
    this.dropdownVisible = !this.dropdownVisible;
    if (!this.dropdownVisible) {
    }
  }

  toggle(col: any) {
    this.removeChips(col);
    for (var x = 0; x < this.columnDefs_Aop_Planning.length; x++) {
      if (this.columnDefs_Aop_Planning[x].field === col) {
        if (this.columnDefs_Aop_Planning[x].hide === false) {
          this.columnDefs_Aop_Planning[x].hide = true;
        } else {
          this.columnDefs_Aop_Planning[x].hide = false;
        }
      }
    }

    this.gridApi.setColumnDefs(this.columnDefs_Aop_Planning);

    let allColumns = this.columnDefs_Aop_Planning.filter((x: any) => x.field);
    this.selectedMySubColumnNumber = allColumns.length;

    this.activeColumns = this.columnDefs_Aop_Planning.filter(
      (x: any) => x.field && x.hide == false
    );
    this.selectedColumns = this.activeColumns.map(
      (element: any) => element.field
    );
    this.adjustWidth();
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
  }
  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  filterYear(event: any) {
    this.rowData = this.aOPList.data;
    if (event.value == 'All') {
      this.rowData = this.aOPList.data;
      this.gridApi.setRowData(this.rowData);
    } else {
      this.rowData = this.rowData.filter(
        (obj: any) => obj.cfCycleYear == event.value
      );
      this.gridApi.setRowData(this.rowData);
    }
  }
  onCellClicked_Aop_Planning(params: any): void {
    if (
      params.column.colId === 'action' &&
      params.event.target.className == 'addaop'
    ) {
      this.openCreateFirstLevelDialog(params.data);
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'withdraw_planning'
    ) {
      this.openapprovePlanning(params.data, 'Cancelled');
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'submit'
    ) {
      this.openWithdrawPlanning(params.data, 'Submitted');
    } else if (
      params.column.colId === 'code' &&
      params.event.target.className == 'planning_code'
    ) {
      this.planningListService.aopplanninglist(params.data);
      this.router.navigate(['planning/aop-details'], {
        queryParams: { id: params.data.id },
      });
    } else if (
      params.column.colId === 'action' &&
      params.event.target.className == 'blue-edit_planning'
    ) {
      this.openEditPlanning(params.data, 'Submitted');
    }
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
  aopLink(params: any) {
    if (params.data.readPermission) {
      return (
        "<span class='planning_code'>" + params.data.aopPlanningCode + '</span>'
      );
    } else {
      return '<span>' + params.data.aopPlanningCode + '</span>';
    }
  }
  renderActionIconsForMaster(params: any) {
    let iconsHTML = '<div class="icon-class">';
    const actionIconsWithSubmit: { [key: string]: string } = {
      createPermission:
        '<span class="addaop" title="Create FLP">&nbsp;</span>&nbsp;&nbsp;',
      editPermission:
        '<span class="submit" title="Submit">&nbsp;</span>&nbsp;&nbsp;',
      withdrawPermission:
        '<span class="withdraw_planning" title="Withdraw">&nbsp;</span>&nbsp;&nbsp;',
    };

    const actionIconsWithOutSubmit: { [key: string]: string } = {
      editPermission:
        '<span class="blue-edit_planning" title="Edit">&nbsp;</span>&nbsp;&nbsp;',
    };
    if (params.data.duedays > 0) {
      if (
        params.data.status != 'Approved' &&
        params.data.status != 'Cancelled'
      ) {
        for (const permission in actionIconsWithOutSubmit) {
          if (
            this.selectedMasterAccessRoles.hasOwnProperty(permission) &&
            this.selectedMasterAccessRoles[permission] == true
          ) {
            iconsHTML += actionIconsWithOutSubmit[permission];
          }
        }
      }
    }
    if (params.data.duedays <= 0) {
      if (
        params.data.status == 'Planning Initiated' ||
        params.data.status == 'Rejected'
      ) {
        for (const permission in actionIconsWithSubmit) {
          if (
            this.selectedMasterAccessRoles.hasOwnProperty(permission) &&
            this.selectedMasterAccessRoles[permission] == true
          ) {
            if (permission == 'editPermission') {
              if (
                (parseInt(params.data.ownerEno) == this.employnumber ||
                  this.osmRole ||
                  this.osmRoleAdmin) &&
                params.data.childCount != null &&
                params.data.childCount > 0
              ) {
                iconsHTML += actionIconsWithSubmit[permission];
              }
            }
            if (permission == 'withdrawPermission') {
              if (parseInt(params.data.activitySpocId) == this.employnumber) {
                iconsHTML += actionIconsWithSubmit[permission];
              }
            }
          }
        }
      }
    }
    if (params.data.duedays <= 0) {
      if (
        params.data.status == 'Planning Initiated' ||
        params.data.status == 'Rejected'
      ) {
        for (const permission in actionIconsWithSubmit) {
          if (
            this.firstLevelAccessRoles.hasOwnProperty(permission) &&
            this.firstLevelAccessRoles[permission] == true
          ) {
            if (permission == 'createPermission') {
              if (
                parseInt(params.data.ownerEno) == this.employnumber ||
                this.osmRole ||
                this.osmRoleAdmin
              ) {
                iconsHTML += actionIconsWithSubmit[permission];
              }
            }
          }
        }
      }
    }

    iconsHTML += '</div>';

    return iconsHTML;
  }
  openCreateFirstLevelDialog(payload: any) {
    const dialogRef = this.dialog.open(CreateFLPComponent, {
      width: '80%',
      data: { message: payload },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getAopList();
        }
      }
    );
  }
  openWithdrawPlanning(payload: any, status: any) {
    const dialogRef = this.dialog.open(WithdrawAOPComponent, {
      width: '50%',
      data: { message: payload, status: status },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getAopList();
        }
      }
    );
  }
  openEditPlanning(payload: any, status: any) {
    const dialogRef = this.dialog.open(EditpopupComponent, {
      width: '40%',
      data: { message: payload, status: status },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getAopList();
        }
      }
    );
  }
  openapprovePlanning(payload: any, status: any) {
    const dialogRef = this.dialog.open(ApproveaopComponent, {
      width: '50%',
      data: { message: payload, status: status },
      panelClass: 'scrollable-dialog',
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe(
      (isFormSubmitted: boolean) => {
        if (isFormSubmitted) {
          this.loaderService.setShowLoading();
          this.getAopList();
        }
      }
    );
  }

  handleScroll(event: any) {
    this.gridApi.setAlwaysShowHorizontalScroll(true);
    const grid = document.getElementById('planningGrid');
    if (grid) {
      const gridBody = grid.querySelector('.ag-body-viewport') as any;
      const scrollPos = gridBody.offsetHeight + event.top;
      const scrollDiff = gridBody.scrollHeight - scrollPos;
      this.stayScrolledToEnd = scrollDiff <= 3;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      'selectedTab' in changes &&
      changes.selectedTab.currentValue == this.CURRENT_TAB_INDEX
    ) {
      if (this.selectedPlannedYear == 'All') {
        this.getAopList();
      } else {
        this.rowData = this.rowData.filter(
          (obj: any) => obj.cfCycleYear == this.selectedPlannedYear
        );
        this.gridApi.setRowData(this.rowData);
      }
    } else if (this.isGridAPIReady && changes['rowData']) {
      this.gridOptions.api?.setRowData(this.rowData);
    }
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  onBtnExport(filename: string) {
    var params = {
      fileName: `${filename + '_Export' + '_' + this.ExportDate}.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  }
  SaveSelectedGrid() {
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.planningService
        .saveColSettings(44, this.selectedColumns)
        .subscribe((item: any) => {
          if (item.status === 'success') {
            this.setActiveItem('');
            this.loaderService.setDisableLoading();
            this.showSnackbar('Filter applied Successful.');
          }
        });
      this.toggleDropdown();
      this.adjustWidth();
    }
  }
  selectAllColumns() {
    this.columnDefs_Aop_Planning.forEach((element, i) => {
      if (element.headerName && element.field) {
        this.columnDefs_Aop_Planning[i].hide = false;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs_Aop_Planning);

    this.selectedColumns = this.columnDefs_Aop_Planning
      .filter((element: any) => !element.hide)
      .map((item) => item.field);
    this.adjustWidth();
  }
  unSelectAllColumns() {
    this.columnDefs_Aop_Planning.forEach((element, i) => {
      if (element.headerName && element.field && !element.disable) {
        this.columnDefs_Aop_Planning[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs_Aop_Planning);

    this.selectedColumns = [];
    this.adjustWidth();
  }
  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs_Aop_Planning.filter(
      (x: any) => {
        x.field && x.hide == true;
      }
    ).length;
  }

  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel(); //same
    this.filterToString = JSON.stringify(this.filterModel);

    this.filterToParse = JSON.parse(this.filterToString);
    this.filterChipsSets = Object.keys(this.filterToParse);
    this.adjustWidth();
  }
  saveChipsFilters() {
    this.loaderService.setShowLoading();
    // API
    var payload: any = {
      menuid: 44,
      filters: JSON.stringify(this.filterModel),
    };
    this.planningService.saveColFilters(payload).subscribe({
      next: (res: any) => {
        this.columnFilters = res.data.columnFilters;
        let onlyKeysarr = [];
        onlyKeysarr = JSON.parse(this.columnFilters);
        this.filterChipsSets = Object.keys(onlyKeysarr);
        this.finalKeyArray = Object.keys(onlyKeysarr);
        this.adjustWidth();
        this.loaderService.setDisableLoading();
        this.showSnackbar('Filter saved Successfully.');
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
    // api
  }
  getCapitalize(item: any) {
    var getcapVal = this.columnDefs_Aop_Planning.find(
      (a) => a.field.toLowerCase() == item.toLowerCase()
    );
    return getcapVal.headerName;
    // return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/(\B[A-Z])/g, ' $1').replace('Ntid','NT ID').replace('I D','ID').replace('Enddate','End date').replace('Bu','BU').replace('Jd','JD').replace('Personnel Subarea','Personnel Subarea BGS').replace('Contract End','Contract End(SOW JD)')
  }
  removeChips(f: any) {
    let onlyKeysarr = [];
    const index = this.filterChipsSets.indexOf(f);
    if (index >= 0) {
      this.filterChipsSets.splice(index, 1);
      onlyKeysarr = JSON.parse(this.filterToString);
      delete onlyKeysarr[f];
      this.filterToString = JSON.stringify(onlyKeysarr);
      let onlyKeysarr2 = [];
      onlyKeysarr2 = JSON.parse(this.filterToString);
      this.gridOptions.api.setFilterModel(onlyKeysarr2);
      this.adjustWidth();

      this.loaderService.setDisableLoading();
      var removepayload: any = {
        menuid: 44,
        filters: JSON.stringify(onlyKeysarr),
      };
      this.planningService.saveColFilters(removepayload).subscribe({
        next: (res: any) => {
          this.removedColumnFilters = res.data.columnFilters; //chips name with value received from API
          let onlyKeysarr2 = [];
          onlyKeysarr2 = JSON.parse(this.removedColumnFilters);
          this.gridOptions.api.setFilterModel(onlyKeysarr2);
          this.filterChipsSets = Object.keys(onlyKeysarr2);
          this.adjustWidth();
          this.loaderService.setDisableLoading();
        },
        error: (error: any) => {},
      });
    }
  }
  ClearAllChipsFiltersOnIntialLoad() {
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 44,
      filters: '',
    };
    this.planningService.saveColFilters(payload).subscribe({
      next: (res: any) => {
        this.adjustWidth();
      },
      error: (error: any) => {},
    });
    this.gridOptions.api.setFilterModel(null);
  }
  ClearAllChipsFilters() {
    this.loaderService.setShowLoading();
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 44,
      filters: '',
    };
    this.planningService.saveColFilters(payload).subscribe({
      next: (res: any) => {
        console.log('filter response', res);
        this.loaderService.setDisableLoading();
        this.adjustWidth();
        this.showSnackbar('Filter cleared Successfully.');
      },
      error: (error: any) => {
        this.loaderService.setDisableLoading();
      },
    });
    this.gridOptions.api.setFilterModel(null);
  }
}
