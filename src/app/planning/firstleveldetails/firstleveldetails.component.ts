import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ColDef, ColumnApi, GridApi, GridOptions, GridReadyEvent, IDetailCellRendererParams } from 'ag-grid-community';
import { PlanningListService } from '../services/planning-list.service';
import { PlaningService } from '../services/planing.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationpopupComponent } from '../popups/confirmationpopup/confirmationpopup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import {DatePipe } from '@angular/common';
import { CancelFlpComponent } from '../popups/cancel-flp/cancel-flp.component';
import { HostListener } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { UserProfile } from 'src/app/model/user-profile';
import { userProfileDetails } from 'src/app/common/user-profile/user-profile';
import { HomeService } from 'src/app/services/home.service';
import { StorageQuery } from 'src/app/common/storage-service/storage-service';
import { OwnershipComponent } from '../popups/ownership/ownership.component';
import { LoaderService } from 'src/app/services/loader.service';
import { NumericFormatPipe } from 'src/app/common/numeric-format-pipe/numeric-format-pipe';
import { CurrencyPipe } from 'src/app/common/currency-pipe/currency.pipe';

@Component({
  selector: 'app-firstleveldetails',
  templateUrl: './firstleveldetails.component.html',
  styleUrls: ['./firstleveldetails.component.css'],
  providers:[DatePipe,CurrencyPipe,NumericFormatPipe]
})
export class FirstleveldetailsComponent {
  queryParamValue: string | null="";
  private gridApi!: GridApi;
  private gridApi_Remarks!: GridApi;
  isGridAPIReady: boolean = true;
  data:any;
  aopPlanningData:any;
  receivedData:any;
  selectedOption=2023;
  public gridOptions: GridOptions = {};
  public FirstLevelId :any;
  public dataGrid :any = []
  public metadata : any;
  public showLoading = false;
  public apiResponse :any = [];
  selectedRowGroups: string[] = [];
  stayScrolledToEnd = true;
  public EventFile : any;
  public base64Output :any;
  public File :any = [];
  remarks:any;
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
  remarksList: any[] = [];
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
  columnDefs_1st = [
    { 
      headerName: 'Second Level Planning ID', 
      field: 'planningId' ,
      minWidth:280,
      resizable:true,
      colId: 'code',
      cellRenderer: this.SecondlevelLink,

    },
    { 
      headerName: 'Org Unit', 
      field: 'orgUnit' ,
      resizable:true,

    },
    { 
      headerName: 'Activity SPOC', 
      field: 'activitySPOC',
      minWidth:250,
      resizable:true  
    },
    {
      headerName: 'Initial Capacity',
       field: 'totalInitialCapacity' ,
       minWidth:200,
       resizable:true ,
       cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.totalInitialCapacity,
          this.companyLocale,
          this.companyNumericFormat
        ), 
    },    
    { 
        headerName: 'End capacity',
         field: 'totalEndCapacity' ,
         minWidth:200,
         resizable:true,
         cellRenderer: (params: any) =>
          this.numericFormatPipe.transform(
            params.data.totalEndCapacity,
            this.companyLocale,
            this.companyNumericFormat
          ),  
    },
    { 
      headerName: 'Equivalent Capacity',
       field: 'totalCapacity' ,
       minWidth:200,
       resizable:true,
       cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.totalCapacity,
          this.companyLocale,
          this.companyNumericFormat
        ), 
      },
    { 
      headerName: 'Projected PO', 
      field: 'totalPO',
      minWidth:200,
      resizable:true ,
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.totalPO,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    { 
      headerName: 'Projected Revenue', 
      field: 'totalRevenue',
      minWidth:200,
      resizable:true,
      cellRenderer: (params: any) =>
        this.currencyPipe.transform(
          params.data.totalRevenue,
          this.companyCurrencyName,
          this.companyLocale
        ),
    },
    { 
      headerName: 'Currency', 
      field: 'currency',
      minWidth:150,
      resizable:true 
    },
    { 
      headerName: 'Status', 
      field: 'status',
      minWidth:150,
      resizable:true 
    },
  ];
  rowData_1st = [
  ];
  
  public rowData: any = [ 
  ];

  public columnDefs: ColDef[] = [
    { 
      headerName: 'SkillSet',
      field: 'skillset' , 
      cellRenderer: 'agGroupCellRenderer'},
    { 
      headerName: 'Grade',
      field: 'grade',
      minWidth:80,
      resizable:true 
    },
    { 
      headerName: 'Location Mode',
      field: 'locationMode',
      minWidth:80,
      resizable:true
    },
    { 
      headerName: 'Location',
      field: 'location',
      minWidth:80,
      resizable:true
    },
    { 
      headerName: 'Vendor',
      field: 'vendor',
      minWidth:320,
      resizable:true
    },
    { 
      headerName: 'GB',
      field: 'gb',
      minWidth:80,
      resizable:true
    },
    { 
      headerName: 'Skillset Type',
      field: 'skillsetType',
      minWidth:180,
      resizable:true
    },
    { 
      headerName: 'Initial Capacity',
      field: 'ending_Number',
      minWidth:180,
      resizable:true,
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.ending_Number,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    {
      headerName: 'End Capacity',
      field:'endCapacity',
      minWidth:180,
      resizable:true,
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.endCapacity,
          this.companyLocale,
          this.companyNumericFormat
        ),
    },
    { 
      headerName: 'Equivalent Capacity',
      field: 'equivalent_Capacity',
      minWidth:180,
      resizable:true,
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.equivalent_Capacity,
          this.companyLocale,
          this.companyNumericFormat
        ), 
    },
    { 
      headerName: 'Projected PO',
      field: 'projected_PO' ,
      minWidth:180,
      resizable:true,
      cellRenderer: (params: any) =>
        this.numericFormatPipe.transform(
          params.data.projected_PO,
          this.companyLocale,
          this.companyNumericFormat
        ), 
    },
    { 
      headerName: 'Projected Revenue',
      field: 'projected_Revenue' ,
      minWidth:180,
      resizable:true,
      cellRenderer: (params: any) =>{
        this.currencyPipe.transform(
          params.data.projected_Revenue,
          this.companyCurrencyName,
          this.companyLocale
        )
      }
     
    },
  ];
  permissionDetails :any ;
  permissionDetailsSecondLevel :any ;
  employnumber :number;
  ownerEno : number;
  
  public groupDefaultExpanded = 0
  public detailRowHeight= 240 ;
  detailCellRendererParams:any={
  
        // level 3 grid options
        detailGridOptions: {
          columnDefs: [
          
            { 
              headerName: 'Group',
              field: 'group', 
              resizable: true,
              hide:false,
              suppressMenu: true},
            { 
              headerName: 'SL No.',
              field:'SerialNo',
              hide:true
            },
            { 
              headerName: 'Jan',
              field: "jan",
              minWidth:80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
            },
            { 
              headerName: 'Feb',
              field: "feb", 
              minWidth: 80,
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
            },
            { 
              headerName: 'Mar',
              field: "mar", 
              minWidth: 80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
            },
            { 
              headerName: 'Apr',
              field: "apr",
               minWidth: 80,
               resizable:true ,
              enableFilter:false,
              suppressMenu: true
            },
            { 
              headerName: 'May',
              field: "may",
              minWidth: 80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
               },
            { 
              headerName: 'Jun',
              field: "jun", 
              minWidth: 80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
               },
            { 
              headerName: 'Jul',
              field: "jul",
              minWidth: 80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
             },
            { 
              headerName: 'Aug',
              field: "aug",
              minWidth: 80,
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
              },
            { 
              headerName: 'Sep',
              field: "sep", 
              minWidth: 80,
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
               },
            { 
              headerName: 'Oct',
              field: "oct", 
              minWidth: 80,
              resizable:true ,
              enableFilter:false,
              suppressMenu: true 
               },
            { 
              headerName: 'Nov',
              field: "nov", 
              minWidth: 80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
              },
            { 
              headerName: 'Dec',
              field: "dec", 
              minWidth: 80, 
              resizable:true ,
              enableFilter:false,
              suppressMenu: true
             },
            
          ],  
          defaultColDef: {
            flex: 1,
            minWidth: 170,
          },
          detailRowHeight: 155,
     
        },

        getDetailRowData: (params:any) => {
          params.successCallback(params.data.children);
        },
      } as IDetailCellRendererParams;


  // AUTH
  featureDetails : any ;  
  userProfileDetails : userProfileDetails | any ;
  osmRole : boolean = false;;
  osmRoleAdmin : boolean = false;
  paginationPageSize: number = 5;
  columnApi: any;
  companyCurrencyName: string;
  companyLocale: string;
  companyNumericFormat: string;
  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private planningListService: PlanningListService,
    private planningService :PlaningService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private homeService: HomeService,
    private loaderService: LoaderService,
    private currencyPipe: CurrencyPipe,
    private numericFormatPipe: NumericFormatPipe) {
      this.checkUserProfileValueValid();
      this.route.queryParams.subscribe((query: any) => {
        this.FirstLevelId = query.id;
      });
    }
    adjustWidth() {
      const allColumnIds: any = [];
      this.columnApi?.getColumns()?.forEach((column: any) => {
        allColumnIds.push(column.getId());
      });
  
      this.columnApi?.autoSizeColumns(allColumnIds, false);
    } 
    @HostListener('window:popstate', ['$event'])
    onPopState(event:any) {
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
    goBackToPlanning(){
      this.router.navigate(['/planning']);
    }
         // FLP Cycle AUTH functions
         getProfileRoles() {
           this.loaderService.setShowLoading();
         this.homeService.getProfileRoles()
         .subscribe({
           next: (response:any) => {
             this.userProfileDetails = response.data;
             this.employnumber = this.userProfileDetails.employeeNumber;
             for(let role of this.userProfileDetails.roleDetail[0].roleDetails){
              if(role.roleName.toLowerCase() == "osm"){
                this.osmRole = true;
              }
              if(role.roleName.toLowerCase().startsWith("osm admin")){
                this.osmRoleAdmin = true;
              }
            }
             
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
               "exportPermission": false,
               "ownershipChangePermission":false
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
               for(let item of plan){
                 if(item.featureCode.toLowerCase() == "firstlevelplanning"){
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
           },
           complete: () => {
             this.loaderService.setDisableLoading();
           }
       });
       }
        checkUserProfileValueValid(){
          this.loaderService.setShowLoading();
          this.planningService.profileDetails = StorageQuery.getUserProfile();
          if(this.planningService.profileDetails == '' || this.planningService.profileDetails == undefined) {
            this.getProfileRoles();
          }
          else {
            this.userProfileDetails = this.planningService.profileDetails;
            this.employnumber = this.userProfileDetails.employeeNumber;
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
              "exportPermission": false,
              "ownershipChangePermission":false
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
              for(let item of plan){
                if(item.featureCode.toLowerCase() == "firstlevelplanning"){
                  for (const permission in this.permissionDetails) {
                    if(item.permissionDetails[0].hasOwnProperty(permission) && item.permissionDetails[0][permission] == true){
                      this.permissionDetails[permission] = true;
                    }
                  }
                } 
              }     
            }  
          }
          this.loaderService.setDisableLoading();
         }

  
  ngOnInit(): void {
      this.loaderService.setShowLoading();
      this.getFirstLevelDetails()
    this.aopPlanningData = this.planningListService.getAopPlanning();
  }
  SecondlevelLink(params: any) {
    if(params.data.readPermission){
      return (
        "<span class='planning_code'>" + params.data.planningId + "</span>"
        );
    }else{
      return (
        "<span>" + params.data.planningId + "</span>"
        );
    }

  }

  
onRowGroupOpened(event: any) {
  if (event.node.expanded) {    
    // Collapse the previously expanded group, if any
    this.selectedRowGroups.forEach((groupName) => {
      if (groupName !== event.rowIndex) {
        const node = this.gridApi.getRowNode(groupName);
        if (node) {
          node.setExpanded(false);
        }
      }
    });

    // Update the currently expanded group
    this.selectedRowGroups = [event.node.rowIndex];
  } else {
    // Remove the collapsed group from the tracking list
    const index = this.selectedRowGroups.indexOf(event.node.rowIndex);
    if (index !== -1) {
      this.selectedRowGroups.splice(index, 1);
    }
  }
}
  onPanelOpened() {
     this.loaderService.setShowLoading();
    const staticdata :any = {}
      staticdata["aopFlId"] = this.metadata.aopFlId, 
    this.planningService.getRemarks(staticdata).subscribe({
      next: (res:any) => {
        this.loaderService.setDisableLoading();
        this.remarksList = res.data;
      
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => {
      }
    });

  }
  getFirstLevelDetails(){
    this.loaderService.setShowLoading();
    this.planningService.GetFirstLevelDetails(this.FirstLevelId).subscribe({
      next: (res:any) => {
        this.companyCurrencyName = res?.data?.metadata?.currency;
        let currencyObj = this.loaderService.getCountryDetailByCurrency(
          this.companyCurrencyName
        );
        this.companyLocale = currencyObj.locale;
        this.companyNumericFormat = currencyObj.numericFormat;
        res.data.metadata["duedays"] = this.calculateDiff(res.data.metadata.startDate,res.data.metadata.endDate);
        res.data.metadata.startDate = this.datePipe.transform(res.data.metadata.startDate, 'dd-MMM-yyyy');
        res.data.metadata.endDate = this.datePipe.transform(res.data.metadata.endDate, 'dd-MMM-yyyy');
        this.apiResponse = res.data;
        this.rowData = res.data.dataGrid;
        this.metadata = res.data.metadata;
        this.ownerEno = parseInt(this.metadata.ownerEno);
        for(let item of res.data.secondLevelGrid){
          if(this.permissionDetails.readPermission == true){
            item.readPermission = true;
           }else{
            item.readPermission = false;
           }
        }
        this.rowData_1st = res.data.secondLevelGrid;
        this.rowData.forEach((obj:any)=>{
          for(let item of obj.children){
            for(let month of this.Monthlist){
              if(item.group == "Projected Revenue"){
                item[month.mon] = this.currencyPipe.transform(item[month.mon],this.companyCurrencyName,this.companyLocale);
              }else{
                item[month.mon] =  this.numericFormatPipe.transform(item[month.mon],this.companyLocale,this.companyNumericFormat)
              }
            }

          }
        })
        this.loaderService.setDisableLoading();
        setTimeout(() => {
          this.adjustWidth();
        }, 5); 
      },
      error: (e:any) => {
        this.loaderService.setDisableLoading();
      },
      complete: () => { 
        this.loaderService.setDisableLoading();
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
downloadTemplate(featureCode:string) {
  var griddata = {}
  griddata["featureCode"] = featureCode;
  griddata["id"] = this.metadata.aopFlId
    this.loaderService.setShowLoading();
   this.planningService.ExportGrid(griddata)
     .subscribe({
       next:(response: any) => {
         let receivedBase64String = '';
         let filename = '';         
         filename = response.data.fileName;
         receivedBase64String = response.data.fileBase64;
 
         const link = document.createElement('a');
         link.href =
           'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
           receivedBase64String;
         link.download = filename;
         link.click();
         this.loaderService.setDisableLoading();
       },error:(error) => {
         this.loaderService.setDisableLoading();
       }
   });
 }
  onCellClicked_1st_detail(params:any):void{
    if(params.column.colId === "code" && params.event.target.className == "planning_code"){
      this.planningListService.aopplanninglist(params.data);
      this.router.navigate(['planning/second-level-details'],{queryParams:{id:params.data.id}})
    } 
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
  }     
  onFirstDataRendered(event: any) {
    this.adjustWidth();
  }
  onGridReady_1st(params:any) {
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
  }
  onGridReady_Remarks(params:any) {
    this.gridApi_Remarks = params.api;
  }
  customEditableFunction(params: any): boolean {
    return params.node.rowIndex === 1;
  }
  onCellValueChanged(params: any) {
    const { node, colDef, newValue, oldValue } = params;
    const SelectedMonth=params.colDef.field;
    const rowData :any = [];
    this.gridApi.forEachNode((node)=>{
    rowData.push(node.data);
    });   
    for(const level1 of rowData)
    {
      for(const level2 of level1.children)
      {
        let index=0;
        for(const level3 of level2.children )
        {
          index++;
          if(index!==1){
            level3[SelectedMonth]=newValue*10;
          }
        }
      }
    }
    
    this.gridOptions.api?.setRowData(rowData)
    return;
  }
  onremarks(event :any){
    this.remarks = event.target.value
  }
  Confirmation(title:string){
    const dialogRef = this.dialog.open(ConfirmationpopupComponent, {
      width: '30%',
      data: { title: title },
      panelClass: 'scrollable-dialog',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if(result == true){
        if(title == 'Cancel'){
          const CreateAOP :any = {};
          CreateAOP["id"] = this.FirstLevelId;
          CreateAOP["status"]= 'Cancelled';
          CreateAOP["remark"]= this.remarks;
          this.planningService.updateaopfl(CreateAOP).subscribe({
            next: (res:any) => {
              if(res.status == "failed"){
                this.showSnackbar(res.data)
              }else if(res.status == "success"){
                this.showSnackbar("First Level Planning Cancelled");
              }
            },
          });
        }
      }
    });
  }
  openWithdrawPlanning(status:any) {
    var data : any = [] ;
    if(this.aopPlanningData.length == 0){
       data = this.metadata ;
      data["id"] = this.FirstLevelId;
    }else{
      data["id"] = this.FirstLevelId;
      data  = this.aopPlanningData;
    }
    const dialogRef = this.dialog.open(CancelFlpComponent,{
      width: '50%',
      data: {message: data,status:status},
      panelClass: 'scrollable-dialog'
    });
 
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted) {
         this.loaderService.setShowLoading();
        this.getFirstLevelDetails();      
      }
    });
  }

  uploadFile(event: any) {
    this.EventFile = event.target.files[0];
    this.convertFile(this.EventFile).subscribe((base64 :any) => {
      this.base64Output = base64;
      this.File.push({
        file: this.base64Output,
      })
    })
  }
  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event: any) =>
      result.next(btoa(event.target.result.toString()));
    return result;
  }
  showSnackbar(content: string) {
    this.snackBar.open(content, undefined, { duration: 5000 });
  }

  getStatusColor(status: string): string {
    if (status === 'Submitted') {
      return 'green';
    } else if (status === 'Rejected') {
      return 'red';
    } else if (status === 'Approved') {
      return 'green';
    } else if (status === 'Cancelled') {
      return '#f5c77e';
    }else if (status === 'Delegated' || status === 'Delegate') {
      return '#0061cf';
    }
    return ''; // Default color
  }
  OpenOwnershipDialog(featureCode:string){
    const dialogRef = this.dialog.open(OwnershipComponent,{
      width: '50%',
      data: {objectId:this.metadata.aopFlId,featureCode:featureCode},
      panelClass: 'scrollable-dialog'
    });
  
    dialogRef.componentInstance.isFromSubmitted.subscribe((isFormSubmitted: boolean) => {
      if (isFormSubmitted) {
         this.loaderService.setShowLoading();
        this.getFirstLevelDetails();
      }
    });

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