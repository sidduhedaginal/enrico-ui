import { Component, OnInit ,Inject,EventEmitter, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaningService } from '../../services/planing.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import {PoshowsubmitComponent} from '../poshowsubmit/poshowsubmit.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-poplanning',
  templateUrl: './poplanning.component.html',
  styleUrls: ['./poplanning.component.css']
})

export class PoplanningComponent implements OnInit{

  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  myForm: FormGroup;
  apiResponseList : any = [];
  actualApiResponse : any = [];
  showLoading :boolean = false;
  receivedData : any;
  selectedObject : any;
  errorMessage = "";
  dueday : number;

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
  poData: [
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
  keyMappingForRequestBody = {

    location: 'location', 
    locationId : 'locationId',
    vendor: 'vendor',
    vendorID : 'vendorID',
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
    vendorID : 'vendorID',
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
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
 }

  ngOnInit() {
    this.receivedData = this.data;
    this.getAllPoNumbersAndOtherDetails();  
    const apiResponse = {
      "vendor": "Sample Vendor",
      "location": "Sample Location",
      "purchaseOrderNumber": "PO-001",
      "createdDate": "2023-08-03T12:00",
      "changedDate": "2023-08-03T14:00",
      "deliveryDate": "2023-08-10T10:00",
      "validityStart": "2023-08-11T00:00",
      "validityEnd": "2023-08-31T00:00",
      "fundCenter": "Sample Fund Center",
      "costCenter": "Sample Cost Center",
      "fund": "Sample Fund",
      "budgetCode": "Sample Budget Code",
      "currency": "USD",
      "poValue": "1000"
    };

    this.apiResponseList = [
      {
        "purchaseOrderNumber": "PO-001",
        "vendor": "Vendor 1",
        "location": "Location 1",
        "createdDate": "2023-08-03T12:00",
        "changedDate": "2023-08-03T14:00",
        "deliveryDate": "2023-08-10T10:00",
        "validityStart": "2023-08-11T00:00",
        "validityEnd": "2023-08-31T00:00",
        "fundCenter": "Sample Fund Center 1",
        "costCenter": "Sample Cost Center 1",
        "fund": "Sample Fund 1",
        "budgetCode": "Sample Budget Code 1",
        "currency": "USD",
        "poValue": "1000"
      },
      {
        "purchaseOrderNumber": "PO-002",
        "vendor": "Vendor 2",
        "location": "Location 2",
        "createdDate": "2023-08-05T12:00",
        "changedDate": "2023-08-05T14:00",
        "deliveryDate": "2023-08-15T10:00",
        "validityStart": "2023-08-16T00:00",
        "validityEnd": "2023-08-30T00:00",
        "fundCenter": "Sample Fund Center 2",
        "costCenter": "Sample Cost Center 2",
        "fund": "Sample Fund 2",
        "budgetCode": "Sample Budget Code 2",
        "currency": "EUR",
        "poValue": "1500"
      },
    ];

    this.myForm.get('purchaseOrderNumber')!.valueChanges.subscribe((value) => {
      this.selectedObject = this.actualApiResponse.find((obj:any) => obj.purchaseOrderNumber === value);
      
      
      if (this.selectedObject) {
        this.myForm.patchValue(this.selectedObject);
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

  constructor(
    private formBuilder: FormBuilder,
    private planningService:PlaningService,
    public dialogRef: MatDialogRef<PoplanningComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    ) {
    
    this.myForm = this.formBuilder.group({
      vendor: [{ value: '', disabled: true }],
      location: [{ value: '', disabled: true }],
      purchaseOrderNumber: ['', Validators.required],
      createdDate: [{ value: '', disabled: true }],
      changedDate: [{ value: '', disabled: true }],
      deliveryDate: [{ value: '', disabled: true }],
      validityStart: [{ value: '', disabled: true }],
      validityEnd: [{ value: '', disabled: true }],
      fundCenter: [{ value: '', disabled: true }],
      costCenter: [{ value: '', disabled: true }],
      fund: [{ value: '', disabled: true }],
      budgetCode: [{ value: '', disabled: true }],
      currency: [{ value: '', disabled: true }],
      poValue: [{ value: '', disabled: true }],
    });
  }

  submitForm(){
    const formValues = this.myForm.getRawValue();
    let missingValidation = [];
    if(this.receivedData['locationId'] != this.selectedObject['PlantId']){
      missingValidation.push("Location");
    }
    if( this.receivedData['vendorID'] != this.selectedObject['VendorId']){
      missingValidation.push("Vendor");
    }
    this.receivedData["poNumber"] = formValues["purchaseOrderNumber"];
    this.receivedData["vendorId"] = this.receivedData["vendorID"];
    this.receivedData["Location"] = this.receivedData["location"];
    this.attachPo(this.receivedData);
  }

  getPONumber(){
    const porequestBody = {
      vendorId: this.receivedData.vendorID,
      plantId: this.receivedData.locationId,
      fundCenterName: this.receivedData.organizationUnitName
    }
    this.planningService.getPONumber(porequestBody)
    .subscribe({
      next: (response:any) => {
        this.actualApiResponse = response.data.object;
        this.actualApiResponse = this.modifyKeysOfObjects(this.actualApiResponse, this.keyMapping);
        this.actualApiResponse = this.filterObjectsWithUniqueIds(this.actualApiResponse);
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
  });
  }

  attachPo(data :any){
  if(data.children.length != 0){
    for(let item of data.children){
      this.dueday = this.calculateDiff(item.validityStart,item.validityEnd);
    }
  }else{
    this.dueday = this.calculateDiff(this.selectedObject.validityStart,this.selectedObject.validityEnd);
  }

  if(this.dueday  <= 0){
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
        this.showSnackbar(e.status);
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      }
  });
    }else{
      this.errorMessage = "PO Validity Expired"
    }
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
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
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
  
    ];
    this.actualApiResponse = this.modifyKeysOfObjects(staticApiResponse, this.newKeyMapping);
  }
  
}


