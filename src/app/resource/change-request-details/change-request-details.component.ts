import { Component , OnInit} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ChangeDetailsActionDialogComponent } from '../change-details-action-dialog/change-details-action-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiResourceService } from '../api-resource.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';
import * as moment from 'moment';
@Component({
  selector: 'app-change-request-details',
  templateUrl: './change-request-details.component.html',
  styleUrls: ['./change-request-details.component.css']
})
export class ChangeRequestDetailsComponent implements OnInit{
  selectedItem = null;
  _storechangeValue: any;
  listDDl: any = [];
  getElementData:any=[];
  getResponseSowJDDetails:any=[];

  createdForm: FormGroup;
  getCRDetails:any=[];
  typeBtn:any="";
  ddlChangeModel:any="";
  newBillableModel:any="";
  newPersonalSubAreaModel:any;
  sowJDListCM:any=[];
  resubmitTimePersonalArea:any="";
  constructor(private router :Router,private dialog:MatDialog,private route: ActivatedRoute,private API:ApiResourceService,private fb: FormBuilder,private snackBar: MatSnackBar, public loaderService: LoaderService) {
    this.createdForm = this.fb.group({
      newSignOffIdForm: ['', Validators.required],
      newSowJDIdForm: ['', Validators.required],
      newSkillSetForm: ['', Validators.required],
      newGradeForm:['', Validators.required],
      newPurchaseOrderForm:['', Validators.required],
      newPoLineItemForm:[''],
      newPersonalSubAreaForm:['', Validators.required],
    });
  }
  _resourceDataBind:any=[];
  _crDataBind:any=[];
  organizationUnit:any='--';
newOrganizationUnit:any='--';
signOffList:any=[];
signoffIDddlList:any=[];
userDetailsRoles:any=[];
  ngOnInit() {
    let _getLoginDetails = this.API.getFetchLoginDetailsFor();
    this.userDetailsRoles = _getLoginDetails.profile.user_roles[0];
   
//this.organizationUnit='BSWG/BDO';
this.newOrganizationUnit='';//'BSWG/BD';
    this.route.queryParams.subscribe(params=> {
      if(params && params.type=='Re-Submit'){
        this.typeBtn=params.type;
        let _rowData=JSON.parse(params.rowData);
        let _resourceData=JSON.parse(params.allBindDataByEmpNumber);
        this._resourceDataBind=_resourceData ;
        let _crData=JSON.parse(params.allNewBindDataBycr);
        this._crDataBind=_crData;
        this.getElementData={..._rowData,..._resourceData,..._crData};
       let _changeDDl:any =this.getElementData.crInitiateTypeId;
       if (_changeDDl == "1" || _changeDDl == 1) {
         this.ddlChangeModel = 'SOW JD';      
       }
       else  if (_changeDDl == "2" || _changeDDl == 2)  {
         this.ddlChangeModel = 'Billable/Non-Billable';
         this.newBillableModel=this.getElementData.billable==true?'1':'0';
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
      else{
        this.getElementData=params;
        this.ddlChangeModel ='';
         }  
    });
let _vendorID="";
if( this.userDetailsRoles=='/Vendors'){
  _vendorID=_getLoginDetails?.profile?.vendor_id;
}
let _obj={
  "vendorID":_vendorID || "",
  "roles":this.userDetailsRoles,
  "dateOfJoining":this.getElementData?.dateOfJoining
}
this.loaderService.setShowLoading();
    this.API.getChangeRequestDataForDropdown(_obj).subscribe((res:any)=>{
      this.loaderService.setDisableLoading();
if(res && res.data){
this.getResponseSowJDDetails=res.data;
if(res?.data?.singnOffIds){
  this.signOffList=(res?.data?.singnOffIds);
  this.signoffIDddlList=this.signOffList;
  if(this.typeBtn=='Re-Submit'){
    this.getSowjdInfoCM(this.getElementData.crId);
  this.selectChangeDropdown(this.ddlChangeModel);//added
  
  }
}


this.onDateChange();
if((this.typeBtn=='Re-Submit') &&  (this.ddlChangeModel == 'Personal Sub-Area') ){
 let _ddlOptionVal =this.getElementData.personalSubArea;
  let _dd1=this.getResponseSowJDDetails.personalSubAreas.filter((v)=>{return v.personalSubArea==_ddlOptionVal}); 

  this.newPersonalSubAreaModel=_dd1[0]
}
if((this.typeBtn=='Re-Submit') &&  (this.ddlChangeModel == 'SOW JD') ){
 // let _valData=this._crDataBind;
  // let _optionNewSowJD =_valData.sowJdNumber;
  // let _optionNewSkills=_valData.skillset;
  // let _optionNewGrade=_valData.grade;
  // let _optionNewPoNumber=_valData.poNumber;
  //  let _optionNewPersonalSubAres=_valData.personalSubArea;
  //  let _ddNewSowJD=this.getResponseSowJDDetails.sowjds.filter((v)=>{return v.sowjdNumber==_optionNewSowJD});  
  //  let _ddNewSkillsSet=this.getResponseSowJDDetails.skillSets.filter((v)=>{return v.skillSetName==_optionNewSkills});
  //  let _ddNewGrades=this.getResponseSowJDDetails.grades.filter((v)=>{return v.gradeName==_optionNewGrade});
  //  let _ddNewPurchaseOrders=this.getResponseSowJDDetails.purchaseOrders.filter((v)=>{return v.poNumber==_optionNewPoNumber});
  //  let _ddNewPersonalSubAreas=this.getResponseSowJDDetails.personalSubAreas.filter((v)=>{return v.personalSubArea==_optionNewPersonalSubAres});

   let _ddNewPoLineItem=[];
this.filterPOLineArray=[];
   if(this.getResponseSowJDDetails && this.getResponseSowJDDetails.purchaseOrderLineItems){
   let _filterPOlineItems=[];
    _filterPOlineItems=this.getResponseSowJDDetails.purchaseOrderLineItems;
    this.filterPOLineArray= _filterPOlineItems.filter((v)=>{return v.poNumber== this.getElementData.poNumber});
 _ddNewPoLineItem= this.filterPOLineArray;
   }

  //  this.createdForm.controls.newSowJDIdForm.patchValue(_ddNewSowJD[0]);
  //  this.createdForm.controls.newSkillSetForm.patchValue(_ddNewSkillsSet[0]);
  //  this.createdForm.controls.newGradeForm.patchValue(_ddNewGrades[0]);
  //  this.createdForm.controls.newPurchaseOrderForm.patchValue(_ddNewPurchaseOrders[0]);
   //this.createdForm.controls.newPoLineItemForm.patchValue(_ddNewPoLineItem[0]);
   //this.createdForm.controls.newPersonalSubAreaForm.patchValue(_ddNewPersonalSubAreas[0]);

let array1=this.signoffIDddlList;
let arr2=array1.filter((v=>{return v.techPropId==this._crDataBind.signoffId && v.skillsetName==this._crDataBind.skillset && v.gradeName==this._crDataBind.grade && v.sowJdNumber==this._crDataBind.sowJdNumber}));
  this.createdForm.controls.newSignOffIdForm.patchValue(arr2[0]);
 
  this.sowJDListCM=array1.filter((v=>{return v.sowJdNumber==arr2[0].sowJdNumber}));
  this.createdForm.controls.newSowJDIdForm.patchValue(this.sowJDListCM[0]);

  this.skillSetListCM=array1.filter((v=>{return (v.techPropId==this._crDataBind.signoffId) && v.sowJdNumber==arr2[0].sowJdNumber && v.skillsetName==arr2[0].skillsetName}));
  this.createdForm.controls.newSkillSetForm.patchValue( this.skillSetListCM[0]);


  this.gradeListCM=array1.filter((v=>{return(v.techPropId==this._crDataBind.signoffId) && v.sowJdNumber==arr2[0].sowJdNumber && v.skillsetName==arr2[0].skillsetName  &&  v.gradeName==arr2[0].gradeName}));
  this.createdForm.controls.newGradeForm.patchValue(this.gradeListCM[0]);

  this.purchaseOrderListCM=this.signOffList.filter((v=>{return (v.techPropId==this._crDataBind.signoffId) && v.sowJdNumber==arr2[0].sowJdNumber && v.skillsetName==arr2[0].skillsetName && v.gradeName==arr2[0].gradeName}));
  this.createdForm.controls.newPurchaseOrderForm.patchValue( this.purchaseOrderListCM[0]);

 this.newPurchaseOrderChange2();
 this.loaderService.setShowLoading();
 setTimeout(()=>{
  this.loaderService.setDisableLoading();
  this.createdForm.controls.newPoLineItemForm.patchValue(this.poLineItemListCM[0]);
  this.createdForm.controls.newPersonalSubAreaForm.patchValue(this.plantInformationItemListCM[0]);
  this.newPersonalAreaData  =arr2[0].personalArea;
  this.newOrganizationUnit=arr2[0].group;
  
 },3000)


 }
}
    });
  
  }

  getSowInfoData:any=[];
  getSowjdInfoCM(_crNum){
    this.loaderService.setShowLoading();
    this.API.getSowJDInfoChangeManagement(_crNum).subscribe((res: any) => {
      this.loaderService.setDisableLoading();
      if(res && res.status=="Success"){
        this.getSowInfoData=res.data;
      }
    });
  }

  MinDateModel: any = new Date();
  selectedDate = new Date();
  dateBind: any = '';
  onDateChange() {
let obj={
  "companyCode": this.getElementData.companyCode
}
this.loaderService.setShowLoading();
    this.API.getEffectiveFromDateCMApi(obj).subscribe((res:any)=>{
      this.loaderService.setDisableLoading();
if(res && res.data && res.data.srnBillingPeriodStDt){
  this.dateBind= res.data.srnBillingPeriodStDt;
}
    });
    

   
  }
  uniqueFindArraySignOFF(jsonArray:any){
    const uniqueArray = jsonArray.filter(
      (obj, index, self) =>
        index ===
        self.findIndex((o) => JSON.stringify(o.signoffID) === JSON.stringify(obj.signoffID))
    );
    return uniqueArray;
  }

submitBtn(item:any){
  if( this.ddlChangeModel =="" ||  this.ddlChangeModel ==null ||  this.ddlChangeModel ==undefined){
    this.snackBar.open("Please Select Change Request.", 'Close', {
      duration: 3000,
    });
    return;
  }
  let _obj={};
  let _typeBtn="";
 _typeBtn= this.typeBtn;

  let _crInitiateTypeId='';
  if(this._storechangeValue=='SOW JD'){
    _crInitiateTypeId='1';
  }
  else if(this._storechangeValue=='Billable/Non-Billable'){
    _crInitiateTypeId='2';
  }
  else if(this._storechangeValue=='Personal Sub-Area'){
    _crInitiateTypeId='3';
  }
  else if(this._storechangeValue=='Purchase Order'){
    _crInitiateTypeId='4';
  }
  else if(this._storechangeValue=='Grade'){
    _crInitiateTypeId='5';
  }
  let _newSignOffIdForm= this.createdForm.controls.newSignOffIdForm.value.signoffID;
let _newSowJDValue=this.createdForm.controls.newSowJDIdForm.value.sowjdId;
let _newSkillSetForm=this.createdForm.controls.newSkillSetForm.value.skillId; 
let _newGradeForm=this.createdForm.controls.newGradeForm.value.gradeId;  
let _newPurchaseOrderForm= this.createdForm.controls.newPurchaseOrderForm.value.purchaseOrderId; 
let _newPersonalSubAreaForm= this.createdForm.controls.newPersonalSubAreaForm.value.plantId; 
let _newPersonalAreaID=  this.createdForm.controls.newSignOffIdForm.value.personalAreaId;
let _newOrganisationUnitId=  this.createdForm.controls.newSignOffIdForm.value.groupId;
let _newPOLineItem= this.createdForm.controls.newPoLineItemForm.value.id ;
if(this._storechangeValue=='SOW JD'){
  this.organizationUnit=this.getElementData.group;

  if(_newSignOffIdForm==undefined || _newSignOffIdForm=="" || _newSignOffIdForm==null){
    this.snackBar.open("Please Select New Sign Off ID", 'Close', {
      duration: 4000,
    });
    return;
  }
if(_newSowJDValue==undefined || _newSowJDValue=="" || _newSowJDValue==null){
  this.snackBar.open("Please Select New Sow JD ID", 'Close', {
    duration: 3000,
  });
  return;
}
if(_newSkillSetForm==undefined || _newSkillSetForm=="" || _newSkillSetForm==null){
  this.snackBar.open("Please Select New Skill Set", 'Close', {
    duration: 3000,
  });
  return;
}
if(_newGradeForm==undefined || _newGradeForm=="" || _newGradeForm==null){
  this.snackBar.open("Please Select New Grade", 'Close', {
    duration: 3000,
  });
  return;
}
if(_newPurchaseOrderForm==undefined || _newPurchaseOrderForm=="" || _newPurchaseOrderForm==null){
  this.snackBar.open("Please Select New Purchase Order", 'Close', {
    duration: 3000,
  });
  return;
}
if(_newPersonalSubAreaForm==undefined || _newPersonalSubAreaForm=="" || _newPersonalSubAreaForm==null){
  this.snackBar.open("Please Select New Personal Sub Area", 'Close', {
    duration: 3000,
  });
  return;
}
}
else if(this._storechangeValue=='Billable/Non-Billable'){
let _newBillableModel=this.newBillableModel;
if(_newBillableModel==undefined || _newBillableModel=="" || _newBillableModel==null){
  this.snackBar.open("Please Select New Billable", 'Close', {
    duration: 3000,
  });
  return;
}

}

else if(this._storechangeValue=='Personal Sub-Area'){
  let _newPersonalSubAreaModel=this.newPersonalSubAreaModel;
  if(_newPersonalSubAreaModel==undefined || _newPersonalSubAreaModel=="" || _newPersonalSubAreaModel==null){
    this.snackBar.open("Please Select New Personal Sub Area", 'Close', {
      duration: 3000,
    });
    return;
  }
  
  }

  else if(this._storechangeValue=='Purchase Order'){
    let _poModalData=this.newPODDLmodel;
    let _poLineItemModalData=this.newPOLineItemDDLmodel;
    if(_poModalData==undefined || _poModalData=="" || _poModalData==null){
      this.snackBar.open("Please Select New Purchase Order*", 'Close', {
        duration: 3000,
      });
      return;
    }
    if(_poLineItemModalData==undefined || _poLineItemModalData=="" || _poLineItemModalData==null){
      this.snackBar.open("Please Select New PO Line Item*", 'Close', {
        duration: 3000,
      });
      return;
    }

  }
  else if(this._storechangeValue=='Grade'){
    
    let _gradeModalData=this.newGradeDDLmodel;
    if(_gradeModalData==undefined || _gradeModalData=="" || _gradeModalData==null){
      this.snackBar.open("Please Select New Grade*", 'Close', {
        duration: 3000,
      });
      return;
    }
  }


  let sowjdInfo={
    signOfId:this.getElementData.technicalProposalNumber,
    sowjd:this.getElementData.sowJdID,
    skillset:this.getElementData.skillset,
    grade:this.getElementData.grade,
    purchaseOrder:this.getElementData.purchaseOrder,
    poLineItem:this.getElementData.poLineItem,
    personalArea:this.getElementData.personnelArea,
    personalSubArea:this.getElementData.personnelSubarea,
    group:this.getElementData?.group,
    sowjdEndDate:this.getElementData.sowEndDate,
    billable:this.getElementData.billable
    };

  let _modelObj={ };

    
if(this._storechangeValue=='SOW JD'){
  if(_typeBtn=="Re-Submit"){
    _modelObj=
    {
      "resourceCrId": this.getElementData.id,   
      "crInitiateTypeId":_crInitiateTypeId,   
      "crStatusTypeId": "3", 
      "employeeNumber": this.getElementData.employeeNumber,
      "validityStart": this.dateBind,
      "validityEnd": this.createdForm?.controls?.newSignOffIdForm?.value?.endDate,//"2023-12-01",
      "sowJdId": _newSowJDValue,
      "skillSetId":_newSkillSetForm,
      "gradeId":_newGradeForm,
      "poId": _newPurchaseOrderForm, 
      "PoIdLineItemId" :_newPOLineItem,//this._newPolineItemValueID,
      "PersonalAreaId": _newPersonalAreaID,//"4741BAA1-4ACF-4F39-A009-1C47E17FB511", 
      "PersonalSubAreaId": _newPersonalSubAreaForm,
      "organisationUnitId":_newOrganisationUnitId, 
      "typeBtn":  _typeBtn ,
      "selectDropDown":this._storechangeValue,
      "sowEndDate": this.getElementData.sowEndDate,
      "isSamePO": this.getElementData.purchaseOrder == this.newPurchaseOrderValue  ? true:false, 
    "isSamePOLineItem":  this.getElementData.poLineItem== String(this.newPOLineItemValue) ? true:false,
    "isSameOrg": this.organizationUnit==this.newOrganizationUnit? true:false,
    "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
    "sectionSpocNtID":this.getElementData?.sectionSpocNtID,
    "signoffId": this.createdForm.controls.newSignOffIdForm.value.techPropId
    }
    
  }else{
  _modelObj={   
    "vendorId":this.getElementData.venId,
    "crStatusTypeId": "1",
    "crInitiateTypeId":_crInitiateTypeId,
    "employeeNumber":this.getElementData.employeeNumber,
    "validityStart":  this.dateBind,
    "validityEnd":this.createdForm?.controls?.newSignOffIdForm?.value?.endDate,//"2023-12-01",
    "sowJdId":_newSowJDValue,
    "skillSetId": _newSkillSetForm,
    "gradeId": _newGradeForm,
    "poId":_newPurchaseOrderForm,
    "PoIdLineItemId":_newPOLineItem,//  this._newPolineItemValueID, //'dc16877d-0f74-41e0-9284-113f3b0c8558'
    "PersonalAreaId": _newPersonalAreaID,// "4741BAA1-4ACF-4F39-A009-1C47E17FB511",
    "PersonalSubAreaId":_newPersonalSubAreaForm,
    "organisationUnitId": _newOrganisationUnitId,   
    "selectDropDown":this._storechangeValue,
    "sowEndDate":this.getElementData.sowEndDate,
    "isSamePO": this.getElementData.purchaseOrder == this.newPurchaseOrderValue  ? true:false, 
    "isSamePOLineItem":  this.getElementData.poLineItem== String(this.newPOLineItemValue) ? true:false,
    "isSameOrg": this.organizationUnit==this.newOrganizationUnit? true:false,
    "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
    "sectionSpocNtID":this.getElementData?.sectionSpocNtID,
    "signoffId": this.createdForm.controls.newSignOffIdForm.value.techPropId
    
  }
}

   _obj = {
    type: item,
    dataPass:_modelObj,
    sowjdInfo:sowjdInfo
};
this.getRemarksDialogInitiate(_obj);
}
if(this._storechangeValue=='Billable/Non-Billable')
{

let _id=this.getElementData.compId;
  this.API.getExistingCompetencyAPI(_id).subscribe((res:any)=>{
if(res && res.data && res.data.cmExistingCompentency &&  res.data.cmExistingCompentency.length >0){
  let _cmExistingCompentency = res.data.cmExistingCompentency[0];
  if(_typeBtn=="Re-Submit"){
_modelObj={   
  "resourceCrId": this.getElementData.id,
  "crStatusTypeId": "3",
  "crInitiateTypeId":_crInitiateTypeId,
  "employeeNumber":this.getElementData.employeeNumber,
  "validityStart":  this.dateBind ,
  "validityEnd": _cmExistingCompentency.validityEnd,
  "sowJdId":_cmExistingCompentency.sowJdId,
  "skillSetId": _cmExistingCompentency.skillSetId,
  "gradeId": _cmExistingCompentency.gradeId,
  "PersonalAreaId":_cmExistingCompentency.personalAreaId,
  "billable":Number(this.newBillableModel),
  "selectDropDown":this._storechangeValue,
  "typeBtn":  _typeBtn ,
  "sowEndDate":this.getElementData.sowEndDate,
  "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
  "sectionSpocNtID":this.getElementData?.sectionSpocNtID
}
  }
  else{
    _modelObj={   
      "vendorId":this.getElementData.venId,
      "crStatusTypeId": "1",
      "crInitiateTypeId":_crInitiateTypeId,
      "employeeNumber":this.getElementData.employeeNumber,
      "validityStart":  this.dateBind ,
      "validityEnd": _cmExistingCompentency.validityEnd,
      "sowJdId":_cmExistingCompentency.sowJdId,
      "skillSetId": _cmExistingCompentency.skillSetId,
      "gradeId": _cmExistingCompentency.gradeId,
      "PersonalAreaId":_cmExistingCompentency.personalAreaId,
      "billable":Number(this.newBillableModel),
      "selectDropDown":this._storechangeValue,
      "typeBtn":  _typeBtn,
      "sowEndDate":this.getElementData.sowEndDate,
      "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
      "sectionSpocNtID":this.getElementData?.sectionSpocNtID
    }
  }
_obj = {
  type: item,
  dataPass:_modelObj,
  sowjdInfo:sowjdInfo
};
this.getRemarksDialogInitiate(_obj);
}

  })
}

if(this._storechangeValue=='Personal Sub-Area')
{
 
let _id=this.getElementData.compId;
  this.API.getExistingCompetencyAPI(_id).subscribe((res:any)=>{
if(res && res.data && res.data.cmExistingCompentency &&  res.data.cmExistingCompentency.length >0){
  let _cmExistingCompentency = res.data.cmExistingCompentency[0];
  if(_typeBtn=="Re-Submit"){
    _modelObj={   
      "resourceCrId": this.getElementData.id,
      "crStatusTypeId":"3",
      "crInitiateTypeId":_crInitiateTypeId,
      "employeeNumber":this.getElementData.employeeNumber,
      "validityStart":  this.dateBind ,
      "validityEnd": _cmExistingCompentency.validityEnd,
      "sowJdId":_cmExistingCompentency.sowJdId,
      "skillSetId": _cmExistingCompentency.skillSetId,
      "gradeId": _cmExistingCompentency.gradeId,
      "PersonalAreaId":_cmExistingCompentency.personalAreaId,
      "PersonaSublAreaId":this.newPersonalSubAreaModel,
      "selectDropDown":this._storechangeValue ,
      "typeBtn":  _typeBtn,
      "sowEndDate":this.getElementData.sowEndDate,
      "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
      "sectionSpocNtID":this.getElementData?.sectionSpocNtID
    }
  }
  else{
_modelObj={   
  "vendorId":this.getElementData.venId,
  "crStatusTypeId":"1",
  "crInitiateTypeId":_crInitiateTypeId,
  "employeeNumber":this.getElementData.employeeNumber,
  "validityStart":  this.dateBind ,
  "validityEnd": _cmExistingCompentency.validityEnd,
  "sowJdId":_cmExistingCompentency.sowJdId,
  "skillSetId": _cmExistingCompentency.skillSetId,
  "gradeId": _cmExistingCompentency.gradeId,
  "PersonalAreaId":_cmExistingCompentency.personalAreaId,
  "PersonaSublAreaId":this.newPersonalSubAreaModel,
  "selectDropDown":this._storechangeValue ,
  "typeBtn":  _typeBtn,
  "sowEndDate":this.getElementData.sowEndDate,
  "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
  "sectionSpocNtID":this.getElementData?.sectionSpocNtID
}
  }
_obj = {
  type: item,
  dataPass:_modelObj,
  sowjdInfo:sowjdInfo
};
this.getRemarksDialogInitiate(_obj);
}

  })
}
else if(this._storechangeValue=='Purchase Order'){
  let _newPOid=this.newPODDLmodel?.purchaseOrderId;
  let _newPOLineItemId=this.newPOLineItemDDLmodel?.id;

  let _id=this.getElementData.compId;
  this.API.getExistingCompetencyAPI(_id).subscribe((res:any)=>{
if(res && res.data && res.data.cmExistingCompentency &&  res.data.cmExistingCompentency.length >0){
  let _cmExistingCompentency = res.data.cmExistingCompentency[0];
  if(_typeBtn=="Re-Submit"){
    _modelObj={   
      "resourceCrId": this.getElementData.id,
      "crStatusTypeId":"3",
      "crInitiateTypeId":_crInitiateTypeId,
      "employeeNumber":this.getElementData.employeeNumber,
      "validityStart":  this.dateBind ,
      "validityEnd": _cmExistingCompentency.validityEnd,
      "sowJdId":_cmExistingCompentency.sowJdId,
      "skillSetId": _cmExistingCompentency.skillSetId,
      "gradeId": _cmExistingCompentency.gradeId,
      "poId": _newPOid,
      "PoIdLineItemId": _newPOLineItemId,
      "PersonalAreaId":_cmExistingCompentency.personalAreaId,     
      "selectDropDown":this._storechangeValue ,
      "typeBtn":  _typeBtn,
      "sowEndDate":this.getElementData.sowEndDate,
      "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
      "sectionSpocNtID":this.getElementData?.sectionSpocNtID
    }
  }
  else{
  _modelObj={ 
    "vendorId":this.getElementData.venId,
    "crStatusTypeId":"1",
    "crInitiateTypeId":_crInitiateTypeId,
    "employeeNumber":this.getElementData.employeeNumber,
    "validityStart":  this.dateBind ,
    "validityEnd": _cmExistingCompentency.validityEnd,
  "sowJdId":_cmExistingCompentency.sowJdId,
  "skillSetId": _cmExistingCompentency.skillSetId,
  "gradeId": _cmExistingCompentency.gradeId,
    "poId": _newPOid,
    "PoIdLineItemId": _newPOLineItemId,
    "PersonalAreaId":_cmExistingCompentency.personalAreaId,
    "selectDropDown":this._storechangeValue ,
  "typeBtn":  _typeBtn,
  "sowEndDate":this.getElementData.sowEndDate,
  "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
  "sectionSpocNtID":this.getElementData?.sectionSpocNtID
  }
}
  _obj = {
    type: item,
    dataPass:_modelObj,
    sowjdInfo:sowjdInfo
  };
  this.getRemarksDialogInitiate(_obj);
  }
  
    })

}
else if(this._storechangeValue=='Grade'){
let newGradeId=this.newGradeDDLmodel?.id;

  let _id=this.getElementData.compId;
  this.API.getExistingCompetencyAPI(_id).subscribe((res:any)=>{
if(res && res.data && res.data.cmExistingCompentency &&  res.data.cmExistingCompentency.length >0){
  let _cmExistingCompentency = res.data.cmExistingCompentency[0];
  if(_typeBtn=="Re-Submit"){
    _modelObj={   
      "resourceCrId": this.getElementData.id,
      "crStatusTypeId":"3",
      "crInitiateTypeId":_crInitiateTypeId,
      "employeeNumber":this.getElementData.employeeNumber,
      "validityStart":  this.dateBind ,
      "validityEnd": _cmExistingCompentency.validityEnd,
      "sowJdId":_cmExistingCompentency.sowJdId,
      "skillSetId": _cmExistingCompentency.skillSetId,
      "gradeId": newGradeId,
      "PersonalAreaId":_cmExistingCompentency.personalAreaId,     
      "selectDropDown":this._storechangeValue ,
      "typeBtn":  _typeBtn,
      "sowEndDate":this.getElementData.sowEndDate,
      "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
      "sectionSpocNtID":this.getElementData?.sectionSpocNtID
    }
  }
  else{
  _modelObj=  {
    "vendorId":this.getElementData.venId,
    "crStatusTypeId":"1",
    "crInitiateTypeId":_crInitiateTypeId,
    "employeeNumber":this.getElementData.employeeNumber,
    "validityStart":  this.dateBind ,
    "validityEnd": _cmExistingCompentency.validityEnd,
  "sowJdId":_cmExistingCompentency.sowJdId,
  "skillSetId": _cmExistingCompentency.skillSetId,
  "gradeId": newGradeId,
  "PersonalAreaId":_cmExistingCompentency.personalAreaId,
    "selectDropDown":this._storechangeValue ,
    "typeBtn":  _typeBtn,
    "sowEndDate":this.getElementData.sowEndDate,
    "sowOwnerNtID":this.getElementData?.sowOwnerNtID,
    "sectionSpocNtID":this.getElementData?.buNtid//.sectionSpocNtID,
  }
}

  _obj = {
    type: item,
    dataPass:_modelObj,
    sowjdInfo:sowjdInfo
  };
  this.getRemarksDialogInitiate(_obj);
  }
  
    })

}
this.selectedItem = item;
}

getRemarksDialogInitiate(_obj:any){
  _obj['getElementParentRow']=this.getElementData;
  const dialogRef = this.dialog.open(ChangeDetailsActionDialogComponent, {
    width: '510px',
    maxHeight: '99vh',
    disableClose:true,
    data: _obj
   });
   dialogRef.afterClosed().subscribe((result:any) => {
    if(result=='true'){
      setTimeout(()=>{
        this.backTo();
      },1000)
   
    }
   
   });
}

  selectChangeDDL(val: any) {
    this._storechangeValue = val;
  }
  backTo(){
   
     let navigationExtras: NavigationExtras = {
       queryParams: {
           "data"   : encodeURIComponent('changeManagement'),
       }
   };
   
   this.router.navigate(["Resource-Management"], navigationExtras);
 
     localStorage.removeItem('deBoardIDForStatus');
   }
   isShowPersonalSubArea:boolean=false;
   isShowBillable:boolean=false;
   isShowSowJD:boolean=false;
   isShowPurchaseOrder:boolean=false;
   isShowGrade:boolean=false;
   selectChangeDropdown(val: any) {
    this._storechangeValue = val;
    this.isShowPersonalSubArea=false;    
    this.isShowBillable=false;
    this.isShowSowJD=false;
    this.isShowPurchaseOrder=false;
    this.isShowGrade=false;
    if(val=='Grade'){
      if(this.getElementData?.buNtid =="" || this.getElementData?.buNtid ==undefined || this.getElementData?.buNtid ==null){
        this.snackBar.open("Business Unit Spoc is not available.*", 'Close', {
          duration: 4000,
        });
        setTimeout(()=>{
          this.ddlChangeModel ="";
        },1000)
        return false;
      }
      const dojVAlue=moment(this.getElementData.dateOfJoining).format('yyyy-MM-DD');
      const date1:any = new Date(dojVAlue);
      const date2:any =  new Date(this.dateBind) ;     
       const diffTime = Math.abs(date2.getTime() - date1.getTime());
       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       if(diffDays < 365){
        setTimeout(()=>{
          this.ddlChangeModel ="";
        },1000)     
        this.snackBar.open("Grade Request creation is allowed only after 1 year from Date of Joining.", 'Close', {
          duration: 6000,
        });
     
        return false;
       }
    }
if(val=='Personal Sub-Area'){
  this.isShowPersonalSubArea=true;
}
if(val=='Billable/Non-Billable'){
  this.isShowBillable=true;
}
if(val=='SOW JD'){
  this.isShowSowJD=true;
  let valPO="";
 if(this.typeBtn !='Re-Submit'){
  valPO= this.getElementData.technicalProposalNumber ;
 }
 if(this.typeBtn=='Re-Submit'){
  valPO= this.getSowInfoData?.signOffId;
 }
  this.signoffIDddlList=this.signOffList.filter((v=>{return v.signoffID !=valPO }));
}

if(val=='Purchase Order'){
let valPO="";
 if(this.typeBtn !='Re-Submit'){
  valPO= this.getElementData.purchaseOrder ;
 }
 if(this.typeBtn=='Re-Submit'){
  valPO= this.getSowInfoData?.purchaseOrder;
 }
  this.isShowPurchaseOrder=true;
  let _ddNewPurchaseOrders=this.getResponseSowJDDetails?.singnOffIds;
  this.poListForPurchaseOrder=(this.uniqueFindArrayPO2(_ddNewPurchaseOrders)).filter((v=>{return v.pOnumber !=valPO }));
  
}
setTimeout(()=>{
if(val=='Grade'){
  this.isShowGrade=true;
  let _ddNewGrade=this.getResponseSowJDDetails?.grades;
  let _ddNewGrade2=[];
  let checkGradeNumber="";
  if(this.typeBtn !='Re-Submit'){
    checkGradeNumber=   this.getElementData.grade;
}
  if(this.typeBtn=='Re-Submit'){
    checkGradeNumber= this.getSowInfoData?.grade;
  }
  //this.gradeListForGrade=this.uniqueFindArrayGrade2(_ddNewGrade);
  if(checkGradeNumber=='Grade 0'){
    _ddNewGrade2=_ddNewGrade.filter(v=>{return v.gradeName=='Grade 1'})
  }
  else if(checkGradeNumber=='Grade 1'){
    _ddNewGrade2=_ddNewGrade.filter(v=>{return v.gradeName=='Grade 0' || v.gradeName=='Grade 1'})
  }
  else if(checkGradeNumber=='Grade 2'){
    _ddNewGrade2=_ddNewGrade.filter(v=>{return v.gradeName=='Grade 1' || v.gradeName=='Grade 3'})
  }
  else if(checkGradeNumber=='Grade 3'){
    _ddNewGrade2=_ddNewGrade.filter(v=>{return v.gradeName=='Grade 2' || v.gradeName=='Grade 4'})
  }
  else if(checkGradeNumber=='Grade 4'){
    _ddNewGrade2=_ddNewGrade.filter(v=>{return v.gradeName=='Grade 3'})
  }
  else{
    _ddNewGrade2=_ddNewGrade;
  }
  this.gradeListForGrade=_ddNewGrade2;
}
},4000)
   }
   uniqueFindArrayPO2(jsonArray:any){
    const uniqueArray = jsonArray.filter((obj, index, self) =>index ===self.findIndex((o) => JSON.stringify(o.pOnumber) === JSON.stringify(obj.pOnumber)));       
    const sorted = uniqueArray.sort((a:any, b:any) =>
      a.pOnumber.localeCompare(b.pOnumber)
    );
    return sorted;
  }

  uniqueFindArrayGrade2(jsonArray:any){
    const uniqueArray = jsonArray.filter((obj, index, self) =>index ===self.findIndex((o) => JSON.stringify(o.gradeName) === JSON.stringify(obj.gradeName)));       
    
    return uniqueArray;
  }
  
  newPODDLmodel:any;
  newPOLineItemDDLmodel:any;
  newGradeDDLmodel:any;
  newPODDl(event){
    let obj={
      "plantID":event.value.personalAreaId,//'47533e46-b379-4124-a1c2-7782801b064f',
      "purchaseOrder":event.value.pOnumber
    }    
    this.loaderService.setShowLoading();
    this.API.getPOLineItemBasedPlantIdCM(obj).subscribe((res:any)=>{
      this.loaderService.setDisableLoading();
      if(res && res.data && res.data.newPoLineitems){
        this.poListForPOLineItems=res.data.newPoLineitems;
        
      }    
    })
  }

   poListForPurchaseOrder:any=[];
   gradeListForGrade:any=[];
   poListForPOLineItems:any=[];
   filterPOLineArray:any=[];
   newPurchaseOrderValue:any="";
   newPOLineItemValue:any="";
  newPurchaseOrderChange(event:any){
    this.newPurchaseOrderValue=event.value.poNumber;
    this.filterPOLineArray=[];
    let _val=event.value.poNumber;
    if(this.getResponseSowJDDetails && this.getResponseSowJDDetails.purchaseOrderLineItems){
     let _filterPOlineItems=[];
     _filterPOlineItems=this.getResponseSowJDDetails.purchaseOrderLineItems;
    this.filterPOLineArray= _filterPOlineItems.filter((v)=>{return v.poNumber== _val});
    }

   }
   _newPolineItemValueID:any="";
   newPoLineItemChange(event:any){
    this.newPOLineItemValue=event.value.lineItem;
    let _val=event.value.id;
    this._newPolineItemValueID=_val;
   }
   cancelBtnCM(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "data"   : encodeURIComponent('resourceMaster'),
      }
  };
  
  this.router.navigate(["Resource-Management"], navigationExtras);

    localStorage.removeItem('deBoardIDForStatus');

   }
 
   skillSetListCM:any=[];
   gradeListCM:any=[];
   purchaseOrderListCM:any=[];
   poLineItemListCM:any=[];
   newPersonalAreaData:any;
   plantInformationItemListCM:any=[];
   newSignOffChange(){
let _signOffValue=this.createdForm.controls.newSignOffIdForm.value.signoffID;
this.sowJDListCM=this.uniqueFindArraySowJD(this.signOffList.filter((v=>{return v.signoffID==_signOffValue})));
this.createdForm.controls.newSowJDIdForm.patchValue(this.sowJDListCM[0]);
this.newSowJDChange();
this.newSkillsetChange();
this.newGradeChange();
   }
   uniqueFindArraySowJD(jsonArray:any){
    const uniqueArray = jsonArray.filter(
      (obj, index, self) =>
        index ===
        self.findIndex((o) => JSON.stringify(o.sowJdNumber) === JSON.stringify(obj.sowJdNumber))
    );
    return uniqueArray;
  }
   newSowJDChange(){
    let _signOffValue=this.createdForm.controls.newSignOffIdForm.value.signoffID;
  let _sowjdValue=  this.createdForm.controls.newSowJDIdForm.value.sowJdNumber;
  this.skillSetListCM=this.uniqueFindArraySkillSet(this.signOffList.filter((v=>{return (v.signoffID==_signOffValue) && v.sowJdNumber==_sowjdValue && v.skillsetName==this.createdForm.controls.newSignOffIdForm.value.skillsetName})));  
  this.createdForm.controls.newSkillSetForm.patchValue(this.skillSetListCM[0]);
this.newPersonalAreaData=this.signOffList?.filter((v=>{return (v.signoffID==_signOffValue) && v.sowJdNumber==_sowjdValue}))[0]?.personalArea;
this.newOrganizationUnit= this.createdForm.controls.newSowJDIdForm.value.group;
 

   }
   uniqueFindArraySkillSet(jsonArray:any){
    const uniqueArray = jsonArray.filter(
      (obj, index, self) =>
        index ===
        self.findIndex((o) => JSON.stringify(o.skillsetName) === JSON.stringify(obj.skillsetName))
    );
    return uniqueArray;
  }
   newSkillsetChange(){
    let _signOffValue=this.createdForm.controls.newSignOffIdForm.value.signoffID;
    let _sowjdValue=  this.createdForm.controls.newSowJDIdForm.value.sowJdNumber;
    let _skillsetValue=  this.createdForm.controls.newSkillSetForm.value.skillsetName;
    this.gradeListCM=this.uniqueFindArrayGrade(this.signOffList.filter((v=>{return (v.signoffID==_signOffValue) && v.sowJdNumber==_sowjdValue && v.skillsetName==_skillsetValue &&  v.gradeName==this.createdForm.controls.newSignOffIdForm.value.gradeName})));
    this.createdForm.controls.newGradeForm.patchValue(this.gradeListCM[0]);
  
     }
     uniqueFindArrayGrade(jsonArray:any){
      const uniqueArray = jsonArray.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((o) => JSON.stringify(o.gradeName) === JSON.stringify(obj.gradeName))
      );
      return uniqueArray;
    }
     newGradeChange(){
      let _signOffValue=this.createdForm.controls.newSignOffIdForm.value.signoffID;
      let _sowjdValue=  this.createdForm.controls.newSowJDIdForm.value.sowJdNumber;
      let _skillsetValue=  this.createdForm.controls.newSkillSetForm.value.skillsetName;
      let _gradeValue=this.createdForm.controls.newSkillSetForm.value.gradeName;
      this.purchaseOrderListCM=this.uniqueFindArrayPurchaseOrder(this.signOffList.filter((v=>{return (v.signoffID==_signOffValue) && v.sowJdNumber==_sowjdValue && v.skillsetName==_skillsetValue && v.gradeName==_gradeValue})));
     }
     uniqueFindArrayPurchaseOrder(jsonArray:any){
      const uniqueArray = jsonArray.filter(
        (obj, index, self) =>
          index ===
          self.findIndex((o) => JSON.stringify(o.pOnumber) === JSON.stringify(obj.pOnumber))
      );
      return uniqueArray;
    }
     newPurchaseOrderChange2(){
      let _purchaseOrderValue=this.createdForm.controls.newPurchaseOrderForm.value.pOnumber;
      let obj={
        "plantID":this.createdForm.controls.newSignOffIdForm.value.personalAreaId,//'47533e46-b379-4124-a1c2-7782801b064f',
        "purchaseOrder":_purchaseOrderValue
      }    
      this.loaderService.setShowLoading();
      this.API.getPOLineItemBasedPlantIdCM(obj).subscribe((res:any)=>{
        this.loaderService.setDisableLoading();
        if(res && res.data && res.data.newPoLineitems){
          this.poLineItemListCM=res.data.newPoLineitems;
          
        }
        if(res && res.data && res.data.plantInformation){
          this.plantInformationItemListCM=res.data.plantInformation;
          
        }
        
      
      })
     
    }
    
}
