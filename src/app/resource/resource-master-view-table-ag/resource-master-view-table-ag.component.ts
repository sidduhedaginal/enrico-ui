import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { InitiateDeBoardingDialogComponent } from '../initiate-de-boarding-dialog/initiate-de-boarding-dialog.component';
import { InformPartnerDialogComponent } from '../inform-partner-dialog/inform-partner-dialog.component';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HostListener } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { LoaderService } from '../../services/loader.service';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import * as moment from 'moment';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { VendorService } from 'src/app/vendor/services/vendor.service';
import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
@Component({
  selector: 'app-resource-master-view-table-ag',
  templateUrl: './resource-master-view-table-ag.component.html',
  styleUrls: ['./resource-master-view-table-ag.component.css']
})
export class ResourceMasterViewTableAgComponent implements OnInit {
  private gridApi!: GridApi;
  filterValue: any;
  paginationPageSize: number = 5;
  dropdownVisible = false;
  selectedMySubColumnNumber = 0;
  activeColumns: any;
  selectedColumns: any;
  userDetailsRoles: any = [];
  userDetails: userProfileDetails;
 // roleList = [];
  //exitCheckRoleInitiateDeboard: boolean = false;
 // exitCheckRoleInitiateChange: boolean = false;
 // exitCheckRoleInformPartner: boolean = false;
  allDataListDisplayTable: any = [];
  _roleGetPermission: any = [];
 // showInitiateDeboardChangeBtn: boolean = false;
 // showinformPartnerBtn: boolean = false;
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
  columnDefs:any = [
    { headerName: "Employee Number", field: "employeeNumber", hide: false, suppressDragLeaveHidesColumns: false,
    suppressMovable:true,
    pinned: 'left', },
    { headerName: "Employee Name", field: "employeeName", hide: false },
    { headerName: "NTID", field: "ntid", hide: false },
    { headerName: "Email ID", field: "emailID", hide: false },
    { headerName: "Sign Off ID",field: "technicalProposalNumber",hide: false },
    { headerName: "SOW JD", field: "sowJdID", hide: false },
    { headerName: "Skillset", field: "skillset", hide: false },
    { headerName: "Grade", field: "grade", hide: false },
    { headerName: "Outsourcing Type", field: "level", hide: false },
    { headerName: "Location Mode", field: "locationMode", hide: false },
    { headerName: "Company", field: "company", hide: false },
    { headerName: "Personnel Area", field: "personnelArea", hide: false },
    { headerName: "Personnel Subarea", field: "personnelSubarea", hide: false },
    { headerName: "Gender", field: "gender", hide: false },
    { headerName: "Purchase Order", field: "purchaseOrder", hide: false },
    { headerName: "PO Line Item", field: "poLineItem", hide: false },
    { headerName: "Vendor Name", field: "vendorName", hide: false },
    { headerName: "Vendor ID", field: "vendorID", hide: false },
    { headerName: "Vendor Email ID", field: "vendorEmail", hide: false },
    { headerName: "PO End date", field: "poEnddate", hide: false,valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy'); },cellClass: 'poEnddateDateFormat',     filterParams: {
        valueFormatter: function (params) {
          if(params.value==null){
            return ''
          }
          else{
          return moment(params.value).format('DD-MMM-yyyy');
          }
        },
      }, },
    { headerName: "Contract End(SOW JD)", field: "contractEnd", hide: false,valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy'); } ,cellClass: 'contractEndDateFormat',     filterParams: {
        valueFormatter: function (params) {
          if(params.value==null){
            return ''
          }
          else{
          return moment(params.value).format('DD-MMM-yyyy');
          }
        },
      }, },
    { headerName: "Group", field: "group", hide: false },
    { headerName: "Department", field: "department", hide: false },
    { headerName: "Section", field: "sectionName", hide: false },   
    { headerName: "Business Unit", field: "bu", hide: false },
    {headerName:"BU SPOC Name", field:"buSpocFullname",hide:false},
    { headerName: "SOW JD Owner", field: "deliveryManagerName", hide: false },//Delivery Manager Name    
    { headerName: "SOW JD Owner Email", field: "deliveryManagerEmail", hide: false },//Delivery Manager Email
    { headerName: "Section SPOC", field: "section", hide: false },
    { headerName: "Date of Joining", field: "dateOfJoining", hide: false ,valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy'); },cellClass: 'dateOfJoiningDateFormat',     filterParams: {
        valueFormatter: function (params) {
          if(params.value==null){
            return ''
          }
          else{
          return moment(params.value).format('DD-MMM-yyyy');
          }
        },
      }, },
    { headerName: "Billing Start Date", field: "billingStartDate", hide: false,valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy'); } ,cellClass: 'billingStartDateDateFormat',     filterParams: {
        valueFormatter: function (params) {
          if(params.value==null){
            return ''
          }
          else{
          return moment(params.value).format('DD-MMM-yyyy');
          }
        },
      }, },
    { headerName: "Billable", field: "billable", hide: false,valueGetter: function(params) {
      if(params.data.billable == 'True' || params.data.billable==true) {
          return 'Yes';
      } else {
          return 'No';
      } }
    },
    { headerName: "Available Capacity", field: "availableCapacity", hide: false },
    { headerName: "Employment Status", field: "employmentStatus", hide: false },
    { headerName: "Created By", field: "createdBy" },
    { headerName: "Created On", field: "createdOn", valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy');
    } ,cellClass: 'createdOnDateFormat',     filterParams: {
      valueFormatter: function (params) {
        if(params.value==null){
          return ''
        }
        else{
        return moment(params.value).format('DD-MMM-yyyy');
        }
      },
    },},
    { headerName: "Modified By", field: "modifiedBy" },
    { headerName: "Modified On", field: "modifiedOn" , valueFormatter: function (params) {
      if(params.value=='0001-01-01T00:00:00+00:00'){
         return ''
      }
      else{
      return moment(params.value).format('DD-MMM-yyyy');
      }
    },cellClass: 'modifiedOnDateFormat',     filterParams: {
      valueFormatter: function (params) {
        if(params.value==null || params.value=='0001-01-01T00:00:00+00:00'){
          return ''
        }
       else if(params.value=='0001-01-01T00:00:00+00:00'){
          return ''
        }
        else{
        return moment(params.value).format('DD-MMM-yyyy');
        }
      },
    },},
    { headerName: "Last Working Day", field: "lastWorkingDay"},
    { headerName: "Exit Reason", field: "exitReason" },
    { headerName: "Asset Returned", field: "isDeviceCollected",valueGetter: function(params) {
      if(params.data.isDeviceCollected == 'True' || params.data.isDeviceCollected==true) {
          return 'Yes';
      } else {
          return 'No';
      } } },
    { headerName: "Access Card Returned", field: "isEmployeeCardCollected" ,valueGetter: function(params) {
      if(params.data.isEmployeeCardCollected == 'True' || params.data.isEmployeeCardCollected==true) {
          return 'Yes';
      } else {
          return 'No';
      } }},
    {
      headerName: 'Action',
      field: 'action',
      suppressMenu: true,
      pinned: 'right',
      resizable: false,
      cellRenderer: this.actionRenderer.bind(this),
    },
  ];
  rowData = [];
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  excludedColumns = ['', 'action'];
  excelStyles = [
    {
        id: 'poEnddateDateFormat',
        dataType: "dateTime",
         numberFormat: { format: "dd-MMM-yyyy" }
    },
    {
      id: 'contractEndDateFormat',
      dataType: "dateTime",
       numberFormat: { format: "dd-MMM-yyyy" }
  },
  {
    id: 'dateOfJoiningDateFormat',
    dataType: "dateTime",
     numberFormat: { format: "dd-MMM-yyyy" }
},
{
  id: 'billingStartDateDateFormat',
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
},{
  id:'lastWorkingDayDateFormat',
  dataType: "dateTime",
numberFormat: { format: "dd-MMM-yyyy" }
}
  ];
  vendorId: string;
  flagRefresh:boolean=false;
  subscription: Subscription;
  permissionsBehaviorSubjectResourceMaster: PermissionDetails;
  constructor(
    private vendorService: VendorService,
    public dialog: MatDialog, 
    private router: Router,
     private API: ApiResourceService, 
     private snackBar: MatSnackBar, 
     public loaderService: LoaderService, 
     private columnSettingsService: ColumnSettingsService, 
      private planningService : PlaningService, private sowjdService: sowjdService) {
      this.vendorId = this.vendorService.vendorId;
      this.subscription = this.sowjdService.getUserProfileRoleDetailResourceMaster().subscribe((roles: PermissionDetails) => {
        this.permissionsBehaviorSubjectResourceMaster = roles;
      });
  }
  ngOnInit() {
    if(localStorage.getItem('FilterColumnSttingsPopupCheckedUncheckedRM')){
      this.columnDefs=JSON.parse(localStorage.getItem('FilterColumnSttingsPopupCheckedUncheckedRM'));
      }
    this.paginationPageSize=5;
    this.initNext();
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
   // if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {
     // this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
     //   (item: any) => item.roleName
     // );
     // this.exitCheckRoleInitiateDeboard = this.findCommonElement(this.roleList, ['OSM Admin', 'Vendor',]);
      //this.exitCheckRoleInitiateChange = this.findCommonElement(this.roleList, ['OSM Admin', 'Vendor',]);
     // this.exitCheckRoleInformPartner = this.findCommonElement(this.roleList, ['OSM Admin', 'OSM', 'Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW', 'Section_SPOC_BGSV', 'Department Secretory BGSV', 'BU_SPOC_HOT_BGSW', 'BU_SPOC_HOT_BGSV', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW', 'Section_SPOC_BGSV', 'Department_SPOC_BGSW']);
    //}
   // this.getRolePermission();
    this.getResourceMasterRecord();
  }

  // getRolePermission() {
  //   this._roleGetPermission = [];
  //   if (this.userDetails && this.userDetails.roleDetail) {
  //     let _array1 = this.userDetails.roleDetail[0].roleDetails;
  //     //this.showInitiateDeboardChangeBtn = this.findCommonElement(this.roleList, ['OSM Admin', 'Vendor', 'Vendor_BGSV', 'Vendor_BGSW']);
  //    // this.showinformPartnerBtn = this.findCommonElement(this.roleList, ['OSM Admin', 'OSM', 'Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW', 'Section_SPOC_BGSV', 'Department Secretory BGSV', 'BU_SPOC_HOT_BGSW', 'BU_SPOC_HOT_BGSV', 'Department_SPOC_BGSW']);
  //     let onlyOSmAdmin = this.findCommonElement(this.roleList, ['OSM Admin']);
  //     let onlyOsm = this.findCommonElement(this.roleList, ['OSM']);
  //     let onlyVendor = this.findCommonElement(this.roleList, ['Vendor', 'Vendor_BGSV', 'Vendor_BGSW']);
  //     let onlyDeliveryManager = this.findCommonElement(this.roleList, ['Delivery_Manager']);
  //     let onlyDepartmentSpoc = this.findCommonElement(this.roleList, ['Department_SPOC_BGSV', 'Department_SPOC_BGSW']);
  //     let onlySectionSpoc = this.findCommonElement(this.roleList, ['Section_SPOC_BGSW', 'Section_SPOC_BGSV']);
  //     let onlyDepartmentSecretory = this.findCommonElement(this.roleList, ['Department Secretory BGSV']);
  //     let onlyBuSpocHot = this.findCommonElement(this.roleList, ['BU_SPOC_HOT_BGSW', 'BU_SPOC_HOT_BGSV']);
  //     let _array2: any = [];
  //     if (onlyOSmAdmin == true) {
  //       _array2 = _array1.filter((item) => { return item.roleName == 'OSM Admin' })[0];
  //     }
  //     else if (onlyOsm == true && onlyOSmAdmin == false) {
  //       _array2 = _array1.filter((item) => { return item.roleName == 'OSM' })[0];
  //     }
  //     else if (onlyVendor == true && onlyOSmAdmin == false) {
  //       _array2 = _array1.filter((item) => { return (item.roleName == 'Vendor') || (item.roleName == "Vendor_BGSW") || (item.roleName == "Vendor_BGSV") })[0];
  //     }
  //     else if (onlyOSmAdmin == false && onlyOsm == false && onlyVendor == false && onlyDeliveryManager == true) {
  //       _array2 = _array1.filter((item) => { return item.roleName == 'Delivery_Manager' })[0];
  //     }
  //     else if (onlyOSmAdmin == false && onlyOsm == false && onlyVendor == false && onlyDepartmentSpoc == true) {
  //       _array2 = _array1.filter((item) => { return ((item.roleName == 'Department_SPOC_BGSV') || (item.roleName == "Department_SPOC_BGSW")) })[0];
  //     }
  //     else if (onlyOSmAdmin == false && onlyOsm == false && onlyVendor == false && onlySectionSpoc == true) {
  //       _array2 = _array1.filter((item) => { return ((item.roleName == 'Section_SPOC_BGSW') || (item.roleName == "Section_SPOC_BGSV")) })[0];
  //     }
  //     else if (onlyOSmAdmin == false && onlyOsm == false && onlyVendor == false && onlyDepartmentSecretory == true) {
  //       _array2 = _array1.filter((item) => { return item.roleName == 'Department Secretory BGSV' })[0];
  //     }
  //     else if (onlyOSmAdmin == false && onlyOsm == false && onlyVendor == false && onlyBuSpocHot == true) {
  //       _array2 = _array1.filter((item) => { return ((item.roleName == 'BU_SPOC_HOT_BGSW') || (item.roleName == "BU_SPOC_HOT_BGSV")) })[0];
  //     }
  //     else {
  //       _array2 = this.userDetails.roleDetail[0].roleDetails[0];
  //     }

  //     let _fetaturedetailsArray = [];
  //     _fetaturedetailsArray = _array2.moduleDetails.filter((v) => { return v.moduleName == "Resource" });
  //     if (_fetaturedetailsArray && _fetaturedetailsArray.length > 0) {
  //       let _a11 = (_fetaturedetailsArray[0].featureDetails).filter(v1 => { return v1.featureCode == "Resource Master" })[0];
  //       if (_a11) {
  //         this._roleGetPermission = (_fetaturedetailsArray[0].featureDetails).filter(v1 => { return v1.featureCode == "Resource Master" })[0].permissionDetails[0]
  //       }

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
  //     }
  //   }
  // }
  // findCommonElement(array1, array2) {
  //   for (let i = 0; i < array1.length; i++) {
  //     for (let j = 0; j < array2.length; j++) {
  //       if (array1[i] === array2[j]) {
  //         return true;
  //       }
  //     }
  //   }
  //   return false;
  // }

  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => {
        x.field && x.hide == true
      }
    ).length;

  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(this.filterValue);
  }

  actionRenderer(params: any) {
    let element: any = [];
    element = params.data;

      let _htmlContent = '<div class="cfcycleicons">&nbsp;';
   
        if ((this.userDetailsRoles == '/Vendors' && element?.isDbInitiated==false && element?.isCmInitiated==false)) {
        _htmlContent += '<span class="initiateDeboard" title="Initiate De-boarding" matTooltip="Initiate De-boarding"> <img src="../assets/img/initiateDeBording.png" style="width: 20px;margin-right: 16px;cursor:pointer;" class="initiateDeboardImg" /> </span>&nbsp;'
      }
   
        if (this.userDetailsRoles == '/Vendors' && element?.isDbInitiated==false && element?.isCmInitiated==false) {
        _htmlContent += '<span class="initiateChange" title="Initiate Change" matTooltip="Initiate Change"> <img src="../assets/img/initiateChange.png" style="width: 20px;margin-right: 16px;cursor:pointer;" class="initiateChangeImg"/></span>&nbsp;'
      }
      if (((this.userDetailsRoles == '/EnricoUsers') && this.permissionsBehaviorSubjectResourceMaster?.editPermission && element.employmentStatus=='Active' && element?.isDbInitiated==false && element?.isCmInitiated==false)) {
        _htmlContent += '<span class="infoPartner" title="Inform Partner" matTooltip="Inform Partner"> <img src="../assets/icons/alert-info.svg" style="width: 26px;margin-right: 16px;cursor:pointer;" class="infoPartnerImg"/></span>'
      }
      _htmlContent += '</div>';
      return _htmlContent;
  
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
  getResourceMasterRecord() {
    this.loaderService.setShowLoading();
    this.API.getResourceMaster().subscribe((response: any) => {
      this.loaderService.setDisableLoading();
      let _filterGetAllData: any = [];
     let myList= [];  
      myList=response.data.resourceMaster;  
      let arrayUniqueByKey=[]
       arrayUniqueByKey = [...new Map(myList.map(item =>
        [item['employeeNumber'], item])).values()];  
            
         if (this.userDetailsRoles == "/Vendors") {
        let _vendorSapId = String(this.userDetails['vendorSAPID']);
        _filterGetAllData = (arrayUniqueByKey).filter((v: any) => { return v.vendorID == _vendorSapId });
      }
      else {
        _filterGetAllData = arrayUniqueByKey;
      }
      let allData = _filterGetAllData;
      if (allData && allData.length > 0) {
        this.allDataListDisplayTable = allData;
        this.rowData = allData;
        this.resetFilters();      
      }
      else {      
        this.snackBar.open("No Data Found", 'Close', {
          duration: 3000,
        });
      }
    });

  }
  onCellClicked(params: any) {
    if (params.column.colId === 'action') {
      let element: any = [];
      element = params.data;
      if (params && params.event.target.className == 'initiateDeboardImg') {

        this.initiateDeBording(element, 'Initiate De-boarding');
      }
      else if (params && params.event.target.className == 'initiateChangeImg') {
        this.initiateChangeRequest(element);
      }
      else if (params && params.event.target.className == 'infoPartnerImg') {
        this.informPartnerLink(element);
      }
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
  // onFirstDataRendered(event: any) {
  //   this.adjustWidth();
  //   let onlyKeysarr=[];
  //   onlyKeysarr=JSON.parse(localStorage.getItem('filterModelRM'));
  //   if(onlyKeysarr){
  //  this.finalKeyArray =Object.keys(onlyKeysarr) ;
  //   }
  //      //-----------
  //      localStorage.getItem('RMChipsKey')
  //      this.gridOptions.api.setFilterModel(onlyKeysarr);
  // }
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
    }
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
  finalKeyArray:any=[];
  // onFilterChanged(event: any) {
  
  //   const filterModel = event.api.getFilterModel();
  //   localStorage.setItem('filterModelRM', JSON.stringify(filterModel));
  //   let onlyKeysarr=[];
  //   onlyKeysarr=JSON.parse(localStorage.getItem('filterModelRM'));
  //   this.finalKeyArray =Object.keys(onlyKeysarr) ;
  //   this.adjustWidth();
  //   //------------
  //   localStorage.setItem('RMChipsKey',this.finalKeyArray)
  // }
  getCapitalize(item:any) {
    var getcapVal=this.columnDefs.find(a=>a.field.toLowerCase()==item.toLowerCase());
    return getcapVal.headerName;  }
  // removeChips(f:any) {    
  //   let onlyKeysarr=[];
  //   const index =this.finalKeyArray.indexOf(f);  
  //   if (index >= 0) {
  //     this.finalKeyArray.splice(index, 1);
  //     onlyKeysarr=JSON.parse(localStorage.getItem('filterModelRM'));         
  //     delete onlyKeysarr[f];     
  //     localStorage.setItem('filterModelRM', JSON.stringify(onlyKeysarr));
  //     let onlyKeysarr2=[];
  //     onlyKeysarr2=JSON.parse(localStorage.getItem('filterModelRM'));     
  //     this.gridOptions.api.setFilterModel(onlyKeysarr2);
  //     this.adjustWidth();
  //       //---
  //   localStorage.setItem('RMChipsKey',this.finalKeyArray)
  //   }
  // }
  // ClearAllChipsFilters(){
  //   this.finalKeyArray=[];
  //   localStorage.removeItem('filterModelRM');
  //   this.gridOptions.api.setFilterModel(null);
  //   localStorage.removeItem('RMChipsKey')
 
  // }
  
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
    this.dropdownVisible = !this.dropdownVisible;
  }

  saveFilter() {
    if (this.selectedColumns) {
    //   this.columnSettingsService.saveColumnsDMMyAction(this.selectedColumns)
    //     .subscribe((item: any) => {
    //       if (item.status === 'success') {
    //       }
    //     });
    //   this.toggleDropdown();
     }
     localStorage.setItem('FilterColumnSttingsPopupCheckedUncheckedRM',JSON.stringify(this.columnDefs))
  this.toggleDropdown();

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
      fileName:  `ResourceMaster_Export_`+ moment(new Date()).format('DD-MMM-YYYY'),//`ResourceMasterTable.xlsx`,
    };
    let rowValues = this.rowData.map((obj: any) => ({ ...obj }));
    rowValues.map((b)=>{
      return  b.createdOn=moment(b.createdOn.substring(0,10)).format('DD-MMM-yyyy');
    })
    rowValues.map((c)=>{
      return  c.modifiedOn=moment(c.modifiedOn.substring(0,10)).format('DD-MMM-yyyy');
    })
    rowValues.map((d)=>{
      return  d.createdBy="";//In excelsheet createded by empty todo
    })
    const filterState = this.gridApi.getFilterModel();
    const fiterStateModified = JSON.parse(JSON.stringify(filterState));
    this.gridApi.setColumnDefs(filteredDefs.filter(v=>{return v.field!="action"}) || []);
    this.gridApi.setRowData(rowValues);
    this.gridApi.setFilterModel(fiterStateModified);
    this.gridApi.exportDataAsExcel(params);
    this.gridApi.setColumnDefs(previousColumnDefs || []);
    this.gridApi.setRowData(this.rowData);
    this.gridApi.setFilterModel(filterState);
    this.adjustWidth();      
  }


  initiateDeBording(element: any, type: any) {
    if((element?.sowOwnerNtID==null || element?.sowOwnerNtID=="")  || (element?.sectionSpocNtID==null || element?.sectionSpocNtID=="")){
      let fAntid=element?.sowOwnerNtID==null?"First Approver Not Available":element?.sowOwnerNtID==""?"First Approver Not Available":"First Approver Available";
      let sAntid=element?.sectionSpocNtID==null?"Second Approver Not Available":element?.sectionSpocNtID==""?"Second Approver Not Available":"Second Approver Available";
    this.snackBar.open('First And second Both Approver should be available for onboarding creation. But currently '+ fAntid +" And "+ sAntid, 'Close', {
      duration: 8000,
    });
    return;
    }
    let _elementArry = [];
    _elementArry = this.allDataListDisplayTable.filter((v => {
      return v.employeeNumber == element.employeeNumber
    }))
    let _obj = {
      rowData: _elementArry[0],
      type: type
    }
    const dialogRef = this.dialog.open(InitiateDeBoardingDialogComponent, {
      width: '700px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  initiateChangeRequest(element: any) {  
    if((element?.sowOwnerNtID==null || element?.sowOwnerNtID=="")  || (element?.sectionSpocNtID==null || element?.sectionSpocNtID=="")){
      let fAntid=element?.sowOwnerNtID==null?"First Approver Not Available":element?.sowOwnerNtID==""?"First Approver Not Available":"First Approver Available";
      let sAntid=element?.sectionSpocNtID==null?"Second Approver Not Available":element?.sectionSpocNtID==""?"Second Approver Not Available":"Second Approver Available";
    this.snackBar.open('First And second Both Approver should be available for onboarding creation. But currently '+ fAntid +" And "+ sAntid, 'Close', {
      duration: 8000,
    });
    return;
    }
    let _elementArry = [];
    _elementArry = this.allDataListDisplayTable.filter((v => {
      return v.employeeNumber == element.employeeNumber
    }))

    this.router.navigate(['/Resource-Management/Initiate Change Request'], { queryParams: _elementArry[0], skipLocationChange: true });
  }

  informPartnerLink(element: any) {   
    let _elementArry = [];
    _elementArry = this.allDataListDisplayTable.filter((v => {
      return v.employeeNumber == element.employeeNumber
    }))
    const dialogRef = this.dialog.open(InformPartnerDialogComponent, {
      width: '700px',
      maxHeight: '99vh',
      disableClose: true,
      data: _elementArry[0],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
  refreshGetData() {   
    this.flagRefresh=true;
    this.ngOnInit();
  }
  closeDialogSetting() {
    this.dropdownVisible = false;
  }

  filterModel:any;
  filterToString : any;
  filterToParse :any;
  filterChipsSets :any = [];
  removedColumnFilters:any;
  columnFilters : any;
    // filter chips start
    onFirstDataRendered(event: any) {
      this.adjustWidth();
      if(this.vendorId){
        this.vendorService.getColFiltersVendor(64,this.vendorId).subscribe({
          next:(res:any)=>{
            let onlyKeysarr = [];
            if(res.data.columnFilters == ''){
              this.filterChipsSets = null;
              this.ClearAllChipsFiltersOnIntialLoad()
            }
            if(res.data.columnFilters != ''){
              onlyKeysarr=JSON.parse(res.data.columnFilters);
              if(onlyKeysarr){
                this.finalKeyArray =Object.keys(onlyKeysarr) ;
                this.filterChipsSets = Object.keys(onlyKeysarr)
              }
                this.gridOptions.api.setFilterModel(onlyKeysarr);
                this.loaderService.setDisableLoading();
            }
          },error:(error:any)=>{
            this.loaderService.setDisableLoading();
          }
        })
      }else{
        this.planningService.getColFilters(64).subscribe({
          next:(res:any)=>{
            let onlyKeysarr = [];
            if(res.data.columnFilters == ''){
              this.filterChipsSets = null;
              this.ClearAllChipsFiltersOnIntialLoad()
            }
            if(res.data.columnFilters != ''){
              onlyKeysarr=JSON.parse(res.data.columnFilters);
              if(onlyKeysarr){
                this.finalKeyArray =Object.keys(onlyKeysarr) ;
                this.filterChipsSets = Object.keys(onlyKeysarr)
              }
                this.gridOptions?.api?.setFilterModel(onlyKeysarr);
                this.loaderService.setDisableLoading();
            }
          },error:(error:any)=>{
            this.loaderService.setDisableLoading();
          }
        })
      }

    }
   
  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel();  
    this.filterToString =  JSON.stringify(this.filterModel);
    this.filterToParse = JSON.parse(this.filterToString)
    this.filterChipsSets = Object.keys(this.filterToParse)
    this.adjustWidth();
  }
  saveChipsFilters(){
    this.loaderService.setShowLoading();
   var payloadVendor: any = {
    menuid: 64,
      filters: JSON.stringify(this.filterModel),
      vendorid: this.vendorId,
    }
    var payload: any = {
      menuid: 64,
        filters: JSON.stringify(this.filterModel),
      }
    if(this.vendorId){
      this.vendorService.saveColFiltersVendor(payloadVendor).subscribe({
        next:(res:any)=>{
          this.columnFilters =  res.data.columnFilters;
          let onlyKeysarr= [];
          onlyKeysarr = JSON.parse(this.columnFilters);
          this.filterChipsSets = Object.keys(onlyKeysarr);
          this.finalKeyArray = Object.keys(onlyKeysarr) ;
          this.adjustWidth();
          this.loaderService.setDisableLoading();
          this.showSnackbar('Filter saved Successfully.')
        },
        error:(error:any)=>{
          this.loaderService.setDisableLoading();
        }
      })
    }else{
      this.planningService.saveColFilters(payload).subscribe({
        next:(res:any)=>{
          this.columnFilters =  res.data.columnFilters;
          let onlyKeysarr= [];
          onlyKeysarr = JSON.parse(this.columnFilters);
          this.filterChipsSets = Object.keys(onlyKeysarr);
          this.finalKeyArray = Object.keys(onlyKeysarr) ;
          this.adjustWidth();
          this.loaderService.setDisableLoading();
          this.showSnackbar('Filter saved Successfully.')
        },
        error:(error:any)=>{
          this.loaderService.setDisableLoading();
        }
      })
    }

  }
  removeChips(f:any) { 
    let onlyKeysarr=[];
    const index = this.filterChipsSets.indexOf(f);  
    if (index >= 0) {
      this.filterChipsSets.splice(index, 1);
      onlyKeysarr = JSON.parse(this.filterToString);         
      delete onlyKeysarr[f]; 
      this.filterToString = JSON.stringify(onlyKeysarr);
      let onlyKeysarr2=[];
      onlyKeysarr2 = JSON.parse(this.filterToString);     
      this.gridOptions.api.setFilterModel(onlyKeysarr2);
      this.adjustWidth();  
      this.loaderService.setDisableLoading();
      var removepayload: any = {
        menuid: 64,
          filters: JSON.stringify(onlyKeysarr),
        }
        var removepayloadVendor: any = {
          menuid: 64,
            filters: JSON.stringify(onlyKeysarr),
            vendorid: this.vendorId,
          }
        if(this.vendorId){
          this.vendorService.saveColFiltersVendor(removepayloadVendor).subscribe({
            next:(res:any)=>{
              this.removedColumnFilters =  res.data.columnFilters; 
              let onlyKeysarr2=[];
              onlyKeysarr2=JSON.parse(this.removedColumnFilters);     
              this.gridOptions.api.setFilterModel(onlyKeysarr2);
              this.filterChipsSets = Object.keys(onlyKeysarr2) ;
              this.adjustWidth();
              this.loaderService.setDisableLoading();
            },
            error:(error:any)=>{
            }
          })
        }else{
          this.planningService.saveColFilters(removepayload).subscribe({
            next:(res:any)=>{
              this.removedColumnFilters =  res.data.columnFilters; 
              let onlyKeysarr2=[];
              onlyKeysarr2=JSON.parse(this.removedColumnFilters);     
              this.gridOptions.api.setFilterModel(onlyKeysarr2);
              this.filterChipsSets = Object.keys(onlyKeysarr2) ;
              this.adjustWidth();
              this.loaderService.setDisableLoading();
            },
            error:(error:any)=>{
            }
          })
        }

    }
  }
  ClearAllChipsFiltersOnIntialLoad(){
    this.filterChipsSets=[];
    var payload: any = {
      menuid: 64,
        filters: '',
      }
      var payloadvendor: any = {
        menuid: 64,
          filters: '',
          vendorid: this.vendorId,
          
        }
        if(this.vendorId){
          this.vendorService.saveColFiltersVendor(payloadvendor).subscribe({
            next:(res:any)=>{
              this.adjustWidth();
            },
            error:(error:any)=>{
            }
          })
        }else{
          this.planningService.saveColFilters(payload).subscribe({
            next:(res:any)=>{
              this.adjustWidth();
            },
            error:(error:any)=>{
            }
          })
        }
 
    this.gridOptions.api.setFilterModel(null);

  }
  ClearAllChipsFilters(){
    this.loaderService.setShowLoading();
    this.filterChipsSets=[];
    var payload: any = {
      menuid: 64,
        filters: '',
      }
      var payloadvendor: any = {
        menuid: 64,
          filters: '',
          vendorid: this.vendorId,
      }
      if(this.vendorId){
        this.vendorService.saveColFiltersVendor(payloadvendor).subscribe({
          next:(res:any)=>{
            this.loaderService.setDisableLoading();
            this.adjustWidth();
            this.showSnackbar('Filter cleared Successfully.')
          },
          error:(error:any)=>{
            this.loaderService.setDisableLoading();
    
          }
        })
      }else{
        this.planningService.saveColFilters(payload).subscribe({
          next:(res:any)=>{
            this.loaderService.setDisableLoading();
            this.adjustWidth();
            this.showSnackbar('Filter cleared Successfully.')
          },
          error:(error:any)=>{
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