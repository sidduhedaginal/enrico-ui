import { Component, OnInit ,Inject,EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaningService } from '../../services/planing.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {PoshowsubmitComponent} from '../poshowsubmit/poshowsubmit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';


@Component({
  selector: 'app-poplanningedit',
  templateUrl: './poplanningedit.component.html',
  styleUrls: ['./poplanningedit.component.css']
})
export class PoplanningeditComponent implements OnInit{
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  myForm: FormGroup;
  apiResponseList : any = [];
  actualApiResponse : any = [];
  showLoading :boolean = false;
  selectedObject :any = {};
  receivedData : any = [];
  errorMessage = "";
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
keyMappingForGridNew: any = {
  id : 'id',
  vendor : 'vendor',
  PlantName: 'location',
  poNumber: 'purchaseOrderNumber',
  createdDate: 'createdDate' ,
  changedDate : 'changedDate',
  deliveryDate : 'deliveryDate',
  validityStart : 'validityStart',
  validityEnd : 'validityEnd',
  fundCenter : 'fundCenter',
  costCenter : 'costCenter',
  fund : 'fund',
  budgetCode : 'budgetCode',
  currency : 'currency',
  poValue : 'poValue',
  fundCenterId : 'FundCenterId',
};


keyMapping: any = {
  VendorName: 'vendor',
  PlantName: 'location',
  PONumber: 'purchaseOrderNumber',
  CreatedOn: 'createdDate' ,
  ModifiedOn: 'changedDate' ,
  DeliveryDate : 'deliveryDate',
  ValidityStart : 'validityStart',
  ValidityEnd : 'validityEnd',
  FundCenterName : 'fundCenter',
  CostCenterName : 'costCenter',
  Fund : 'fund',
  BudgetCode : 'budgetCode',
  OrderCurrency : 'currency',
  PONetOrderValue : 'poValue',
};

  newKeyMapping: any = {
    vendorName: 'vendor',
    location: 'location',
    poNumber: 'purchaseOrderNumber',
    createdOn: 'createdDate' ,
    modifiedOn: 'changedDate' ,
    deliveryDate : 'deliveryDate',
    validityStart : 'validityStart',
    validityEnd : 'validityEnd',
    fundCenterName : 'fundCenter',
    costCenterName : 'costCenter',
    fund : 'fund',
    budgetCode : 'budgetCode',
    orderCurrency : 'currency',
    poValue : 'poValue',
    costCenterId : 'CostCenterId',
    fundCenterId : 'FundCenterId',
    locationId : 'PlantId',
    vendorId : 'VendorId',
    organizationUnitId : 'organizationUnitId'
  }

  keyMappingForRequestBody = {
    location: 'location', 
    locationId : 'locationId',
    vendor: 'vendor',
    vendorId : 'vendorId',
    organizationUnitId : 'organizationUnitId',
    organizationUnit : 'organizationUnit',
    id : 'id',
    parentid : 'parentid',
    purchaseOrderNumber : 'PONumber',
    createdDate: 'CreatedDate',
    changedDate : 'ChangedDate',
    deliveryDate : 'DeliveryDate',
    validityStart : 'ValidityStart',
    validityEnd : 'ValidityEnd',
    fundCenterId : 'FundCenterId',
    fundCenter : 'FundCenter',
    costCenterId : 'CostCenterId',
    costCenter : 'CostCenter',
    fund : 'Fund',
    budgetCode : 'BudgetCode',
    currency : 'Currency',
    poValue : 'POValue',
  };
  newKeyMappingForRequestBody = {
    location: 'location', 
    locationId : 'locationId',
    vendor: 'vendor',
    vendorId : 'vendorId',
    organizationUnitId : 'organizationUnitId',
    organizationUnit : 'organizationUnit',
    id : 'id',
    parentid : 'parentid',
    purchaseOrderNumber : 'poNumber',
    createdDate: 'createdDate',
    changedDate : 'changedDate',
    deliveryDate : 'deliveryDate',
    validityStart : 'validityStart',
    validityEnd : 'validityEnd',
    fundCenterId : 'fundCenterId',
    fundCenter : 'fundCenter',
    costCenterId : 'costCenterId',
    costCenter : 'costCenter',
    fund : 'fund',
    budgetCode : 'budgetCode',
    currency : 'currency',
    poValue : 'poValue',
  };
  duedays : number;
  constructor(
    private formBuilder: FormBuilder, 
    private planningService:PlaningService,
    public dialogRef: MatDialogRef<PoplanningeditComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    ) {
    this.myForm = this.formBuilder.group({
      vendor: [{ value: '', disabled: true }, Validators.required],
      location: [{ value: '', disabled: true }, Validators.required],
      purchaseOrderNumber: ['', Validators.required],
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

  ngOnInit() {
    this.receivedData = this.data;
    this.duedays = this.calculateDiff(this.receivedData.validityStart,this.receivedData.validityEnd);
    const tempData = [];
    tempData.push(this.data);
    this.receivedData = this.modifyKeysOfObjects(tempData,this.keyMappingForGrid)[0];
    this.getAllPoNumbersAndOtherDetails();
    this.data["purchaseOrderNumber"] = this.data["poNumber"];     
    this.myForm.get('purchaseOrderNumber')!.valueChanges.subscribe((value) => {
      this.selectedObject = this.actualApiResponse.find((obj:any) => obj.purchaseOrderNumber === value);
      if (this.selectedObject && this.receivedData["purchaseOrderNumber"] !== this.selectedObject["purchaseOrderNumber"] ) {
        // Patch the form with the selected object's values
        this.myForm.patchValue(this.selectedObject);
      }
      else if(this.selectedObject && this.receivedData["purchaseOrderNumber"] === this.selectedObject["purchaseOrderNumber"]){
        this.myForm.patchValue(this.receivedData);
      }
    });
  }
  calculateDiff(startdate:any,enddate:any){
    let todayDate = new Date(startdate);
    let sentOnDate = new Date(enddate);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
    return differenceInDays;
}

  submitForm(){   
    let missingValidation = [];
    if(this.receivedData['locationId'] != this.selectedObject['PlantId']){
      missingValidation.push("Location");
    }
    if( this.receivedData['vendorID'] != this.selectedObject['VendorId']){
      missingValidation.push("Vendor");
    }
    if(missingValidation.length > 0) {
      let content = '';
      for(let index = 0; index < missingValidation.length; index++){
        if(index != 0) content += " and ";
        content += missingValidation[index];
      }
      this.errorMessage = `Error!! ${content} does not match the selected PO Plan`; 
      return;
    }
    const formValues = this.myForm.getRawValue();
    this.receivedData["poNumber"] = formValues["purchaseOrderNumber"];
    this.attachPo(this.receivedData);
    return;

    formValues["costCenterId"] = this.selectedObject["CostCenterId"];
    formValues["fundCenterId"] = this.selectedObject["FundCenterId"];
    // formValues ["locationId"] = this.selectedObject["locationId"];
    formValues ["locationId"] = this.selectedObject["PlantId"];
    formValues ["vendorId"] = this.selectedObject["VendorId"];

    formValues ["organizationUnitId"] =  this.receivedData["organizationUnitId"];
    formValues ["organizationUnit"]  = this.receivedData["organizationUnit"];     
    formValues ["id"] = this.receivedData["id"];
    formValues["parentId"] = this.receivedData["parentId"];
    let updatedFormKeys = [];
    updatedFormKeys.push(formValues);
    updatedFormKeys = this.modifyKeysOfObjects(updatedFormKeys,this.newKeyMappingForRequestBody);
    this.openPopup(JSON.stringify(updatedFormKeys[0]));
    
  }

  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }

  openPopup(data: string): void {
    this.dialog.open(PoshowsubmitComponent, {
      data: data,
      width: '70%',
      height: '70%',
    });
  }

  getAllPoNumbersAndOtherDetails(){
     this.loaderService.setShowLoading();
    const porequestBody = {
      vendorId: this.receivedData.vendorID,
      plantId: this.receivedData.locationId,
      fundCenterName: this.receivedData.organizationUnitName
    }
    this.planningService.getAllPoNumbersAndOtherDetails(porequestBody)
    .subscribe({
      next: (response:any) => {
        this.actualApiResponse = response.data;
        this.actualApiResponse = this.modifyKeysOfObjects(this.actualApiResponse, this.newKeyMapping);
        this.myForm.patchValue(this.receivedData);
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      }
  });
  }

  getPONumber(){
    const porequestBody = {
      "vendorId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "plantId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "fundCenterId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
    this.planningService.getPONumber(porequestBody)
    .subscribe({
      next: (response:any) => {
        this.actualApiResponse = response.data.object;
        this.actualApiResponse = this.modifyKeysOfObjects(this.actualApiResponse, this.keyMapping);
        this.actualApiResponse = this.filterObjectsWithUniqueIds(this.actualApiResponse);
        this.selectedObject = this.actualApiResponse.find((obj :any ) => obj.purchaseOrderNumber === this.receivedData["purchaseOrderNumber"]); 
        this.myForm.patchValue(this.receivedData);
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
  });
  }

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

  filterObjectsWithUniqueIds(objects: { [key: string]: any }[]): { [key: string]: any }[] {
    const seenIds = new Set();
    const uniqueObjects: { [key: string]: any }[] = [];
  
    for (const obj of objects) {
      const idValue: string = obj.purchaseOrderNumber;
      if (!seenIds.has(idValue)) {
        seenIds.add(idValue);
        uniqueObjects.push(obj);
      }
    }
  
    return uniqueObjects;
  }

  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  getStaticData(){

    const staticApiResponse = [
      {
        "poNumber": "test1234",
        "vendorId": "d9474d3e-0478-4c7e-b1cf-5dc3c4bbfd6f",
        "vendorName": "HCL",
        "locationId": "a0a338e3-ae8b-4090-97a5-856ea3c4703a",
        "location": "Plant1Bosch",
        "createdOn": null,
        "modifiedOn": null,
        "deliveryDate": "2023-08-16T18:30:00",
        "validityStart": "2023-08-01T00:00:00",
        "validityEnd": "2023-08-31T00:00:00",
        "fundCenterId": "070e880e-427c-47d9-bee9-e3007d0d9bb2",
        "fundCenterName": "1",
        "costCenterId": "4bb769f8-786f-4107-8fbb-3f14c2018509",
        "costCenterName": "t",
        "fund": "12",
        "budgetCode": "",
        "orderCurrency": "inr",
        "poValue": "1987.000000"
      },
  
    ]
    const staticApiResponseNew = [
      {
        "poNumber": "test",
        "vendorId": "64cefb0b-2229-4d66-889a-f9edbdff2712",
        "vendorName": "saaf",
        "locationId": "44ad2432-aa90-48c5-9e33-0eb7c0543bf6",
        "location": "Kor",
        "createdOn": null,
        "modifiedOn": null,
        "deliveryDate": "2023-08-16T18:30:00",
        "validityStart": "2023-08-01T00:00:00",
        "validityEnd": "2023-08-31T00:00:00",
        "fundCenterId": "44ec4af8-7627-4fda-922e-844a07ccd366",
        "fundCenterName": "Koramangala",
        "costCenterId": "51fbf9a3-1822-445d-b0e2-162e11e5f952",
        "costCenterName": "t",
        "fund": "12",
        "budgetCode": "123",
        "orderCurrency": "inr",
        "poValue": "1987.000000"
      },
      {
        "poNumber": "test1234",
        "vendorId": "ffcefb0b-2229-4d66-889a-f9edbdff2712",
        "vendorName": "zzz",
        "locationId": "ffad2432-aa90-48c5-9e33-0eb7c0543bf6",
        "location": "zzz",
        "createdOn": null,
        "modifiedOn": null,
        "deliveryDate": "2023-08-16T18:30:00",
        "validityStart": "2023-08-01T00:00:00",
        "validityEnd": "2023-08-31T00:00:00",
        "fundCenterId": "ffec4af8-7627-4fda-922e-844a07ccd366",
        "fundCenterName": "zzzz",
        "costCenterId": "fffbf9a3-1822-445d-b0e2-162e11e5f952",
        "costCenterName": "t",
        "fund": "12",
        "budgetCode": "123",
        "orderCurrency": "inr",
        "poValue": "1987.000000"
      },
  
    ]
    this.actualApiResponse = this.modifyKeysOfObjects(staticApiResponseNew, this.newKeyMapping);
    this.selectedObject = this.actualApiResponse.find((obj :any ) => obj.purchaseOrderNumber === this.receivedData["purchaseOrderNumber"]);
    this.myForm.patchValue(this.receivedData);    
  }


  attachPo(data :any){
     this.loaderService.setShowLoading();
    this.planningService.attachPo(data)
    .subscribe({
      next: (response:any) => {
        this.showSnackbar(response.status);
        this.isFromSubmitted.emit(true);
        if(response.data!=null)      
        this.dialogRef.close();
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
        this.showSnackbar(e.status);
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      }
  });
  }
}