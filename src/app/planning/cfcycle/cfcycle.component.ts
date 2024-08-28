import { Component, HostListener, SimpleChanges,Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { NoplanningpopupComponent } from '../popups/noplanningpopup/noplanningpopup.component';
import { CreateAOPpopupComponent } from '../popups/create-aoppopup/create-aoppopup.component';
import { PlaningService } from '../services/planing.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe, formatDate } from '@angular/common';
import { HomeService } from 'src/app/services/home.service';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-cfcycle',
  templateUrl: './cfcycle.component.html',
  styleUrls: ['./cfcycle.component.css'],
  providers:[DatePipe]
})
export class CfcycleComponent {
  @Input() selectedTab : number;
  CURRENT_TAB_INDEX :number ;
  CurrentDate = new Date() ;
  public showLoading = false;
  selectedPlannedYear :any = "All";
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  private gridApi!: GridApi;
  autoGroupColumnDef: ColDef = { minWidth: 200 };
  overlayNoRowsTemplate = '<span></span>';
  public defaultColDef: ColDef = {
    sortable: true,
    filter: 'agSetColumnFilter',
    resizable: true,
    flex: 2,
    minWidth: 175,
    enableValue: false,
    enableRowGroup: false,
    enablePivot: false,
    menuTabs: ['filterMenuTab'],
  };
  columnApi: any;
  paginationPageSize: number = 5;
  searchText = "";
  filteredData = [];
  stayScrolledToEnd = true;
  isGridAPIReady : boolean = true;
  receivedGridResponse = [];
  public colDefs: any = [];
  public showApproveButton = false;
  public rowData: any = [];
  public columns: any = [];
  public gridColumns: any = [];
  public userConfigColumns: any;
  public data: any = [];
  public settings = {};
  public selectedItems = [];
  gridData: any;
  planningYearList :any = 
    [
      new Date().getFullYear(),
      new Date().getFullYear() + 1
    ];
  dropdownVisible = false;
  selectedColumnNumber = 0;
  columnDefs :any = [];
  permissionDetails :any ;
  cfCyclePermissiondetails :any = [];
  // AUTH
  featureDetails : any ;  
  userProfileDetails : userProfileDetails | any ;
  selectedMasterAccessRoles : any ;
  public currenttabindex : any;
  ExportDate :any;
  selectedColumns: any;
  savedColumns: any;
  activeColumns: any;
  finalKeyArray:any=[];
  columnFilters : any;
  removedColumnFilters:any
  selectedMySubColumnNumber = 0;
  PlanningChipsKey : any;
  filterModel:any;
  filterToString : any;
  filterToParse :any;
  filterChipsSets :any = [];

  constructor(
    private dialog: MatDialog,
    private planningService:PlaningService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private homeService: HomeService,
    private loaderService: LoaderService,) {
      let todayDate = new Date();
      this.ExportDate = this.datePipe.transform(todayDate , 'dd-MMM-yyyy');
      this.currenttabindex = localStorage.getItem('transactionTabIndex');
      this.checkUserProfileValueValid();
     }
     // CF Cycle AUTH functions
    getProfileRoles() {
     this.homeService.getProfileRoles()
     .subscribe({
       next: (response:any) => {
         this.userProfileDetails = response.data;
         this.planningService.profileDetails = response.data;
         StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
         const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning"));
         const masterDataFeatureDetails = masterDataModules.map((item:any) => {
           const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
           return masterDataModule.featureDetails;
         });
     
         this.featureDetails = masterDataFeatureDetails;
         this.permissionDetails = {
           "createPermission": false,
           "readPermission": false,
           "editPermission": false,
           "deletePermission": false,
           "approvePermission": false,
           "rejectPermission": false,
           "delegatePermission": false,
           "withdrawPermission": false,
           "importPermission": false,
           "exportPermission": false
         }
         for(let plan of this.featureDetails){
          for(let item of plan){        
            if(item.featureCode.startsWith("CFCyclePlanning")){
              item.id = "0";
            }else if(item.featureCode.startsWith("AOPPlanning")){
              item.id = "1";
            } else if(item.featureCode.startsWith("FirstLevelPlanning")){
              item.id = "2";
            } else if(item.featureCode.startsWith("SecondLevelPlanning")){
              item.id = "3";
            } else if(item.featureCode.startsWith("PODetails")){
              item.id = "4";
            } 
          }  
          const sorttest2 = plan.sort((a, b) => (a.id < b.id ? -1 : Number(a.id > b.id)));
          plan = sorttest2 ;
          this.CURRENT_TAB_INDEX = plan.findIndex((x:any) => x.featureCode.toLowerCase() === "cfcycleplanning");
           for(let item of plan){
             if(item.featureCode.toLowerCase() == "aopplanning"){
               for (const permission in this.permissionDetails) {
                 if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                   this.permissionDetails[permission] = true;
                 }
               }
             } 
           } 
             
         }
  
       },
       error: (e:any) => {
         this.loaderService.setDisableLoading();
       }
   });
   }
    checkUserProfileValueValid(){
      this.planningService.profileDetails = StorageQuery.getUserProfile();
      if(this.planningService.profileDetails == '' || this.planningService.profileDetails == undefined) {
        this.getProfileRoles();
      }
      else {
        this.userProfileDetails = this.planningService.profileDetails;
        const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning")); 
        
        const masterDataFeatureDetails = masterDataModules.map((item:any) => {
          const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
          return masterDataModule.featureDetails;
        });
        this.featureDetails = masterDataFeatureDetails;
        this.permissionDetails = {
          "createPermission": false,
          "readPermission": false,
          "editPermission": false,
          "deletePermission": false,
          "approvePermission": false,
          "rejectPermission": false,
          "delegatePermission": false,
          "withdrawPermission": false,
          "importPermission": false,
          "exportPermission": false
        }
        for(let plan of this.featureDetails){
          for(let item of plan){        
            if(item.featureCode.startsWith("CFCyclePlanning")){
              item.id = "0";
            }else if(item.featureCode.startsWith("AOPPlanning")){
              item.id = "1";
            } else if(item.featureCode.startsWith("FirstLevelPlanning")){
              item.id = "2";
            } else if(item.featureCode.startsWith("SecondLevelPlanning")){
              item.id = "3";
            } else if(item.featureCode.startsWith("PODetails")){
              item.id = "4";
            } 
          }  
          const sorttest2 = plan.sort((a, b) => (a.id < b.id ? -1 : Number(a.id > b.id)));
          plan = sorttest2 ;
          this.CURRENT_TAB_INDEX = plan.findIndex((x:any) => x.featureCode.toLowerCase() === "cfcycleplanning");          
          for(let item of plan){
            if(item.featureCode.toLowerCase() == "aopplanning"){
              for (const permission in this.permissionDetails) {
                if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                  this.permissionDetails[permission] = true;
                }
              }
            } 
          } 
            
        }
      }
     }
 
  adjustWidth() {
    const allColumnIds: any = [];
    this.columnApi?.getColumns()?.forEach((column: any) => {
      allColumnIds.push(column.getId());
    });

    this.columnApi?.autoSizeColumns(allColumnIds, false);
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
  
  onHorizontalScroll(event: any) {
    setTimeout(() => {
      this.adjustWidth();
    }, 500);
  }
  
  onSortChanged(event: any) {
    this.adjustWidth();
  }

  ngOnInit(): void {

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
  getdeafultcolmuns(){
    this.planningService.getdeafultcolmuns(43)
      .subscribe((item: any) => {
        this.savedColumns = item.data;
        if (this.savedColumns) {
          let savedColumnsArray = this.savedColumns.split(',');

          this.columnDefs.forEach((element, index) => {
            if (element.field) {
              let selectedColumnName = savedColumnsArray.find(
                (item: any) => item === element.field
              );
              if (selectedColumnName) {
                this.columnDefs[index].hide = false;
              } else {
                this.columnDefs[index].hide = true;
              }
            }
          });
          this.gridApi?.setColumnDefs(this.columnDefs);
        }
      });
  }
  getCFCycleLsit(){
    this.getdeafultcolmuns();
     this.loaderService.setShowLoading();
    this.planningService.getCFCycleList().subscribe({
      next: (res:any) => {
        if(res.data.length != 0 && res.status == "success"){
         
          this.gridData = res;
          for(let item of this.gridData.data){
            if(item.planningYearId != null){
              item.planningYearId = item.planningYearId.toUpperCase();
            }
            if(item.cfCycleName != null){
              item.cfCycleName = item.cfCycleName.toUpperCase();
            }
            item["duedays"] = this.calculateDiff(item.planningStartDate);
             if(item.status == 'Active'){
              item.status = 'Planning yet to Initiate'
             }
            item.planningStartDate = this.datePipe.transform(item.planningStartDate, 'dd-MMM-yyyy');
            item.planningEndate = this.datePipe.transform(item.planningEndate, 'dd-MMM-yyyy');
            item.modifiedOn = this.datePipe.transform(item.modifiedOn, 'dd-MMM-yyyy');
            item.createdOn = this.datePipe.transform(item.createdOn, 'dd-MMM-yyyy');
          }
          this.rowData = this.gridData.data;
          this.gridApi.setRowData(this.rowData);
          this.loaderService.setDisableLoading();
        }else if( res.data.length == 0 && res.status == "failed"){
          this.loaderService.setDisableLoading();
          this.showSnackbar(res.data)
        }else{
          this.loaderService.setDisableLoading();
        }
        setTimeout(() => {
          this.adjustWidth();
        }, 5);
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
  });
  }


  onGridReady1(params: GridReadyEvent) {
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
    this.columnDefs = [
      {
        headerName: 'Company',
        hide: true,
        editable: false,
        field: 'companyCode',
        resizable: true,
        
      },
      {
        headerName: 'CF Cycle',
        hide: true,
        editable: false,
        field: 'cfCycleName',
        resizable: true,
        minWidth: 95,
      },
      {
        headerName: 'Year',
        hide: true,
        editable: false,
        field: 'cfCycleYear',
        sortable: true,
        resizable: true,
        minWidth: 95,
      },
      {
        headerName: 'Starting Month',
        hide: true,
        editable: false,
        field: 'cfCyclePlanningMonth',
        resizable: true,
      },
      {
        headerName: 'Planning Year ID',
        hide: true,
        editable: false,
        field: 'planningYearId',
        resizable: true,
        minWidth:180,
      },
      {
        headerName: 'Planning Start Date',
        hide: true,
        editable: false,
        field: 'planningStartDate',
        resizable: true,
      },
      {
        headerName: 'Planning End Date',
        hide: true,
        editable: false,
        field: 'planningEndate',
        resizable: true,
      },
      {
        headerName: 'Company Code',
        hide: true,
        editable: false,
        field: 'companyCode',
        resizable: true,
        
      },
      {
        headerName: 'Company Name',
        hide: true,
        editable: false,
        field: 'companyFullName',
        resizable: true,
        
      },
    
      {
        headerName: 'Created On',
        hide: true,
        editable: false,
        field: 'createdOn',
        resizable: true,
        
      },
      {
        headerName: 'Created By',
        hide: true,
        editable: false,
        field: 'createdBy',
        resizable: true,
        
      },
      {
        headerName: 'Modified On',
        hide: true,
        editable: false,
        field: 'modifiedOn',
        resizable: true,
        
      },
      {
        headerName: 'Modified By',
        hide: true,
        editable: false,
        field: 'modifiedBy',
        resizable: true,
        
      },
      {
        headerName: 'Remark',
        hide: true,
        editable: false,
        field: 'remark',
        resizable: true,
        
      }  
    ];



    this.columnDefs.push(
      {
        headerName: 'Status',
        hide: true,
        editable: false,
        field: 'status',
        resizable: true,
        pinned: 'right',
      },
      {
      headerName: 'Actions',
      field: 'Actions',
      editable: false,
      colId: 'action',
      pinned: 'right',
      cellRenderer: this.renderActionIconsForMaster.bind(this),
    });
    this.gridApi.setColumnDefs(this.columnDefs);
  
  }
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(43).subscribe({
      next:(res:any)=>{
        let onlyKeysarr = [];
        if(res.data.columnFilters == ''){
          this.filterChipsSets = null;
          this.ClearAllChipsFiltersOnIntialLoad()
        }
        if(res.data.columnFilters != ''){
          onlyKeysarr=JSON.parse(res.data.columnFilters);
          if(onlyKeysarr){
            this.finalKeyArray =Object.keys(onlyKeysarr) ;
            this.filterChipsSets = Object.keys(onlyKeysarr)
          }
            this.gridOptions.api.setFilterModel(onlyKeysarr);
            this.loaderService.setDisableLoading();
        }
      },error:(error:any)=>{
        this.loaderService.setDisableLoading();
      }
    })
  }

  onSearch() {
    this.filteredData = this.rowData.filter((row: any) =>
      Object.values(row).some((value: any) => {
        if (value !== null && (typeof value === 'string' || typeof value === 'number')) {
          const lowerCaseValue = String(value).toLowerCase();
          const lowerCaseSearchText = this.searchText.toLowerCase();
          return lowerCaseValue.includes(lowerCaseSearchText);
        }
        return false;
      })
    );

    this.gridApi.setRowData(this.filteredData);    
  }

  toggleDropdown() {
    this.toggle('');
    this.dropdownVisible = !this.dropdownVisible;
    if (!this.dropdownVisible) {
    }
  }
  toggle(col: any) {
    this.removeChips(col);
    let count = 0;
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) count += 1;
      if (this.columnDefs[x].headerName == col) {
        if (this.columnDefs[x].hide === false) {
          this.columnDefs[x].hide = true;
        } else {
          this.columnDefs[x].hide = false;}}}
    this.gridApi.setColumnDefs(this.columnDefs);
    this.selectedColumnNumber = count;
    this.activeColumns = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    );
    this.selectedColumns = this.activeColumns.map(
      (element: any) => element.field
    );
  }
  closeDropdown(){
    this.dropdownVisible = false;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target instanceof HTMLElement && event.target.closest('.multiSelectDropDownSearch'))) {
      this.dropdownVisible = false;
      this.setActiveItem('');
    }
    
  }
  activeItem: string = '';
  setActiveItem(page: string) {
    this.activeItem = page;
  }
 
  onDropdownClick(event: MouseEvent) {
    event.stopPropagation();
  }


  filterYear(event:any){
    if(event.value == "All"){
      this.rowData = this.gridData.data;
      this.gridApi.setRowData(this.rowData);
    }else{
      const filteredRow :any = this.rowData.filter((obj:any) => obj.cfCycleYear == event.value);
      this.gridApi.setRowData(filteredRow);
    }
  }

  openNoPlanningPopup(payload:any) { 
    const dialogRef = this.dialog.open(NoplanningpopupComponent,{
     width:"65%",
      data:  {message: payload}
    });
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted) {
         this.loaderService.setShowLoading();
        this.getCFCycleLsit();      
      }
    });
  }
  openCreateAopDialog(payload:any) {
    const dialogRef = this.dialog.open(CreateAOPpopupComponent,{
      width:"65%",
      data: {message: payload},
      panelClass: 'scrollable-dialog'
    });
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted) {
         this.loaderService.setShowLoading();
        this.getCFCycleLsit();      
      }
    });
  }
    renderActionIconsForMaster(params: any){
      let iconsHTML = '<div class="icon-class">';
      const actionIconsWithSubmit: { [key: string]: string } = {
        createPermission: '<span class="addaop" title="Create AOP">&nbsp;</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="noplanning" title="No Planning">&nbsp;</span>&nbsp;&nbsp;',
      };
      
  
      const actionIconsWithOutSubmit: { [key: string]: string } = {
        createPermission:'<span class="noplanning" title="No Planning">&nbsp;</span>',
      };
  
      if(params.data.status == "Planning yet to Initiate" && params.data.duedays <= 0){
        for (const permission in actionIconsWithSubmit) {
          if (this.permissionDetails.hasOwnProperty(permission) && this.permissionDetails[permission] == true) {  
              iconsHTML +=  actionIconsWithSubmit[permission];
          }
        }
  
      }
      else if(params.data.status == "Planning yet to Initiate" && params.data.duedays > 0){
        for (const permission in actionIconsWithOutSubmit) {
          if (this.permissionDetails.hasOwnProperty(permission) && this.permissionDetails[permission] == true) {
            iconsHTML +=  actionIconsWithOutSubmit[permission];
          }
        }
  
      }
      iconsHTML += '</div>';
  
      return iconsHTML;
  
    }
    onCellClicked( params:any): void {
      if(params.column.colId === "action" && params.event.target.className == "addaop"){
        this.openCreateAopDialog(params.data);
      }
      else if(params.column.colId === "action" && params.event.target.className == "noplanning"){
        this.openNoPlanningPopup(params.data);
      }
    }
    calculateDiff(sentOn:any){
      let todayDate = new Date();
      let sentOnDate = new Date(sentOn);
      sentOnDate.setDate(sentOnDate.getDate());
      let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
      // To calculate the no. of days between two dates
      let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
      return differenceInDays;
}
    ngOnChanges(changes: SimpleChanges): void {    
    if('selectedTab' in changes && changes.selectedTab.currentValue == this.CURRENT_TAB_INDEX){
        if(this.selectedPlannedYear == "All"){
           this.loaderService.setShowLoading();
          this.getCFCycleLsit();
        }else{
          const filteredRow :any = this.rowData.filter((obj:any) => obj.cfCycleYear == this.selectedPlannedYear);
          this.gridApi.setRowData(filteredRow);
        }
      }
     else if (this.isGridAPIReady && changes['rowData']) {
        this.gridOptions.api?.setRowData(this.rowData);
      }
    }
    showSnackbar(content: string) {
      this.snackBar.open(content, undefined, { duration: 5000 });
    }  
  onBtnExport(filename:string){
    var params = {
      fileName: `${filename + '_Export'+ '_' +  this.ExportDate}.xlsx`,
    };
    this.gridApi.exportDataAsExcel(params);
  } 
  SaveSelectedGrid(){
    if (this.selectedColumns) {
      this.loaderService.setShowLoading();
      this.planningService
        .saveColSettings(43,this.selectedColumns)
        .subscribe((item: any) => {
          if (item.status === 'success') {
            this.setActiveItem('');
            this.loaderService.setDisableLoading();
            this.showSnackbar('Filter applied Successful.')
          }
        });
      this.toggleDropdown();
      this.adjustWidth();
    }

  } 
  selectAllColumns() {
    this.columnDefs.forEach((element, i) => {
      if (element.headerName && element.field) {
        this.columnDefs[i].hide = false;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = this.columnDefs
      .filter((element: any) => !element.hide)
      .map((item) => item.field);
    this.adjustWidth();
  }
  unSelectAllColumns() {
    this.columnDefs.forEach((element, i) => {
       if (element.headerName && element.field && !element.disable)  {
        this.columnDefs[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs);

    this.selectedColumns = [];
    this.adjustWidth();
  }
  // Filter Chips
  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs.filter(
      (x: any) => {
        x.field && x.hide == true
      }
    ).length;

  }

  onFilterChanged(event: any) {
    this.filterModel = event.api.getFilterModel(); //same    
    this.filterToString =  JSON.stringify(this.filterModel);

    this.filterToParse = JSON.parse(this.filterToString);
    this.filterChipsSets = Object.keys(this.filterToParse);
    this.adjustWidth();
  }
  saveChipsFilters(){
    this.loaderService.setShowLoading();
  // API
   var payload: any = {
    menuid: 43,
      filters: JSON.stringify(this.filterModel),
    }
    this.planningService.saveColFilters(payload).subscribe({
      next:(res:any)=>{
        this.columnFilters =  res.data.columnFilters;
        let onlyKeysarr= [];
        onlyKeysarr = JSON.parse(this.columnFilters);
        this.filterChipsSets = Object.keys(onlyKeysarr);
        this.finalKeyArray = Object.keys(onlyKeysarr) ;
        this.adjustWidth();
        this.loaderService.setDisableLoading();
        this.showSnackbar('Filter saved Successfully.')
      },
      error:(error:any)=>{
        this.loaderService.setDisableLoading();
      }
    })
    // api
  }
  getCapitalize(item:any) {
    var getcapVal=this.columnDefs.find(a=>a.field.toLowerCase()==item.toLowerCase());
    return getcapVal.headerName;   
    //return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/(\B[A-Z])/g, ' $1').replace('Ntid','NT ID').replace('I D','ID').replace('Enddate','End date').replace('Bu','BU').replace('Jd','JD').replace('Personnel Subarea','Personnel Subarea BGS').replace('Contract End','Contract End(SOW JD)')
  }
  removeChips(f:any) { 
    let onlyKeysarr=[];
    const index = this.filterChipsSets.indexOf(f);  
    if (index >= 0) {
      this.filterChipsSets.splice(index, 1);
      onlyKeysarr = JSON.parse(this.filterToString);         
      delete onlyKeysarr[f]; 
      this.filterToString = JSON.stringify(onlyKeysarr);
      let onlyKeysarr2=[];
      onlyKeysarr2 = JSON.parse(this.filterToString);     
      this.gridOptions.api.setFilterModel(onlyKeysarr2);
      this.adjustWidth();
  
      this.loaderService.setDisableLoading();
      var removepayload: any = {
        menuid: 43,
          filters: JSON.stringify(onlyKeysarr),
        }
      this.planningService.saveColFilters(removepayload).subscribe({
        next:(res:any)=>{
          this.removedColumnFilters =  res.data.columnFilters; //chips name with value received from API
          let onlyKeysarr2=[];
          onlyKeysarr2=JSON.parse(this.removedColumnFilters);     
          this.gridOptions.api.setFilterModel(onlyKeysarr2);
          this.filterChipsSets = Object.keys(onlyKeysarr2) ;
          this.adjustWidth();
          this.loaderService.setDisableLoading();
        },
        error:(error:any)=>{
        }
      })
    }
  }
  ClearAllChipsFiltersOnIntialLoad(){
    this.filterChipsSets=[];
    var payload: any = {
      menuid: 43,
        filters: '',
      }
      this.planningService.saveColFilters(payload).subscribe({
        next:(res:any)=>{
          this.adjustWidth();
        },
        error:(error:any)=>{
  
        }
      })
    this.gridOptions.api.setFilterModel(null);

  }
  ClearAllChipsFilters(){
    this.loaderService.setShowLoading();
    this.filterChipsSets=[];
    var payload: any = {
      menuid: 43,
        filters: '',
      }
      this.planningService.saveColFilters(payload).subscribe({
        next:(res:any)=>{
          console.log("filter response",res);
          this.loaderService.setDisableLoading();
          this.adjustWidth();
          this.showSnackbar('Filter cleared Successfully.')
        },
        error:(error:any)=>{
          this.loaderService.setDisableLoading();
  
        }
      })
    this.gridOptions.api.setFilterModel(null);
  }

}
