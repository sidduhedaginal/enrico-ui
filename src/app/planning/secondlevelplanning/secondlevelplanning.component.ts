import { Component, SimpleChanges,Input, HostListener } from '@angular/core';
import { ColDef, GridApi, GridOptions } from 'ag-grid-community';
import { PlanningListService } from '../services/planning-list.service';
import { Router } from '@angular/router';
import { PlaningService } from '../services/planing.service';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationpopupComponent } from '../popups/confirmationpopup/confirmationpopup.component';
import { MatDialog } from '@angular/material/dialog';
import { CancelSLPComponent } from '../popups/cancel-slp/cancel-slp.component';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { HomeService } from 'src/app/services/home.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-secondlevelplanning',
  templateUrl: './secondlevelplanning.component.html',
  styleUrls: ['./secondlevelplanning.component.css'],
  providers:[DatePipe]
})
export class SecondlevelplanningComponent {
  public showLoading = false;
  @Input() selectedTab : number;
  CURRENT_TAB_INDEX :number;
  searchText = ""; 
  searchUnit = "";
  gridOptions: GridOptions = {
    domLayout: 'autoHeight',
  };
  private gridApi!: GridApi;
  stayScrolledToEnd = true;
  selectedPlannedYear :any = "All";
  selectedOption :any ="All" ;
  selectedBU : any = "All";
  selectedSection:any = "All"
  selectedOrgLevel: string = '';
  filteredMSBE: string[] = ['MSBE1', 'MSBE2', 'MSBE3', 'MSBE4'];
  selectedMSBE: string[] = [];
  public enableUnit : boolean = true;
  public style: any = {
    width: '100%',
    height: '100%',
    flex: '1 1 auto',
    'margin-top': '5px',
  };
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
  PlanningYearList :any = 
  [
    new Date().getFullYear() - 2,
    new Date().getFullYear() - 1,
    new Date().getFullYear(),
    new Date().getFullYear() + 1,
    new Date().getFullYear() + 2
  ];
  private gridApi1stLevelPlanning!: GridApi; 

  gridData: any;
  rowData :any = [];
  SectionList:any = [];
  selectedColumnNumber = 0;
  dropdownVisible = false;
  filteredData = [];
  isGridAPIReady : boolean = true;
  public colDefs: any = [];
  public columnDefs_2nd_level_Planning :any = [];
  Roles : any;
  permissionDetails :any ;
  Employnumber :number;
      // AUTH
      PlanningRolesDetails : any;
      PlanningFeatureDetails : any ;
      userProfile: UserProfile | any;
      featureDetails : any ;  
      userProfileDetails : userProfileDetails | any ;
      osmRole : boolean = false;
      osmRoleAdmin : boolean = false;
            // selected Master Permission  details
  selectedMasterAccessRoles : any;
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


  constructor(private planningListService: PlanningListService,private router: Router,
    private planningService:PlaningService,private datePipe: DatePipe,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private homeService: HomeService,
    private loaderService: LoaderService,){
      let todayDate = new Date();
      this.ExportDate = this.datePipe.transform(todayDate , 'dd-MMM-yyyy');
      this.currenttabindex = localStorage.getItem('transactionTabIndex');
      this.checkUserProfileValueValid();
    }
               // SecondLevel Cycle AUTH functions
               getProfileRoles() {
                //  this.loaderService.setShowLoading();
               this.homeService.getProfileRoles()
               .subscribe({
                 next: (response:any) => {
                   this.userProfileDetails = response.data;
                   this.planningService.profileDetails = response.data;
                   this.Employnumber = this.userProfileDetails.employeeNumber;
                   for(let role of this.userProfileDetails.roleDetail[0].roleDetails){
                    if(role.roleName.toLowerCase() == "osm"){
                      this.osmRole = true;
                    }
                    if(role.roleName.toLowerCase().startsWith("osm admin")){
                      this.osmRoleAdmin = true;
                    }
                  }
                   StorageQuery.setUserProfile(JSON.stringify(this.userProfileDetails));
                   const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning"));
                   const masterDataFeatureDetails = masterDataModules.map((item:any) => {
                     const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
                     return masterDataModule.featureDetails;
                   });
               
                   this.featureDetails = masterDataFeatureDetails;
                   this.selectedMasterAccessRoles = {
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
                     this.CURRENT_TAB_INDEX = plan.findIndex((x:any) => x.featureCode.toLowerCase() === "secondlevelplanning");
                     if(parseInt(this.currenttabindex) == this.CURRENT_TAB_INDEX){
                       this.getaopsls();
                     }
                     if(plan[0].featureCode.toLowerCase() == "secondlevelplanning"){
                       this.getaopsls();
                     }
                     else{
                       this.loaderService.setDisableLoading();
                     }
                     for(let item of plan){
                     
                       if(item.featureCode.toLowerCase() == "secondlevelplanning"){
                         for (const permission in this.selectedMasterAccessRoles) {
                           if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                             this.selectedMasterAccessRoles[permission] = true;
                           }
                         }
                       }
                     }     
                   } 
            
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
                  this.Employnumber = this.userProfileDetails.employeeNumber;
                  for(let role of this.userProfileDetails.roleDetail[0].roleDetails){
                    if(role.roleName.toLowerCase() == "osm"){
                      this.osmRole = true;
                    }
                    if(role.roleName.toLowerCase().startsWith("osm admin")){
                      this.osmRoleAdmin = true;
                    }
                  }
                  const masterDataModules = this.userProfileDetails.roleDetail[0].roleDetails.filter((item :any)=> item.moduleDetails.some((module:any) => module.moduleName === "Planning"));                   
                  const masterDataFeatureDetails = masterDataModules.map((item:any) => {
                    const masterDataModule = item.moduleDetails.find((module:any) => module.moduleName === "Planning");
                    return masterDataModule.featureDetails;
                  });
                  this.featureDetails = masterDataFeatureDetails;
                  this.selectedMasterAccessRoles = {
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
                    this.CURRENT_TAB_INDEX = plan.findIndex((x:any) => x.featureCode.toLowerCase() === "secondlevelplanning");
                    if(parseInt(this.currenttabindex) == this.CURRENT_TAB_INDEX){
                      this.getaopsls();
                    }
                    if(plan[0].featureCode.toLowerCase() == "secondlevelplanning"){
                      this.getaopsls();
                    }
                    else{
                      this.loaderService.setDisableLoading();
                    }
                    for(let item of plan){
                    
                      if(item.featureCode.toLowerCase() == "secondlevelplanning"){
                        for (const permission in this.selectedMasterAccessRoles) {
                          if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                            this.selectedMasterAccessRoles[permission] = true;
                          }
                        }
                      }
                    }     
                  }  
                }
              } 
              onFirstDataRendered(event: any) {
                this.adjustWidth();
                this.planningService.getColFilters(47).subscribe({
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
              this.planningService.getdeafultcolmuns(47)
                .subscribe((item: any) => {
                  this.savedColumns = item.data;
                  if (this.savedColumns) {
                    let savedColumnsArray = this.savedColumns.split(',');
          
                    this.columnDefs_2nd_level_Planning.forEach((element, index) => {
                      if (element.field) {
                        let selectedColumnName = savedColumnsArray.find(
                          (item: any) => item === element.field
                        );
                        if (selectedColumnName) {
                          this.columnDefs_2nd_level_Planning[index].hide = false;
                        } else {
                          this.columnDefs_2nd_level_Planning[index].hide = true;
                        }
                      }
                    });
                    this.gridApi?.setColumnDefs(this.columnDefs_2nd_level_Planning);
                  }
                });
            }
  getaopsls(){
    this.getdeafultcolmuns();
     this.loaderService.setShowLoading();
    this.planningService.getaopsls().subscribe({
      next: (res:any) => {
        if(res.data){
        
          this.gridData = res;
          for(let item of this.gridData.data){
            if( item.slPlanningCode != null){
              item.slPlanningCode = item.slPlanningCode.toUpperCase();
            }
            if(item.cfCycleName != null){
              item.cfCycleName = item.cfCycleName.toUpperCase();
            }
            if(item.organizationUnitName != null){
              item.organizationUnitName = item.organizationUnitName.toUpperCase();
            }
            if(item.flPlanningCode != null){
              item.flPlanningCode = item.flPlanningCode.toUpperCase();
            }
            if(item.aopPlanningCode != null){
              item.aopPlanningCode = item.aopPlanningCode.toUpperCase();
            }
             if(this.selectedMasterAccessRoles.readPermission == true){
              item.readPermission = true;
             }else{
              item.readPermission = false;
             }
            item["duedays"] = this.calculateDiff(item.planningStartDate,item.planningEndate);
            item.planningStartDate = this.datePipe.transform(item.planningStartDate, 'dd-MMM-yyyy');
            item.planningEndDate = this.datePipe.transform(item.planningEndDate, 'dd-MMM-yyyy');
            item.modifiedOn = this.datePipe.transform(item.modifiedOn, 'dd-MMM-yyyy');
            item.createdOn = this.datePipe.transform(item.createdOn, 'dd-MMM-yyyy');
          }
          this.rowData = this.gridData.data;
          this.gridApi.setRowData(this.rowData);
          this.loaderService.setDisableLoading();
        }else if(res.status == "failed"){
          this.loaderService.setDisableLoading();
          this.showSnackbar(res.data)
        }
        else{
          this.loaderService.setDisableLoading();
        }

      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });

  }  
  calculateDiff(startdate:any,enddate:any){
    let todayDate = new Date();
    let sentOnDate = new Date(enddate);
    sentOnDate.setDate(sentOnDate.getDate());
    let differenceInTime = todayDate.getTime() - sentOnDate.getTime();
    // To calculate the no. of days between two dates
    let differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); 
    return differenceInDays;
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
  onGridReady_2nd_level_Planning(params:any) {
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
    this.columnDefs_2nd_level_Planning = [
      { 
        headerName: 'Second Level Planning ID',
        field:'slPlanningCode',
        colId: 'code',
        hide: false,
        cellRenderer: this.SecondlevelLink,
        minWidth:250,
        resizable: true,
        pinned: 'left',
        disable: true,
        enableFilter:false,
        suppressMenu: true,
        suppressDragLeaveHidesColumns: false,
        suppressMovable:true
      },
      {
        headerName : "Planning Org",
        field:'organizationUnitName',
        hide: false,
        resizable: true,
      },
    
      { 
        headerName: 'First Level Planning ID',
        field:'flPlanningCode',
        hide: false,
        resizable: true,        
        minWidth:280,
      },
      { 
        headerName: 'AOP ID',
        field:'aopPlanningCode',
        hide: false,
        resizable: true,
        minWidth:210,
      },
      { 
        headerName: 'CF Cycle', 
        field: 'cfCycleName',
        hide: true,
        resizable: true,
      },
      { 
        headerName: 'Year',
        field:'cfCycleYear',
        hide: false,
        resizable: true,
        width:100 
      },
      { 
        headerName: ' Starting Month', 
        field: 'cfCyclePlanningMonth',
        hide: false,
        resizable: true,
        width:100 
      },
      { 
        headerName: 'Planning Start Date', 
        field: 'planningStartDate',
        hide: false,
        resizable: true,
      },
      { 
        headerName: 'Planning End Date', 
        field: 'planningEndDate',
        hide: false,
        resizable: true,
      },  
       {
        headerName: 'Owner',
        hide: true,
        editable: false,
        field: 'ownerName',
        resizable: true,
        minWidth:250
      },
      { 
        headerName: 'Approver Name', 
        field: 'finalApprovalFullName',
        hide: false,
        resizable: true,
        minWidth:250
      },
      { 
        headerName: 'Approver NTID', 
        field: 'finalApprovalNtid',
        hide: false,
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
        field: 'companyShortName',
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
        
      }
      
    ];
      this.columnDefs_2nd_level_Planning.push(
        { 
          headerName: 'Status', 
          field: 'status',
          hide: false,
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
    this.gridApi.setColumnDefs(this.columnDefs_2nd_level_Planning);
    this.gridApi.hideOverlay();
    this.adjustWidth();
  }
 
  onCellClicked_2nd_level_Planning( params:any): void {
     if(params.column.colId === "action" && params.event.target.className == "withdraw_planning"){
      this.openWithdrawPlanning(params.data,'Cancelled');
    }
    else if(params.column.colId === "action" && params.event.target.className == "submit"){
      this.openWithdrawPlanning(params.data,'Submitted');
    }
    else  if(params.column.colId === "code" && params.event.target.className == "planning_code"){
      this.planningListService.aopplanninglist(params.data);
      this.router.navigate(['planning/second-level-details'],{queryParams:{id:params.data.id}})
    } 
  }

  SecondlevelLink(params: any) {
    if(params.data.readPermission){
      return (
        "<span class='planning_code'>" + params.data.slPlanningCode + "</span>"
        );
    }else{
      return (
        "<span>" + params.data.slPlanningCode + "</span>"
        );
    }
     
  }
  renderActionIconsForMaster(params: any){
    let iconsHTML = '<div class="icon-class">';
    const actionIconsWithSubmit: { [key: string]: string } = {
      withdrawPermission:'<span class="withdraw_planning" title="Withdraw">&nbsp;</span>&nbsp;&nbsp;'
    };
    

    const actionIconsWithOutSubmit: { [key: string]: string } = {
      editPermission : '<span class="blue-edit_planning" title="Edit">&nbsp;</span>&nbsp;&nbsp;',
    };

    if(params.data.status != 'Cancelled' && params.data.duedays <= 0){
      for (const permission in actionIconsWithSubmit) {
        if (this.selectedMasterAccessRoles.hasOwnProperty(permission) && this.selectedMasterAccessRoles[permission] == true) {
          if(permission == "withdrawPermission"){
            if(parseInt(params.data.finalApprovalActivitySPOCId) == this.Employnumber){
              iconsHTML +=  actionIconsWithSubmit[permission]; 
            }
          }
        }
      }

    }
    iconsHTML += '</div>';
    return iconsHTML;

  }
  openWithdrawPlanning(payload:any,status:any) {
    const dialogRef = this.dialog.open(CancelSLPComponent,{
      width: '50%',
      data: {message: payload,status:status},
      panelClass: 'scrollable-dialog'
    });

    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted) {
         this.loaderService.setShowLoading();
        this.getaopsls();      
      }
    });
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

  filterYear(event:any){
    this.rowData = this.gridData.data;
    if(event.value == "All"){
      this.rowData = this.gridData.data;
      this.gridApi.setRowData(this.rowData);
    }else{
      this.rowData = this.rowData.filter((obj:any) => obj.cfCycleYear == event.value);
      this.gridApi.setRowData(this.rowData);
    }
  }
  filterorgLevel(event:any){
    this.SectionList = [];
    this.enableUnit = false;
    this.selectedSection = "All"
    this.selectedBU = event.value;
    this.rowData = this.gridData.data;
    if(this.selectedBU  == "All"){
      this.rowData = this.gridData.data;
      this.gridApi.setRowData(this.rowData);

    }else{
      this.loaderService.setShowLoading();
      this.rowData = this.rowData.filter((obj:any) => obj.planningOrgLevel == this.selectedBU );
      this.gridApi.setRowData(this.rowData);
      this.planningService.getFiltersBU(this.selectedBU,null).subscribe
      ({
        next: (res:any)=>{
           this.SectionList = res.data;
           this.loaderService.setDisableLoading();
         },
         error: (e:any) => {
           this.loaderService.setDisableLoading();
          },
          complete: () => {
            this.loaderService.setDisableLoading();
        }
      })
    }

  }
  onSearchUnit(event:any) {
    this.SectionList =  this.SectionList;
    if(event.data != null){
      this.filteredData = this.SectionList.filter((row: any) =>
        Object.values(row).some((value: any) => {
          if (value !== null && (typeof value === 'string' || typeof value === 'number')) {
            const lowerCaseValue = String(value).toLowerCase();
            const lowerCaseSearchText = this.searchUnit.toLowerCase();
            return lowerCaseValue.includes(lowerCaseSearchText);
          }
          return false;
        })
      );
      this.SectionList = this.filteredData;    
    }else if(event.data == null){
      this.loaderService.setShowLoading();
      this.planningService.getFiltersBU(this.selectedBU,null).subscribe
      ({
        next: (res:any)=>{
           this.SectionList = res.data;
           this.loaderService.setDisableLoading();
         },
         error: (e:any) => {
           this.loaderService.setDisableLoading();
          },
          complete: () => {
            this.loaderService.setDisableLoading();
        }
       })
    }
  
  }
  filterSection(event:any){
    this.selectedSection = event.value
    this.rowData = this.gridData.data;
    if(this.selectedSection == "All"){
      this.rowData = this.gridData.data;
      this.gridApi.setRowData(this.rowData);

    }else{
      this.rowData = this.rowData.filter((obj:any) => obj.organizationUnitId == this.selectedSection);
      this.gridApi.setRowData(this.rowData);
    }
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
    for (var x = 0; x < this.columnDefs_2nd_level_Planning.length; x++) {
      if (this.columnDefs_2nd_level_Planning[x].hide === true) count += 1;
      if (this.columnDefs_2nd_level_Planning[x].headerName == col) {
        if (this.columnDefs_2nd_level_Planning[x].hide === false) {
          this.columnDefs_2nd_level_Planning[x].hide = true;
        } else {
          this.columnDefs_2nd_level_Planning[x].hide = false;}}}
    this.gridApi.setColumnDefs(this.columnDefs_2nd_level_Planning);
    this.selectedColumnNumber = count;
    this.activeColumns = this.columnDefs_2nd_level_Planning.filter(
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
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }


  ngOnChanges(changes: SimpleChanges): void {    
    if('selectedTab' in changes && changes.selectedTab.currentValue == this.CURRENT_TAB_INDEX){
      if(this.selectedPlannedYear == "All"){
        this.getaopsls();
      }else{
        this.rowData = this.rowData.filter((obj:any) => obj.cfCycleYear == this.selectedPlannedYear);
        this.gridApi.setRowData(this.rowData);
      }
    }  else if (this.isGridAPIReady && changes['rowData']) {
      this.gridOptions.api?.setRowData(this.rowData);
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
        .saveColSettings(47,this.selectedColumns)
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
    this.columnDefs_2nd_level_Planning.forEach((element, i) => {
      if (element.headerName && element.field) {
        this.columnDefs_2nd_level_Planning[i].hide = false;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs_2nd_level_Planning);

    this.selectedColumns = this.columnDefs_2nd_level_Planning
      .filter((element: any) => !element.hide)
      .map((item) => item.field);
    this.adjustWidth();
  }
  unSelectAllColumns() {
    this.columnDefs_2nd_level_Planning.forEach((element, i) => {
       if (element.headerName && element.field && !element.disable)  {
        this.columnDefs_2nd_level_Planning[i].hide = true;
      }
    });
    this.gridApi.setColumnDefs(this.columnDefs_2nd_level_Planning);

    this.selectedColumns = [];
    this.adjustWidth();
  }
  // Filter chips
  initNext() {
    this.selectedMySubColumnNumber = this.columnDefs_2nd_level_Planning.filter(
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
    menuid: 47,
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
    var getcapVal=this.columnDefs_2nd_level_Planning.find(a=>a.field.toLowerCase()==item.toLowerCase());
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
        menuid: 47,
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
      menuid: 47,
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
      menuid: 47,
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