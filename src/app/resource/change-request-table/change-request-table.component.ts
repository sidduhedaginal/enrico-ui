import {
  Component,
  ViewChild,
  OnInit,
  ElementRef
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  MatDialog
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { ChangeDetailsActionDialogComponent } from '../change-details-action-dialog/change-details-action-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-change-request-table',
  templateUrl: './change-request-table.component.html',
  styleUrls: ['./change-request-table.component.css']
})
export class ChangeRequestTableComponent implements OnInit {
  sortImg: any = '../assets/img/filter.png';
    allColumnList: any = [
    'crId',
    'employeeNumber',
    'employeeName',
    'vendor',
    'effectiveFrom',
    'deliveryManager',
    'status',
    'more',
  ];
  _displayAllCols=this.allColumnList.slice(0, -1);
allChilpList:any=this._displayAllCols;
  displayedColumns: any[] = this.allColumnList;
  newArrayCoumn: any = [];

  dataSource: any = new MatTableDataSource();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  showLoading:boolean = false;

  allDataListDisplayTable:any=[];
  @ViewChild('searchInput') searchInputVal: ElementRef;
  getProductId:any;
  constructor(public dialog: MatDialog, private router: Router,private API:ApiResourceService,private snackBar: MatSnackBar,private paginator1: MatPaginatorIntl) {
    this.paginator1.itemsPerPageLabel = 'Page Size';
   }
  ngOnInit() {
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const product_id = urlParams.get('getChangeRequestUrlID');
if(product_id !=null || product_id !=undefined){
  this.getProductId=product_id;
}

    this.showLoading = true;
    setTimeout(()=>{
      var x: HTMLElement | null= document.getElementById('myPopup1');  
      var xcs: HTMLElement | null= document.getElementById('csID');  
      xcs.classList.remove("myColSetClass");  
      if ( x !=null ) {
       x.style.display = "none";
     }
    },100)
    setTimeout(() => {
      let counter=0;
      for (let i = 0; i < this._displayAllCols.length; i++) {
        (document.getElementById( this._displayAllCols[i]+counter) as HTMLInputElement).checked  = true;
        this.getCheckboxValues(true, this._displayAllCols[i]);
        counter++;
      }
    }, 2000);
    this.API.getChangeRequest().subscribe((response: any) => {
      this.showLoading = false;
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
        this.allDataListDisplayTable=allData;
    this.dataSource = new MatTableDataSource(allData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.getUserRolesInfo();
    this.getRolePermission();
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
  }
  deOnboardMore(element: any, type: any) {

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
      console.log('The dialog was closed');

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
      let filterResult= this.filterOption(filterValue,columnName);//filterValue;
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
   
  linkDetailsPage(element: any) {
    localStorage.removeItem('deBoardIDForStatus');
  
   localStorage.removeItem('crIDForStatus');
    this.router.navigate(['/Resource-Management/Change Request Details'], { queryParams:  element, skipLocationChange: true});
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
      .replace('fullname', 'Employee Name').replace('Cr Id', 'Change Request ID')

  }
  userDetailsRoles: any = [];
  userDetails: userProfileDetails;
  roleList = [];
  exitCheckRoleApproveSendbackDelegate:boolean=false;
  exitCheckRoleWithDrawResubmiChangeEffectiveDateCancelRequest:boolean=false;
   getUserRolesInfo(){ 
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0]; 
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
 
      if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {     
      this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
        (item: any) => item.roleName
      );   
     
      this.exitCheckRoleApproveSendbackDelegate=this.findCommonElement( this.roleList,['OSM Admin', 'OSM','Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG','Department_SPOC_BGSW']);


       this.exitCheckRoleWithDrawResubmiChangeEffectiveDateCancelRequest= this.findCommonElement( this.roleList,['OSM Admin', 'Vendor']);
       this.checkOnlyDeliveryManager=this.findCommonElement( this.roleList,['Delivery_Manager']);
this.checkOnlyOSMAdmin=this.findCommonElement( this.roleList,['OSM Admin','OSM']);
this.checkOnlySectionSpoc=this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);


     }
  }
  checkOnlyDeliveryManager:boolean=false;
  checkOnlySectionSpoc:boolean=false;
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

  filterDictionary = new Map<string, string>();

  crIDDetails:any[]=[];
  employeeNameDetails: any[] = [];
  employeeNumberDetails: any[] = [];
vendorDetails:any[]=[];
effectiveFormDetails:any[]=[];
deliveryManagerDetails:any[]=[];
statusDetails:any[]=[];


_filterCrIdArray:any=[];
_filterEmpNumberArray:any=[];
  _filterEmpNameArray:any=[];
  _filterVendorArray:any=[];
  _filterEffectiveFormArray:any=[];
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
    let filterCrIdArray=[];
    let filterEmpNumberArray=[];
    let filterEmpNameArray=[];
    let filterVendorArray=[];
    let filterEffectiveFormArray=[];
    let filterDeliveryManagerArray=[];
    let filterStatusArray=[];

    filterCrIdArray =allData.map(v=>{ return v.crId});
    filterEmpNumberArray =allData.map(v=>{ return v.employeeNumber});
    filterEmpNameArray =allData.map(v=>{ return v.employeeName});
     filterVendorArray=allData.map(v=>{ return v.vendor});
     filterEffectiveFormArray=allData.map(v=>{ return v.effectiveFrom});
     filterDeliveryManagerArray=allData.map(v=>{ return v.deliveryManager});
     filterStatusArray=allData.map(v=>{ return v.status});
  
     this._filterCrIdArray=   filterCrIdArray.filter((item,index) => filterCrIdArray.indexOf(item) === index);
      this._filterEmpNumberArray=   filterEmpNumberArray.filter((item,index) => filterEmpNumberArray.indexOf(item) === index);
      this._filterEmpNameArray=   filterEmpNameArray.filter((item,index) => filterEmpNameArray.indexOf(item) === index);
      this._filterVendorArray=   filterVendorArray.filter((item,index) => filterVendorArray.indexOf(item) === index);
      this._filterEffectiveFormArray=   filterEffectiveFormArray.filter((item,index) => filterEffectiveFormArray.indexOf(item) === index);
      this._filterDeliveryManagerArray=   filterDeliveryManagerArray.filter((item,index) => filterDeliveryManagerArray.indexOf(item) === index);
      this._filterStatusArray=   filterStatusArray.filter((item,index) => filterStatusArray.indexOf(item) === index);
      
      }
      crIDDetails1:any=[];
      employeeNumberDetails1:any=[];
      employeeNameDetails1:any=[];
      vendorDetails1:any=[];
      effectiveFormDetails1:any=[];
      deliveryManagerDetails1:any=[];
      statusDetails1:any=[];
  getMethod1(){
    this.crIDDetails1 = [...this._filterCrIdArray]; 
    this.crIDDetails = this.crIDDetails1;

    this.employeeNumberDetails1 = [...this._filterEmpNumberArray];
    this.employeeNumberDetails= this.employeeNumberDetails1


    this.employeeNameDetails1= [...this._filterEmpNameArray];
    this.employeeNameDetails= this.employeeNameDetails1;

    
  this.vendorDetails1 = [...this._filterVendorArray];
  this.vendorDetails= this.vendorDetails1;

  this.effectiveFormDetails1 = [...this._filterEffectiveFormArray];
  this.effectiveFormDetails =this.effectiveFormDetails1 ;

  this.deliveryManagerDetails1 = [...this._filterDeliveryManagerArray];
  this.deliveryManagerDetails=this.deliveryManagerDetails1;

  this.statusDetails1 = [...this._filterStatusArray];
  this.statusDetails= this.statusDetails1;


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

  @ViewChild('idChangeID') idChangeID: ElementRef;
  @ViewChild('idEmployeeNumber') idEmployeeNumber: ElementRef;
  @ViewChild('idEmployeeName') idEmployeeName: ElementRef;
  @ViewChild('idVendor') idVendor: ElementRef;
  @ViewChild('idEffectiveform') idEffectiveform: ElementRef;  
  @ViewChild('idDeliveryManager') idDeliveryManager: ElementRef;
  @ViewChild('idStatus') idStatus: ElementRef;
  
  clearSearchInput(){
     this.idChangeID.nativeElement.value = '';
     this.idEmployeeNumber.nativeElement.value = '';
     this.idEmployeeName.nativeElement.value = '';
     this.idVendor.nativeElement.value = '';
     this.idEffectiveform.nativeElement.value = '';
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
      if(columnName=='ChangeRequestID'){
        this.crIDDetails = this.crIDDetails1;
      }
     else if(columnName=='EmployeeNumber'){
        this.employeeNumberDetails = this.employeeNumberDetails1;
      }
      else if(columnName=='EmployeeName'){
        this.employeeNameDetails = this.employeeNameDetails1;
      }
      else if(columnName=='Vendor'){
        this.vendorDetails = this.vendorDetails1;
      }
      else if(columnName=='EffectiveForm'){
        this.effectiveFormDetails = this.effectiveFormDetails1;
      }
      else if(columnName=='Delivery Manager'){
      this.deliveryManagerDetails=this.deliveryManagerDetails1;
        
      }
      else if(columnName=='Status'){
        this.statusDetails=this.statusDetails1;
      }
    }
    else{
      if(columnName=='ChangeRequestID'){
        this.crIDDetails =this.crIDDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
     else if(columnName=='EmployeeNumber'){
      this.employeeNumberDetails =this.employeeNumberDetails1.filter((option) => String(option).toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='EmployeeName'){
        this.employeeNameDetails =this.employeeNameDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='Vendor'){
        this.vendorDetails = this.vendorDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='EffectiveForm'){
        this.effectiveFormDetails = this.effectiveFormDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      }
      else if(columnName=='Delivery Manager'){
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

_roleGetPermission:any=[];
showApproveSendBackDelegateBtn:boolean=false;
showWithdrawResubmitChangeEffectiveDateCancelRequestBtn:boolean=false;
getRolePermission(){
  this._roleGetPermission=[];
  let _array1=this.userDetails.roleDetail[0].roleDetails;
  this.showApproveSendBackDelegateBtn= this.findCommonElement( this.roleList,['OSM Admin','OSM','Delivery_Manager', 'Department_SPOC_BGSV','Department_SPOC_BGSW', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG']);
 this.showWithdrawResubmitChangeEffectiveDateCancelRequestBtn=this.findCommonElement( this.roleList,['OSM Admin','Vendor','Vendor_BGSV','Vendor_BGSW']);



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
    this._roleGetPermission=  (_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Change Management"})[0].permissionDetails[0]

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

@ViewChild('selectChangeID') selectID: MatSelect;
@ViewChild('selectEmployeeNumber') selectEmployeeNumber: MatSelect;
@ViewChild('selectEmployeeName') selectEmployeeName: MatSelect;
@ViewChild('selectVendor') selectVendor: MatSelect;
@ViewChild('selectEffectiveFrom') selectEffectiveFrom: MatSelect;
@ViewChild('selectDeliveryManager') selectDeliveryManager: MatSelect;
@ViewChild('selectStatus') selectStatus: MatSelect;

allSelectedChangeID = false;
allSelectedEmployeeNumber = false;
allSelectedEmployeeName= false;
allSelectedVendor= false;
allSelectedEffectiveFrom= false;
allSelectedDeliveryManager= false;
allSelectedStatus= false;

toggleAllDDL(colName: any) {
  if (colName == 'ID') {
    if (this.allSelectedChangeID) {
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
  else if (colName == 'effectFrom'){
    if (this.allSelectedEffectiveFrom) {
      this.selectEffectiveFrom.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectEffectiveFrom.options.forEach((item: MatOption) =>
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
    this.allSelectedChangeID = newStatus;
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
  else if (colName == 'effectFrom'){ 
    this.selectEffectiveFrom.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedEffectiveFrom = newStatus;
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
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1_Change_Request');
  XLSX.writeFile(wb, 'ChangeRequestRecords.xlsx');
}
}