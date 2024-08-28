import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiResourceService } from '../../api-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { HostListener } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { LoaderService } from '../../../services/loader.service';
import * as moment from 'moment';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { VendorService } from 'src/app/vendor/services/vendor.service';
import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
@Component({
  selector: 'app-resource-plan',
  templateUrl: './resource-plan.component.html',
  styleUrls: ['./resource-plan.component.css']
})
export class ResourcePlanComponent implements OnInit {
  private gridApi!: GridApi;
  filterValue: string;
  paginationPageSize: number = 5;
  dropdownVisible = false;
  selectedMySubColumnNumber = 0;
  activeColumns: any;
  selectedColumns: any;
  userDetailsRoles: any = [];
 // userDetails: userProfileDetails;
  //roleList = [];
  //checkRoleResourcePlan:boolean=false;
  exitCheckRoleApproveSendbackDelegate: boolean = false;
  exitCheckRoleWithDrawResubmitExtendLwdRetainResource: boolean = false;
  checkOnlySectionSpoc: boolean = false;
  checkOnlyDeliveryManager: boolean = false;
  checkOnlyOSMAdmin: boolean = false;
  getProductId: any;
  //_roleGetPermission: any = [];
  showApproveSendBackDelegateBtn: boolean = false;
  showWithdrawResubmitExtendLwdRetainResourceBtn: boolean = false;
  showInitiateEclBtn: boolean = false;
  showAccessoriesCollectedBtn: boolean = false;
  showDeviceCollectedBtn: boolean = false;
  showEmployeeCardCollectedBtn: boolean = false;
  showNTidDeactivatedBtn: boolean = false;
  showCompleteEclBtn: boolean = false;
  columnApi: any;
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
  columnDefs: any = [
    
    {
      headerName: "Sign Off ID",
      field: "technicalProposalNumber",
      suppressDragLeaveHidesColumns: false,
      suppressMovable: true,
      pinned: 'left',
      hide: false,
    },
    {
      headerName: "SOW JD",
      field: "sowJdNumber",
      // suppressDragLeaveHidesColumns: false,
      // suppressMovable: true,
      // pinned: 'left',
      hide: false,
    },
    { 
      headerName: "Skillset", 
      field: "skillsetName",
      hide: false, },
    { 
      headerName: "Grade", 
      field: "grade",
      hide: false, },
    { 
      headerName: "Outsourcing Mode",
       field: "outSourcingType",
       hide: false, },
    { 
      headerName: "Location Mode",
       field: "locationMode",
       hide: false,},
    { 
      headerName: "Planned No. of Resource",
       field: "plannedNoOfResource" ,
       hide: false,},
    { 
      headerName: "Onboarding In-Progress",
       field: "onboardingInprogress",
       hide: false,},
    { 
      headerName: "Resources Onboarded",
       field: "resourceOnboarded",
       hide: false,},
    {
      headerName: "Yet to Onboard",
      field: "yetToOnboard",
      hide: false,},
    { 
      headerName: "Purchase Order",
      field: "purchaseOrder",
      hide: false,},
    { 
      headerName: "Vendor ID",
      field: "vendorSAPID",
      hide: false,},
    { 
      headerName: "Vendor Name",
      field: "vendorName",
      hide: false,},
    { 
      headerName: "Vendor Email ID",
      field: "email",
      hide: false,},
    { 
      headerName: "SOW JD Owner",
      field: "sowJdOwner",
      hide: false, },
    { 
      headerName: "Section SPOC",
      field: "sectionSpoc",
      hide: false, },
    { 
      headerName: "Personal Area",
      field: "personalArea",
      hide: false, 
    },
    {
      headerName: "Onboarding Date", 
      field: "resourceOnboardingDate", 
      valueFormatter: function (params) {
        return moment(params.value).format('DD-MMM-yyyy');
      }, 
      cellClass: 'onboardingDateFormat',
      hide: false,
      filterParams: {
        valueFormatter: function (params) {
          if(params.value==null){
            return ''
          }
          else{
          return moment(params.value).format('DD-MMM-yyyy');
          }
        },
      },
    },
    
    { 
      headerName: "Replacement Order", 
      field: "isReplacementOrder", 
      valueGetter: function (params) {
      if (params.data.isReplacementOrder == false) { return 'No'; }
      else { return 'Yes'; }
      },
      hide: false,
    },
    // { headerName: "Created By ", field: "createdBy" },
    // { headerName: "Created On ", field: "createdOn", valueFormatter: function (params) {
    //   return moment(params.value).format('DD-MMM-yyyy');
    // },cellClass: 'createdOnDateFormat' },
    // { headerName: "Modified By ", field: "modifiedBy" },
    // { headerName: "Modified On ", field: "modifiedOn", valueFormatter: function (params) {
    //   return moment(params.value).format('DD-MMM-yyyy');
    // },cellClass: 'modifiedOnDateFormat'},
    { headerName: "Deboarding Request ID", field: "deboardingRequestID", hide: false,  },
    {
      headerName: 'Action',
      field: 'action',
      suppressMenu: true,
      pinned: 'right',
      resizable: false,
      cellRenderer: this.actionRenderer.bind(this),
      cellStyle: this.cellStyling
    },
  ];
  rowData = [];
  defaultColumns : any;
  savedColumns: any;
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  excludedColumns = ['', 'action'];
  excelStyles = [
    {
      id: 'onboardingDateFormat',
      dataType: "dateTime",
      numberFormat: { format: "dd-MMM-yyyy" }
    },
    {
      id: 'createdOnDateFormat',
      dataType: "dateTime",
      numberFormat: { format: "dd-MMM-yyyy" }
    },
    {
      id: 'modifiedOnDateFormat',
      dataType: "dateTime",
      numberFormat: { format: "dd-MMM-yyyy" }
    }
  ];
  filterModel: any;
  filterToString: any;
  filterToParse: any;
  filterChipsSets: any = [];
  removedColumnFilters: any;
  columnFilters: any;
  finalKeyArray: any = [];
  vendorId:any;
  workLocationList:any=[];
  flagRefresh:boolean=false;
  resourceCompanyCodeList:any=[];

  subscription: Subscription;
  permissionsBehaviorSubjectResourcePlanOpenOrder: PermissionDetails;
  constructor(
    private vendorService: VendorService,public dialog: MatDialog, private router: Router, private API: ApiResourceService, private snackBar: MatSnackBar, public loaderService: LoaderService, private planningService: PlaningService, private sowjdService: sowjdService) {
    this.vendorId = this.vendorService.vendorId;
    this.subscription = this.sowjdService.getUserProfileRoleDetailResourcePlanOpenOrder().subscribe((roles: PermissionDetails) => {
        this.permissionsBehaviorSubjectResourcePlanOpenOrder = roles;
      });

  }
  ngOnInit() {
    this.paginationPageSize = 5;
    this.initNext();
  
    this.getOnboardRecord();
  //  this.getUserRolesInfo();
  }

  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
  }
  // getUserRolesInfo() {
  //   this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
  //   if(this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail[0] && this.userDetails.roleDetail[0].roleDetails){
  //    this.roleList = this.userDetails?.roleDetail[0]?.roleDetails?.map((item: any) => item.roleName);  
  //  }
  
  //      this.checkRoleResourcePlan= this.findCommonElement(this.roleList, ['OSM Admin','OSM','VIEW','View','view','Vendor', 'Vendor_BGSV', 'Vendor_BGSW','vendor', 'SOW JD Owner','SOW_JD_OWNER','Sow_JD_Owner', 'Sign off Owner','Sign_Off_Owner','Sign_off_Owner','sign_off_owner','BU SPOC/HOT','BU_SPOC_HOT','BU_SPOC_HOT_BGSV','BU_SPOC_HOT_BGSW']);    
  // this.getRolePermission();
  // }

  findCommonElement(array1, array2) {
    for (let i = 0; i < array1.length; i++) {
      for (let j = 0; j < array2.length; j++) {
        if (array1[i] === array2[j]) {
          return true;
        }
      }
    }
    return false;
  }

  // getRolePermission() {
  //   this._roleGetPermission = [];
  //   if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {
  //      let _fetaturedetailsArray = [];
  //      _fetaturedetailsArray = this.userDetails?.roleDetail[0]?.roleDetails[0]?.moduleDetails?.filter((v) => { return v.moduleName == "Resource" });
  //     if (_fetaturedetailsArray && _fetaturedetailsArray?.length > 0) {
  //        this._roleGetPermission = (_fetaturedetailsArray[0]?.featureDetails)?.filter(v1 => { return v1.featureCode == "ResourceOpenOrder" })[0]?.permissionDetails[0];
  //     }
  //     else {
  //       this._roleGetPermission = {
  //         createPermission: false,
  //         importPermission: false,
  //         editPermission: false,
  //         approvePermission: false,
  //         delegatePermission: false,
  //         deletePermission: false,
  //         exportPermission: false,
  //         readPermission: false,
  //         rejectPermission: false,
  //         withdrawPermission: false
  //       }
  //    }
  //   }
  //  }

  getOnboardRecord() {
    this.loaderService.setShowLoading();
    // const queryString = window.location.search;
    // const urlParams = new URLSearchParams(queryString);
    // const product_id = urlParams.get('getDeboardRequestID');
    // if (product_id != null || product_id != undefined) {
    //   this.getProductId = product_id;
    // }
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
    if (this.userDetailsRoles == "/EnricoUsers") {      
      this.API.getOnboardingOpenOrderList().subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        this.getResponseApiCall(response);
      });
    }
    else if (this.userDetailsRoles == "/Vendors") {
      let obj={
        'vendorID': _getLoginDetails.profile.vendor_id
      }
      this.API.getOnboardingOpenOrderListVendors(obj).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        this.getResponseApiCall(response);
      });
    }
  }
  getdeafultcolmuns(){
    if(this.vendorId){
      this.vendorService.getdeafultcolmunsVendor(67,this.vendorId)
      .subscribe((item: any) => {
        this.savedColumns = item.data;
        if (this.savedColumns) {
          let savedColumnsArray = this.savedColumns.split(',');

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
          this.adjustWidth();
        }
      });
    }else{
      this.planningService.getdeafultcolmuns(67)
      .subscribe((item: any) => {
        this.savedColumns = item.data;
        if (this.savedColumns) {
          let savedColumnsArray = this.savedColumns.split(',');

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
          this.adjustWidth();
        }
      });
    }

  }

  getResponseApiCall(response: any) {
    this.getdeafultcolmuns()
    let allDataPre: any = [];
    if (response && response.status == "success") {
      if (response && response.data && response.data.resourcePlanOpenOrder) {
        allDataPre = response.data.resourcePlanOpenOrder;
      }
      if (response && response.data && response.data.resourceWorkLocation) {
          this.workLocationList=response.data.resourceWorkLocation;
      }
      if (response && response.data && response.data.resourceCompanyCode) {
        this.resourceCompanyCodeList=response.data.resourceCompanyCode[0];
    }      
   }
    let allData = [];
    allData = allDataPre;
    if (allData && allData.length > 0) {
    //  if ((this.userDetailsRoles == "/Vendors")||(this.userDetailsRoles == '/EnricoUsers' && this._roleGetPermission && this._roleGetPermission?.readPermission && this.checkRoleResourcePlan==true)) {
      if ((this.userDetailsRoles == "/Vendors")||(this.userDetailsRoles == '/EnricoUsers' && this.permissionsBehaviorSubjectResourcePlanOpenOrder?.readPermission)) { 
        this.rowData = allData;
      }
      else{
        this.snackBar.open("Not Authorization Found to Access Data", 'Close', {
          duration: 6000,
        });
        this.rowData=[];
        return;
      }
     
      this.adjustWidth();
      this.resetFilters();
    }
    else {
      this.snackBar.open("No Data Found", 'Close', {
        duration: 3000,
      });
    }
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
  }

  actionRenderer(params: any) {
    if(this.userDetailsRoles == "/Vendors"){    
    let element:any = [];
    element = params.data;
    let _htmlContent = '<div>';
    if (this.userDetailsRoles == '/Vendors' && element?.resourceOnboardCompleted==0) {
    _htmlContent += '<span class="linkCrateOBRequest" title="Create Onboarding Request"><img src="../assets/images/add-frame.svg" style="width:20px"/><span style="margin:10px;text-decoration:underline;">Create Onboarding Request</span></span>';
    }
    _htmlContent += '</div>';
    return _htmlContent;
    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
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
  }

  onCellClicked(params: any) {
    if (params.column.colId === 'action' && this.userDetailsRoles == "/Vendors") {
      let element: any = [];
      element = params.data;
      this.onboardCreateRequest(element);
    }
  }
  cellStyling(params: any) {
    if (params.column.colId == 'action') {
      return { 'color': '#007bc0', 'cursor': 'pointer' };
    } else {
      return { 'color': '#000' };
    }
  }
  resetFilters() {
    if (this.gridApi) {
      if(this.flagRefresh==false){
      this.gridApi?.setFilterModel(null);
      }
      else{
        this.flagRefresh=false
      }
    }
  }
  getCapitalize(item: any) {
    var getcapVal=this.columnDefs.find(a=>a.field.toLowerCase()==item.toLowerCase());
    return getcapVal.headerName;
  }

  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(
        event.target instanceof HTMLElement &&
        event.target.closest('.column-setting-dialog')
      )
    ) {
      this.dropdownVisible = false;
      this.setActiveItem('');
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }
  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
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

  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }

  toggleDropdown() {
    this.toggle('');
    this.dropdownVisible = !this.dropdownVisible;
    if (!this.dropdownVisible) {
    }
  }
  
  toggle(col: any) {
    this.removeChips(col);
   
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
    this.adjustWidth();
  }

  saveFilter() {
    if (this.selectedColumns) {   
      if(this.vendorId){
        this.loaderService.setShowLoading();
        const payload={
          "objects": this.selectedColumns,
          "menuId": 67,
          "vendorid": this.vendorId
        }
        this.vendorService
          .saveColSettingsVendor(payload)
          .subscribe((item: any) => {
            if (item.status === 'success') {
              this.setActiveItem('');
              this.loaderService.setDisableLoading();
              this.showSnackbar('Filter applied Successful.')
            }
          });
        this.toggleDropdown();
        this.adjustWidth();
      } else{
        this.loaderService.setShowLoading();
        this.planningService
          .saveColSettings(67,this.selectedColumns)
          .subscribe((item: any) => {
            if (item.status === 'success') {
              this.setActiveItem('');
              this.loaderService.setDisableLoading();
              this.showSnackbar('Filter applied Successful.')
            }
          });
        this.toggleDropdown();
        this.adjustWidth();
      }  
     
    }  

  }
  toggleMySubmissions(col: any) {
    this.removeChips(col);
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
    this.adjustWidth();
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
    this.adjustWidth();
  }

  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field) {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);
    this.selectedColumns = [];
    this.adjustWidth();
  }

  exportAgBtn() {
    const previousColumnDefs = this.columnDefs;
    const filteredDefs = previousColumnDefs?.filter((columnDef: any) => {
      return (
        !this.excludedColumns.includes(columnDef.colId) &&
        !this.excludedColumns.includes(columnDef.headerName) &&
        columnDef.hasOwnProperty('field')
      );
    });
    var params = {
      fileName:   `ResourcePlan(Open Order)_Export_`+ moment(new Date()).format('DD-MMM-YYYY'),//`ResourcePlan-Records.xlsx`
    };
    let rowValues = this.rowData.map((obj: any) => ({ ...obj }));
    // rowValues.map((b) => {
    //   return b.createdOn = moment(b.createdOn.substring(0, 10)).format('DD-MMM-yyyy');
    // })
    // rowValues.map((c) => {
    //   return c.modifiedOn = moment(c.modifiedOn.substring(0, 10)).format('DD-MMM-yyyy');
    // })
    rowValues.map((d) => {
      if(d.createdOn){
      return d.resourceOnboardingDate = moment(d?.resourceOnboardingDate?.substring(0, 10)).format('DD-MMM-yyyy');
      }
    })
    const filterState = this.gridApi.getFilterModel();
    const fiterStateModified = JSON.parse(JSON.stringify(filterState));
    this.gridApi.setColumnDefs(filteredDefs.filter(v => { return v.field != "action" }) || []);
    this.gridApi.setRowData(rowValues);
    this.gridApi.setFilterModel(fiterStateModified);
    this.gridApi.exportDataAsExcel(params);
    this.gridApi.setColumnDefs(previousColumnDefs || []);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFilterModel(filterState);
    this.adjustWidth();
  }
  onboardCreateRequest(element: any) {
if((element?.firstApproverNtid==null || element?.firstApproverNtid=="")  || (element?.secondApproverNtid==null || element?.secondApproverNtid=="")){
  let fAntid=element?.firstApproverNtid==null?"First Approver Not Available":element?.firstApproverNtid==""?"First Approver Not Available":"First Approver Available";
  let sAntid=element?.secondApproverNtid==null?"Second Approver Not Available":element?.secondApproverNtid==""?"Second Approver Not Available":"Second Approver Available";

this.snackBar.open('First And second Both Approver should be available for onboarding creation. But currently '+ fAntid +" And "+ sAntid, 'Close', {
  duration: 8000,
});
return;
}

    let _rowobjAllDetails = {
      "element": JSON.stringify(element),
      "workLocationList":JSON.stringify(this.workLocationList),
      "checkCompanyCodeGlobal":this.resourceCompanyCodeList?.companyCode
    }
    
if( this.resourceCompanyCodeList?.companyCode=="6520"){
  this.router.navigate(['/Onboarding/Onboarding Form'], { queryParams: _rowobjAllDetails, skipLocationChange: true });
}
else if( this.resourceCompanyCodeList?.companyCode=="38F0"){
  this.router.navigate(['/Onboarding/Onboarding Form BGSV'], { queryParams: _rowobjAllDetails, skipLocationChange: true });
}    
  }

  refreshGetData() {
    this.filterValue = "";
    this.flagRefresh=true;
    this.ngOnInit();
  }
  closeDialogSetting() {
    this.dropdownVisible = false;
  }

  // filter chips start
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    if(this.vendorId){
      this.vendorService.getColFiltersVendor(67,this.vendorId).subscribe({
        next: (res: any) => {
          let onlyKeysarr = [];
          if (res.data.columnFilters == '') {
            this.filterChipsSets = null;
            this.ClearAllChipsFiltersOnIntialLoad()
          }
          if (res.data.columnFilters != '') {
            onlyKeysarr = JSON.parse(res.data.columnFilters);
            if (onlyKeysarr) {
              this.finalKeyArray = Object.keys(onlyKeysarr);
              this.filterChipsSets = Object.keys(onlyKeysarr)
            }
            this.gridOptions.api.setFilterModel(onlyKeysarr);
            this.loaderService.setDisableLoading();
          }
        }, error: (error: any) => {
          this.loaderService.setDisableLoading();
        }
      })
    }else{
      this.planningService.getColFilters(67).subscribe({
        next: (res: any) => {
          let onlyKeysarr = [];
          if (res.data.columnFilters == '') {
            this.filterChipsSets = null;
            this.ClearAllChipsFiltersOnIntialLoad()
          }
          if (res.data.columnFilters != '') {
            onlyKeysarr = JSON.parse(res.data.columnFilters);
            if (onlyKeysarr) {
              this.finalKeyArray = Object.keys(onlyKeysarr);
              this.filterChipsSets = Object.keys(onlyKeysarr)
            }
            this.gridOptions.api.setFilterModel(onlyKeysarr);
            this.loaderService.setDisableLoading();
          }
        }, error: (error: any) => {
          this.loaderService.setDisableLoading();
        }
      })
    }
 
  }

  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel();
    this.filterToString = JSON.stringify(this.filterModel);
    this.filterToParse = JSON.parse(this.filterToString)
    this.filterChipsSets = Object.keys(this.filterToParse)
    this.adjustWidth();
  }
  saveChipsFilters() {
    this.loaderService.setShowLoading();
    var payload: any = {
      menuid: 67,
      filters: JSON.stringify(this.filterModel),
    }
    var payloadvendor: any = {
      menuid: 67,
      filters: JSON.stringify(this.filterModel),
      vendorid: this.vendorId,
    }
    if(this.vendorId){
      this.vendorService.saveColFiltersVendor(payloadvendor).subscribe({
        next: (res: any) => {
          this.columnFilters = res.data.columnFilters;
          let onlyKeysarr = [];
          onlyKeysarr = JSON.parse(this.columnFilters);
          this.finalKeyArray = Object.keys(onlyKeysarr);
          this.filterChipsSets = Object.keys(onlyKeysarr);
  
          this.adjustWidth();
          this.loaderService.setDisableLoading();
          this.showSnackbar('Filter saved Successfully.')
        },
        error: (error: any) => {
          this.loaderService.setDisableLoading();
        }
      })
    }else{
      this.planningService.saveColFilters(payload).subscribe({
        next: (res: any) => {
          this.columnFilters = res.data.columnFilters;
          let onlyKeysarr = [];
          onlyKeysarr = JSON.parse(this.columnFilters);
          this.finalKeyArray = Object.keys(onlyKeysarr);
          this.filterChipsSets = Object.keys(onlyKeysarr);
  
          this.adjustWidth();
          this.loaderService.setDisableLoading();
          this.showSnackbar('Filter saved Successfully.')
        },
        error: (error: any) => {
          this.loaderService.setDisableLoading();
        }
      })
    }

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
        menuid: 67,
        filters: JSON.stringify(onlyKeysarr),
      }
      var payloadvendor: any = {
        menuid: 67,
        filters: JSON.stringify(onlyKeysarr),
        vendorid: this.vendorId,
      }
      if(this.vendorId){
        this.vendorService.saveColFiltersVendor(payloadvendor).subscribe({
          next: (res: any) => {
            this.removedColumnFilters = res.data.columnFilters;
            let onlyKeysarr2 = [];
            onlyKeysarr2 = JSON.parse(this.removedColumnFilters);
            this.gridOptions.api.setFilterModel(onlyKeysarr2);
            this.filterChipsSets = Object.keys(onlyKeysarr2);
            this.adjustWidth();
            this.loaderService.setDisableLoading();
          },
          error: (error: any) => {
          }
        })
      }else{
        this.planningService.saveColFilters(removepayload).subscribe({
          next: (res: any) => {
            this.removedColumnFilters = res.data.columnFilters;
            let onlyKeysarr2 = [];
            onlyKeysarr2 = JSON.parse(this.removedColumnFilters);
            this.gridOptions.api.setFilterModel(onlyKeysarr2);
            this.filterChipsSets = Object.keys(onlyKeysarr2);
            this.adjustWidth();
            this.loaderService.setDisableLoading();
          },
          error: (error: any) => {
          }
        })
      }

    }
  }
  ClearAllChipsFiltersOnIntialLoad() {
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 67,
      filters: '',
    }
    var payloadvendor: any = {
      menuid: 67,
      filters: '',
      vendorid: this.vendorId,
    }
    if(this.vendorId){
      this.vendorService.saveColFiltersVendor(payloadvendor).subscribe({
        next: (res: any) => {
          this.adjustWidth();
        },
        error: (error: any) => {
  
        }
      })
    }else{
      this.planningService.saveColFilters(payload).subscribe({
        next: (res: any) => {
          this.adjustWidth();
        },
        error: (error: any) => {
  
        }
      })
    }

    this.gridOptions.api.setFilterModel(null);

  }
  ClearAllChipsFilters() {
    this.loaderService.setShowLoading();
    this.filterChipsSets = [];
    var payload: any = {
      menuid: 67,
      filters: '',
    }
    var payloadvendor: any = {
      menuid: 67,
      filters: '',
      vendorid: this.vendorId,
    }
    if(this.vendorId){
      this.vendorService.saveColFiltersVendor(payloadvendor).subscribe({
        next: (res: any) => {
          this.loaderService.setDisableLoading();
          this.adjustWidth();
          this.showSnackbar('Filter cleared Successfully.')
        },
        error: (error: any) => {
          this.loaderService.setDisableLoading();
  
        }
      })
    }else{
      this.planningService.saveColFilters(payload).subscribe({
        next: (res: any) => {
          this.loaderService.setDisableLoading();
          this.adjustWidth();
          this.showSnackbar('Filter cleared Successfully.')
        },
        error: (error: any) => {
          this.loaderService.setDisableLoading();
  
        }
      })
    }

    this.gridOptions.api.setFilterModel(null);
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
}

