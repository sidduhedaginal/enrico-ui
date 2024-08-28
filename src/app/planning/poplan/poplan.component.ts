import { Component, HostListener, Input,SimpleChanges } from '@angular/core';
import {GridApi,ColDef, GridOptions} from 'ag-grid-community';
import { Router } from '@angular/router';
import { PlaningService } from '../services/planing.service';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { HomeService } from 'src/app/services/home.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from 'src/app/services/loader.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-poplan',
  templateUrl: './poplan.component.html',
  styleUrls: ['./poplan.component.css'],
  providers:[DatePipe]
})
export class PoplanComponent {
  @Input() selectedTab : number;
  CURRENT_TAB_INDEX :number;
  Roles : any;
  permissionDetails :any ;
  private gridApi!: GridApi;
  searchText: string = '';
 currentPage = 1;
 pageSize = 10;
 selectedPlannedYear: any = 'All';
 rowData: any = [];
 public columnApi: any;
 PlanningYearList: any = [
   new Date().getFullYear() - 2,
   new Date().getFullYear() - 1,
   new Date().getFullYear(),
   new Date().getFullYear() + 1,
   new Date().getFullYear() + 2,
 ];
 dropdownVisible = false;
 showLoading = false;
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
  paginationPageSize: number = 5;
 gridData = [];
 public currenttabindex : any;
 apiResponse = [];
 gridOptions: GridOptions = {
  domLayout: 'autoHeight',
};

 // AUTH
  featureDetails : any ;  
  userProfileDetails : userProfileDetails | any ;
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
    private planningService: PlaningService,
    private router: Router,
    private homeService: HomeService,
    private snackBar: MatSnackBar,
    private loaderService: LoaderService,
    private datePipe: DatePipe,
  ) {
    let todayDate = new Date();
    this.ExportDate = this.datePipe.transform(todayDate , 'dd-MMM-yyyy');
    this.currenttabindex = localStorage.getItem('transactionTabIndex');
    this.checkUserProfileValueValid();
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  // PO Cycle AUTH functions
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
               this.CURRENT_TAB_INDEX = plan.findIndex((x:any) => x.featureCode.toLowerCase() === "podetails");
               if(parseInt(this.currenttabindex) == this.CURRENT_TAB_INDEX){
                 this.getPoList();      
               }
               if(plan[0].featureCode.toLowerCase() == "podetails"){
                 this.getPoList();
               }
               else{
                 this.loaderService.setDisableLoading();
               }
               for(let item of plan){
                 if(item.featureCode.toLowerCase() == "podetails"){
                   for (const permission in this.permissionDetails) {
                     if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                       this.permissionDetails[permission] = true;
                     }
                   }
                 }  
               }     
             }
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
              this.CURRENT_TAB_INDEX = plan.findIndex((x:any) => x.featureCode.toLowerCase() === "podetails");
              if(parseInt(this.currenttabindex) == this.CURRENT_TAB_INDEX){
                this.getPoList();      
              }
              if(plan[0].featureCode.toLowerCase() == "podetails"){
                this.getPoList();
              }
              else{
                this.loaderService.setDisableLoading();
              }
              for(let item of plan){
                if(item.featureCode.toLowerCase() == "podetails"){
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
  onFirstDataRendered(event: any) {
    this.adjustWidth();
    this.planningService.getColFilters(46).subscribe({
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
 getdeafultcolmuns(){
  this.planningService.getdeafultcolmuns(46)
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
getPoList(){
  this.getdeafultcolmuns();
   this.loaderService.setShowLoading();
  this.planningService.getPoList()
  .subscribe({
    next: (response:any) => {

      if(response.data.length != 0){
      for(let item of response.data){
        if(this.permissionDetails.readPermission){
          item.readPermission = true;
        }else{
          item.readPermission = false;
        }
      }
      this.apiResponse = response.data;
      this.rowData = this.apiResponse;
      this.gridApi.setRowData(this.rowData);
    }else if(response.status == "failed"){
      this.loaderService.setDisableLoading();
      this.showSnackbar(response.data)
    }else{
      this.loaderService.setDisableLoading();
    }

              
    },error: (e:any) => {
       this.loaderService.setDisableLoading();
    },
     complete: () => {
       this.loaderService.setDisableLoading(); 
    }
  });
  }


  columnDefs :any = [] = [
    {
      headerName: 'PO Planning ID',
      field: 'poPlanningId',
      resizable: true,
      cellRenderer: this.poLink,
      pinned: 'left',
      disable: true,
      enableFilter:false,
      suppressMenu: true,
      suppressDragLeaveHidesColumns: false,
      suppressMovable:true,
      hide: false
    },
    {
      headerName: 'Planning Year ID',
      field: 'planningYearId',
      resizable: true,
      minWidth: 100,
      hide: false,
      cellRenderer : (params: any) =>  this.convertToUpperCase(params, "planningYearId")
    },
    { 
      headerName: 'AOP ID', 
      field: 'aopPlanningCode', 
      resizable: true ,
      cellRenderer : (params :any) => this.convertToUpperCase(params, "aopPlanningCode"),
      width: 350,
      hide: false
      
    },
    { headerName: 'CompanyFullName', field: 'companyFullName', hide:true,resizable: true, width: 350 },
    { headerName: 'Company', field: 'companyShortName', resizable: true, width: 250,hide: false },

    { headerName: 'Planning Year', field: 'planningYear', width: 60, resizable: true ,hide: false},
    {
      headerName: 'PO Planning Organization Unit',
      field: 'organizationUnitName',
      width: 80,
      hide: false,
      resizable: true,
    },
    {
      headerName: 'PO Planning Level',
      field: 'planningOrgLevel',
      width: 60,
      hide: false,
      resizable: true,

    },
    {
      headerName: 'Owner Name',
      field: 'ownerName',
      width: 60,
      hide: false,
      resizable: true,

    },
    {
      headerName: 'Owner NTID',
      field: 'ownerNTID',
      width: 60,
      hide: false,
      resizable: true,

    },
    {
      headerName: 'Company Code',
      hide: false,
      editable: false,
      field: 'companyCode',
      resizable: true,
      
    },
    {
      headerName: 'Company Name',
      hide: false,
      editable: false,
      field: 'companyShortName',
      resizable: true,
      
    },
  ];

  onGridReady(params: any) {
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
    this.rowData = this.apiResponse;
  }
  onPaginationPageRequested(page: any) {
    this.currentPage = page;
  }

  convertToUpperCase(params: any, id : any){
    try {
      return "<span>" + params.data[id].toUpperCase() + '</span>';
    } catch (error) {
      return "<span>" + params.data[id].toUpperCase() + "</span>";
    }
  }

  poLink(params: any) {
    if(params.data.readPermission){
      return "<span class='planning_code'>" + params.data.poPlanningId.toUpperCase() + '</span>';
    }else{
      return "<span>" + params.data.poPlanningId.toUpperCase() + "</span>";
    }
  }

  filterYear(event: any) {
    this.rowData = this.apiResponse;
    if (event.value == 'All') {
      this.gridApi.setRowData(this.rowData);
    } else {
      this.rowData = this.rowData.filter((obj: any) => obj.planningYear == event.value);
      this.gridApi.setRowData(this.rowData);
    }
  }

  onCellClicked(params: any): void {
    if (params.column.colId === 'poPlanningId') {
      this.router.navigate(['planning/po-details'],{queryParams:{id:params.data.organizationUnitId, year : params.data.planningYear, orgLevel: params.data.planningOrgLevel, companyShortName:params.data.companyShortName, companyId: params.data.companyId, planningLevel: params.data.planningLevel,AnnualPlanningId: params.data.aopPlanningCode}});
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
          this.columnDefs[x].hide = false;
        }
      }
    }
    this.activeColumns = this.columnDefs.filter(
      (x: any) => x.field && x.hide == false
    );
    this.selectedColumns = this.activeColumns.map(
      (element: any) => element.field
    );
    this.gridApi.setColumnDefs(this.columnDefs);
  }

  resetAllColumnsInConfig() {
    for (var x = 0; x < this.columnDefs.length; x++) {
      if (this.columnDefs[x].hide === true) this.columnDefs[x].hide = false;
    }
    this.gridApi.setColumnDefs(this.columnDefs);
  }

  actionCellRenderer_2st_level_Planning(params: any) {
    var currentRowData = params.data;
    var currentStatus = currentRowData.status;
    if (currentStatus == 'Completed') {
      return (
        `<div style="display:flex; align-items:center">` +
        '<span style="display:flex;align-items:center;color: #007bc0"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>' +
        `</div>`
      );
    } else if (currentStatus == 'Consolidated') {
      return (
        `<div style="display:flex; align-items:center">` +
        '<span style="display:flex;align-items:center;color: #007bc0"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>&nbsp' +
        `</div>`
      );
    } else if (currentStatus == 'Approved') {
      return (
        `<div style="display:flex; align-items:center">` +
        '<span style="display:flex;align-items:center;color: #007bc0"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>&nbsp' +
        `</div>`
      );
    } else if (currentStatus == 'Rejected') {
      return (
        `<div style="display:flex; align-items:center">` +
        '<span style="display:flex;align-items:center;color: #007bc0"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>&nbsp' +
        `</div>`
      );
    } else if (currentStatus == 'AOP Created') {
      return (
        `<div style="display:flex; align-items:center">` +
        '<span style="display:flex;align-items:center;color: #007bc0"><mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true" style="color:#004975," title="Edit">edit</mat-icon></span>&nbsp' +
        `</div>`
      );
    } else {
      return '';
    }
  }
  customNumberFormatter(params: any) {
    return '<span class="pagination-page">' + params.value + '</span>';
  }
  toggleDropdown() {
    this.toggle('');
    this.dropdownVisible = !this.dropdownVisible;
    if (!this.dropdownVisible) {
    }
  }  
  closeDropdown(){
    this.dropdownVisible = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      !(
        event.target instanceof HTMLElement &&
        event.target.closest('.multiSelectDropDownSearch')
      )
    ) {
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

  onSearch() {
    const filteredData = this.rowData.filter((row: any) =>
      Object.values(row).some((value: any) => {
        if (
          value !== null &&
          (typeof value === 'string' || typeof value === 'number')
        ) {
          const lowerCaseValue = String(value).toLowerCase();
          const lowerCaseSearchText = this.searchText.toLowerCase();
          return lowerCaseValue.includes(lowerCaseSearchText);
        }
        return false;
      })
    );

    this.gridApi.setRowData(filteredData);
  }


  ngOnChanges(changes: SimpleChanges): void {
    if('selectedTab' in changes && changes.selectedTab.currentValue == this.CURRENT_TAB_INDEX){
      this.getPoList();
    } 
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
        .saveColSettings(46,this.selectedColumns)
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
  // Filter chips
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
    menuid: 46,
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
   // return (item.charAt(0).toUpperCase() + item.slice(1)).replace(/(\B[A-Z])/g, ' $1').replace('Ntid','NT ID').replace('I D','ID').replace('Enddate','End date').replace('Bu','BU').replace('Jd','JD').replace('Personnel Subarea','Personnel Subarea BGS').replace('Contract End','Contract End(SOW JD)')
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
        menuid: 46,
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
      menuid: 46,
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
      menuid: 46,
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
