import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResourceService } from '../api-resource.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-retain-resource-dialog',
  templateUrl: './retain-resource-dialog.component.html',
  styleUrls: ['./retain-resource-dialog.component.scss'],
})
export class RetainResourceDialogComponent implements OnInit {
  viewData: any;
  createdForm: FormGroup;
  _checkuser:any=[];
  showLoading:boolean=false;
  getAllDeboardingDataObj:any={};
  _getPathUrl=environment.mailDeboardUrl;
  constructor(
    public dialogRef: MatDialogRef<RetainResourceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any,private fb: FormBuilder,private API: ApiResourceService,private snackBar: MatSnackBar, public loaderService: LoaderService
  ) {
    this.createdForm = this.fb.group({
           extenLWDRemarks:['', Validators.required],
    });
  }

  ngOnInit() {
    this.viewData = this._Data;
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
      signOffOwnerEmail:  getAllDeboardingData?.exitInformation[0].signOffOwnerEmail,
       resourceOwnerEmail:  getAllDeboardingData?.resourceDetail[0].emailID || ""
      }

    }
  }
  cancleBtn() {
    this.dialogRef.close('false');
  }
  closeBtn() {
    this.dialogRef.close('false');
  }
  submitBtn(createdForm: any) {
    localStorage.removeItem('deBoardIDForStatus');
  
    let _Remarks = createdForm.controls.extenLWDRemarks.value;

let _createdBy='';
if(this._checkuser){
  // _createdBy=this._checkuser.displayName;
   _createdBy=this._checkuser.vendorName;
   
}
    let _objModel ={
      "id":   "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "resourceDbId":  this.viewData.rowData.id,        
      "remark":_Remarks,
      "createdBy":_createdBy || 'Bosch User',
      "createdDate": this.getCurrentDateTime()
     
    } 

   this.loaderService.setShowLoading();  
    this.API.retainResourcePost(_objModel).subscribe((response2: any) => {
      this.loaderService.setDisableLoading();
      if(response2.status=="success"){
        this.dialogRef.close('true');
        this.snackBar.open("Retain Resource Created Successfully...!", 'Close', {
          duration: 3000,
        });
        let _sendMailObject = {
          featureCode:'MasterData-Approval-Process',
          entityId : '00000000-0000-0000-0000-000000000000',
          to: this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
          cc: this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.resourceOwnerEmail,
         subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Resource Retained',
          paraInTemplate: {
            teamName: this.getAllDeboardingDataObj?.firstApproverName,
            mainText: "<b>"+this.getAllDeboardingDataObj?.vendorName+"</b> has withdrawn the deboarding request of the resource  <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b>.<br><br>Please check the details by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr></table>"         
          }
        };  
       this.API.sendVendorMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
        this.dialogRef.close('true');        
         }          
       );
    
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
