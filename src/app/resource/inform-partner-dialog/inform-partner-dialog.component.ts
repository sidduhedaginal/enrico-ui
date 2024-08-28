import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ApiResourceService } from '../api-resource.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-inform-partner-dialog',
  templateUrl: './inform-partner-dialog.component.html',
  styleUrls: ['./inform-partner-dialog.component.css']
})
export class InformPartnerDialogComponent implements OnInit {
  viewData: any;
  _listDataDDL: any={};
  customerList: any=[];
  selectedUser: any = '';
  filterdOptions: any = [];

  requestTypeInformPartnerModel:any="";
  informPartnerRemarksModel:any="";
  constructor(public dialogRef: MatDialogRef<InformPartnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public _Data: any,private API: ApiResourceService,private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.viewData = this._Data;
  }
  cancleBtn() {
    this.dialogRef.close();
  }
  closeBtn() {
    this.dialogRef.close();
  }
  submitBtn() {
    let _reqtype=this.requestTypeInformPartnerModel;
    let _remarks=this.informPartnerRemarksModel;

    if(_reqtype=='' || _reqtype==undefined || _reqtype==null){
      this.snackBar.open("Please select request type", 'Close', {
        duration: 3000,
      });
      return;
    }
    if(_remarks=='' || _remarks==undefined || _remarks==null){
      this.snackBar.open("Please enter remarks", 'Close', {
        duration: 3000,
      });
      return;
    }

    let _sendMailObject = {
   
      featureCode:'MasterData-Approval-Process',
      to: this.viewData?.vendorEmail,
      cc: this.viewData?.firstApproverMailId + ','+ this.viewData?.sectionSpocEmail,
      paraInTemplate: {
        teamName: _reqtype + ' Team',
        mainText: _remarks,
       
      }
    };
    this.API.sendMailinitiateDeboardPost(_sendMailObject).subscribe((response: any) => {
      this.snackBar.open("Inform Partner send to mail Created Successfully...!", 'Close', {
        duration: 3000,
      });
      this.dialogRef.close();         
      } );
  
   }
   restrictFirstSpace(event) {
    const textarea = event.target;
    if (textarea.value.length === 0 && event.key === ' ') {
        event.preventDefault();
    }
  }
 
}

