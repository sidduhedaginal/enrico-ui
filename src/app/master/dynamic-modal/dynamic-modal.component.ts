import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'lib-dynamic-modal',
  templateUrl: './dynamic-modal.component.html',
  styleUrls: ['./dynamic-modal.component.css'],
})

export class DynamicModalComponent implements OnInit {

  @Input('selectedMaster') selectedMaster!: string;
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() isVendorFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() isODCFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  @Output() vendorContacts : EventEmitter<any> = new EventEmitter<any>();
  formType: string = 'dynamic'
  menuId:number;
  existingContacts: any = []; 
  existingodcchild : any = []; 

  constructor(
    private dialogRef: MatDialogRef<DynamicModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.selectedMaster = data?.selectedMaster;
    this.formType = data?.component;
    this.menuId = data?.menuId;
    if(data.existingContacts != null) this.existingContacts = data.existingContacts;
    if(data.existingodcchild != null) this.existingodcchild = data.existingodcchild;
  }

  ngOnInit() {
    
  }

  onFormSubmitted(isFromSubmitted: boolean) {
    this.isFromSubmitted.emit(isFromSubmitted);
    this.isVendorFromSubmitted.emit(isFromSubmitted);
    this.isODCFromSubmitted.emit(isFromSubmitted);
    this.dialogRef.close(isFromSubmitted);
  }
  onVendorFormSubmitted(isVendorFromSubmitted: boolean) {
     this.isVendorFromSubmitted.emit(isVendorFromSubmitted);
    this.dialogRef.close(isVendorFromSubmitted);
  }
  onOdcFormSubmitted(isODCFromSubmitted: boolean) {
    this.isODCFromSubmitted.emit(isODCFromSubmitted);
   this.dialogRef.close(isODCFromSubmitted);
 }

  vendorContactReceived(params: any)
  {
    this.dialogRef.close(params);
  }
  oDCReceived(params: any)
  {
    this.dialogRef.close(params);
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
}
