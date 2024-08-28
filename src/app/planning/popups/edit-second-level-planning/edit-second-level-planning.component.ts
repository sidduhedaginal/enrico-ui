import { Component, EventEmitter, HostListener, Inject, Output } from '@angular/core';
import {MAT_DIALOG_DATA,MatDialog,MatDialogRef,} from '@angular/material/dialog';
import {CellClassParams,ColDef,EditableCallbackParams,GridApi,GridReadyEvent,} from 'ag-grid-community';
import { PlaningService } from '../../services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-edit-second-level-planning',
  templateUrl: './edit-second-level-planning.component.html',
  styleUrls: ['./edit-second-level-planning.component.css'],
})
export class EditSEcondLevelPlanningComponent {
  myForm!: FormGroup;
  decimalPattern = '^[0-9]+(.[0-9]{1,2})?$';
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  resourceRate: any = {};
  SKILL: any;
  SKILLSET: any;
  GB: any;
  LOCATION: any;
  LOCATIONMODE: any;
  GRADE: any;
  VENDOR: any;
  ResourcerateReponse: any = [];
  gradePrice: number = 0;
  negativeEquivalent : boolean;
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(
    false
  );
  public columnDefs: ColDef[] = [
    {
      field: 'group',
      resizable: true,
      hide: false,
      suppressMenu: true,
      colId: '-3',
    },
    { field: 'id', hide: true, colId: '-2' },
    {
      field: 'jan',
      minWidth: 80,
      colId: '0',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'feb',
      minWidth: 80,
      colId: '1',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'mar',
      minWidth: 80,
      colId: '2',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'apr',
      minWidth: 80,
      colId: '3',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'may',
      minWidth: 80,
      colId: '4',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'jun',
      minWidth: 80,
      colId: '5',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'jul',
      minWidth: 80,
      colId: '6',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'aug',
      minWidth: 80,
      colId: '7',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'sep',
      minWidth: 80,
      colId: '8',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'oct',
      minWidth: 80,
      colId: '9',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'nov',
      minWidth: 80,
      colId: '10',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'dec',
      minWidth: 80,
      colId: '11',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer: this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'total',
      minWidth: 80,
      colId: '-1',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      suppressMenu: true,
      resizable: true,
    },
  ];
  issaveEnabled: boolean = false;
  columnApi: any;
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  overlayNoRowsTemplate = '<span></span>';
  public defaultColDef: ColDef = {
    sortable: false,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 2,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
    suppressMovable:true
  };

  valueToUpdate: number;
  public rowData: any = [];
  aopId: any;
  aopflId: any;
  aopslId: any;
  receivedData: any;
  startDateMonth: any;
  fileData!: string;
  EventFile: any;
  base64Output: any;
  File: any = [];
  FileRowdata: any;
  filteredMSBE: string[] = ['MSBE1', 'MSBE2', 'MSBE3', 'MSBE4'];
  selectedMSBE: string[] = [];
  selectedOrgLevel: string = '';
  toppingList: any = [];
  private gridApi!: GridApi;
  orgLevelSelect: any;
  equivalentCapacity = {};
  previousMonth: string = '';
  prevEquivalentCapacity = {};
  stayScrolledToEnd = true;
  skillSet :any =  [];
  locationMode :any = [];
  grade :any = [];
  gb :any = [] ;
  vendors :any = [] ;
  skillSetType :any = [];
  location :any = [];
  vkmPrice : number = 0 ;
  ValueIn : number ;
  buName : string;
  endingNumber :number;
  selectedMonth : string;
  editedmonthId : number;
  EnteredValue : number;
  NewEditMonthid : number;
  selectedNextMonth : string;
  SupplyTotal : number;
  companycode:  string;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditSEcondLevelPlanningComponent>,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private planningservice: PlaningService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.receivedData = this.data.message;
    this.companycode = this.data.companycode;
   this.rowData = this.receivedData.children;
  }

  ngOnInit(): void {
    this.getResourceFilters();
    this.myForm = this.makeForm();
    this.myForm.get('skillSetType')?.disable();
    this.myForm.get('gradePrice')?.disable();
    this.buName = this.data.buName;
    if (this.receivedData.valueIn == 'Thousand') {
      this.ValueIn = 1000;
    } else if (this.receivedData.valueIn == 'Lakh') {
      this.ValueIn = 100000;
    } else if (this.receivedData.valueIn == 'Million') {
      this.ValueIn = 1000000;
    }
    this.vkmPrice = this.receivedData.vkM_Price;
    this.endingNumber = this.receivedData.ending_Number;
  }
  makeForm() {
    return this.formBuilder.group({
      skillsetId: ['', Validators.required],
      gradeId: ['', Validators.required],
      locationId: ['', Validators.required],
      gbId: ['', Validators.required],
      locationModeId: ['', Validators.required],
      vendorID: ['', Validators.required],
      vkmPrice: [this.receivedData.vkM_Price, Validators.required],
      skillSetType: [''],
    });
  }
  getResourceFilters() {
    this.loaderService.setShowLoading();
    this.planningservice
      .getResourceFilters(this.receivedData.companyId)
      .subscribe({
        next: (res: any) => {
          this.skillSet = res.data.skillSet;
          this.locationMode = res.data.locationMode;
          this.grade = res.data.grade;
          this.gb = res.data.gb;
          this.vendors = res.data.vendors;
          this.skillSetType = res.data.skillSetType;
          this.location = res.data.location;
          this.setForm();
          this.loaderService.setDisableLoading();
        },
        error: (e: any) => {
          this.loaderService.setDisableLoading();
        },
        complete: () => {},
      });
  }
  setForm(){
    if(this.receivedData.isImported == true){
      this.myForm.get('skillsetId')?.disable();
      this.myForm.get('gradeId')?.disable();
      this.myForm.get('skillSetType')?.disable();
      this.myForm.get('locationId')?.disable();
      this.myForm.get('gbId')?.disable();
      this.myForm.get('locationModeId')?.disable();
      this.myForm.get('vendorID')?.disable();
    } else if (this.receivedData.isImported == false) {
      this.myForm.enable();
      this.myForm.get('skillsetId')?.disable();
      this.myForm.get('gradeId')?.disable();
      this.myForm.get('skillSetType')?.disable();
      this.myForm.get('locationId')?.disable();
      this.myForm.get('gbId')?.disable();
      this.myForm.get('locationModeId')?.disable();
      this.myForm.get('vendorID')?.disable();
      this.myForm.get('skillSetType')?.disable();
    }
    this.myForm.get('skillsetId')?.setValue(this.receivedData.skillsetId);
    this.myForm.get('gradeId')?.setValue(this.receivedData.gradeId);
    this.myForm.get('skillSetType')?.setValue(this.receivedData.skillsetType);
    this.myForm.get('locationId')?.setValue(this.receivedData.locationId);
    this.myForm.get('gbId')?.setValue(this.receivedData.gbId);
    this.myForm
      .get('locationModeId')
      ?.setValue(this.receivedData.locationModeId.toString());
    this.myForm.get('vendorID')?.setValue(this.receivedData.vendorID);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.refreshCells({ force: true });
    this.gridApi.setDomLayout('autoHeight');
    this.gridApi.hideOverlay();
    if (
      this.rowData == null ||
      this.rowData == undefined ||
      this.rowData.length <= 0
    )
      this.gridApi.showNoRowsOverlay();
    this.gridApi.addEventListener(
      'bodyScroll',
      this.onHorizontalScroll.bind(this)
    );
    this.gridApi.hideOverlay();
    this.adjustWidth();
    this.gridApi.setRowData(this.receivedData.children);
    this.adjustWidth();
    this.rowData = this.receivedData.children;
    this.totalCalculation();
    this.SupplyPlanninTotal();
  }
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
  } 
  onFirstDataRendered(event: any) {
    this.adjustWidth();
  }

  closeDialog() {
    this.dialogRef.close();
    this.isFromSubmitted.emit(false);
  }

  customEditableFunction(params: any): boolean {
    const nonNumericFields = ['group']; // Add field names that should not be editable
    return (
      params.node.rowIndex === 0 &&
      !nonNumericFields.includes(params.colDef.field) &&
      parseInt(params.colDef.colId) >= this.receivedData.startMonth
    );
  }
  customCellRenderer(params) {
    // params.colDef.cellStyle = {textalign: 'center'}
    const cellValue = params.value; // Get the cell's value
    const rowIndex = params.node.rowIndex; // Get the row index
    // Check if it's the first row and apply styling
    if (
      rowIndex === 0 &&
      parseInt(params.colDef.colId) >= this.receivedData.startMonth
    ) {
      // return `<div style="background-color: red;">${cellValue}</div>`;
      return `<div class="custom-cell">${cellValue}</div>`;
    } else {
      return cellValue.toString();
    }
  }

  totalCalculation() {
    for (const row of this.rowData) {
      let rowTotal = 0;
      for (const month in row) {
        if (month !== 'group' && month !== 'total' && month != 'id') {
          const monthValue = Number((row as any)[month]);
          if (!isNaN(monthValue)) {
            rowTotal += monthValue;
          }
        }
      }
      row.total = rowTotal.toFixed(3);
    }
  }
  Monthlist = [
    {mon:"jan",value:0},
    {mon:"feb",value:1},
    {mon:"mar",value:2},
    {mon:"apr",value:3},
    {mon:"may",value:4},
    {mon:"jun",value:5},
    {mon:"jul",value:6},
    {mon:"aug",value:7},
    {mon:"sep",value:8},
    {mon:"oct",value:9},
    {mon:"nov",value:10},
    {mon:"dec",value:11},
  ]

  updateCalculation() { 
    if(this.companycode == '38F0'){
      this.selectedNextMonth = '';
      this.previousMonth = '';
      if(this.editedmonthId != 11){  
        for(var i = this.editedmonthId; i<= 11 ;i++ ){ //Generating new loop from edited month
          for(let month of this.Monthlist){
            if(i == month.value){
              for (let key  of Object.keys(this.rowData[1])) {
              if(key == month.mon){
                if(this.selectedNextMonth != key){                     //avoid cal if edited +next month comes again in the loop
                  let newValue = (this.rowData[0] as any)[key];        //get the new value
                  if(this.selectedMonth == key){  
                    if(newValue == this.EnteredValue){                 //checking the values entered
                      this.NewEditMonthid = this.editedmonthId + 1 ;   //incrementing the month
                      for(let month of this.Monthlist){
                          if(this.NewEditMonthid == month.value){
                            this.selectedNextMonth = month.mon;        //getting the next month
                            break;
                          }
                          if(this.NewEditMonthid == 12){
                            break;
                          }
                      }
                      key = this.selectedNextMonth;
                    }
        
                  }
        
          
                  if (key == 'jan'){
                    this.valueToUpdate =  this.receivedData.endingNumber;
                  }
                  if (key != 'group' && key != 'parentid' && key != 'total' && key != 'jan'){
                    if(this.previousMonth == ''){
                      for(let month of this.Monthlist){                  //calculating Previous Monthid
                        if(key != 'jan'){
                          if(key === month.mon){
                            var previousId = month.value - 1;
                            break;
                          }
                        }else{
                          break;
                        }
              
                      }                                                     //end
                      if(previousId >= 0){
                        for(let month of this.Monthlist){                  //Calculating previous month
                          if(previousId == month.value){ 
                            this.previousMonth = month.mon;
                            break;
                          }
                        }
                      }
                      var PrivousMonthvalue = Number((this.rowData[1] as any)[this.previousMonth]);
                    }else{
                      var PrivousMonthvalue = Number((this.rowData[1] as any)[this.previousMonth]);
                    }
                    var supplyvalue = Number((this.rowData[0] as any)[this.previousMonth]);
                    this.valueToUpdate = Number(supplyvalue) + Number(PrivousMonthvalue);  
                  }     
                  if (key != 'group' && key != 'parentid' && key != 'total') {
                    (this.rowData[1] as any)[key] = this.valueToUpdate;
                    (this.rowData[2] as any)[key] = (((this.rowData[1] as any)[key] * this.receivedData.price)/this.ValueIn).toFixed(3);      
                  }
                  // if(key == 'jan'){
                    this.previousMonth = key;
                  // }
                
                }
                this.gridApi.setRowData(this.rowData);
                
              }else{
                //Dont calculate                
              }

            }

          }
          }
        }
      }
    } 
    else{
     for (let key of Object.keys(this.rowData[1])) {
      let newValue = (this.rowData[0] as any)[key];
      if (key == 'jan')
        this.valueToUpdate = Number(newValue) + this.endingNumber;
      if (key != 'group' && key != 'id' && key != 'total' && key != 'jan')
        this.valueToUpdate =
          Number(newValue) +
          Number((this.rowData[1] as any)[this.previousMonth]);
      if (key != 'group' && key != 'id' && key != 'total') {
        (this.rowData[1] as any)[key] = this.valueToUpdate;
        (this.rowData[2] as any)[key] = (
          ((this.rowData[1] as any)[key] * this.receivedData.price) /
          this.ValueIn
        ).toFixed(3);
      }
      this.previousMonth = key;
    }
    this.gridApi.setRowData(this.rowData);
    this.adjustWidth();
    }
  }

  onCellValueChanged(params: any) {
    const { node, colDef, newValue,oldValue } = params;
    if(this.companycode == '38F0'){
      this.editedmonthId = parseInt(colDef.colId);
      this.NewEditMonthid = this.editedmonthId + 1 ;
      for(let month of this.Monthlist){
          if(this.editedmonthId == month.value){
            this.selectedMonth = month.mon;
            break;
          }
          if(this.NewEditMonthid == 12){
            break;
          }
      }
    }
    this.EnteredValue = newValue;    
    const validInputRegex = /^(0|[+\-]?[0-9]\d*)$/;
    if (!validInputRegex.test(newValue)) {
      this.showSnackbar(`Invalid supply planning value '${newValue}'`);
      this.rowData[0][this.selectedMonth]=oldValue;
      this.gridApi.setRowData(this.rowData);
      return;
    }
    this.equivalentCapacity = this.rowData[1];
    this.updateCalculation();
    this.totalCalculation();
    this.SupplyPlanninTotal();
    this.onVKMPriceChange(this.myForm.get('vkmPrice').value);
    this.gridApi.setRowData(this.rowData);
    this.adjustWidth();
    this.issaveEnabled = false;
    return;
  }
  onInput(event: any) {
    // Get the input value from the event
    const inputValue: string = event.target.value;

    // Regular expression to match only integers
    const integerRegex: RegExp = /^[+-]?\d*$/;

    // Check if the input value matches the integer regex
    if (!integerRegex.test(inputValue)) {
      // Remove non-integer characters from the input
      const sanitizedInput: string = inputValue.replace(/[^+-\d]/g, '');

      // Update the input value
      event.target.value = sanitizedInput;
    }

    // Update other logic (e.g., enabling/disabling save)

    this.issaveEnabled = true;
  }
  OnEndingNumberChange(event: any) {
    this.endingNumber = parseFloat(event.target.value);
    this.updateEquivalentCapacity(this.endingNumber);
  }
  EndingNumberCal(endingnumber: number) {
    const newendingnumber = endingnumber;
    for (const obj of this.rowData) {
      if (obj.group === 'Projected Revenue') {
        for (let key of Object.keys(obj)) {
          if (key != 'id' && key != 'group') {
            (obj as any)[key] = newendingnumber + (this.rowData[1] as any)[key];
          }
        }
      }
    }
    this.gridApi.setRowData(this.rowData);
    this.adjustWidth();
  }
  OnVKMChange(event:any){
    this.vkmPrice = this.myForm.get('vkmPrice').value ;
    this.onVKMPriceChange(this.myForm.get('vkmPrice').value);
    
  }
  OnSkillchange(event: any) {
    this.receivedData.skillsetId = event.value;
    if (
      this.receivedData.skillsetId &&
      this.receivedData.gradeId &&
      this.receivedData.locationModeId &&
      this.receivedData.vendorID
    ) {
      this.getResourceRate();
    } else {
      this.resourceRate.skillsetId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.gradeId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = '00000000-0000-0000-0000-000000000000';
    }
  }
  OnGradechange(event: any) {
    this.receivedData.gradeId = event.value;
    if (
      this.receivedData.skillsetId &&
      this.receivedData.gradeId &&
      this.receivedData.locationModeId &&
      this.receivedData.vendorID
    ) {
      this.getResourceRate();
    } else {
      this.resourceRate.skillsetId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.gradeId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = '00000000-0000-0000-0000-000000000000';
    }
  }
  OnLocationmodechange(event: any) {
    this.receivedData.locationModeId = event.value;
    if (
      this.receivedData.skillsetId &&
      this.receivedData.gradeId &&
      this.receivedData.locationModeId &&
      this.receivedData.vendorID
    ) {
      this.getResourceRate();
    } else {
      this.resourceRate.skillsetId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.gradeId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = '00000000-0000-0000-0000-000000000000';
    }
  }
  OnVendorchange(event: any) {
    this.receivedData.vendorID = event.value;
    if (
      this.receivedData.skillsetId &&
      this.receivedData.gradeId &&
      this.receivedData.locationModeId &&
      this.receivedData.vendorID
    ) {
      this.getResourceRate();
    } else {
      this.resourceRate.skillsetId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.gradeId = '00000000-0000-0000-0000-000000000000';
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = '00000000-0000-0000-0000-000000000000';
    }
  }
  getResourceRate() {
    this.loaderService.setShowLoading();
    this.resourceRate.skillsetId = this.receivedData.skillsetId;
    this.resourceRate.gradeId = this.receivedData.gradeId;
    this.resourceRate.locationModeId = this.receivedData.locationModeId;
    this.resourceRate.companyId = this.receivedData.companyId;
    this.resourceRate.vendorId = this.receivedData.vendorID;
    this.resourceRate.buName = this.buName;

    // if(this.SKILLSET == 'Rate Card'){
    //   resourceRate.isRateCard = true;
    // }else{
    //   resourceRate.isRateCard = false;
    // }
    this.planningservice.getResourceRate(this.resourceRate).subscribe({
      next: (res: any) => {
        this.ResourcerateReponse = res;
        this.myForm
          .get('skillSetType')
          ?.setValue(this.ResourcerateReponse.skillType);
        this.receivedData.price = this.ResourcerateReponse.gradePrice;
        this.gradePrice = res.gradePrice;
        this.updateProjectedPO();
        this.loaderService.setDisableLoading();
        if(this.gradePrice == 0){
          this.myForm.get('skillSetType').reset();
          this.gradePrice = 0;
          this.errorMessage = 'Error!! Standard cost value does not exists. ';
          this.showErroMessage = true;
        }else{
          this.errorMessage = '';
          this.showErroMessage = false;
        }
        this.adjustWidth();
      },
      error: (e: any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {},
    });
  }

  onVKMPriceChange(event: any) {
    const newVKMPrice = event;
    for (const obj of this.rowData) {
      if (obj.group === 'Projected Revenue') {
        for (let key of Object.keys(obj)) {
          if (key != 'id' && key != 'group') {
            (obj as any)[key] = (
              (newVKMPrice * (this.rowData[1] as any)[key]) /
              this.ValueIn
            ).toFixed(3);
          }
        }
      }
    }
    this.gridApi.setRowData(this.rowData);
    this.adjustWidth();
  }
  updateEquivalentCapacity(endingnumber: number) {
    const newendingnumber = endingnumber;
    for (const obj of this.rowData) {
      if (obj.group === 'Equivalent Capacity') {
        for (let key of Object.keys(obj)) {
          if (key != 'id' && key != 'group') {
            (obj as any)[key] = newendingnumber;
          }
        }
      }
    }
    this.gridApi.setRowData(this.rowData);
    this.updateCalculation();
    this.totalCalculation();
    this.onVKMPriceChange(this.myForm.get('vkmPrice').value);
    this.gridApi.setRowData(this.rowData);
    this.adjustWidth();
  }
  updateProjectedPO() {
    for (let key of Object.keys(this.rowData[2])) {
      if (key != 'parentid' && key != 'group') {
        (this.rowData[2] as any)[key] = (((this.rowData[1] as any)[key] * this.receivedData.price)/this.ValueIn).toFixed(3);
      }
    }
    this.gridApi.setRowData(this.rowData);
  }

  SupplyPlanninTotal(){
    let rowTotal = 0;
    for (const month in this.rowData[0]) {
      if (month !== 'group' && month !== 'total' && month != 'parentid') {
        const monthValue = Number((this.rowData[0] as any)[month]);
        if (!isNaN(monthValue)) {
          rowTotal += monthValue;
        }
      }
    }
    this.rowData[0].total = rowTotal + this.endingNumber;  //Fix here
    this.SupplyTotal = rowTotal + this.endingNumber;   
    this.gridApi.setRowData(this.rowData);
  }
  checkEquivalentCapacity(){
    this.negativeEquivalent = false;
    for (const month in this.rowData[1]) {
      if (month !== 'group' && month !== 'total' && month != 'parentid') {
        const monthValue = Number((this.rowData[1] as any)[month]);
        if (!isNaN(monthValue)) {
          if(monthValue < 0){
            this.negativeEquivalent = true;
            break;
          }
        }
      }
    }
  }
  onSave() {
    this.SupplyPlanninTotal();
    this.checkEquivalentCapacity();    
    if(this.SupplyTotal < 0){
      this.showSnackbar(`Total Supply Planning should not be less than zero`);
    }
    else if(this.negativeEquivalent == true){
      this.showSnackbar(`Equivalent Capacity should not be less than zero`);
    }
    else{
      const formValues = this.myForm.value;
      formValues['childData'] = this.rowData;
      formValues.price = Number(this.receivedData.price);
      formValues.vendor = this.receivedData.vendor;
      formValues.skillset = this.receivedData.skillset;
      formValues.locationMode = this.receivedData.locationMode;
      formValues.location = this.receivedData.location;
      formValues.grade = this.receivedData.grade;
      formValues.gb = this.receivedData.gb;
      formValues.isImported = this.receivedData.isImported ;
      formValues.vkmPrice = this.myForm.get('vkmPrice').value;
      formValues.endingNumber = this.endingNumber;
      formValues.rateCardPrice = 0;
      formValues.nonRateCardPrice = 0;
      formValues['aopId'] = this.receivedData.aopId;
      formValues['aopflId'] = this.receivedData.aopFlId;
      formValues['aopslId'] = this.receivedData.aopSlId;
      formValues['id'] = this.receivedData.id;
      formValues.skillSetType = this.receivedData.skillsetType;
      this.onSubmit(formValues);
    }
  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);

    if (!reg.test(input)) {
      event.preventDefault();
    }
  }
  changeObjectKeys(obj: any, keyMap: { [oldKey: string]: string }): any {
    const updatedObject: any = {};
    for (const oldKey in obj) {
      if (obj.hasOwnProperty(oldKey)) {
        const newKey = keyMap[oldKey] || oldKey;
        updatedObject[newKey] = obj[oldKey];
      }
    }
    return updatedObject;
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }

  onSubmit(formValues: any) {
    this.loaderService.setShowLoading();
    this.planningservice.EditSecondLevel(formValues).subscribe({
      next: (res: any) => {
        if (
          res?.status?.startsWith('Error') ||
          res?.status?.startsWith(' Error!!')
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = res.status;
          this.showErroMessage = true;
          return;
        }
        if (
          res.status == 'success' ||
          res.status == 'Record updated successfully'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar('Second Level Planning Edited Successfully');
          this.onClose(event);
        } else {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(res.status);
        }
      },
      error: (e: any) => {},
      complete: () => {},
    });
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  OnPageSizeChange(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 1000);
  }
  onFilterChanged(event: any) {
    this.adjustWidth();
  }

  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }

  onSortChanged(event: any) {
    this.adjustWidth();
  }
}
