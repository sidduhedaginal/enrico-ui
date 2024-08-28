import { Component, OnInit ,Inject,EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaningService } from '../../services/planing.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-po-view-only',
  templateUrl: './po-view-only.component.html',
  styleUrls: ['./po-view-only.component.css']
})
export class PoViewOnlyComponent implements OnInit {

  myForm: FormGroup;
  receivedData : any = [];

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  ngOnInit(): void {

    this.receivedData = this.data;
    const tempData = [];
    tempData.push(this.data);
    this.receivedData = this.modifyKeysOfObjects(tempData,this.keyMappingForGrid)[0];
    this.myForm.patchValue(this.receivedData);
      
  }

  keyMappingForGrid: any = {
    vendor : 'vendor',
    PlantName: 'location',
    poNumber : 'purchaseOrderNumber',
    CreatedDate: 'createdDate' ,
    ChangedDate : 'changedDate',
    DeliveryDate : 'deliveryDate',
    ValidityStart : 'validityStart',
    ValidityEnd : 'validityEnd',
    FundCenter : 'fundCenter',
    CostCenter : 'costCenter',
    Fund : 'fund',
    BudgetCode : 'budgetCode',
    Currency : 'currency',
    POValue : 'poValue',
    fundCenterId : 'FundCenterId'
  };
  modifyKeysOfObjects(objList: object[], keyMapping: { [oldKey: string]: string }): object[] {
    return objList.map((obj) => {
      const modifiedObj: object = {};
      for (const oldKey in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, oldKey)) {
          const newKey = keyMapping[oldKey] || oldKey;
          (modifiedObj as any) [newKey]  = (obj as any) [oldKey];
        }
      }
      return modifiedObj;
    });
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }


  submitForm(){

  }

  constructor(
    private formBuilder: FormBuilder, 
    private planningService:PlaningService,
    public dialogRef: MatDialogRef<PoViewOnlyComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    ) {
    
    this.myForm = this.formBuilder.group({
      vendor: [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      purchaseOrderNumber: [{ value : '', disabled : true}, Validators.required],
      createdDate: [{ value: '', disabled: true }, Validators.required],
      changedDate: [{ value: '', disabled: true }, Validators.required],
      deliveryDate: [{ value: '', disabled: true }, Validators.required],
      validityStart: [{ value: '', disabled: true }, Validators.required],
      validityEnd: [{ value: '', disabled: true }, Validators.required],
      fundCenter: [{ value: '', disabled: true }, Validators.required],
      costCenter: [{ value: '', disabled: true }, Validators.required],
      fund: [{ value: '', disabled: true }, Validators.required],
      budgetCode: [{ value: '', disabled: true }, Validators.required],
      currency: [{ value: '', disabled: true }, Validators.required],
      poValue: [{ value: '', disabled: true }, Validators.required],
    });

  }

}
