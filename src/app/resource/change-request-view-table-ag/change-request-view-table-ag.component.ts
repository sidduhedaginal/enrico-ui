import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { HostListener } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { GridOptions } from 'ag-grid-community';
import { GridApi } from 'ag-grid-community';
import { LoaderService } from '../../services/loader.service';
import { ColumnSettingsService } from 'src/app/services/column-settings.service';
import * as moment from 'moment';
import { ChangeDetailsActionDialogComponent } from '../change-details-action-dialog/change-details-action-dialog.component';
import { PlaningService } from 'src/app/planning/services/planing.service';
import { VendorService } from 'src/app/vendor/services/vendor.service';
import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';
@Component({
  selector: 'app-change-request-view-table-ag',
  templateUrl: './change-request-view-table-ag.component.html',
  styleUrls: ['./change-request-view-table-ag.component.css']
})
export class ChangeRequestViewTableAgComponent implements OnInit {
  private gridApi!: GridApi;
  filterValue: string;
  paginationPageSize: number = 5;
  dropdownVisible = false;
  selectedMySubColumnNumber = 0;
  activeColumns: any;
  selectedColumns: any;
  userDetailsRoles: any = [];
  userDetails: userProfileDetails;
  roleList = [];
//  exitCheckRoleApproveSendbackDelegate:boolean=false;
 // exitCheckRoleWithDrawResubmiChangeEffectiveDateCancelRequest:boolean=false;
//  checkOnlyDeliveryManager:boolean=false;
  //checkOnlySectionSpoc:boolean=false;
//checkOnlyOSMAdmin:boolean=false;
allDataListDisplayTable:any=[];
getProductId:any;
//_roleGetPermission:any=[];
showApproveSendBackDelegateBtn:boolean=false;
//showWithdrawResubmitChangeEffectiveDateCancelRequestBtn:boolean=false;
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
      headerName: "Change Request ID",
     field: "crId",
     cellStyle: this.cellStyling  ,
    suppressDragLeaveHidesColumns: false,
    suppressMovable:true,
    pinned: 'left',
  hide: false},
    { 
      headerName: "Employee Number",
      field: "employeeNumber",
      hide: false },
    { 
      headerName: "Employee Name",
      field: "employeeName",
      hide: false },
    { 
      headerName: "Vendor",
      field: "vendor",
      hide: false },
    { 
      headerName: "Effective From",
      field: "effectiveFrom",
      cellRenderer:this.getEffectiveDateInFormat.bind(this),
      hide: false},   
    { 
      headerName: "Delivery Manager",
      field: "deliveryManager",
      hide: false },
    { 
      headerName: "Status",
      field: "status",
      hide: false },
    { 
      headerName: "Created By",
      field: "createdBy",
      hide: false },
    { 
      headerName: "Created On",
      field: "createdOn", valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy');
    } ,cellClass: 'createdOnDateFormat',
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
    },},
    { 
      headerName: "Modified By",
       field: "modifiedBy",
       hide: false },
    { headerName: "Modified On", field: "modifiedOn" , valueFormatter: function (params) {
      return moment(params.value).format('DD-MMM-yyyy');
    },cellClass: 'modifiedOnDateFormat',
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
    // {
    //   headerName: 'Action',
    //   field: 'action',
    //   suppressMenu: true,
    //   pinned: 'right',
    //   resizable: false,
    //   cellRenderer: this.actionRenderer.bind(this),hide: false
    // },
  ];
  rowData = [];
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  excludedColumns = ['', 'action']; 
  excelStyles = [
    {
        id: 'createdOnDateFormat',
        dataType: "DateTime",
         numberFormat: { format: "dd-MMM-yyyy" }
    },
    {
      id: 'modifiedOnDateFormat',
      dataType: "DateTime",
       numberFormat: { format: "dd-MMM-yyyy" }
  }
  ]
  defaultColumns : any;
  savedColumns: any;
  vendorId:any;
  flagRefresh:boolean=false;
  subscription: Subscription;
  permissionsBehaviorSubjectChangeManagement: PermissionDetails;
  constructor(private vendorService: VendorService,public dialog: MatDialog, private router: Router,private API:ApiResourceService,private snackBar: MatSnackBar, public loaderService: LoaderService, private columnSettingsService: ColumnSettingsService,  private planningService : PlaningService,private sowjdService: sowjdService) {
    this.vendorId = this.vendorService.vendorId;
    this.subscription = this.sowjdService.getUserProfileRoleDetailChangeManagement().subscribe((roles: PermissionDetails) => {
      this.permissionsBehaviorSubjectChangeManagement = roles;
    });
   }
   ngOnInit() {  
    if(localStorage.getItem('FilterColumnSttingsPopupCheckedUncheckedCM')){
      this.columnDefs=JSON.parse(localStorage.getItem('FilterColumnSttingsPopupCheckedUncheckedCM'));
      }  
    this.paginationPageSize = 5;
    this.initNext();
    this.getUserRolesInfo();
    this.getRolePermission();
    this.getChangeRequestRecord();
  }

  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    ).length;
  }
  getdeafultcolmuns(){
    if(this.vendorId){
      this.vendorService.getdeafultcolmunsVendor(66,this.vendorId)
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
      this.planningService.getdeafultcolmuns(66)
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
  getChangeRequestRecord(){
    this.getdeafultcolmuns();
    this.loaderService.setShowLoading();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const product_id = urlParams.get('getChangeRequestUrlID');
    if(product_id !=null || product_id !=undefined){
      this.getProductId=product_id;
    }
    this.API.getChangeRequest().subscribe((response: any) => { 
      this.loaderService.setDisableLoading();     
      let allData =[];
      if( this.getProductId !=null ||  this.getProductId !=undefined){
        allData=response.data.resourceCRDeatils.filter((item=>{
        return  item.id== this.getProductId;
        }))
        this.linkDetailsPage(allData[0]);       
      }
        else{
          allData = response.data.resourceCRDeatils;
        }  
      if(allData && allData.length>0){
    if ((this.userDetailsRoles == "/Vendors")||(this.userDetailsRoles == '/EnricoUsers'  && this.permissionsBehaviorSubjectChangeManagement?.readPermission)) {
      allData.forEach(result => {     
        result.createdOn =moment(result.createdOn).format('DD-MMM-yyyy')    
      });
        this.allDataListDisplayTable=allData;
        this.rowData = allData;
        this.resetFilters();
        }

  }
  else{ 
    this.snackBar.open("No Data Found", 'Close', {
      duration: 3000,
    });
  }
    });
  }
  cellStyling(params: any) {
    if (params.column.colId == 'crId') {
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

   getUserRolesInfo(){ 
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0]; 
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details')); 
      if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {     
      this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
        (item: any) => item.roleName
      );      
      //this.exitCheckRoleApproveSendbackDelegate=this.findCommonElement( this.roleList,['OSM Admin', 'OSM','Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG','Department_SPOC_BGSW']);
      // this.exitCheckRoleWithDrawResubmiChangeEffectiveDateCancelRequest= this.findCommonElement( this.roleList,['OSM Admin', 'Vendor']);
     //  this.checkOnlyDeliveryManager=this.findCommonElement( this.roleList,['Delivery_Manager']);
//this.checkOnlyOSMAdmin=this.findCommonElement( this.roleList,['OSM Admin','OSM']);
//this.checkOnlySectionSpoc=this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);
     }
  }
  
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
getRolePermission(){
  if(this.userDetails && this.userDetails?.roleDetail && this.userDetails?.roleDetail[0]){
 // this._roleGetPermission=[];
 // let _array1=this.userDetails.roleDetail[0].roleDetails;
  this.showApproveSendBackDelegateBtn= this.findCommonElement( this.roleList,['OSM Admin','OSM','Delivery_Manager', 'Department_SPOC_BGSV','Department_SPOC_BGSW', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG']);
 //this.showWithdrawResubmitChangeEffectiveDateCancelRequestBtn=this.findCommonElement( this.roleList,['OSM Admin','Vendor','Vendor_BGSV','Vendor_BGSW']);
//  let onlyOSmAdmin= this.findCommonElement( this.roleList,['OSM Admin']);
// let onlyOsm= this.findCommonElement( this.roleList,['OSM']);
// let onlyVendor=this.findCommonElement( this.roleList,['Vendor','Vendor_BGSV','Vendor_BGSW']);
// let onlyDeliveryManager= this.findCommonElement( this.roleList,['Delivery_Manager']);
// let onlyDepartmentSpoc= this.findCommonElement( this.roleList,['Department_SPOC_BGSV','Department_SPOC_BGSW']);
// let onlySectionSpoc= this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);
// let onlyHrsSpoc1Initiateecl=this.findCommonElement( this.roleList,['HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1']);
// let onlyDepartmentSecretory= this.findCommonElement( this.roleList,['Department Secretory BGSV']);
// let onlyBdAssest=this.findCommonElement( this.roleList,['BD-Asset-BGSW','BD-Asset-BGSV']);
// let onlyNtid=this.findCommonElement( this.roleList,['BD-NTID-BGSW','DSP-NTID-BGSV']);
// let onlyHrsSpoc2CompleteEcl= this.findCommonElement( this.roleList,['HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2']);
// let onlyFcm= this.findCommonElement( this.roleList,['FCM-BGSV']);
//   let _array2:any=[];
//   if(onlyOSmAdmin==true){
//     _array2=  _array1.filter((item)=>{return item.roleName=='OSM Admin'})[0];
//   }
//   else if(onlyOsm==true && onlyOSmAdmin==false){
//     _array2=  _array1.filter((item)=>{return item.roleName=='OSM'})[0];
//   }
//   else if(onlyVendor==true && onlyOSmAdmin==false){
//     _array2=  _array1.filter((item)=>{return (item.roleName=='Vendor') || (item.roleName=="Vendor_BGSW")|| (item.roleName=="Vendor_BGSV")})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDeliveryManager==true){
//     _array2=  _array1.filter((item)=>{return item.roleName=='Delivery_Manager'})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSpoc==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='Department_SPOC_BGSV') || (item.roleName=="Department_SPOC_BGSW"))})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlySectionSpoc==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='Section_SPOC_BGSW') || (item.roleName=="Section_SPOC_BGSV"))})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyHrsSpoc1Initiateecl==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='HRS-IN SPOC 1') || (item.roleName=='HRS-IN SPOC 1(Initiate ECL)'))})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSecretory==true){
//     _array2=  _array1.filter((item)=>{return item.roleName=='Department Secretory BGSV'})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyBdAssest==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='BD-Asset-BGSW') || (item.roleName=='BD-Asset-BGSV'))})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyNtid==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='BD-NTID-BGSW') || (item.roleName=='DSP-NTID-BGSV'))})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyHrsSpoc2CompleteEcl==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='HRS-IN SPOC 2 (Complete ECL)') || (item.roleName=='HRS-IN SPOC 2'))})[0];
//   }
//   else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyFcm==true){
//     _array2=  _array1.filter((item)=>{return ((item.roleName=='FCM-BGSV'))})[0];
//   }
//   else{
//     _array2=  this.userDetails.roleDetail[0].roleDetails[0];
//   }

//   let _fetaturedetailsArray=[];
//   _fetaturedetailsArray=_array2.moduleDetails.filter((v)=>{ return v.moduleName=="Resource"});

//   if(_fetaturedetailsArray && _fetaturedetailsArray.length >0){
//     this._roleGetPermission=  (_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Change Management"})[0].permissionDetails[0]

//   }
//   else{
//     this._roleGetPermission={
//       createPermission:false,
//       importPermission:false,
//       editPermission:false,
//       approvePermission:false,
//       delegatePermission:false,
//       deletePermission:false,
//       exportPermission:false,
//       readPermission:false,
//       rejectPermission:false,
//       withdrawPermission:false
//     }
//   }
}
}
onFilterTextBoxChanged() {
  this.gridApi.setQuickFilter(this.filterValue);
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
// onFirstDataRendered(event: any) {
//   this.adjustWidth();
//   let onlyKeysarr=[];
//   onlyKeysarr=JSON.parse(localStorage.getItem('filterModelCM'));
//   if(onlyKeysarr){
//  this.finalKeyArray =Object.keys(onlyKeysarr) ;
//   }

//     //-----------
//     localStorage.getItem('CMChipsKey')
//     this.gridOptions.api.setFilterModel(onlyKeysarr);
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
//   localStorage.setItem('filterModelCM', JSON.stringify(filterModel));
//   let onlyKeysarr=[];
//   onlyKeysarr=JSON.parse(localStorage.getItem('filterModelCM'));
//   this.finalKeyArray =Object.keys(onlyKeysarr) ;
//   this.adjustWidth();

//   //------------
//   localStorage.setItem('CMChipsKey',this.finalKeyArray)
// }
getCapitalize(item:any) {
  var getcapVal=this.columnDefs.find(a=>a.field.toLowerCase()==item.toLowerCase());
  return getcapVal.headerName;

}
// removeChips(f:any) {    
//   let onlyKeysarr=[];
//   const index =this.finalKeyArray.indexOf(f);  
//   if (index >= 0) {
//     this.finalKeyArray.splice(index, 1);
//     onlyKeysarr=JSON.parse(localStorage.getItem('filterModelCM'));         
//     delete onlyKeysarr[f];     
//     localStorage.setItem('filterModelCM', JSON.stringify(onlyKeysarr));
//     let onlyKeysarr2=[];
//     onlyKeysarr2=JSON.parse(localStorage.getItem('filterModelCM'));     
//     this.gridOptions.api.setFilterModel(onlyKeysarr2);
//     this.adjustWidth();

//       //---
//       localStorage.setItem('CMChipsKey',this.finalKeyArray)
//   }
// }
// ClearAllChipsFilters(){
//   this.finalKeyArray=[];
//   localStorage.removeItem('filterModelCM');
//   this.gridOptions.api.setFilterModel(null);
//   localStorage.removeItem('CMChipsKey')
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
saveFilter() {
  if (this.selectedColumns) {
    if(this.vendorId){
      this.loaderService.setShowLoading();
      const payload={
        "objects": this.selectedColumns,
        "menuId": 66,
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
    }  else{
      this.loaderService.setShowLoading();
      this.planningService
        .saveColSettings(66,this.selectedColumns)
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
    fileName: `ChangeManagement_Export_`+ moment(new Date()).format('DD-MMM-YYYY'),// `ChangeRequestTable.xlsx`,
  };
  let rowValues = this.rowData.map((obj: any) => ({ ...obj }));
  rowValues.map((a)=> {
  return a.effectiveFrom = this.getEffectiveveDate(a.effectiveFrom);
})

rowValues.map((b)=>{
  return  b.createdOn=moment(b.createdOn.substring(0,10)).format('DD-MMM-yyyy');
})
rowValues.map((c)=>{
  return  c.modifiedOn=moment(c.modifiedOn.substring(0,10)).format('DD-MMM-yyyy');
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

refreshGetData() {
  this.flagRefresh=true;
  this.ngOnInit();
}
actionRenderer(params: any) {
  let element: any = [];
  element = params.data;

  if (this.userDetailsRoles == '/EnricoUsers' && ((element.status =='Initiated' || element.status =='ReSubmitted'  || element.status =='First Approval'  || element.status =='Submit' || element.status =='FirstApprove') || (this.showApproveSendBackDelegateBtn && element.status !='Sent Back' && element.status !='Withdrawn' && element.status !='Approved'))) {
    let _htmlContent = '<div class="cfcycleicons">&nbsp;';   
      if (this.showApproveSendBackDelegateBtn && this.permissionsBehaviorSubjectChangeManagement.approvePermission  && (( (element.status =='Initiated'|| element.status =='ReSubmitted')  && element.firstApprover== this.userDetails.employeeNumber) || (element.status =='First Approval'  && element.secondApprover== this.userDetails.employeeNumber))) {
      _htmlContent += '<span class="submit" title="Approve">&nbsp;</span>&nbsp;'
    }
    if (this.showApproveSendBackDelegateBtn && this.permissionsBehaviorSubjectChangeManagement.rejectPermission  && (( (element.status =='Initiated'|| element.status =='ReSubmitted')  && element.firstApprover== this.userDetails.employeeNumber) || (element.status =='First Approval'  && element.secondApprover== this.userDetails.employeeNumber))) {
      _htmlContent += '<span class="sendback_planning" title="Send back/Reject">&nbsp;</span>&nbsp;'
    }
    if (this.showApproveSendBackDelegateBtn && this.permissionsBehaviorSubjectChangeManagement.delegatePermission  && (( (element.status =='Initiated'|| element.status =='ReSubmitted')  && element.firstApprover== this.userDetails.employeeNumber) || (element.status =='First Approval'  && element.secondApprover== this.userDetails.employeeNumber))) {
      _htmlContent += '<span class="planning_delegate" title="Delegate">&nbsp;</span>'
    }
    _htmlContent += '</div>';
    return _htmlContent;
  }


}
onCellClicked(params: any) {
  if (params.column.colId === 'crId') {
    let element: any = [];
    element = params.data;
    this.linkDetailsPage(element);
  }
  else if (params.column.colId === 'action') {
    let element: any = [];
    element = params.data;
    if (params.event.target.className == 'submit') {
      this.changeRequestRemarksActiondialog(element, 'Approve');
    }
    else if (params.event.target.className == 'sendback_planning') {
      this.changeRequestRemarksActiondialog(element, 'Reject');
    }
    else if (params.event.target.className == 'planning_delegate') {
      this.changeRequestRemarksActiondialog(element, 'Delegate');
    }
   
  }
}

changeRequestRemarksActiondialog(element: any, type: any) {
  let _obj = {
    rowData: element,
    type: type,
    element: element,
  };
  const dialogRef = this.dialog.open(ChangeDetailsActionDialogComponent, {
    width: '510px',
    maxHeight: '99vh',
    disableClose:true,
    data: _obj
  });
  dialogRef.afterClosed().subscribe((result) => {
    this.ngOnInit();
  });

}

linkDetailsPage(element: any) {
  localStorage.removeItem('deBoardIDForStatus');
 localStorage.removeItem('crIDForStatus');
  this.router.navigate(['/Resource-Management/Change Request Details'], { queryParams:  element, skipLocationChange: true});
}
getEffectiveDateInFormat(params:any){
  if(params && params.data && params.data.effectiveFrom){
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let mydate=params.data.effectiveFrom.split('/');
  let _splitMtDate=mydate[2]+'-'+mydate[1]+'-'+ mydate[0] +'T00:00:00.000-00:00';
  let date = new Date( Date.parse(_splitMtDate));//('2012-01-26T13:51:50.417-07:00') );
  let month= monthNames[date.getMonth()];
  let _dateFinal=`${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`
return _dateFinal
  }
}
getEffectiveveDate(val:any){
  if(val){
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
  let mydate=val.split('/');
  let _splitMtDate=mydate[2]+'-'+mydate[1]+'-'+ mydate[0] +'T00:00:00.000-00:00';
  let date = new Date( Date.parse(_splitMtDate));//('2012-01-26T13:51:50.417-07:00') );
  let month= monthNames[date.getMonth()];
  let _dateFinal=`${date.getDate()}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}`
return _dateFinal
  }
}
closeDialogSetting() {
  this.dropdownVisible = false;
}


activeItem: string = '';
setActiveItem(page: string) {
  this.activeItem = page;
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
      this.vendorService.getColFiltersVendor(66,this.vendorId).subscribe({
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
      this.planningService.getColFilters(66).subscribe({
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
  this.filterToString =  JSON.stringify(this.filterModel);
  this.filterToParse = JSON.parse(this.filterToString)
  this.filterChipsSets = Object.keys(this.filterToParse)
  this.adjustWidth();
}
saveChipsFilters() {
  this.loaderService.setShowLoading();
  var payload: any = {
    menuid: 66,
    filters: JSON.stringify(this.filterModel),
  }
  var payloadvendor: any = {
    menuid: 66,
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
      menuid: 66,
      filters: JSON.stringify(onlyKeysarr),
    }
    var payloadvendor: any = {
      menuid: 66,
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
    menuid: 66,
    filters: '',
  }
  var payloadvendor: any = {
    menuid: 66,
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
    menuid: 66,
    filters: '',
  }
  var payloadvendor: any = {
    menuid: 66,
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
