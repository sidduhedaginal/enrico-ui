import { Component, EventEmitter, HostListener, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlaningService } from '../../services/planing.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-addresource',
  templateUrl: './addresource.component.html',
  styleUrls: ['./addresource.component.css']
})
export class AddresourceComponent {
  myForm!: FormGroup;
  decimalPattern = '^[0-9]+(.[0-9]{1,2})?$';
  ResourcerateReponse : any = [];
  stayScrolledToEnd = true;
  skillSet :any =  [];
  locationMode :any = [];
  grade :any = [];
  gb :any = [] ;
  vendors :any = [] ;
  skillSetType :any = [];
  location :any = [];
  issaveEnabled : boolean = false;
  EnteredValueValidation : boolean = false;
  columnApi: any;
  negativeEquivalent : boolean;
  public columnDefs :ColDef [] =  
  [
      { field: 'group', 
      resizable: true, 
      hide: false, 
      suppressMenu: true,
      colId: '-3', 
    },
    { 
      field: 'parentid', 
      hide: true,
      colId:'-2',
    },
    {
      field: 'jan',
      minWidth: 80,
      colId:'0',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'feb',
      minWidth: 80,
      colId:'1',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'mar',
      minWidth: 80,
      colId:'2',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'apr',
      minWidth: 80,
      colId:'3',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'may',
      minWidth: 80,
      colId:'4',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'jun',
      minWidth: 80,
      colId:'5',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'jul',
      minWidth: 80,
      colId:'6',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'aug',
      minWidth: 80,
      colId:'7',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'sep',
      minWidth: 80,
      colId:'8',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'oct',
      minWidth: 80,
      colId:'9',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'nov',
      minWidth: 80,
      colId:'10',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'dec',
      minWidth: 80,
      colId:'11',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      cellRenderer:this.customCellRenderer.bind(this),
      suppressMenu: true,
    },
    {
      field: 'total',
      minWidth: 80,
      colId:'-1',
      editable: this.customEditableFunction.bind(this),
      onCellValueChanged: this.onCellValueChanged.bind(this),
      suppressMenu: true,
      resizable: true,
    },
  ];

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
  valueToUpdate = 0;
  gradePrice : number = 0;
  rowData = [
    {
  
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      total: 0,
      group: 'Supply Planning',
    },
    {
    
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      total: 0,
      group: 'Equivalent Capacity',
    },
    {
  
      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      total: 0,
      group: 'Projected PO',
    },
    {

      jan: 0,
      feb: 0,
      mar: 0,
      apr: 0,
      may: 0,
      jun: 0,
      jul: 0,
      aug: 0,
      sep: 0,
      oct: 0,
      nov: 0,
      dec: 0,
      total: 0,
      group: 'Projected Revenue',
    },
  ];
  aopId:any;
  aopflId:any;
  aopslId:any;
  rateCardPrice:any;
  nonRateCardPrice:any;
  totalEquivalentCapacity:any;
  totalProjectedPO:any;
  totalProjectedRevenue:any;
  receivedData: any;
  startDateMonth:any;
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
  isPriceEditable!: boolean;
  allProviders: any[] = [];
  filteredProviders: any[] = []; 
  allProvidersVendor: any[] = []; 
  filteredProvidersVendor: any[] = []; 
  differentDropDowns = {
  };
  months={
    jan:1,
    feb:2,
    mar:3,
    apr:4,
    may:5,
    jun:6,
    jul:7,
    aug:8,
    sep:9,
    oct:10,
    nov:11,
    dec:12,
    group: -1,
  };
  SKILL : any ;
  SKILLSET :any ;
  GB:any
  LOCATION :any;
  LOCATIONMODE :any;
  GRADE:any;
  VENDOR:any
  showLoading: boolean = false;
  showErroMessage = false;
  errorMessage = '';
  resourceRate :any = {};
  ValueIn : number ;
  buName : string;
  selectedMonth : string;
  editedmonthId : number;
  EnteredValue : number;
  NewEditMonthid : number;
  selectedNextMonth : string;
  SupplyTotal : number;
  @Output() isFromSubmitted: EventEmitter<boolean> = new EventEmitter<boolean>(false);
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddresourceComponent>,
    private dialog: MatDialog,
    private snackBar:MatSnackBar,
    private planningservice : PlaningService,
    private loaderService: LoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.receivedData = this.data.message;
    
    this.buName = this.data.buName;
    if(this.receivedData.valueIn == 'Thousand'){
      this.ValueIn = 1000;
    }else if(this.receivedData.valueIn == 'Lakh'){
      this.ValueIn = 100000;
    }else if(this.receivedData.valueIn == 'Million'){
      this.ValueIn = 1000000;
    }
    
    this.receivedData["vkmPrice"]= 0;
    this.receivedData["endingNumber"] = 0;
    this.getResourceFilters();
    this.myForm = this.makeForm();
    this.myForm.get('skillSetType')?.disable();
    this.myForm.get('gradePrice')?.disable();

  }
  decimalFilter(event: any) {
    const reg = /^-?\d*(\.\d{0,3})?$/;
    let input = event.target.value + String.fromCharCode(event.charCode);
 
    if (!reg.test(input)) {
        event.preventDefault();
    }
 }
  makeForm() {
    return this.formBuilder.group({
      skillsetId: ['', Validators.required],
      gradeId: ['', Validators.required],
      locationId: ['', Validators.required],
      gbId: ['', Validators.required],
      locationModeId: ['', Validators.required],
      vendorId: ['', Validators.required],
      vkmPrice: ['', Validators.required],
      skillSetType: ['',Validators.required],
      gradePrice:['']

    })
  }

  onGridReady(params: GridReadyEvent) {
    this.startDateMonth = this.data.startDateMonth
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
    this.gridApi.setRowData(this.rowData);
    this.equivalentCapacity = this.rowData[1];
    this.updateEquivalentCapacity();
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
  }
  customCellRenderer(params) {
    params.colDef.cellStyle = {"text-align" : "center"}
    const cellValue = params.value; // Get the cell's value
    const rowIndex = params.node.rowIndex; // Get the row index
    // Check if it's the first row and apply styling
    if (rowIndex === 0 && parseInt(params.colDef.colId) >= this.receivedData.startMonth ) {
      // return `<div style="background-color: red;">${cellValue}</div>`;
      return `<div class="custom-cell">${cellValue}</div>`;
    } else {
      return cellValue.toString();
    }

  }

  customEditableFunction(params: any): boolean {
    const nonNumericFields = ['group']; // Add field names that should not be editable
    return (
      params.node.rowIndex === 0 &&
      !nonNumericFields.includes(params.colDef.field) && 
      parseInt(params.colDef.colId) >= this.receivedData.startMonth
    );
  }

  totalCalculation() {
    for (const row of this.rowData) {
      let rowTotal = 0;
      for (const month in row) {
        if (month !== 'group' && month !== 'total' && month != 'parentid') {
          const monthValue = Number((row as any)[month]);
          if (!isNaN(monthValue)) {
            rowTotal += monthValue;
          }
        }
      }
      row.total = rowTotal;
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

  onCellValueChanged(params: any) {
    const { node, colDef, newValue,oldValue } = params;
    if(this.receivedData.companyCode == '38F0'){
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
    this.onVKMPriceChange();
    this.onPriceChange();
    this.gridApi.setRowData(this.rowData);
    this.issaveEnabled = false;
    return;
  }
  onInput(event:any){
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
//Function to update the equvivalent capacity
  updateCalculation() { 
    if(this.receivedData.companyCode == '38F0'){ 
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
                    (this.rowData[2] as any)[key] = (((this.rowData[1] as any)[key] * this.gradePrice)/this.ValueIn).toFixed(3);      
                  }
                  // if(key == 'jan'){
                    this.previousMonth = key;
                  // }
                
                }
                this.gridApi.setRowData(this.rowData);
                
              }else{                
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
        if (key == 'jan'){
          this.valueToUpdate = Number(newValue) + this.receivedData.endingNumber;
        }
        if (key != 'group' && key != 'parentid' && key != 'total' && key != 'jan'){
         let PrivousMonthvalue = Number((this.rowData[1] as any)[this.previousMonth]);
          this.valueToUpdate = Number(newValue) + PrivousMonthvalue;  
        }     
        if (key != 'group' && key != 'parentid' && key != 'total') {
          (this.rowData[1] as any)[key] = this.valueToUpdate;
          (this.rowData[2] as any)[key] = (((this.rowData[1] as any)[key] * this.gradePrice)/this.ValueIn).toFixed(3);      
        }
        this.previousMonth = key;
      }
      this.gridApi.setRowData(this.rowData);
    }  
  }

  onVKMPriceChange() {
    const newVKMPrice = this.receivedData.vkmPrice;
    // for (const obj of this.rowData) {
    //   if (obj.group === 'Projected Revenue') {
        for (let key of Object.keys(this.rowData[3])) {
          if (key != 'parentid' && key != 'group') {
            (this.rowData[3] as any)[key] = ((newVKMPrice * (this.rowData[1] as any)[key])/this.ValueIn).toFixed(3);
          }
      //   }
      // }
    }
    this.gridApi.setRowData(this.rowData);
  }
 
  OnLocationchange(event:any){
    this.LOCATION = event.value

  }
  OnGbchange(event:any){
    this.GB = event.value

  }
  handleInput(event: KeyboardEvent): void{
    event.stopPropagation();
 }
  //drpdown with search and multi-select
  onInputChange(event: any) {
    const searchInput = event.target.value.toLowerCase();
    this.filteredProviders = this.allProviders.filter(({ name }) => {      
      const prov = name.toLowerCase();
      return prov.includes(searchInput);
    });
  }

  onOpenChange(searchInput: any) {
    searchInput.value = "";
    this.filteredProviders = this.allProviders;
  }
    //drpdown with search and multi-select for vendor
    onInputChangeVendor(event: any) {
      const searchInput = event.target.value.toLowerCase();
      this.filteredProvidersVendor = this.allProvidersVendor.filter(({ name }) => {      
        const prov = name.toLowerCase();
        return prov.includes(searchInput);
      });
    }
  
    onOpenChangeVendor(searchInput: any) {
      searchInput.value = "";
      this.filteredProvidersVendor = this.allProvidersVendor;
    }

  OnSkillchange(event:any){
    this.SKILL = event.value ;
    if(this.SKILL && this.GRADE && this.LOCATIONMODE && this.VENDOR){
      this.getResourceRate();
    }else{
      this.resourceRate.skillsetId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.gradeId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = "00000000-0000-0000-0000-000000000000";
    }
  }
  OnGradechange(event:any){
    this.GRADE = event.value;
    if(this.SKILL && this.GRADE && this.LOCATIONMODE && this.VENDOR){
      this.getResourceRate();
    }else{
      this.resourceRate.skillsetId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.gradeId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = "00000000-0000-0000-0000-000000000000";
    }
  }
  OnLocationmodechange(event:any){
    this.LOCATIONMODE = event.value;
    if(this.SKILL && this.GRADE && this.LOCATIONMODE && this.VENDOR){
      this.getResourceRate();
    }else{
      this.resourceRate.skillsetId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.gradeId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = "00000000-0000-0000-0000-000000000000";
    }


  }
  OnVendorchange(event:any){
    this.VENDOR = event.value;
    if(this.SKILL && this.GRADE && this.LOCATIONMODE && this.VENDOR){
      this.getResourceRate();
    }else{
      this.resourceRate.skillsetId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.gradeId = "00000000-0000-0000-0000-000000000000";
      this.resourceRate.locationModeId = 0;
      this.resourceRate.vendorId = "00000000-0000-0000-0000-000000000000";
    }
    

  }
  getResourceRate(){
     this.loaderService.setShowLoading();    
    this.resourceRate.skillsetId = this.SKILL;
    this.resourceRate.gradeId = this.GRADE;
    this.resourceRate.locationModeId = parseInt(this.LOCATIONMODE);
    this.resourceRate.companyId = this.receivedData.companyId ;
    this.resourceRate.vendorId = this.VENDOR;
    this.resourceRate.buName = this.buName;
    
    // if(this.SKILLSET == 'Rate Card'){
    //   resourceRate.isRateCard = true;
    // }else{
    //   resourceRate.isRateCard = false;
    // }
    this.planningservice.getResourceRate(this.resourceRate)
    .subscribe({
      next: (res:any) => {
      this.ResourcerateReponse = res ;
       this.myForm.get('skillSetType')?.setValue(this.ResourcerateReponse.skillType);
       this.myForm.get('gradePrice')?.setValue(this.ResourcerateReponse.gradePrice);
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
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });
  }

  onPriceChange() {
    const newPrice = this.gradePrice;
    for (let key of Object.keys(this.rowData[2])) {
      if (key != 'parentid' && key != 'group') {
        (this.rowData[2] as any)[key] = ((newPrice * (this.rowData[1] as any)[key])/this.ValueIn).toFixed(3);
      }
    }
    this.gridApi.setRowData(this.rowData);
  }

  updateEquivalentCapacity() {
    for (let key of Object.keys(this.rowData[1])) {
      if (key != 'parentid' && key != 'group') {
        (this.rowData[1] as any)[key] = this.receivedData.endingNumber;
      }
    }
    this.gridApi.setRowData(this.rowData);
  }

  updateProjectedPO() {
    for (let key of Object.keys(this.rowData[2])) {
      if (key != 'parentid' && key != 'group') {
        (this.rowData[2] as any)[key] = (((this.rowData[1] as any)[key] * this.gradePrice)/this.ValueIn).toFixed(3);
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
    this.rowData[0].total = rowTotal; 
    this.SupplyTotal = rowTotal;  
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
      this.SupplyPlanninTotal()
      this.checkEquivalentCapacity();          
      if( this.SupplyTotal < 0){
        this.showSnackbar(`Total Supply Planning should not be less than zero`);
      }
      else if(this.negativeEquivalent == true){
        this.showSnackbar(`Equivalent Capacity should not be less than zero`);
      }
    else{
      const formValues = this.myForm.value;
      formValues["childData"] = this.rowData;
      formValues.endingNumber = 0;
      formValues.isImported = false;
      // formValues.id = null;
      formValues.price = Number(this.gradePrice);
      formValues.vkmPrice = Number(this.receivedData.vkmPrice);
      formValues.totalEquivalentCapacity = 0;
      formValues.totalProjectedPO = 0;
      formValues.totalProjectedRevenue = 0;
      formValues.rateCardPrice = 0;
      formValues.nonRateCardPrice = 0;
      formValues["aopId"] = this.receivedData.aopId;
      formValues["aopflId"] = this.receivedData.aopFlId;
      formValues["aopslId"] = this.receivedData.aopSlId;
      formValues.skillSetType = this.ResourcerateReponse.skillType;
      // formValues["id"] = this.receivedData.aopSlId;
      this.onSubmit(formValues);
    }
  }

  

  getResourceFilters(){
     this.loaderService.setShowLoading();
    this.planningservice.getResourceFilters(this.receivedData.companyId).subscribe({
      next: (res:any) => {
        this.skillSet =  res.data.skillSet;
        this.allProviders =  res.data.skillSet;
        this.filteredProviders =  this.allProviders;
        this.locationMode = res.data.locationMode;
        this.grade = res.data.grade;
        this.gb = res.data.gb ;
        this.vendors = res.data.vendors ;
        this.allProvidersVendor = res.data.vendors 
        this.filteredProvidersVendor =  this.allProvidersVendor 
        this.skillSetType = res.data.skillSetType;
        this.location = res.data.location;
        this.loaderService.setDisableLoading();
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
        this.loaderService.setDisableLoading();
      }
    });
  }


  handleScroll(event: any) {
    this.gridApi.setAlwaysShowHorizontalScroll(true);
    const grid = document.getElementById('planningGrid');
    if (grid) {
      const gridBody = grid.querySelector('.ag-body-viewport') as any;
      const scrollPos = gridBody.offsetHeight + event.top;
      const scrollDiff = gridBody.scrollHeight - scrollPos;
      this.stayScrolledToEnd = scrollDiff <= 3;
    }
  }
  onClose(event: any) {
    event.preventDefault();
    this.isFromSubmitted.emit(false);
    this.dialogRef.close();
  }
  onSubmit(receivedData:any){
     this.loaderService.setShowLoading();
    this.planningservice.EditSecondLevel(receivedData).subscribe({
      next: (res:any) => {
        if (
          res.status.startsWith('Error')
        ) {
          this.loaderService.setDisableLoading();
          this.errorMessage = res.status;
          this.showErroMessage = true;
          return;
        }
        if (
          res.status === 'Record added successfully'
        ) {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar("Resource Added Successfully");
          this.onClose(event);
        } else {
          this.loaderService.setDisableLoading();
          this.isFromSubmitted.emit(true);
          this.showSnackbar(res.status);
        }
       
      },
      error: (e:any) => {
      },
      complete: () => {
      }
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
