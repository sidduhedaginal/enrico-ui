import {
  Component,
  ViewChild,
  OnInit,ElementRef
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  MatDialog
} from '@angular/material/dialog';
import { DebordingMoreActionDialogComponent } from '../debording-more-action-dialog/debording-more-action-dialog.component';
import { Router} from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-debording-table',
  templateUrl: './debording-table.component.html',
  styleUrls: ['./debording-table.component.css']
})
export class DebordingTableComponent implements OnInit{
  sortImg:any='../assets/img/filter.png';
  allColumnList: any = [
    'deboardingRequestID',
    'employeeNumber',
    'fullname',
    'vendorName',
    'exitReason',
    'isReplaceRequest',
    'lastWorkingDay',
    'deliveryManager',
    'statusDescription',
    'more',
  ];
  _displayAllCols=this.allColumnList.slice(0, -1);
  allChilpList:any=this._displayAllCols;
  displayedColumns: any[] = this.allColumnList;
  newArrayCoumn: any = [];

  dataSource :any= new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
 
   showLoading:boolean = false;
   userDetailsRoles:any=[];

   allDataListDisplayTable:any=[];
   getProductId:any;
   @ViewChild('searchInput') searchInputVal: ElementRef;
  constructor(public dialog: MatDialog,private router :Router,private API:ApiResourceService,private snackBar: MatSnackBar,private paginator1: MatPaginatorIntl) {
    this.paginator1.itemsPerPageLabel = 'Page Size';
  }
  ngOnInit() {

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product_id = urlParams.get('getDeboardRequestID');
if(product_id !=null || product_id !=undefined){
  this.getProductId=product_id;
}



    setTimeout(()=>{
      var x: HTMLElement | null= document.getElementById('myPopup1'); 
      var xcs: HTMLElement | null= document.getElementById('csID');  
      xcs.classList.remove("myColSetClass");  
      if ( x !=null ) {
       x.style.display = "none";
     }
    },100)
    let _getLoginDetails=this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles=_getLoginDetails.profile.user_roles[0];
    this.showLoading = true;
    setTimeout(() => {
    let counter=0;
    for (let i = 0; i < this._displayAllCols.length; i++) {
      (document.getElementById( this._displayAllCols[i]+counter) as HTMLInputElement).checked  = true;
      this.getCheckboxValues(true, this._displayAllCols[i]);
      counter++;
    }
  
  }, 1000);
    this.API.getDeboarding().subscribe((response: any) => {
      this.showLoading=false;
  
      let allDataPre=[];
      if( this.getProductId !=null ||  this.getProductId !=undefined){
        allDataPre=response.data.resourceDeboardDeatils.filter((item=>{
        return  item.id== this.getProductId;
        }))
        this.deBoardIDDetails(allDataPre[0]);
       
      }
   else{
       allDataPre = response.data.resourceDeboardDeatils;
   }
      let allData=[];    

allData=allDataPre;
    
      if(allData && allData.length>0){
        this.allDataListDisplayTable=allData;
      this.dataSource = new MatTableDataSource(allData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.getFilterArrayMethod(allData);
      this.getMethod1();
      }
      else{
        this.dataSource = new MatTableDataSource();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.snackBar.open("No Data Found", 'Close', {
          duration: 3000,
        });
      }
    });

    this.getUserRolesInfo();
    this.getRolePermission();
  }
  deOnboardMore(element:any, type: any) {
    let _obj = {
      rowData: element,
      type: type,
    };
    const dialogRef = this.dialog.open(DebordingMoreActionDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose:true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result) => {


    });
    if (type == 'Approve') {
    } else if (type == 'Reject') {
    } else if (type == 'Withdraw') {
    } else if (type == 'Delegate') {
    }
  }
  




  applyFilter(filterValue: any,columnName:string,fromColumnFilter:boolean=true) {
    if(fromColumnFilter==false){
      this.dataSource.filter=filterValue;
    }
    else{
    if(filterValue && filterValue.length===0){  
      this.dataSource = new MatTableDataSource(this.allDataListDisplayTable);
      this.dataSource.paginator = this.paginator;
    }
   else{    
   let filterResult= this.filterOption(filterValue,columnName);
    this.dataSource = new MatTableDataSource(filterResult);
    this.dataSource.paginator = this.paginator;
   
   } 
  }
  }

  filterOption(filterValue:any,columnName:string){
   const resultSearch= this.allDataListDisplayTable.filter((item)=>{
     return filterValue.includes(item[columnName])    
   });
   return resultSearch;
     }

  deBoardIDDetails(element:any){
    localStorage.removeItem('deBoardIDForStatus');
    localStorage.setItem('deBoardIDForStatus',element.statusDescription)
let _rowobjAllDetails={
  "element":JSON.stringify(element)
}
this.router.navigate(['/Resource-Management/De-boarding Request Details'], { queryParams:  _rowobjAllDetails, skipLocationChange: true});

  }
  openSettingPopupDeboarding(){
    
    var x: HTMLElement | null= document.getElementById('myPopup1');
    var xcs: HTMLElement | null= document.getElementById('csID');
    if (x.style.display === "none") {
      x.style.display = "block";
      xcs.classList.add("myColSetClass");
    }
    else {
      x.style.display = "none";
      xcs.classList.remove("myColSetClass");
    }

 }
  getCheckboxValues(event:any, data:any) {
 
    var index = this.newArrayCoumn.findIndex((x:any) => x.columnName == data);
    if (event) {
      let obj = {
        columnName: data,
      };
      this.newArrayCoumn.push(obj);
    } else {
      this.newArrayCoumn.splice(index, 1);
    }

 

    let columnPushArray = [];
    for (let i = 0; i < this.newArrayCoumn.length; i++) {
      columnPushArray.push(this.newArrayCoumn[i].columnName);
    }
   
    this.displayedColumns = columnPushArray.concat('more');
    this.allChilpList= columnPushArray;
    if (this.newArrayCoumn === undefined || this.newArrayCoumn.length == 0) {
      this.displayedColumns = this.allColumnList;
      this.allChilpList=  this.displayedColumns ;
    }



    let _defaultDataRecord:any=[];
    _defaultDataRecord=   this.getSearchColumnWiseFilter();
   this.dataSource = new MatTableDataSource(_defaultDataRecord);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   this.searchInputVal.nativeElement.value





  }

  checkIfNameExists(arr:any, newName:any) {
    return arr.some(function (e:any) {
      return e.columnName === newName;
    });
  }
  getCapitalize(item:any) {
    return (item.charAt(0).toUpperCase() + item.slice(1))
      .replace(/(\B[A-Z])/g, ' $1')
      .replace('fullname', 'Employee Name')
      .replace('is', '').replace('Fullname', 'Employee Name').replace('I D','ID');

  }

  filterDictionary = new Map<string, string>();

  drIDDetails:any[]=[];
  employeeNameDetails: any[] = [];
  employeeNumberDetails: any[] = [];
vendorDetails:any[]=[];
exitReasonDetails:any[]=[];
replaceRequestDetails:any[]=[];
lwdDetails:any[]=[];
deliveryManagerDetails:any[]=[];
statusDetails:any[]=[];


_filterDeboardRequestIdArray:any=[];
_filterEmpNumberArray:any=[];
  _filterEmpNameArray:any=[];
  _filterVendorNameArray:any=[];
  _filterExitReasonArray:any=[];
  _filterReplaceRequestArray:any=[];
  _filterLwdArray:any=[];
  _filterDeliveryManagerArray:any=[];
  _filterStatusArray:any=[];
  getSearchColumnWiseFilter(){
    var allowed :any= [];
    var filtered12 :any=[];
     allowed =  JSON.parse(JSON.stringify(this.newArrayCoumn)).reduce((acc, val)=>[...acc, val.columnName], []) ;   
      for(let i=0;i< this.allDataListDisplayTable.length;i++){
         filtered12.push( Object.fromEntries(allowed.map(k => [k,  this.allDataListDisplayTable[i][k]])) );
      } 
      return filtered12;
  }
  
  getFilterArrayMethod(allData){
    let filterDeboardRequestIdArray=[];
    let filterEmpNumberArray=[];
    let filterEmpNameArray=[];
    let filterVendorNameArray=[];
    let filterExitReasonArray=[];
    let filterReplaceRequestArray=[];
    let filterLwdArray=[];
    let filterDeliveryManagerArray=[];
    let filterStatusArray=[];

    filterDeboardRequestIdArray =allData.map(v=>{ return v.deboardingRequestID});
    filterEmpNumberArray =allData.map(v=>{ return v.employeeNumber});
    filterEmpNameArray =allData.map(v=>{ return v.fullname});
    filterVendorNameArray=allData.map(v=>{ return v.vendorName});
    filterExitReasonArray=allData.map(v=>{ return v.exitReason});
    filterReplaceRequestArray=allData.map(v=>{ return v.isReplaceRequest});
    filterLwdArray=allData.map(v=>{ return v.lastWorkingDay});
     filterDeliveryManagerArray=allData.map(v=>{ return v.deliveryManager});
     filterStatusArray=allData.map(v=>{ return v.statusDescription});
  
     this._filterDeboardRequestIdArray=   filterDeboardRequestIdArray.filter((item,index) => filterDeboardRequestIdArray.indexOf(item) === index);
      this._filterEmpNumberArray=   filterEmpNumberArray.filter((item,index) => filterEmpNumberArray.indexOf(item) === index);
      this._filterEmpNameArray=   filterEmpNameArray.filter((item,index) => filterEmpNameArray.indexOf(item) === index);
      this._filterVendorNameArray=   filterVendorNameArray.filter((item,index) => filterVendorNameArray.indexOf(item) === index);
      this._filterExitReasonArray=   filterExitReasonArray.filter((item,index) => filterExitReasonArray.indexOf(item) === index);
      this._filterReplaceRequestArray=   filterReplaceRequestArray.filter((item,index) => filterReplaceRequestArray.indexOf(item) === index);
      this._filterLwdArray=   filterLwdArray.filter((item,index) => filterLwdArray.indexOf(item) === index);
      this._filterDeliveryManagerArray=   filterDeliveryManagerArray.filter((item,index) => filterDeliveryManagerArray.indexOf(item) === index);
      this._filterStatusArray=   filterStatusArray.filter((item,index) => filterStatusArray.indexOf(item) === index);
      
      }

      drIDDetails1:any=[];
      employeeNameDetails1: any = [];
      employeeNumberDetails1: any= [];
    vendorDetails1:any=[];
    exitReasonDetails1:any=[];
    replaceRequestDetails1:any=[];
    lwdDetails1:any=[];
    deliveryManagerDetails1:any=[];
    statusDetails1:any=[];
  getMethod1(){
     this.drIDDetails1 = [...this._filterDeboardRequestIdArray];
     this.drIDDetails=this.drIDDetails1;

    this.employeeNumberDetails1 = [...this._filterEmpNumberArray];
    this.employeeNumberDetails=this.employeeNumberDetails1;

    this.employeeNameDetails1= [...this._filterEmpNameArray];
    this.employeeNameDetails= this.employeeNameDetails1;

  this.vendorDetails1 = [...this._filterVendorNameArray];
  this.vendorDetails=this.vendorDetails1;

  this.exitReasonDetails1 = [...this._filterExitReasonArray];
  this.exitReasonDetails=this.exitReasonDetails1;

  this.replaceRequestDetails1 = [...this._filterReplaceRequestArray];
  this.replaceRequestDetails=this.replaceRequestDetails1;

  this.lwdDetails1 = [...this._filterLwdArray];
  this.lwdDetails= this.lwdDetails1;

  this.deliveryManagerDetails1 = [...this._filterDeliveryManagerArray];
  this.deliveryManagerDetails=this.deliveryManagerDetails1;

  this.statusDetails1 = [...this._filterStatusArray];
  this.statusDetails=this.statusDetails1;



  

  }
  activeCol:any="";
  applyEmpFilter2(ob: MatSelectChange, empfilter: any) {
    
    this.activeCol=empfilter;
    this.searchInputVal.nativeElement.value = '';
    let filterVal=ob.value.filter((item)=>{return item==='All'});
    if(filterVal && filterVal.length>0){
      this.applyFilter([],empfilter);
    }
    else{
      this.applyFilter(ob.value,empfilter);
    }
  }

  colNameClick(empfilter: any){
    this.activeCol=empfilter;
  }


  @ViewChild('idDeboardingRequestID') idDeboardingRequestID: ElementRef;
  @ViewChild('idEmployeeNumber') idEmployeeNumber: ElementRef;
  @ViewChild('idEmployeeName') idEmployeeName: ElementRef;
  @ViewChild('idVendorName') idVendorName: ElementRef;
  @ViewChild('idExitReason') idExitReason: ElementRef;   
  @ViewChild('idVendorName') idReplaceRequest: ElementRef;
  @ViewChild('idExitReason') idLastWorkingDay: ElementRef;
  @ViewChild('idDeliveryManager') idDeliveryManager: ElementRef;
  @ViewChild('idStatus') idStatus: ElementRef;
  
  clearSearchInput(){
     this.idDeboardingRequestID.nativeElement.value = '';
     this.idEmployeeNumber.nativeElement.value = '';
     this.idEmployeeName.nativeElement.value = '';
     this.idVendorName.nativeElement.value = '';
     this.idExitReason.nativeElement.value = '';
     this.idReplaceRequest.nativeElement.value = '';
     this.idLastWorkingDay.nativeElement.value = '';
     this.idDeliveryManager.nativeElement.value = '';
     this.idStatus.nativeElement.value = '';
  }
  mhoverChangeIcon(){
  this.getMethod1();
  this.clearSearchInput();
  }

  onKeyChangeFilter(val:any,columnName:any) {
    let filterVal = val.toLowerCase();
    if(filterVal.length==0){
      if(columnName=='DeboardingRequestID'){
        this.drIDDetails = this.drIDDetails1;
      }
     else if(columnName=='EmployeeNumber'){
        this.employeeNumberDetails = this.employeeNumberDetails1;
      }
      else if(columnName=='EmployeeName'){
        this.employeeNameDetails = this.employeeNameDetails1;
      }
      else if(columnName=='VendorName'){
        this.vendorDetails = this.vendorDetails1;
      }
      else if(columnName=='ExitReason'){
        this.exitReasonDetails = this.exitReasonDetails1;
      }
      else if(columnName=='ReplaceRequest'){
        this.replaceRequestDetails = this.replaceRequestDetails1;
      }
      else if(columnName=='LastWorkingDay'){
        this.lwdDetails = this.lwdDetails1;
      }
      else if(columnName=='DeliveryManager'){
      this.deliveryManagerDetails=this.deliveryManagerDetails1;
        
      }
      else if(columnName=='Status'){
        this.statusDetails=this.statusDetails1;
      }
    }
    else{
      if(columnName=='DeboardingRequestID'){
        this.drIDDetails =this.drIDDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
     else if(columnName=='EmployeeNumber'){
      this.employeeNumberDetails =this.employeeNumberDetails1.filter((option) => String(option).toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='EmployeeName'){
        this.employeeNameDetails =this.employeeNameDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='VendorName'){
        this.vendorDetails = this.vendorDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='ExitReason'){
        this.exitReasonDetails = this.exitReasonDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='ReplaceRequest'){
        this.replaceRequestDetails = this.replaceRequestDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='LastWorkingDay'){
        this.lwdDetails = this.lwdDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='DeliveryManager'){
        this.deliveryManagerDetails=this.deliveryManagerDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
          
        }
        else if(columnName=='Status'){
          this.statusDetails=this.statusDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
        }
    }
}
resetAll(){
  this.dataSource = new MatTableDataSource();
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  this.newArrayCoumn=[];
  this.ngOnInit();
}
saveAllFilter(){
  this.snackBar.open("Filter saved successfully", 'Close', {
    duration: 2000,
  });
this.openSettingPopupDeboarding();
}
onToppingRemoved(data: any) {
  var indexz = this.allColumnList.findIndex((x:any) => x == data); 
  var index = this.newArrayCoumn.findIndex((x:any) => x.columnName == data);
    this.newArrayCoumn.splice(index, 1);
  let columnPushArray = [];
  for (let i = 0; i < this.newArrayCoumn.length; i++) {
    columnPushArray.push(this.newArrayCoumn[i].columnName);
  }  
  this.displayedColumns = columnPushArray.concat('more');
  this.allChilpList= columnPushArray;
  if (this.newArrayCoumn === undefined || this.newArrayCoumn.length == 0) {
    this.displayedColumns = this.allColumnList;
    this.allChilpList=  this.displayedColumns ;
  }  
  (document.getElementById(data+indexz) as HTMLInputElement).checked=false;   
}
hideCsPopup(){
  var x: HTMLElement | null= document.getElementById('myPopup1');
  var xcs: HTMLElement | null= document.getElementById('csID');  

  if (x.style.display === "block") {
    x.style.display = "none";
    xcs.classList.remove("myColSetClass"); 
  }

}
closeColumnSettingsPopup(){
  this.hideCsPopup();
}

userDetails: userProfileDetails;
roleList = [];
exitCheckRoleApproveSendbackDelegate:boolean=false;
exitCheckRoleWithDrawResubmitExtendLwdRetainResource:boolean=false;
checkOnlySectionSpoc:boolean=false;
getUserRolesInfo(){   
  this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
  

    if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {     
    this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
      (item: any) => item.roleName
    );           
 
    this.exitCheckRoleApproveSendbackDelegate=this.findCommonElement( this.roleList,['OSM Admin', 'OSM','Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG','Department_SPOC_BGSW']);

     this.exitCheckRoleWithDrawResubmitExtendLwdRetainResource= this.findCommonElement( this.roleList,['OSM Admin', 'Vendor','Vendor_BGSV','Vendor_BGSW']);
     this.checkOnlyDeliveryManager=this.findCommonElement( this.roleList,['Delivery_Manager']);
this.checkOnlyOSMAdmin=this.findCommonElement( this.roleList,['OSM Admin','OSM']);
this.checkOnlySectionSpoc=this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);
   }

}
checkOnlyDeliveryManager:boolean=false;
checkOnlyOSMAdmin:boolean=false;
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





_roleGetPermission:any=[];
showApproveSendBackDelegateBtn:boolean=false;
showWithdrawResubmitExtendLwdRetainResourceBtn:boolean=false;
showInitiateEclBtn
showAccessoriesCollectedBtn
showDeviceCollectedBtn
showEmployeeCardCollectedBtn
showNTidDeactivatedBtn
showCompleteEclBtn
getRolePermission(){
  this._roleGetPermission=[];
  if(this.userDetails && this.userDetails.roleDetail){

  let _array1=this.userDetails.roleDetail[0].roleDetails;
  this.showApproveSendBackDelegateBtn= this.findCommonElement( this.roleList,['OSM Admin','OSM','Delivery_Manager', 'Department_SPOC_BGSV','Department_SPOC_BGSW', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG']);
 this.showWithdrawResubmitExtendLwdRetainResourceBtn=this.findCommonElement( this.roleList,['OSM Admin','Vendor','Vendor_BGSV','Vendor_BGSW']);
  this.showInitiateEclBtn= this.findCommonElement( this.roleList,['OSM Admin','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV']);
  this.showAccessoriesCollectedBtn=this.findCommonElement( this.roleList,['OSM Admin','Department Secretory BGSV']);
  this.showDeviceCollectedBtn=this.findCommonElement( this.roleList,['OSM Admin','BD-Asset-BGSW','BD-Asset-BGSV']);
  this.showEmployeeCardCollectedBtn=this.findCommonElement( this.roleList,['OSM Admin','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV']);
  this.showNTidDeactivatedBtn=this.findCommonElement( this.roleList,['OSM Admin','BD-NTID-BGSW','DSP-NTID-BGSV']);
  this.showCompleteEclBtn=this.findCommonElement( this.roleList,['OSM Admin','Department Secretory BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2']);



 let onlyOSmAdmin= this.findCommonElement( this.roleList,['OSM Admin']);
let onlyOsm= this.findCommonElement( this.roleList,['OSM']);
let onlyVendor=this.findCommonElement( this.roleList,['Vendor','Vendor_BGSV','Vendor_BGSW']);
let onlyDeliveryManager= this.findCommonElement( this.roleList,['Delivery_Manager']);
let onlyDepartmentSpoc= this.findCommonElement( this.roleList,['Department_SPOC_BGSV','Department_SPOC_BGSW']);
let onlySectionSpoc= this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);
let onlyHrsSpoc1Initiateecl=this.findCommonElement( this.roleList,['HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1']);
let onlyDepartmentSecretory= this.findCommonElement( this.roleList,['Department Secretory BGSV']);
let onlyBdAssest=this.findCommonElement( this.roleList,['BD-Asset-BGSW','BD-Asset-BGSV']);
let onlyNtid=this.findCommonElement( this.roleList,['BD-NTID-BGSW','DSP-NTID-BGSV']);
let onlyHrsSpoc2CompleteEcl= this.findCommonElement( this.roleList,['HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2']);
let onlyFcm= this.findCommonElement( this.roleList,['FCM-BGSV']);



  let _array2:any=[];
  if(onlyOSmAdmin==true){
    _array2=  _array1.filter((item)=>{return item.roleName=='OSM Admin'})[0];
  }
  else if(onlyOsm==true && onlyOSmAdmin==false){
    _array2=  _array1.filter((item)=>{return item.roleName=='OSM'})[0];
  }
  else if(onlyVendor==true && onlyOSmAdmin==false){
    _array2=  _array1.filter((item)=>{return (item.roleName=='Vendor') || (item.roleName=="Vendor_BGSW")|| (item.roleName=="Vendor_BGSV")})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDeliveryManager==true){
    _array2=  _array1.filter((item)=>{return item.roleName=='Delivery_Manager'})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSpoc==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='Department_SPOC_BGSV') || (item.roleName=="Department_SPOC_BGSW"))})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlySectionSpoc==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='Section_SPOC_BGSW') || (item.roleName=="Section_SPOC_BGSV"))})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyHrsSpoc1Initiateecl==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='HRS-IN SPOC 1') || (item.roleName=='HRS-IN SPOC 1(Initiate ECL)'))})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSecretory==true){
    _array2=  _array1.filter((item)=>{return item.roleName=='Department Secretory BGSV'})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyBdAssest==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='BD-Asset-BGSW') || (item.roleName=='BD-Asset-BGSV'))})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyNtid==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='BD-NTID-BGSW') || (item.roleName=='DSP-NTID-BGSV'))})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyHrsSpoc2CompleteEcl==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='HRS-IN SPOC 2 (Complete ECL)') || (item.roleName=='HRS-IN SPOC 2'))})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyFcm==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='FCM-BGSV'))})[0];
  }
  else{
    _array2=  this.userDetails.roleDetail[0].roleDetails[0];
  }

  let _fetaturedetailsArray=[];
  _fetaturedetailsArray=_array2.moduleDetails.filter((v)=>{ return v.moduleName=="Resource"});

  if(_fetaturedetailsArray && _fetaturedetailsArray.length >0){
    this._roleGetPermission=  (_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Deboarding"})[0].permissionDetails[0]

  }
  else{
    this._roleGetPermission={
      createPermission:false,
      importPermission:false,
      editPermission:false,
      approvePermission:false,
      delegatePermission:false,
      deletePermission:false,
      exportPermission:false,
      readPermission:false,
      rejectPermission:false,
      withdrawPermission:false
    }
  }
}
    
}
@ViewChild('selectDeboardID') selectID: MatSelect;
@ViewChild('selectEmployeeNumber') selectEmployeeNumber: MatSelect;
@ViewChild('selectEmployeeName') selectEmployeeName: MatSelect;
@ViewChild('selectVendor') selectVendor: MatSelect;
@ViewChild('selectExitReason') selectExitReason: MatSelect;
@ViewChild('replacementRequested') selectReplacementRequested: MatSelect;
@ViewChild('selectLWD') selectLWD: MatSelect;
@ViewChild('selectDeliveryManager') selectDeliveryManager: MatSelect;
@ViewChild('selectStatus') selectStatus: MatSelect;
allSelectedDeboardID = false;
allSelectedEmployeeNumber = false;
allSelectedEmployeeName= false;
allSelectedVendor= false;
allSelectedExitReason= false;
allSelectedReplacerequested=false;
allSelectedLWD=false;
allSelectedDeliveryManager= false;
allSelectedStatus= false;

toggleAllDDL(colName: any) {
  if (colName == 'ID') {
    if (this.allSelectedDeboardID) {
      this.selectID.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectID.options.forEach((item: MatOption) => item.deselect());
    }
  } else if ((colName == 'empNumber')) {
    if (this.allSelectedEmployeeNumber) {
      this.selectEmployeeNumber.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectEmployeeNumber.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
  }
  else if (colName == 'empName'){
    if (this.allSelectedEmployeeName) {
      this.selectEmployeeName.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectEmployeeName.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
  else if (colName == 'vendor'){ 
    if (this.allSelectedVendor) {
      this.selectVendor.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectVendor.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
  }
  else if (colName == 'exitReason'){
    if (this.allSelectedExitReason) {
      this.selectExitReason.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectExitReason.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }



   else if (colName == 'replaceReq'){
    if (this.allSelectedReplacerequested) {
      this.selectReplacementRequested.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectReplacementRequested.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'lwday'){
    if (this.allSelectedLWD) {
      this.selectLWD.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectLWD.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }

  else if (colName == 'deliveryManager'){ 
    if (this.allSelectedDeliveryManager) {
      this.selectDeliveryManager.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectDeliveryManager.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
  }
  else if (colName == 'status'){ 
    if (this.allSelectedStatus) {
      this.selectStatus.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectStatus.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
  }
}

optionClick(colName: any) {
  let newStatus = true;
  if (colName == 'ID') {
    this.selectID.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedDeboardID = newStatus;
  } else if ((colName == 'empNumber')) {
    this.selectEmployeeNumber.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedEmployeeNumber = newStatus;
  }
  else if (colName == 'empName'){ 
    this.selectEmployeeName.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedEmployeeName = newStatus;
  }
  else if (colName == 'vendor'){ 
    this.selectVendor.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedVendor = newStatus;
  }
  else if (colName == 'exitReason'){ 
    this.selectExitReason.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedExitReason = newStatus;
  }

  else if (colName == 'replaceReq'){
    this.selectReplacementRequested.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedReplacerequested = newStatus;
   }
   else if (colName == 'lwday'){
    this.selectLWD.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedLWD = newStatus;
   }

  else if (colName == 'deliveryManager'){ 
    this.selectDeliveryManager.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedDeliveryManager = newStatus;
  }
  else if (colName == 'status'){ 
    this.selectStatus.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedStatus = newStatus;
  }
}
refreshGetData(){
  this.ngOnInit();
}

btnExport(){
  const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(this.dataSource.data); 
   const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1_Deboarding');
  XLSX.writeFile(wb, 'DeboardingRecords.xlsx');  
}
}
