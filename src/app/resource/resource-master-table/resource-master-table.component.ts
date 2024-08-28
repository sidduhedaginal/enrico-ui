import {
  Component,
  ViewChild,
  OnInit, ElementRef
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import {
  MatDialog
} from '@angular/material/dialog';
import { DebordingMoreActionDialogComponent } from '../debording-more-action-dialog/debording-more-action-dialog.component';
import {Router} from '@angular/router';
import { ApiResourceService } from '../api-resource.service';
import { InitiateDeBoardingDialogComponent } from '../initiate-de-boarding-dialog/initiate-de-boarding-dialog.component';
import { InformPartnerDialogComponent } from '../inform-partner-dialog/inform-partner-dialog.component';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-resource-master-table',
  templateUrl: './resource-master-table.component.html',
  styleUrls: ['./resource-master-table.component.css']
})
export class ResourceMasterTableComponent implements OnInit {
  
  allColumnList: any = [
    'employeeNumber','employeeName','ntid','emailID','sowJdID','skillset','grade','level','locationMode','company','personnelArea','personnelSubarea','gender','purchaseOrder','poLineItem','vendorName','vendorID','vendorEmail','poEnddate','contractEnd','group','department','section','bu','deliveryManagerName','deliveryManagerEmail','dateOfJoining' ,'billingStartDate', 'billable','availableCapacity','employmentStatus',
    'more'
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


  sortImg:any='../assets/img/filter.png';
  userDetailsRoles:any=[];
  showLoading:boolean = false;

  userDetails: userProfileDetails;
  roleList = [];
  exitCheckRoleInitiateDeboard:boolean=false;
  exitCheckRoleInitiateChange:boolean=false;
  exitCheckRoleInformPartner:boolean=false;

  _filterEmpNumberArray:any=[];
  _filterEmpNameArray:any=[];
  _filterNtidArray:any=[];
  _filterEmailArray:any=[];
  _filterSowJdArray:any=[];
  _filterSkillsetarray:any=[];
  _filterGradeArray:any=[];
  _filterLevelArray:any=[];
  _filterLocationModeArray:any=[];
  _filterCompanyArray:any=[];
  _filterPersonalAreaArray:any=[];
  _filterPersonalSubAreaArray:any=[];
  _filterGenderArray:any=[];  
  _filterPurchaseOrderArray:any=[];
  _filterPOLineItemArray:any=[];
  _filterVendorNameArray:any=[];
  _filterVendorEmailArray:any=[];
 _filterVendorIDArray:any=[];
  _filterPOEndDateArray:any=[];
  _filterContractEndArray:any=[];
  _filterGroupArray:any=[];
 _filterDepartmentArray:any=[];
  _filterSectionArray:any=[];
  _filterBusinessUnitArray:any=[];
_filterDeliveryManagerNameArray:any=[];
_filterDeliveryManagerEmailArray:any=[];
_filterDateOfJoiningArray:any=[];
_filterBillingStartDateArray:any=[];
_filterBillableArray:any=[];
_filterAvailableCapacityArray:any=[];
_filterEmployementStatus:any=[];
  employeeNameDetails: any[] = [];
  employeeNumberDetails: any[] = [];
ntidDetails:any[]=[];
emailIDDetails:any[]=[];
sowJDIddetails:any[]=[];
skillSetDetails:any[]=[];
gradeDetails:any[]=[];
levelDetails:any[]=[];
locationModedetails:any[]=[];
companyDetails:any[]=[];
personalAreaDetails:any[]=[];
personalSubAreaDetails:any[]=[];
genderdetails:any[]=[];
purchaseOrderDetails:any[]=[];
poLineTemDetails:any[]=[];
vendorNameDetails:any[]=[];
vendorEmailDetails:any[]=[];
vendorIdDetails:any[]=[];
poEndDateDetails:any[]=[];
contractEndDetails:any[]=[];
groupDetails:any[]=[];
departmentDetails:any[]=[];
sectionDetails:any[]=[];
buDetails:any[]=[];
deliveryManagerNameDetails:any[]=[];
deliveryManagerEmailDetails:any[]=[];
dojDetails:any[]=[];
billingStartDateDetails:any[]=[];
billableDetails:any[]=[];
availableCapacityDetails:any[]=[];
empStatusDetails:any[]=[];  

  filterDictionary = new Map<string, string>();
  allDataListDisplayTable:any=[];
  @ViewChild('searchInput') searchInputVal: ElementRef;
  constructor(public dialog: MatDialog,private router:Router,private API:ApiResourceService,private snackBar: MatSnackBar,private paginator1: MatPaginatorIntl) {
    this.paginator1.itemsPerPageLabel = 'Page Size';
  }
  ngOnInit() {
    setTimeout(()=>{
      var x: HTMLElement | null= document.getElementById('myPopup1'); 
      var xcs: HTMLElement | null= document.getElementById('csID');  
      xcs.classList.remove("myColSetClass"); 
      if ( x !=null ) {
       x.style.display = "none";
     }
    },100)
  
    this.showLoading=true;
    let _getLoginDetails=this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles=_getLoginDetails.profile.user_roles[0];
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));
 
       if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {     
      this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
        (item: any) => item.roleName
      );           
       this.exitCheckRoleInitiateDeboard= this.findCommonElement( this.roleList,['OSM Admin', 'Vendor',]);
       this.exitCheckRoleInitiateChange= this.findCommonElement( this.roleList,['OSM Admin', 'Vendor',]);
       this.exitCheckRoleInformPartner=this.findCommonElement( this.roleList,['OSM Admin', 'OSM', 'Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','Department Secretory BGSV', 'BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','Department_SPOC_BGSW']);
     }
     this.getRolePermission();
  
    setTimeout(() => {
      let counter=0;
      for (let i = 0; i < this._displayAllCols.length; i++) {
        if(this._displayAllCols[i]=='ntid' || this._displayAllCols[i]=='emailID'  || this._displayAllCols[i]=='level'|| this._displayAllCols[i]=='locationMode'|| this._displayAllCols[i]=='company'|| this._displayAllCols[i]=='personnelArea'|| this._displayAllCols[i]=='personnelSubarea'|| this._displayAllCols[i]=='gender'|| this._displayAllCols[i]=='poLineItem'|| this._displayAllCols[i]=='vendorName'|| this._displayAllCols[i]=='vendorID'|| this._displayAllCols[i]=='vendorEmail'|| this._displayAllCols[i]=='poEnddate'|| this._displayAllCols[i]=='contractEnd'|| this._displayAllCols[i]=='group'|| this._displayAllCols[i]=='department'|| this._displayAllCols[i]=='section' || this._displayAllCols[i]=='bu'|| this._displayAllCols[i]=='deliveryManagerEmail'|| this._displayAllCols[i]=='billingStartDate'|| this._displayAllCols[i]=='billable'|| this._displayAllCols[i]=='availableCapacity' ){
          (document.getElementById( this._displayAllCols[i]+counter) as HTMLInputElement).checked  = false;
        }
        else{
        (document.getElementById( this._displayAllCols[i]+counter) as HTMLInputElement).checked  = true;  
        this.getCheckboxValues(true, this._displayAllCols[i]);      
        }
       
        counter++;
      }
   
    }, 1000);
      this.API.getResourceMaster().subscribe((response: any) => {       
        this.showLoading=false;
        let _filterGetAllData:any=[];
if(  this.userDetailsRoles=="/Vendors"){
  let _vendorSapId=String(this.userDetails['vendorSAPID']);
  _filterGetAllData=  (response.data.resourceMaster).filter((v:any)=>{return v.vendorID==_vendorSapId });
}
else{
  _filterGetAllData=response.data.resourceMaster
}
        let allData =_filterGetAllData;
        if(allData && allData.length>0){
          this.getFilterArrayMethod(allData);
          this.allDataListDisplayTable=allData;

        let _defaultDataRecord:any=[];
        _defaultDataRecord=   this.getSearchColumnWiseFilter();

        this.dataSource = new MatTableDataSource(_defaultDataRecord);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
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
  let filterEmpNumberArray=[];
  let filterEmpNameArray=[];
  let filterNtidArray=[];
  let filterEmailArray=[];
  let filterSowJdArray=[];
  let filterSkillsetarray=[];
  let filterGradeArray=[];
  let filterLevelArray=[];
  let filterLocationModeArray=[];
  let filterCompanyArray=[];
  let filterPersonalAreaArray=[];
  let filterPersonalSubAreaArray=[];
  let filterGenderArray=[];  
  let filterPurchaseOrderArray=[];
  let filterPOLineItemArray=[];
  let filterVendorNameArray=[];
  let filterVendorEmailArray=[];
  let filterVendorIDArray=[];
  let filterPOEndDateArray=[];
  let filterContractEndArray=[];
  let filterGroupArray=[];
  let filterDepartmentArray=[];
  let filterSectionArray=[];
  let filterBusinessUnitArray=[];
let filterDeliveryManagerNameArray=[];
let filterDeliveryManagerEmailArray=[];
let filterDateOfJoiningArray=[];
let filterBillingStartDateArray=[];
let filterBillableArray=[];
let filterAvailableCapacityArray=[];
let filterEmployementStatus=[];

  filterEmpNumberArray =allData.map(v=>{ return v.employeeNumber});
  filterEmpNameArray =allData.map(v=>{ return v.employeeName});
   filterNtidArray=allData.map(v=>{ return v.ntid});
   filterEmailArray=allData.map(v=>{ return v.emailID});
   filterSowJdArray=allData.map(v=>{ return v.sowJdID});
   filterSkillsetarray=allData.map(v=>{ return v.skillset});
   filterGradeArray=allData.map(v=>{ return v.grade});   
   filterLevelArray=allData.map(v=>{ return v.level});
   filterLocationModeArray=allData.map(v=>{ return v.locationMode});
   filterCompanyArray=allData.map(v=>{ return v.company});
   filterPersonalAreaArray=allData.map(v=>{ return v.personnelArea});
   filterPersonalSubAreaArray=allData.map(v=>{ return v.personnelSubarea});
   filterGenderArray=allData.map(v=>{ return v.gender});
   filterPurchaseOrderArray=allData.map(v=>{ return v.purchaseOrder});
   filterPOLineItemArray=allData.map(v=>{ return v.poLineItem});
   filterVendorNameArray=allData.map(v=>{ return v.vendorName});
   filterVendorEmailArray=allData.map(v=>{ return v.vendorEmail});
   filterVendorIDArray=allData.map(v=>{ return v.vendorID});
   filterPOEndDateArray=allData.map(v=>{ return v.poEnddate});
   filterContractEndArray=allData.map(v=>{ return v.contractEnd});
   filterGroupArray=allData.map(v=>{ return v.group});
   filterDepartmentArray=allData.map(v=>{ return v.department});
   filterSectionArray=allData.map(v=>{ return v.section});
   filterBusinessUnitArray=allData.map(v=>{ return v.bu});
 filterDeliveryManagerNameArray=allData.map(v=>{ return v.deliveryManagerName});
 filterDeliveryManagerEmailArray=allData.map(v=>{ return v.deliveryManagerEmail});
 filterDateOfJoiningArray=allData.map(v=>{ return v.dateOfJoining});
 filterBillingStartDateArray=allData.map(v=>{ return v.billingStartDate});

 filterBillableArray=allData.map(v=>{ return v.billable});
 filterAvailableCapacityArray=allData.map(v=>{ return v.availableCapacity});
 filterEmployementStatus=allData.map(v=>{ return v.employmentStatus});


    this._filterEmpNumberArray=   filterEmpNumberArray.filter((item,index) => filterEmpNumberArray.indexOf(item) === index);
    this._filterEmpNameArray=   filterEmpNameArray.filter((item,index) => filterEmpNameArray.indexOf(item) === index);
    this._filterNtidArray=   filterNtidArray.filter((item,index) => filterNtidArray.indexOf(item) === index);
    this._filterEmailArray=   filterEmailArray.filter((item,index) => filterEmailArray.indexOf(item) === index);
    this._filterSowJdArray=   filterSowJdArray.filter((item,index) => filterSowJdArray.indexOf(item) === index);
    this._filterSkillsetarray=   filterSkillsetarray.filter((item,index) => filterSkillsetarray.indexOf(item) === index);
    this._filterGradeArray=   filterGradeArray.filter((item,index) => filterGradeArray.indexOf(item) === index);
    this._filterLevelArray=   filterLevelArray.filter((item,index) => filterLevelArray.indexOf(item) === index);
    this._filterLocationModeArray=   filterLocationModeArray.filter((item,index) => filterLocationModeArray.indexOf(item) === index);
    this._filterCompanyArray=   filterCompanyArray.filter((item,index) => filterCompanyArray.indexOf(item) === index);
    this._filterPersonalAreaArray=   filterPersonalAreaArray.filter((item,index) => filterPersonalAreaArray.indexOf(item) === index);
    this._filterPersonalSubAreaArray=   filterPersonalSubAreaArray.filter((item,index) => filterPersonalSubAreaArray.indexOf(item) === index);
    this._filterGenderArray=   filterGenderArray.filter((item,index) => filterGenderArray.indexOf(item) === index);
    this._filterPurchaseOrderArray=   filterPurchaseOrderArray.filter((item,index) => filterPurchaseOrderArray.indexOf(item) === index);
    this._filterPOLineItemArray=   filterPOLineItemArray.filter((item,index) => filterPOLineItemArray.indexOf(item) === index);
    this._filterVendorNameArray=   filterVendorNameArray.filter((item,index) => filterVendorNameArray.indexOf(item) === index);
    this._filterVendorEmailArray=   filterVendorEmailArray.filter((item,index) => filterVendorEmailArray.indexOf(item) === index);
    this._filterVendorIDArray=   filterVendorIDArray.filter((item,index) => filterVendorIDArray.indexOf(item) === index);
    this._filterPOEndDateArray=   filterPOEndDateArray.filter((item,index) => filterPOEndDateArray.indexOf(item) === index);
    this._filterContractEndArray=   filterContractEndArray.filter((item,index) => filterContractEndArray.indexOf(item) === index);
    this._filterGroupArray=   filterGroupArray.filter((item,index) => filterGroupArray.indexOf(item) === index);
    this._filterDepartmentArray=   filterDepartmentArray.filter((item,index) => filterDepartmentArray.indexOf(item) === index);
    this._filterSectionArray=   filterSectionArray.filter((item,index) => filterSectionArray.indexOf(item) === index);
    this._filterBusinessUnitArray=   filterBusinessUnitArray.filter((item,index) => filterBusinessUnitArray.indexOf(item) === index);
    this._filterDeliveryManagerNameArray=   filterDeliveryManagerNameArray.filter((item,index) => filterDeliveryManagerNameArray.indexOf(item) === index);
    this._filterDeliveryManagerEmailArray=   filterDeliveryManagerEmailArray.filter((item,index) => filterDeliveryManagerEmailArray.indexOf(item) === index);
    this._filterDateOfJoiningArray=   filterDateOfJoiningArray.filter((item,index) => filterDateOfJoiningArray.indexOf(item) === index);
    this._filterBillingStartDateArray=   filterBillingStartDateArray.filter((item,index) => filterBillingStartDateArray.indexOf(item) === index);
    this._filterBillableArray=   filterBillableArray.filter((item,index) => filterBillableArray.indexOf(item) === index);
    this._filterAvailableCapacityArray=   filterAvailableCapacityArray.filter((item,index) => filterAvailableCapacityArray.indexOf(item) === index);
    this._filterEmployementStatus=   filterEmployementStatus.filter((item,index) => filterEmployementStatus.indexOf(item) === index);
    }
  deOnboardMore(element:any, type: any) {   
    let _elementArry=[];
    _elementArry=this.allDataListDisplayTable.filter((v=>{
      return v.employeeNumber==element.employeeNumber
    }))
    let _obj = {
      rowData:_elementArry[0],// element,
      type: type,
    };
    const dialogRef = this.dialog.open(DebordingMoreActionDialogComponent, {
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



















 
  initiateDeBording(element: any,type:any) {
    let _elementArry=[];
    _elementArry=this.allDataListDisplayTable.filter((v=>{
      return v.employeeNumber==element.employeeNumber
    }))
    let _obj={
      rowData:_elementArry[0],
      type:type
    }      
    const dialogRef = this.dialog.open(InitiateDeBoardingDialogComponent, {
      width: '700px',
      maxHeight: '99vh',
      disableClose:true,
      data: _obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
 
  initiateChangeRequest(element: any){
    let _elementArry=[];
    _elementArry=this.allDataListDisplayTable.filter((v=>{
      return v.employeeNumber==element.employeeNumber
    }))
    
    this.router.navigate(['/Resource-Management/Initiate Change Request'], { queryParams:  _elementArry[0], skipLocationChange: true});//element
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
  informPartnerLink(element:any){
let _elementArry=[];
_elementArry=this.allDataListDisplayTable.filter((v=>{
  return v.employeeNumber==element.employeeNumber
}))
  const dialogRef = this.dialog.open(InformPartnerDialogComponent, {
      width: '700px',
      maxHeight: '99vh',
      disableClose:true,
      data: _elementArry[0],
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
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
   this.searchInputVal.nativeElement.value = '';
  }
  checkIfNameExists(arr:any, newName:any) {
    return arr.some(function (e:any) {
      return e.columnName === newName;
    });
  }
  getCapitalize(item:any) {
    return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/(\B[A-Z])/g, ' $1').replace('Ntid','NT ID').replace('I D','ID').replace('Enddate','End date').replace('Bu','BU').replace('Jd','JD').replace('Personnel Subarea','Personnel Subarea BGS').replace('Contract End','Contract End(SOW JD)')
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
employeeNameDetails1: any= [];
employeeNumberDetails1: any= [];
ntidDetails1:any=[];
emailIDDetails1:any=[];
sowJDIddetails1:any=[];
skillSetDetails1:any=[];
gradeDetails1:any=[];
levelDetails1:any=[];
locationModedetails1:any=[];
companyDetails1:any[]=[];
personalAreaDetails1:any=[];
personalSubAreaDetails1:any=[];
genderdetails1:any=[];
purchaseOrderDetails1:any=[];
poLineTemDetails1:any=[];
vendorNameDetails1:any=[];
vendorEmailDetails1:any=[];
vendorIdDetails1:any=[];
poEndDateDetails1:any=[];
contractEndDetails1:any=[];
groupDetails1:any=[];
departmentDetails1:any=[];
sectionDetails1:any=[];
buDetails1:any=[];
deliveryManagerNameDetails1:any=[];
deliveryManagerEmailDetails1:any=[];
dojDetails1:any=[];
billingStartDateDetails1:any=[];
billableDetails1:any=[];
availableCapacityDetails1:any=[];
empStatusDetails1:any=[];  
getMethod1(){
  this.employeeNameDetails1 = [...this._filterEmpNameArray];
    this.employeeNameDetails= this.employeeNameDetails1

  this.employeeNumberDetails1= [...this._filterEmpNumberArray];
  this.employeeNumberDetails= this.employeeNumberDetails1;

this.ntidDetails1 = [...this._filterNtidArray];
this.ntidDetails=this.ntidDetails1;

this.emailIDDetails1 = [...this._filterEmailArray];
this.emailIDDetails=this.emailIDDetails1;

this.sowJDIddetails1 = [...this._filterSowJdArray];
this.sowJDIddetails =this.sowJDIddetails1; 

this.skillSetDetails1 = [...this._filterSkillsetarray];
this.skillSetDetails=this.skillSetDetails1;

this.gradeDetails1 = [...this._filterGradeArray];
this.gradeDetails=this.gradeDetails1;

this.levelDetails1 = [...this._filterLevelArray];
this.levelDetails=this.levelDetails1;

this.locationModedetails1 = [...this._filterLocationModeArray];
this.locationModedetails=this.locationModedetails1;

this.companyDetails1 = [...this._filterCompanyArray];
this.companyDetails=this.companyDetails1;

this.personalAreaDetails1 = [...this._filterPersonalAreaArray];
this.personalAreaDetails=this.personalAreaDetails1;

this.personalSubAreaDetails1 = [...this._filterPersonalSubAreaArray];
this.personalSubAreaDetails=this.personalSubAreaDetails1;

this.genderdetails1 = [...this._filterGenderArray];
this.genderdetails=this.genderdetails1;

this.purchaseOrderDetails1 = [...this._filterPurchaseOrderArray];
this.purchaseOrderDetails=this.purchaseOrderDetails1;

this.poLineTemDetails1 = [...this._filterPOLineItemArray];
this.poLineTemDetails=this.poLineTemDetails1;

this.vendorNameDetails1 = [...this._filterVendorNameArray];
this.vendorNameDetails=this.vendorNameDetails1;

this.vendorEmailDetails1 = [...this._filterVendorEmailArray];
this.vendorEmailDetails=this.vendorEmailDetails1;

this.vendorIdDetails1 = [...this._filterVendorIDArray];
this.vendorIdDetails=this.vendorIdDetails1;

this.poEndDateDetails1 = [...this._filterPOEndDateArray];
this.poEndDateDetails=this.poEndDateDetails1;

this.contractEndDetails1 = [...this._filterContractEndArray];
this.contractEndDetails=this.contractEndDetails1;


this.groupDetails1 = [...this._filterGroupArray];
this.groupDetails=this.groupDetails1;

this.departmentDetails1 = [...this._filterDepartmentArray];
this.departmentDetails=this.departmentDetails1;

this.sectionDetails1 = [...this._filterSectionArray];
this.sectionDetails=this.sectionDetails1;

this.buDetails1 = [...this._filterBusinessUnitArray];
this.buDetails=this.buDetails1;

this.deliveryManagerNameDetails1 = [...this._filterDeliveryManagerNameArray];
this.deliveryManagerNameDetails=this.deliveryManagerNameDetails1;

this.deliveryManagerEmailDetails1 = [...this._filterDeliveryManagerEmailArray];
this.deliveryManagerEmailDetails=this.deliveryManagerEmailDetails1;

this.dojDetails1 = [...this._filterDateOfJoiningArray];
this.dojDetails=this.dojDetails1;

this.billingStartDateDetails1 = [...this._filterBillingStartDateArray];
this.billingStartDateDetails=this.billingStartDateDetails1;

this.billableDetails1 = [...this._filterBillableArray];
this.billableDetails=this.billableDetails1;

this.availableCapacityDetails1 = [...this._filterAvailableCapacityArray];
this.availableCapacityDetails=this.availableCapacityDetails1;

this.empStatusDetails1 = [...this._filterEmployementStatus];
this.empStatusDetails=this.empStatusDetails1;




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


@ViewChild('idEmployeeNumber') idEmployeeNumber: ElementRef;
@ViewChild('idEmployeeName') idEmployeeName: ElementRef;
@ViewChild('idNtid') idNtid: ElementRef;
@ViewChild('idEmailid') idEmailid: ElementRef; 
@ViewChild('idSowJd') idSowJd: ElementRef;
@ViewChild('idSkillSet') idSkillSet: ElementRef;
@ViewChild('idGrade') idGrade: ElementRef;
@ViewChild('idLevel') idLevel: ElementRef;
@ViewChild('idLocationMode') idLocationMode: ElementRef; 
@ViewChild('idCompany') idCompany: ElementRef;
@ViewChild('idPersonnelArea') idPersonnelArea: ElementRef;
@ViewChild('idPersonnelSubArea') idPersonnelSubArea: ElementRef;
@ViewChild('idGender') idGender: ElementRef;
@ViewChild('idPurchaseOrder') idPurchaseOrder: ElementRef;
@ViewChild('idPoLineItem') idPoLineItem: ElementRef;
@ViewChild('idVendorName') idVendorName: ElementRef;
@ViewChild('idVendorId') idVendorId: ElementRef;
@ViewChild('idVendorEmailId') idVendorEmailId: ElementRef;
@ViewChild('idPoEnddate') idPoEnddate: ElementRef;
@ViewChild('idContractEnd') idContractEnd: ElementRef;
@ViewChild('idGroup') idGroup: ElementRef;
@ViewChild('idDepartment') idDepartment: ElementRef;
@ViewChild('idSection') idSection: ElementRef;
@ViewChild('idBusinessUnit') idBusinessUnit: ElementRef;
@ViewChild('idDeliveryManagerName') idDeliveryManagerName: ElementRef;
@ViewChild('idDeliveryManagerEmail') idDeliveryManagerEmail: ElementRef;
@ViewChild('idDateOfJoining') idDateOfJoining: ElementRef;
@ViewChild('idBillingStartDate') idBillingStartDate: ElementRef;
@ViewChild('idBillable') idBillable: ElementRef;
@ViewChild('idAvailableCapacity') idAvailableCapacity: ElementRef;
@ViewChild('idStatus') idStatus: ElementRef;

clearSearchInput(){
   this.idEmployeeNumber.nativeElement.value = '';
   this.idEmployeeName.nativeElement.value = '';
   this.idNtid.nativeElement.value = '';
   this.idEmailid.nativeElement.value = '';
   this.idSowJd.nativeElement.value = '';
   this.idSkillSet.nativeElement.value = '';
   this.idGrade.nativeElement.value = '';
   this.idLevel.nativeElement.value = '';
   this.idLocationMode.nativeElement.value = '';
   this.idCompany.nativeElement.value = '';

   this.idPersonnelArea.nativeElement.value = '';
   this.idPersonnelSubArea.nativeElement.value = '';
   this.idGender.nativeElement.value = '';
   this.idPurchaseOrder.nativeElement.value = '';
   this.idPoLineItem.nativeElement.value = '';
   this.idVendorName.nativeElement.value = '';
   this.idVendorId.nativeElement.value = '';
   this.idVendorEmailId.nativeElement.value = '';
   this.idPoEnddate.nativeElement.value = '';
   this.idContractEnd.nativeElement.value = '';
   this.idGroup.nativeElement.value = '';
   this.idDepartment.nativeElement.value = '';
   this.idSection.nativeElement.value = '';
   this.idBusinessUnit.nativeElement.value = '';
   this.idDeliveryManagerName.nativeElement.value = '';
   this.idDeliveryManagerEmail.nativeElement.value = '';
   this.idDateOfJoining.nativeElement.value = '';
   this.idBillingStartDate.nativeElement.value = '';
   this.idBillable.nativeElement.value = '';
   this.idAvailableCapacity.nativeElement.value = '';
   this.idStatus.nativeElement.value = '';
}
mhoverChangeIcon(){
this.getMethod1();
this.clearSearchInput();
}
onKeyChangeFilter(val:any,columnName:any) {
  let filterVal = val.toLowerCase();
  if(filterVal.length==0){
   if(columnName=='EmployeeNumber'){
      this.employeeNumberDetails = this.employeeNumberDetails1;
    }
    else if(columnName=='EmployeeName'){
      this.employeeNameDetails = this.employeeNameDetails1;
    }
    else if(columnName=='NTID'){
     this.ntidDetails=this.ntidDetails1;
    }
    else if(columnName=='EmailId'){
      this.emailIDDetails=this.emailIDDetails1;
    }
    else if(columnName=='SowJdID'){
   this.sowJDIddetails=this.sowJDIddetails1;
      
    }
    else if(columnName=='SkillSet'){
     this.skillSetDetails=this.skillSetDetails1;
    }
    else if(columnName=='Grade'){
     this.gradeDetails=this.gradeDetails1;
    }
    else if(columnName=='Level'){
      this.levelDetails=this.levelDetails1;
    }
    else if(columnName=='LocationMode'){
   this.locationModedetails=this.locationModedetails1;
      
    }
    else if(columnName=='Company'){
     this.companyDetails=this.companyDetails1;
    }

    else if(columnName=='PersonnelArea'){
     this.personalAreaDetails=this.personalAreaDetails1;
    }
    else if(columnName=='PersonnelSubarea'){
      this.personalSubAreaDetails=this.personalSubAreaDetails1;
    }
    else if(columnName=='Gender'){
   
      this.genderdetails=this.genderdetails1;
    }
    else if(columnName=='PurchaseOrder'){
     this.purchaseOrderDetails=this.purchaseOrderDetails1;
    }
    else if(columnName=='PoLineItem'){
     this.poLineTemDetails=this.poLineTemDetails1;
    }
    else if(columnName=='VendorName'){
      this.vendorNameDetails=this.vendorNameDetails1;
    }
    else if(columnName=='VendorID'){
   this.vendorIdDetails=this.vendorIdDetails1;
      
    }
    else if(columnName=='VendorEmail'){
     this.vendorEmailDetails=this.vendorEmailDetails1;
    }

    else if(columnName=='PoEnddate'){
     this.poEndDateDetails=this.poEndDateDetails1;
    }
    else if(columnName=='ContractEnd'){
     this.contractEndDetails=this.contractEndDetails1;
    }
    else if(columnName=='Group'){
      this.groupDetails=this.groupDetails1;
    }
    else if(columnName=='Department'){
   this.departmentDetails=this.departmentDetails1;
      
    }
    else if(columnName=='Section'){
     this.sectionDetails=this.sectionDetails1;
    }

    else if(columnName=='BusinessUnit'){
     this.buDetails=this.buDetails1;
    }
    else if(columnName=='DeliveryManagerName'){
     this.deliveryManagerNameDetails=this.deliveryManagerNameDetails1;
    }
    else if(columnName=='DeliveryManagerEmail'){
      this.deliveryManagerEmailDetails=this.deliveryManagerEmailDetails1;
    }
    else if(columnName=='DateOfJoining'){
   
      this.dojDetails=this.dojDetails1;
    }
    else if(columnName=='BillingStartDate'){
     this.billingStartDateDetails=this.billingStartDateDetails1;
    }

    else if(columnName=='Billable'){
     this.billableDetails=this.billableDetails1;
    }
    else if(columnName=='AvailableCapacity'){
     this.availableCapacityDetails=this.availableCapacityDetails1;
    }
    else if(columnName=='Status'){
      this.empStatusDetails=this.empStatusDetails1;
    }
  
  }
  else{
    
    if(columnName=='EmployeeNumber'){
    this.employeeNumberDetails =this.employeeNumberDetails1.filter((option) => String(option).toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='EmployeeName'){
      this.employeeNameDetails = this.employeeNameDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='NTID'){
     this.ntidDetails=this.ntidDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='EmailId'){
      this.emailIDDetails=this.emailIDDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='SowJdID'){
   this.sowJDIddetails=this.sowJDIddetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      
    }
    else if(columnName=='SkillSet'){
     this.skillSetDetails=this.skillSetDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='Grade'){
     this.gradeDetails=this.gradeDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='Level'){
      this.levelDetails=this.levelDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='LocationMode'){
   this.locationModedetails=this.locationModedetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      
    }
    else if(columnName=='Company'){
     this.companyDetails=this.companyDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }

    else if(columnName=='PersonnelArea'){
     this.personalAreaDetails=this.personalAreaDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='PersonnelSubarea'){
      this.personalSubAreaDetails=this.personalSubAreaDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='Gender'){
   
      this.genderdetails=this.genderdetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='PurchaseOrder'){
     this.purchaseOrderDetails=this.purchaseOrderDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='PoLineItem'){
     this.poLineTemDetails=this.poLineTemDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='VendorName'){
      this.vendorNameDetails=this.vendorNameDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='VendorID'){
   this.vendorIdDetails=this.vendorIdDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      
    }
    else if(columnName=='VendorEmail'){
     this.vendorEmailDetails=this.vendorEmailDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }

    else if(columnName=='PoEnddate'){
     this.poEndDateDetails=this.poEndDateDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='ContractEnd'){
     this.contractEndDetails=this.contractEndDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='Group'){
      this.groupDetails=this.groupDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='Department'){
   this.departmentDetails=this.departmentDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
      
    }
    else if(columnName=='Section'){
     this.sectionDetails=this.sectionDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }

    else if(columnName=='BusinessUnit'){
     this.buDetails=this.buDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='DeliveryManagerName'){
     this.deliveryManagerNameDetails=this.deliveryManagerNameDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='DeliveryManagerEmail'){
      this.deliveryManagerEmailDetails=this.deliveryManagerEmailDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='DateOfJoining'){
   
      this.dojDetails=this.dojDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='BillingStartDate'){
     this.billingStartDateDetails=this.billingStartDateDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }

    else if(columnName=='Billable'){
     this.billableDetails=this.billableDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='AvailableCapacity'){
     this.availableCapacityDetails=this.availableCapacityDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
    }
    else if(columnName=='Status'){
      this.empStatusDetails=this.empStatusDetails1.filter((option) => option.toLowerCase().startsWith(filterVal));
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
showInitiateDeboardChangeBtn:boolean=false;
showinformPartnerBtn:boolean=false;
getRolePermission(){
  this._roleGetPermission=[];
  if(this.userDetails && this.userDetails.roleDetail){
  let _array1=this.userDetails.roleDetail[0].roleDetails;
  this.showInitiateDeboardChangeBtn= this.findCommonElement( this.roleList,['OSM Admin','Vendor','Vendor_BGSV','Vendor_BGSW']);
  this.showinformPartnerBtn= this.findCommonElement( this.roleList,['OSM Admin','OSM','Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','Department Secretory BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','Department_SPOC_BGSW']);


 let onlyOSmAdmin= this.findCommonElement( this.roleList,['OSM Admin']);
let onlyOsm= this.findCommonElement( this.roleList,['OSM']);
let onlyVendor=this.findCommonElement( this.roleList,['Vendor','Vendor_BGSV','Vendor_BGSW']);
let onlyDeliveryManager= this.findCommonElement( this.roleList,['Delivery_Manager']);
let onlyDepartmentSpoc= this.findCommonElement( this.roleList,['Department_SPOC_BGSV','Department_SPOC_BGSW']);
let onlySectionSpoc= this.findCommonElement( this.roleList,['Section_SPOC_BGSW','Section_SPOC_BGSV']);
let onlyDepartmentSecretory= this.findCommonElement( this.roleList,['Department Secretory BGSV']);
let onlyBuSpocHot= this.findCommonElement( this.roleList,['BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV']);
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
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyDepartmentSecretory==true){
    _array2=  _array1.filter((item)=>{return item.roleName=='Department Secretory BGSV'})[0];
  }
  else if(onlyOSmAdmin==false && onlyOsm==false && onlyVendor==false && onlyBuSpocHot==true){
    _array2=  _array1.filter((item)=>{return ((item.roleName=='BU_SPOC_HOT_BGSW') || (item.roleName=="BU_SPOC_HOT_BGSV"))})[0];
  }
  else{
    _array2=  this.userDetails.roleDetail[0].roleDetails[0];
  }

  let _fetaturedetailsArray=[];
  _fetaturedetailsArray=_array2.moduleDetails.filter((v)=>{ return v.moduleName=="Resource"});
  if(_fetaturedetailsArray && _fetaturedetailsArray.length >0){
    let _a11=(_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Resource Master"})[0];
    if(_a11){
    this._roleGetPermission=  (_fetaturedetailsArray[0].featureDetails).filter(v1=>{return v1.featureCode=="Resource Master"})[0].permissionDetails[0]
    }
  
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



@ViewChild('selectEmployeeNumber') selectEmployeeNumber: MatSelect;
@ViewChild('selectEmployeeName') selectEmployeeName: MatSelect;
@ViewChild('selectNtid') selectNtid: MatSelect;
@ViewChild('selectEmailid') selectEmailid: MatSelect;
@ViewChild('selectSowJd') selectSowJd: MatSelect;
@ViewChild('selectSkillset') selectSkillset: MatSelect;
@ViewChild('selectGrade') selectGrade: MatSelect;
@ViewChild('selectLevel') selectLevel: MatSelect;
@ViewChild('selectLocationMode') selectLocationMode: MatSelect;
@ViewChild('selectCompany') selectCompany: MatSelect;
@ViewChild('selectPersArea') selectPersArea: MatSelect;
@ViewChild('selectPersSubArea') selectPersSubArea: MatSelect;
@ViewChild('selectGender') selectGender: MatSelect;
@ViewChild('selectPO') selectPO: MatSelect;
@ViewChild('selectPOLineItem') selectPOLineItem: MatSelect;
@ViewChild('selectVendorName') selectVendorName: MatSelect;
@ViewChild('selectVendorId') selectVendorId: MatSelect;
@ViewChild('selectVendorEmailId') selectVendorEmailId: MatSelect;
@ViewChild('selectPoEnddt') selectPoEnddt: MatSelect;
@ViewChild('selectContractEnd') selectContractEnd: MatSelect;
@ViewChild('selectGrup') selectGrup: MatSelect;
@ViewChild('selectDept') selectDept: MatSelect;
@ViewChild('selectSection') selectSection: MatSelect;
@ViewChild('selectBunit') selectBunit: MatSelect;
@ViewChild('selectDmName') selectDmName: MatSelect;
@ViewChild('selectDmEmail') selectDmEmail: MatSelect;
@ViewChild('selectDoj') selectDoj: MatSelect;
@ViewChild('selectBillStartdt') selectBillStartdt: MatSelect;
@ViewChild('selectBillable') selectBillable: MatSelect;
@ViewChild('selectAvailableCapacity') selectAvailableCapacity: MatSelect;
@ViewChild('selectStatus') selectStatus: MatSelect;


allSelectedEmployeeNumber = false;
allSelectedEmployeeName= false;
allSelectedNTID= false;
allSelectedEmailId = false;
allSelectedSowJd = false;
allSelectedSkillSet = false;
allSelectedGrade = false;
allSelectedLevel = false;
allSelectedLocationMode = false;
allSelectedCompany = false;
allSelectedPersonalArea = false;
allSelectedPersonalSubArea = false;
allSelectedGender = false;
allSelectedPorder = false;
allSelectedPoLineItem = false;
allSelectedVendorname = false;
allSelectedVendorId = false;
allSelectedVendorEmailId = false;
allSelectedPoEndDt = false;
allSelectedContractEnd = false;
allSelectedGroup = false;
allSelectedDept = false;
allSelectedSection = false;
allSelectedBunit = false;
allSelectedDeliveryManName = false;
allSelectedDeliveryManEmail = false;
allSelectedDoj = false;
allSelectedBillingSdate = false;
allSelectedBillable = false;
allSelectedAvaCapacity = false;
allSelectedStatus = false;

toggleAllDDL(colName: any) {
 if ((colName == 'empNumber')) {
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
   else if (colName == 'ntid'){
    if (this.allSelectedNTID) {
      this.selectNtid.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectNtid.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'emailid'){
    if (this.allSelectedEmailId) {
      this.selectEmailid.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectEmailid.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'sowjd'){ 
    if (this.allSelectedSowJd) {
      this.selectSowJd.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectSowJd.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'skillset'){
    if (this.allSelectedSkillSet) {
      this.selectSkillset.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectSkillset.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'grade'){ 
    if (this.allSelectedGrade) {
      this.selectGrade.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectGrade.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'level'){ 
    if (this.allSelectedLevel) {
      this.selectLevel.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectLevel.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
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
   else if (colName == 'locMode'){
    if (this.allSelectedLocationMode) {
      this.selectLocationMode.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectLocationMode.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'company'){
    if (this.allSelectedCompany) {
      this.selectCompany.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectCompany.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'persArea'){ 
    if (this.allSelectedPersonalArea) {
      this.selectPersArea.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectPersArea.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'persSubArea'){
    if (this.allSelectedPersonalSubArea) {
      this.selectPersSubArea.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectPersSubArea.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'gender'){
    if (this.allSelectedGender) {
      this.selectGender.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectGender.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'pOrder'){
    if (this.allSelectedPorder) {
      this.selectPO.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectPO.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'poLineItem'){
    if (this.allSelectedPoLineItem) {
      this.selectPOLineItem.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectPOLineItem.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'vendorName'){ 
    if (this.allSelectedVendorname) {
      this.selectVendorName.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectVendorName.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'vendorId'){
    if (this.allSelectedVendorId) {
      this.selectVendorId.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectVendorId.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'vendorEmailId'){ 
    if (this.allSelectedVendorEmailId) {
      this.selectVendorEmailId.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectVendorEmailId.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'poEndDt'){
    if (this.allSelectedPoEndDt) {
      this.selectPoEnddt.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectPoEnddt.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'contractEnd'){ 
    if (this.allSelectedContractEnd) {
      this.selectContractEnd.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectContractEnd.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'group'){ 
    if (this.allSelectedGroup) {
      this.selectGrup.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectGrup.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'dept'){
    if (this.allSelectedDept) {
      this.selectDept.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectDept.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'section'){ 
    if (this.allSelectedSection) {
      this.selectSection.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectSection.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'bUnit'){
    if (this.allSelectedBunit) {
      this.selectBunit.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectBunit.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'DmName'){
    if (this.allSelectedDeliveryManName) {
      this.selectDmName.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectDmName.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'DmEmail'){
    if (this.allSelectedDeliveryManEmail) {
      this.selectDmEmail.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectDmEmail.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'doj'){ 
    if (this.allSelectedDoj) {
      this.selectDoj.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectDoj.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'billStartdt'){
    if (this.allSelectedBillingSdate) {
      this.selectBillStartdt.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectBillStartdt.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
    }
   else if (colName == 'billable'){ 
    if (this.allSelectedBillable) {
      this.selectBillable.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectBillable.options.forEach((item: MatOption) =>
        item.deselect()
      );
    }
   }
   else if (colName == 'aCapacity'){ 
    if (this.allSelectedAvaCapacity) {
      this.selectAvailableCapacity.options.forEach((item: MatOption) =>
        item.select()
      );
    } else {
      this.selectAvailableCapacity.options.forEach((item: MatOption) =>
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
 if ((colName == 'empNumber')) {
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
 else if (colName == 'ntid'){ 
  this.selectNtid.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedNTID = newStatus;
 }
 else if (colName == 'emailid'){ 
  this.selectEmailid.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedEmailId = newStatus;
 }
 else if (colName == 'sowjd'){ 
  this.selectSowJd.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedSowJd  = newStatus;
 }
 else if (colName == 'skillset'){
  this.selectSkillset.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedSkillSet  = newStatus;
  }
 else if (colName == 'grade'){
  this.selectGrade.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedGrade  = newStatus;
  }
 else if (colName == 'level'){
  this.selectLevel.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedLevel  = newStatus;
  }
 else if (colName == 'locMode'){ 
  this.selectLocationMode.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedLocationMode  = newStatus;
 }
 else if (colName == 'company'){ 
  this.selectCompany.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedCompany  = newStatus;
 }
 else if (colName == 'persArea'){
  this.selectPersArea.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedPersonalArea  = newStatus;
  }
 else if (colName == 'persSubArea'){ 
  this.selectPersSubArea.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedPersonalSubArea  = newStatus;
 }
 else if (colName == 'gender'){
  this.selectGender.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedGender  = newStatus;
  }
 else if (colName == 'pOrder'){
  this.selectPO.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedPorder  = newStatus;
  }
 else if (colName == 'poLineItem'){ 
  this.selectPOLineItem.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedPoLineItem = newStatus;
 }
 else if (colName == 'vendorName'){ 
  this.selectVendorName.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedVendorname  = newStatus;
 }
 else if (colName == 'vendorId'){
  this.selectVendorId.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedVendorId = newStatus;
  }
 else if (colName == 'vendorEmailId'){ 
  this.selectVendorEmailId.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedVendorEmailId = newStatus;
 }
 else if (colName == 'poEndDt'){ 
  this.selectPoEnddt.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedPoEndDt = newStatus;
 }
 else if (colName == 'contractEnd'){ 
  this.selectContractEnd.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedContractEnd = newStatus;
 }
 else if (colName == 'group'){ 
  this.selectGrup.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedGroup = newStatus;
 }
 else if (colName == 'dept'){ 
  this.selectDept.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedDept  = newStatus;
 }
 else if (colName == 'section'){ 
  this.selectSection.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedSection  = newStatus;
 }
 else if (colName == 'bUnit'){ 
  this.selectBunit.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedBunit  = newStatus;
 }
 else if (colName == 'DmName'){
  this.selectDmName.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedDeliveryManName  = newStatus;
  }
 else if (colName == 'DmEmail'){ 
  this.selectDmEmail.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedDeliveryManEmail = newStatus;
 }
 else if (colName == 'doj'){ 
  this.selectDoj.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedDoj = newStatus;
 }
 else if (colName == 'billStartdt'){ 
  this.selectBillStartdt.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedBillingSdate = newStatus;
 }
 else if (colName == 'billable'){
  this.selectBillable.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedBillable = newStatus;
  }
 else if (colName == 'aCapacity'){ 
  this.selectAvailableCapacity.options.forEach((item: MatOption) => {
    if (!item.selected) {
      newStatus = false;
    }
  });
  this.allSelectedAvaCapacity = newStatus;
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
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1_Resource_Master');
  XLSX.writeFile(wb, 'ResourceMasterRecords.xlsx');
}
}

