import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetailsActionDialogComponent } from '../change-details-action-dialog/change-details-action-dialog.component';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { ApiResourceService } from '../api-resource.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { sowjdService } from 'src/app/dm/services/sowjdService.service';
import { PermissionDetails } from 'src/app/common/user-profile/user-profile';

@Component({
  selector: 'app-change-request-details-view-action',
  templateUrl: './change-request-details-view-action.component.html',
  styleUrls: ['./change-request-details-view-action.component.css']
})
export class ChangeRequestDetailsViewActionComponent implements OnInit {
  selectedItem = null;
  _storechangeValue: any;
  listDDl: any = [];
  selectedMulChange: any = [];
  getElementData: any = [];
  bindDataByEmpNumber: any = [];
  newBindDataBycr: any = [];
  showLoading: boolean = false;
  remarksList:any=[];
  ischeckEffectiveDate5WDBefore:boolean=true;
  filterWithdrawRemarks:any=[];
  requestCRid:any="";
  subscription: Subscription;
  permissionsBehaviorSubjectChangeManagement: PermissionDetails;
  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private API: ApiResourceService,private sowjdService: sowjdService) { 
    this.subscription = this.sowjdService.getUserProfileRoleDetailChangeManagement().subscribe((roles: PermissionDetails) => {
      this.permissionsBehaviorSubjectChangeManagement = roles;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(localStorage.getItem('crIDForStatus')=='forMyactionCR'){
        this.getElementData = JSON.parse(params.element);
        this.requestCRid=this.getElementData.requestId;
      }
      else{
        localStorage.removeItem('crIDForStatus');
        this.getElementData = params;
        this.requestCRid=this.getElementData.crId;
      }     
    });
    this.getUserRolesInfo();
    //this.getRolePermission();
    this.getInfoCmByEmpNum();
  }
  getInfoCmByEmpNum() {
    let _empNum = "";
    if(localStorage.getItem('crIDForStatus')=='forMyactionCR'){
      if(this.getElementData && this.getElementData.requestId){
    _empNum = this.getElementData.requestId.split('-')[0];
      }
    }
    else{
      localStorage.removeItem('crIDForStatus');
      _empNum = this.getElementData.employeeNumber;
    }
    this.showLoading = true;
    this.API.getCmInfoByEmpNumerApi(_empNum).subscribe((res: any) => {
      this.showLoading = false;
      this.bindDataByEmpNumber=[];
      if(res && res.data && res.data.cmMaster && res.data.cmMaster.length >0){
      this.bindDataByEmpNumber = res.data.cmMaster[0];
      }
      this.getDateByCrNumber();
    })
  }
  getDateByCrNumber() {
    this.showLoading = true;
    let _crNum = "";
    if(localStorage.getItem('crIDForStatus')=='forMyactionCR'){
      _crNum = this.getElementData.requestId;
    }
    else{
      localStorage.removeItem('crIDForStatus');
      _crNum = this.getElementData.crId;
    }
    this.getSowjdInfoCM(_crNum);
    this.API.getCmDateByCRnumberApi(_crNum).subscribe((res: any) => {
      this.showLoading = false;
      this.newBindDataBycr=[];
      if(res && res.data && res.data.gbBusinessAreaList  && res.data.gbBusinessAreaList.length>0){
        this.gbBusinessAreaList = res.data.gbBusinessAreaList;
        }
      if(res && res.data && res.data.cmcrMaster  && res.data.cmcrMaster.length>0){
      this.newBindDataBycr = res.data.cmcrMaster[0];
      }
      this.remarksList=res.data.resourceCrRemarks;


      let getDateSubmit=   this.remarksList.filter((v=>{
        return v.statusDescription=="Submit"
      }));
      if(getDateSubmit && getDateSubmit.length>0){
        this.getDategetDateSubmitDate=getDateSubmit[0].createdOn;
        }


      let getDateFirstApproved=   this.remarksList.filter((v=>{
        return v.statusDescription=="FirstApprove"
      }));
      if(getDateFirstApproved && getDateFirstApproved.length>0){
        this.getDateFirstApprovedDate=getDateFirstApproved[0].createdOn;
        }

        let getDateSecondApproved=   this.remarksList.filter((v=>{
          return v.statusDescription=="SecondApprove"
        }));
        if(getDateSecondApproved && getDateSecondApproved.length>0){
          this.getDateSecondApprovedDate=getDateSecondApproved[0].createdOn;
          }

let getDateFirstSendBack=   this.remarksList.filter((v=>{
  return v.statusDescription=="SendBack"
}));

if(getDateFirstSendBack && getDateFirstSendBack.length>0){
  this.getDateFirstSendBackDate= this.getFindMaxValueDateCommon(getDateFirstSendBack); 
  }


  let getDateResubmitted=   this.remarksList.filter((v=>{
    return v.statusDescription=="ReSubmit"
  }));
  
  if(getDateResubmitted && getDateResubmitted.length>0){
    this.getDateResubmittedDate= this.getFindMaxValueDateCommon(getDateResubmitted); 
    }
    this.filterWithdrawRemarks=this.remarksList?.filter((v=>{return (v.statusDescription=="Withdrawn" || v.statusDescription=="Withdraw")}))[0];
setTimeout(()=>{
  this.getListDDl();
},2000)



  if (res && res.data && res.data.cmDelegationDetails) {
    this.checkDelegateArray=res.data.cmDelegationDetails;
  this.checkDelegateOneTime=res.data.cmDelegationDetails[0];
  }
    
      localStorage.removeItem('crIDForStatus');
      this.checkFiveLWDExcludeSatSun();
    })

  }
  checkDelegateOneTime:any=[];
  checkDelegateArray:any=[];
getSowjdInfoCM(_crNum){
  this.showLoading = true;
  this.API.getSowJDInfoChangeManagement(_crNum).subscribe((res: any) => {
    this.showLoading = false;
    if(res && res.status=="Success"){
      this.getSowInfoData=res.data;
    }
  });
}


getSowInfoData:any=[];
  getDategetDateSubmitDate:any="";
  getDateFirstApprovedDate:any="";
  getDateSecondApprovedDate:any="";
  getDateFirstSendBackDate:any="";
  getDateResubmittedDate:any="";

  getFindMaxValueDateCommon(response:any){
    response = response.map(x => {
      const formattedDate = moment(new Date(x.createdOn)).format('yyyy-MM-DD')
      return { ...x, createdOn: formattedDate };
    });
    var datesArray = response;
    var newObject = {};
    var dates = datesArray.map(function(obj) {
      var regEx = new RegExp(/-/g);
      var dateKey = parseInt(obj.createdOn.replace(regEx, ""), 10)
      newObject[dateKey] = obj;
      return dateKey;
    });
    return newObject[Math.max(...dates)].createdOn;
  }

  getListDDl() {
    this.listDDl = [
      {
        labelText: 'Sign Off',
        labelValue: 'Sign Off ID',
        subLebelText: this.getSowInfoData?.signOffId,
        newChangesDDl: [
          {
            labelText: this.newBindDataBycr.technicalProposalNumber +'|'+ this.newBindDataBycr.skillset+'|'+ this.newBindDataBycr.grade,
            labelValue: this.newBindDataBycr.technicalProposalNumber +'|'+ this.newBindDataBycr.skillset+'|'+ this.newBindDataBycr.grade,
          },
        ],
      },
      {
        labelText: 'SOW JD',
        labelValue: 'SOW JD ID',
        subLebelText: this.getSowInfoData?.sowJdID,
        newChangesDDl: [
          {
            labelText: this.newBindDataBycr.sowJdNumber,
            labelValue: this.newBindDataBycr.sowJdNumber,
          },
        ],
      },
      {
        labelText: 'Skillset',
        labelValue: 'Skillset',
        subLebelText: this.getSowInfoData?.skillSet,
        newChangesDDl: [
          { labelText: this.newBindDataBycr.skillset, labelValue: this.newBindDataBycr.skillset },
        ],
      },
      {
        labelText: 'Grade',
        labelValue: 'Grade',
        subLebelText: this.getSowInfoData?.grade,
        newChangesDDl: [{ labelText: this.newBindDataBycr.grade, labelValue: this.newBindDataBycr.grade }],
      },
      {
        labelText: 'Purchase Order',
        labelValue: 'Purchase Order',
        subLebelText: this.getSowInfoData?.purchaseOrder,
        newChangesDDl: [{ labelText: this.newBindDataBycr.poNumber, labelValue: this.newBindDataBycr.poNumber }],
      },
      {
        labelText: 'PO Line Item',
        labelValue: 'PO Line Item',
        subLebelText: this.getSowInfoData?.poLineItem || '--',
        newChangesDDl: [{ labelText:this.newBindDataBycr.lineitem, labelValue: this.newBindDataBycr.lineitem }],
      },
      {
        labelText: 'Personal Area',
        labelValue: 'Personal Area',
        subLebelText: this.getSowInfoData?.personalArea ,
        newChangesDDl: [{ labelText: this.newBindDataBycr.personalArea, labelValue: this.newBindDataBycr.personalArea }],
      },
      {
        labelText: 'Personal Sub-Area',
        labelValue: 'Personal Sub-Area',
        subLebelText: this.getSowInfoData?.personalSubArea,
        newChangesDDl: [{ labelText: this.newBindDataBycr.personalSubArea, labelValue: this.newBindDataBycr.personalSubArea }],
      },
      {
        labelText: 'Organization Unit',
        labelValue: 'Organization Unit',
        subLebelText:    this.getSowInfoData?.organizationUnit || '--',
        newChangesDDl: [{ labelText: this.newBindDataBycr.orgName, labelValue: this.newBindDataBycr.orgName }],
      },
      {
        labelText: 'SOW JD End Date',
        labelValue: 'SOW JD End Date',
        subLebelText:  moment(this.getSowInfoData?.sowJdEndDate).format('DD-MMM-yyyy') || '--',
        newChangesDDl: [{ labelText: moment(this.newBindDataBycr.validityEnd).format('DD-MMM-yyyy'), labelValue: moment(this.newBindDataBycr.validityEnd).format('DD-MMM-yyyy') }],
      },
    ];
  
    this.selectedMulChange = this.listDDl;
    this.selectChangeDDL(this.selectedMulChange);
    let _changeDDl:any =this.newBindDataBycr.crInitiateTypeId;
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
    this.selectChangeDropdown(this.ddlChangeModel);
  }


  ddlChangeModel: any;
  gbBusinessAreaList:any=[];
  onActionClick(item: any) {
    let _approveBtnID: HTMLElement | null= document.getElementById('approveBtnID');  
    let _sendBackBtnID: HTMLElement | null= document.getElementById('sendBackBtnID');
    let _delegateBtnID: HTMLElement | null= document.getElementById('delegateBtnID');
    
    if(item=='Approve')  {
    _approveBtnID.classList.add("approveBtnIDCs"); 
    }
    if(item=='Reject')  {
      _sendBackBtnID.classList.add("sendBackBtnIDCs"); 
      }
      if(item=='Delegate')  {
        _delegateBtnID.classList.add("delegateBtnIDCs"); 
        }
    let _obj = {
      element: this.getElementData,
      type: item,
    };
    if(item=='Approve')  {
      _obj['gbBusinessAreaList']=this.gbBusinessAreaList,
      _obj['checkSowJDDDl']= this.ddlChangeModel;
      }
    this.selectedItem = item;
    const dialogRef = this.dialog.open(ChangeDetailsActionDialogComponent, {
      width: '510px',
      maxHeight: '99vh',
      disableClose: true,
      data: _obj
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if(item=='Approve')  {
        _approveBtnID.classList.remove("approveBtnIDCs"); 
        }
        if(item=='Reject')  {
         _sendBackBtnID.classList.remove("sendBackBtnIDCs"); 
         }
         if(item=='Delegate')  {
           _delegateBtnID.classList.remove("delegateBtnIDCs"); 
           }
    
      if (result == 'true') {
        this.backTo();
      }

    });
    if (item == 'delegate') {
    } else if (item == 'withdraw') {
    } else if (item == 'reject') {
    } else if (item == 'approve') {
    }
  }

  selectChangeDDL(val: any) {
    let changeAllArray = [];
    this._storechangeValue = val;
  }
  backTo() {

    let navigationExtras: NavigationExtras = {
      queryParams: {
        "data": encodeURIComponent('changeManagement'),
      }
    };

    this.router.navigate(["Resource-Management"], navigationExtras);

    localStorage.removeItem('deBoardIDForStatus');
  }

  isShowPersonalSubArea: boolean = false;
  isShowBillable: boolean = false;
  isShowSowJD: boolean = false;
  billableModel: any;
  personalSubAreaModel: any;
  isShowPurchaseOrder:boolean=false;
  isShowGrade:boolean=false;
  selectChangeDropdown(val: any) {
    this._storechangeValue = val;
    this.isShowPersonalSubArea = false;
    this.isShowBillable = false;
    this.isShowSowJD = false;
    this.isShowPurchaseOrder=false;
    this.isShowGrade=false;
    if (val == 'Personal Sub-Area') {
      this.isShowPersonalSubArea = true;
      this.personalSubAreaModel = this.newBindDataBycr.personalSubArea;
    }
    if (val == 'Billable/Non-Billable') {
      this.isShowBillable = true;
      this.billableModel = this.newBindDataBycr.billable ==true?'Yes':'No';// 'No';
    }
    if (val == 'SOW JD') {
      this.isShowSowJD = true;
    }
    if(val=='Purchase Order'){
      this.isShowPurchaseOrder=true;
      
    }
    if(val=='Grade'){
      this.isShowGrade=true;
    }
  }

  userDetailsRoles: any = [];
  userDetails: userProfileDetails;
  //roleList = [];
  //exitCheckRoleApproveSendbackDelegate: boolean = false;
 // exitCheckRoleWithDrawResubmiChangeEffectiveDateCancelRequest: boolean = false;
//  checkOnlySectionSpoc:boolean=false;
  getUserRolesInfo() {
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];  
    this.userDetails = JSON.parse(sessionStorage.getItem('user_profile_details'));

    // if (this.userDetails && this.userDetails.roleDetail && this.userDetails.roleDetail.length > 0) {
    //   this.roleList = this.userDetails.roleDetail[0].roleDetails.map(
    //     (item: any) => item.roleName
    //   );
    
     // this.exitCheckRoleApproveSendbackDelegate=this.findCommonElement( this.roleList,['OSM Admin', 'OSM','Delivery_Manager', 'Department_SPOC_BGSV', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG','Department_SPOC_BGSW']);

      //this.exitCheckRoleWithDrawResubmiChangeEffectiveDateCancelRequest = this.findCommonElement(this.roleList, ['OSM Admin', 'Vendor']);
      //this.checkOnlyDeliveryManager=this.findCommonElement( this.roleList,['Delivery_Manager']);
     // this.checkOnlyOSMAdmin=this.findCommonElement( this.roleList,['OSM Admin','OSM']);
     // this.checkOnlySectionSpoc=this.findCommonElement( this.roleList,['Section SPOC BGSW','Section SPOC BGSV','Section_SPOC_BGSW','Section_SPOC_BGSV']);
   // }
  }
//  checkOnlyDeliveryManager:boolean=false;
 // checkOnlyOSMAdmin:boolean=false;
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
  onReSubmitClick(type: any) {
    let _obj = {
      rowData: JSON.stringify(this.getElementData),
      allBindDataByEmpNumber:  JSON.stringify(this.bindDataByEmpNumber),
      allNewBindDataBycr:  JSON.stringify(this.newBindDataBycr),
      type: type
    }
    this.router.navigate(['/Resource-Management/Initiate Change Request'], { queryParams: _obj, skipLocationChange: true });

  }


  

//_roleGetPermission:any=[];
//showApproveSendBackDelegateBtn:boolean=false;
//showWithdrawResubmitChangeEffectiveDateCancelRequestBtn:boolean=false;
//getRolePermission(){
  //this._roleGetPermission=[];
  // let _array1=[];
  // if(this.userDetails && this.userDetails.roleDetail &&  this.userDetails.roleDetail[0].roleDetails){
  //  _array1=this.userDetails.roleDetail[0].roleDetails;
  // }

 // this.showApproveSendBackDelegateBtn= this.findCommonElement( this.roleList,['OSM Admin','OSM','Delivery_Manager', 'Department_SPOC_BGSV','Department_SPOC_BGSW', 'Section_SPOC_BGSW','Section_SPOC_BGSV','HRS-IN SPOC 1(Initiate ECL)','HRS-IN SPOC 1','Department Secretory BGSV','BD-Asset-BGSW','BD-Asset-BGSV','BD-NTID-BGSW','DSP-NTID-BGSV','HRS-IN SPOC 2 (Complete ECL)','HRS-IN SPOC 2','FCM-BGSV','BU_SPOC_HOT_BGSW','BU_SPOC_HOT_BGSV','CTG']);
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
//     if(this.userDetails && this.userDetails.roleDetail &&  this.userDetails.roleDetail[0].roleDetails){
//     _array2=  this.userDetails.roleDetail[0].roleDetails[0];
//     }
//   }

//   let _fetaturedetailsArray=[];
//   if(_array2 && _array2.moduleDetails){
//   _fetaturedetailsArray=_array2.moduleDetails.filter((v)=>{ return v.moduleName=="Resource"});
 
//   }
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
//}
checkFiveLWDExcludeSatSun(){
  let effDateFrom=moment(this.newBindDataBycr.validityStart).format('MM/DD/YYYY');
  let startDate = new Date(effDateFrom);
  let endDate:any = "", offset = 5;
  while(offset > 0){
      endDate = new Date(startDate.setDate(startDate.getDate() - 1));
      if(endDate.getDay() !== 0 && endDate.getDay() !== 6){
         offset--;
      }
  } 
  let date1 = new Date(endDate);
  var newdate= (date1.getFullYear()+'-'+(date1.getMonth() + 1) + '-' + date1.getDate()).replace(/(^|\D)(\d)(?!\d)/g, '$10$2');
  const firstDate = new Date(newdate);
  let effDateFromFormat=moment(this.newBindDataBycr.validityStart).format('YYYY-MM-DD');
  const secondDate = new Date(effDateFromFormat);//"2024-02-22");
  const daysWithOutWeekEnd = [];
  const daysWithWeekEnd=[];
  for (var currentDate = new Date(firstDate); currentDate <= secondDate; currentDate.setDate(currentDate.getDate() + 1)) {    
    if (currentDate.getDay() != 0 && currentDate.getDay() != 6) {
      daysWithOutWeekEnd.push(new Date(currentDate));
    }
    else{
      daysWithWeekEnd.push(new Date(currentDate));
    }
  }
  let _mergedate=[...daysWithOutWeekEnd,...daysWithWeekEnd];
  var dateTodayCurrent = new Date();
  var newdateTodayCurrent= (dateTodayCurrent.getDate()+'/'+(dateTodayCurrent.getMonth() + 1) +'/'+  dateTodayCurrent.getFullYear() ).replace(/(^|\D)(\d)(?!\d)/g, '$10$2');
   this.ischeckEffectiveDate5WDBefore= this.isInArray(this.mergedMapdate(this.bubbleSortArray(_mergedate)), newdateTodayCurrent);   
return this.ischeckEffectiveDate5WDBefore;
}
 mergedMapdate(arr){
  const output = arr.map(dateTodayCurrent =>{return (dateTodayCurrent.getDate()+'/'+(dateTodayCurrent.getMonth() + 1) +'/'+  dateTodayCurrent.getFullYear() ).replace(/(^|\D)(\d)(?!\d)/g, '$10$2')
                 });
                    return output;
 }
 
  isInArray(array, value) {
   return (array.find(item => {
     return item == value
   }) 
  || []).length > 0;
 }
 
 
 bubbleSortArray(array) {
   var done = false;
   while (!done) {
     done = true;
     for (var i = 1; i < array.length; i += 1) {
       if (array[i - 1] > array[i]) {
         done = false;
         var tmp = array[i - 1];
         array[i - 1] = array[i];
         array[i] = tmp;
       }
     }
   }
 
   return array;
 }
 getStatusTopColor(val:any){
  let color='black';
if(val=='Submitted' || val=='Initiated' || val=='First Approval' || val=='Approved'){
color='darkgreen';
}
if(val=='Withdrawn'|| val=='Withdraw'){
color='#f5c77e';
}
if(val=='Rejected' || val=='Sent Back'){
color='red';
}
return color;
}
getFirstLevelApproverName(){
  let firstApproverName="";
  //if(this.newBindDataBycr && this.newBindDataBycr.firstApproverEmail){
  firstApproverName=this.newBindDataBycr?.firstApproverName;//(this.newBindDataBycr.firstApproverEmail.split('@')[0]).replace('external.','').replace('.',' ');
  //}
  return firstApproverName;
}
getSecondLevelApproverName(){
  let secondApproverName="";
 // if(this.newBindDataBycr && this.newBindDataBycr.secondApproverEmail){
  secondApproverName=  this.newBindDataBycr?.secondApproverName;//(this.getElementData.secondApproverEmail.split('@')[0]).replace('external.','').replace('.',' ');
 // }
  return secondApproverName;
}
}
