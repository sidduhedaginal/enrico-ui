import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResourceService } from '../api-resource.service';
import * as moment from 'moment';
import {MatSnackBar} from '@angular/material/snack-bar';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/services/loader.service';
class CustomDateAdapter extends MomentDateAdapter {
  getDayOfWeekNames(style: 'long' | 'short' | 'narrow') {
    return ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  }
  getFirstDayOfWeek(): number {
    return 0;
  }
}
@Component({
  selector: 'app-accessories-collected-dialog',
  templateUrl: './accessories-collected-dialog.component.html',
  styleUrls: ['./accessories-collected-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: DateAdapter,
      useClass: CustomDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
  ],
})
export class AccessoriesCollectedDialogComponent implements OnInit {
  viewData: any;
  createdForm: FormGroup;
  _checkuser:any=[];
  emailEclProcessValue:any="";
  showLoading:boolean=false;
  minDate1=new Date();
  maxDateCurrent=new Date();
  getAllDeboardingDataObj:any={};
  _getPathUrl=environment.mailDeboardUrl;
  constructor(
    public dialogRef: MatDialogRef<AccessoriesCollectedDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any,private fb: FormBuilder,private API: ApiResourceService,private snackBar: MatSnackBar, public loaderService: LoaderService
  ) {
    this.createdForm = this.fb.group({
      accessoriesCollectedDate: ['', Validators.required],
      accessoriesRemarks: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.viewData = this._Data;
    this.minDate1=new Date(this.viewData?.initialDate?.substring(0,10));
this.maxDateCurrent=new Date();
    this._checkuser= StorageQuery.getUserProfile();

    if(this.viewData && this.viewData?.reponseAllData){
      let getAllDeboardingData:any=[];
      getAllDeboardingData= this.viewData?.reponseAllData;
      this.getAllDeboardingDataObj={
      deboardingRequestID	:this.viewData?.rowData?.deboardingRequestID || this.viewData?.rowData?.requestId,
      resourceNumber	:getAllDeboardingData?.resourceDetail[0].employeeNumber,
      ntidData	:getAllDeboardingData?.resourceDetail[0].ntID,
      firstName	:getAllDeboardingData?.resourceDetail[0]?.employeeName?.split(' ')[0],
      lastName	:getAllDeboardingData?.resourceDetail[0]?.employeeName?.split(' ')[1],
      vendorSAPID:	getAllDeboardingData?.vendorDetail[0]?.vendorSAPID,
      vendorName	:getAllDeboardingData?.vendorDetail[0]?.vendorName,
      dateofJoining:moment(getAllDeboardingData?.resourceDetail[0].dateOfJoining).format('DD-MMM-YYYY') || '--',
      exitReason	:getAllDeboardingData?.exitInformation[0].exitReason,
      lastWorkingDay: moment(getAllDeboardingData?.exitInformation[0].lastWorkingDate).format('DD-MMM-YYYY'),
      replacementRequest:	getAllDeboardingData?.exitInformation[0].isReplaceRequest==true?'Yes':'No',
      dateOfjoiningforReplacement	:getAllDeboardingData?.exitInformation[0].dojRequestReplace,
      firstApproverName:  getAllDeboardingData?.resourceApproverDetail[0].firstApproverName ,
      firstApproverEmail: getAllDeboardingData?.resourceApproverDetail[0].firstApproverMailId ,
      secondApproverName: getAllDeboardingData?.resourceApproverDetail[0].secondApproverName ,
      secondApproverEmail: getAllDeboardingData?.resourceApproverDetail[0].secondApproverMailId,
      vendorEmail:getAllDeboardingData?.vendorDetail[0].email,
      accesoriesMail:  getAllDeboardingData?.accessorySPOCInfo[0]?.email,
      transportMail: getAllDeboardingData?.transportSPOCInfo[0]?.email,
      sapIdmMail:  getAllDeboardingData?.sapIdmSPOCInfo[0]?.email,
      assestMail:   getAllDeboardingData?.assetSPOCInfo[0]?.email,
      ntidMail:"",
      completeEclMail: getAllDeboardingData?.completeECLSPOCInfo[0]?.email,
      signOffOwnerEmail:  getAllDeboardingData?.exitInformation[0].signOffOwnerEmail,
      ntidSpocMail: getAllDeboardingData?.ntidSpocingSpocInfo[0].email,
      accessCardMail:getAllDeboardingData?.accessCardSpocInfo[0].email,
      accessCardName:getAllDeboardingData?.accessCardSpocInfo[0].spocFullName
      }

    } 

    let obj={
      "companyCode":  this.viewData.rowData.companyCode,
      "plant": this.viewData.rowData.plantCode || '6525',// To do 
      "eclType": "ACC"
    }
       
    this.API.getECLProcessMailId(obj).subscribe((response:any)=>{

if(response && response.status=="success" && response.data && response.data.eclProcessEmailId && response.data.eclProcessEmailId.length>0){
  this.emailEclProcessValue= response.data.eclProcessEmailId[0].emailID;
}

    })
 
  }
  cancleBtn() {
    this.dialogRef.close('false');
  }
  closeBtn() {
    this.dialogRef.close('false');
  }
  submitBtn(createdForm: any) {
    localStorage.removeItem('deBoardIDForStatus');
    let _accessoriesCollectedDate = moment(createdForm.controls.accessoriesCollectedDate.value).format('YYYY-MM-DD'); 
    let _accessoriesRemarks = createdForm.controls.accessoriesRemarks.value;
let _createdBy='';
if(this._checkuser){
   _createdBy=this._checkuser.displayName;
}

    let _objModel ={
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6", 
      "resourceDbId":  this.viewData.rowData.id,
      "accessoryCollectDt":_accessoriesCollectedDate,
      "remark":_accessoriesRemarks,
      "createdBy":_createdBy || 'Bosch User',
      "CreatedDate": this.getCurrentDateTime()
    } 
//=================================
    let _mainTextTable="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr></table>" ;
    
    let _sendMailObject1 = {
      featureCode:'MasterData-Approval-Process',
      to: this.getAllDeboardingDataObj?.completeEclMail,// this.emailEclProcessValue +','+
       cc: this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail  +','+ this.getAllDeboardingDataObj?.accesoriesMail +',' + this.getAllDeboardingDataObj?.transportMail +',' +  this.getAllDeboardingDataObj?.sapIdmMail  +',' +   this.getAllDeboardingDataObj?.assestMail +','+ this.getAllDeboardingDataObj?.secondApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail +','+ this.getAllDeboardingDataObj?.ntidSpocMail,
       subject: 'ENRICO | Resource Deboarding | ' +this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Complete Exit Clearance ',
      paraInTemplate: {
        teamName: 'All',
        mainText: "Exit clearance received from all the stakeholders and please complete the exit process by clicking the link   <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable        
      }
    };  

    let _sendMailObject2 = {
      featureCode:'MasterData-Approval-Process',
      to:  this.getAllDeboardingDataObj?.accessCardMail,
      cc: this.getAllDeboardingDataObj?.secondApproverEmail +',' + this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
     subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Access Card Clearance',
      paraInTemplate: {
        teamName: this.getAllDeboardingDataObj?.accessCardName,
        mainText: "Exit process has been initiated for  <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> and please collect and deactivate the access card by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable      
      }
    };  
    //==================

    this.loaderService.setShowLoading();  
    this.API.accessoryCollectedPost(_objModel).subscribe((response2: any) => {
      this.loaderService.setDisableLoading();
      if(response2.status=="success"){
        this.dialogRef.close('true');
        this.snackBar.open("Accessories collected Created Successfully...!", 'Close', {
          duration: 3000,
        });
      
    this.API.sendMailinitiateDeboardPost(_sendMailObject1).subscribe((response: any) => {
      this.dialogRef.close();
      });
      this.API.sendMailinitiateDeboardPost(_sendMailObject2).subscribe((response: any) => {
        this.dialogRef.close();   
        });

      }
    });
   
  }
  getCurrentDateTime(){
    var d = new Date();
var datestring = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) +"-"+("0" + d.getDate()).slice(-2)+'T';
var timestring=("0"+(d.getHours())).slice(-2)+":"+("0"+(d.getMinutes())).slice(-2)+":"+("0"+(d.getSeconds())).slice(-2)+".000Z";
return datestring + timestring
  }
  restrictFirstSpace(event) {
    const textarea = event.target;
    if (textarea.value.length === 0 && event.key === ' ') {
        event.preventDefault();
    }
  }
}
