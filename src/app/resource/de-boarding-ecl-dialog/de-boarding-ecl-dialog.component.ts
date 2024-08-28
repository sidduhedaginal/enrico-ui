import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiResourceService } from '../api-resource.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/services/loader.service';
import * as moment from 'moment';
@Component({
  selector: 'app-de-boarding-ecl-dialog',
  templateUrl: './de-boarding-ecl-dialog.component.html',
  styleUrls: ['./de-boarding-ecl-dialog.component.scss'],
})
export class DeBoardingEclDialogComponent implements OnInit {
  viewData: any;
  remarksModel: any;
  _checkuser:any=[];
  emailEclProcessValue:any="";
  showLoading:boolean=false;
  getAllDeboardingDataObj:any={};
  _getPathUrl=environment.mailDeboardUrl;
  constructor(
    public dialogRef: MatDialogRef<DeBoardingEclDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any,
    private snackBar: MatSnackBar,
    private API: ApiResourceService,
    private router:Router, public loaderService: LoaderService
  ) {}

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
      accesoriesMail:  getAllDeboardingData?.accessorySPOCInfo[0]?.email,
      transportMail: getAllDeboardingData?.transportSPOCInfo[0]?.email,
      sapIdmMail:  getAllDeboardingData?.sapIdmSPOCInfo[0]?.email,
      assestMail:   getAllDeboardingData?.assetSPOCInfo[0]?.email,
      ntidMail:"",
      completeEclMail: getAllDeboardingData?.completeECLSPOCInfo[0]?.email,
      signOffOwnerEmail:  getAllDeboardingData?.exitInformation[0].signOffOwnerEmail,
      resourceOwnerEmail:  getAllDeboardingData?.resourceDetail[0].emailID || "",
      ntidSpocMail: getAllDeboardingData?.ntidSpocingSpocInfo[0].email,
      accessCardMail:getAllDeboardingData?.accessCardSpocInfo[0].email,
      accessCardName:getAllDeboardingData?.accessCardSpocInfo[0].spocFullName
      }

    } 
    let obj={
      "companyCode":  this.viewData.rowData.companyCode,
      "plant": this.viewData.rowData.plantCode || '6525',// To do 
      "eclType": this.viewData.type == 'Initiate ECL'? "ECLINI" : this.viewData.type == 'Complete ECL'?"ECLCOM":""     
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
  submitBtn() {
    localStorage.removeItem('deBoardIDForStatus');
    let _createdBy='';
    if(this._checkuser){
       _createdBy=this._checkuser.displayName;
    }
    
    if (
      this.remarksModel == '' ||
      this.remarksModel == null ||
      this.remarksModel == undefined
    ) {
      this.snackBar.open('Please enter remarks', 'Close', {
        duration: 3000,
      });
      return;
    }
    if (this.viewData.type == 'Initiate ECL') {
      let _objModel = {
        id: this.viewData.rowData.id,
        remark: this.remarksModel,
        createdBy: _createdBy || 'Bosch User',
      };
     
      // let _sendMailObject = {
      //  featureCode:'MasterData-Approval-Process',
      //   to:  this.emailEclProcessValue,
      //   cc:  this.viewData.rowData.ownerEmailId,
      //   subject: 'ENRICO | Deboarding | '+  this.viewData.rowData.deboardingRequestID + ' | Initiate ECL ',       
      //   paraInTemplate: {
      //     teamName: 'Team',
      //     mainText: 'ECL Process started for '+ this.viewData.rowData.fullname + '(' + this.viewData.rowData.employeeNumber +') successfully...!!' +"<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.rowData.deboardingRequestID +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Deboarding </td></tr><tr><td><b>Owner Name</b></td> <td>"+  this.viewData.rowData.ownerName +" </td></tr></table>",
       
      //   }
      // };
      this.loaderService.setShowLoading(); 
      this.API.deboardECLInitiatedPost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == 'success') {
          this.dialogRef.close('true');
          this.snackBar.open('ECL Initiated Successfully..!', 'Close', {
            duration: 3000,
          });
          let _mainTextTable="<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr></table>" ;
          let _sendMailObject1 = {
            featureCode:'MasterData-Approval-Process',
            to:  this.getAllDeboardingDataObj?.accesoriesMail +',' + this.getAllDeboardingDataObj?.transportMail +',' +  this.getAllDeboardingDataObj?.sapIdmMail  +',' +   this.getAllDeboardingDataObj?.assestMail +','+ this.getAllDeboardingDataObj?.ntidSpocMail,
            cc: this.getAllDeboardingDataObj?.secondApproverEmail +',' + this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail+','+ this.getAllDeboardingDataObj?.signOffOwnerEmail ,
           subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Exit Clearance Initiated',
            paraInTemplate: {
              teamName: 'All',
              mainText: "Exit process has been initiated for <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> and please provide exit clearance by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable        
            }
          };  
    
          let _sendMailObject2 = {
            featureCode:'MasterData-Approval-Process',
            to: this.getAllDeboardingDataObj?.accessCardMail,
            cc: this.getAllDeboardingDataObj?.secondApproverEmail +',' + this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.firstApproverEmail +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
           subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Access Card Clearance',
            paraInTemplate: {
              teamName: this.getAllDeboardingDataObj?.accessCardName,
              mainText: "Exit process has been initiated for  <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b> and please collect and deactivate the access card by clicking the link  <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + _mainTextTable      
            }
          };  
    this.API.sendMailinitiateDeboardPost(_sendMailObject1).subscribe((response: any) => {
      this.dialogRef.close();
      });
      this.API.sendMailinitiateDeboardPost(_sendMailObject2).subscribe((response: any) => {
        this.dialogRef.close();   
        });
    
        }
      });
    }
  
    if (this.viewData.type == 'Complete ECL') {
      let _objModel = {
        id: this.viewData.rowData.id,
        remark: this.remarksModel,
        createdBy: _createdBy || 'Bosch User',
      };
      // let _sendMailObject = {      
      //   featureCode:'MasterData-Approval-Process',
      //   to: this.emailEclProcessValue,
      //   cc:  this.viewData.rowData.ownerEmailId,
      //  subject: 'ENRICO | Deboarding | '+  this.viewData.rowData.deboardingRequestID + ' | Complete ECL ',
      //   paraInTemplate: {
      //     teamName: 'Team',
      //     mainText: 'ECL Completed successfully  for '+ this.viewData.rowData.fullname + '(' + this.viewData.rowData.employeeNumber +') ...!!' +"<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Request ID</b></td> <td>"+ this.viewData.rowData.deboardingRequestID +"</td></tr><tr class='trbg'><td><b>Module</b></td> <td> Deboarding </td></tr><tr><td><b>Owner Name</b></td> <td>"+  this.viewData.rowData.ownerName +" </td></tr></table>",
       
      //   }
      // };
        
      this.loaderService.setShowLoading(); 
      this.API.deboardECLCompletePost(_objModel).subscribe((response: any) => {
        this.loaderService.setDisableLoading();
        if (response.status == 'success') {
          this.dialogRef.close('true');
          this.snackBar.open('ECL Completed Successfully..!', 'Close', {
            duration: 3000,
          });
          let _sendMailObject = {
            featureCode:'MasterData-Approval-Process',
            to: this.getAllDeboardingDataObj?.vendorEmail +','+ this.getAllDeboardingDataObj?.resourceOwnerEmail,
            cc: this.getAllDeboardingDataObj?.completeEclMail  +','+ this.getAllDeboardingDataObj?.firstApproverEmail  +','+ this.getAllDeboardingDataObj?.signOffOwnerEmail,
           subject: 'ENRICO | Resource Deboarding | '+this.getAllDeboardingDataObj?.deboardingRequestID+ ' | Complete Exit Clearance',
            paraInTemplate: {
              teamName: this.getAllDeboardingDataObj?.vendorName +'  and  ' + this.getAllDeboardingDataObj?.firstName+' '+ this.getAllDeboardingDataObj?.lastName,
              mainText: "Exit process completed for <b>" +this.getAllDeboardingDataObj?.firstName+ "  " +this.getAllDeboardingDataObj?.lastName+"</b>.<br>Please check the status by clicking the link <a href="+this._getPathUrl+"/Resource-Management?data=de-boarding&getDeboardRequestID="+this.viewData.rowData.id+" target='_blank'><u>Link</u></a><br><br>" + "<style>.trbg{background: #eff1f2} .tclsTempTbl tr td{padding:4px;border:3px solid white} </style><table class='tclsTempTbl'  style='width:auto;border-collapse:collapse;line-height:12px;'><tr><td><b>Deboarding Request ID</b></td> <td>"+this.getAllDeboardingDataObj?.deboardingRequestID+"</td></tr><tr class='trbg'><td><b>Resource Number</b></td> <td> "+this.getAllDeboardingDataObj?.resourceNumber+" </td></tr><tr><td><b>NT ID</b></td> <td> "+this.getAllDeboardingDataObj?.ntidData+" </td></tr><tr class='trbg'><td><b>First Name</b></td> <td>"+this.getAllDeboardingDataObj?.firstName+"</td></tr><tr><td><b>Last Name</b></td> <td> "+this.getAllDeboardingDataObj?.lastName+" </td></tr><tr class='trbg'><td><b>Vendor SAP ID</b></td> <td>"+this.getAllDeboardingDataObj?.vendorSAPID+"</td></tr><tr><td><b>Vendor Name</b></td> <td> "+this.getAllDeboardingDataObj?.vendorName+" </td></tr><tr class='trbg'><td><b>Date of Joining</b></td> <td>"+this.getAllDeboardingDataObj?.dateofJoining+"</td></tr><tr><td><b>Exit Reason</b></td> <td> "+this.getAllDeboardingDataObj?.exitReason+" </td></tr><tr class='trbg'><td><b>Last Working Day</b></td> <td>"+this.getAllDeboardingDataObj?.lastWorkingDay+"</td></tr></table>"        
            }
          };  


          this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
       
            this.dialogRef.close();         
            });
          setTimeout(()=>{
            let navigationExtras: NavigationExtras = {
              queryParams: {
                "data": encodeURIComponent('de-boarding'),
              }
            };        
            this.router.navigate(["Resource-Management"], navigationExtras);        
            localStorage.removeItem('deBoardIDForStatus');
          },1000)
        }
      });
    }

 
  }

  files: any[] = [];

  onFileDropped(event: any) {
    this.prepareFilesList(event);
  }
  fileBrowseHandler(files: any) {
   
    let _files = files.target.files;
    this.prepareFilesList(_files);
  }

  deleteFile(index: number) {
    this.files.splice(index, 1);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.uploadFilesSimulator(0);
  }

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  restrictFirstSpace(event) {
    const textarea = event.target;
    if (textarea.value.length === 0 && event.key === ' ') {
        event.preventDefault();
    }
  }
}
